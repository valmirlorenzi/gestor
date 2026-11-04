<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Produto;
use App\Models\ProdutoServico;
use App\Services\TenantContext;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;

class ProdutoApiController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = ProdutoServico::query()
            ->where('tipo', 'P')
            ->with(['produto.ncm']);

        if ($request->filled('q')) {
            $query->where('descricao', 'like', '%'.$request->input('q').'%');
        }

        return response()->json($query->orderBy('descricao')->get());
    }

    public function store(Request $request): JsonResponse
    {
        $idEmpresa = app(TenantContext::class)->getId();
        if ($idEmpresa === null) {
            return response()->json(['message' => 'Contexto de empresa ausente.'], 422);
        }

        $data = $request->validate([
            'descricao' => ['required', 'string', 'max:300'],
            'codigo_interno' => ['nullable', 'string', 'max:50'],
            'ativo' => ['sometimes', 'boolean'],
            'id_ncm' => ['nullable', 'integer', 'exists:ncms,id'],
            'unidade' => ['nullable', 'string', 'max:10'],
        ]);

        $model = DB::transaction(function () use ($data, $idEmpresa) {
            $produtoServico = ProdutoServico::create([
                'id_empresa' => $idEmpresa,
                'tipo' => 'P',
                'codigo_interno' => $data['codigo_interno'] ?? null,
                'descricao' => $data['descricao'],
                'ativo' => $data['ativo'] ?? true,
            ]);

            Produto::create([
                'id_produto_servico' => $produtoServico->id,
                'id_ncm' => $data['id_ncm'] ?? null,
                'unidade' => $data['unidade'] ?? null,
            ]);

            return $produtoServico->load('produto');
        });

        return response()->json($model, 201);
    }

    public function show(int $id): JsonResponse
    {
        $produto = ProdutoServico::query()
            ->where('tipo', 'P')
            ->with('produto.ncm')
            ->findOrFail($id);

        return response()->json($produto);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $produto = ProdutoServico::query()
            ->where('tipo', 'P')
            ->findOrFail($id);

        $data = $request->validate([
            'descricao' => ['required', 'string', 'max:300'],
            'codigo_interno' => ['nullable', 'string', 'max:50'],
            'ativo' => ['sometimes', 'boolean'],
            'id_ncm' => ['nullable', 'integer', 'exists:ncms,id'],
            'unidade' => ['nullable', 'string', 'max:10'],
        ]);

        DB::transaction(function () use ($produto, $data) {
            $produto->update([
                'descricao' => $data['descricao'],
                'codigo_interno' => $data['codigo_interno'] ?? null,
                'ativo' => $data['ativo'] ?? $produto->ativo,
            ]);

            $produto->produto()->updateOrCreate(
                ['id_produto_servico' => $produto->id],
                [
                    'id_ncm' => $data['id_ncm'] ?? null,
                    'unidade' => $data['unidade'] ?? null,
                ]
            );
        });

        return response()->json($produto->fresh()->load('produto.ncm'));
    }

    public function destroy(int $id): Response
    {
        $produto = ProdutoServico::query()
            ->where('tipo', 'P')
            ->findOrFail($id);

        DB::transaction(function () use ($produto) {
            $produto->update([
                'ativo' => false,
                'deleted_by' => app(TenantContext::class)->getUsuarioId(),
            ]);
            $produto->delete();
        });

        return response()->noContent();
    }
}