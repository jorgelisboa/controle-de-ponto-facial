<?php

namespace Database\Factories;

use App\Models\Collaborator;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Collaborator>
 */
class CollaboratorFactory extends Factory
{
    protected $model = Collaborator::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'full_name' => $this->faker->name(),
            'document' => $this->faker->unique()->numerify('###########'),
            'email' => $this->faker->unique()->safeEmail(),
            'role' => null, // Sobrescrito pelo estado
            'hourly_value' => null, // Sobrescrito pelo estado
            'estimated_journey' => null, // Sobrescrito pelo estado
        ];
    }

    // Estado para Dev Junior
    public function junior()
    {
        return $this->state(function (array $attributes) {
            return [
                'role' => 'Dev Junior',
                'hourly_value' => 50.0,
                'estimated_journey' => 35,
            ];
        });
    }

    // Estado para Dev Pleno
    public function pleno()
    {
        return $this->state(function (array $attributes) {
            return [
                'role' => 'Dev Pleno',
                'hourly_value' => 100.0,
                'estimated_journey' => 40,
            ];
        });
    }

    // Estado para Dev Senior
    public function senior()
    {
        return $this->state(function (array $attributes) {
            return [
                'role' => 'Dev Senior',
                'hourly_value' => 150.0,
                'estimated_journey' => 45,
            ];
        });
    }

    // Estado para Gerente
    public function gerente()
    {
        return $this->state(function (array $attributes) {
            return [
                'role' => 'Gerente',
                'hourly_value' => 200.0,
                'estimated_journey' => 40,
            ];
        });
    }

    public function admin()
    {
        return $this->state(function (array $attributes) {
            return [
                'role' => 'admin',
                'hourly_value' => 135.0,
                'estimated_journey' => 20,
            ];
        });
    }
}
