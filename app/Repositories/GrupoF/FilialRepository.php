<?php

namespace App\Repositories\GrupoF;

use App\Models\Filial;
use App\Repositories\BaseRepository;
use Illuminate\Database\Eloquent\Collection;

class FilialRepository extends BaseRepository
{
    public function __construct(Filial $model)
    {
        parent::__construct($model);
    }

    public function ativas(): Collection
    {
        return $this->query()
            ->where('ativo', true)
            ->orderBy('razao_social')
            ->get();
    }

    public function porCnpj(string $cnpj): ?Filial
    {
        return $this->query()->where('cnpj', $cnpj)->first();
    }
}