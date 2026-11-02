<?php

namespace App\Repositories\GrupoA;

use App\Models\CondicaoPagamento;
use App\Repositories\BaseRepository;
use Illuminate\Database\Eloquent\Collection;

class CondicaoPagamentoRepository extends BaseRepository
{
    public function __construct(CondicaoPagamento $model)
    {
        parent::__construct($model);
    }

    public function ativas(): Collection
    {
        return $this->query()
            ->where('ativo', true)
            ->orderBy('descricao')
            ->get();
    }
}