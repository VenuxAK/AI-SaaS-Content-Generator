<?php

use App\Enums\ContentType;
use App\Enums\OutputLanguage;
use App\Models\User;
use App\Models\UserTone;
use App\Services\PromptBuilderService;

test('users can manage writing tones', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    // Create tone
    $response = $this->post(route('tones.store'), [
        'name' => 'Witty Emojis',
        'description' => 'Sarcastic, full of tech slang and emoji markers.',
    ]);
    $response->assertRedirect(route('tones.index'));
    $this->assertDatabaseHas('user_tones', [
        'user_id' => $user->id,
        'name' => 'Witty Emojis',
    ]);

    $tone = UserTone::where('user_id', $user->id)->first();

    // Update tone
    $response = $this->put(route('tones.update', $tone->id), [
        'name' => 'Professional Pitch',
        'description' => 'Clear, concise, and focused on business value.',
    ]);
    $response->assertRedirect(route('tones.index'));
    $this->assertDatabaseHas('user_tones', [
        'id' => $tone->id,
        'name' => 'Professional Pitch',
    ]);

    // Delete tone
    $response = $this->delete(route('tones.destroy', $tone->id));
    $response->assertRedirect(route('tones.index'));
    $this->assertDatabaseMissing('user_tones', ['id' => $tone->id]);
});

test('prompt builder service correctly builds full prompts', function () {
    $builder = new PromptBuilderService;
    $prompt = $builder->build(
        ContentType::FacebookPost,
        'New SaaS product release',
        'Excited and casual',
        OutputLanguage::English
    );

    expect($prompt)->toContain('New SaaS product release')
        ->toContain('Excited and casual')
        ->toContain('Write the entire content in English.');
});

test('users cannot generate content without api key', function () {
    $user = User::factory()->withoutApiKey()->create();
    $this->actingAs($user);

    $response = $this->post(route('generate.store'), [
        'content_type' => ContentType::FacebookPost->value,
        'output_language' => OutputLanguage::English->value,
        'user_prompt' => 'Cool content topic',
    ]);

    // Triggers EnsureUserHasApiKey middleware redirect
    $response->assertRedirect(route('settings.api-keys'));
    $response->assertSessionHasErrors('api_key');
});

test('users can view content generation form', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $response = $this->get(route('generate.create'));
    $response->assertStatus(200);
});
