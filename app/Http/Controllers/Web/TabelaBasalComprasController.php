<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;

class TabelaBasalComprasController extends Controller
{
    public function index()
    {
        return view('telas.tabelas-basais-compras.index');
    }
}
