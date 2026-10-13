<?php

use App\Enums\TransactionType;
use App\Models\CreditTransaction;
use App\Models\Generation;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('guests are redirected from admin routes', function () {
    $user = User::factory()->create();

    $this->get(route('admin.users.index'))->assertRedirect(route('login'));
    $this->get(route('admin.users.show', $user))->assertRedirect(route('login'));
    $this->get(route('admin.transactions.index'))->assertRedirect(route('login'));
    $this->post(route('admin.users.adjust-credits', $user), ['amount' => 10, 'reason' => 'Test'])->assertRedirect(route('login'));
});

test('non-admin users are forbidden from accessing admin routes', function () {
    $user = User::factory()->create(['is_admin' => false]);
    $subjectUser = User::factory()->create();

    $this->actingAs($user)->get(route('admin.users.index'))->assertForbidden();
    $this->actingAs($user)->get(route('admin.users.show', $subjectUser))->assertForbidden();
    $this->actingAs($user)->get(route('admin.transactions.index'))->assertForbidden();
    $this->actingAs($user)->post(route('admin.users.adjust-credits', $subjectUser), [
        'amount' => 5,
        'reason' => 'Unauthorized adjustment',
    ])->assertForbidden();
});

test('admins can view users list paginated', function () {
    $admin = User::factory()->admin()->create();
    User::factory()->count(5)->create();

    $response = $this->actingAs($admin)->get(route('admin.users.index'));

    $response->assertSuccessful();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('Admin/Users')
        ->has('users.data')
    );
});

test('admins can view specific user details with generations and transactions', function () {
    $admin = User::factory()->admin()->create();
    $subjectUser = User::factory()->create();

    Generation::factory()->count(2)->create(['user_id' => $subjectUser->id]);
    CreditTransaction::factory()->count(2)->create(['user_id' => $subjectUser->id]);

    $response = $this->actingAs($admin)->get(route('admin.users.show', $subjectUser));

    $response->assertSuccessful();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('Admin/UserShow')
        ->where('subjectUser.id', $subjectUser->id)
        ->has('generations.data', 2)
        ->has('transactions.data', 2)
    );
});

test('admins can view global transactions listing', function () {
    $admin = User::factory()->admin()->create();
    CreditTransaction::factory()->count(3)->create();

    $response = $this->actingAs($admin)->get(route('admin.transactions.index'));

    $response->assertSuccessful();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('Admin/Transactions')
        ->has('transactions.data', 3)
    );
});

test('admins can add credits to a user', function () {
    $admin = User::factory()->admin()->create();
    $user = User::factory()->credits(10)->create();

    $response = $this->actingAs($admin)->post(route('admin.users.adjust-credits', $user), [
        'amount' => 20,
        'reason' => 'Goodwill credit grant',
    ]);

    $response->assertRedirect();
    $user->refresh();
    expect($user->credit_balance)->toBe(30);

    $this->assertDatabaseHas('credit_transactions', [
        'user_id' => $user->id,
        'type' => TransactionType::Adjustment->value,
        'amount' => 20,
        'balance_before' => 10,
        'balance_after' => 30,
        'description' => 'Goodwill credit grant',
    ]);
});

test('admins can deduct credits from a user', function () {
    $admin = User::factory()->admin()->create();
    $user = User::factory()->credits(10)->create();

    $response = $this->actingAs($admin)->post(route('admin.users.adjust-credits', $user), [
        'amount' => -4,
        'reason' => 'Administrative correction',
    ]);

    $response->assertRedirect();
    $user->refresh();
    expect($user->credit_balance)->toBe(6);

    $this->assertDatabaseHas('credit_transactions', [
        'user_id' => $user->id,
        'type' => TransactionType::Adjustment->value,
        'amount' => -4,
        'balance_before' => 10,
        'balance_after' => 6,
    ]);
});

test('admin cannot adjust credits below zero', function () {
    $admin = User::factory()->admin()->create();
    $user = User::factory()->credits(5)->create();

    $response = $this->actingAs($admin)->post(route('admin.users.adjust-credits', $user), [
        'amount' => -10,
        'reason' => 'Excessive reduction',
    ]);

    $response->assertRedirect();
    $response->assertSessionHasErrors('credits');

    $user->refresh();
    expect($user->credit_balance)->toBe(5);
});

test('adjust credits requires valid amount and reason', function () {
    $admin = User::factory()->admin()->create();
    $user = User::factory()->create();

    $response = $this->actingAs($admin)->post(route('admin.users.adjust-credits', $user), [
        'amount' => 'not-a-number',
        'reason' => '',
    ]);

    $response->assertSessionHasErrors(['amount', 'reason']);
});
