<?php

namespace Database\Seeders;

use App\Models\CondicaoPagamento;
use App\Services\TenantContext;
use Illuminate\Database\Seeder;

class CondicaoPagamentoSeeder extends Seeder
{
    public function run(): void
    {
        app(TenantContext::class)->setId(1);

        $condicoes = [
            ['À vista', 1, 0],
            ['30 dias', 1, 30],
            ['30/60', 2, 30],
            ['30/60/90', 3, 30],
            ['Entrada + 30/60', 3, 30],
        ];

        foreach ($condicoes as [$descricao, $parcelas, $intervalo]) {
            CondicaoPagamento::create([
                'id_empresa' => 1,
                'descricao' => $descricao,
                'numero_parcelas' => $parcelas,
                'intervalo_dias' => $intervalo,
                'ativo' => true,
            ]);
        }
    }
}
