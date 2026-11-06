<?php

namespace App\Repositories\GrupoA;

use App\Models\TipoCliente;
use App\Repositories\BaseRepository;
use Illuminate\Database\Eloquent\Collection;

class TipoClienteRepository extends BaseRepository
{
    public function __construct(TipoCliente $model)
    {
        parent::__construct($model);
    }

    public function listar(?string $busca = null): Collection
    {
        $query = $this->query()->orderBy('descricao');

        if ($busca !== null && $busca !== '') {
            $query->where('descricao', 'like', '%'.$busca.'%');
        }

        return $query->get();
    }

    public function porId(int $id): TipoCliente
    {
        return $this->query()->findOrFail($id);
    }
}
