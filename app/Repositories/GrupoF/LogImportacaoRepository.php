<?php

namespace App\Repositories\GrupoF;

use App\Models\LogImportacao;
use App\Repositories\BaseRepository;
use Illuminate\Database\Eloquent\Collection;

class LogImportacaoRepository extends BaseRepository
{
    public function __construct(LogImportacao $model)
    {
        parent::__construct($model);
    }

    public function porFilial(int $idFilial): Collection
    {
        return $this->query()
            ->where('id_filial', $idFilial)
            ->orderByDesc('created_at')
            ->get();
    }

    public function comErro(): Collection
    {
        return $this->query()
            ->where('status', 'Erro')
            ->orderByDesc('created_at')
            ->get();
    }
}