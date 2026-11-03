<?php

namespace App\Repositories\GrupoA;

use App\Models\ProventoDesconto;
use App\Repositories\BaseRepository;
use Illuminate\Database\Eloquent\Collection;

class ProventoDescontoRepository extends BaseRepository
{
    public function __construct(ProventoDesconto $model)
    {
        parent::__construct($model);
    }

    public function proventos(): Collection
    {
        return $this->query()
            ->where('tipo', 'Provento')
            ->where('ativo', true)
            ->orderBy('codigo')
            ->get();
    }

    public function descontos(): Collection
    {
        return $this->query()
            ->where('tipo', 'Desconto')
            ->where('ativo', true)
            ->orderBy('codigo')
            ->get();
    }

    public function porCodigo(string $codigo): ?ProventoDesconto
    {
        return $this->query()->where('codigo', $codigo)->first();
    }
}
