<?php

namespace App\Repositories\GrupoF;

use App\Models\ContaPagar;
use App\Repositories\BaseRepository;
use Illuminate\Database\Eloquent\Collection;

class ContaPagarRepository extends BaseRepository
{
    public function __construct(ContaPagar $model)
    {
        parent::__construct($model);
    }

    public function emAberto(): Collection
    {
        return $this->query()
            ->whereIn('status', ['Aberta', 'Parcialmente baixada'])
            ->orderBy('data_vencimento')
            ->get();
    }

    public function vencidas(): Collection
    {
        return $this->query()
            ->whereIn('status', ['Aberta', 'Parcialmente baixada'])
            ->where('data_vencimento', '<', now()->toDateString())
            ->orderBy('data_vencimento')
            ->get();
    }

    public function porPessoa(int $idPessoa): Collection
    {
        return $this->query()
            ->where('id_pessoa', $idPessoa)
            ->orderBy('data_vencimento')
            ->get();
    }

    public function porFilial(int $idFilial): Collection
    {
        return $this->query()
            ->where('id_filial', $idFilial)
            ->orderByDesc('data_vencimento')
            ->get();
    }

    /**
     * Baixa uma conta: muda status + preenche dados de pagamento.
     * (A criação do lançamento fica no Bloco 7 — serviço de baixa.)
     */
    public function baixar(int $id, array $dados): ContaPagar
    {
        $conta = $this->findOrFail($id);

        if (! in_array($conta->status, ['Aberta', 'Parcialmente baixada'], true)) {
            throw new \DomainException("Conta {$id} não está em aberto.");
        }

        $conta->update([
            'data_pagamento' => $dados['data_pagamento'],
            'valor_pago' => $dados['valor_pago'],
            'juros' => $dados['juros'] ?? 0,
            'multa' => $dados['multa'] ?? 0,
            'desconto' => $dados['desconto'] ?? 0,
            'status' => 'Baixada',
            'id_conta_bancaria' => $dados['id_conta_bancaria'] ?? null,
            'id_forma_pagamento' => $dados['id_forma_pagamento'] ?? null,
        ]);

        return $conta->refresh();
    }
}
