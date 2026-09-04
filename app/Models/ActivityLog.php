<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ActivityLog extends Model
{
    protected $fillable = [
        'user_id',
        'action',
        'action_hash',
        'description',
        'ip_address',
        'browser',
    ];

    protected $casts = [
        'action' => 'encrypted',
        'description' => 'encrypted',
        'ip_address' => 'encrypted',
        'browser' => 'encrypted',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
