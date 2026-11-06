<?php

namespace App\Repositories\GrupoF;

use App\Models\Tarefa;
use App\Repositories\BaseRepository;
use Illuminate\Database\Eloquent\Collection;

class TarefaRepository extends BaseRepository
{
    public function __construct(Tarefa $model)
    {
        parent::__construct($model);
    }

    public function caixaEntradaDoAtor(int $idAtor): Collection
    {
        return $this->query()
            ->where('id_ator_destino', $idAtor)
            ->whereIn('status', ['pendente', 'em_andamento'])
            ->orderByDesc('urgente')
            ->orderByDesc('prioridade')
            ->orderBy('data_criacao')
            ->get();
    }

    public function pendentes(): Collection
    {
        return $this->query()
            ->where('status', 'pendente')
            ->orderByDesc('urgente')
            ->orderByDesc('prioridade')
            ->get();
    }

    public function emAndamento(): Collection
    {
        return $this->query()
            ->where('status', 'em_andamento')
            ->orderBy('data_criacao')
            ->get();
    }

    public function concluidas(): Collection
    {
        return $this->query()
            ->where('status', 'concluida')
            ->orderByDesc('data_conclusao')
            ->get();
    }

    public function urgentes(): Collection
    {
        return $this->query()
            ->where('urgente', true)
            ->whereIn('status', ['pendente', 'em_andamento'])
            ->orderBy('data_criacao')
            ->get();
    }

    public function porFilial(int $idFilial): Collection
    {
        return $this->query()
            ->where('id_filial', $idFilial)
            ->whereIn('status', ['pendente', 'em_andamento'])
            ->get();
    }

    /**
     * Conta tarefas pendentes/em_andamento do ator (KPI da Tela Inicial).
     * Respeita o global scope de tenant (filtra por empresa via filial).
     */
    public function contarPendentesDoAtor(int $idAtor): int
    {
        return $this->query()
            ->where('id_ator_destino', $idAtor)
            ->whereIn('status', ['pendente', 'em_andamento'])
            ->count();
    }

    /**
     * As 3 primeiras ordens do ator (RN7 da Tela Inicial).
     * Mesma ordenação de caixaEntradaDoAtor, mas limitada.
     */
    public function primeirasOrdensDoAtor(int $idAtor, int $limite = 3): Collection
    {
        return $this->query()
            ->where('id_ator_destino', $idAtor)
            ->whereIn('status', ['pendente', 'em_andamento'])
            ->orderByDesc('urgente')
            ->orderByDesc('prioridade')
            ->orderBy('data_criacao')
            ->limit($limite)
            ->get();
    }

    public function caixaSaidaDoAtor(int $idAtor): Collection
    {
        return $this->query()
            ->where('id_ator_origem', $idAtor)
            ->whereIn('status', ['pendente', 'em_andamento'])
            ->orderByDesc('urgente')
            ->orderBy('data_criacao')
            ->get();
    }

    public function historicoDoAtor(int $idAtor, int $limite = 50): Collection
    {
        return $this->query()
            ->where('status', 'concluida')
            ->where(fn ($q) => $q->where('id_ator_origem', $idAtor)
                ->orWhere('id_ator_destino', $idAtor))
            ->orderByDesc('data_conclusao')
            ->limit($limite)
            ->get();
    }

    public function criarOrdem(array $data): Tarefa
    {
        if (! isset($data['data_criacao'])) {
            $data['data_criacao'] = now();
        }

        return $this->create($data);
    }

    public function porDocumentoETipo(int $idFilial, int $idDocumento, string $tipoDocumento, string $tipoOrdem): ?Tarefa
    {
        return $this->query()
            ->where('id_filial', $idFilial)
            ->where('id_documento', $idDocumento)
            ->where('tipo_documento', $tipoDocumento)
            ->where('tipo_ordem', $tipoOrdem)
            ->orderByDesc('id')
            ->first();
    }
}
