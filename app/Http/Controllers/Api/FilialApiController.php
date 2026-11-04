<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Filial;
use App\Services\TenantContext;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class FilialApiController extends Controller
{
    public function index()
    {
        // O trait BelongsToTenant aplica WHERE id_empresa = contexto.
        return response()->json(
            Filial::orderBy('razao_social')->get()
        );
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'cnpj' => 'required|string|size:14|unique:filiais,cnpj',
            'razao_social' => 'required|string|max:200',
            'nome_fantasia' => 'nullable|string|max:200',
            'inscricao_estadual' => 'nullable|string|max:20',
            'inscricao_municipal' => 'nullable|string|max:20',
            'id_municipio' => 'nullable|exists:municipios,id',
            'endereco' => 'nullable|string|max:300',
            'id_cnae' => 'nullable|exists:cnaes,id',
            'data_inicio' => 'required|date',
            'data_fim' => 'nullable|date',
            'ativo' => 'boolean',
        ]);

        // R2: id_empresa vem SEMPRE do contexto, nunca do cliente.
        $data['id_empresa'] = app(TenantContext::class)->getId();

        if (! $data['id_empresa']) {
            return response()->json([
                'message' => 'Contexto de empresa não definido.',
            ], 422);
        }

        $filial = Filial::create($data);

        return response()->json($filial, 201);
    }

    public function show(int $id)
    {
        $filial = Filial::query()->findOrFail($id);
        return response()->json($filial);
    }

    public function update(Request $request, int $id)
    {
        $filial = Filial::query()->findOrFail($id);
        $data = $request->validate([
            'cnpj' => 'required|string|size:14|unique:filiais,cnpj,'.$filial->id,
            'razao_social' => 'required|string|max:200',
            'nome_fantasia' => 'nullable|string|max:200',
            'inscricao_estadual' => 'nullable|string|max:20',
            'inscricao_municipal' => 'nullable|string|max:20',
            'id_municipio' => 'nullable|exists:municipios,id',
            'endereco' => 'nullable|string|max:300',
            'id_cnae' => 'nullable|exists:cnaes,id',
            'data_inicio' => 'required|date',
            'data_fim' => 'nullable|date',
            'ativo' => 'boolean',
        ]);

        // R2: id_empresa NÃO é alterável pelo cliente.
        unset($data['id_empresa']);

        $filial->update($data);

        return response()->json($filial);
    }

    public function destroy(int $id)
    {
        $filial = Filial::query()->findOrFail($id);

        DB::transaction(function () use ($filial) {
            $filial->update([
                'ativo' => false,
                'deleted_by' => app(TenantContext::class)->getUsuarioId(),
            ]);
            $filial->delete();
        });

        return response()->noContent();
    }
}
