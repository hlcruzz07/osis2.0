<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SocioEconomicCategory extends Model
{
    protected $fillable = [
        'code',
        'name',
        'description',
        'with_id',
    ];

    protected $casts = [
        'code' => 'encrypted',
        'name' => 'encrypted',
        'description' => 'encrypted',
        'with_id' => 'boolean',
    ];

    public function studentSocioEconomicProfiles()
    {
        return $this->hasMany(StudentSocioEconomicProfile::class);
    }
}
