<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use PhpOffice\PhpSpreadsheet\IOFactory;

class ImportarNcm extends Command
{
    protected $signature = 'importar:ncm {--arquivo= : Caminho do .xlsx (padrão: database/data/ncm.xlsx)}';
    protected $description = 'Importa NCM hierárquico do arquivo .xlsx (todos os níveis)';

    private const ARQUIVO_PADRAO = 'ncm.xlsx';

    public function handle(): int
    {
        $path = $this->option('arquivo')
            ?: database_path('data/' . self::ARQUIVO_PADRAO);

        if (! file_exists($path)) {
            $this->error("Arquivo não encontrado: {$path}");
            $this->warn("Coloque o arquivo NCM (.xlsx) em: database/data/" . self::ARQUIVO_PADRAO);
            return self::FAILURE;
        }

        $this->info('Lendo ' . basename($path) . '...');
        $spreadsheet = IOFactory::load($path);
        $sheet = $spreadsheet->getActiveSheet();
        $rows = $sheet->toArray();

        // Mapa codigo -> id (para resolver o pai)
        $mapaIds = [];

        // Buffer de pais por nível (para resolver o pai de cada linha)
        // Ex.: nivel 2 (0101) precisa do pai nivel 1 (01)
        //      nivel 3 (0101.2) precisa do pai nivel 2 (0101)
        //      etc.
        $ultimoPorNivel = [
            1 => null,  // capítulo (01)
            2 => null,  // posição (0101)
            3 => null,  // subposição (0101.2)
            4 => null,  // item (0101.21)
            5 => null,  // subitem (0101.21.00)
        ];

        $inseridos = 0;
        $ignorados = 0;

        foreach ($rows as $i => $row) {
            if ($i < 4) {
                continue;
            }

            $codigo = trim((string) ($row[0] ?? ''));
            $descricao = trim((string) ($row[1] ?? ''));

            if ($codigo === '' || $descricao === '') {
                $ignorados++;
                continue;
            }

            // Determina o nível pelo formato do código
            $nivel = $this->detectarNivel($codigo);

            if ($nivel === 0) {
                $ignorados++;
                continue;
            }

            // Limpa prefixos de hierarquia da descrição
            $descricao = preg_replace('/^[\s\-–—]+/u', '', $descricao);
            $descricao = trim($descricao);

            if ($descricao === '') {
                $descricao = 'NCM ' . $codigo;
            }

            // Resolve o pai: último ancestral de nível menor cujo código é prefixo do atual
            $idPai = null;
            for ($n = $nivel - 1; $n >= 1; $n--) {
                $candidato = $ultimoPorNivel[$n] ?? null;
                if ($candidato === null) {
                    continue;
                }
                // Verifica se o código do candidato é prefixo do código atual
                $codigoPai = DB::table('ncms')->where('id', $candidato)->value('codigo');
                if ($codigoPai && str_starts_with($codigo, $codigoPai)) {
                    $idPai = $candidato;
                    break;
                }
            }            
            
            // Só aceita lançamento se for subitem (8 dígitos)
            $aceitaLancamento = $nivel === 5;

            DB::table('ncms')->updateOrInsert(
                ['codigo' => $codigo],
                [
                    'descricao' => $descricao,
                    'id_ncm_pai' => $idPai,
                    'aceita_lancamento' => $aceitaLancamento,
                    'nivel' => $nivel,
                ]
            );

            // Recupera o id do registro (para usar como pai dos próximos)
            $id = DB::table('ncms')->where('codigo', $codigo)->value('id');
            $mapaIds[$codigo] = $id;
            $ultimoPorNivel[$nivel] = $id;

            // Ao subir de nível, limpa os níveis inferiores
            foreach ($ultimoPorNivel as $n => $v) {
                if ($n > $nivel) {
                    $ultimoPorNivel[$n] = null;
                }
            }

            $inseridos++;
        }

        $this->info("NCMs importados: {$inseridos} (ignorados: {$ignorados})");
        return self::SUCCESS;
    }

    /**
     * Detecta o nível hierárquico pelo formato do código.
     * 1 = capítulo:   '01'
     * 2 = posição:    '0101'
     * 3 = subposição: '0101.2'
     * 4 = item:       '0101.21'
     * 5 = subitem:    '0101.21.00'
     */
    private function detectarNivel(string $codigo): int
    {
        // Remove espaços
        $codigo = trim($codigo);

        if (preg_match('/^\d{2}$/', $codigo)) {
            return 1;
        }
        if (preg_match('/^\d{4}$/', $codigo)) {
            return 2;
        }
        if (preg_match('/^\d{4}\.\d$/', $codigo)) {
            return 3;
        }
        if (preg_match('/^\d{4}\.\d{2}$/', $codigo)) {
            return 4;
        }
        if (preg_match('/^\d{4}\.\d{2}\.\d{2}$/', $codigo)) {
            return 5;
        }

        return 0; // formato desconhecido
    }
}