<?php

namespace App\Importacoes;

use App\Models\AtorFuncional;
use App\Services\TenantContext;

final class ImportadorCadastroGenerico implements ImportadorCadastro
{
    public function __construct(
        private LeitorCsv $leitor,
        private ValidadorLinha $validador,
        private GravadorLinha $gravador,
        private AuditoriaImportacao $auditoria,
        private TenantContext $ctx,
    ) {}

    public function recursosDisponiveisParaAtor(int $atorFuncionalId): array
    {
        $codigoAtor = AtorFuncional::whereKey($atorFuncionalId)->value('codigo');
        $recursos = [];
        foreach (config('importacoes', []) as $chave => $meta) {
            if ($codigoAtor === 'configurador' || in_array($codigoAtor, $meta['atores'] ?? [], true)) {
                $recursos[$chave] = $meta;
            }
        }

        return $recursos;
    }

    public function recurso(string $chave): array
    {
        $todos = config('importacoes', []);
        if (! isset($todos[$chave])) {
            throw new \InvalidArgumentException("Recurso de importação não configurado: {$chave}");
        }

        return $todos[$chave];
    }

    public function template(string $chave): string
    {
        $path = resource_path($this->recurso($chave)['template']);
        if (! is_file($path)) {
            throw new \RuntimeException("Template não encontrado: {$path}");
        }

        return $path;
    }

    public function preValidar(string $chave, string $conteudoCsv, string $modo): RelatorioCarga
    {
        $meta = $this->recurso($chave);
        $this->assertModo($meta, $modo);
        $repo = app($meta['repository']);
        $tenantId = $this->tenantId($meta);
        $lido = $this->leitor->ler($conteudoCsv);

        $this->assertCabecalho($lido['cabecalho'], $meta);

        $linhas = [];
        foreach ($lido['linhas'] as $linha) {
            $linhas[] = $this->validador->validar($linha['numero_linha'], $linha['valores'], $meta, $modo, $repo, $tenantId);
        }

        return new RelatorioCarga($chave, $modo, $linhas);
    }

    public function confirmar(string $chave, string $conteudoCsv, string $modo): RelatorioCarga
    {
        $meta = $this->recurso($chave);
        $pre = $this->preValidar($chave, $conteudoCsv, $modo);
        $repo = app($meta['repository']);
        $tenantId = $this->tenantId($meta);

        // Re-lê para gravar (ValidadorLinha não devolve os valores originais).
        // Guarda o mapa: numeroLinha => valores (array<string,string>)
        $lido = $this->leitor->ler($conteudoCsv);
        $porNumero = [];
        foreach ($lido['linhas'] as $linha) {
            $num = $linha['numero_linha'] ?? null;
            $vals = $linha['valores'] ?? null;
            if ($num === null || ! is_array($vals)) {
                continue; // defensivo: linha malformada no leitor
            }
            $porNumero[(int) $num] = $vals;
        }

        $finais = [];
        foreach ($pre->linhas as $l) {
            if ($l->isRejeitada()) {
                $finais[] = $l;

                continue;
            }

            $valores = $porNumero[(int) $l->numeroLinha] ?? [];
            if (! is_array($valores)) {
                $finais[] = new LinhaCarga(
                    $l->numeroLinha,
                    LinhaCarga::REJEITADA,
                    'Linha não encontrada na releitura do CSV.',
                    $l->avisos
                );

                continue;
            }

            $id = $this->gravador->gravar($l->numeroLinha, $valores, $meta, $modo, $repo, $tenantId);

            $finais[] = $id === null
                ? new LinhaCarga($l->numeroLinha, LinhaCarga::REJEITADA, 'Falha ao gravar (transação revertida).', $l->avisos)
                : new LinhaCarga($l->numeroLinha, $l->status, $l->motivo, $l->avisos, $id);
        }

        $pos = new RelatorioCarga($chave, $modo, $finais);
        $this->auditoria->registrar($meta, $pre, $pos);

        return $pos;
    }

    private function tenantId(array $meta): int
    {
        $id = $meta['tenant'] === 'filial' ? $this->ctx->getFilialId() : $this->ctx->getId();
        if (! $id) {
            throw new \RuntimeException('Contexto de tenant não definido.');
        }

        return $id;
    }

    private function assertModo(array $meta, string $modo): void
    {
        if (! in_array($modo, $meta['modos'] ?? ['inserir'], true)) {
            throw new \InvalidArgumentException("Modo inválido para {$meta['rotulo']}: {$modo}");
        }
    }

    private function assertCabecalho(array $cabecalho, array $meta): void
    {
        $faltando = array_diff($meta['colunas_obrigatorias'], $cabecalho);
        if (! empty($faltando)) {
            throw CabecalhoInvalidoException::faltandoColunas(array_values($faltando));
        }
    }
}
