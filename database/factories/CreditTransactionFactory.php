<?php

namespace Database\Factories;

use App\Enums\TransactionType;
use App\Models\CreditTransaction;
use App\Models\Generation;
use App\Models\StripePayment;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<CreditTransaction>
 */
class CreditTransactionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $amount = -1;
        $before = fake()->numberBetween(10, 100);

        return [
            'user_id' => User::factory(),
            'generation_id' => null,
            'stripe_payment_id' => null,
            'type' => TransactionType::Consumption,
            'amount' => $amount,
            'balance_before' => $before,
            'balance_after' => $before + $amount,
            'description' => 'Content generation credit deduction',
            'created_at' => now(),
        ];
    }

    /**
     * Indicate that the transaction is a credit purchase.
     */
    public function purchase(int $credits = 50, ?StripePayment $payment = null): static
    {
        return $this->state(function (array $attributes) use ($credits, $payment) {
            $before = $attributes['balance_before'] ?? 10;

            return [
                'type' => TransactionType::Purchase,
                'amount' => $credits,
                'balance_before' => $before,
                'balance_after' => $before + $credits,
                'description' => "Purchased {$credits} credits",
                'stripe_payment_id' => $payment?->id,
            ];
        });
    }

    /**
     * Indicate that the transaction is an administrative adjustment.
     */
    public function adjustment(int $credits = 10, string $reason = 'Manual admin adjustment'): static
    {
        return $this->state(function (array $attributes) use ($credits, $reason) {
            $before = $attributes['balance_before'] ?? 10;

            return [
                'type' => TransactionType::Adjustment,
                'amount' => $credits,
                'balance_before' => $before,
                'balance_after' => max(0, $before + $credits),
                'description' => $reason,
            ];
        });
    }

    /**
     * Indicate that the transaction is a refund.
     */
    public function refund(int $credits = 1, string $reason = 'Failed generation refund'): static
    {
        return $this->state(function (array $attributes) use ($credits, $reason) {
            $before = $attributes['balance_before'] ?? 10;

            return [
                'type' => TransactionType::Refund,
                'amount' => $credits,
                'balance_before' => $before,
                'balance_after' => $before + $credits,
                'description' => $reason,
            ];
        });
    }

    /**
     * Indicate that the transaction is linked to a generation.
     */
    public function forGeneration(Generation $generation): static
    {
        return $this->state(fn (array $attributes) => [
            'generation_id' => $generation->id,
            'user_id' => $generation->user_id,
        ]);
    }
}
