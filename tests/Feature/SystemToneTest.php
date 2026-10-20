<?php

use App\Models\Generation;
use App\Models\User;
use App\Models\UserTone;
use Database\Seeders\SystemToneSeeder;
use Inertia\Testing\AssertableInertia as Assert;

test('system tones are properly seeded by SystemToneSeeder', function () {
    $this->seed(SystemToneSeeder::class);

    expect(UserTone::where('is_system', true)->count())->toBe(4);

    $this->assertDatabaseHas('user_tones', [
        'name' => 'Bold & Provocative',
        'is_system' => true,
        'user_id' => null,
    ]);

    $this->assertDatabaseHas('user_tones', [
        'name' => 'Witty & Punchy',
        'is_system' => true,
        'user_id' => null,
    ]);

    $this->assertDatabaseHas('user_tones', [
        'name' => 'Storyteller / Relatable',
        'is_system' => true,
        'user_id' => null,
    ]);

    $this->assertDatabaseHas('user_tones', [
        'name' => 'Urgent Direct Sales',
        'is_system' => true,
        'user_id' => null,
    ]);
});

test('users see custom tones on top before system tones on the tones index page', function () {
    $this->seed(SystemToneSeeder::class);

    $user = User::factory()->create();
    UserTone::factory()->create([
        'user_id' => $user->id,
        'name' => 'My Custom Persona',
    ]);

    $response = $this->actingAs($user)->get(route('tones.index'));

    $response->assertSuccessful();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('Tones/Index')
        ->has('tones', 5)
        ->where('tones.0.is_system', false)
        ->where('tones.0.name', 'My Custom Persona')
        ->where('tones.1.is_system', true)
    );
});

test('generation studio returns custom tones on top before system tones', function () {
    $this->seed(SystemToneSeeder::class);

    $user = User::factory()->create();
    UserTone::factory()->create([
        'user_id' => $user->id,
        'name' => 'My Custom Persona',
    ]);

    $response = $this->actingAs($user)->get(route('generate.create'));

    $response->assertSuccessful();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('Generate/Create')
        ->has('tones', 5)
        ->where('tones.0.is_system', false)
        ->where('tones.0.name', 'My Custom Persona')
        ->where('tones.1.is_system', true)
    );
});

test('system tones cannot be updated by any user', function () {
    $this->seed(SystemToneSeeder::class);

    $user = User::factory()->create();
    $systemTone = UserTone::where('is_system', true)->first();

    $response = $this->actingAs($user)->put(route('tones.update', $systemTone), [
        'name' => 'Hacked System Tone',
        'description' => 'Malicious description override',
    ]);

    $response->assertForbidden();
    $systemTone->refresh();
    expect($systemTone->name)->not->toBe('Hacked System Tone');
});

test('system tones cannot be deleted by any user', function () {
    $this->seed(SystemToneSeeder::class);

    $user = User::factory()->create();
    $systemTone = UserTone::where('is_system', true)->first();

    $response = $this->actingAs($user)->delete(route('tones.destroy', $systemTone));

    $response->assertForbidden();
    $this->assertDatabaseHas('user_tones', [
        'id' => $systemTone->id,
        'is_system' => true,
    ]);
});

test('users can create a content generation using a system tone', function () {
    $this->seed(SystemToneSeeder::class);

    $user = User::factory()->create([
        'gemini_api_key' => 'valid-gemini-test-key-12345',
    ]);
    $systemTone = UserTone::where('is_system', true)->where('name', 'Bold & Provocative')->first();

    $response = $this->actingAs($user)->post(route('generate.store'), [
        'content_type' => 'facebook_post',
        'output_language' => 'en',
        'user_prompt' => 'Write a post about why hustle culture is counter-productive.',
        'tone_id' => $systemTone->id,
    ]);

    $response->assertRedirect();

    $generation = Generation::where('user_id', $user->id)->first();
    expect($generation)->not->toBeNull();
    expect($generation->tone_id)->toBe($systemTone->id);
    expect($generation->tone_snapshot)->toContain('Bold & Provocative');
    expect($generation->full_prompt)->toContain('contrarian hooks');
});

test('users cannot select another users private tone for generation', function () {
    $user = User::factory()->create([
        'gemini_api_key' => 'valid-gemini-test-key-12345',
    ]);
    $otherUser = User::factory()->create();
    $privateTone = UserTone::factory()->create([
        'user_id' => $otherUser->id,
        'name' => 'Secret Persona',
        'is_system' => false,
    ]);

    $response = $this->actingAs($user)->post(route('generate.store'), [
        'content_type' => 'facebook_post',
        'output_language' => 'en',
        'user_prompt' => 'Test prompt.',
        'tone_id' => $privateTone->id,
    ]);

    $response->assertSessionHasErrors('tone_id');
    expect(Generation::where('user_id', $user->id)->count())->toBe(0);
});
