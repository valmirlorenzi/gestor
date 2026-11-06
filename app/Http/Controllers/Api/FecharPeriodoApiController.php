<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Repositories\GrupoF\PendenciaRepository;
use App\Repositories\GrupoF\PeriodoRepository;
use App\Repositories\GrupoF\TarefaRepository;
use App\Services\TenantContext;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class FecharPeriodoApiController extends Controller
{
    public function __construct(
        private PeriodoRepository $periodos,
        private PendenciaRepository $pendencias,
        private TarefaRepository $tarefas,
    ) {}

    public function index(): JsonResponse
    {
        $idFilial = app(TenantContext::class)->getFilialId();
        if ($idFilial === null) {
            return response()->json(['message' => 'Contexto de filial ausente.'], 422);
        }

        $periodos = $this->periodos->abertos()
            ->where('id_filial', $idFilial)
            ->values();

        return response()->json($periodos);
    }

    public function fechar(int $id): JsonResponse
    {
        $periodo = $this->periodos->porId($id);

        // (a) Nenhuma pendência Erro aberta.
        $erros = $this->pendencias->errosAbertosDoPeriodo($periodo->id)->count();
        if ($erros > 0) {
            return response()->json([
                'message' => "Existem {$erros} pendência(s) de Erro abertas neste período.",
            ], 422);
        }

        // (b) Consolidação feita (tarefa O23 enviada ao auditor).
        $tarefa = $this->tarefas->porDocumentoETipo($periodo->id_filial, $periodo->id, 'periodo', 'O23');
        if ($tarefa === null) {
            return response()->json([
                'message' => 'Consolidação não foi enviada ao Auditor (preparar fechamento).',
            ], 422);
        }

        $idUsuario = app(TenantContext::class)->getUsuarioId();

        DB::transaction(function () use ($periodo, $idUsuario) {
            $this->periodos->fechar($periodo->id, $idUsuario);
        });

        return response()->json($periodo->fresh());
    }
}
