<?php

use App\Models\CreditTransaction;
use App\Models\User;
use App\Services\StripeService;
use Inertia\Testing\AssertableInertia as Assert;
use Stripe\Checkout\Session;

test('guests are redirected from billing routes', function () {
    $this->get(route('billing.index'))->assertRedirect(route('login'));
    $this->get(route('billing.transactions'))->assertRedirect(route('login'));
    $this->post(route('billing.checkout'), ['package_key' => 'starter'])->assertRedirect(route('login'));
});

test('users can view billing packages and credit balance', function () {
    $user = User::factory()->credits(25)->create();

    $response = $this->actingAs($user)->get(route('billing.index'));

    $response->assertSuccessful();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('Billing/Index')
        ->where('creditBalance', 25)
        ->has('packages')
    );
});

test('users can view their credit transactions history', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();

    CreditTransaction::factory()->count(3)->create(['user_id' => $user->id]);
    CreditTransaction::factory()->count(2)->create(['user_id' => $otherUser->id]);

    $response = $this->actingAs($user)->get(route('billing.transactions'));

    $response->assertSuccessful();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('Billing/Transactions')
        ->has('transactions.data', 3)
    );
});

test('checkout validates package_key', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post(route('billing.checkout'), [
        'package_key' => '',
    ]);

    $response->assertSessionHasErrors('package_key');
});

test('checkout initiates stripe session and records pending payment', function () {
    $user = User::factory()->create();

    $mockSession = Session::constructFrom([
        'id' => 'cs_test_session_999',
        'url' => 'https://checkout.stripe.com/pay/cs_test_session_999',
    ]);

    $mockStripe = Mockery::mock(StripeService::class);
    $mockStripe->shouldReceive('createCheckoutSession')
        ->once()
        ->andReturn($mockSession);
    app()->instance(StripeService::class, $mockStripe);

    $response = $this->actingAs($user)->post(route('billing.checkout'), [
        'package_key' => 'starter',
    ], [
        'X-Inertia' => 'true',
    ]);

    $response->assertStatus(409); // Inertia external redirect status code
    $this->assertDatabaseHas('stripe_payments', [
        'user_id' => $user->id,
        'stripe_session_id' => 'cs_test_session_999',
        'package_key' => 'starter',
        'status' => 'pending',
    ]);
});

test('billing success and cancel pages render successfully', function () {
    $user = User::factory()->create();

    $successResponse = $this->actingAs($user)->get(route('billing.success'));
    $successResponse->assertSuccessful();
    $successResponse->assertInertia(fn (Assert $page) => $page
        ->component('Billing/Index')
        ->where('status', 'success')
    );

    $cancelResponse = $this->actingAs($user)->get(route('billing.cancel'));
    $cancelResponse->assertSuccessful();
    $cancelResponse->assertInertia(fn (Assert $page) => $page
        ->component('Billing/Index')
        ->where('status', 'cancelled')
    );
});
