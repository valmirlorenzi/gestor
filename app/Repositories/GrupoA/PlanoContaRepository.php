<?php

namespace App\Repositories\GrupoA;

use App\Models\PlanoConta;
use App\Repositories\BaseRepository;
use Illuminate\Database\Eloquent\Collection;

class PlanoContaRepository extends BaseRepository
{
    public function __construct(PlanoConta $model)
    {
        parent::__construct($model);
    }

    public function analiticas(): Collection
    {
        return $this->query()
            ->where('aceita_lancamento', true)
            ->where('ativo', true)
            ->orderBy('codigo')
            ->get();
    }

    public function porCodigo(string $codigo): ?PlanoConta
    {
        return $this->query()->where('codigo', $codigo)->first();
    }

    public function filhos(int $idContaPai): Collection
    {
        return $this->query()
            ->where('id_conta_pai', $idContaPai)
            ->orderBy('codigo')
            ->get();
    }
}
