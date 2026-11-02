<?php

namespace App\Repositories\GrupoA;

use App\Models\CenarioSimulacao;
use App\Repositories\BaseRepository;
use Illuminate\Database\Eloquent\Collection;

class CenarioSimulacaoRepository extends BaseRepository
{
    public function __construct(CenarioSimulacao $model)
    {
        parent::__construct($model);
    }

    public function salvos(): Collection
    {
        return $this->query()
            ->where('status', 'Salvo')
            ->orderByDesc('updated_at')
            ->get();
    }

    public function porNome(string $nome): ?CenarioSimulacao
    {
        return $this->query()->where('nome', $nome)->first();
    }
}