<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Services\HashService;
use Illuminate\Http\Request;

class ActivityLogApiController extends Controller
{
    public function __construct(protected ActivityLog $model)
    {
    }

    public function paginate(Request $request)
    {
        $query = $this->model->newQuery()->with('user');

        if ($search = $request->string('search')->trim()->value()) {
            $searchHash = HashService::make($search);

            $query->whereHas('user', function ($userQuery) use ($searchHash) {
                $userQuery->where('name_hash', $searchHash)
                    ->orWhere('email_hash', $searchHash);
            });
        }

        if ($action = $request->string('action')->value()) {
            $query->where('action_hash', HashService::make($action));
        }

        if ($dateFrom = $request->string('date_from')->value()) {
            $query->whereDate('created_at', '>=', $dateFrom);
        }

        if ($dateTo = $request->string('date_to')->value()) {
            $query->whereDate('created_at', '<=', $dateTo);
        }

        return $query
            ->orderByDesc('created_at')
            ->paginate(15)
            ->withQueryString();
    }
}
