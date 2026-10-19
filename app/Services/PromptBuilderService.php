<?php

namespace App\Services;

use App\Enums\ContentType;
use App\Enums\OutputLanguage;
use Illuminate\Support\Facades\File;

class PromptBuilderService
{
    /**
     * Build the final prompt for the AI model.
     */
    public function build(
        ContentType $contentType,
        string $userPrompt,
        ?string $toneDescription,
        OutputLanguage $language
    ): string {
        $templatePath = app_path("Prompts/{$contentType->promptFile()}");

        if (! File::exists($templatePath)) {
            throw new \InvalidArgumentException("Prompt template for {$contentType->value} does not exist at {$templatePath}");
        }

        $template = File::get($templatePath);

        // Build tone block
        $toneBlock = '';
        if ($toneDescription) {
            $toneBlock = "Writing Style Instructions (MUST follow these strictly):\n---\n".trim($toneDescription)."\n---";
        }

        // Replace placeholders
        $prompt = str_replace('{{TONE_INSTRUCTIONS}}', $toneBlock, $template);
        $prompt = str_replace('{{USER_PROMPT}}', trim($userPrompt), $prompt);
        $prompt = str_replace('{{OUTPUT_LANGUAGE_INSTRUCTION}}', $language->instruction(), $prompt);

        // Clean up excessive blank lines when optional blocks like tone are omitted
        $prompt = preg_replace("/\n{3,}/", "\n\n", $prompt);

        return trim($prompt);
    }

    /**
     * Build the Humanizer rewrite prompt to strip AI cliches and naturalize tone.
     */
    public function buildHumanizer(
        string $content,
        OutputLanguage $language,
        ContentType $contentType,
        string $preset = 'conversational'
    ): string {
        $presetGuidance = match ($preset) {
            'punchy' => <<<'GUIDE'
STYLE: Punchy, High-Signal, and Direct.
- Cut unnecessary filler words and redundant phrases by 25–35%.
- Use bold, staccato sentences (3–8 words), high signal-to-noise ratio, and fearless declarations.
- Strip out timid hedging ("perhaps", "arguably", "it depends", "some might say").
- Maximize momentum, punchlines, and clarity.
GUIDE,
            'executive' => <<<'GUIDE'
STYLE: Executive Polish & Authoritative Leadership.
- Write with the confident, strategic perspective of a seasoned founder or industry executive writing for sophisticated peers.
- Elevate phrasing into crisp, high-signal leadership prose.
- Maintain strategic depth and high conviction while eliminating corporate buzzwords and artificial fluff.
GUIDE,
            default => <<<'GUIDE'
STYLE: Conversational, Candid, and Relatable.
- Introduce natural sentence burstiness (a natural mix of short punches and flowing compound observations).
- Add relatable human cadence, candid observations, and conversational transitions.
- Sound like a passionate, experienced human speaking directly to a peer over coffee.
- Eliminate textbook tone and robotic transition markers.
GUIDE,
        };

        $antiAiRules = <<<RULES
UNIVERSAL HUMANIZER RULES (STRICT ENFORCEMENT):
1. STRIP ALL AI MARKERS: Absolutely eliminate cliché AI phrases such as:
   - "In today's fast-paced digital landscape / world..."
   - "Delve into / diving in..."
   - "A testament to..."
   - "A tapestry of..."
   - "Look no further..."
   - "Game changer / game-changing..."
   - "It's important to remember that..."
   - "Without further ado..."
2. SENTENCE BURSTINESS: Intentionally vary sentence lengths so the prose breathes naturally.
3. PRESERVE CORE FACTS & FORMAT: Retain the original subject matter, key points, factual claims, and appropriate structure for a {$contentType->label()}.
4. LANGUAGE REQUIREMENT: {$language->instruction()}
RULES;

        return <<<PROMPT
You are an expert human content editor and master stylist specializing in humanizing AI drafts into authentic, engaging, and unforgettable writing.

Your task is to rewrite and humanize the draft below according to the specified style preset and rules.

{$presetGuidance}

{$antiAiRules}

Original Draft to Humanize:
---
{$content}
---

CRITICAL INSTRUCTIONS:
- Output ONLY the humanized rewritten content in clean Markdown.
- Do NOT output explanations, introductory comments (e.g. "Here is your humanized version:"), or closing remarks.
- Deliver the final, polished humanized text directly.
PROMPT;
    }
}
