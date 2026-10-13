<?php

use App\Models\Generation;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('guests are redirected to login from history routes', function () {
    $generation = Generation::factory()->create();

    $this->get(route('history.index'))->assertRedirect(route('login'));
    $this->get(route('history.show', $generation))->assertRedirect(route('login'));
    $this->put(route('history.update', $generation))->assertRedirect(route('login'));
    $this->delete(route('history.destroy', $generation))->assertRedirect(route('login'));
});

test('users can view their own generations in history', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();

    $myGenerations = Generation::factory()->count(3)->create(['user_id' => $user->id]);
    $otherGenerations = Generation::factory()->count(2)->create(['user_id' => $otherUser->id]);

    $response = $this->actingAs($user)->get(route('history.index'));

    $response->assertSuccessful();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('History/Index')
        ->has('history.data', 3)
        ->where('history.data.0.user_id', $user->id)
    );
});

test('users can view details of their own generation', function () {
    $user = User::factory()->create();
    $generation = Generation::factory()->completed()->create([
        'user_id' => $user->id,
        'ai_content' => 'High quality generated copy.',
    ]);

    $response = $this->actingAs($user)->get(route('history.show', $generation));

    $response->assertSuccessful();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('History/Show')
        ->where('generation.id', $generation->id)
        ->where('generation.ai_content', 'High quality generated copy.')
    );
});

test('users cannot view another users generation', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();
    $generation = Generation::factory()->create(['user_id' => $otherUser->id]);

    $response = $this->actingAs($user)->get(route('history.show', $generation));

    $response->assertForbidden();
});

test('users can update edited content of their own generation', function () {
    $user = User::factory()->create();
    $generation = Generation::factory()->completed()->create([
        'user_id' => $user->id,
        'edited_content' => null,
    ]);

    $response = $this->actingAs($user)->put(route('history.update', $generation), [
        'edited_content' => 'Refined version by the author.',
    ]);

    $response->assertRedirect();
    $generation->refresh();
    expect($generation->edited_content)->toBe('Refined version by the author.');
});

test('users cannot update another users generation', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();
    $generation = Generation::factory()->completed()->create([
        'user_id' => $otherUser->id,
        'edited_content' => 'Original',
    ]);

    $response = $this->actingAs($user)->put(route('history.update', $generation), [
        'edited_content' => 'Malicious edit',
    ]);

    $response->assertForbidden();
    $generation->refresh();
    expect($generation->edited_content)->toBe('Original');
});

test('users can delete their own generation', function () {
    $user = User::factory()->create();
    $generation = Generation::factory()->create(['user_id' => $user->id]);

    $response = $this->actingAs($user)->delete(route('history.destroy', $generation));

    $response->assertRedirect(route('history.index'));
    $this->assertDatabaseMissing('generations', ['id' => $generation->id]);
});

test('users cannot delete another users generation', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();
    $generation = Generation::factory()->create(['user_id' => $otherUser->id]);

    $response = $this->actingAs($user)->delete(route('history.destroy', $generation));

    $response->assertForbidden();
    $this->assertDatabaseHas('generations', ['id' => $generation->id]);
});
