<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('work_shifts', function (Blueprint $table) {
            $table->id();
            $table->string('collaborator_document')->nullable(false); // A coluna que você está tentando definir como chave estrangeira
            $table->foreign('collaborator_document')
                ->references('document')
                ->on('collaborators')
                ->onDelete('cascade');
            $table->timestamps(); // Quando foi criado e atualizado no mysql
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('work_shifts', function (Blueprint $table) {
            $table->dropForeign(['collaborator_document']);
        });

        Schema::dropIfExists('work_shifts');
    }
};
