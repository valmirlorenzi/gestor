<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Repositories\GrupoA\ConfiguracaoHandoffRepository;
use App\Repositories\GrupoC\AuditoriaRepository;

class OsiController extends Controller
{
    public function __construct(
        private AuditoriaRepository $auditorias,
        private ConfiguracaoHandoffRepository $config,
    ) {}

    public function index()
    {
        $config = $this->config->daEmpresa();

        $historico = $config !== null
            ? $this->auditorias->porTabela('configuracoes_handoff', $config->id)
            : collect();

        return view('telas.osi.index', compact('config', 'historico'));
    }
}
