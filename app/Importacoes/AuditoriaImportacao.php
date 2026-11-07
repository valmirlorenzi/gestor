<?php

namespace App\Importacoes;

use App\Repositories\GrupoC\AuditoriaRepository;
use App\Services\TenantContext;

/**
 * Registra a carga em `auditorias` (T9.8 / P154). Sem tabela nova.
 *   acao             = 'importacao'
 *   tabela           = 'importacoes'
 *   id_registro      = null
 *   dados_anteriores = resumo (recurso, modo, total, aceitas, avisos, rejeitadas)
 *   dados_novos      = ['ids' => [...]]
 *   justificativa    = "Carga inicial: <recurso> (<modo>)"
 */
final class AuditoriaImportacao
{
    public function __construct(
        private AuditoriaRepository $auditorias,
        private TenantContext $ctx,
    ) {}

    public function registrar(array $meta, RelatorioCarga $pre, RelatorioCarga $pos): void
    {
        $this->auditorias->create([
            'id_usuario' => $this->ctx->getUsuarioId(),
            'acao' => 'importacao',
            'tabela' => 'importacoes',
            'id_registro' => null,
            'dados_anteriores' => $pre->toAuditoriaResumo(),
            'dados_novos' => ['ids' => $pos->idsCriados()],
            'justificativa' => sprintf('Carga inicial: %s (%s)', $meta['rotulo'], $pos->modo),
            'ip' => request()->ip(),
            'created_at' => now(),
        ]);
    }
}
