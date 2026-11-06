<?php

namespace App\Repositories\GrupoF;

use App\Models\ContaReceber;
use App\Repositories\BaseRepository;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Carbon;

class ContaReceberRepository extends BaseRepository
{
    /** P150 — hardcoded na fase 1; parametrizar por empresa em fase 2. */
    public const JUROS_AO_DIA = 0.033; // %

    public const MULTA = 2.00;         // %

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

    public function porIdComRelacoes(int $id): ContaReceber
    {
        return $this->query()
            ->with(['pessoa', 'contaBancaria', 'formaRecebimento', 'notaFiscal'])
            ->findOrFail($id);
    }

    /**
     * Lista da filial + KPIs (em aberto, inadimplência, recebido, contas abertas).
     * Retorno: ['contas' => [...], 'kpis' => [...]]
     */
    public function listarComKpis(int $idFilial): array
    {
        $contas = $this->query()
            ->with(['pessoa', 'contaBancaria', 'formaRecebimento'])
            ->where('id_filial', $idFilial)
            ->orderBy('data_vencimento')
            ->get();

        $hoje = today();
        $abertas = $contas->whereIn('status', ['Aberta', 'Parcialmente baixada']);
        $vencidas = $abertas->filter(fn ($c) => $c->data_vencimento->lt($hoje));

        return [
            'contas' => $contas->values(),
            'kpis' => [
                'em_aberto' => (float) $abertas->sum(fn ($c) => (float) $c->valor - (float) $c->valor_recebido),
                'inadimplencia' => (float) $vencidas->sum(fn ($c) => (float) $c->valor - (float) $c->valor_recebido),
                'recebido' => (float) $contas->where('status', 'Baixada')->sum('valor_recebido'),
                'contas_abertas' => $abertas->count(),
            ],
        ];
    }

    /**
     * Recebe (total ou parcial). Acumula valor_recebido. Calcula juros/multa
     * automaticamente se em atraso (P150).
     */
    public function receber(int $id, array $dados): ContaReceber
    {
        $conta = $this->findOrFail($id);

        if (! in_array($conta->status, ['Aberta', 'Parcialmente baixada'], true)) {
            throw new \DomainException("Conta {$id} não está em aberto.");
        }

        $dataRecebimento = Carbon::parse($dados['data_recebimento']);
        $vencimento = Carbon::parse($conta->data_vencimento);
        $diasAtraso = max(0, (int) $vencimento->diffInDays($dataRecebimento));

        $juros = $dados['juros'] ?? ($diasAtraso > 0
            ? round((float) $conta->valor * self::JUROS_AO_DIA / 100 * $diasAtraso, 2)
            : 0);
        $multa = $dados['multa'] ?? ($diasAtraso > 0
            ? round((float) $conta->valor * self::MULTA / 100, 2)
            : 0);

        $valorRecebidoAcumulado = round((float) $conta->valor_recebido + (float) $dados['valor_recebido'], 2);
        $status = $valorRecebidoAcumulado >= (float) $conta->valor ? 'Baixada' : 'Parcialmente baixada';
        $statusFluxo = $status === 'Baixada' ? 'Recebido' : 'Parcialmente recebido';

        $conta->update([
            'data_recebimento' => $dados['data_recebimento'],
            'valor_recebido' => $valorRecebidoAcumulado,
            'juros' => (float) $conta->juros + $juros,
            'multa' => (float) $conta->multa + $multa,
            'desconto' => (float) $conta->desconto + (float) ($dados['desconto'] ?? 0),
            'status' => $status,
            'status_fluxo' => $statusFluxo,
            'id_conta_bancaria' => $dados['id_conta_bancaria'] ?? $conta->id_conta_bancaria,
            'id_forma_recebimento' => $dados['id_forma_recebimento'] ?? $conta->id_forma_recebimento,
        ]);

        return $conta->refresh();
    }

    public function estornar(int $id): ContaReceber
    {
        $conta = $this->findOrFail($id);

        if (! in_array($conta->status, ['Baixada', 'Parcialmente baixada'], true)) {
            throw new \DomainException("Conta {$id} não está baixada.");
        }

        $conta->update([
            'data_recebimento' => null,
            'valor_recebido' => 0,
            'juros' => 0,
            'multa' => 0,
            'desconto' => 0,
            'status' => 'Aberta',
            'status_fluxo' => 'Aguardando recebimento',
            'id_conta_bancaria' => null,
            'id_forma_recebimento' => null,
        ]);

        return $conta->refresh();
    }
}
