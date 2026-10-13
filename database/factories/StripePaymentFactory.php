<?php

namespace Database\Factories;

use App\Models\StripePayment;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<StripePayment>
 */
class StripePaymentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $sessionId = 'cs_test_'.Str::random(24);

        return [
            'user_id' => User::factory(),
            'stripe_session_id' => $sessionId,
            'stripe_payment_intent' => 'pi_'.Str::random(24),
            'package_key' => 'starter',
            'credits_purchased' => 50,
            'amount_paid' => 999,
            'currency' => 'usd',
            'status' => 'completed',
            'stripe_payload' => [
                'id' => $sessionId,
                'amount_total' => 999,
                'currency' => 'usd',
                'payment_status' => 'paid',
            ],
        ];
    }

    /**
     * Indicate that the payment is pending.
     */
    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'pending',
            'stripe_payment_intent' => null,
            'stripe_payload' => null,
        ]);
    }

    /**
     * Indicate that the payment has completed.
     */
    public function completed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'completed',
            'stripe_payment_intent' => $attributes['stripe_payment_intent'] ?? 'pi_'.Str::random(24),
        ]);
    }

    /**
     * Indicate that the payment has failed.
     */
    public function failed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'failed',
        ]);
    }

    /**
     * Set a custom package for the payment.
     */
    public function package(string $key, int $credits, int $amountCents): static
    {
        return $this->state(fn (array $attributes) => [
            'package_key' => $key,
            'credits_purchased' => $credits,
            'amount_paid' => $amountCents,
        ]);
    }
}
