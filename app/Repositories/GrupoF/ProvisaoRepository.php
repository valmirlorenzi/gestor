<?php

namespace App\Repositories\GrupoF;

use App\Models\Provisao;
use App\Repositories\BaseRepository;
use Illuminate\Database\Eloquent\Collection;

class ProvisaoRepository extends BaseRepository
{
    public function __construct(Provisao $model)
    {
        parent::__construct($model);
    }

    public function porPeriodo(int $idPeriodo): Collection
    {
        return $this->query()
            ->where('id_periodo', $idPeriodo)
            ->orderBy('id_funcionario')
            ->get();
    }

    public function porTipo(string $tipo): Collection
    {
        return $this->query()
            ->where('tipo', $tipo)
            ->orderBy('id_funcionario')
            ->get();
    }
}