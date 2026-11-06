<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Pessoa;
use App\Models\PessoaFisica;
use App\Models\PessoaJuridica;
use App\Models\PessoaTag;
use App\Repositories\GrupoA\PessoaRepository;
use App\Services\TenantContext;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;

class FornecedorApiController extends Controller
{
    private const TAG = 'Fornecedor';

    public function __construct(private PessoaRepository $pessoas) {}

    public function index(Request $request): JsonResponse
    {
        $q = trim((string) $request->query('q', ''));

        $colecao = $this->pessoas->listarPorTag(self::TAG, $request->boolean('ativo', true))
            ->when($q !== '', fn ($c) => $c->filter(
                fn (Pessoa $p) => str_contains(mb_strtolower($p->nome), mb_strtolower($q))
                    || str_contains($p->documento, $q)
            ))
            ->values();

        return response()->json($colecao);
    }

    public function store(Request $request): JsonResponse
    {
        $ctx = app(TenantContext::class);

        if ($ctx->getId() === null) {
            return response()->json(['message' => 'Contexto de empresa ausente.'], 422);
        }

        $data = $this->validar($request);

        $pessoa = DB::transaction(function () use ($data, $ctx) {
            $pessoa = Pessoa::create([
                'id_empresa' => $ctx->getId(),
                'tipo' => $data['tipo'],
                'documento' => $data['documento'],
                'nome' => $data['nome'],
                'email' => $data['email'] ?? null,
                'telefone' => $data['telefone'] ?? null,
                'ativo' => $data['ativo'] ?? true,
                'dados_extras' => $this->montarDadosExtras($data),
            ]);

            $this->gravarFilha($pessoa, $data);
            PessoaTag::create(['id_pessoa' => $pessoa->id, 'tag' => self::TAG]);

            return $pessoa;
        });

        return response()->json($this->pessoas->porIdComFilhas($pessoa->id), 201);
    }

    public function show(int $id): JsonResponse
    {
        $pessoa = $this->pessoas->porIdComFilhas($id);

        if ($pessoa === null || ! $this->pessoas->pertenceATag($pessoa, self::TAG)) {
            return response()->json(['message' => 'Fornecedor não encontrado.'], 404);
        }

        return response()->json($pessoa);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $pessoa = $this->pessoas->porIdComFilhas($id);

        if ($pessoa === null || ! $this->pessoas->pertenceATag($pessoa, self::TAG)) {
            return response()->json(['message' => 'Fornecedor não encontrado.'], 404);
        }

        if ($request->input('tipo', $pessoa->tipo) !== $pessoa->tipo) {
            return response()->json([
                'message' => 'Não é possível alterar o tipo (PF/PJ) de uma pessoa já cadastrada.',
            ], 422);
        }

        $data = $this->validar($request, $pessoa->id);

        DB::transaction(function () use ($pessoa, $data) {
            unset($data['id_empresa'], $data['tipo']);

            $pessoa->update([
                'documento' => $data['documento'],
                'nome' => $data['nome'],
                'email' => $data['email'] ?? null,
                'telefone' => $data['telefone'] ?? null,
                'ativo' => $data['ativo'] ?? $pessoa->ativo,
                'dados_extras' => $this->montarDadosExtras($data),
            ]);

            $this->gravarFilha($pessoa, $data);
        });

        return response()->json($this->pessoas->porIdComFilhas($pessoa->id));
    }

    public function destroy(int $id): Response
    {
        $pessoa = $this->pessoas->porIdComFilhas($id);

        if ($pessoa === null || ! $this->pessoas->pertenceATag($pessoa, self::TAG)) {
            return response()->noContent();
        }

        DB::transaction(function () use ($pessoa) {
            $pessoa->forceFill([
                'ativo' => false,
                'deleted_by' => app(TenantContext::class)->getUsuarioId(),
            ])->save();
            $pessoa->delete();
        });

        return response()->noContent();
    }

    private function validar(Request $request, ?int $ignorarId = null): array
    {
        $regraDocumento = 'required|string|max:14';
        if ($ignorarId !== null) {
            $regraDocumento .= '|unique:pessoas,documento,'.$ignorarId.',id,id_empresa,'.app(TenantContext::class)->getId();
        } else {
            $regraDocumento .= '|unique:pessoas,documento,NULL,id,id_empresa,'.app(TenantContext::class)->getId();
        }

        $regras = [
            'tipo' => 'required|in:PF,PJ',
            'documento' => $regraDocumento,
            'nome' => 'required|string|max:200',
            'email' => 'nullable|email|max:200',
            'telefone' => 'nullable|string|max:20',
            'ativo' => 'nullable|boolean',
            'categoria' => 'nullable|string|max:50',
            'data_nascimento' => 'required_if:tipo,PF|nullable|date',
            'nome_fantasia' => 'nullable|string|max:200',
            'id_municipio' => 'nullable|integer|exists:municipios,id',
            'categoria_padrao' => 'nullable|string|max:50',
            'prazo_padrao_dias' => 'nullable|integer|min:0',
        ];

        return $request->validate($regras);
    }

    private function montarDadosExtras(array $data): ?array
    {
        $categoria = $data['categoria'] ?? null;

        return $categoria !== null ? ['categoria' => $categoria] : null;
    }

    private function gravarFilha(Pessoa $pessoa, array $data): void
    {
        if ($pessoa->tipo === 'PF') {
            PessoaFisica::updateOrCreate(
                ['id_pessoa' => $pessoa->id],
                ['data_nascimento' => $data['data_nascimento'] ?? null]
            );
        } else {
            PessoaJuridica::updateOrCreate(
                ['id_pessoa' => $pessoa->id],
                [
                    'nome_fantasia' => $data['nome_fantasia'] ?? null,
                    'id_municipio' => $data['id_municipio'] ?? null,
                    'categoria_padrao' => $data['categoria_padrao'] ?? null,
                    'prazo_padrao_dias' => $data['prazo_padrao_dias'] ?? null,
                ]
            );
        }
    }
}
