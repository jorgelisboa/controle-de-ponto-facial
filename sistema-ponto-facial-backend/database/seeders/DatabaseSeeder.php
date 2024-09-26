<?php

namespace Database\Seeders;

use App\Models\Collaborator;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\WorkShift;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {

        // CRIA 1 ADMIN
        Collaborator::factory()->admin()->create();

        // Cria 2 Devs Juniors
        Collaborator::factory()->count(2)->junior()->create();

        // Cria 2 Devs Plenos
        Collaborator::factory()->count(2)->pleno()->create();

        // Cria 2 Devs Seniors
        Collaborator::factory()->count(2)->senior()->create();

        // Cria 3 Gerentes
        Collaborator::factory()->count(3)->gerente()->create();

        // Obtenha todos os colaboradores
        $collaborators = Collaborator::all();

        // Para cada colaborador, crie 2 registros de ponto
        foreach ($collaborators as $collaborator) {
            WorkShift::factory()->count(60)->create([
                'collaborator_document' => $collaborator->document, // Associando o ponto ao colaborador
            ]);
        }
    }
}

