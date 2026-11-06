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

    public function paraSelectFornecedores(): Collection
    {
        return $this->paraSelect('Fornecedor');
    }

    public function paraSelect(string $tag): Collection
    {
        return $this->query()
            ->whereHas('tags', fn ($q) => $q->where('tag', $tag))
            ->where('ativo', true)
            ->orderBy('nome')
            ->get(['id', 'nome', 'documento']);
    }

    public function listarPorTag(string $tag, bool $somenteAtivos = true): Collection
    {
        return $this->query()
            ->whereHas('tags', fn ($q) => $q->where('tag', $tag))
            ->when($somenteAtivos, fn ($q) => $q->where('ativo', true))
            ->orderBy('nome')
            ->get();
    }

    public function porIdComFilhas(int $id): ?Pessoa
    {
        return $this->query()
            ->with(['fisica', 'juridica', 'tags'])
            ->find($id);
    }

    public function pertenceATag(Pessoa $pessoa, string $tag): bool
    {
        return $pessoa->tags->contains(fn ($t) => $t->tag === $tag);
    }
}
