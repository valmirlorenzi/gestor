<?php

namespace App\Repositories\GrupoU;

use App\Models\Ncm;
use App\Repositories\BaseRepository;
use Illuminate\Database\Eloquent\Collection;

class NcmRepository extends BaseRepository
{
    public function __construct(Ncm $model)
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
