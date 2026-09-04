<?php

use App\Enums\StudentStatus;
use App\Models\Student;
use App\Models\User;

test('guests are redirected to the login page', function () {
    $response = $this->get(route('dashboard'));
    $response->assertRedirect(route('login'));
});

test('authenticated users can visit the dashboard', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $response = $this->get(route('dashboard'));
    $response->assertOk();
});

test('students api can filter by status', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    Student::factory()->create(['status' => StudentStatus::PENDING]);
    Student::factory()->create(['status' => StudentStatus::REJECTED]);
    Student::factory()->create(['status' => StudentStatus::ACCEPTED]);

    $response = $this->getJson(route('paginateStudents', ['status' => StudentStatus::PENDING->value]));

    $response->assertOk();
    $response->assertJsonPath('total', 1);
    $response->assertJsonPath('data.0.status', StudentStatus::PENDING->value);
});
