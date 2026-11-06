<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Repositories\GrupoA\FormaPagamentoRepository;
use App\Repositories\GrupoF\ContaBancariaRepository;
use App\Repositories\GrupoF\ContaPagarRepository;
use App\Services\TenantContext;
use Illuminate\Http\Request;

class ContaPagarApiController extends Controller
{
    public function __construct(
        private ContaPagarRepository $contas,
        private ContaBancariaRepository $bancos,
        private FormaPagamentoRepository $formas,
        private TenantContext $tenant,
    ) {}

    public function index()
    {
        $filialId = $this->tenant->getFilialId();
        if ($filialId === null) {
            return response()->json(['message' => 'Contexto de filial ausente.'], 422);
        }

        return response()->json($this->contas->listarComKpis($filialId));
    }

    public function show(int $id)
    {
        return response()->json($this->contas->porIdComRelacoes($id));
    }

    public function opcoes()
    {
        $filialId = $this->tenant->getFilialId();

        return response()->json([
            'contas_bancarias' => $filialId ? $this->bancos->porFilial($filialId) : [],
            'formas_pagamento' => $this->formas->ativas(),
        ]);
    }

    public function baixar(Request $request, int $id)
    {
        $dados = $request->validate([
            'data_pagamento' => 'required|date|before_or_equal:today',
            'valor_pago' => 'required|numeric|min:0.01',
            'juros' => 'nullable|numeric|min:0',
            'multa' => 'nullable|numeric|min:0',
            'desconto' => 'nullable|numeric|min:0',
            'id_conta_bancaria' => 'nullable|integer|exists:contas_bancarias,id',
            'id_forma_pagamento' => 'nullable|integer|exists:formas_pagamento,id',
            'observacoes' => 'nullable|string|max:1000',
        ]);

        try {
            $conta = $this->contas->baixar($id, $dados);
        } catch (\DomainException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }

        return response()->json($conta);
    }

    public function estornar(int $id)
    {
        try {
            $conta = $this->contas->estornar($id);
        } catch (\DomainException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }

        return response()->json($conta);
    }
}
