<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AtorFuncionalSeeder extends Seeder
{
    public function run(): void
    {
        $atores = [
            ['configurador',       'Configurador'],
            ['administrador',      'Administrador'],
            ['contador',           'Contador'],
            ['comprador',          'Comprador'],
            ['faturista',          'Faturista'],
            ['financeiro1',        'Financeiro1'],
            ['financeiro2',        'Financeiro2'],
            ['gerente_financeiro', 'Gerente Financeiro'],
            ['rh',                 'RH'],
            ['auditor',            'Auditor'],
        ];

        foreach ($atores as [$codigo, $descricao]) {
            DB::table('atores_funcionais')->updateOrInsert(
                ['codigo' => $codigo],
                ['descricao' => $descricao, 'ativo' => true]
            );
        }

        $this->command->info('Atores funcionais importados: '.count($atores));
    }
}
