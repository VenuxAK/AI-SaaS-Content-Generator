<?php

namespace Database\Factories;

use App\Enums\ContentType;
use App\Enums\OutputLanguage;
use App\Models\Generation;
use App\Models\User;
use App\Models\UserTone;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Generation>
 */
class GenerationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $prompt = fake()->sentence(8);

        return [
            'user_id' => User::factory(),
            'tone_id' => null,
            'content_type' => fake()->randomElement(ContentType::cases()),
            'output_language' => fake()->randomElement(OutputLanguage::cases()),
            'user_prompt' => $prompt,
            'tone_snapshot' => null,
            'full_prompt' => "Generate content: {$prompt}",
            'ai_content' => fake()->paragraphs(3, true),
            'edited_content' => null,
            'credits_used' => 1,
            'status' => 'completed',
        ];
    }

    /**
     * Indicate that the generation is pending.
     */
    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'pending',
            'ai_content' => null,
        ]);
    }

    /**
     * Indicate that the generation is streaming.
     */
    public function streaming(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'streaming',
        ]);
    }

    /**
     * Indicate that the generation has completed.
     */
    public function completed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'completed',
            'ai_content' => fake()->paragraphs(3, true),
        ]);
    }

    /**
     * Indicate that the generation has failed.
     */
    public function failed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'failed',
            'ai_content' => null,
        ]);
    }

    /**
     * Associate a custom tone with the generation.
     */
    public function withTone(?UserTone $tone = null): static
    {
        return $this->state(function (array $attributes) use ($tone) {
            $toneInstance = $tone ?? UserTone::factory()->create([
                'user_id' => $attributes['user_id'] ?? User::factory(),
            ]);

            return [
                'tone_id' => $toneInstance->id,
                'tone_snapshot' => "{$toneInstance->name}: {$toneInstance->description}",
            ];
        });
    }
}
