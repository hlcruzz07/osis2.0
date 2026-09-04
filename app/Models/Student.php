<?php

namespace App\Models;

use App\Enums\StudentStatus;
use App\Traits\HasHashedFields;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    use HasFactory, HasHashedFields;

    public array $hashable = [];

    public function __construct(array $attributes = [])
    {
        parent::__construct($attributes);

        $this->hashable = $this->fillable;
    }

    protected $fillable = [
        'semester',
        'academic_year',
        'fname',
        'mname',
        'lname',
        'suffix',
        'course',
        'year_section',
        'birthdate',
        'birthplace',
        'gender',
        'sexual_orientation',
        'civil_status',
        'email',
        'contact_number',
        'campus',
        'college',
        'program_applied',
        'major',
        'entry_status',
        'date_admitted',
        'f_fname',
        'f_mname',
        'f_lname',
        'f_occupation',
        'f_highest_education',
        'm_fname',
        'm_mname',
        'm_lname',
        'm_occupation',
        'm_highest_education',
        's_fname',
        's_mname',
        's_lname',
        's_occupation',
        's_highest_education',
        'shs_name',
        'shs_address',
        'shs_year',
        'shs_type',
        'c_name',
        'c_address',
        'c_year',
        'c_type',
        'status',
    ];

    protected $casts = [
        'semester' => 'encrypted',
        'academic_year' => 'encrypted',
        'fname' => 'encrypted',
        'mname' => 'encrypted',
        'lname' => 'encrypted',
        'suffix' => 'encrypted',
        'course' => 'encrypted',
        'year_section' => 'encrypted',
        'birthdate' => 'encrypted',
        'birthplace' => 'encrypted',
        'gender' => 'encrypted',
        'sexual_orientation' => 'encrypted',
        'civil_status' => 'encrypted',
        'email' => 'encrypted',
        'contact_number' => 'encrypted',
        'campus' => 'encrypted',
        'college' => 'encrypted',
        'program_applied' => 'encrypted',
        'major' => 'encrypted',
        'entry_status' => 'encrypted',
        'date_admitted' => 'encrypted',
        'f_fname' => 'encrypted',
        'f_mname' => 'encrypted',
        'f_lname' => 'encrypted',
        'f_occupation' => 'encrypted',
        'f_highest_education' => 'encrypted',
        'm_fname' => 'encrypted',
        'm_mname' => 'encrypted',
        'm_lname' => 'encrypted',
        'm_occupation' => 'encrypted',
        'm_highest_education' => 'encrypted',
        's_fname' => 'encrypted',
        's_mname' => 'encrypted',
        's_lname' => 'encrypted',
        's_occupation' => 'encrypted',
        's_highest_education' => 'encrypted',
        'shs_name' => 'encrypted',
        'shs_address' => 'encrypted',
        'shs_year' => 'encrypted',
        'shs_type' => 'encrypted',
        'c_name' => 'encrypted',
        'c_address' => 'encrypted',
        'c_year' => 'encrypted',
        'c_type' => 'encrypted',
        'status' => StudentStatus::class,
    ];

    protected $attributes = [
        'status' => StudentStatus::PENDING,
    ];

    public function getHidden()
    {
        return array_merge(
            $this->hidden,
            array_map(fn ($f) => "{$f}_hash", $this->hashable)
        );
    }

    protected $appends = ['full_name', 'course_year_section', 'full_address'];

    public function fullName(): Attribute
    {
        return Attribute::make(
            get: fn () => trim(implode(' ', array_filter([
                $this->fname,
                $this->mname ? mb_strtoupper(mb_substr($this->mname, 0, 1)).'.' : null,
                $this->lname,
                $this->suffix ?: null,
            ])))
        );
    }

    public function fullAddress(): Attribute
    {
        return Attribute::make(
            get: fn () => trim(implode(', ', array_filter([
                $this->address?->street,
                $this->address?->barangay,
                $this->address?->city,
                $this->address?->province,
                $this->address?->zip_code,
            ])))
        );
    }

    public function courseYearSection(): Attribute
    {
        return Attribute::make(
            get: fn () => trim(implode(' ', array_filter([
                $this->course,
                $this->year_section,
            ])))
        );
    }

    public function socioEconomicProfile()
    {
        return $this->hasMany(StudentSocioEconomicProfile::class, 'student_id');
    }

    public function scholarships()
    {
        return $this->hasMany(Scholarship::class, 'student_id');
    }

    public function address()
    {
        return $this->hasOne(Address::class, 'student_id');
    }
}
