<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Services\TelaInicialService;

class TelaInicialController extends Controller
{
    public function __construct(private TelaInicialService $service) {}

    public function index()
    {
        return view('telas.tela-inicial', $this->service->montar());
    }
}
