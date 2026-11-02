<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;

class TelaInicialController extends Controller
{
    public function index()
    {
        return view('telas.tela-inicial');
    }
}