<?php

namespace App\Repositories\GrupoC;

use App\Models\NotaFiscalImposto;
use App\Repositories\BaseRepository;
use Illuminate\Database\Eloquent\Collection;

/**
 * Grupo C: filha pura de NotaFiscalItem.
 * Acesso via pai (NotaFiscalItem, que já foi validado via NotaFiscal).
 */
class NotaFiscalImpostoRepository extends BaseRepository
{
    public function __construct(NotaFiscalImposto $model)
    {
        parent::__construct($model);
    }

    public function porItem(int $idNotaFiscalItem): Collection
    {
        return $this->query()
            ->where('id_nota_fiscal_item', $idNotaFiscalItem)
            ->orderBy('tipo_imposto')
            ->get();
    }

    public function porItemETipo(int $idNotaFiscalItem, string $tipoImposto): ?NotaFiscalImposto
    {
        return $this->query()
            ->where('id_nota_fiscal_item', $idNotaFiscalItem)
            ->where('tipo_imposto', $tipoImposto)
            ->first();
    }
}
