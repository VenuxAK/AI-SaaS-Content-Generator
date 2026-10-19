<?php

use App\Enums\ContentType;
use App\Enums\OutputLanguage;
use App\Http\Controllers\GenerationStreamController;
use App\Models\Generation;
use App\Models\User;
use App\Models\UserTone;
use App\Services\GeminiStreamService;
use App\Services\PromptBuilderService;
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

test('stream error returns friendly related message without technical details in production', function () {
    config(['app.debug' => false]);
    app()['env'] = 'production';

    $controller = new GenerationStreamController(Mockery::mock(GeminiStreamService::class));
    $rawGuzzleError = "Server error: 'POST https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:streamGenerateContent?key=AQ.SecretKey123456789' resulted in a '503 Service Unavailable' response";

    $message = $controller->formatErrorMessage(new RuntimeException($rawGuzzleError));

    expect($message)->toContain('503 Service Unavailable')
        ->toContain('temporarily experiencing high demand');

    $this->assertStringNotContainsString('AQ.SecretKey123456789', $message);
    $this->assertStringNotContainsString('POST https://generativelanguage.googleapis.com', $message);
    $this->assertStringNotContainsString('Dev Details:', $message);
});

test('stream error masks sensitive API keys during development', function () {
    config(['app.debug' => true]);
    app()['env'] = 'local';

    $controller = new GenerationStreamController(Mockery::mock(GeminiStreamService::class));
    $rawGuzzleError = "Server error: 'POST https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:streamGenerateContent?key=AQ.SecretKey123456789' resulted in a '503 Service Unavailable' response";

    $message = $controller->formatErrorMessage(new RuntimeException($rawGuzzleError));

    expect($message)->toContain('Dev Details:')
        ->toContain('key=AQ.Se***[MASKED]');

    $this->assertStringNotContainsString('AQ.SecretKey123456789', $message);
});

test('all 11 content types have valid prompt templates and can be initiated', function (string $type) {
    $user = User::factory()->withApiKey('gemini')->create();

    $response = $this->actingAs($user)->post(route('generate.store'), [
        'content_type' => $type,
        'output_language' => OutputLanguage::English->value,
        'user_prompt' => 'Test generation for '.$type,
    ]);

    $generation = Generation::where('user_id', $user->id)->first();
    expect($generation)->not->toBeNull()
        ->and($generation->content_type->value)->toBe($type)
        ->and($generation->full_prompt)->not->toBeEmpty();

    $response->assertRedirect(route('history.show', $generation->id));
})->with([
    'facebook_post',
    'tiktok_script',
    'marketing_copy',
    'caption',
    'blog_post',
    'linkedin_post',
    'twitter_thread',
    'ad_copy',
    'cold_email',
    'carousel_slides',
    'youtube_script',
]);

test('prompt builder builds humanizer prompt with presets and anti-AI constraints', function () {
    $builder = new PromptBuilderService;
    $sampleContent = 'In today\'s fast-paced digital world, here is some copy.';

    $prompt = $builder->buildHumanizer(
        $sampleContent,
        OutputLanguage::English,
        ContentType::LinkedInPost,
        'punchy'
    );

    expect($prompt)
        ->toContain('Original Draft to Humanize:')
        ->toContain($sampleContent)
        ->toContain('Punchy, High-Signal, and Direct')
        ->toContain('STRIP ALL AI MARKERS')
        ->toContain('In today\'s fast-paced digital landscape');
});

test('authorized users can stream humanized rewrite of their generated content', function () {
    $user = User::factory()->withApiKey('gemini')->create();
    $generation = Generation::factory()->create([
        'user_id' => $user->id,
        'status' => 'completed',
        'ai_content' => 'First draft of the blog post.',
    ]);

    $mockStream = Mockery::mock(GeminiStreamService::class);
    $mockStream->shouldReceive('stream')
        ->once()
        ->andReturnUsing(function ($prompt, $onChunk, $onComplete, $user) {
            $onChunk('Humanized ');
            $onChunk('token.');
            $onComplete('Humanized token.');
        });
    app()->instance(GeminiStreamService::class, $mockStream);

    $response = $this->actingAs($user)->get(route('generate.humanize', ['generation' => $generation->id, 'preset' => 'conversational']));

    $response->assertSuccessful();
    expect($response->headers->get('Content-Type'))->toContain('text/event-stream');

    $content = $response->streamedContent();
    expect($content)
        ->toContain('data: {"token":"Humanized "}')
        ->toContain('data: {"token":"token."}')
        ->toContain('data: {"done":true}');
});

test('users cannot humanize generation with no content', function () {
    $user = User::factory()->withApiKey('gemini')->create();
    $generation = Generation::factory()->create([
        'user_id' => $user->id,
        'status' => 'pending',
        'ai_content' => null,
        'edited_content' => null,
    ]);

    $response = $this->actingAs($user)->get(route('generate.humanize', $generation->id));

    $response->assertStatus(400);
});

test('users cannot stream humanizer for another user generation', function () {
    $user = User::factory()->withApiKey('gemini')->create();
    $otherUser = User::factory()->create();
    $generation = Generation::factory()->create([
        'user_id' => $otherUser->id,
        'status' => 'completed',
        'ai_content' => 'Secret content',
    ]);

    $response = $this->actingAs($user)->get(route('generate.humanize', $generation->id));

    $response->assertForbidden();
});
