<?php

namespace App\Repositories\GrupoU;

use App\Models\Cst;
use App\Repositories\BaseRepository;
use Illuminate\Database\Eloquent\Collection;

class CstRepository extends BaseRepository
{
    public function __construct(Cst $model)
    {
        parent::__construct($model);
    }

    public function paraSelect(): Collection
    {
        return $this->query()
            ->orderBy('tipo_imposto')
            ->orderBy('codigo')
            ->get(['id', 'tipo_imposto', 'codigo', 'descricao']);
    }
}
