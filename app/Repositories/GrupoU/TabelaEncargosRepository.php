<?php

namespace App\Repositories\GrupoU;

use App\Models\TabelaEncargos;
use App\Repositories\BaseRepository;
use Illuminate\Database\Eloquent\Collection;

class TabelaEncargosRepository extends BaseRepository
{
    public function __construct(TabelaEncargos $model)
    {
        parent::__construct($model);
    }

    public function vigentes(): Collection
    {
        $hoje = now()->toDateString();

        return $this->query()
            ->whereDate('data_inicio_validade', '<=', $hoje)
            ->where(function ($q) use ($hoje) {
                $q->whereNull('data_fim_validade')
                    ->orWhereDate('data_fim_validade', '>=', $hoje);
            })
            ->orderBy('descricao')
            ->get();
    }

    public function todasOrdenadas(): Collection
    {
        return $this->query()
            ->orderByDesc('data_inicio_validade')
            ->orderBy('descricao')
            ->get();
    }
}
