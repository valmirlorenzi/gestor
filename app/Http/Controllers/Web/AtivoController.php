<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Ativo;
use App\Models\CentroCusto;

class AtivoController extends Controller
{
    public function index()
    {
        return view('telas.ativos.index');
    }

    public function create()
    {
        $centrosCusto = CentroCusto::query()
            ->where('ativo', true)
            ->orderBy('nome')
            ->get(['id', 'nome']);

        return view('telas.ativos.form', [
            'model' => null,
            'centrosCusto' => $centrosCusto,
        ]);
    }

    public function edit(int $id)
    {
        $model = Ativo::query()->findOrFail($id);

        $centrosCusto = CentroCusto::query()
            ->where('ativo', true)
            ->orderBy('nome')
            ->get(['id', 'nome']);

        return view('telas.ativos.form', compact('model', 'centrosCusto'));
    }
}