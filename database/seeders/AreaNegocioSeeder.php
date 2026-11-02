<?php

namespace Database\Seeders;

use App\Models\AreaNegocio;
use App\Services\TenantContext;
use Illuminate\Database\Seeder;

class AreaNegocioSeeder extends Seeder
{
    public function run(): void
    {
        app(TenantContext::class)->setId(1);

        foreach (['Comércio', 'Serviços'] as $nome) {
            AreaNegocio::create([
                'id_empresa' => 1,
                'nome' => $nome,
                'ativo' => true,
            ]);
        }
    }
}