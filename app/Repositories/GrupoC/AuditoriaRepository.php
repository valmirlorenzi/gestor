<?php

namespace App\Repositories\GrupoC;

use App\Models\Auditoria;
use App\Repositories\BaseRepository;
use Illuminate\Database\Eloquent\Collection;

class AuditoriaRepository extends BaseRepository
{
    public function __construct(Auditoria $model)
    {
        parent::__construct($model);
    }

    /**
     * Histórico de auditoria de um registro específico de uma tabela.
     * Ordenado do mais recente pro mais antigo.
     */
    public function porTabela(string $tabela, int $idRegistro, int $limite = 20): Collection
    {
        return $this->query()
            ->where('tabela', $tabela)
            ->where('id_registro', $idRegistro)
            ->orderByDesc('created_at')
            ->limit($limite)
            ->get();
    }
}
