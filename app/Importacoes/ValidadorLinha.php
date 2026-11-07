<?php

namespace App\Importacoes;

use App\Repositories\BaseRepository;

/**
 * Valida uma linha de CSV contra o metadados do recurso (config/importacoes.php).
 * Não grava nada. Devolve LinhaCarga (aceita/aceita_com_aviso/rejeitada).
 */
final class ValidadorLinha
{
    /**
     * @param  array<string,string>  $valores  cabeçalho => valor
     * @param  array  $meta  metadados do recurso (config)
     */
    public function validar(int $numeroLinha, array $valores, array $meta, string $modo, BaseRepository $repo, int $tenantId): LinhaCarga
    {
        $avisos = [];

        // 1) Colunas obrigatórias preenchidas
        foreach ($meta['colunas_obrigatorias'] as $col) {
            if (! isset($valores[$col]) || trim((string) $valores[$col]) === '') {
                return new LinhaCarga($numeroLinha, LinhaCarga::REJEITADA, "Campo obrigatório vazio: {$col}");
            }
        }

        // 2) Colunas extras (não previstas) geram aviso (não rejeitam)
        $esperadas = array_merge($meta['colunas_obrigatorias'], $meta['colunas_opcionais'] ?? []);
        foreach (array_keys($valores) as $col) {
            if (! in_array($col, $esperadas, true)) {
                $avisos[] = "Coluna extra ignorada: {$col}";
            }
        }

        // 3) Casts
        $cast = [];
        foreach (($meta['casts'] ?? []) as $col => $tipo) {
            $v = $valores[$col] ?? null;
            if ($v === null || $v === '') {
                continue;
            }
            $convertido = $this->cast($v, $tipo);
            if ($convertido === null) {
                return new LinhaCarga($numeroLinha, LinhaCarga::REJEITADA, "Tipo inválido em {$col}: {$v}");
            }
            $cast[$col] = $convertido;
        }

        // 4) Chave natural: unique por tenant
        $chave = [];
        foreach ($meta['chave_natural'] as $col) {
            $chave[$col] = $valores[$col] ?? null;
        }
        $chave['id_empresa'] = $meta['tenant'] === 'empresa' ? $tenantId : null;
        if ($meta['tenant'] === 'filial') {
            unset($chave['id_empresa']);
            $chave['id_filial'] = $tenantId;
        }
        $chave = array_filter($chave, fn ($v) => $v !== null);

        $existe = $repo->existsByChaveNatural($chave);

        if ($modo === 'inserir' && $existe) {
            return new LinhaCarga($numeroLinha, LinhaCarga::REJEITADA, 'Registro já existe (modo inserir).');
        }
        if ($modo === 'atualizar' && ! $existe) {
            return new LinhaCarga($numeroLinha, LinhaCarga::REJEITADA, 'Registro não existe (modo atualizar).');
        }

        $status = empty($avisos) ? LinhaCarga::ACEITA : LinhaCarga::ACEITA_COM_AVISO;

        return new LinhaCarga($numeroLinha, $status, null, $avisos);
    }

    private function cast(string $v, string $tipo): mixed
    {
        $v = trim($v);

        return match ($tipo) {
            'bool' => in_array(mb_strtolower($v), ['1', 'true', 'sim', 's', 'yes', 'y'], true) ? true
                    : (in_array(mb_strtolower($v), ['0', 'false', 'nao', 'não', 'n', 'no', 'n'], true) ? false : null),
            'int' => is_numeric($v) ? (int) $v : null,
            'decimal' => is_numeric(str_replace(',', '.', $v)) ? (float) str_replace(',', '.', $v) : null,
            'date' => ($d = \DateTimeImmutable::createFromFormat('Y-m-d', $v)) ? $d->format('Y-m-d') : null,
            'string' => (string) $v,
            default => $v,
        };
    }
}
