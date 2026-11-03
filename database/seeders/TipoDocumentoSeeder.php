<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TipoDocumentoSeeder extends Seeder
{
    public function run(): void
    {
        $tipos = [
            ['NF-e',  'Nota Fiscal Eletrônica'],
            ['NFS-e', 'Nota Fiscal de Serviço Eletrônica'],
            ['CT-e',  'Conhecimento de Transporte Eletrônico'],
            ['RPA',   'Recibo de Pagamento a Autônomo'],
        ];

        foreach ($tipos as [$codigo, $descricao]) {
            DB::table('tipos_documento')->updateOrInsert(
                ['codigo' => $codigo],
                ['descricao' => $descricao]
            );
        }

        $this->command->info('Tipos de documento importados: '.count($tipos));
    }
}
