<?php

namespace App\Repositories\GrupoF;

use App\Models\ContaPagar;
use App\Repositories\BaseRepository;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Carbon;

class ContaPagarRepository extends BaseRepository
{
    /** P150 — hardcoded na fase 1; parametrizar por empresa em fase 2. */
    public const JUROS_AO_DIA = 0.033; // %

    public const MULTA = 2.00;         // %

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
            ->whereDate('data_vencimento', '<', today())
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

    public function porIdComRelacoes(int $id): ContaPagar
    {
        return $this->query()
            ->with(['pessoa', 'contaBancaria', 'formaPagamento', 'notaFiscal'])
            ->findOrFail($id);
    }

    /**
     * Lista da filial + KPIs (em aberto, vencidas, pago, contas abertas).
     * Retorno: ['contas' => [...], 'kpis' => [...]]
     */
    public function listarComKpis(int $idFilial): array
    {
        $contas = $this->query()
            ->with(['pessoa', 'contaBancaria', 'formaPagamento'])
            ->where('id_filial', $idFilial)
            ->orderBy('data_vencimento')
            ->get();

        $hoje = today();
        $abertas = $contas->whereIn('status', ['Aberta', 'Parcialmente baixada']);
        $vencidas = $abertas->filter(fn ($c) => $c->data_vencimento->lt($hoje));

        return [
            'contas' => $contas->values(),
            'kpis' => [
                'em_aberto' => (float) $abertas->sum(fn ($c) => (float) $c->valor - (float) $c->valor_pago),
                'vencidas' => (float) $vencidas->sum(fn ($c) => (float) $c->valor - (float) $c->valor_pago),
                'pago' => (float) $contas->where('status', 'Baixada')->sum('valor_pago'),
                'contas_abertas' => $abertas->count(),
            ],
        ];
    }

    /**
     * Baixa (total ou parcial). Acumula valor_pago. Calcula juros/multa
     * automaticamente se vencida (P150). Bloco 13 fará o lançamento contábil
     * (id_lancamento_baixa) e a auditoria (P151).
     */
    public function baixar(int $id, array $dados): ContaPagar
    {
        $conta = $this->findOrFail($id);

        if (! in_array($conta->status, ['Aberta', 'Parcialmente baixada'], true)) {
            throw new \DomainException("Conta {$id} não está em aberto.");
        }

        $dataPagamento = Carbon::parse($dados['data_pagamento']);
        $vencimento = Carbon::parse($conta->data_vencimento);
        $diasAtraso = max(0, (int) $vencimento->diffInDays($dataPagamento));

        $juros = $dados['juros'] ?? ($diasAtraso > 0
            ? round((float) $conta->valor * self::JUROS_AO_DIA / 100 * $diasAtraso, 2)
            : 0);
        $multa = $dados['multa'] ?? ($diasAtraso > 0
            ? round((float) $conta->valor * self::MULTA / 100, 2)
            : 0);

        $valorPagoAcumulado = round((float) $conta->valor_pago + (float) $dados['valor_pago'], 2);
        $status = $valorPagoAcumulado >= (float) $conta->valor ? 'Baixada' : 'Parcialmente baixada';
        $statusFluxo = $status === 'Baixada' ? 'Pago' : 'Parcialmente pago';

        $conta->update([
            'data_pagamento' => $dados['data_pagamento'],
            'valor_pago' => $valorPagoAcumulado,
            'juros' => (float) $conta->juros + $juros,
            'multa' => (float) $conta->multa + $multa,
            'desconto' => (float) $conta->desconto + (float) ($dados['desconto'] ?? 0),
            'status' => $status,
            'status_fluxo' => $statusFluxo,
            'id_conta_bancaria' => $dados['id_conta_bancaria'] ?? $conta->id_conta_bancaria,
            'id_forma_pagamento' => $dados['id_forma_pagamento'] ?? $conta->id_forma_pagamento,
        ]);

        return $conta->refresh();
    }

    public function estornar(int $id): ContaPagar
    {
        $conta = $this->findOrFail($id);

        if (! in_array($conta->status, ['Baixada', 'Parcialmente baixada'], true)) {
            throw new \DomainException("Conta {$id} não está baixada.");
        }

        $conta->update([
            'data_pagamento' => null,
            'valor_pago' => 0,
            'juros' => 0,
            'multa' => 0,
            'desconto' => 0,
            'status' => 'Aberta',
            'status_fluxo' => 'Aguardando pagamento',
            'id_conta_bancaria' => null,
            'id_forma_pagamento' => null,
        ]);

        return $conta->refresh();
    }
}
