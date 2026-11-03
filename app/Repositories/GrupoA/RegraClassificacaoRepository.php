<?php

namespace App\Repositories\GrupoA;

use App\Models\RegraClassificacao;
use App\Repositories\BaseRepository;
use Illuminate\Database\Eloquent\Collection;

class RegraClassificacaoRepository extends BaseRepository
{
    public function __construct(RegraClassificacao $model)
    {
        parent::__construct($model);
    }

    /**
     * Regras ativas ordenadas por prioridade (1 = mais específica, 8 = fallback).
     */
    public function ativasPorPrioridade(): Collection
    {
        return $this->query()
            ->where('ativo', true)
            ->orderBy('prioridade')
            ->get();
    }

    /**
     * Regras que casam com um conjunto de atributos de um item de nota.
     * Retorna em ordem de prioridade para que o motor pare na primeira.
     */
    public function candidatas(
        ?int $idTipoDocumento = null,
        ?int $idCfop = null,
        ?int $idCst = null,
        ?int $idNcm = null,
        ?int $idServicoLc116 = null,
        ?int $idPessoaFornecedor = null,
        ?string $historicoPalavraChave = null
    ): Collection {
        return $this->query()
            ->where('ativo', true)
            ->where(function ($q) use ($idTipoDocumento) {
                $q->whereNull('id_tipo_documento')
                    ->orWhere('id_tipo_documento', $idTipoDocumento);
            })
            ->where(function ($q) use ($idCfop) {
                $q->whereNull('id_cfop')->orWhere('id_cfop', $idCfop);
            })
            ->where(function ($q) use ($idCst) {
                $q->whereNull('id_cst')->orWhere('id_cst', $idCst);
            })
            ->where(function ($q) use ($idNcm) {
                $q->whereNull('id_ncm')->orWhere('id_ncm', $idNcm);
            })
            ->where(function ($q) use ($idServicoLc116) {
                $q->whereNull('id_servico_lc116')->orWhere('id_servico_lc116', $idServicoLc116);
            })
            ->where(function ($q) use ($idPessoaFornecedor) {
                $q->whereNull('id_pessoa_fornecedor')->orWhere('id_pessoa_fornecedor', $idPessoaFornecedor);
            })
            ->where(function ($q) use ($historicoPalavraChave) {
                $q->whereNull('historico_palavra_chave')
                    ->orWhere('historico_palavra_chave', 'like', "%{$historicoPalavraChave}%");
            })
            ->orderBy('prioridade')
            ->get();
    }
}
