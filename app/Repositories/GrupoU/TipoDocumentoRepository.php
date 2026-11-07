<?php

namespace App\Repositories\GrupoU;

use App\Models\TipoDocumento;
use App\Repositories\BaseRepository;
use Illuminate\Database\Eloquent\Collection;

class TipoDocumentoRepository extends BaseRepository
{
    public function __construct(TipoDocumento $model)
    {
        parent::__construct($model);
    }

    public function porCodigo(string $codigo): ?TipoDocumento
    {
        return $this->query()->where('codigo', $codigo)->first();
    }

    public function paraSelect(): Collection
    {
        return $this->query()
            ->orderBy('codigo')
            ->get(['id', 'codigo', 'descricao']);
    }
}
