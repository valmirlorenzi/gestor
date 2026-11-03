<?php

namespace App\Repositories\GrupoF;

use App\Models\Periodo;
use App\Repositories\BaseRepository;
use Illuminate\Database\Eloquent\Collection;

class PeriodoRepository extends BaseRepository
{
    public function __construct(Periodo $model)
    {
        parent::__construct($model);
    }

    public function abertos(): Collection
    {
        return $this->query()
            ->where('status', 'Aberto')
            ->orderBy('mes_ano')
            ->get();
    }

    public function porFilialEMesAno(int $idFilial, string $mesAno): ?Periodo
    {
        return $this->query()
            ->where('id_filial', $idFilial)
            ->where('mes_ano', $mesAno)
            ->first();
    }

    public function fechados(): Collection
    {
        return $this->query()
            ->where('status', 'Fechado')
            ->orderByDesc('mes_ano')
            ->get();
    }

    /**
     * Período aberto mais recente da filial (formato 'MM/AAAA').
     */
    public function abertoDaFilial(int $filialId): ?string
    {
        return $this->query()
            ->where('id_filial', $filialId)
            ->where('status', 'Aberto')
            ->orderByDesc('mes_ano')
            ->value('mes_ano');
    }
}
