<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Repositories\GrupoA\PlanoContaRepository;

class ConfiguracaoContabilController extends Controller
{
    public function __construct(private PlanoContaRepository $planos) {}

    public function index()
    {
        return view('telas.config-contabeis.index');
    }

    public function edit(int $id)
    {
        $model = $this->planos->porId($id);

        return view('telas.config-contabeis.form', compact('model'));
    }
}
