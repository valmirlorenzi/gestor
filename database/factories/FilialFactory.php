<?php

namespace Database\Factories;

use App\Models\Empresa;
use App\Models\Filial;
use Illuminate\Database\Eloquent\Factories\Factory;

class FilialFactory extends Factory
{
    protected $model = Filial::class;

    public function definition(): array
    {
        return [
            'id_empresa' => Empresa::factory(),
            'cnpj' => $this->faker->unique()->numerify('##############'),
            'razao_social' => $this->faker->company(),
            'nome_fantasia' => $this->faker->company(),
            'data_inicio' => now()->subYear(),
            'ativo' => true,
        ];
    }
}
