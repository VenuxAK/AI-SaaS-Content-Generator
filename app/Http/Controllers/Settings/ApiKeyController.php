<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\AiService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ApiKeyController extends Controller
{
    /**
     * Display the user's AI provider & API Key settings.
     */
    public function edit(Request $request): Response
    {
        $user = $request->user();
        $providers = config('ai.providers', []);

        return Inertia::render('settings/api-keys', [
            'activeProvider' => $user->ai_provider ?? 'gemini',
            'activeModel' => $user->getActiveModel(),
            'currentProvider' => $user->ai_provider ?? 'gemini',
            'currentModel' => $user->getActiveModel(),
            'keysStatus' => $user->getApiKeysStatus(),
            'providers' => $providers,
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Update the user's API keys and active provider selection.
     */
    public function update(Request $request): RedirectResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'ai_provider' => ['required', 'string', 'in:gemini,openai,openrouter'],
            'ai_model' => ['nullable', 'string', 'max:100'],
            'gemini_api_key' => ['nullable', 'string'],
            'openai_api_key' => ['nullable', 'string'],
            'openrouter_api_key' => ['nullable', 'string'],
        ]);

        $user->ai_provider = $validated['ai_provider'];

        // If no custom model specified, set default model for chosen provider
        $user->ai_model = ! empty($validated['ai_model'])
            ? $validated['ai_model']
            : User::defaultModelFor($validated['ai_provider']);

        // Update keys only if provided and not masked placeholder
        if (isset($validated['gemini_api_key']) && ! str_starts_with($validated['gemini_api_key'], '••••')) {
            $user->gemini_api_key = ! empty(trim($validated['gemini_api_key'])) ? trim($validated['gemini_api_key']) : null;
        }

        if (isset($validated['openai_api_key']) && ! str_starts_with($validated['openai_api_key'], '••••')) {
            $user->openai_api_key = ! empty(trim($validated['openai_api_key'])) ? trim($validated['openai_api_key']) : null;
        }

        if (isset($validated['openrouter_api_key']) && ! str_starts_with($validated['openrouter_api_key'], '••••')) {
            $user->openrouter_api_key = ! empty(trim($validated['openrouter_api_key'])) ? trim($validated['openrouter_api_key']) : null;
        }

        $user->save();

        return redirect()->route('settings.api-keys')
            ->with('status', 'AI settings and API keys updated successfully.')
            ->with('success', 'AI settings and API keys updated successfully.');
    }

    /**
     * Test connection for a given provider and API key.
     */
    public function test(Request $request, AiService $aiService): JsonResponse
    {
        $validated = $request->validate([
            'provider' => ['required', 'string', 'in:gemini,openai,openrouter'],
            'api_key' => ['nullable', 'string'],
        ]);

        $user = $request->user();
        $provider = $validated['provider'];
        $keyToTest = $validated['api_key'] ?? null;

        // If not provided or masked placeholder, use saved key
        if (empty($keyToTest) || str_starts_with($keyToTest, '••••')) {
            $keyToTest = match ($provider) {
                'openai' => $user->openai_api_key,
                'openrouter' => $user->openrouter_api_key,
                default => $user->gemini_api_key,
            };
        }

        if (empty($keyToTest)) {
            return response()->json([
                'success' => false,
                'message' => 'Please enter an API key to test.',
            ], 422);
        }

        $result = $aiService->validateKey($provider, $keyToTest);

        return response()->json($result);
    }
}
