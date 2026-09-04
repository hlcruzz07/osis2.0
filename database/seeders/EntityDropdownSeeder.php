<?php

namespace Database\Seeders;

use App\Models\EntityDropdown;
use Illuminate\Database\Seeder;

class EntityDropdownSeeder extends Seeder
{
    public function run(): void
    {
        $dropdowns = [

            'ENTRY STATUS' => [
                'Regular',
                'Transferee',
                'Returnee',
                'Shiftee',
                'Returnee - Shiftee',
            ],
            'SUFFIX' => [
                'JR.',
                'SR.',
                'II',
                'III',
                'IV',
                'V',
                'NONE',
            ],
            'GENDER' => [
                'Male',
                'Female',

            ],
            'SEXUAL ORIENTATION' => [
                'Heterosexual/Straight',
                'Lesbian',
                'Gay',
                'Bisexual',
                'Transgender',
                'Rather Not Say',
            ],
            'CIVIL STATUS' => [
                'Single',
                'Married',
            ],
            'HIGHEST EDUCATIONAL ATTAINTMENT' => [
                'No Formal Education',
                'Elementary Graduate',
                'High School Graduate',
                'Vocational',
                'College Level',
                'College Graduate',
                'Post Graduate',
            ],
            'SCHOLARSHIP PROGRAM' => [
                'CHED MERIT SCHOLARSHIP PROGRAM (CMSP)',
                'TERTIARY EDUCATION SUBSIDY (TES)',
                'TULONG DUNONG PROGRAM (TDP)',
                'NOSP',
                'SGS',
                'DOST',
                'OTHERS',
            ],

            'SCHOOL TYPE' => [
                'Public',
                'Private',
            ],

            'CAMPUS DIRECTORY' => [
                [
                    'campus' => 'Talisay',
                    'colleges' => [
                        [
                            'code' => 'CAS',
                            'name' => 'College of Arts & Sciences',
                            'programs' => [
                                [
                                    'name' => 'Ba In English Language',
                                    'majors' => [],
                                ],
                                [
                                    'name' => 'Ba In Social Science',
                                    'majors' => [],
                                ],
                                [
                                    'name' => 'B Of Public Administration',
                                    'majors' => [],
                                ],
                                [
                                    'name' => 'Bs In Applied Mathematics',
                                    'majors' => [],
                                ],
                                [
                                    'name' => 'Bs In Psychology',
                                    'majors' => [],
                                ],
                                [
                                    'name' => 'M In Public Administration',
                                    'majors' => [
                                        'Human Resource Management',
                                        'Urban Planning and Management',
                                    ],
                                ],
                                [
                                    'name' => 'D In Public Administration',
                                    'majors' => ['Professional Track'],
                                ],
                            ],
                        ],
                        [
                            'code' => 'CBMA',
                            'name' => 'College of Business Management & Accountancy',
                            'programs' => [
                                [
                                    'name' => 'Bs In Hospitality Management',
                                    'majors' => [],
                                ],
                            ],
                        ],
                        [
                            'code' => 'CCS',
                            'name' => 'College of Computer Studies',
                            'programs' => [
                                [
                                    'name' => 'Bs In Information Systems',
                                    'majors' => [],
                                ],
                            ],
                        ],
                        [
                            'code' => 'COED',
                            'name' => 'College of Education',
                            'programs' => [
                                [
                                    'name' => 'B Of Early Childhood Educ',
                                    'majors' => [],
                                ],
                                [
                                    'name' => 'B Of Elementary Education',
                                    'majors' => ['General Education'],
                                ],
                                [
                                    'name' => 'B Of Physical Education',
                                    'majors' => [],
                                ],
                                [
                                    'name' => 'B Of Secondary Education',
                                    'majors' => [
                                        'English',
                                        'Filipino',
                                        'Mathematics',
                                        'Science',
                                    ],
                                ],
                                [
                                    'name' => 'B Of Special Needs Education',
                                    'majors' => ['Generalist'],
                                ],
                                [
                                    'name' => 'B Of Technology & Livelihood Education',
                                    'majors' => ['Home Economics', 'Industrial'],
                                ],
                                [
                                    'name' => 'Teacher Certificate Program (Supplementals)',
                                    'majors' => [],
                                ],
                                [
                                    'name' => 'M Of Arts In Education',
                                    'majors' => ['Educational Management'],
                                ],
                                [
                                    'name' => 'M Of Arts In Education (Academic Track)',
                                    'majors' => [
                                        'Educational Management',
                                        'English',
                                        'General Science',
                                        'Mathematics',
                                        'Physical Education',
                                        'Technology and Livelihood Education',
                                    ],
                                ],
                                [
                                    'name' => 'D Of Education',
                                    'majors' => ['Educational Management'],
                                ],
                            ],
                        ],
                        [
                            'code' => 'COE',
                            'name' => 'College of Engineering',
                            'programs' => [
                                [
                                    'name' => 'Bs In Civil Engineering',
                                    'majors' => [],
                                ],
                            ],
                        ],
                        [
                            'code' => 'CIT',
                            'name' => 'College of Industrial Technology',
                            'programs' => [
                                [
                                    'name' => 'B Of Industrial Technology',
                                    'majors' => [
                                        'Apparel & Fashion Technology',
                                        'Architectural Drafting Technology',
                                        'Automotive Technology',
                                        'Culinary Technology',
                                        'Electrical Technology',
                                        'Electronics Technology',
                                        'HVACR Technology',
                                        'Mechanical Technology',
                                    ],
                                ],
                                [
                                    'name' => 'Bs In Industrial Technology',
                                    'majors' => [
                                        'Apparel & Fashion Technology',
                                        'Architectural Drafting Technology',
                                        'Automotive Technology',
                                        'Culinary Technology',
                                        'Electrical Technology',
                                        'Electronics Technology',
                                        'HVACR Technology',
                                        'Mechanical Technology',
                                    ],
                                ],
                                [
                                    'name' => 'M In Technology Management',
                                    'majors' => [],
                                ],
                                [
                                    'name' => 'D In Philosophy In Technology Management',
                                    'majors' => [],
                                ],
                            ],
                        ],
                    ],
                ],

                [
                    'campus' => 'Binalbagan',
                    'colleges' => [
                        [
                            'code' => 'CBMA',
                            'name' => 'College of Business Management & Accountancy',
                            'programs' => [
                                [
                                    'name' => 'Bs In Business Administration',
                                    'majors' => ['Financial Management'],
                                ],
                            ],
                        ],
                        [
                            'code' => 'CCS',
                            'name' => 'College of Computer Studies',
                            'programs' => [
                                [
                                    'name' => 'Bs In Information Technology',
                                    'majors' => [],
                                ],
                            ],
                        ],
                        [
                            'code' => 'CCJ',
                            'name' => 'College of Criminal Justice',
                            'programs' => [
                                [
                                    'name' => 'Bs In Criminology',
                                    'majors' => [],
                                ],
                            ],
                        ],
                        [
                            'code' => 'COED',
                            'name' => 'College of Education',
                            'programs' => [
                                [
                                    'name' => 'B Of Elementary Education',
                                    'majors' => ['General Education'],
                                ],
                                [
                                    'name' => 'B Of Secondary Education',
                                    'majors' => ['Science'],
                                ],
                                [
                                    'name' => 'B Of Technology & Livelihood Education',
                                    'majors' => ['Home Economics'],
                                ],
                            ],
                        ],
                        [
                            'code' => 'COF',
                            'name' => 'College of Fisheries',
                            'programs' => [
                                [
                                    'name' => 'Bs In Fisheries',
                                    'majors' => [],
                                ],
                            ],
                        ],
                    ],
                ],

                [
                    'campus' => 'Fortune Towne',
                    'colleges' => [
                        [
                            'code' => 'CBMA',
                            'name' => 'College of Business Management & Accountancy',
                            'programs' => [
                                [
                                    'name' => 'Bs In Accountancy',
                                    'majors' => [],
                                ],
                                [
                                    'name' => 'Bs In Business Administration',
                                    'majors' => ['Financial Management'],
                                ],
                                [
                                    'name' => 'Bs In Entrepreneurship',
                                    'majors' => [],
                                ],
                                [
                                    'name' => 'Bs In Management Accounting',
                                    'majors' => [],
                                ],
                                [
                                    'name' => 'Bs In Office Administration',
                                    'majors' => [],
                                ],
                                [
                                    'name' => 'M Of Business Administration',
                                    'majors' => [],
                                ],
                                [
                                    'name' => 'M Of Public Administration',
                                    'majors' => [],
                                ],
                            ],
                        ],
                        [
                            'code' => 'CCS',
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

                [
                    'campus' => 'Alijis',
                    'colleges' => [
                        [
                            'code' => 'CCS',
                            'name' => 'College of Computer Studies',
                            'programs' => [
                                [
                                    'name' => 'Bs In Information Systems',
                                    'majors' => [],
                                ],
                                [
                                    'name' => 'Bs In Information Technology',
                                    'majors' => [],
                                ],
                            ],
                        ],
                        [
                            'code' => 'COE',
                            'name' => 'College of Engineering',
                            'programs' => [
                                [
                                    'name' => 'Bs In Computer Engineering',
                                    'majors' => [],
                                ],
                                [
                                    'name' => 'Bs In Electronics Engineering',
                                    'majors' => [],
                                ],
                            ],
                        ],
                        [
                            'code' => 'CIT',
                            'name' => 'College of Industrial Technology',
                            'programs' => [
                                [
                                    'name' => 'B Of Industrial Technology',
                                    'majors' => [
                                        'Architectural Drafting Technology',
                                        'Automotive Technology',
                                        'Computer Technology',
                                        'Culinary Technology',
                                        'Electrical Technology',
                                        'Electronics Technology',
                                        'Mechanical Technology',
                                    ],
                                ],
                                [
                                    'name' => 'Bs In Industrial Technology',
                                    'majors' => [
                                        'Architectural Drafting Technology',
                                        'Automotive Technology',
                                        'Computer Technology',
                                        'Culinary Technology',
                                        'Electrical Technology',
                                        'Electronics Technology',
                                        'Mechanical Technology',
                                    ],
                                ],
                            ],
                        ],
                        [
                            'code' => 'COED',
                            'name' => 'College of Education',
                            'programs' => [
                                [
                                    'name' => 'B Of Technical Vocational Teacher Education',
                                    'majors' => [
                                        'Electrical Technology',
                                        'Electronics Technology',
                                    ],
                                ],
                            ],
                        ],
                    ],
                ],
            ],
        ];

        foreach ($dropdowns as $name => $codes) {
            EntityDropdown::create([
                'name' => $name,
                'dropdowns' => $codes,
            ]);
        }
    }
}
