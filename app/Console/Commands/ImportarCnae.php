<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class ImportarCnae extends Command
{
    protected $signature = 'importar:cnae {--arquivo= : Caminho do arquivo .txt (padrão: database/data/cnae.txt)}';

    protected $description = 'Importa CNAE 2.2 do arquivo .txt (código + descrição)';

    private const ARQUIVO_PADRAO = 'cnae.txt';

    public function handle(): int
    {
        $path = $this->option('arquivo')
            ?: database_path('data/'.self::ARQUIVO_PADRAO);

        if (! file_exists($path)) {
            $this->error("Arquivo não encontrado: {$path}");
            $this->warn('Coloque o arquivo CNAE (.txt) em: database/data/'.self::ARQUIVO_PADRAO);
            $this->warn('Ou use: php artisan importar:cnae --arquivo=/caminho/para/cnae.txt');

            return self::FAILURE;
        }

        $this->info('Lendo '.basename($path).'...');

        $linhas = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        $inseridos = 0;
        $ignorados = 0;

        foreach ($linhas as $linha) {
            // Formato esperado: "0111-3/01   Cultivo de arroz   SIM"
            // Regex: código (XXXX-X/XX) + espaços + descrição (até "SIM"/"SI" ou fim)
            if (! preg_match('/^\s*(\d{4}-\d\/\d{2})\s+(.+?)(?:\s+(SIM|SI|NÃO|NAO))?\s*$/u', $linha, $m)) {
                $ignorados++;

                continue;
            }

            $codigoCompleto = $m[1];               // 0111-3/01
            $descricao = trim($m[2]);              // Cultivo de arroz

            // Remove formatação e mantém os 7 primeiros dígitos
            $codigo = preg_replace('/\D/', '', $codigoCompleto);
            $codigo = substr($codigo, 0, 7);       // 0111301

            if (strlen($codigo) !== 7 || $descricao === '') {
                $ignorados++;

                continue;
            }

            DB::table('cnaes')->updateOrInsert(
                ['codigo' => $codigo],
                ['descricao' => $descricao]
            );
            $inseridos++;
        }

        $this->info("CNAEs importados: {$inseridos} (ignorados: {$ignorados})");

        return self::SUCCESS;
    }
}
