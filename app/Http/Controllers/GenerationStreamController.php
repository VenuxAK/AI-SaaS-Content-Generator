<?php

namespace App\Http\Controllers;

use App\Models\Generation;
use App\Services\GeminiStreamService;
use App\Services\PromptBuilderService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\StreamedResponse;

class GenerationStreamController extends Controller
{
    protected PromptBuilderService $promptBuilder;

    public function __construct(
        protected GeminiStreamService $streamService,
        ?PromptBuilderService $promptBuilder = null
    ) {
        $this->promptBuilder = $promptBuilder ?? app(PromptBuilderService::class);
    }

    /**
     * Open an SSE connection and stream tokens to the browser.
     */
    public function stream(Generation $generation): StreamedResponse
    {
        Gate::authorize('view', $generation);

        if ($generation->status !== 'pending') {
            abort(400, 'Generation is already processing or completed.');
        }

        // Update status to streaming
        $generation->update(['status' => 'streaming']);

        return response()->stream(function () use ($generation) {
            // Set execution limit for long streams
            set_time_limit(120);

            // Disable PHP output compression and buffering for real-time delivery
            if (function_exists('apache_setenv')) {
                apache_setenv('no-gzip', '1');
            }
            @ini_set('zlib.output_compression', '0');
            @ini_set('output_buffering', '0');
            @ini_set('implicit_flush', '1');

            // Clean any existing output buffers
            if (! app()->runningUnitTests()) {
                while (ob_get_level() > 0) {
                    ob_end_clean();
                }
            }

            // Emit initial 2KB SSE comment padding to immediately bypass reverse proxy buffers (Render, Cloudflare, Nginx, Envoy)
            echo ': '.str_repeat(' ', 2048)."\n\n";
            if (ob_get_level() > 0) {
                ob_flush();
            }
            flush();

            try {
                $this->streamService->stream(
                    $generation->full_prompt,
                    function (string $token) {
                        echo 'data: '.json_encode(['token' => $token])."\n\n";

                        // Check if client disconnected
                        if (connection_aborted()) {
                            throw new \RuntimeException('Connection aborted by client.');
                        }

                        if (ob_get_level() > 0) {
                            ob_flush();
                        }
                        flush();
                    },
                    function (string $fullContent) use ($generation) {
                        DB::transaction(function () use ($generation, $fullContent) {
                            $generation->update([
                                'ai_content' => $fullContent,
                                'status' => 'completed',
                            ]);
                        });
                    },
                    $generation->user
                );
            } catch (\Throwable $e) {
                Log::error("Streaming error for generation {$generation->id}: ".$e->getMessage());

                DB::transaction(function () use ($generation) {
                    $generation->update(['status' => 'failed']);
                });

                $errorMessage = $this->formatErrorMessage($e);

                echo 'data: '.json_encode(['error' => $errorMessage])."\n\n";
                if (ob_get_level() > 0) {
                    ob_flush();
                }
                flush();

                return;
            }

            echo 'data: '.json_encode(['done' => true])."\n\n";
            if (ob_get_level() > 0) {
                ob_flush();
            }
            flush();
        }, 200, [
            'Content-Type' => 'text/event-stream; charset=utf-8',
            'Cache-Control' => 'no-cache, no-store, must-revalidate, no-transform',
            'Connection' => 'keep-alive',
            'X-Accel-Buffering' => 'no',
            'X-No-Buffer' => '1',
            'Content-Encoding' => 'none',
        ]);
    }

    /**
     * Open an SSE connection and stream a humanized rewrite of the generation content.
     */
    public function humanize(Request $request, Generation $generation): StreamedResponse
    {
        Gate::authorize('view', $generation);

        $sourceContent = $generation->edited_content ?: $generation->ai_content;

        if (empty($sourceContent)) {
            abort(400, 'No generated content available to humanize.');
        }

        $preset = $request->query('preset', 'conversational');
        if (! in_array($preset, ['conversational', 'punchy', 'executive'], true)) {
            $preset = 'conversational';
        }

        $humanizerPrompt = $this->promptBuilder->buildHumanizer(
            $sourceContent,
            $generation->output_language,
            $generation->content_type,
            $preset
        );

        return response()->stream(function () use ($generation, $humanizerPrompt) {
            set_time_limit(120);

            if (function_exists('apache_setenv')) {
                apache_setenv('no-gzip', '1');
            }
            @ini_set('zlib.output_compression', '0');
            @ini_set('output_buffering', '0');
            @ini_set('implicit_flush', '1');

            if (! app()->runningUnitTests()) {
                while (ob_get_level() > 0) {
                    ob_end_clean();
                }
            }

            // Emit initial 2KB SSE comment padding to bypass reverse proxy buffers
            echo ': '.str_repeat(' ', 2048)."\n\n";
            if (ob_get_level() > 0) {
                ob_flush();
            }
            flush();

            try {
                $this->streamService->stream(
                    $humanizerPrompt,
                    function (string $token) {
                        echo 'data: '.json_encode(['token' => $token])."\n\n";

                        if (connection_aborted()) {
                            throw new \RuntimeException('Connection aborted by client.');
                        }

                        if (ob_get_level() > 0) {
                            ob_flush();
                        }
                        flush();
                    },
                    function (string $fullContent) {
                        // Streaming completed; full content is held by the client review UI
                    },
                    $generation->user
                );
            } catch (\Throwable $e) {
                Log::error("Humanizer streaming error for generation {$generation->id}: ".$e->getMessage());

                $errorMessage = $this->formatErrorMessage($e);

                echo 'data: '.json_encode(['error' => $errorMessage])."\n\n";
                if (ob_get_level() > 0) {
                    ob_flush();
                }
                flush();

                return;
            }

            echo 'data: '.json_encode(['done' => true])."\n\n";
            if (ob_get_level() > 0) {
                ob_flush();
            }
            flush();
        }, 200, [
            'Content-Type' => 'text/event-stream; charset=utf-8',
            'Cache-Control' => 'no-cache, no-store, must-revalidate, no-transform',
            'Connection' => 'keep-alive',
            'X-Accel-Buffering' => 'no',
            'X-No-Buffer' => '1',
            'Content-Encoding' => 'none',
        ]);
    }

