<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Auditoria;
use App\Models\ConfiguracaoHandoff;
use App\Repositories\GrupoC\AuditoriaRepository;
use App\Services\TenantContext;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OsiApiController extends Controller
{
    public function __construct(
        private AuditoriaRepository $auditorias,
    ) {}

    public function show(): JsonResponse
    {
        $idEmpresa = app(TenantContext::class)->getId();

        $config = ConfiguracaoHandoff::query()->first();

        $historico = $config !== null
            ? $this->auditorias->porTabela('configuracoes_handoff', $config->id)
            : collect();

        return response()->json([
            'config' => $config,
            'historico' => $historico,
        ]);
    }

    public function update(Request $request): JsonResponse
    {
        $idEmpresa = app(TenantContext::class)->getId();
        $idUsuario = app(TenantContext::class)->getUsuarioId();

        if ($idEmpresa === null) {
            return response()->json(['message' => 'Contexto de empresa ausente.'], 422);
        }

        $data = $request->validate([
            'handoff_ativo' => ['required', 'boolean'],
            'justificativa' => ['required', 'string', 'max:500'],
        ]);

        $config = DB::transaction(function () use ($data, $idEmpresa, $idUsuario) {
            $config = ConfiguracaoHandoff::query()->first();

            $dadosAnteriores = $config ? $config->toArray() : null;

            if ($config === null) {
                $config = ConfiguracaoHandoff::create([
                    'id_empresa' => $idEmpresa,
                    'handoff_ativo' => $data['handoff_ativo'],
                ]);
            } else {
                $config->update(['handoff_ativo' => $data['handoff_ativo']]);
            }

            Auditoria::create([
                'id_usuario' => $idUsuario,
                'acao' => $data['handoff_ativo'] ? 'ativar' : 'desativar',
                'tabela' => 'configuracoes_handoff',
                'id_registro' => $config->id,
                'dados_anteriores' => $dadosAnteriores,
                'dados_novos' => $config->fresh()->toArray(),
                'justificativa' => $data['justificativa'],
                'ip' => request()->ip(),
            ]);

            return $config->fresh();
        });

        return response()->json($config);
    }
}