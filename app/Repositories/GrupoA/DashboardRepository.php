<?php

namespace App\Repositories\GrupoA;

use App\Models\Empresa;
use App\Models\Filial;
use App\Models\Usuario;

/**
 * Contadores agregados para dashboards (Tela Inicial, Painel Executivo).
 * Fica em GrupoA porque Empresa é Grupo A (tem id_empresa direto).
 */
class DashboardRepository
{
    public function totalEmpresas(): int
    {
        return Empresa::query()->count();
    }

    public function totalFiliais(): int
    {
        return Filial::query()->count();
    }

    public function totalUsuariosAtivos(): int
    {
        return Usuario::query()->where('ativo', true)->count();
    }
}
