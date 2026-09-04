<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\AsEncryptedArrayObject;
use Illuminate\Database\Eloquent\Model;

class EntityDropdown extends Model
{
    protected $fillable = [
        'name',
        'dropdowns',
    ];

    protected $casts = [
        'name' => 'encrypted',
        'dropdowns' => AsEncryptedArrayObject::class,
    ];
}
