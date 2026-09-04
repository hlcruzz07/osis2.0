<?php

namespace Database\Factories;

use App\Enums\StudentEconomicStatus;
use App\Enums\StudentStatus;
use App\Enums\StudentType;
use App\Models\AcademicYearSemester;
use App\Models\EntityDropdown;
use App\Models\SocioEconomicCategory;
use App\Models\Student;
use App\Services\HashService;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Student>
 */
class StudentFactory extends Factory
{
    public function definition(): array
    {
        $campusDirectory = $this->dropdown('CAMPUS DIRECTORY') ?: [
            [
                'campus' => 'Talisay',
                'colleges' => [
                    [
                        'name' => 'College of Computer Studies',
                        'programs' => [
                            [
                                'name' => 'Bs In Information Systems',
                                'majors' => [],
                            ],
                        ],
                    ],
                ],
            ],
        ];
        $campusRecord = $this->faker->randomElement($campusDirectory);
        $collegeRecord = $this->faker->randomElement($campusRecord['colleges']);
        $programRecord = $this->faker->randomElement($collegeRecord['programs']);
        $entryStatuses = $this->dropdown('ENTRY STATUS') ?: array_map(
            fn (StudentType $status): string => $status->value,
            StudentType::cases()
        );
        $educationLevels = ['Elementary', 'High School', 'Vocational', "Bachelor's Degree", "Master's Degree", 'Doctorate', 'None'];
        $occupations = ['Teacher', 'Farmer', 'Driver', 'Nurse', 'Engineer', 'Business Owner', 'OFW', 'Government Employee', 'Unemployed', 'Vendor'];
        $shsTypes = ['Public', 'Private'];
        $collegeTypes = ['Public', 'Private', 'State University'];

        $fname = $this->faker->firstName();
        $mname = $this->faker->optional(0.8)->lastName();
        $lname = $this->faker->lastName();
        $suffix = $this->faker->optional(0.05)->randomElement(['Jr', 'Sr', 'II', 'III', 'IV', 'V']);
        $birthdate = $this->faker->dateTimeBetween('-30 years', '-16 years')->format('Y-m-d');
        $birthplace = $this->faker->city().', '.$this->faker->country();
        $gender = $this->faker->randomElement($this->dropdown('GENDER') ?: ['Male', 'Female']);
        $sexualOrientation = $this->faker->randomElement($this->dropdown('SEXUAL ORIENTATION') ?: ['Heterosexual/Straight']);
        $civilStatus = $this->faker->randomElement($this->dropdown('CIVIL STATUS') ?: ['Single', 'Married']);
        $email = $this->faker->unique()->safeEmail();
        $contactNumber = '09'.$this->faker->numerify('#########');
        $campus = $campusRecord['campus'];
        $college = $collegeRecord['name'];
        $programApplied = $programRecord['name'];
        $major = $programRecord['majors'] !== []
            ? $this->faker->randomElement($programRecord['majors'])
            : null;
        $yearSection = $this->faker->numberBetween(1, 4).'-'.$this->faker->randomElement(['A', 'B', 'C', 'D']);
        $entryStatus = $this->faker->randomElement($entryStatuses);
        $dateAdmitted = $this->faker->dateTimeBetween('-5 years', 'now')->format('Y-m-d');

        // Father
        $fFname = $this->faker->optional(0.9)->firstName('male');
        $fMname = $this->faker->optional(0.6)->lastName();
        $fLname = $this->faker->optional(0.9)->lastName();
        $fOccupation = $this->faker->optional(0.8)->randomElement($occupations);
        $fHighestEducation = $this->faker->optional(0.8)->randomElement($educationLevels);

        // Mother
        $mFname = $this->faker->optional(0.9)->firstName('female');
        $mMname = $this->faker->optional(0.6)->lastName();
        $mLname = $this->faker->optional(0.9)->lastName();
        $mOccupation = $this->faker->optional(0.8)->randomElement($occupations);
        $mHighestEducation = $this->faker->optional(0.8)->randomElement($educationLevels);

        // Spouse (only relevant if married — kept optional/low probability regardless)
        $sFname = $civilStatus === 'Married' ? $this->faker->optional(0.9)->firstName() : null;
        $sMname = $civilStatus === 'Married' ? $this->faker->optional(0.5)->lastName() : null;
        $sLname = $civilStatus === 'Married' ? $this->faker->optional(0.9)->lastName() : null;
        $sOccupation = $civilStatus === 'Married' ? $this->faker->optional(0.7)->randomElement($occupations) : null;
        $sHighestEducation = $civilStatus === 'Married' ? $this->faker->optional(0.7)->randomElement($educationLevels) : null;

        // Senior High School
        $shsName = $this->faker->optional(0.9)->company().' Senior High School';
        $shsAddress = $this->faker->optional(0.9)->address();
        $shsYear = $this->faker->optional(0.9)->year();
        $shsType = $this->faker->optional(0.9)->randomElement($shsTypes);

        // College (only relevant for transferees/shiftees, still generated generally)
        $cName = $this->faker->optional(0.3)->company().' College';
        $cAddress = $this->faker->optional(0.3)->address();
        $cYear = $this->faker->optional(0.3)->year();
        $cType = $this->faker->optional(0.3)->randomElement($collegeTypes);
        $status = $this->faker->randomElement(array_column(StudentStatus::cases(), 'value'));

        return [
            'academic_year' => AcademicYearSemester::first()->academic_year,
            'semester' => AcademicYearSemester::first()->semester,
            'campus' => $campus,
            'fname' => $fname,
            'mname' => $mname,
            'lname' => $lname,
            'suffix' => $suffix,
            'birthdate' => $birthdate,
            'birthplace' => $birthplace,
            'gender' => $gender,
            'sexual_orientation' => $sexualOrientation,
            'civil_status' => $civilStatus,
            'email' => $email,
            'contact_number' => $contactNumber,
            'course' => $programApplied,
            'college' => $college,
            'program_applied' => $programApplied,
            'major' => $major,
            'year_section' => $yearSection,
            'entry_status' => $entryStatus,
            'date_admitted' => $dateAdmitted,

            'f_fname' => $fFname,
            'f_mname' => $fMname,
            'f_lname' => $fLname,
            'f_occupation' => $fOccupation,
            'f_highest_education' => $fHighestEducation,

            'm_fname' => $mFname,
            'm_mname' => $mMname,
            'm_lname' => $mLname,
            'm_occupation' => $mOccupation,
            'm_highest_education' => $mHighestEducation,

            's_fname' => $sFname,
            's_mname' => $sMname,
            's_lname' => $sLname,
            's_occupation' => $sOccupation,
            's_highest_education' => $sHighestEducation,

            'shs_name' => $shsName,
            'shs_address' => $shsAddress,
            'shs_year' => $shsYear,
            'shs_type' => $shsType,

            'c_name' => $cName,
            'c_address' => $cAddress,
            'c_year' => $cYear,
            'c_type' => $cType,
            'status' => $status,
            'created_at' => $this->faker->dateTimeBetween('-1 year', 'now'),
            'updated_at' => $this->faker->dateTimeBetween('-1 year', 'now'),
        ];
    }

