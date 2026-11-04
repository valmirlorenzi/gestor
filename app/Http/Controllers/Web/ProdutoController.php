<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Ncm;
use App\Models\ProdutoServico;

class ProdutoController extends Controller
{
    public function index()
    {
        return view('telas.produtos.index');
    }

    public function create()
    {
        $ncms = Ncm::query()->orderBy('codigo')->get(['id', 'codigo', 'descricao']);

        return view('telas.produtos.form', [
            'model' => null,
            'ncms' => $ncms,
        ]);
    }

    public function edit(int $id)
    {
        $model = ProdutoServico::query()
            ->where('tipo', 'P')
            ->with('produto')
            ->findOrFail($id);

        $ncms = Ncm::query()->orderBy('codigo')->get(['id', 'codigo', 'descricao']);

        return view('telas.produtos.form', compact('model', 'ncms'));
    }
}