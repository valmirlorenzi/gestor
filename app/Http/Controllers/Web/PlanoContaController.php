<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Repositories\GrupoA\PlanoContaRepository;

class PlanoContaController extends Controller
{
    public function __construct(private PlanoContaRepository $planos) {}

    public function index()
    {
        return view('telas.plano-contas.index');
    }

    public function create()
    {
        $pais = $this->planos->sinteticas();

        return view('telas.plano-contas.form', [
            'model' => null,
            'pais' => $pais,
        ]);
    }

    public function edit(int $id)
    {
        $model = $this->planos->porId($id);
        $pais = $this->planos->sinteticas();

        return view('telas.plano-contas.form', compact('model', 'pais'));
    }
}