    /**
     * Format a user-facing error message based on the exception and environment.
     * In production, returns a concise, friendly contextual error without technical exposure.
     * In development, includes contextual summary plus sanitized technical details for debugging.
     */
    public function formatErrorMessage(\Throwable $e): string
    {
        $rawMessage = $e->getMessage();
        $isProduction = app()->isProduction() || ! config('app.debug');

        // Identify the category of error based on status code or keywords
        $category = 'generic';

        if (
            str_contains($rawMessage, '503') ||
            stripos($rawMessage, 'Service Unavailable') !== false ||
            stripos($rawMessage, 'overloaded') !== false ||
            stripos($rawMessage, 'high demand') !== false
        ) {
            $category = 'overloaded';
        } elseif (
            str_contains($rawMessage, '429') ||
            stripos($rawMessage, 'RESOURCE_EXHAUSTED') !== false ||
            stripos($rawMessage, 'quota') !== false ||
            stripos($rawMessage, 'rate limit') !== false ||
            stripos($rawMessage, 'Too Many Requests') !== false
        ) {
            $category = 'quota';
        } elseif (
            str_contains($rawMessage, '401') ||
            str_contains($rawMessage, '403') ||
            stripos($rawMessage, 'API_KEY_INVALID') !== false ||
            stripos($rawMessage, 'Unauthorized') !== false ||
            stripos($rawMessage, 'Forbidden') !== false ||
            stripos($rawMessage, 'API key is not configured') !== false ||
            stripos($rawMessage, 'invalid api key') !== false
        ) {
            $category = 'auth';
        } elseif (
            str_contains($rawMessage, '404') ||
            stripos($rawMessage, 'NOT_FOUND') !== false ||
            stripos($rawMessage, 'model not found') !== false ||
            stripos($rawMessage, 'is not supported') !== false
        ) {
            $category = 'model_not_found';
        } elseif (
            stripos($rawMessage, 'timeout') !== false ||
            stripos($rawMessage, 'timed out') !== false ||
            stripos($rawMessage, 'cURL error 28') !== false
        ) {
            $category = 'timeout';
        } elseif (
            str_contains($rawMessage, '400') ||
            stripos($rawMessage, 'INVALID_ARGUMENT') !== false ||
            stripos($rawMessage, 'safety') !== false ||
            stripos($rawMessage, 'blocked') !== false
        ) {
            $category = 'invalid';
        }

        $friendlyMessages = [
            'overloaded' => 'The AI provider is temporarily experiencing high demand or service disruption (503 Service Unavailable). Please wait a moment and try again.',
            'quota' => 'AI rate limit or credit quota exceeded (429). Please check your account quota with your AI provider or try again in a few moments.',
            'auth' => 'AI authentication failed. Please verify that your API key is valid and properly configured in AI & API Keys settings.',
            'model_not_found' => 'The selected AI model is not available or not supported by your current API key. Please choose a supported model in AI & API Keys settings.',
            'timeout' => 'The request to the AI provider timed out. Please try again.',
            'invalid' => 'The generation request could not be processed. Your prompt may have triggered a provider safety filter or contains unsupported parameters.',
            'generic' => 'The AI generation request could not be completed due to an upstream provider error. Please try again shortly.',
        ];

        $friendly = $friendlyMessages[$category] ?? $friendlyMessages['generic'];

        if ($isProduction) {
            return $friendly;
        }

        // In development: Sanitize any API key from raw message to avoid key exposure in UI
        $sanitizedRaw = preg_replace('/(key|api_key|token)=([a-zA-Z0-9_\-\.]{5})[a-zA-Z0-9_\-\.]*/i', '$1=$2***[MASKED]', $rawMessage);
        $sanitizedRaw = preg_replace('/(Bearer\s+)([a-zA-Z0-9_\-\.]{5})[a-zA-Z0-9_\-\.]*/i', '$1$2***[MASKED]', $sanitizedRaw);

        return "{$friendly} [Dev Details: {$sanitizedRaw}]";
    }
}
