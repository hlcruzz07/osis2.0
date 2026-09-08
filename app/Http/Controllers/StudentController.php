<?php

namespace App\Http\Controllers;

use App\Enums\StudentStatus;
use App\Http\Requests\StoreStudentRequest;
use App\Jobs\SyncStudentToLegacyRecordJob;
use App\Jobs\UploadFileToGoogleDriveJob;
use App\Models\Student;
use App\Models\StudentEconomicProof;
use App\Repositories\StudentRepo;
use App\Services\HashService;
use App\Services\ImageCompressionService;
use App\Services\StudentStoreRecordService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class StudentController extends Controller
{
    public function __construct(
        protected StudentRepo $studentRepo,
        protected ImageCompressionService $imageCompressor,
    ) {
    }

    public function index()
    {
        $stats = [
            'total' => Student::count(),
            'new_this_week' => Student::where('created_at', '>=', now()->subWeek())->count(),
            'pending_review' => Student::whereHas('socioEconomicProfile', function ($query) {
                $query->where('status', 1);
            })->count(),
            'with_scholarship' => Student::whereHas('scholarships')->count(),
        ];

        return Inertia::render('admin/students/index', [
            'stats' => $stats,
            'status' => StudentStatus::cases(),
        ]);
    }

    public function store(StoreStudentRequest $request)
    {
        try {
            $data = $request->validated();

            $academicPeriod = $this->resolveAcademicPeriod();
            $data['academic_year'] = $academicPeriod['academic_year'];
            $data['semester'] = $academicPeriod['semester'];

            $uploads = [];
            $campus = $data['campus'];

            $tempDir = storage_path('app/private/temp');

            if (!is_dir($tempDir)) {
                mkdir($tempDir, 0755, true);
            }

            DB::transaction(function () use ($data, &$uploads, &$campus, $tempDir) {

                $student = $this->studentRepo->updateOrCreate($data);

                $student->socioEconomicProfile()->delete();
                $student->scholarships()->delete();
                $student->address()->delete();

                $addressHashes = HashService::forFields($data['address'], [
                    'street',
                    'barangay',
                    'city',
                    'province',
                    'zip_code',
                ]);

                $student->address()->create(array_merge($data['address'], $addressHashes));

                if (!empty($data['scholarships'])) {
                    $student->scholarships()->createMany(
                        array_map(
                            fn(string $scholarship) => [
                                'name' => $scholarship,
                                'name_hash' => HashService::make($scholarship),
                            ],
                            $data['scholarships']
                        )
                    );
                }

                if (!empty($data['socio_economic_profile'])) {
                    foreach ($data['socio_economic_profile'] as $profile) {

                        $economicProfile = $student->socioEconomicProfile()->create([
                            'socio_economic_category_id' => $profile['socio_economic_category_id'],
                            'id_number' => $profile['id_number'] ?? null,
                            'status' => $profile['status'],
                        ]);

                        foreach ($profile['student_economic_proofs'] ?? [] as $proofData) {
                            $proofFile = $proofData['proof'];

                            $proofFilename = Str::random(40) . '.' . $proofFile->getClientOriginalExtension();
                            $proofFile->move($tempDir, $proofFilename);

                            $proofPath = $tempDir . DIRECTORY_SEPARATOR . $proofFilename;
                            $this->imageCompressor->compress($proofPath);

                            $economicProof = $economicProfile->economicProofs()->create([
                                'proof' => null,
                            ]);

                            $uploads[] = [
                                'model' => StudentEconomicProof::class,
                                'id' => $economicProof->id,
                                'field' => 'proof',
                                'path' => $proofPath,
                                'filename' => $proofFile->getClientOriginalName(),
                            ];
                        }
                    }
                }

                $freshStudent = $student->load(['address', 'socioEconomicProfile']);

                try {
                    app(StudentStoreRecordService::class)->sync($freshStudent);
                } catch (\Throwable $e) {
                    Log::warning('Immediate legacy sync failed, falling back to queued retry', [
                        'student_id' => $student->id,
                        'message' => $e->getMessage(),
                    ]);

                    SyncStudentToLegacyRecordJob::dispatch($student->id);
                }

            });

            if (!empty($uploads)) {
                UploadFileToGoogleDriveJob::dispatch($uploads, $campus);
            }


            return redirect()->route('home')->with('success', 'Student Information Submitted Successfully');
        } catch (\Throwable $th) {
            Log::error('Student store failed', [
                'message' => $th->getMessage(),
                'trace' => $th->getTraceAsString(),
            ]);

            return back()->with('error', 'Something went wrong. Please try again later.');
        }
    }

    private function resolveAcademicPeriod(): array
    {
        $now = Carbon::now();
        $month = $now->month;
        $year = $now->year;

        // August to December: Active 1st Semester of the current year
        if ($month >= 8 && $month <= 12) {
            $startYear = $year;
            $semester = '1st Semester';
        }
        // January to July: Active 2nd Semester (Jan-May) + Summer gap (June-July) mapped to 2nd Sem
        else {
            $startYear = $year - 1;
            $semester = '2nd Semester';
        }

        return [
            'academic_year' => $startYear . '-' . ($startYear + 1),
            'semester' => $semester,
        ];
    }

    public function updateStatus(Request $request, int $id)
    {
        $validated = $request->validate([
            'status' => ['required', 'integer', Rule::in([0, 1, 2])],
        ]);

        $student = $this->studentRepo->find($id);

        if (!$student) {
            return response()->json([
                'message' => 'Student not found.',
            ], 404);
        }

        $student->timestamps = false;

        $student->update([
            'status' => $validated['status'],
        ]);

        return response()->json([
            'message' => 'Student status updated.',
            'student' => $student->fresh(),
        ]);
    }

    public function syncAll()
    {
        $count = Student::whereNull('synced_at')->count();

        Student::whereNull('synced_at')
            ->select('id')
            ->chunkById(100, function ($students) {
                foreach ($students as $student) {
                    SyncStudentToLegacyRecordJob::dispatch($student->id);
                }
            });

        return back()->with('success', "Queued {$count} student(s) for data syncing.");
    }
}
