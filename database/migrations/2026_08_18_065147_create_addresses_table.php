<?php

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
        Schema::create('addresses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('students')->cascadeOnDelete();
            $table->text('street');
            $table->text('barangay');
            $table->text('city');
            $table->text('province');
            $table->text('zip_code');

            $table->text('street_hash');
            $table->text('barangay_hash');
            $table->text('city_hash');
            $table->text('province_hash');
            $table->text('zip_code_hash');
            $table->timestamps();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('addresses');
    }
};
