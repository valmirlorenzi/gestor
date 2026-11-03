<?php

namespace App\Repositories\GrupoF;

use App\Models\ContaBancaria;
use App\Repositories\BaseRepository;
use Illuminate\Database\Eloquent\Collection;

class ContaBancariaRepository extends BaseRepository
{
    public function __construct(ContaBancaria $model)
    {
        parent::__construct($model);
    }

    public function ativas(): Collection
    {
        return $this->query()
            ->where('ativo', true)
            ->orderBy('numero')
            ->get();
    }

    public function porFilial(int $idFilial): Collection
    {
        return $this->query()
            ->where('id_filial', $idFilial)
            ->where('ativo', true)
            ->get();
    }
}
