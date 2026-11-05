<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Repositories\GrupoA\CentroCustoRepository;
use App\Repositories\GrupoF\AtivoRepository;

class AtivoController extends Controller
{
    public function __construct(
        private CentroCustoRepository $centrosCusto,
        private AtivoRepository $ativos,
    ) {}

    public function index()
    {
        return view('telas.ativos.index');
    }

    public function create()
    {
        $centrosCusto = $this->centrosCusto->ativos();

        return view('telas.ativos.form', [
            'model' => null,
            'centrosCusto' => $centrosCusto,
        ]);
    }

    public function edit(int $id)
    {
        $model = $this->ativos->porId($id);

        $centrosCusto = $this->centrosCusto->ativos();

        return view('telas.ativos.form', compact('model', 'centrosCusto'));
    }
}
