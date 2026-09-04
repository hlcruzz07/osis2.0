<?php

namespace Database\Seeders;

use App\Models\AcademicYearSemester;
use Illuminate\Database\Seeder;

class AcademicYearSemesterSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        AcademicYearSemester::create([
            'academic_year' => '2026-2027',
            'semester' => '2nd Semester',
        ]);
    }
}