    public function configure(): static
    {
        return $this->afterMaking(function (Student $student): void {
            $student->applyHashedFields();
        })->afterCreating(function (Student $student): void {
            $address = [
                'street' => $this->faker->streetAddress(),
                'barangay' => $this->faker->streetName(),
                'city' => $this->faker->city(),
                'province' => $this->faker->state(),
                'zip_code' => $this->faker->numerify('####'),
            ];

            $student->address()->create(array_merge(
                $address,
                collect($address)->mapWithKeys(
                    fn (string $value, string $field): array => ["{$field}_hash" => HashService::make($value)]
                )->all()
            ));

            $scholarship = $this->faker->optional(0.35)->randomElement(
                $this->dropdown('SCHOLARSHIP PROGRAM')
            );

            if ($scholarship) {
                $student->scholarships()->create([
                    'name' => $scholarship,
                    'name_hash' => HashService::make($scholarship),
                ]);
            }

            $category = SocioEconomicCategory::query()->inRandomOrder()->first();

            if ($category) {
                $student->socioEconomicProfile()->create([
                    'socio_economic_category_id' => $category->id,
                    'id_number' => $category->with_id ? $this->faker->numerify('############') : null,
                    'status' => $this->faker->randomElement(
                        array_column(StudentEconomicStatus::cases(), 'value')
                    ),
                ]);
            }
        });
    }

    private function dropdown(string $name): array
    {
        $dropdown = EntityDropdown::all()->first(
            fn (EntityDropdown $item): bool => $item->name === $name
        );

        return $dropdown?->dropdowns?->toArray() ?? [];
    }
}
