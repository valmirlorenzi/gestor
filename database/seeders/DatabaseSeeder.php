<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            // Domínios (Bloco 4)
            UfSeeder::class,
            BancoSeeder::class,
            CstSeeder::class,
            TipoDocumentoSeeder::class,
            AtorFuncionalSeeder::class,
            // Empresa + filiais (Bloco 4)
            EmpresaFilialSeeder::class,
            // Configuração (6.17)
            PlanoContaSeeder::class,
            CentroCustoSeeder::class,
            AreaNegocioSeeder::class,
            FormaPagamentoSeeder::class,
            CondicaoPagamentoSeeder::class,
            PeriodoSeeder::class,
            UsuarioSeeder::class,
            MenuItemSeeder::class,
        ]);
    }
}
