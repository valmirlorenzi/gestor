<?php

namespace App\Repositories\GrupoF;

use App\Models\FolhaPagamento;
use App\Repositories\BaseRepository;
use Illuminate\Database\Eloquent\Collection;

class FolhaPagamentoRepository extends BaseRepository
{
    public function __construct(FolhaPagamento $model)
    {
        parent::__construct($model);
    }

    public function porFilial(int $idFilial): Collection
    {
        return $this->query()
            ->where('id_filial', $idFilial)
            ->orderByDesc('mes_ano_referencia')
            ->get();
    }

    public function porMesAno(string $mesAno): Collection
    {
        return $this->query()
            ->where('mes_ano_referencia', $mesAno)
            ->orderBy('id_filial')
            ->get();
    }

    public function calculadas(): Collection
    {
        return $this->query()
            ->where('status', 'Calculada')
            ->orderByDesc('mes_ano_referencia')
            ->get();
    }

    public function fechadas(): Collection
    {
        return $this->query()
            ->where('status', 'Fechada')
            ->orderByDesc('mes_ano_referencia')
            ->get();
    }
}
