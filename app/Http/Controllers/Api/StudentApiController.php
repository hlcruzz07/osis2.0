<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Services\HashService;
use Illuminate\Http\Request;

class StudentApiController extends Controller
{
    public function __construct(protected Student $model)
    {
    }

    public function paginate(Request $request)
    {
        $filters = $request->validate([
            'type' => 'nullable|string',
            'course' => 'nullable|string',
            'campus' => 'nullable|string',
            'college' => 'nullable|string',
            'gender' => 'nullable|string',
            'major' => 'nullable|string',
            'status' => 'nullable|integer',
            'search' => 'nullable|string',
            'date_from' => 'nullable|date',
            'date_to' => 'nullable|date',
            'sort' => 'nullable|string',
            'order' => 'nullable|in:asc,desc',
            'show' => 'nullable|integer|min:1|max:100',
        ]);

        $query = $this->model->query()->with([
            'scholarships',
            'socioEconomicProfile.socioEconomicCategory',
            'socioEconomicProfile.economicProofs',
            'address',
        ]);

        if (!empty($filters['search'])) {
            $search = $filters['search'];

            $query->where(function ($q) use ($search) {
                $hash = HashService::make($search);

                $q->where('email_hash', $hash)
                    ->orWhere('fname_hash', $hash)
                    ->orWhere('mname_hash', $hash)
                    ->orWhere('lname_hash', $hash)
                    ->orWhere('suffix_hash', $hash);
            });
        }

        if (!empty($filters['type'])) {
            $query->where(
                'entry_status_hash',
                HashService::make($filters['type'])
            );
        }

        if (!empty($filters['campus'])) {
            $query->where(
                'campus_hash',
                HashService::make($filters['campus'])
            );
        }

        if (!empty($filters['college'])) {
            $query->where(
                'college_hash',
                HashService::make($filters['college'])
            );
        }

        if (!empty($filters['course'])) {
            $query->where(
                'program_applied_hash',
                HashService::make($filters['course'])
            );
        }

        if (!empty($filters['major'])) {
            $query->where(
                'major_hash',
                HashService::make($filters['major'])
            );
        }

        if (array_key_exists('status', $filters) && $filters['status'] !== null) {
            $query->where(
                'status',
                (int) $filters['status']
            );
        }

        if (!empty($filters['date_from']) && !empty($filters['date_to'])) {
            if ($filters['date_from'] === $filters['date_to']) {
                $query->whereDate('created_at', '=', $filters['date_from']);
            } else {
                $query->whereDate('created_at', '>=', $filters['date_from'])
                    ->whereDate('created_at', '<=', $filters['date_to']);
            }
        }

        $sortable = ['id', 'created_at', 'updated_at'];
        $sort = in_array($filters['sort'] ?? null, $sortable, true) ? $filters['sort'] : 'id';
        $order = in_array(strtolower($filters['order'] ?? ''), ['asc', 'desc'], true) ? $filters['order'] : 'desc';

        $query->orderBy($sort, $order);

        $show = $filters['show'] ?? 10;

        return $query->paginate($show);
    }
}
