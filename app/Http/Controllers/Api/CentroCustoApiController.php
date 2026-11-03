<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CentroCusto;
use App\Services\TenantContext;
use Illuminate\Http\Request;

class CentroCustoApiController extends Controller
{
    public function index()
    {
        // O trait BelongsToTenant aplica WHERE id_empresa = contexto.
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

        // R2: id_empresa vem SEMPRE do contexto, nunca do cliente.
        $data['id_empresa'] = app(TenantContext::class)->getId();

        if (! $data['id_empresa']) {
            return response()->json([
                'message' => 'Contexto de empresa não definido.',
            ], 422);
        }

        $centro = CentroCusto::create($data);

        return response()->json($centro, 201);
    }

    public function show(CentroCusto $centroCusto)
    {
        return response()->json($centroCusto);
    }

    public function update(Request $request, CentroCusto $centroCusto)
    {
        $data = $request->validate([
            'nome' => 'required|string|max:200',
            'responsavel' => 'nullable|string|max:200',
            'ativo' => 'boolean',
        ]);

        // R2: id_empresa NÃO é alterável pelo cliente.
        unset($data['id_empresa']);

        $centroCusto->update($data);

        return response()->json($centroCusto);
    }

    public function destroy(CentroCusto $centroCusto)
    {
        $centroCusto->update(['ativo' => false]);
        $centroCusto->delete();

        return response()->noContent();
    }
}