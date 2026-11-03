<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class EmpresaFilialSeeder extends Seeder
{
    public function run(): void
    {
        // Empresa ID = 1 (empresa logada automática até termos o login)
        $empresa1 = DB::table('empresas')->insertGetId([
            'cnpj' => '11111111111111',
            'razao_social' => 'Empresa Exemplo Ltda.',
            'nome_fantasia' => 'Exemplo',
            'regime_fiscal' => 'Simples',
            'setor' => 'Comercio',
            'data_inicio' => '2026-01-01',
            'metodo_custo' => 'XML',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Filiais da Empresa 1
        DB::table('filiais')->insert([
            [
                'id_empresa' => $empresa1,
                'cnpj' => '11111111111111',
                'razao_social' => 'Empresa Exemplo Ltda. - Matriz',
                'nome_fantasia' => 'Exemplo Matriz',
                'inscricao_estadual' => '111111111',
                'inscricao_municipal' => '1111111',
                'endereco' => 'Rua Exemplo, 100 - Centro',
                'data_inicio' => '2026-01-01',
                'ativo' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id_empresa' => $empresa1,
                'cnpj' => '11111111111112',
                'razao_social' => 'Empresa Exemplo Ltda. - Filial SP',
                'nome_fantasia' => 'Exemplo SP',
                'inscricao_estadual' => '222222222',
                'inscricao_municipal' => '2222222',
                'endereco' => 'Av. Paulista, 1000 - Bela Vista',
                'data_inicio' => '2026-02-01',
                'ativo' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);

        // Empresa ID = 2 (para testar isolamento)
        $empresa2 = DB::table('empresas')->insertGetId([
            'cnpj' => '22222222222222',
            'razao_social' => 'Outra Empresa S.A.',
            'nome_fantasia' => 'Outra',
            'regime_fiscal' => 'Presumido',
            'setor' => 'Servicos',
            'data_inicio' => '2026-01-01',
            'metodo_custo' => 'XML',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('filiais')->insert([
            [
                'id_empresa' => $empresa2,
                'cnpj' => '22222222222222',
                'razao_social' => 'Outra Empresa S.A. - Matriz',
                'nome_fantasia' => 'Outra Matriz',
                'inscricao_estadual' => '333333333',
                'inscricao_municipal' => '3333333',
                'endereco' => 'Rua das Flores, 200 - Jardim',
                'data_inicio' => '2026-01-01',
                'ativo' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);

        $this->command->info('Empresas e filiais criadas:');
        $this->command->info("  Empresa 1: {$empresa1} (Empresa Exemplo Ltda.) - 2 filiais");
        $this->command->info("  Empresa 2: {$empresa2} (Outra Empresa S.A.) - 1 filial");
        $this->command->info('Empresa logada automática: ID = 1');
    }
}
