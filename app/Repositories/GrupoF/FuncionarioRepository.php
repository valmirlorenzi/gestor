<?php

namespace App\Repositories\GrupoF;

use App\Models\Funcionario;
use App\Repositories\BaseRepository;
use Illuminate\Database\Eloquent\Collection;

class FuncionarioRepository extends BaseRepository
{
    public function __construct(Funcionario $model)
    {
        parent::__construct($model);
    }

    public function ativos(): Collection
    {
        return $this->query()
            ->where('ativo', true)
            ->orderBy('data_admissao')
            ->get();
    }

    public function porFilial(int $idFilial): Collection
    {
        return $this->query()
            ->where('id_filial', $idFilial)
            ->where('ativo', true)
            ->orderBy('id_pessoa')
            ->get();
    }

    public function demitidos(): Collection
    {
        return $this->query()
            ->whereNotNull('data_demissao')
            ->orderByDesc('data_demissao')
            ->get();
    }
}