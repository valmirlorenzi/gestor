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

    public function produtosComNcm(?string $busca = null): Collection
    {
        $query = $this->query()
            ->where('tipo', 'P')
            ->with(['produto.ncm']);

        if ($busca !== null && $busca !== '') {
            $query->where('descricao', 'like', '%'.$busca.'%');
        }

        return $query->orderBy('descricao')->get();
    }

    public function produtoComNcm(int $id): ProdutoServico
    {
        return $this->query()
            ->where('tipo', 'P')
            ->with(['produto.ncm'])
            ->findOrFail($id);
    }

    public function produto(int $id): ProdutoServico
    {
        return $this->query()->where('tipo', 'P')->findOrFail($id);
    }

    public function produtoComProduto(int $id): ProdutoServico
    {
        return $this->query()
            ->where('tipo', 'P')
            ->with('produto')
            ->findOrFail($id);
    }

    public function servicosComLc116(?string $busca = null): Collection
    {
        $query = $this->query()
            ->where('tipo', 'S')
            ->with(['servico.servicoLc116']);

        if ($busca !== null && $busca !== '') {
            $query->where('descricao', 'like', '%'.$busca.'%');
        }

        return $query->orderBy('descricao')->get();
    }

    public function servicoComLc116(int $id): ProdutoServico
    {
        return $this->query()
            ->where('tipo', 'S')
            ->with('servico.servicoLc116')
            ->findOrFail($id);
    }

    public function servico(int $id): ProdutoServico
    {
        return $this->query()->where('tipo', 'S')->findOrFail($id);
    }

    public function servicoComServico(int $id): ProdutoServico
    {
        return $this->query()
            ->where('tipo', 'S')
            ->with('servico')
            ->findOrFail($id);
    }
}
