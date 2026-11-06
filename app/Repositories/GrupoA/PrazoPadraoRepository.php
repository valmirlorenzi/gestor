<?php

namespace App\Repositories\GrupoA;

use App\Models\PrazoPadrao;
use App\Repositories\BaseRepository;
use Illuminate\Database\Eloquent\Collection;

class PrazoPadraoRepository extends BaseRepository
{
    public function __construct(PrazoPadrao $model)
    {
        parent::__construct($model);
    }

    public function listar(string $tipo, ?string $busca = null): Collection
    {
        $query = $this->query()
            ->where('tipo', $tipo)
            ->orderBy('descricao');

        if ($busca !== null && $busca !== '') {
            $query->where('descricao', 'like', '%'.$busca.'%');
        }

        return $query->get();
    }

    public function porId(int $id): PrazoPadrao
    {
        return $this->query()->findOrFail($id);
    }
}
