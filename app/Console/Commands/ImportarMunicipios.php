<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use PhpOffice\PhpSpreadsheet\IOFactory;

class ImportarMunicipios extends Command
{
    protected $signature = 'importar:municipios {--forcar : Re-importa mesmo se já houver municípios}';
    protected $description = 'Importa municípios do relatório BET do IBGE (.xls)';

    private const ARQUIVO = 'municipios.xls';

    /**
     * Mapa oficial código numérico da UF (IBGE) -> sigla.
     */
    private const MAPA_UF = [
        11 => 'RO', 12 => 'AC', 13 => 'AM', 14 => 'RR', 15 => 'PA',
        16 => 'AP', 17 => 'TO', 21 => 'MA', 22 => 'PI', 23 => 'CE',
        24 => 'RN', 25 => 'PB', 26 => 'PE', 27 => 'AL', 28 => 'SE',
        29 => 'BA', 31 => 'MG', 32 => 'ES', 33 => 'RJ', 35 => 'SP',
        41 => 'PR', 42 => 'SC', 43 => 'RS', 50 => 'MS', 51 => 'MT',
        52 => 'GO', 53 => 'DF',
    ];

    public function handle(): int
    {
        $path = database_path('data/' . self::ARQUIVO);

        if (! file_exists($path)) {
            $this->error("Arquivo não encontrado: database/data/" . self::ARQUIVO);
            $this->warn("Baixe o relatório BET do IBGE:");
            $this->warn("https://www.ibge.gov.br/geociencias/organizacao-do-territorio/estrutura-territorial/23701-divisao-territorial-brasileira.html");
            $this->warn("Salve como database/data/" . self::ARQUIVO);
            return self::FAILURE;
        }

        // Mapa sigla -> id (do banco, populado pelo UfSeeder)
        $ufIds = DB::table('ufs')->pluck('id', 'sigla')->toArray();
        if (empty($ufIds)) {
            $this->error('Tabela ufs está vazia. Rode: php artisan db:seed --class=UfSeeder');
            return self::FAILURE;
        }

        $this->info('Lendo ' . self::ARQUIVO . '...');
        $spreadsheet = IOFactory::load($path);
        $sheet = $spreadsheet->getActiveSheet();
        $rows = $sheet->toArray();

        $inseridos = 0;
        $ignorados = 0;
        $ufsDesconhecidas = [];

        foreach ($rows as $i => $row) {
            // Pula as 6 primeiras linhas (cabeçalho do BET)
            if ($i < 6) {
                continue;
            }

            // Colunas: A=UF, B=Nome_UF, ..., H=Código Município Completo, I=Nome_Município
            $codigoUf = (int) ($row[0] ?? 0);
            $codigoIbge = trim((string) ($row[7] ?? ''));
            $nomeMunicipio = trim((string) ($row[8] ?? ''));

            // Validações
            if ($codigoUf === 0 || strlen($codigoIbge) !== 7 || $nomeMunicipio === '') {
                $ignorados++;
                continue;
            }

            $sigla = self::MAPA_UF[$codigoUf] ?? null;
            if (! $sigla || ! isset($ufIds[$sigla])) {
                $ufsDesconhecidas[$codigoUf] = true;
                $ignorados++;
                continue;
            }

            DB::table('municipios')->updateOrInsert(
                ['codigo_ibge' => $codigoIbge],
                [
                    'nome' => $nomeMunicipio,
                    'id_uf' => $ufIds[$sigla],
                ]
            );
            $inseridos++;
        }

        $this->info("Municípios importados: {$inseridos} (ignorados: {$ignorados})");

        if (! empty($ufsDesconhecidas)) {
            $this->warn('Códigos de UF desconhecidos: ' . implode(', ', array_keys($ufsDesconhecidas)));
        }

        return self::SUCCESS;
    }
}