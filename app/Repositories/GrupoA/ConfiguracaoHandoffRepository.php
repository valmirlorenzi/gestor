<?php

namespace App\Repositories\GrupoA;

use App\Models\ConfiguracaoHandoff;
use App\Repositories\BaseRepository;

class ConfiguracaoHandoffRepository extends BaseRepository
{
    public function __construct(ConfiguracaoHandoff $model)
    {
        parent::__construct($model);
    }

    /**
     * Configuração da empresa do contexto (singleton por empresa).
     */
    public function daEmpresa(): ?ConfiguracaoHandoff
    {
        return $this->query()->first();
    }
}
