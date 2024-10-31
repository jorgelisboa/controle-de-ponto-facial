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
        Schema::create('audits', function (Blueprint $table) {
            $table->id();
            $table->string('created_by', 80);
            $table->string('assigned_to', 80);
            $table->char('record_type', 16);
            $table->text('description');
            $table->timestamps();
            $table->foreign('created_by')->references('document')->on('collaborators');
            $table->foreign('assigned_to')->references('document')->on('collaborators');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('audits');
    }
};
