<?php

use App\Enums\StudentStatus;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('students', function (Blueprint $table) {
            $table->id();
            $table->text('fname');
            $table->text('mname')->nullable();
            $table->text('lname');
            $table->text('suffix')->nullable();
            $table->text('birthdate');
            $table->text('birthplace')->nullable();
            $table->text('gender');
            $table->text('sexual_orientation');
            $table->text('civil_status');
            $table->text('email');
            $table->text('contact_number');
            $table->text('campus');
            $table->text('college');
            $table->text('program_applied');
            $table->text('major')->nullable();
            $table->text('course')->nullable();
            $table->text('year_section')->nullable();
            $table->text('entry_status');
            $table->text('date_admitted');
            $table->unsignedTinyInteger('status')->default(StudentStatus::PENDING->value);
            $table->text('academic_year');
            $table->text('semester');
            // Relatives Fields
            // Father
            $table->text('f_fname')->nullable();
            $table->text('f_mname')->nullable();
            $table->text('f_lname')->nullable();
            $table->text('f_occupation')->nullable();
            $table->text('f_highest_education')->nullable();

            $table->text('m_fname')->nullable();
            $table->text('m_mname')->nullable();
            $table->text('m_lname')->nullable();
            $table->text('m_occupation')->nullable();
            $table->text('m_highest_education')->nullable();

            $table->text('s_fname')->nullable();
            $table->text('s_mname')->nullable();
            $table->text('s_lname')->nullable();
            $table->text('s_occupation')->nullable();
            $table->text('s_highest_education')->nullable();
            // Senior High School
            $table->text('shs_name')->nullable();
            $table->text('shs_address')->nullable();
            $table->text('shs_year')->nullable();
            $table->text('shs_type')->nullable();

            // College
            $table->text('c_name')->nullable();
            $table->text('c_address')->nullable();
            $table->text('c_year')->nullable();
            $table->text('c_type')->nullable();

            $table->text('fname_hash');
            $table->text('mname_hash')->nullable();
            $table->text('lname_hash');
            $table->text('suffix_hash')->nullable();
            $table->text('birthdate_hash');
            $table->text('birthplace_hash')->nullable();
            $table->text('gender_hash');
            $table->text('sexual_orientation_hash');
            $table->text('civil_status_hash');
            $table->text('email_hash');
            $table->text('contact_number_hash');
            $table->text('campus_hash');
            $table->text('college_hash');
            $table->text('program_applied_hash');
            $table->text('major_hash')->nullable();
            $table->text('course_hash')->nullable();
            $table->text('year_section_hash')->nullable();
            $table->text('entry_status_hash');
            $table->text('date_admitted_hash');
            $table->text('academic_year_hash');
            $table->text('semester_hash');

            // Relatives Fields

            // Father
            $table->text('f_fname_hash')->nullable();
            $table->text('f_mname_hash')->nullable();
            $table->text('f_lname_hash')->nullable();
            $table->text('f_occupation_hash')->nullable();
            $table->text('f_highest_education_hash')->nullable();

            // mother
            $table->text('m_fname_hash')->nullable();
            $table->text('m_mname_hash')->nullable();
            $table->text('m_lname_hash')->nullable();
            $table->text('m_occupation_hash')->nullable();
            $table->text('m_highest_education_hash')->nullable();

            // Spouse
            $table->text('s_fname_hash')->nullable();
            $table->text('s_mname_hash')->nullable();
            $table->text('s_lname_hash')->nullable();
            $table->text('s_occupation_hash')->nullable();
            $table->text('s_highest_education_hash')->nullable();

            // Senior High school
            $table->text('shs_name_hash')->nullable();
            $table->text('shs_address_hash')->nullable();
            $table->text('shs_year_hash')->nullable();
            $table->text('shs_type_hash')->nullable();
            // College
            $table->text('c_name_hash')->nullable();
            $table->text('c_address_hash')->nullable();
            $table->text('c_year_hash')->nullable();
            $table->text('c_type_hash')->nullable();
            $table->timestamps();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('students');
    }
};
