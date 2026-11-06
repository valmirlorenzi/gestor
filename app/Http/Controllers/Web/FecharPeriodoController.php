<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;

class FecharPeriodoController extends Controller
{
    public function index()
    {
        return view('telas.fechar-periodo.index');
    }
}
