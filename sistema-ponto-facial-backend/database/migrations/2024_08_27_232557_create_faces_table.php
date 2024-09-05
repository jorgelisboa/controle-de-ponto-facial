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
        Schema::create('faces', function (Blueprint $table) {
            $table->id();
            $table->string('collaborator_document');
            $table->string('face_url');
            $table->text('vector');
            $table->timestamps();

            // Chave estrangeira para a tabela colaboradores (1 para muitos)
            $table->foreign('collaborator_document')->references('document')->on('collaborators')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('faces');
    }
};
