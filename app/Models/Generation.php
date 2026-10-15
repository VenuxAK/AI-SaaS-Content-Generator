<?php

namespace App\Models;

use App\Enums\ContentType;
use App\Enums\OutputLanguage;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $user_id
 * @property int|null $tone_id
 * @property ContentType $content_type
 * @property OutputLanguage $output_language
 * @property string $user_prompt
 * @property string|null $tone_snapshot
 * @property string $full_prompt
 * @property string|null $ai_content
 * @property string|null $edited_content
 * @property int $credits_used
 * @property string $status
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable([
    'user_id',
    'tone_id',
    'content_type',
    'output_language',
    'ai_provider',
    'ai_model',
    'user_prompt',
    'tone_snapshot',
    'full_prompt',
    'ai_content',
    'edited_content',
    'status',
])]
class Generation extends Model
{
    use HasFactory;

    /**
     * The accessors to append to the model's array form.
     *
     * @var list<string>
     */
    protected $appends = ['title'];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'content_type' => ContentType::class,
            'output_language' => OutputLanguage::class,
        ];
    }

    /**
     * Get the derived content title.
     */
    public function getTitleAttribute(): string
    {
        $content = $this->edited_content ?: $this->ai_content;

        if ($content) {
            // 1. Look for markdown H1 or H2 header: '# Title' or '## Title'
            if (preg_match('/^#{1,3}\s+(.+)$/m', $content, $matches)) {
                $clean = trim($matches[1]);
                $clean = (string) preg_replace('/[*_`#]/', '', $clean);
                if (! empty($clean)) {
                    return $clean;
                }
            }

            // 2. Look for bold title at start: '**Title**'
            if (preg_match('/^\*\*([^*]+)\*\*/m', $content, $matches)) {
                $clean = trim($matches[1]);
                if (! preg_match('/^(Meta Description|Estimated Reading Time|Reading Time|ခန့်မှန်းဖတ်ရှုချိန်)/i', $clean) && ! empty($clean)) {
                    return rtrim($clean, ':');
                }
            }

            // 3. Fallback to first non-empty line of content that isn't a divider or metadata
            $lines = explode("\n", $content);
            foreach ($lines as $line) {
                $trimmed = trim($line);
                if (empty($trimmed) || str_starts_with($trimmed, '---') || str_starts_with($trimmed, '>') || preg_match('/^(Meta Description|Estimated Reading Time)/i', $trimmed)) {
                    continue;
                }
                $clean = trim((string) preg_replace('/[*_`#]/', '', $trimmed));
                if (! empty($clean) && mb_strlen($clean) >= 5) {
                    return mb_substr($clean, 0, 120);
                }
            }
        }

        // 4. Fallback: extract title from user_prompt
        if (preg_match('/(?:titled|title|about)\s*["\']([^"\']+)["\']/i', $this->user_prompt, $matches)) {
            return trim($matches[1]);
        }

        if (preg_match('/"([^"]{5,80})"/', $this->user_prompt, $matches)) {
            return trim($matches[1]);
        }

        $promptClean = (string) preg_replace('/^(?:Write|Create|Draft|Generate)\s+(?:a|an)\s+[^.]+?(?:about|on|for|titled)\s+/i', '', $this->user_prompt);

        return mb_substr(trim($promptClean), 0, 100);
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return BelongsTo<UserTone, $this>
     */
    public function tone(): BelongsTo
    {
        return $this->belongsTo(UserTone::class);
    }
}
