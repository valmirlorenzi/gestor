<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Repositories\GrupoF\LancamentoRepository;
use App\Repositories\GrupoF\PeriodoRepository;
use App\Services\TenantContext;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LancamentoManualApiController extends Controller
{
    public function __construct(
        private LancamentoRepository $lancamentos,
        private PeriodoRepository $periodos,
    ) {}

    public function store(Request $request): JsonResponse
    {
        $idFilial = app(TenantContext::class)->getFilialId();
        if ($idFilial === null) {
            return response()->json(['message' => 'Contexto de filial ausente.'], 422);
        }

        $data = $request->validate([
            'data_competencia' => ['required', 'date'],
            'historico' => ['required', 'string', 'max:500'],
            'valor' => ['required', 'numeric', 'min:0.01'],
            'id_conta_debito' => ['required', 'integer', 'exists:planos_contas,id'],
            'id_conta_credito' => ['required', 'integer', 'exists:planos_contas,id'],
            'id_centro_custo' => ['nullable', 'integer', 'exists:centros_custo,id'],
            'id_pessoa' => ['nullable', 'integer', 'exists:pessoas,id'],
        ]);

        // Período aberto da filial (formato MM/AAAA).
        $mesAno = substr($data['data_competencia'], 0, 7);
        $mesAno = substr($mesAno, 5, 2).'/'.substr($mesAno, 0, 4);

        $periodoAberto = $this->periodos->porFilialEMesAno($idFilial, $mesAno);
        if ($periodoAberto === null || $periodoAberto->status !== 'Aberto') {
            return response()->json([
                'message' => "Período {$mesAno} não está aberto para esta filial.",
            ], 422);
        }

        $data['id_filial'] = $idFilial;
        $data['id_periodo'] = $periodoAberto->id;
        $data['tipo_lancamento'] = 'Manual';
        $data['status_classificacao'] = 'Classificado manualmente';

        $lancamento = $this->lancamentos->create($data);

        return response()->json($lancamento->load([
            'contaDebito', 'contaCredito', 'centroCusto', 'pessoa',
        ]), 201);
    }
}
