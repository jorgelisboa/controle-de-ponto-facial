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
            $table->string('full_name', 100)->nullable(false);
            $table->string('document',80)->unique()->primary()->nullable(false);
            $table->string('email',100)->unique()->nullable(false);
            $table->string('role',32)->nullable(false);
            $table->decimal('hourly_value' , 8, 2)->nullable(false);
            $table->string('estimated_journey',100)->nullable(false);
            $table->string('expo_push_token',100);
            $table->string('milvus_embending_id',200);
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
