<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Repositories\GrupoA\CentroCustoRepository;
use App\Repositories\GrupoA\PessoaRepository;
use App\Repositories\GrupoA\PlanoContaRepository;

class LancamentoManualController extends Controller
{
    public function __construct(
        private PlanoContaRepository $planos,
        private CentroCustoRepository $centrosCusto,
        private PessoaRepository $pessoas,
    ) {}

    public function create()
    {
        return view('telas.lancamento-manual.form', [
            'planosConta' => $this->planos->analiticas(),
            'centrosCusto' => $this->centrosCusto->ativos(),
            'pessoas' => $this->pessoas->paraSelectFornecedores(),
        ]);
    }
}
