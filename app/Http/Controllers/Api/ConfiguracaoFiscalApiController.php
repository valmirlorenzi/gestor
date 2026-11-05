<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Repositories\GrupoA\EmpresaRepository;
use App\Services\TenantContext;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ConfiguracaoFiscalApiController extends Controller
{
    public function __construct(private EmpresaRepository $empresas) {}

    public function show(): JsonResponse
    {
        $idEmpresa = app(TenantContext::class)->getId();

        if ($idEmpresa === null) {
            return response()->json(['message' => 'Contexto de empresa ausente.'], 422);
        }

        return response()->json($this->empresas->porId($idEmpresa));
    }

    public function update(Request $request): JsonResponse
    {
        $idEmpresa = app(TenantContext::class)->getId();

        if ($idEmpresa === null) {
            return response()->json(['message' => 'Contexto de empresa ausente.'], 422);
        }

        $data = $request->validate([
            'regime_fiscal' => ['required', 'in:Simples,Presumido,Real'],
            'setor' => ['required', 'in:Comercio,Servicos,Misto'],
            'metodo_custo' => ['required', 'in:XML,Medio,Manual'],
        ]);

        $empresa = $this->empresas->atualizarFiscal($idEmpresa, $data);

        return response()->json($empresa);
    }
}
