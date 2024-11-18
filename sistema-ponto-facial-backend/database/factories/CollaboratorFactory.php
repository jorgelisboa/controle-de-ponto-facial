<?php

namespace Database\Factories;

use App\Models\Collaborator;
use App\Models\User;
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
            'document' => $this->faker->unique()->numerify('###########'),
            'role' => null, // Sobrescrito pelo estado
            'hourly_value' => null, // Sobrescrito pelo estado
            'estimated_journey' => null, // Sobrescrito pelo estado
            'expo_push_token' => null,
            'milvus_embending_id' => null,
            'profile_photo_path' => null,
            'user_id' => User::factory(),
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
