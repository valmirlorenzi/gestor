<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DominioSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            UfSeeder::class,
        ]);

        $this->command->info('UFs ok. Rodando comandos de importação...');

        $this->call('importar:municipios');
        $this->call('importar:cnae');
        $this->call('importar:ncm');
        $this->call('importar:cfop');
        $this->call('importar:lc116');
    }
}