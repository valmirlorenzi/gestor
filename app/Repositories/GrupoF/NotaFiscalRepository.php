<?php

namespace App\Repositories\GrupoF;

use App\Models\NotaFiscal;
use App\Repositories\BaseRepository;
use Illuminate\Database\Eloquent\Collection;

class NotaFiscalRepository extends BaseRepository
{
    public function __construct(NotaFiscal $model)
    {
        parent::__construct($model);
    }

    public function porChave(string $chave): ?NotaFiscal
    {
        return $this->query()->where('chave', $chave)->first();
    }

    public function porFilial(int $idFilial): Collection
    {
        return $this->query()
            ->where('id_filial', $idFilial)
            ->orderByDesc('data_emissao')
            ->get();
    }

    public function porPeriodo(int $idPeriodo): Collection
    {
        return $this->query()
            ->where('id_periodo', $idPeriodo)
            ->orderBy('data_emissao')
            ->get();
    }

    public function porDirecao(string $direcao): Collection
    {
        return $this->query()
            ->where('direcao', $direcao)
            ->orderByDesc('data_emissao')
            ->get();
    }

    public function porStatus(string $status): Collection
    {
        return $this->query()
            ->where('status_importacao', $status)
            ->orderByDesc('data_emissao')
            ->get();
    }

    public function comErro(): Collection
    {
        return $this->query()
            ->where('status_importacao', 'Importado com erro')
            ->orderByDesc('data_emissao')
            ->get();
    }
}