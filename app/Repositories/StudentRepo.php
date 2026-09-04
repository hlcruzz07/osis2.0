<?php

namespace App\Repositories;

use App\Models\Student;
use App\Services\HashService;
use Illuminate\Support\Arr;

class StudentRepo
{
    /**
     * Create a new class instance.
     */
    public function __construct(protected Student $model)
    {
        //
    }

    public function find(int $id): Student
    {
        return $this->model->findOrFail($id);
    }

    public function updateOrCreate(array $data): Student
    {
        $studentData = Arr::only($data, $this->model->getFillable());

        $hashes = HashService::forFields($studentData, $this->model->hashable);

        return $this->model->updateOrCreate(
            ['email_hash' => HashService::make($studentData['email'] ?? null)],
            array_merge($studentData, $hashes)
        );
    }
}
