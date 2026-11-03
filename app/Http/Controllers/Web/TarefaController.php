<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Services\TarefaService;
use App\Services\TenantContext;

class TarefaController extends Controller
{
    public function __construct(
        private TarefaService $service,
        private TenantContext $context,
    ) {}

    public function entrada()
    {
        $atorId = $this->atorId();
        $tarefas = $atorId ? $this->service->caixaEntrada($atorId) : collect();

        return view('telas.tarefas.entrada', compact('tarefas'));
    }

    public function saida()
    {
        $atorId = $this->atorId();
        $tarefas = $atorId ? $this->service->caixaSaida($atorId) : collect();

        return view('telas.tarefas.saida', compact('tarefas'));
    }

    public function historico()
    {
        $atorId = $this->atorId();
        $tarefas = $atorId ? $this->service->historico($atorId) : collect();

        return view('telas.tarefas.historico', compact('tarefas'));
    }

    private function atorId(): ?int
    {
        return $this->context->getAtorFuncionalId();
    }
}
