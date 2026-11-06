<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;

class ContaReceberController extends Controller
{
    public function index()
    {
        return view('telas.contas-receber.index');
    }
}
