<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AiService
{
    protected int $timeout = 60;

    /**
     * Validate an API key against the provider.
     *
     * @return array{success: bool, message: string}
     */
    public function validateKey(string $provider, string $apiKey): array
    {
        $apiKey = trim($apiKey);

        if (empty($apiKey)) {
            return ['success' => false, 'valid' => false, 'message' => 'API key cannot be empty.'];
        }

        try {
            return match ($provider) {
                'gemini' => $this->validateGeminiKey($apiKey),
                'openai' => $this->validateOpenAiKey($apiKey),
                'openrouter' => $this->validateOpenRouterKey($apiKey),
                default => ['success' => false, 'valid' => false, 'message' => "Unknown provider: {$provider}"],
            };
        } catch (\Throwable $e) {
            Log::warning("AI key validation failed for {$provider}: ".$e->getMessage());

            return ['success' => false, 'valid' => false, 'message' => 'Validation request failed: '.$e->getMessage()];
        }
    }

    /**
     * Generate content synchronously using the user's active key and chosen model.
     */
    public function generate(User $user, string $prompt, ?string $provider = null, ?string $model = null): string
    {
        $provider = $provider ?? $user->ai_provider ?? 'gemini';
        $apiKey = match ($provider) {
            'openai' => $user->openai_api_key,
            'openrouter' => $user->openrouter_api_key,
            default => $user->gemini_api_key,
        };

        if (empty($apiKey)) {
            throw new \RuntimeException('No API key configured for '.ucfirst($provider).'. Please add your key in AI Settings.');
        }

        $model = $model ?? $user->getActiveModel();

        return match ($provider) {
            'openai' => $this->generateOpenAi($apiKey, $model, $prompt),
            'openrouter' => $this->generateOpenRouter($apiKey, $model, $prompt),
            default => $this->generateGemini($apiKey, $model, $prompt),
        };
    }

    protected function validateGeminiKey(string $apiKey): array
    {
        $response = Http::timeout(10)
            ->get("https://generativelanguage.googleapis.com/v1beta/models?key={$apiKey}");

        if ($response->successful()) {
            return [
                'success' => true,
                'valid' => true,
                'message' => 'Google Gemini API key verified successfully!',
            ];
        }

        $error = $response->json('error.message') ?? $response->reason();

        return [
            'success' => false,
            'valid' => false,
            'message' => "Google Gemini verification failed: {$error}",
        ];
    }

    protected function validateOpenAiKey(string $apiKey): array
    {
        $response = Http::timeout(10)
            ->withHeaders(['Authorization' => "Bearer {$apiKey}"])
            ->get('https://api.openai.com/v1/models');

        if ($response->successful()) {
            return [
                'success' => true,
                'valid' => true,
                'message' => 'OpenAI API key verified successfully!',
            ];
        }

        $error = $response->json('error.message') ?? $response->reason();

        return [
            'success' => false,
            'valid' => false,
            'message' => "OpenAI verification failed: {$error}",
        ];
    }

    protected function validateOpenRouterKey(string $apiKey): array
    {
        $response = Http::timeout(10)
            ->withHeaders(['Authorization' => "Bearer {$apiKey}"])
            ->get('https://openrouter.ai/api/v1/auth/key');

        if ($response->successful()) {
            return [
                'success' => true,
                'valid' => true,
                'message' => 'OpenRouter API key verified successfully!',
            ];
        }

        $error = $response->json('error.message') ?? $response->reason();

        return [
            'success' => false,
            'valid' => false,
            'message' => "OpenRouter verification failed: {$error}",
        ];
    }

    protected function generateGemini(string $apiKey, string $model, string $prompt): string
    {
        $geminiAliases = [
            'gemini-3.8-flash-lite' => 'gemini-3.5-flash-lite',
            'gemini-flash-lite' => 'gemini-3.5-flash-lite',
            'gemini-flash' => 'gemini-3.8-flash',
            'gemini-pro' => 'gemini-3-pro',
        ];
        $model = $geminiAliases[$model] ?? $model;

        $url = "https://generativelanguage.googleapis.com/v1beta/models/{$model}:generateContent?key={$apiKey}";

        $response = Http::timeout($this->timeout)
            ->withHeaders(['Content-Type' => 'application/json'])
            ->post($url, [
                'contents' => [
                    [
                        'parts' => [
                            ['text' => $prompt],
                        ],
                    ],
                ],
            ]);

        if ($response->failed()) {
            $msg = $response->json('error.message') ?? $response->reason();
            throw new \RuntimeException("Google Gemini API error ({$response->status()}): {$msg}");
        }

        $text = $response->json('candidates.0.content.parts.0.text') ?? '';

        if (empty($text)) {
            throw new \RuntimeException('Empty content returned from Google Gemini.');
        }

        return $text;
    }

    protected function generateOpenAi(string $apiKey, string $model, string $prompt): string
    {
        $response = Http::timeout($this->timeout)
            ->withHeaders([
                'Authorization' => "Bearer {$apiKey}",
                'Content-Type' => 'application/json',
            ])
            ->post('https://api.openai.com/v1/chat/completions', [
                'model' => $model,
                'messages' => [
                    ['role' => 'user', 'content' => $prompt],
                ],
                'temperature' => 0.7,
            ]);

        if ($response->failed()) {
            $msg = $response->json('error.message') ?? $response->reason();
            throw new \RuntimeException("OpenAI API error ({$response->status()}): {$msg}");
        }

        $text = $response->json('choices.0.message.content') ?? '';

        if (empty($text)) {
            throw new \RuntimeException('Empty content returned from OpenAI.');
        }

        return $text;
    }

    protected function generateOpenRouter(string $apiKey, string $model, string $prompt): string
    {
        $response = Http::timeout($this->timeout)
            ->withHeaders([
                'Authorization' => "Bearer {$apiKey}",
                'Content-Type' => 'application/json',
                'HTTP-Referer' => config('app.url', 'http://localhost:8000'),
                'X-Title' => 'AI SaaS Content Generator',
            ])
            ->post('https://openrouter.ai/api/v1/chat/completions', [
                'model' => $model,
                'messages' => [
                    ['role' => 'user', 'content' => $prompt],
                ],
                'temperature' => 0.7,
            ]);

        if ($response->failed()) {
            $msg = $response->json('error.message') ?? $response->reason();
            throw new \RuntimeException("OpenRouter API error ({$response->status()}): {$msg}");
        }

        $text = $response->json('choices.0.message.content') ?? '';

        if (empty($text)) {
            throw new \RuntimeException('Empty content returned from OpenRouter.');
        }

        return $text;
    }
}
