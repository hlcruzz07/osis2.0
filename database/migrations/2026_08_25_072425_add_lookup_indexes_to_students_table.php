<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        foreach ([
            'email_hash',
            'fname_hash',
            'mname_hash',
            'lname_hash',
            'suffix_hash',
            'entry_status_hash',
            'campus_hash',
            'college_hash',
            'program_applied_hash',
            'major_hash',
        ] as $column) {
            DB::statement("ALTER TABLE students ADD INDEX {$column}_idx ({$column}(64))");
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        foreach ([
            'email_hash',
            'fname_hash',
            'mname_hash',
            'lname_hash',
            'suffix_hash',
            'entry_status_hash',
            'campus_hash',
            'college_hash',
            'program_applied_hash',
            'major_hash',
        ] as $column) {
            Schema::table('students', function ($table) use ($column) {
                $table->dropIndex("{$column}_idx");
            });
        }
    }
};
