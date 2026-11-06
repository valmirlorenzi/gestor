<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;

class TabelaBasalVendasController extends Controller
{
    public function index()
    {
        return view('telas.tabelas-basais-vendas.index');
    }
}
