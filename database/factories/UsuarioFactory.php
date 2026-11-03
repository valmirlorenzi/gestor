<?php

namespace Database\Factories;

use App\Models\Empresa;
use App\Models\Usuario;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;

/**
 * @extends Factory<Usuario>
 */
class UsuarioFactory extends Factory
{
    protected $model = Usuario::class;

    public function definition(): array
    {
        return [
            'id_empresa' => Empresa::factory(),
            'nome' => $this->faker->name(),
            'email' => $this->faker->unique()->safeEmail(),
            'senha_hash' => Hash::make('password'),
            'ativo' => true,
            // dados_extras, created_by, updated_by, deleted_by — nullable, omitidos.
        ];
    }

    public function inativo(): static
    {
        return $this->state(fn () => ['ativo' => false]);
    }
}
