<?php

namespace App\Repositories\GrupoA;

use App\Models\Empresa;
use App\Repositories\BaseRepository;

class EmpresaRepository extends BaseRepository
{
    public function __construct(Empresa $model)
    {
        parent::__construct($model);
    }

    public function porId(int $id): Empresa
    {
        return $this->query()->findOrFail($id);
    }

    /**
     * Atualiza os campos fiscais da empresa (4.4).
     * Só aceita os 3 campos editáveis — evita mass assignment acidental.
     */
    public function atualizarFiscal(int $id, array $data): Empresa
    {
        $empresa = $this->porId($id);

        $empresa->update([
            'regime_fiscal' => $data['regime_fiscal'],
            'setor' => $data['setor'],
            'metodo_custo' => $data['metodo_custo'],
        ]);

        return $empresa->refresh();
    }
}
