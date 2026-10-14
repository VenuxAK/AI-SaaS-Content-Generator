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
                'description' => 'Open with contrarian hooks challenging conventional industry dogmas. Use assertive, unapologetic language with strong convictions. Frame insights around counter-intuitive realizations and polarizing yet defensible perspectives.',
            ],
            [
                'name' => 'Witty & Punchy',
                'description' => 'High energy, clever analogies, and rapid-fire rhythm. Mix short staccato punchlines with dry humor and meme-savvy observations. Keep sentences brisk and discard corporate filler words.',
            ],
            [
                'name' => 'Storyteller / Relatable',
                'description' => 'Narrative-driven arc starting in media res with emotional or situational tension. Show vulnerabilities, specific sensory details, and turning points. Connect individual struggle to a universal takeaway.',
            ],
            [
                'name' => 'Urgent Direct Sales',
                'description' => 'High-conversion direct response copywriting. Emphasize immediate pain resolution, scarcity, social proof, and risk reversal. Drive momentum towards an unambiguous, irresistible call-to-action.',
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
