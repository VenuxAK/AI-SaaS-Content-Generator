<?php

use App\Models\User;
use App\Services\AiService;
use Inertia\Testing\AssertableInertia as Assert;

test('guests cannot access api key settings', function () {
    $this->get(route('settings.api-keys'))->assertRedirect(route('login'));
});

test('users can view api key settings page', function () {
    $user = User::factory()->create([
        'gemini_api_key' => 'AIzaSySecretGeminiKey1234',
        'ai_provider' => 'gemini',
        'ai_model' => 'gemini-2.5-flash',
    ]);

    $response = $this->actingAs($user)->get(route('settings.api-keys'));

    $response->assertSuccessful();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('settings/api-keys')
        ->has('providers')
        ->where('activeProvider', 'gemini')
        ->where('activeModel', 'gemini-2.5-flash')
        ->has('keysStatus.gemini')
        ->where('keysStatus.gemini.is_set', true)
        ->where('keysStatus.gemini.masked', fn ($masked) => str_ends_with($masked, '1234'))
    );
});

test('users can update api keys and active provider and model', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->put(route('settings.api-keys.update'), [
        'ai_provider' => 'openai',
        'ai_model' => 'gpt-4o-mini',
        'openai_api_key' => 'sk-proj-testopenai1234567890',
    ]);

    $response->assertRedirect(route('settings.api-keys'));
    $response->assertSessionHas('success');

    $user->refresh();
    expect($user->ai_provider)->toBe('openai')
        ->and($user->ai_model)->toBe('gpt-4o-mini')
        ->and($user->openai_api_key)->toBe('sk-proj-testopenai1234567890');
});

test('users can test an api key connection', function () {
    $user = User::factory()->create();

    $mockAi = Mockery::mock(AiService::class);
    $mockAi->shouldReceive('validateKey')
        ->with('gemini', 'valid-key')
        ->once()
        ->andReturn(['valid' => true, 'message' => 'Connection successful!']);
    app()->instance(AiService::class, $mockAi);

    $response = $this->actingAs($user)->postJson(route('settings.api-keys.test'), [
        'provider' => 'gemini',
        'api_key' => 'valid-key',
    ]);

    $response->assertSuccessful();
    $response->assertJson([
        'valid' => true,
        'message' => 'Connection successful!',
    ]);
});

test('users without api keys are redirected when trying to generate', function () {
    $user = User::factory()->withoutApiKey()->create();

    $response = $this->actingAs($user)->post(route('generate.store'), [
        'content_type' => 'blog_post',
        'output_language' => 'en',
        'user_prompt' => 'Write about nature',
    ]);

    $response->assertRedirect(route('settings.api-keys'));
    $response->assertSessionHasErrors('api_key');
});
