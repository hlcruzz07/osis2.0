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
        Schema::create('student_economic_proofs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('socio_economic_profile_id')->constrained('student_socio_economic_profiles')->cascadeOnDelete();
            $table->text('proof')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('student_economic_proofs');
    }
};
