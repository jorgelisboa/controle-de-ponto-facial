<?php

namespace Database\Factories;

use App\Models\Collaborator;
use App\Models\WorkShift;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\WorkShift>
 */
class WorkShiftFactory extends Factory
{

    protected $model = WorkShift::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        // Pegue um colaborador existente
        $collaborator = Collaborator::inRandomOrder()->first();

        // Defina um dia aleatório para o ponto de trabalho
        $startTime = Carbon::parse(time: $this->faker->dateTimeBetween('-2 month', 'now'));

        // Horário de entrada
        $endTime = (clone $startTime)->addHours(rand(4, 12)); // Entre 8 e 12 horas de trabalho

        return [
            'collaborator_document' => $collaborator->document,
            'created_at' => $startTime, // Timestamp de entrada
            'updated_at' => $endTime, // Timestamp de saída
            'coordinates' => json_encode([
                'latitude' => (string) $this->faker->latitude,
                'longitude' => (string) $this->faker->longitude,
            ]),
            'registered_at' => (clone $endTime)->addHours(8),
        ];
    }
}
