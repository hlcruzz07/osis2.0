<?php

namespace App\Models;

use App\Enums\StudentEconomicStatus;
use Illuminate\Database\Eloquent\Model;

class StudentSocioEconomicProfile extends Model
{
    protected $fillable = [
        'student_id',
        'socio_economic_category_id',
        'id_number',
        'status',
    ];

    protected $casts = [
        'id_number' => 'encrypted',
        'status' => StudentEconomicStatus::class,
    ];

    protected $attributes = [
        'status' => StudentEconomicStatus::PENDING,
    ];

    public function student()
    {
        return $this->belongsTo(Student::class, 'student_id');
    }

    public function socioEconomicCategory()
    {
        return $this->belongsTo(SocioEconomicCategory::class, 'socio_economic_category_id');
    }

    public function economicProofs()
    {
        return $this->hasMany(StudentEconomicProof::class, 'socio_economic_profile_id');
    }
}
