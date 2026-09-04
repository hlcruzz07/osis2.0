<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StudentEconomicProof extends Model
{
    protected $fillable = [
        'socio_economic_profile_id',
        'proof',
    ];

    protected $casts = [
        'proof' => 'encrypted',
    ];

    public function socioEconomicProfile()
    {
        return $this->belongsTo(StudentSocioEconomicProfile::class, 'socio_economic_profile_id');
    }
}
