<?php

use App\Enums\StudentEconomicStatus;
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
        Schema::create('student_socio_economic_profiles', function (Blueprint $table) {
            $table->id();

            $table->foreignId('student_id')
                ->constrained('students')
                ->cascadeOnDelete();

            $table->foreignId('socio_economic_category_id');

            $table->foreign(
                'socio_economic_category_id',
                'sesp_category_fk'
            )
                ->references('id')
                ->on('socio_economic_categories')
                ->cascadeOnDelete();

            $table->text('id_number')->nullable();

            $table->unsignedTinyInteger('status')->default(StudentEconomicStatus::PENDING->value);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('student_socio_economic_profiles');
    }
};
