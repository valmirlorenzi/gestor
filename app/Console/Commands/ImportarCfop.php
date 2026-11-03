<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use PhpOffice\PhpSpreadsheet\IOFactory;

class ImportarCfop extends Command
{
    protected $signature = 'importar:cfop {--arquivo= : Caminho do .xlsx (padrão: database/data/cfop.xlsx)}';

    protected $description = 'Importa CFOP do arquivo .xlsx (CFOP + Descrição)';

    private const ARQUIVO_PADRAO = 'cfop.xlsx';

    public function handle(): int
    {
        $path = $this->option('arquivo')
            ?: database_path('data/'.self::ARQUIVO_PADRAO);

        if (! file_exists($path)) {
            $this->error("Arquivo não encontrado: {$path}");
            $this->warn('Coloque o arquivo CFOP (.xlsx) em: database/data/'.self::ARQUIVO_PADRAO);

            return self::FAILURE;
        }

        $this->info('Lendo '.basename($path).'...');
        $spreadsheet = IOFactory::load($path);
        $sheet = $spreadsheet->getActiveSheet();
        $rows = $sheet->toArray();

        $inseridos = 0;
        $ignorados = 0;

        // Pula as 3 primeiras linhas (título + aviso + cabeçalho vazio)
        // e a 4ª linha é o cabeçalho real (GRUPO CFOP | CFOP | DESCRIÇÃO_CFOP | Início Vigência)
        foreach ($rows as $i => $row) {
            if ($i < 4) {
                continue;
            }

            // Colunas: A=GRUPO CFOP, B=CFOP, C=DESCRIÇÃO_CFOP, D=Início Vigência
            $cfop = trim((string) ($row[1] ?? ''));
            $descricao = trim((string) ($row[2] ?? ''));

            // CFOP tem 4 dígitos
            if (! preg_match('/^\d{4}$/', $cfop) || $descricao === '') {
                $ignorados++;

                continue;
            }

            // Natureza: 1/2/3 = Entrada (E); 5/6/7 = Saída (S)
            $primeiro = $cfop[0];
            $natureza = in_array($primeiro, ['1', '2', '3']) ? 'E' : 'S';

            DB::table('cfops')->updateOrInsert(
                ['codigo' => $cfop],
                ['descricao' => $descricao, 'natureza' => $natureza]
            );
            $inseridos++;
        }

        $this->info("CFOPs importados: {$inseridos} (ignorados: {$ignorados})");

        return self::SUCCESS;
    }
}
