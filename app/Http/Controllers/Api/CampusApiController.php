<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Services\HashService;

class CampusApiController extends Controller
{
    public function __construct(protected Student $model) {}

    public function fetchColleges(string $campus)
    {
        $response = $this->model::query()
            ->where('campus_hash', HashService::make($campus))
            ->get(['college'])
            ->pluck('college')
            ->filter()
            ->unique()
            ->sort()
            ->values();

        return response()->json($response);
    }

    public function fetchCourses(string $campus, string $college)
    {
        $response = $this->model::query()
            ->where('campus_hash', HashService::make($campus))
            ->where('college_hash', HashService::make($college))
            ->get(['program_applied'])
            ->pluck('program_applied')
            ->filter()
            ->unique()
            ->sort()
            ->values();

        return response()->json($response);
    }

    public function fetchMajors(string $campus, string $college, string $course)
    {
        $response = $this->model::query()
            ->where('campus_hash', HashService::make($campus))
            ->where('college_hash', HashService::make($college))
            ->where('program_applied_hash', HashService::make($course))
            ->get(['major'])
            ->pluck('major')
            ->filter()
            ->unique()
            ->sort()
            ->values();

        return response()->json($response);
    }
}
