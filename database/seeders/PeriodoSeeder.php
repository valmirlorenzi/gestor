<?php

namespace Database\Seeders;

use App\Models\Filial;
use App\Models\Periodo;
use App\Services\TenantContext;
use Illuminate\Database\Seeder;

class PeriodoSeeder extends Seeder
{
    public function run(): void
    {
        app(TenantContext::class)->setId(1);

        // Períodos abertos para o ano corrente em todas as filiais da empresa 1.
        $filiais = Filial::all();
        $ano = now()->year;

        foreach ($filiais as $filial) {
            for ($mes = 1; $mes <= 12; $mes++) {
                $mesAno = sprintf('%02d/%d', $mes, $ano);

                // Evita duplicar se já existir.
                if (Periodo::withoutGlobalScope('tenant')
                    ->where('id_filial', $filial->id)
                    ->where('mes_ano', $mesAno)
                    ->exists()) {
                    continue;
                }

                Periodo::create([
                    'id_filial' => $filial->id,
                    'mes_ano' => $mesAno,
                    'status' => 'Aberto',
                ]);
            }
        }
    }
}
