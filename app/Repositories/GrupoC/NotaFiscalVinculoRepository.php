<?php

namespace App\Repositories\GrupoC;

use App\Models\NotaFiscalVinculo;
use App\Repositories\BaseRepository;
use Illuminate\Database\Eloquent\Collection;

/**
 * Grupo C: filha pura de NotaFiscal (N:N consigo mesma).
 * Acesso via pai (NotaFiscalRepository valida o escopo).
 */
class NotaFiscalVinculoRepository extends BaseRepository
{
    public function __construct(NotaFiscalVinculo $model)
    {
        parent::__construct($model);
    }

    public function porNotaOrigem(int $idNotaFiscal): Collection
    {
        return $this->query()
            ->where('id_nota_fiscal', $idNotaFiscal)
            ->get();
    }

    public function porNotaDestino(int $idNotaVinculada): Collection
    {
        return $this->query()
            ->where('id_nota_vinculada', $idNotaVinculada)
            ->get();
    }

    public function existe(int $idNotaFiscal, int $idNotaVinculada, string $tipoVinculo): bool
    {
        return $this->query()
            ->where('id_nota_fiscal', $idNotaFiscal)
            ->where('id_nota_vinculada', $idNotaVinculada)
            ->where('tipo_vinculo', $tipoVinculo)
            ->exists();
    }
}
