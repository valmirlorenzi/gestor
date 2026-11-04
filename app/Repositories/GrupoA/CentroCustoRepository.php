<?php

namespace App\Repositories\GrupoA;

use App\Models\CentroCusto;
use App\Repositories\BaseRepository;
use Illuminate\Database\Eloquent\Collection;

class CentroCustoRepository extends BaseRepository
{
    public function __construct(CentroCusto $model)
    {
        parent::__construct($model);
    }

    public function ativos(): Collection
    {
        return $this->query()
            ->where('ativo', true)
            ->orderBy('nome')
            ->get();
    }
}
