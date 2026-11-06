<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TipoCliente;
use App\Repositories\GrupoA\TipoClienteRepository;
use App\Services\TenantContext;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;

class TipoClienteApiController extends Controller
{
    public function __construct(private TipoClienteRepository $tipos) {}

    public function index(Request $request): JsonResponse
    {
        return response()->json($this->tipos->listar($request->input('q')));
    }

    public function store(Request $request): JsonResponse
    {
        $idEmpresa = app(TenantContext::class)->getId();
        if ($idEmpresa === null) {
            return response()->json(['message' => 'Contexto de empresa ausente.'], 422);
        }

        $data = $request->validate([
            'descricao' => ['required', 'string', 'max:100'],
            'ativo' => ['sometimes', 'boolean'],
        ]);

        $data['id_empresa'] = $idEmpresa;
        $data['ativo'] = $data['ativo'] ?? true;

        $model = TipoCliente::create($data);

        return response()->json($model, 201);
    }

    public function show(int $id): JsonResponse
    {
        return response()->json($this->tipos->porId($id));
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $tipo = $this->tipos->porId($id);

        $data = $request->validate([
            'descricao' => ['required', 'string', 'max:100'],
            'ativo' => ['sometimes', 'boolean'],
        ]);

        unset($data['id_empresa']);

        $tipo->update($data);

        return response()->json($tipo->fresh());
    }

    public function destroy(int $id): Response
    {
        $tipo = $this->tipos->porId($id);

        DB::transaction(function () use ($tipo) {
            $tipo->update([
                'ativo' => false,
                'deleted_by' => app(TenantContext::class)->getUsuarioId(),
            ]);
            $tipo->delete();
        });

        return response()->noContent();
    }
}
