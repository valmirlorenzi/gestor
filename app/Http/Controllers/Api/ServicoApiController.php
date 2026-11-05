<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ProdutoServico;
use App\Models\Servico;
use App\Repositories\GrupoA\ProdutoServicoRepository;
use App\Services\TenantContext;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;

class ServicoApiController extends Controller
{
    public function __construct(
        private ProdutoServicoRepository $servicos,
    ) {}

    public function index(Request $request): JsonResponse
    {
        return response()->json($this->servicos->servicosComLc116($request->input('q')));
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
            'id_servico_lc116' => ['nullable', 'integer', 'exists:servicos_lc116,id'],
        ]);

        $model = DB::transaction(function () use ($data, $idEmpresa) {
            $produtoServico = ProdutoServico::create([
                'id_empresa' => $idEmpresa,
                'tipo' => 'S',
                'codigo_interno' => $data['codigo_interno'] ?? null,
                'descricao' => $data['descricao'],
                'ativo' => $data['ativo'] ?? true,
            ]);

            Servico::create([
                'id_produto_servico' => $produtoServico->id,
                'id_servico_lc116' => $data['id_servico_lc116'] ?? null,
            ]);

            return $produtoServico->load('servico');
        });

        return response()->json($model, 201);
    }

    public function show(int $id): JsonResponse
    {
        return response()->json($this->servicos->servicoComLc116($id));
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $servico = $this->servicos->servico($id);

        $data = $request->validate([
            'descricao' => ['required', 'string', 'max:300'],
            'codigo_interno' => ['nullable', 'string', 'max:50'],
            'ativo' => ['sometimes', 'boolean'],
            'id_servico_lc116' => ['nullable', 'integer', 'exists:servicos_lc116,id'],
        ]);

        DB::transaction(function () use ($servico, $data) {
            $servico->update([
                'descricao' => $data['descricao'],
                'codigo_interno' => $data['codigo_interno'] ?? null,
                'ativo' => $data['ativo'] ?? $servico->ativo,
            ]);

            $servico->servico()->updateOrCreate(
                ['id_produto_servico' => $servico->id],
                [
                    'id_servico_lc116' => $data['id_servico_lc116'] ?? null,
                ]
            );
        });

        return response()->json($servico->fresh()->load('servico.servicoLc116'));
    }

    public function destroy(int $id): Response
    {
        $servico = $this->servicos->servico($id);

        DB::transaction(function () use ($servico) {
            $servico->update([
                'ativo' => false,
                'deleted_by' => app(TenantContext::class)->getUsuarioId(),
            ]);
            $servico->delete();
        });

        return response()->noContent();
    }
}
