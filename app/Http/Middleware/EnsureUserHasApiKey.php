<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserHasApiKey
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user && ! $user->hasActiveApiKey()) {
            $provider = ucfirst($user->ai_provider ?? 'Gemini');
            $message = "Please configure your {$provider} API key in AI Settings before generating content.";

            if ($request->expectsJson()) {
                return response()->json([
                    'errors' => ['api_key' => $message],
                ], 422);
            }

            return redirect()->route('settings.api-keys')->withErrors([
                'api_key' => $message,
            ]);
        }

        return $next($request);
    }
}
