<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Repositories\GrupoA\ProdutoServicoRepository;
use App\Repositories\GrupoU\NcmRepository;

class ProdutoController extends Controller
{
    public function __construct(
        private NcmRepository $ncms,
        private ProdutoServicoRepository $produtos,
    ) {}

    public function index()
    {
        return view('telas.produtos.index');
    }

    public function create()
    {
        $ncms = $this->ncms->todosOrdenadosPorCodigo();

        return view('telas.produtos.form', [
            'model' => null,
            'ncms' => $ncms,
        ]);
    }

    public function edit(int $id)
    {
        $model = $this->produtos->produtoComProduto($id);

        $ncms = $this->ncms->todosOrdenadosPorCodigo();

        return view('telas.produtos.form', compact('model', 'ncms'));
    }
}
