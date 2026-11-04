<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\ConfiguracaoHandoff;
use App\Repositories\GrupoC\AuditoriaRepository;

class OsiController extends Controller
{
    public function __construct(
        private AuditoriaRepository $auditorias,
    ) {}

    public function index()
    {
        $config = ConfiguracaoHandoff::query()->first();

        $historico = $config !== null
            ? $this->auditorias->porTabela('configuracoes_handoff', $config->id)
            : collect();

        return view('telas.osi.index', compact('config', 'historico'));
    }
}