<?php

namespace App\Services;

use App\Models\User;
use GuzzleHttp\Client as GuzzleClient;
use Illuminate\Support\Facades\Log;

class GeminiStreamService
{
    protected ?string $apiKey;

    protected string $model;

    protected int $streamTimeout;

    public function __construct()
    {
        $this->apiKey = config('services.gemini.key');
        $this->model = config('services.gemini.model', 'gemini-2.5-flash');
        $this->streamTimeout = (int) config('services.gemini.stream_timeout', 120);
    }

    /**
     * Streams content token-by-token from Gemini, OpenAI, or OpenRouter API.
     *
     * @param  callable  $onChunk  Called with ($textChunk)
     * @param  callable  $onComplete  Called with ($fullText)
     */
    public function stream(string $prompt, callable $onChunk, callable $onComplete, ?User $user = null): void
    {
        $provider = $user ? ($user->ai_provider ?? 'gemini') : config('services.ai.provider', 'gemini');
        $apiKey = $user ? $user->getActiveApiKey() : null;
        $model = $user ? $user->getActiveModel() : null;

        if ($provider === 'openai') {
            $apiKey = $apiKey ?: config('services.openai.key');
            $model = $model ?: 'gpt-4o-mini';

            if (empty($apiKey)) {
                throw new \RuntimeException('OpenAI API key is not configured.');
            }

            $this->streamOpenAiCompatible(
                'https://api.openai.com/v1/chat/completions',
                $apiKey,
                $model,
                $prompt,
                $onChunk,
                $onComplete,
                []
            );

            return;
        }

        if ($provider === 'openrouter') {
            $apiKey = $apiKey ?: config('services.openrouter.key');
            $model = $model ?: 'google/gemini-2.5-flash';

            if (empty($apiKey)) {
                throw new \RuntimeException('OpenRouter API key is not configured.');
            }

            $this->streamOpenAiCompatible(
                'https://openrouter.ai/api/v1/chat/completions',
                $apiKey,
                $model,
                $prompt,
                $onChunk,
                $onComplete,
                [
                    'HTTP-Referer' => config('app.url', 'http://localhost:8000'),
                    'X-Title' => 'AI SaaS Content Generator',
                ]
            );

            return;
        }

        // Gemini Provider
        $apiKey = $apiKey ?: $this->apiKey;
        $model = $model ?: $this->model;

        // Normalize model aliases to official Gemini API identifiers
        $geminiAliases = [
            'gemini-3.8-flash-lite' => 'gemini-3.5-flash-lite',
            'gemini-flash-lite' => 'gemini-3.5-flash-lite',
            'gemini-flash' => 'gemini-3.8-flash',
            'gemini-pro' => 'gemini-3-pro',
        ];
        $model = $geminiAliases[$model] ?? $model;

        if (empty($apiKey)) {
            throw new \RuntimeException('Google Gemini API key is not configured.');
        }

        $url = "https://generativelanguage.googleapis.com/v1beta/models/{$model}:streamGenerateContent?key={$apiKey}&alt=sse";

        $client = new GuzzleClient([
            'timeout' => $this->streamTimeout,
            'connect_timeout' => 10,
        ]);

        try {
            $response = $client->post($url, [
                'headers' => [
                    'Content-Type' => 'application/json',
                    'Accept' => 'text/event-stream',
                ],
                'json' => [
                    'contents' => [
                        [
                            'parts' => [
                                ['text' => $prompt],
                            ],
                        ],
                    ],
                ],
                'stream' => true,
            ]);

            $body = $response->getBody();
            $buffer = '';
            $fullContent = '';

            while (! $body->eof()) {
                $read = $body->read(1024);
                $buffer .= $read;

                while (($pos = strpos($buffer, "\n")) !== false) {
                    $line = substr($buffer, 0, $pos);
                    $buffer = substr($buffer, $pos + 1);
                    $line = trim($line);

                    if (empty($line)) {
                        continue;
                    }

                    if (str_starts_with($line, 'data:')) {
                        $dataJson = trim(substr($line, 5));

                        if ($dataJson === '[DONE]' || empty($dataJson)) {
                            continue;
                        }

                        $data = json_decode($dataJson, true);

                        if ($data && isset($data['error'])) {
                            $errMsg = $data['error']['message'] ?? json_encode($data['error']);
                            throw new \RuntimeException('Gemini API Error: '.$errMsg);
                        }

                        if ($data && isset($data['candidates'][0]['content']['parts'][0]['text'])) {
                            $text = $data['candidates'][0]['content']['parts'][0]['text'];
                            $fullContent .= $text;
                            $onChunk($text);
                        }
                    }
                }
            }

            $onComplete($fullContent);
        } catch (\Throwable $e) {
            Log::error('Gemini SSE streaming failed: '.$e->getMessage());
            throw new \RuntimeException('AI streaming content failed: '.$e->getMessage(), 0, $e);
        }
    }

    /**
     * Helper to stream from any OpenAI-compatible completions endpoint.
     */
    protected function streamOpenAiCompatible(
        string $endpoint,
        string $apiKey,
        string $model,
        string $prompt,
        callable $onChunk,
        callable $onComplete,
        array $extraHeaders = []
    ): void {
        $client = new GuzzleClient([
            'timeout' => $this->streamTimeout,
            'connect_timeout' => 10,
        ]);

        $headers = array_merge([
            'Authorization' => "Bearer {$apiKey}",
            'Content-Type' => 'application/json',
            'Accept' => 'text/event-stream',
        ], $extraHeaders);

        try {
            $response = $client->post($endpoint, [
                'headers' => $headers,
                'json' => [
                    'model' => $model,
                    'messages' => [
                        ['role' => 'user', 'content' => $prompt],
                    ],
                    'temperature' => 0.7,
                    'stream' => true,
                ],
                'stream' => true,
            ]);

            $body = $response->getBody();
            $buffer = '';
            $fullContent = '';

            while (! $body->eof()) {
                $read = $body->read(1024);
                $buffer .= $read;

                while (($pos = strpos($buffer, "\n")) !== false) {
                    $line = substr($buffer, 0, $pos);
                    $buffer = substr($buffer, $pos + 1);
                    $line = trim($line);

                    if (empty($line)) {
                        continue;
                    }

                    if (str_starts_with($line, 'data:')) {
                        $dataJson = trim(substr($line, 5));

                        if ($dataJson === '[DONE]' || empty($dataJson)) {
                            continue;
                        }

                        $data = json_decode($dataJson, true);

                        if ($data && isset($data['error'])) {
                            $errMsg = $data['error']['message'] ?? json_encode($data['error']);
                            throw new \RuntimeException('API Error: '.$errMsg);
                        }

                        if ($data && isset($data['choices'][0]['delta']['content'])) {
                            $text = $data['choices'][0]['delta']['content'];
                            $fullContent .= $text;
                            $onChunk($text);
                        }
                    }
                }
            }

            $onComplete($fullContent);
        } catch (\Throwable $e) {
            Log::error('OpenAI-compatible SSE streaming failed: '.$e->getMessage());
            throw new \RuntimeException('AI streaming content failed: '.$e->getMessage(), 0, $e);
        }
    }
}
