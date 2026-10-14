<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\UserTone;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<UserTone>
 */
class UserToneFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'name' => fake()->unique()->words(2, true),
            'description' => fake()->sentence(8),
            'is_system' => false,
        ];
    }

    /**
     * Indicate that the tone is a built-in system preset.
     */
    public function system(): static
    {
        return $this->state(fn (array $attributes) => [
            'user_id' => null,
            'is_system' => true,
        ]);
    }
}
