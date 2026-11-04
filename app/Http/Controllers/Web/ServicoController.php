<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Servico;
use App\Models\ServicoLc116;

class ServicoController extends Controller
{
    public function index()
    {
        return view('telas.servicos.index');
    }

    public function create()
    {
        $lc116 = ServicoLc116::query()->orderBy('codigo')->get(['id', 'codigo', 'descricao']);

        return view('telas.servicos.form', [
            'model' => null,
            'lc116' => $lc116,
        ]);
    }

    public function edit(int $id)
    {
        $model = \App\Models\ProdutoServico::query()
            ->where('tipo', 'S')
            ->with('servico')
            ->findOrFail($id);

        $lc116 = ServicoLc116::query()->orderBy('codigo')->get(['id', 'codigo', 'descricao']);

        return view('telas.servicos.form', compact('model', 'lc116'));
    }
}