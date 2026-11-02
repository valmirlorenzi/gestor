<?php

namespace App\Repositories\GrupoA;

use App\Models\FormaPagamento;
use App\Repositories\BaseRepository;
use Illuminate\Database\Eloquent\Collection;

class FormaPagamentoRepository extends BaseRepository
{
    public function __construct(FormaPagamento $model)
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