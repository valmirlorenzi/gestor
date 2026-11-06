<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PrazoPadrao;
use App\Repositories\GrupoA\PrazoPadraoRepository;
use App\Services\TenantContext;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;

class PrazoPadraoApiController extends Controller
{
    public function __construct(private PrazoPadraoRepository $prazos) {}

    public function index(Request $request): JsonResponse
    {
        $tipo = $request->input('tipo');
        if (! in_array($tipo, ['compra', 'venda'], true)) {
            return response()->json(['message' => 'Tipo deve ser "compra" ou "venda".'], 422);
        }

        return response()->json($this->prazos->listar($tipo, $request->input('q')));
    }

    public function store(Request $request): JsonResponse
    {
        $idEmpresa = app(TenantContext::class)->getId();
        if ($idEmpresa === null) {
            return response()->json(['message' => 'Contexto de empresa ausente.'], 422);
        }

        $data = $request->validate([
            'descricao' => ['required', 'string', 'max:100'],
            'dias' => ['required', 'integer', 'min:0'],
            'parcelas' => ['required', 'integer', 'min:1'],
            'tipo' => ['required', 'in:compra,venda'],
            'ativo' => ['sometimes', 'boolean'],
        ]);

        $data['id_empresa'] = $idEmpresa;
        $data['ativo'] = $data['ativo'] ?? true;

        $model = PrazoPadrao::create($data);

        return response()->json($model, 201);
    }

    public function show(int $id): JsonResponse
    {
        return response()->json($this->prazos->porId($id));
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $prazo = $this->prazos->porId($id);

        $data = $request->validate([
            'descricao' => ['required', 'string', 'max:100'],
            'dias' => ['required', 'integer', 'min:0'],
            'parcelas' => ['required', 'integer', 'min:1'],
            'tipo' => ['required', 'in:compra,venda'],
            'ativo' => ['sometimes', 'boolean'],
        ]);

        unset($data['id_empresa']);

        $prazo->update($data);

        return response()->json($prazo->fresh());
    }

    public function destroy(int $id): Response
    {
        $prazo = $this->prazos->porId($id);

        DB::transaction(function () use ($prazo) {
            $prazo->update([
                'ativo' => false,
                'deleted_by' => app(TenantContext::class)->getUsuarioId(),
            ]);
            $prazo->delete();
        });

        return response()->noContent();
    }
}
