<?php

namespace App\Repositories\GrupoA;

use App\Models\Pessoa;
use App\Repositories\BaseRepository;
use Illuminate\Database\Eloquent\Collection;

class PessoaRepository extends BaseRepository
{
    public function __construct(Pessoa $model)
    {
        parent::__construct($model);
    }

    public function porDocumento(string $documento): ?Pessoa
    {
        return $this->query()->where('documento', $documento)->first();
    }

    public function porTag(string $tag): Collection
    {
        return $this->query()
            ->whereHas('tags', fn ($q) => $q->where('tag', $tag))
            ->orderBy('nome')
            ->get();
    }

    public function ativas(): Collection
    {
        return $this->query()
            ->where('ativo', true)
            ->orderBy('nome')
            ->get();
    }

    public function pessoasFisicas(): Collection
    {
        return $this->query()->where('tipo', 'PF')->get();
    }

    public function pessoasJuridicas(): Collection
    {
        return $this->query()->where('tipo', 'PJ')->get();
    }
}