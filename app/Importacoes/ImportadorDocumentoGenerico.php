<?php

namespace App\Importacoes;

use App\Importacoes\Parsers\Exceptions\ParseException;
use App\Models\AtorFuncional;
use App\Repositories\GrupoF\FilialRepository;
use App\Repositories\GrupoF\LogImportacaoRepository;
use App\Repositories\GrupoF\NotaFiscalRepository;
use App\Services\TenantContext;
use Throwable;

final class ImportadorDocumentoGenerico implements ImportadorDocumento
{
    public function __construct(
        private DocumentoService $documentoService,
        private ValidadorDocumento $validador,
        private NotaFiscalRepository $notas,
        private LogImportacaoRepository $logs,
        private FilialRepository $filiais,
        private TenantContext $ctx,
        private AuditoriaImportacao $auditoria,
    ) {}

    public function recursosDisponiveisParaAtor(int $atorFuncionalId): array
    {
        $codigo = AtorFuncional::whereKey($atorFuncionalId)->value('codigo');
        $recursos = [];
        foreach (config('importacoes', []) as $chave => $meta) {
            if (($meta['motor'] ?? null) !== 'documento') {
                continue;
            }
            if ($codigo === 'configurador' || in_array($codigo, $meta['atores'] ?? [], true)) {
                $recursos[$chave] = $meta;
            }
        }

        return $recursos;
    }

    public function recurso(string $chave): array
    {
        $todos = config('importacoes', []);
        if (! isset($todos[$chave]) || ($todos[$chave]['motor'] ?? null) !== 'documento') {
            throw new \InvalidArgumentException("Recurso de documento não configurado: {$chave}");
        }

        return $todos[$chave];
    }

    public function preValidar(string $chave, string $conteudo, ?string $caminhoArquivo = null): RelatorioCarga
    {
        return $this->processar($chave, $conteudo, $caminhoArquivo, false);
    }

    public function confirmar(string $chave, string $conteudo, ?string $caminhoArquivo = null): RelatorioCarga
    {
        return $this->processar($chave, $conteudo, $caminhoArquivo, true);
    }

    private function processar(string $chave, string $conteudo, ?string $caminho, bool $gravar): RelatorioCarga
    {
        $meta = $this->recurso($chave);
        $parserClass = $meta['parser'];
        $parser = app($parserClass);

        // 1) Parse (falha estrutural = 1 documento rejeitado)
        try {
            $parseado = $parser->parse($conteudo);
        } catch (ParseException $e) {
            $linha = new LinhaCarga(1, LinhaCarga::REJEITADA, $e->getMessage());

            return new RelatorioCarga($chave, 'inserir', [$linha]);
        }

        // 2) Resolve filial (CNPJ do destinatário na entrada)
        $idFilial = $this->ctx->getFilialId();
        if ($idFilial === null) {
            $cnpjEmpresa = ($meta['direcao'] ?? 'Entrada') === 'Saida'
                ? $parseado['cnpj_emitente']
                : $parseado['cnpj_destinatario'];
            $filial = $this->filiais->porCnpj($cnpjEmpresa);
            $idFilial = $filial?->id;
        }

        // 3) Pré-valida
        $linha = $this->validador->validar(1, $parseado, $meta, $idFilial);
        if (! $gravar || $linha->isRejeitada() || $idFilial === null) {
            // Se não gravar, retorna o que o validador disse (mesmo com aviso).
            // Se gravar mas sem filial, rejeita (não tem como gravar).
            if ($gravar && $linha->isRejeitada()) {
                $this->logs->create([
                    'id_filial' => $idFilial,
                    'tipo_documento' => $meta['tipo_documento'],
                    'caminho_arquivo' => $caminho,
                    'status' => 'Rejeitado',
                    'mensagem' => $linha->motivo,
                    'created_at' => now(),
                ]);
            }

            return new RelatorioCarga($chave, 'inserir', [$linha]);
        }

        // 4) Grava (transação por documento)
        try {
            $nota = $this->documentoService->processar($parseado, $meta, $idFilial, $caminho);
            $final = new LinhaCarga(1, $linha->status, null, $linha->avisos, (int) $nota->id);
        } catch (Throwable $e) {
            $final = new LinhaCarga(1, LinhaCarga::REJEITADA, $e->getMessage(), $linha->avisos);
            $this->logs->create([
                'id_filial' => $idFilial,
                'tipo_documento' => $meta['tipo_documento'],
                'caminho_arquivo' => $caminho,
                'status' => 'Rejeitado',
                'mensagem' => $e->getMessage(),
                'created_at' => now(),
            ]);
        }

        $rel = new RelatorioCarga($chave, 'inserir', [$final]);

        // 5) Auditoria (só no confirmar)
        $this->auditoria->registrar($meta, new RelatorioCarga($chave, 'inserir', [$linha]), $rel);

        return $rel;
    }
}
