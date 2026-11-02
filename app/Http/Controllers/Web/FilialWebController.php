<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Filial;

class FilialWebController extends Controller
{
    public function index()
    {
        return view('telas.filial.index');
    }

    public function create()
    {
        return view('telas.filial.form');
    }

    public function edit(Filial $filial)
    {
        return view('telas.filial.form', compact('filial'));
    }
}