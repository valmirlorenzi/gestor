<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;

class PendenciaController extends Controller
{
    public function index()
    {
        return view('telas.pendencias.index');
    }
}
