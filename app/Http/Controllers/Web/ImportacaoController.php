<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Services\ImportacaoService;
use App\Services\TenantContext;
use Illuminate\View\View;

class ImportacaoController extends Controller
{
    public function index(ImportacaoService $service, TenantContext $ctx): View
    {
        $atorId = $ctx->getAtorFuncionalId();

        return view('telas.importacoes.index', [
            'recursosCadastro' => $atorId ? $service->recursosDisponiveisParaAtor($atorId) : [],
            'recursosDocumento' => $atorId ? $service->recursosDocumentoParaAtor($atorId) : [],
        ]);
    }
}
