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
        Schema::create('collaborators', function (Blueprint $table) {
            // generate uuid for id in laravel
            $table->string('full_name');
            $table->string('document')->unique()->primary();
            $table->string('email')->unique();
            $table->string('role');
            $table->float('hourly_value' , 2);
            $table->string('estimated_journey');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('collaborators');
    }
};
