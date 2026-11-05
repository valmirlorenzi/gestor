<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PlanoConta;
use App\Repositories\GrupoA\PlanoContaRepository;
use App\Services\TenantContext;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;

class PlanoContaApiController extends Controller
{
    public function __construct(private PlanoContaRepository $planos) {}

    public function index(Request $request): JsonResponse
    {
        return response()->json($this->planos->todasComHierarquia($request->input('q')));
    }

    public function store(Request $request): JsonResponse
    {
        $idEmpresa = app(TenantContext::class)->getId();
        if ($idEmpresa === null) {
            return response()->json(['message' => 'Contexto de empresa ausente.'], 422);
        }

        $data = $request->validate([
            'codigo' => ['required', 'string', 'max:20'],
            'descricao' => ['required', 'string', 'max:200'],
            'tipo' => ['required', 'in:Ativo,Passivo,Custo,Despesa,Receita,Resultado Financeiro'],
            'subtipo' => ['nullable', 'string', 'max:30'],
            'natureza' => ['required', 'in:Sintetica,Analitica'],
            'aceita_lancamento' => ['sometimes', 'boolean'],
            'id_conta_pai' => ['nullable', 'integer'],
            'conta_referencial' => ['nullable', 'string', 'max:20'],
            'ativo' => ['sometimes', 'boolean'],
        ]);

        if (isset($data['id_conta_pai']) && $data['id_conta_pai'] !== null && $this->planos->paiValido((int) $data['id_conta_pai']) === null) {
            return response()->json(['message' => 'Conta pai inexistente.'], 422);
        }

        $data['id_empresa'] = $idEmpresa;
        $data['nivel'] = $this->calcularNivel($data['id_conta_pai'] ?? null);
        $data['aceita_lancamento'] = $data['aceita_lancamento'] ?? ($data['natureza'] === 'Analitica');

        // Se é Analitica, aceita_lancamento não faz sentido ser false; se Sintetica, não pode ser true.
        if ($data['natureza'] === 'Sintetica' && $data['aceita_lancamento'] === true) {
            return response()->json(['message' => 'Conta sintética não pode aceitar lançamento.'], 422);
        }

        $model = PlanoConta::create($data);

        return response()->json($model, 201);
    }

    public function show(int $id): JsonResponse
    {
        return response()->json($this->planos->porId($id));
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $plano = $this->planos->porId($id);

        $data = $request->validate([
            'codigo' => ['required', 'string', 'max:20'],
            'descricao' => ['required', 'string', 'max:200'],
            'tipo' => ['required', 'in:Ativo,Passivo,Custo,Despesa,Receita,Resultado Financeiro'],
            'subtipo' => ['nullable', 'string', 'max:30'],
            'natureza' => ['required', 'in:Sintetica,Analitica'],
            'aceita_lancamento' => ['sometimes', 'boolean'],
            'id_conta_pai' => ['nullable', 'integer'],
            'conta_referencial' => ['nullable', 'string', 'max:20'],
            'ativo' => ['sometimes', 'boolean'],
        ]);

        // Não pode ser pai de si mesmo.
        if (isset($data['id_conta_pai']) && $data['id_conta_pai'] !== null && (int) $data['id_conta_pai'] === $plano->id) {
            return response()->json(['message' => 'Conta não pode ser pai de si mesma.'], 422);
        }

        unset($data['id_empresa']);

        $plano->update($data);

        return response()->json($plano->fresh());
    }

    public function destroy(int $id): Response
    {
        $plano = $this->planos->porId($id);

        DB::transaction(function () use ($plano) {
            $plano->update([
                'ativo' => false,
                'deleted_by' => app(TenantContext::class)->getUsuarioId(),
            ]);
            $plano->delete();
        });

        return response()->noContent();
    }

    /**
     * Retorna o próximo código sugerido (filho do pai informado, ou nível 1).
     */
    public function proximoCodigo(Request $request): JsonResponse
    {
        $idPai = $request->integer('id_conta_pai') ?: null;

        return response()->json(['codigo' => $this->planos->proximoCodigo($idPai)]);
    }

    private function calcularNivel(?int $idPai): int
    {
        if ($idPai === null) {
            return 1;
        }

        $pai = $this->planos->porId($idPai);

        return $pai->nivel + 1;
    }
}
