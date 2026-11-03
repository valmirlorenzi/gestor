<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\CentroCusto;

class CentroCustoController extends Controller
{
    public function index()
    {
        return view('telas.centros-custo.index');
    }

    public function create()
    {
        return view('telas.centros-custo.form');
    }

    public function edit(int $id)
    {
        $centro = CentroCusto::findOrFail($id);

        return view('telas.centros-custo.form', compact('centro'));
    }
}