<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Auditoria;
use App\Repositories\GrupoF\PeriodoRepository;
use App\Repositories\GrupoF\RazaoImpostoRepository;
use App\Services\TenantContext;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ValidacaoCalculoApiController extends Controller
{
    public function __construct(
        private RazaoImpostoRepository $razoes,
        private PeriodoRepository $periodos,
    ) {}

    public function razoesImpostos(): JsonResponse
    {
        $idFilial = app(TenantContext::class)->getFilialId();
        if ($idFilial === null) {
            return response()->json(['message' => 'Contexto de filial ausente.'], 422);
        }

        $mesAno = $this->periodos->abertoDaFilial($idFilial);
        if ($mesAno === null) {
            return response()->json([]);
        }

        $periodo = $this->periodos->porFilialEMesAno($idFilial, $mesAno);
        if ($periodo === null) {
            return response()->json([]);
        }

        $data = $this->razoes->porPeriodo($periodo->id)->map(function ($r) {
            $extras = $r->dados_extras ?? [];

            return [
                'id' => $r->id,
                'tipo_imposto' => $r->tipo_imposto,
                'natureza' => $r->natureza,
                'valor' => $r->valor,
                'id_pessoa' => $r->id_pessoa,
                'id_nota_fiscal' => $r->id_nota_fiscal,
                'validado' => (bool) ($extras['validado'] ?? false),
                'validado_em' => $extras['validado_em'] ?? null,
            ];
        });

        return response()->json($data);
    }

    public function validarRazao(Request $request, int $id): JsonResponse
    {
        $razao = $this->razoes->porId($id);

        $anteriores = $razao->fresh()->toArray();

        DB::transaction(function () use ($razao, $anteriores, $request) {
            $extras = $razao->dados_extras ?? [];
            $extras['validado'] = true;
            $extras['validado_em'] = now()->toIso8601String();

            $razao->update(['dados_extras' => $extras]);

            Auditoria::create([
                'id_usuario' => app(TenantContext::class)->getUsuarioId(),
                'acao' => 'Validacao_razao',
                'tabela' => 'razoes_impostos',
                'id_registro' => $razao->id,
                'dados_anteriores' => $anteriores,
                'dados_novos' => $razao->fresh()->toArray(),
                'justificativa' => 'Validação de cálculo',
                'ip' => $request->ip(),
            ]);
        });

        return response()->json($razao->fresh());
    }

    public function overrideRazao(Request $request, int $id): JsonResponse
    {
        $razao = $this->razoes->porId($id);

        $data = $request->validate([
            'justificativa' => ['required', 'string', 'max:500'],
        ]);

        $anteriores = $razao->fresh()->toArray();

        DB::transaction(function () use ($razao, $anteriores, $data, $request) {
            $extras = $razao->dados_extras ?? [];
            $extras['validado'] = true;
            $extras['validado_em'] = now()->toIso8601String();
            $extras['override'] = true;

            $razao->update(['dados_extras' => $extras]);

            Auditoria::create([
                'id_usuario' => app(TenantContext::class)->getUsuarioId(),
                'acao' => 'Override_razao',
                'tabela' => 'razoes_impostos',
                'id_registro' => $razao->id,
                'dados_anteriores' => $anteriores,
                'dados_novos' => $razao->fresh()->toArray(),
                'justificativa' => $data['justificativa'],
                'ip' => $request->ip(),
            ]);
        });

        return response()->json($razao->fresh());
    }
}
