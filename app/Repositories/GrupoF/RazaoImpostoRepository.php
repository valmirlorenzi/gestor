<?php

namespace App\Repositories\GrupoF;

use App\Models\RazaoImposto;
use App\Repositories\BaseRepository;
use Illuminate\Database\Eloquent\Collection;

class RazaoImpostoRepository extends BaseRepository
{
    public function __construct(RazaoImposto $model)
    {
        parent::__construct($model);
    }

    public function porId(int $id): RazaoImposto
    {
        return $this->query()->findOrFail($id);
    }

    public function porPeriodo(int $idPeriodo): Collection
    {
        return $this->query()
            ->where('id_periodo', $idPeriodo)
            ->orderBy('tipo_imposto')
            ->get();
    }

    public function porTipoECompetencia(string $tipoImposto, int $idPeriodo): Collection
    {
        return $this->query()
            ->where('tipo_imposto', $tipoImposto)
            ->where('id_periodo', $idPeriodo)
            ->get();
    }

    public function creditos(): Collection
    {
        return $this->query()->where('natureza', 'Credito')->get();
    }

    public function debitos(): Collection
    {
        return $this->query()->where('natureza', 'Debito')->get();
    }
}
