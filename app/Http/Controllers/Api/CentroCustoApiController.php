<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CentroCusto;
use App\Repositories\GrupoA\CentroCustoRepository;
use App\Services\TenantContext;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CentroCustoApiController extends Controller
{
    public function __construct(private CentroCustoRepository $centrosCusto) {}

    public function index()
    {
        return response()->json(
            CentroCusto::orderBy('nome')->get()
        );
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'nome' => 'required|string|max:200',
            'responsavel' => 'nullable|string|max:200',
            'ativo' => 'boolean',
        ]);

        $data['id_empresa'] = app(TenantContext::class)->getId();

        if (! $data['id_empresa']) {
            return response()->json([
                'message' => 'Contexto de empresa não definido.',
            ], 422);
        }

        $centro = CentroCusto::create($data);

        return response()->json($centro, 201);
    }

    public function show(int $id)
    {
        $centroCusto = CentroCusto::findOrFail($id);

        return response()->json($centroCusto);
    }

    public function update(Request $request, int $id)
    {
        $centroCusto = CentroCusto::findOrFail($id);

        $data = $request->validate([
            'nome' => 'required|string|max:200',
            'responsavel' => 'nullable|string|max:200',
            'ativo' => 'boolean',
        ]);

        unset($data['id_empresa']);

        $centroCusto->update($data);

        return response()->json($centroCusto);
    }

    public function destroy(int $id)
    {
        $centroCusto = $this->centrosCusto->porId($id);

        DB::transaction(function () use ($centroCusto) {
            $centroCusto->update([
                'ativo' => false,
                'deleted_by' => app(TenantContext::class)->getUsuarioId(),
            ]);
            $centroCusto->delete();
        });

        return response()->noContent();
    }
}
