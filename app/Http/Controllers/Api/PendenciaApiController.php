<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Auditoria;
use App\Repositories\GrupoF\PendenciaRepository;
use App\Services\TenantContext;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PendenciaApiController extends Controller
{
    public function __construct(private PendenciaRepository $pendencias) {}

    public function index(Request $request): JsonResponse
    {
        return response()->json(
            $this->pendencias->listarComFiltros(
                $request->input('categoria'),
                $request->input('status'),
                $request->input('q'),
            )
        );
    }

    public function resolver(Request $request, int $id): JsonResponse
    {
        $pendencia = $this->pendencias->porId($id);

        $data = $request->validate([
            'justificativa' => ['required', 'string', 'max:500'],
        ]);

        $anteriores = $pendencia->fresh()->toArray();

        DB::transaction(function () use ($pendencia, $anteriores, $data, $request) {
            $this->pendencias->resolver($pendencia->id, [
                'status' => 'Resolvida',
                'id_usuario_resolucao' => app(TenantContext::class)->getUsuarioId(),
                'justificativa' => $data['justificativa'],
            ]);

            Auditoria::create([
                'id_usuario' => app(TenantContext::class)->getUsuarioId(),
                'acao' => 'Resolucao_pendencia',
                'tabela' => 'pendencias',
                'id_registro' => $pendencia->id,
                'dados_anteriores' => $anteriores,
                'dados_novos' => $pendencia->fresh()->toArray(),
                'justificativa' => $data['justificativa'],
                'ip' => $request->ip(),
            ]);
        });

        return response()->json($pendencia->fresh());
    }
}
