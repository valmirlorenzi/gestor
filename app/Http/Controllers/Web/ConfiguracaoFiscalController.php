<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Repositories\GrupoA\EmpresaRepository;
use App\Services\TenantContext;

class ConfiguracaoFiscalController extends Controller
{
    public function __construct(private EmpresaRepository $empresas) {}

    public function index()
    {
        $idEmpresa = app(TenantContext::class)->getId();
        $model = $this->empresas->porId($idEmpresa);

        return view('telas.config-fiscais.index', compact('model'));
    }
}
