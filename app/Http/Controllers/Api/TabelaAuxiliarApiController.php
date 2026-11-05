<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Repositories\GrupoU\TabelaEncargosRepository;
use App\Repositories\GrupoU\TabelaInssRepository;
use App\Repositories\GrupoU\TabelaIrrfRepository;
use Illuminate\Http\JsonResponse;

class TabelaAuxiliarApiController extends Controller
{
    public function __construct(
        private TabelaInssRepository $inss,
        private TabelaIrrfRepository $irrf,
        private TabelaEncargosRepository $encargos,
    ) {}

    public function inss(): JsonResponse
    {
        return response()->json($this->inss->vigentes());
    }

    public function irrf(): JsonResponse
    {
        return response()->json($this->irrf->vigentes());
    }

    public function encargos(): JsonResponse
    {
        return response()->json($this->encargos->vigentes());
    }
}
