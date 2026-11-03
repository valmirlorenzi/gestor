<?php

namespace App\Services;

use App\Repositories\GrupoF\TarefaRepository;
use Illuminate\Database\Eloquent\Collection;

/**
 * Centraliza as consultas das 3 telas de "Meu Trabalho" (1.1/1.2/1.3).
 *
 * Delega TUDO ao TarefaRepository (que tem acesso ao query() protegido
 * do BaseRepository). O service só orquestra.
 */
class TarefaService
{
    public function __construct(private TarefaRepository $tarefas) {}

    public function caixaEntrada(int $atorId): Collection
    {
        return $this->tarefas->caixaEntradaDoAtor($atorId);
    }

    public function caixaSaida(int $atorId): Collection
    {
        return $this->tarefas->caixaSaidaDoAtor($atorId);
    }

    public function historico(int $atorId): Collection
    {
        return $this->tarefas->historicoDoAtor($atorId);
    }
}
