<?php

namespace App\Importacoes;

/**
 * Lê CSV com detecção de encoding (UTF-8 / Windows-1252 / ISO-8859-1)
 * e separador (`;` / `,` / tab). Ignora linhas vazias e linhas iniciadas com `#`.
 * Cabeçalho na 1ª linha.
 */
final class LeitorCsv
{
    /**
     * @return array{cabecalho: string[], linhas: array<int, array<string, string>>, encoding: string, separador: string}
     */
    public function ler(string $conteudo): array
    {
        $conteudo = $this->normalizarEncoding($conteudo);
        $separador = $this->detectarSeparador($conteudo);

        $linhas = preg_split('/\r\n|\r|\n/', $conteudo) ?: [];
        $linhas = array_values(array_filter($linhas, fn (string $l) => trim($l) !== '' && ! str_starts_with(ltrim($l), '#')));

        if (empty($linhas)) {
            return ['cabecalho' => [], 'linhas' => [], 'encoding' => 'UTF-8', 'separador' => $separador];
        }

        $cabecalho = array_map('trim', str_getcsv(array_shift($linhas), $separador));
        $cabecalho = array_values(array_filter($cabecalho, fn (string $c) => $c !== ''));

        $dados = [];
        foreach ($linhas as $i => $linhaBruta) {
            $valores = str_getcsv($linhaBruta, $separador);
            $valores = array_pad($valores, count($cabecalho), '');
            $dados[] = [
                'numero_linha' => $i + 2,
                'valores' => array_combine($cabecalho, array_map('trim', array_slice($valores, 0, count($cabecalho)))),
            ];
        }

        return ['cabecalho' => $cabecalho, 'linhas' => $dados, 'encoding' => 'UTF-8', 'separador' => $separador];
    }

    private function normalizarEncoding(string $conteudo): string
    {
        if (mb_detect_encoding($conteudo, ['UTF-8'], true) === 'UTF-8') {
            return $this->removerBom($conteudo);
        }
        if (mb_detect_encoding($conteudo, ['Windows-1252'], true) === 'Windows-1252') {
            return mb_convert_encoding($conteudo, 'UTF-8', 'Windows-1252');
        }
        if (mb_detect_encoding($conteudo, ['ISO-8859-1'], true) === 'ISO-8859-1') {
            return mb_convert_encoding($conteudo, 'UTF-8', 'ISO-8859-1');
        }

        return $this->removerBom($conteudo);
    }

    private function removerBom(string $s): string
    {
        return preg_replace('/^\xEF\xBB\xBF/', '', $s) ?? $s;
    }

    private function detectarSeparador(string $conteudo): string
    {
        $primeiraLinha = strtok($conteudo, "\r\n") ?: '';
        $candidatos = [';' => substr_count($primeiraLinha, ';'), ',' => substr_count($primeiraLinha, ','), "\t" => substr_count($primeiraLinha, "\t")];
        arsort($candidatos);
        $sep = array_key_first($candidatos);

        return ($candidatos[$sep] ?? 0) > 0 ? $sep : ';';
    }
}
