<?php

namespace Database\Factories;

use App\Models\Empresa;
use Illuminate\Database\Eloquent\Factories\Factory;

class EmpresaFactory extends Factory
{
    protected $model = Empresa::class;

    public function definition(): array
    {
        return [
            'cnpj' => $this->faker->unique()->numerify('##############'),
            'razao_social' => $this->faker->company(),
            'nome_fantasia' => $this->faker->company(),
            'regime_fiscal' => 'Simples',
            'setor' => 'Comercio',
            'data_inicio' => now()->subYear(),
            'metodo_custo' => 'XML',
        ];
    }
}