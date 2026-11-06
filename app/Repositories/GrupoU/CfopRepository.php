<?php

namespace App\Repositories\GrupoU;

use App\Models\Cfop;
use App\Repositories\BaseRepository;
use Illuminate\Database\Eloquent\Collection;

class CfopRepository extends BaseRepository
{
    public function __construct(Cfop $model)
    {
        parent::__construct($model);
    }

    public function paraSelect(): Collection
    {
        return $this->query()
            ->orderBy('codigo')
            ->get(['id', 'codigo', 'descricao']);
    }
}
