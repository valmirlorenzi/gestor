<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\RegraClassificacao;
use App\Repositories\GrupoA\RegraClassificacaoRepository;
use App\Repositories\GrupoC\RegraClassificacaoLogRepository;
use App\Services\TenantContext;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;

class RegraClassificacaoApiController extends Controller
{
    public function __construct(
        private RegraClassificacaoRepository $regras,
        private RegraClassificacaoLogRepository $logs,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $regras = $this->regras->listar(
            $request->input('q'),
            $request->input('origem'),
            $request->input('ativo'),
        );

        return response()->json($regras->load([
            'tipoDocumento', 'cfop', 'cst', 'ncm', 'servicoLc116',
            'fornecedor', 'contaDestino', 'centroCustoPadrao',
            'contaContrapartidaPadrao',
        ]));
    }

    public function store(Request $request): JsonResponse
    {
        $idEmpresa = app(TenantContext::class)->getId();
        if ($idEmpresa === null) {
            return response()->json(['message' => 'Contexto de empresa ausente.'], 422);
        }

        $data = $this->validar($request);

        $data['id_empresa'] = $idEmpresa;
        $data['origem'] = 'Manual';
        $data['ativo'] = $data['ativo'] ?? true;

        $regra = DB::transaction(function () use ($data) {
            $regra = RegraClassificacao::create($data);

            $this->logs->registrar(
                idRegra: $regra->id,
                acao: 'Criada',
                idUsuario: app(TenantContext::class)->getUsuarioId(),
                dadosNovos: $regra->fresh()->toArray(),
            );

            return $regra;
        });

        return response()->json($regra->load([
            'tipoDocumento', 'cfop', 'contaDestino', 'centroCustoPadrao', 'contaContrapartidaPadrao',
        ]), 201);
    }

    public function show(int $id): JsonResponse
    {
        return response()->json($this->regras->porId($id)->load([
            'tipoDocumento', 'cfop', 'cst', 'ncm', 'servicoLc116',
            'fornecedor', 'contaDestino', 'centroCustoPadrao',
            'contaContrapartidaPadrao',
        ]));
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $regra = $this->regras->porId($id);

        $data = $this->validar($request);
        unset($data['id_empresa']);

        $anteriores = $regra->fresh()->toArray();

        $regra = DB::transaction(function () use ($regra, $data, $anteriores) {
            $regra->update($data);

            $this->logs->registrar(
                idRegra: $regra->id,
                acao: 'Editada',
                idUsuario: app(TenantContext::class)->getUsuarioId(),
                dadosAnteriores: $anteriores,
                dadosNovos: $regra->fresh()->toArray(),
            );

            return $regra->fresh();
        });

        return response()->json($regra->load([
            'tipoDocumento', 'cfop', 'contaDestino', 'centroCustoPadrao', 'contaContrapartidaPadrao',
        ]));
    }

    public function destroy(int $id): Response
    {
        $regra = $this->regras->porId($id);

        DB::transaction(function () use ($regra) {
            $regra->update([
                'ativo' => false,
                'deleted_by' => app(TenantContext::class)->getUsuarioId(),
            ]);
            $regra->delete();

            $this->logs->registrar(
                idRegra: $regra->id,
                acao: 'Desativada',
                idUsuario: app(TenantContext::class)->getUsuarioId(),
            );
        });

        return response()->noContent();
    }

    public function reativar(int $id): JsonResponse
    {
        $regra = $this->regras->porId($id);

        $regra = DB::transaction(function () use ($regra) {
            $regra->update(['ativo' => true, 'deleted_at' => null]);

            $this->logs->registrar(
                idRegra: $regra->id,
                acao: 'Reativada',
                idUsuario: app(TenantContext::class)->getUsuarioId(),
            );

            return $regra->fresh();
        });

        return response()->json($regra);
    }

    /**
     * Testa o motor contra um conjunto de atributos, sem gravar nada.
     * Retorna a regra vencedora (1ª por prioridade) ou null.
     */
    public function testar(Request $request): JsonResponse
    {
        $data = $request->validate([
            'id_tipo_documento' => ['nullable', 'integer'],
            'id_cfop' => ['nullable', 'integer'],
            'id_cst' => ['nullable', 'integer'],
            'id_ncm' => ['nullable', 'integer'],
            'id_servico_lc116' => ['nullable', 'integer'],
            'id_pessoa_fornecedor' => ['nullable', 'integer'],
            'historico_palavra_chave' => ['nullable', 'string', 'max:100'],
        ]);

        $candidatas = $this->regras->candidatas(
            $data['id_tipo_documento'] ?? null,
            $data['id_cfop'] ?? null,
            $data['id_cst'] ?? null,
            $data['id_ncm'] ?? null,
            $data['id_servico_lc116'] ?? null,
            $data['id_pessoa_fornecedor'] ?? null,
            $data['historico_palavra_chave'] ?? null,
        );

        return response()->json([
            'vencedora' => $candidatas->first(),
            'total_candidatas' => $candidatas->count(),
        ]);
    }

    private function validar(Request $request): array
    {
        return $request->validate([
            'descricao' => ['required', 'string', 'max:200'],
            'prioridade' => ['required', 'integer', 'between:1,8'],
            'id_tipo_documento' => ['nullable', 'integer', 'exists:tipos_documento,id'],
            'id_cfop' => ['nullable', 'integer', 'exists:cfops,id'],
            'id_cst' => ['nullable', 'integer', 'exists:csts,id'],
            'id_ncm' => ['nullable', 'integer', 'exists:ncms,id'],
            'id_servico_lc116' => ['nullable', 'integer', 'exists:servicos_lc116,id'],
            'id_pessoa_fornecedor' => ['nullable', 'integer', 'exists:pessoas,id'],
            'categoria_fornecedor' => ['nullable', 'string', 'max:50'],
            'historico_palavra_chave' => ['nullable', 'string', 'max:100'],
            'id_conta_destino' => ['required', 'integer', 'exists:planos_contas,id'],
            'id_centro_custo_padrao' => ['nullable', 'integer', 'exists:centros_custo,id'],
            'id_conta_contrapartida_padrao' => ['nullable', 'integer', 'exists:planos_contas,id'],
            'ativo' => ['sometimes', 'boolean'],
        ]);
    }
}
