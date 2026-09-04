<?php

use App\Http\Controllers\Api\AccountApiController;
use App\Http\Controllers\Api\ActivityLogApiController;
use App\Http\Controllers\Api\CampusApiController;
use App\Http\Controllers\Api\ProofApiController;
use App\Http\Controllers\Api\StudentApiController;
use Illuminate\Support\Facades\Route;

Route::prefix('api')->middleware(['auth'])->group(function () {
    Route::get('/students', [StudentApiController::class, 'paginate'])->name('paginateStudents');
    Route::get('/colleges/{campus}', [CampusApiController::class, 'fetchColleges'])->name('fetchColleges');
    Route::get('/courses/{campus}/{college}', [CampusApiController::class, 'fetchCourses'])->name('fetchCourses');
    Route::get('/courses/{campus}/{college}/{course}', [CampusApiController::class, 'fetchMajors'])->name('fetchMajors');

    Route::get('/accounts', [AccountApiController::class, 'paginate'])->name('paginateAccounts');
    Route::get('/activity-logs', [ActivityLogApiController::class, 'paginate'])->name('paginateActivityLogs');
    Route::get('/drive/image/{fileId}', [ProofApiController::class, 'fetchImage'])->name('driveImage');
});
