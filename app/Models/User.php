<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Carbon;
use Laravel\Fortify\Contracts\PasskeyUser;
use Laravel\Fortify\PasskeyAuthenticatable;
use Laravel\Fortify\TwoFactorAuthenticatable;

/**
 * @property int $id
 * @property string $name
 * @property string $email
 * @property Carbon|null $email_verified_at
 * @property string $password
 * @property string|null $two_factor_secret
 * @property string|null $two_factor_recovery_codes
 * @property Carbon|null $two_factor_confirmed_at
 * @property string|null $remember_token
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable([
    'name',
    'email',
    'password',
    'gemini_api_key',
    'openai_api_key',
    'openrouter_api_key',
    'ai_provider',
    'ai_model',
])]
#[Hidden([
    'password',
    'two_factor_secret',
    'two_factor_recovery_codes',
    'remember_token',
    'gemini_api_key',
    'openai_api_key',
    'openrouter_api_key',
])]
class User extends Authenticatable implements PasskeyUser
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable, PasskeyAuthenticatable, TwoFactorAuthenticatable;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
            'is_admin' => 'boolean',
            'gemini_api_key' => 'encrypted',
            'openai_api_key' => 'encrypted',
            'openrouter_api_key' => 'encrypted',
        ];
    }

    /**
     * Get the active API key based on chosen ai_provider.
     */
    public function getActiveApiKey(): ?string
    {
        return match ($this->ai_provider ?? 'gemini') {
            'openai' => $this->openai_api_key,
            'openrouter' => $this->openrouter_api_key,
            default => $this->gemini_api_key,
        };
    }

    /**
     * Determine if the user has an active API key configured.
     */
    public function hasActiveApiKey(): bool
    {
        $key = $this->getActiveApiKey();

        return ! empty($key);
    }

    /**
     * Default model for a given provider.
     */
    public static function defaultModelFor(string $provider): string
    {
        return config("ai.providers.{$provider}.default_model") ?? match ($provider) {
            'openai' => 'gpt-4.5',
            'openrouter' => 'google/gemini-3.8-flash',
            default => 'gemini-3.8-flash',
        };
    }

    /**
     * Get the active model for this user.
     */
    public function getActiveModel(): string
    {
        if (! empty($this->ai_model)) {
            return $this->ai_model;
        }

        return self::defaultModelFor($this->ai_provider ?? 'gemini');
    }

    /**
     * Mask an API key for safe UI display (e.g. ••••••••••••abcd).
     */
    public function getMaskedApiKey(string $provider): ?string
    {
        $key = match ($provider) {
            'openai' => $this->openai_api_key,
            'openrouter' => $this->openrouter_api_key,
            default => $this->gemini_api_key,
        };

        if (empty($key)) {
            return null;
        }

        $length = strlen($key);
        if ($length <= 8) {
            return '••••••••';
        }

        $last4 = substr($key, -4);

        return str_repeat('•', 12).$last4;
    }

    /**
     * Get public status for all providers.
     *
     * @return array<string, array{configured: bool, masked: ?string}>
     */
    public function getApiKeysStatus(): array
    {
        return [
            'gemini' => [
                'configured' => ! empty($this->gemini_api_key),
                'is_set' => ! empty($this->gemini_api_key),
                'masked' => $this->getMaskedApiKey('gemini'),
            ],
            'openai' => [
                'configured' => ! empty($this->openai_api_key),
                'is_set' => ! empty($this->openai_api_key),
                'masked' => $this->getMaskedApiKey('openai'),
            ],
            'openrouter' => [
                'configured' => ! empty($this->openrouter_api_key),
                'is_set' => ! empty($this->openrouter_api_key),
                'masked' => $this->getMaskedApiKey('openrouter'),
            ],
        ];
    }

    /**
     * @return HasMany<UserTone, $this>
     */
    public function tones(): HasMany
    {
        return $this->hasMany(UserTone::class);
    }

    /**
     * @return HasMany<Generation, $this>
     */
    public function generations(): HasMany
    {
        return $this->hasMany(Generation::class);
    }
}
