<?php

namespace App\Repositories\GrupoF;

use App\Models\Lancamento;
use App\Models\NotaFiscalItem;
use App\Repositories\BaseRepository;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Validation\ValidationException;

class LancamentoRepository extends BaseRepository
{
    public function __construct(Lancamento $model)
    {
        parent::__construct($model);
    }

    public function porPeriodo(int $idPeriodo): Collection
    {
        return $this->query()
            ->where('id_periodo', $idPeriodo)
            ->orderBy('data_competencia')
            ->get();
    }

    public function porConta(int $idConta): Collection
    {
        return $this->query()
            ->where(function ($q) use ($idConta) {
                $q->where('id_conta_debito', $idConta)
                  ->orWhere('id_conta_credito', $idConta);
            })
            ->orderBy('data_competencia')
            ->get();
    }

    public function naoClassificados(): Collection
    {
        return $this->query()
            ->where('status_classificacao', 'Nao classificado')
            ->orderBy('data_competencia')
            ->get();
    }

    public function comConflito(): Collection
    {
        return $this->query()
            ->where('status_classificacao', 'Conflito')
            ->orderBy('data_competencia')
            ->get();
    }

    /**
     * P31: se id_nota_fiscal_item vier preenchido, valida que
     * nota_fiscal_item.id_nota_fiscal == lancamento.id_nota_fiscal.
     */
    public function create(array $data): Lancamento
    {
        $this->validarCoerenciaNotaItem(
            isset($data['id_nota_fiscal']) ? (int) $data['id_nota_fiscal'] : null,
            isset($data['id_nota_fiscal_item']) ? (int) $data['id_nota_fiscal_item'] : null
        );

        /** @var Lancamento $lancamento */
        $lancamento = parent::create($data);

        return $lancamento;
    }

    private function validarCoerenciaNotaItem(?int $idNota, ?int $idItem): void
    {
        if ($idItem === null) {
            return;
        }

        if ($idNota === null) {
            throw ValidationException::withMessages([
                'id_nota_fiscal' => 'Se id_nota_fiscal_item foi informado, id_nota_fiscal é obrigatório.',
            ]);
        }

        $idNotaDoItem = NotaFiscalItem::withoutGlobalScope('tenant')
            ->where('id', $idItem)
            ->value('id_nota_fiscal');

        if ($idNotaDoItem === null) {
            throw ValidationException::withMessages([
                'id_nota_fiscal_item' => 'Item de nota fiscal inexistente.',
            ]);
        }

        if ((int) $idNotaDoItem !== $idNota) {
            throw ValidationException::withMessages([
                'id_nota_fiscal_item' => 'O item pertence a outra nota fiscal.',
            ]);
        }
    }
}