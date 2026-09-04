<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AcademicYearSemester extends Model
{
    protected $fillable = [
        'academic_year',
        'semester',
    ];

    protected $casts = [
        'academic_year' => 'encrypted',
        'semester' => 'encrypted',
    ];
}
