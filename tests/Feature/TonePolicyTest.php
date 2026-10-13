<?php

use App\Models\User;
use App\Models\UserTone;
use Inertia\Testing\AssertableInertia as Assert;

test('guests are redirected from tone management routes', function () {
    $tone = UserTone::factory()->create();

    $this->get(route('tones.index'))->assertRedirect(route('login'));
    $this->post(route('tones.store'), ['name' => 'Tone', 'description' => 'Desc'])->assertRedirect(route('login'));
    $this->put(route('tones.update', $tone), ['name' => 'Tone', 'description' => 'Desc'])->assertRedirect(route('login'));
    $this->delete(route('tones.destroy', $tone))->assertRedirect(route('login'));
});

test('users can view their list of tones', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();

    UserTone::factory()->create(['user_id' => $user->id, 'name' => 'My Tone']);
    UserTone::factory()->create(['user_id' => $otherUser->id, 'name' => 'Other Tone']);

    $response = $this->actingAs($user)->get(route('tones.index'));

    $response->assertSuccessful();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('Tones/Index')
        ->has('tones', 1)
        ->where('tones.0.name', 'My Tone')
    );
});

test('users cannot create a duplicate tone name for themselves', function () {
    $user = User::factory()->create();
    UserTone::factory()->create(['user_id' => $user->id, 'name' => 'Casual']);

    $response = $this->actingAs($user)->post(route('tones.store'), [
        'name' => 'Casual',
        'description' => 'Casual conversational style',
    ]);

    $response->assertSessionHasErrors('name');
});

test('different users can have tones with the same name', function () {
    $userA = User::factory()->create();
    $userB = User::factory()->create();
    UserTone::factory()->create(['user_id' => $userA->id, 'name' => 'Casual']);

    $response = $this->actingAs($userB)->post(route('tones.store'), [
        'name' => 'Casual',
        'description' => 'Casual style for User B',
    ]);

    $response->assertRedirect(route('tones.index'));
    $this->assertDatabaseHas('user_tones', [
        'user_id' => $userB->id,
        'name' => 'Casual',
    ]);
});

test('users can update their own tone keeping the same name', function () {
    $user = User::factory()->create();
    $tone = UserTone::factory()->create([
        'user_id' => $user->id,
        'name' => 'Witty',
        'description' => 'Old description',
    ]);

    $response = $this->actingAs($user)->put(route('tones.update', $tone), [
        'name' => 'Witty',
        'description' => 'New refined description',
    ]);

    $response->assertRedirect(route('tones.index'));
    $tone->refresh();
    expect($tone->description)->toBe('New refined description');
});

test('users cannot update another users tone', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();
    $tone = UserTone::factory()->create([
        'user_id' => $otherUser->id,
        'name' => 'Original',
        'description' => 'Original',
    ]);

    $response = $this->actingAs($user)->put(route('tones.update', $tone), [
        'name' => 'Hacked',
        'description' => 'Hacked',
    ]);

    $response->assertForbidden();
    $tone->refresh();
    expect($tone->name)->toBe('Original');
});

test('users cannot delete another users tone', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();
    $tone = UserTone::factory()->create(['user_id' => $otherUser->id]);

    $response = $this->actingAs($user)->delete(route('tones.destroy', $tone));

    $response->assertForbidden();
    $this->assertDatabaseHas('user_tones', ['id' => $tone->id]);
});
