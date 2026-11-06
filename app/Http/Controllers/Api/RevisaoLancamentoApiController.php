<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Auditoria;
use App\Repositories\GrupoC\AuditoriaRepository;
use App\Repositories\GrupoF\LancamentoRepository;
use App\Services\TenantContext;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class RevisaoLancamentoApiController extends Controller
{
    public function __construct(
        private LancamentoRepository $lancamentos,
        private AuditoriaRepository $auditorias,
    ) {}

    public function index(Request $request): JsonResponse
    {
        return response()->json(
            $this->lancamentos->paraRevisao(
                $request->input('status'),
                $request->input('q'),
            )
        );
    }

    public function reclassificar(Request $request, int $id): JsonResponse
    {
        $lancamento = $this->lancamentos->findOrFail($id);

        $data = $request->validate([
            'id_conta_debito' => ['required', 'integer', 'exists:planos_contas,id'],
            'id_conta_credito' => ['required', 'integer', 'exists:planos_contas,id'],
            'id_centro_custo' => ['nullable', 'integer', 'exists:centros_custo,id'],
            'justificativa' => ['required', 'string', 'max:500'],
        ]);

        $anteriores = $lancamento->fresh()->toArray();

        DB::transaction(function () use ($lancamento, $data, $anteriores, $request) {
            $lancamento->update([
                'id_conta_debito' => $data['id_conta_debito'],
                'id_conta_credito' => $data['id_conta_credito'],
                'id_centro_custo' => $data['id_centro_custo'] ?? null,
                'status_classificacao' => 'Classificado manualmente',
                'justificativa_classificacao' => $data['justificativa'],
            ]);

            Auditoria::create([
                'id_usuario' => app(TenantContext::class)->getUsuarioId(),
                'acao' => 'Reclassificacao',
                'tabela' => 'lancamentos',
                'id_registro' => $lancamento->id,
                'dados_anteriores' => $anteriores,
                'dados_novos' => $lancamento->fresh()->toArray(),
                'justificativa' => 'Validação manual',
                'ip' => $request->ip(),
            ]);
        });

        return response()->json($lancamento->fresh()->load([
            'contaDebito', 'contaCredito', 'centroCusto',
        ]));
    }

    public function validar(Request $request, int $id): JsonResponse
    {
        $lancamento = $this->lancamentos->findOrFail($id);

        $anteriores = $lancamento->fresh()->toArray();

        DB::transaction(function () use ($lancamento, $anteriores, $request) {
            $lancamento->update([
                'status_classificacao' => 'Classificado manualmente',
            ]);

            Auditoria::create([
                'id_usuario' => app(TenantContext::class)->getUsuarioId(),
                'acao' => 'Validacao',
                'tabela' => 'lancamentos',
                'id_registro' => $lancamento->id,
                'dados_anteriores' => $anteriores,
                'dados_novos' => $lancamento->fresh()->toArray(),
                'justificativa' => 'Validação manual',
                'ip' => $request->ip(),
            ]);
        });

        return response()->json($lancamento->fresh()->load([
            'contaDebito', 'contaCredito', 'centroCusto',
        ]));
    }
}
