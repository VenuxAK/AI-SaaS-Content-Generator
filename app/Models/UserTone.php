<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int|null $user_id
 * @property string $name
 * @property string $description
 * @property bool $is_system
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['user_id', 'name', 'description', 'is_system'])]
class UserTone extends Model
{
    use HasFactory;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'is_system' => 'boolean',
        ];
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Scope to find tones available to a given user (system presets + personal custom tones).
     *
     * @param  Builder<UserTone>  $query
     * @return Builder<UserTone>
     */
    public function scopeAvailableFor($query, ?User $user = null)
    {
        return $query->where(function ($q) use ($user) {
            $q->where('is_system', true);
            if ($user) {
                $q->orWhere('user_id', $user->id);
            }
        });
    }
}
