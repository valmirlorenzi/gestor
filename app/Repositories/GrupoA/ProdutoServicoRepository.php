<?php

namespace App\Repositories\GrupoA;

use App\Models\ProdutoServico;
use App\Repositories\BaseRepository;
use Illuminate\Database\Eloquent\Collection;

class ProdutoServicoRepository extends BaseRepository
{
    public function __construct(ProdutoServico $model)
    {
        parent::__construct($model);
    }

    public function produtos(): Collection
    {
        return $this->query()
            ->where('tipo', 'P')
            ->where('ativo', true)
            ->orderBy('descricao')
            ->get();
    }

    public function servicos(): Collection
    {
        return $this->query()
            ->where('tipo', 'S')
            ->where('ativo', true)
            ->orderBy('descricao')
            ->get();
    }

    public function porCodigoInterno(string $codigo): ?ProdutoServico
    {
        return $this->query()->where('codigo_interno', $codigo)->first();
    }

    public function buscarPorDescricao(string $termo): Collection
    {
        return $this->query()
            ->where('descricao', 'like', "%{$termo}%")
            ->where('ativo', true)
            ->orderBy('descricao')
            ->get();
    }
}
