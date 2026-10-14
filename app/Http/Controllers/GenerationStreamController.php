<?php

namespace App\Http\Controllers;

use App\Models\Generation;
use App\Services\GeminiStreamService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\StreamedResponse;

class GenerationStreamController extends Controller
{
    public function __construct(
        protected GeminiStreamService $streamService
    ) {}

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
            // Set execution limit
            set_time_limit(120);

            // Clean any existing output buffers
            if (! app()->runningUnitTests()) {
                while (ob_get_level() > 0) {
                    ob_end_clean();
                }
            }

            try {
                $this->streamService->stream(
                    $generation->full_prompt,
                    function (string $token) {
                        echo 'data: '.json_encode(['token' => $token])."\n\n";

                        // Check if client disconnected
                        if (connection_aborted()) {
                            throw new \RuntimeException('Connection aborted by client.');
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

                echo 'data: '.json_encode(['error' => 'Generation failed: '.$e->getMessage()])."\n\n";
                flush();

                return;
            }

            echo 'data: '.json_encode(['done' => true])."\n\n";
            flush();
        }, 200, [
            'Content-Type' => 'text/event-stream',
            'Cache-Control' => 'no-cache',
            'Connection' => 'keep-alive',
            'X-Accel-Buffering' => 'no',
        ]);
    }
}
