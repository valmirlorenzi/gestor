<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;

class ValidacaoCalculoController extends Controller
{
    public function index()
    {
        return view('telas.validacao.index');
    }
}
