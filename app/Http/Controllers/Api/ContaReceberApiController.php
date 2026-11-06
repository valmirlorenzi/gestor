<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Repositories\GrupoA\FormaPagamentoRepository;
use App\Repositories\GrupoF\ContaBancariaRepository;
use App\Repositories\GrupoF\ContaReceberRepository;
use App\Services\TenantContext;
use Illuminate\Http\Request;

class ContaReceberApiController extends Controller
{
    public function __construct(
        private ContaReceberRepository $contas,
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

    public function receber(Request $request, int $id)
    {
        $dados = $request->validate([
            'data_recebimento' => 'required|date|before_or_equal:today',
            'valor_recebido' => 'required|numeric|min:0.01',
            'juros' => 'nullable|numeric|min:0',
            'multa' => 'nullable|numeric|min:0',
            'desconto' => 'nullable|numeric|min:0',
            'id_conta_bancaria' => 'nullable|integer|exists:contas_bancarias,id',
            'id_forma_recebimento' => 'nullable|integer|exists:formas_pagamento,id',
            'observacoes' => 'nullable|string|max:1000',
        ]);

        try {
            $conta = $this->contas->receber($id, $dados);
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
