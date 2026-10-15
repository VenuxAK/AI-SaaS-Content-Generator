<?php

namespace Database\Seeders;

use App\Models\UserTone;
use Illuminate\Database\Seeder;

class SystemToneSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $tones = [
            [
                'name' => 'Bold & Provocative',
                'description' => 'Adopt an unapologetic, high-conviction voice. Open with contrarian hooks challenging conventional industry dogmas. Eliminate timid hedging (avoid "it depends", "arguably", or "some might say"). Frame insights around counter-intuitive realizations and polarizing yet defensible perspectives. Use active verbs, bold declarations, and deliver fearless verdicts.',
            ],
            [
                'name' => 'Witty & Punchy',
                'description' => 'High energy, clever analogies, and rapid-fire rhythm. Mix short staccato punchlines with dry wit, sharp self-awareness, and meme-savvy observations. Keep sentences brisk (5–12 words average). Discard corporate filler words and buzzwords. Deliver memorable one-liner payoffs and playful banter.',
            ],
            [
                'name' => 'Storyteller / Relatable',
                'description' => 'Narrative-driven arc starting in media res with emotional or situational tension. Reveal authentic vulnerabilities, specific sensory details, and an honest turning point. Avoid melodramatic preaching or corporate speak—connect an authentic individual struggle to an empowering, universal takeaway.',
            ],
            [
                'name' => 'Urgent Direct Sales',
                'description' => 'High-conversion direct response copywriting. Emphasize immediate pain resolution, credible scarcity, social proof, and risk reversal. Agitate the cost of delay with visceral, action-oriented verbs. Eliminate passive phrasing and drive intense momentum towards an unambiguous, irresistible call-to-action.',
            ],
        ];

        foreach ($tones as $tone) {
            UserTone::updateOrCreate(
                [
                    'name' => $tone['name'],
                    'is_system' => true,
                ],
                [
                    'user_id' => null,
                    'description' => $tone['description'],
                ]
            );
        }
    }
}
