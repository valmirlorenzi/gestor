<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ParametroFiscal;
use App\Repositories\GrupoH\ParametroFiscalRepository;
use App\Services\TenantContext;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ParametroFiscalApiController extends Controller
{
    public function __construct(private ParametroFiscalRepository $parametros) {}

    public function index(Request $request): JsonResponse
    {
        return response()->json(
            $this->parametros->listar(
                $request->input('tipo_imposto'),
                $request->input('q'),
            )
        );
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'id_empresa' => ['nullable', 'integer'],
            'tipo_imposto' => ['required', 'string', 'max:20'],
            'descricao' => ['required', 'string', 'max:100'],
            'aliquota' => ['required', 'numeric', 'min:0', 'max:100'],
            'base_calculo' => ['nullable', 'string', 'max:50'],
            'data_inicio_validade' => ['required', 'date'],
            'data_fim_validade' => ['nullable', 'date', 'after_or_equal:data_inicio_validade'],
        ]);

        // id_empresa NULL = global; preenchido = override (só da empresa do contexto).
        $idEmpresa = app(TenantContext::class)->getId();

        if (isset($data['id_empresa']) && $data['id_empresa'] !== null) {
            if ((int) $data['id_empresa'] !== (int) $idEmpresa) {
                return response()->json(['message' => 'Empresa não pertence ao contexto.'], 422);
            }
        }

        $model = ParametroFiscal::create($data);

        return response()->json($model, 201);
    }

    public function show(int $id): JsonResponse
    {
        return response()->json($this->parametros->porId($id));
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $param = $this->parametros->porId($id);

        $data = $request->validate([
            'tipo_imposto' => ['required', 'string', 'max:20'],
            'descricao' => ['required', 'string', 'max:100'],
            'aliquota' => ['required', 'numeric', 'min:0', 'max:100'],
            'base_calculo' => ['nullable', 'string', 'max:50'],
            'data_inicio_validade' => ['required', 'date'],
            'data_fim_validade' => ['nullable', 'date', 'after_or_equal:data_inicio_validade'],
        ]);

        unset($data['id_empresa']);

        $param->update($data);

        return response()->json($param->fresh());
    }
}
