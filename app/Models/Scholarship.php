<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Scholarship extends Model
{
    protected $fillable = [
        'student_id',
        'name',
        'name_hash',
    ];

    protected $casts = [
        'name' => 'encrypted',
    ];

    public function student()
    {
        return $this->belongsTo(Student::class, 'student_id');
    }
}
