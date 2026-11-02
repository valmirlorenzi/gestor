<?php

namespace App\Repositories\GrupoC;

use App\Models\NotaFiscalItem;
use App\Repositories\BaseRepository;
use Illuminate\Database\Eloquent\Collection;

/**
 * Grupo C: filha pura de NotaFiscal.
 * NÃO tem escopo de tenant próprio — quem valida é o NotaFiscalRepository.
 * Métodos aqui recebem o pai JÁ VALIDADO (id_nota_fiscal).
 */
class NotaFiscalItemRepository extends BaseRepository
{
    public function __construct(NotaFiscalItem $model)
    {
        parent::__construct($model);
    }

    public function porNota(int $idNotaFiscal): Collection
    {
        return $this->query()
            ->where('id_nota_fiscal', $idNotaFiscal)
            ->orderBy('numero_item')
            ->get();
    }

    public function porProdutoServico(int $idProdutoServico): Collection
    {
        return $this->query()
            ->where('id_produto_servico', $idProdutoServico)
            ->get();
    }

    public function porNotaEProduto(int $idNotaFiscal, int $idProdutoServico): ?NotaFiscalItem
    {
        return $this->query()
            ->where('id_nota_fiscal', $idNotaFiscal)
            ->where('id_produto_servico', $idProdutoServico)
            ->first();
    }
}