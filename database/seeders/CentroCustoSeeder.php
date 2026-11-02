<?php

namespace Database\Seeders;

use App\Models\CentroCusto;
use App\Services\TenantContext;
use Illuminate\Database\Seeder;

class CentroCustoSeeder extends Seeder
{
    public function run(): void
    {
        app(TenantContext::class)->setId(1);

        $centros = [
            ['Administrativo', 'Gerente Administrativo'],
            ['Comercial', 'Gerente Comercial'],
            ['Produção', 'Gerente de Produção'],
            ['Financeiro', 'Gerente Financeiro'],
        ];

        foreach ($centros as [$nome, $responsavel]) {
            CentroCusto::create([
                'id_empresa' => 1,
                'nome' => $nome,
                'responsavel' => $responsavel,
                'ativo' => true,
            ]);
        }
    }
}