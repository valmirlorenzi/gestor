<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Repositories\GrupoA\AtorFuncionalRepository;
use App\Repositories\GrupoF\PendenciaRepository;
use App\Repositories\GrupoF\PeriodoRepository;
use App\Repositories\GrupoF\TarefaRepository;
use App\Repositories\GrupoF\UsuarioAtorRepository;
use App\Services\TenantContext;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class PrepararFechamentoApiController extends Controller
{
    public function __construct(
        private PeriodoRepository $periodos,
        private PendenciaRepository $pendencias,
        private TarefaRepository $tarefas,
        private UsuarioAtorRepository $usuarioAtores,
        private AtorFuncionalRepository $atores,
    ) {}

    public function show(): JsonResponse
    {
        $idFilial = app(TenantContext::class)->getFilialId();
        if ($idFilial === null) {
            return response()->json(['message' => 'Contexto de filial ausente.'], 422);
        }

        $mesAno = $this->periodos->abertoDaFilial($idFilial);
        if ($mesAno === null) {
            return response()->json(['message' => 'Nenhum período aberto nesta filial.'], 422);
        }

        $periodo = $this->periodos->porFilialEMesAno($idFilial, $mesAno);
        if ($periodo === null) {
            return response()->json(['message' => 'Período não encontrado.'], 422);
        }

        $erros = $this->pendencias->errosAbertosDoPeriodo($periodo->id)->count();
        $avisos = $this->pendencias->porPeriodo($periodo->id)
            ->where('categoria', 'Aviso')
            ->where('status', 'Aberta')
            ->count();

        $tarefaEnviada = $this->tarefas->porDocumentoETipo($idFilial, $periodo->id, 'periodo', 'O23');
        $consolidacaoFeita = $tarefaEnviada !== null;

        return response()->json([
            'periodo' => [
                'id' => $periodo->id,
                'mes_ano' => $periodo->mes_ano,
                'status' => $periodo->status,
            ],
            'checklist' => [
                'pendencias_erro' => $erros,
                'pendencias_aviso' => $avisos,
                'consolidacao_feita' => $consolidacaoFeita,
            ],
            'pode_fechar' => $erros === 0 && $consolidacaoFeita,
        ]);
    }

    public function enviarAuditor(): JsonResponse
    {
        $idFilial = app(TenantContext::class)->getFilialId();
        if ($idFilial === null) {
            return response()->json(['message' => 'Contexto de filial ausente.'], 422);
        }

        $mesAno = $this->periodos->abertoDaFilial($idFilial);
        if ($mesAno === null) {
            return response()->json(['message' => 'Nenhum período aberto nesta filial.'], 422);
        }

        $periodo = $this->periodos->porFilialEMesAno($idFilial, $mesAno);
        if ($periodo === null) {
            return response()->json(['message' => 'Período não encontrado.'], 422);
        }

        $tarefaExistente = $this->tarefas->porDocumentoETipo($idFilial, $periodo->id, 'periodo', 'O23');
        if ($tarefaExistente !== null) {
            return response()->json($tarefaExistente->fresh());
        }

        $idAtorAuditor = $this->atores->porCodigo('auditor')?->id;
        if ($idAtorAuditor === null) {
            return response()->json(['message' => 'Ator "auditor" não cadastrado.'], 422);
        }

        $auditorNaFilial = $this->usuarioAtores->porFilial($idFilial)
            ->firstWhere('id_ator_funcional', $idAtorAuditor);

        if ($auditorNaFilial === null) {
            return response()->json([
                'message' => 'Nenhum usuário com ator "auditor" cadastrado nesta filial.',
            ], 422);
        }

        $idAtorContador = app(TenantContext::class)->getAtorFuncionalId();
        if ($idAtorContador === null) {
            return response()->json(['message' => 'Contexto de ator ausente.'], 422);
        }

        $tarefa = DB::transaction(function () use ($periodo, $idFilial, $idAtorContador, $idAtorAuditor) {
            return $this->tarefas->criarOrdem([
                'id_filial' => $idFilial,
                'tipo_ordem' => 'O23',
                'id_documento' => $periodo->id,
                'tipo_documento' => 'periodo',
                'id_ator_origem' => $idAtorContador,
                'id_ator_destino' => $idAtorAuditor,
                'status' => 'pendente',
                'urgente' => false,
                'prioridade' => 2,
                'descricao_resumida' => 'Validar consolidação do fechamento '.$periodo->mes_ano,
            ]);
        });

        return response()->json($tarefa->fresh(), 201);
    }
}
