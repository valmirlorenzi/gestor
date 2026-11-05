<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Repositories\GrupoF\AtivoRepository;
use App\Services\TenantContext;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;

class AtivoApiController extends Controller
{
    public function __construct(
        private AtivoRepository $ativos,
    ) {}

    public function index(Request $request): JsonResponse
    {
        return response()
            ->json($this->ativos->listarComCentroCusto($request->input('q')));
    }

    public function store(Request $request): JsonResponse
    {
        $idFilial = app(TenantContext::class)->getFilialId();

        if ($idFilial === null) {
            return response()->json(['message' => 'Contexto de filial ausente.'], 422);
        }

        $data = $request->validate([
            'descricao' => ['required', 'string', 'max:200'],
            'data_aquisicao' => ['required', 'date'],
            'valor_original' => ['required', 'numeric', 'min:0'],
            'valor_residual' => ['nullable', 'numeric', 'min:0'],
            'vida_util_meses' => ['required', 'integer', 'min:1'],
            'metodo_depreciacao' => ['nullable', 'string', 'max:20'],
            'mes_inicial_depreciacao' => ['required', 'string', 'size:7'], // AAAA-MM
            'id_centro_custo' => ['nullable', 'integer', 'exists:centros_custo,id'],
            'destino' => ['required', 'string', 'max:10'],
            'status' => ['nullable', 'string', 'max:20'],
        ]);

        // R2: id_filial SEMPRE do contexto.
        $data['id_filial'] = $idFilial;

        // AtivoRepository::create() valida P23 (centro de custo da mesma empresa).
        $ativo = $this->ativos->create($data);

        return response()->json($ativo->load('centroCusto'), 201);
    }

    public function show(int $id): JsonResponse
    {
        $ativo = $this->ativos->comCentroCusto($id);

        return response()->json($ativo);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $ativo = $this->ativos->porId($id);

        $data = $request->validate([
            'descricao' => ['required', 'string', 'max:200'],
            'data_aquisicao' => ['required', 'date'],
            'valor_original' => ['required', 'numeric', 'min:0'],
            'valor_residual' => ['nullable', 'numeric', 'min:0'],
            'vida_util_meses' => ['required', 'integer', 'min:1'],
            'metodo_depreciacao' => ['nullable', 'string', 'max:20'],
            'mes_inicial_depreciacao' => ['required', 'string', 'size:7'],
            'id_centro_custo' => ['nullable', 'integer', 'exists:centros_custo,id'],
            'destino' => ['required', 'string', 'max:10'],
            'status' => ['nullable', 'string', 'max:20'],
        ]);

        unset($data['id_filial']);

        // AtivoRepository::update() valida P23.
        $ativo = $this->ativos->update($id, $data);

        return response()->json($ativo->load('centroCusto'));
    }

    public function destroy(int $id): Response
    {
        $ativo = $this->ativos->porId($id);

        DB::transaction(function () use ($ativo) {
            $ativo->update([
                'ativo' => false,
                'deleted_by' => app(TenantContext::class)->getUsuarioId(),
            ]);
            $ativo->delete();
        });

        return response()->noContent();
    }
}
