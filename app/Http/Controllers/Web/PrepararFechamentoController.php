<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;

class PrepararFechamentoController extends Controller
{
    public function index()
    {
        return view('telas.preparar-fechamento.index');
    }
}
