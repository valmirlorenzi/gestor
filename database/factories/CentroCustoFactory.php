<?php

namespace Database\Factories;

use App\Models\CentroCusto;
use App\Models\Empresa;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<CentroCusto>
 */
class CentroCustoFactory extends Factory
{
    protected $model = CentroCusto::class;

    public function definition(): array
    {
        return [
            'id_empresa' => Empresa::factory(),
            'nome' => 'Centro '.$this->faker->word(),
            'responsavel' => $this->faker->name(),
            'ativo' => true,
        ];
    }

    public function inativo(): static
    {
        return $this->state(fn () => ['ativo' => false]);
    }
}
