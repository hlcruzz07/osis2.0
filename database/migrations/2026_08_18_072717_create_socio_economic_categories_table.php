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
        Schema::create('socio_economic_categories', function (Blueprint $table) {
            $table->id();
            $table->text('code');
            $table->text('name');
            $table->text('desc')->nullable();
            $table->boolean('with_id')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('socio_economic_categories');
    }
};
