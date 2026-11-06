<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;

class ContaPagarController extends Controller
{
    public function index()
    {
        return view('telas.contas-pagar.index');
    }
}
