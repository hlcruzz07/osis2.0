<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Address extends Model
{
    protected $fillable = [
        'student_id',
        'street',
        'barangay',
        'city',
        'province',
        'zip_code',
        'street_hash',
        'barangay_hash',
        'city_hash',
        'province_hash',
        'zip_code_hash',
    ];

    protected $casts = [
        'street' => 'encrypted',
        'barangay' => 'encrypted',
        'city' => 'encrypted',
        'province' => 'encrypted',
        'zip_code' => 'encrypted',
    ];

    public function student()
    {
        return $this->belongsTo(Student::class, 'student_id');
    }
}
