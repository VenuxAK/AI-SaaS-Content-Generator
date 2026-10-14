<?php

namespace App\Actions\Content;

use App\Enums\ContentType;
use App\Enums\OutputLanguage;
use App\Models\Generation;
use App\Models\User;
use App\Models\UserTone;
use App\Services\PromptBuilderService;

class GenerateContentAction
{
    public function __construct(
        protected PromptBuilderService $promptBuilder
    ) {}

    /**
     * Orchestrates content validation and generation database logging.
     */
    public function execute(User $user, array $data): Generation
    {
        $contentType = ContentType::from($data['content_type']);
        $language = OutputLanguage::from($data['output_language']);
        $userPrompt = $data['user_prompt'];
        $toneId = $data['tone_id'] ?? null;

        $toneDescription = null;
        $toneSnapshot = null;

        if ($toneId) {
            $tone = UserTone::where('user_id', $user->id)->findOrFail($toneId);
            $toneDescription = $tone->description;
            $toneSnapshot = $tone->name.': '.$tone->description;
        }

        $fullPrompt = $this->promptBuilder->build($contentType, $userPrompt, $toneDescription, $language);

        $generation = new Generation;
        $generation->user_id = $user->id;
        $generation->tone_id = $toneId;
        $generation->content_type = $contentType;
        $generation->output_language = $language;
        $generation->ai_provider = $user->ai_provider ?? 'gemini';
        $generation->ai_model = $user->getActiveModel();
        $generation->user_prompt = $userPrompt;
        $generation->tone_snapshot = $toneSnapshot;
        $generation->full_prompt = $fullPrompt;
        $generation->status = 'pending';
        $generation->save();

        return $generation;
    }
}
