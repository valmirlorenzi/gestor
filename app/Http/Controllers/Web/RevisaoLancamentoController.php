<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Repositories\GrupoA\CentroCustoRepository;
use App\Repositories\GrupoA\PlanoContaRepository;

class RevisaoLancamentoController extends Controller
{
    public function __construct(
        private PlanoContaRepository $planos,
        private CentroCustoRepository $centrosCusto,
    ) {}

    public function index()
    {
        return view('telas.revisao-lancamentos.index', [
            'planosConta' => $this->planos->analiticas(),
            'centrosCusto' => $this->centrosCusto->ativos(),
        ]);
    }
}
