<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class ImportarLc116 extends Command
{
    protected $signature = 'importar:lc116 {--arquivo= : Caminho do .txt (padrão: database/data/lc116.txt)}';
    protected $description = 'Importa a Lista de Serviços da LC 116 do arquivo .txt';

    private const ARQUIVO_PADRAO = 'lc116.txt';

    public function handle(): int
    {
        $path = $this->option('arquivo')
            ?: database_path('data/' . self::ARQUIVO_PADRAO);

        if (! file_exists($path)) {
            $this->error("Arquivo não encontrado: {$path}");
            $this->warn("Coloque o arquivo LC 116 (.txt) em: database/data/" . self::ARQUIVO_PADRAO);
            return self::FAILURE;
        }

        $this->info('Lendo ' . basename($path) . '...');

        $linhas = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        $inseridos = 0;
        $ignorados = 0;

        // Buffer para guardar a última redação de cada código
        // (o texto pode ter duplicatas: versão antiga + "Redação dada pela LC 157/2016")
        $servicos = [];

        foreach ($linhas as $linha) {
            $linha = trim($linha);

            // Ignora linhas vazias ou que não começam com código (grupos, cabeçalhos, redações soltas)
            // Formato esperado: "1.01 – Análise e desenvolvimento de sistemas."
            if (! preg_match('/^(\d{1,2}\.\d{1,2})\s*[–\-—]\s*(.+)$/u', $linha, $m)) {
                $ignorados++;
                continue;
            }

            $codigo = $m[1];          // 1.01, 17.05, etc.
            $descricao = trim($m[2]); // Análise e desenvolvimento de sistemas.

            // Remove o ponto final da descrição (opcional, para padronizar)
            $descricao = rtrim($descricao, '.');

            // Remove a anotação de redação, se houver, para pegar só a descrição
            $descricao = preg_replace('/\s*\(Redação dada pela.*$/u', '', $descricao);
            $descricao = trim($descricao);

            if ($descricao === '') {
                $ignorados++;
                continue;
            }

            // Normaliza o código para 5 caracteres com zero à esquerda: "1.01" -> "01.01"
            // A tabela servicos_lc116.codigo é varchar(10); o formato oficial é "01.01", "17.05", etc.
            if (preg_match('/^(\d)\.(\d{2})$/', $codigo, $mc)) {
                $codigo = '0' . $mc[1] . '.' . $mc[2];
            }

            // Guarda a última redação (sobrescreve a anterior)
            $servicos[$codigo] = $descricao;
        }

        // Upsert no banco
        foreach ($servicos as $codigo => $descricao) {
            DB::table('servicos_lc116')->updateOrInsert(
                ['codigo' => $codigo],
                ['descricao' => $descricao]
            );
            $inseridos++;
        }

        $this->info("Serviços LC 116 importados: {$inseridos} (linhas ignoradas: {$ignorados})");
        return self::SUCCESS;
    }
}