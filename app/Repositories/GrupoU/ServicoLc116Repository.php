<?php

namespace App\Repositories\GrupoU;

use App\Models\ServicoLc116;
use App\Repositories\BaseRepository;
use Illuminate\Database\Eloquent\Collection;

class ServicoLc116Repository extends BaseRepository
{
    public function __construct(ServicoLc116 $model)
    {
        parent::__construct($model);
    }

    public function todosOrdenadosPorCodigo(): Collection
    {
        return $this->query()
            ->orderBy('codigo')
            ->get(['id', 'codigo', 'descricao']);
    }
}
