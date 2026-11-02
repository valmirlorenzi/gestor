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
}