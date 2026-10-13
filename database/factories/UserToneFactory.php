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
        ];
    }
}
