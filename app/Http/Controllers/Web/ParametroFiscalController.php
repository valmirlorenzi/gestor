<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Repositories\GrupoH\ParametroFiscalRepository;
use App\Repositories\GrupoU\TabelaEncargosRepository;
use App\Repositories\GrupoU\TabelaInssRepository;
use App\Repositories\GrupoU\TabelaIrrfRepository;

class ParametroFiscalController extends Controller
{
    public function __construct(
        private ParametroFiscalRepository $parametros,
        private TabelaInssRepository $inss,
        private TabelaIrrfRepository $irrf,
        private TabelaEncargosRepository $encargos,
    ) {}

    public function index()
    {
        return view('telas.contador.tabelas-fiscais.index');
    }

    public function create()
    {
        return view('telas.contador.tabelas-fiscais.form', ['model' => null]);
    }

    public function edit(int $id)
    {
        $model = $this->parametros->porId($id);

        return view('telas.contador.tabelas-fiscais.form', compact('model'));
    }

    public function inss()
    {
        $tabelas = $this->inss->vigentes();

        return view('telas.contador.tabelas-fiscais.inss', compact('tabelas'));
    }

    public function irrf()
    {
        $tabelas = $this->irrf->vigentes();

        return view('telas.contador.tabelas-fiscais.irrf', compact('tabelas'));
    }

    public function encargos()
    {
        $tabelas = $this->encargos->vigentes();

        return view('telas.contador.tabelas-fiscais.encargos', compact('tabelas'));
    }
}
