<?php

use App\Enums\ContentType;
use App\Enums\OutputLanguage;
use App\Models\Generation;
use App\Models\User;
use App\Models\UserTone;
use App\Services\GeminiStreamService;
use Inertia\Testing\AssertableInertia as Assert;

test('guests are redirected to login from generation form', function () {
    $response = $this->get(route('generate.create'));

    $response->assertRedirect(route('login'));
});

test('authenticated users can view generation form with tones and types', function () {
    $user = User::factory()->create();
    $tone = UserTone::factory()->create(['user_id' => $user->id]);

    $response = $this->actingAs($user)->get(route('generate.create'));

    $response->assertSuccessful();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('Generate/Create')
        ->has('contentTypes')
        ->has('outputLanguages')
        ->has('tones', 1)
        ->has('recentGenerations')
        ->has('hasApiKey')
        ->has('aiProvider')
        ->has('aiModel')
    );
});

test('users can initiate content generation with active api key', function () {
    $user = User::factory()->withApiKey('gemini')->create([
        'ai_provider' => 'gemini',
        'ai_model' => 'gemini-2.5-flash',
    ]);
    $tone = UserTone::factory()->create([
        'user_id' => $user->id,
        'name' => 'Witty',
        'description' => 'Humorous and sharp',
    ]);

    $response = $this->actingAs($user)->post(route('generate.store'), [
        'content_type' => ContentType::BlogPost->value,
        'output_language' => OutputLanguage::English->value,
        'user_prompt' => 'Top 5 AI tools in 2026',
        'tone_id' => $tone->id,
    ]);

    $generation = Generation::where('user_id', $user->id)->first();
    expect($generation)->not->toBeNull()
        ->and($generation->status)->toBe('pending')
        ->and($generation->content_type)->toBe(ContentType::BlogPost)
        ->and($generation->output_language)->toBe(OutputLanguage::English)
        ->and($generation->user_prompt)->toBe('Top 5 AI tools in 2026')
        ->and($generation->tone_id)->toBe($tone->id)
        ->and($generation->ai_provider)->toBe('gemini')
        ->and($generation->ai_model)->toBe('gemini-2.5-flash');

    $response->assertRedirect(route('history.show', $generation->id));
    $response->assertSessionHas('autostream', true);
});

test('generation request validates required fields and enum values', function () {
    $user = User::factory()->withApiKey('gemini')->create();

    $response = $this->actingAs($user)->post(route('generate.store'), [
        'content_type' => 'invalid_type',
        'output_language' => 'klingon',
        'user_prompt' => '',
    ]);

    $response->assertSessionHasErrors(['content_type', 'output_language', 'user_prompt']);
});

test('users cannot use tone belonging to another user', function () {
    $user = User::factory()->withApiKey('gemini')->create();
    $otherUser = User::factory()->create();
    $otherTone = UserTone::factory()->create(['user_id' => $otherUser->id]);

    $response = $this->actingAs($user)->post(route('generate.store'), [
        'content_type' => ContentType::BlogPost->value,
        'output_language' => OutputLanguage::English->value,
        'user_prompt' => 'Test with unauthorized tone',
        'tone_id' => $otherTone->id,
    ]);

    $response->assertSessionHasErrors('tone_id');
});

test('users can stream content for their pending generation', function () {
    $user = User::factory()->withApiKey('gemini')->create();
    $generation = Generation::factory()->pending()->create([
        'user_id' => $user->id,
        'full_prompt' => 'Generate a test post',
        'ai_provider' => 'gemini',
        'ai_model' => 'gemini-2.5-flash',
    ]);

    $mockStream = Mockery::mock(GeminiStreamService::class);
    $mockStream->shouldReceive('stream')
        ->once()
        ->andReturnUsing(function ($prompt, $onChunk, $onComplete, $user = null) {
            $onChunk('First chunk. ');
            $onChunk('Second chunk.');
            $onComplete('First chunk. Second chunk.');
        });
    app()->instance(GeminiStreamService::class, $mockStream);

    $response = $this->actingAs($user)->get(route('generate.stream', $generation->id));

    $response->assertSuccessful();
    expect($response->headers->get('content-type'))->toContain('text/event-stream');

    ob_start();
    $response->sendContent();
    ob_end_clean();

    $generation->refresh();
    expect($generation->status)->toBe('completed')
        ->and($generation->ai_content)->toBe('First chunk. Second chunk.');
});

test('failed stream marks generation as failed', function () {
    $user = User::factory()->withApiKey('gemini')->create();
    $generation = Generation::factory()->pending()->create([
        'user_id' => $user->id,
        'full_prompt' => 'Generate a post that will fail',
        'ai_provider' => 'gemini',
        'ai_model' => 'gemini-2.5-flash',
    ]);

    $mockStream = Mockery::mock(GeminiStreamService::class);
    $mockStream->shouldReceive('stream')
        ->once()
        ->andThrow(new RuntimeException('Gemini API quota exceeded'));
    app()->instance(GeminiStreamService::class, $mockStream);

    $response = $this->actingAs($user)->get(route('generate.stream', $generation->id));

    $response->assertSuccessful();

    ob_start();
    $response->sendContent();
    ob_end_clean();

    $generation->refresh();
    expect($generation->status)->toBe('failed');
});

test('users cannot stream non-pending generation', function () {
    $user = User::factory()->withApiKey('gemini')->create();
    $generation = Generation::factory()->completed()->create([
        'user_id' => $user->id,
    ]);

    $response = $this->actingAs($user)->get(route('generate.stream', $generation->id));

    $response->assertStatus(400);
});

test('users cannot stream another users generation', function () {
    $user = User::factory()->withApiKey('gemini')->create();
    $otherUser = User::factory()->create();
    $generation = Generation::factory()->pending()->create([
        'user_id' => $otherUser->id,
    ]);

    $response = $this->actingAs($user)->get(route('generate.stream', $generation->id));

    $response->assertForbidden();
});
