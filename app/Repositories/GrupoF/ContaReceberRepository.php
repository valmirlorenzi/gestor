<?php

namespace App\Repositories\GrupoF;

use App\Models\ContaReceber;
use App\Repositories\BaseRepository;
use Illuminate\Database\Eloquent\Collection;

class ContaReceberRepository extends BaseRepository
{
    public function __construct(ContaReceber $model)
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

    public function receber(int $id, array $dados): ContaReceber
    {
        $conta = $this->findOrFail($id);

        if (! in_array($conta->status, ['Aberta', 'Parcialmente baixada'], true)) {
            throw new \DomainException("Conta {$id} não está em aberto.");
        }

        $conta->update([
            'data_recebimento' => $dados['data_recebimento'],
            'valor_recebido' => $dados['valor_recebido'],
            'juros' => $dados['juros'] ?? 0,
            'multa' => $dados['multa'] ?? 0,
            'desconto' => $dados['desconto'] ?? 0,
            'status' => 'Baixada',
            'id_conta_bancaria' => $dados['id_conta_bancaria'] ?? null,
            'id_forma_recebimento' => $dados['id_forma_recebimento'] ?? null,
        ]);

        return $conta->refresh();
    }
}
