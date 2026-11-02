<?php

namespace App\Repositories\GrupoF;

use App\Models\Depreciacao;
use App\Repositories\BaseRepository;
use Illuminate\Database\Eloquent\Collection;

class DepreciacaoRepository extends BaseRepository
{
    public function __construct(Depreciacao $model)
    {
        parent::__construct($model);
    }

    public function porPeriodo(int $idPeriodo): Collection
    {
        return $this->query()
            ->where('id_periodo', $idPeriodo)
            ->orderBy('id_ativo')
            ->get();
    }

    public function porAtivo(int $idAtivo): Collection
    {
        return $this->query()
            ->where('id_ativo', $idAtivo)
            ->orderBy('id_periodo')
            ->get();
    }
}