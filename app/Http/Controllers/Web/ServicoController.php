<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Repositories\GrupoA\ProdutoServicoRepository;
use App\Repositories\GrupoU\ServicoLc116Repository;

class ServicoController extends Controller
{
    public function __construct(
        private ServicoLc116Repository $lc116,
        private ProdutoServicoRepository $servicos,
    ) {}

    public function index()
    {
        return view('telas.servicos.index');
    }

    public function create()
    {
        $lc116 = $this->lc116->todosOrdenadosPorCodigo();

        return view('telas.servicos.form', [
            'model' => null,
            'lc116' => $lc116,
        ]);
    }

    public function edit(int $id)
    {
        $model = $this->servicos->servicoComServico($id);
        $lc116 = $this->lc116->todosOrdenadosPorCodigo();

        return view('telas.servicos.form', compact('model', 'lc116'));
    }
}
