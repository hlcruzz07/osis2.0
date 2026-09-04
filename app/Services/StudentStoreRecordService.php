<?php

namespace App\Services;

use App\Models\Student;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class StudentStoreRecordService
{
    /**
     * Map of campus name -> legacy DB connection name.
     */
    protected const CAMPUS_CONNECTIONS = [
        'talisay' => 'tal_mysql',
        'alijis' => 'ali_mysql',
        'fortune towne' => 'ft_mysql',
        'binalbagan' => 'bin_mysql',
    ];

    /**
     * Sync a student's data into the legacy per-campus "record" table.
     *
     * @return bool True if the insert happened, false if the campus has no mapped connection.
     */
    public function sync(Student $student): bool
    {
        $connection = $this->resolveConnection($student->campus);

        if (! $connection) {
            return false;
        }

        DB::connection($connection)
            ->table('record')
            ->insert($this->buildRecordPayload($student));

        return true;
    }

    protected function resolveConnection(?string $campus): ?string
    {
        return self::CAMPUS_CONNECTIONS[strtolower($campus ?? '')] ?? null;
    }

    protected function buildRecordPayload(Student $student): array
    {
        $isFirstGen = $student->socioEconomicProfile
            ->where('socio_economic_category_id', 11)
            ->exists();

        $isIpOrIcc = $student->socioEconomicProfile
            ->where('socio_economic_category_id', 5)
            ->exists();

        $isBinalbagan = $student->campus === 'BINALBAGAN';

        return [
            'email' => strtolower($student->email),
            'campus' => $this->capitalize($student->campus) ?? '',
            'student_lastname' => strtoupper($student->lname),
            'student_firstname' => strtoupper($student->fname),
            'student_middlename' => $student->mname ?? ' ',
            'extension' => strtoupper($student->suffix ?? ''),
            'birthdate' => $student->birthdate,
            'gender' => $student->gender,
            'birthplace' => $student->birthplace,
            'street' => $student->address->street,
            'barangay' => 'Brgy. '.$student->address->barangay,
            'city' => $student->address->city,
            'zip_code' => $student->address->zip_code,
            'civilstatus' => $student->civil_status,
            'contact_number' => $student->mobile_num ? '0'.$student->mobile_num : '',

            'mother_lastname' => $student->m_lname,
            'mother_firstname' => $student->m_fname,
            'mother_middlename' => $student->m_mname ?? '',
            'mother_occupation' => $student->m_occupation ?? '',
            'mother_highest_educational_attainment' => $student->m_highest_education,

            'father_lastname' => $student->f_lname,
            'father_firstname' => $student->f_fname,
            'father_middlename' => $student->f_mname ?? '',
            'father_occupation' => $student->f_occupation ?? '',
            'father_highest_educational_attainment' => $student->f_highest_education,

            'year_admitted' => date('d/m/Y', strtotime($student->date_admitted)),
            'semester' => $student->semester === '1st Semester' ? 'First Semester' : 'Second Semester',
            'year' => $student->academic_year,
            'curriculum' => 'N/A',
            'lrn_no' => $student->lrn ?? '',

            'shs_name_of_school' => $student->shs_name ?? '',
            'shs_address_of_school' => $student->shs_address ?? '',
            'shs_school_year_attended' => $student->shs_year ?? '',
            'shs_school_type' => $student->shs_type ?? '',

            'c_name_of_school' => $student->c_name ?? '',
            'c_address_of_school' => $student->c_address ?? '',
            'c_school_year_attended' => $student->c_year ?? '',
            'college_school_type' => $student->c_type ?? '',

            'first_gen_student' => $isFirstGen ? '1' : '0',
            'ip_or_icc' => $isIpOrIcc
                ? ($isBinalbagan ? 'true' : '1')
                : ($isBinalbagan ? 'false' : '0'),
            'ip_or_icc_yes' => $isIpOrIcc
                ? ($isBinalbagan ? 'true' : '1')
                : ($isBinalbagan ? 'false' : '0'),
        ];
    }

    protected function capitalize(?string $value): ?string
    {
        return $value ? Str::title($value) : null;
    }
}
