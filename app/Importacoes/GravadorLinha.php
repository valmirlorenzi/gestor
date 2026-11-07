<?php

namespace App\Importacoes;

use App\Repositories\BaseRepository;
use Illuminate\Support\Facades\DB;
use Throwable;

/**
 * Grava uma linha em transação própria (T9.6). Uma linha que falha não derruba
 * as demais. `id_empresa`/`id_filial` sempre do TenantContext (R2).
 */
final class GravadorLinha
{
    /**
     * @param  array<string,string>  $valores
     * @return int|null id do registro criado/atualizado, ou null se rejeitada
     */
    public function gravar(int $numeroLinha, array $valores, array $meta, string $modo, BaseRepository $repo, int $tenantId): ?int
    {
        $dados = $this->montarDados($valores, $meta, $tenantId);
        $chave = [];
        foreach ($meta['chave_natural'] as $col) {
            $chave[$col] = $dados[$col] ?? $valores[$col] ?? null;
        }
        $chave['id_empresa'] = $meta['tenant'] === 'empresa' ? $tenantId : null;
        if ($meta['tenant'] === 'filial') {
            unset($chave['id_empresa']);
            $chave['id_filial'] = $tenantId;
        }
        $chave = array_filter($chave, fn ($v) => $v !== null);

        try {
            return DB::transaction(function () use ($modo, $chave, $dados, $repo) {
                return match ($modo) {
                    'inserir' => (int) $repo->create($dados)->getKey(),
                    'atualizar' => (int) $repo->updateOrCreateByChaveNatural($chave, $dados)->getKey(),
                    'upsert' => (int) $repo->updateOrCreateByChaveNatural($chave, $dados)->getKey(),
                    default => throw new \InvalidArgumentException("Modo inválido: {$modo}"),
                };
            });
        } catch (Throwable) {
            return null;
        }
    }

    /** @param  array<string,string>  $valores */
    private function montarDados(array $valores, array $meta, int $tenantId): array
    {
        $dados = [];
        $colunas = array_merge($meta['colunas_obrigatorias'], $meta['colunas_opcionais'] ?? []);
        foreach ($colunas as $col) {
            if (! array_key_exists($col, $valores)) {
                continue;
            }
            $v = $valores[$col];
            $dados[$col] = $v === '' ? null : $v;
        }
        foreach (($meta['casts'] ?? []) as $col => $tipo) {
            if (array_key_exists($col, $dados)) {
                $dados[$col] = $this->cast($dados[$col], $tipo);
            }
        }
        // defaults
        if (array_key_exists('ativo', $dados) && $dados['ativo'] === null) {
            $dados['ativo'] = true;
        }
        // tenant + auditoria de criação (não setamos created_by/updated_by — 10a-2)
        if ($meta['tenant'] === 'empresa') {
            $dados['id_empresa'] = $tenantId;
        } else {
            $dados['id_filial'] = $tenantId;
        }

        return $dados;
    }

    private function cast(mixed $v, string $tipo): mixed
    {
        if ($v === null) {
            return null;
        }
        $v = trim((string) $v);

        return match ($tipo) {
            'bool' => in_array(mb_strtolower($v), ['1', 'true', 'sim', 's', 'yes', 'y'], true),
            'int' => (int) $v,
            'decimal' => (float) str_replace(',', '.', $v),
            'date' => $v,
            'string' => $v,
            default => $v,
        };
    }
}
