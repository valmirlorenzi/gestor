<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Repositories\GrupoA\PessoaRepository;
use App\Repositories\GrupoF\NotaFiscalRepository;
use App\Repositories\GrupoF\PeriodoRepository;
use App\Repositories\GrupoU\TipoDocumentoRepository;
use App\Services\TenantContext;

class NotaFiscalController extends Controller
{
    public function __construct(
        private NotaFiscalRepository $notas,
        private PeriodoRepository $periodos,
        private TipoDocumentoRepository $tipos,
        private PessoaRepository $pessoas,
        private TenantContext $tenant,
    ) {}

    public function index()
    {
        return view('telas.notas-entrada.index');
    }

    public function create()
    {
        $filialId = $this->tenant->getFilialId();
        $periodoAberto = $filialId ? $this->periodos->abertoDaFilial($filialId) : null;

        return view('telas.notas-entrada.form', [
            'model' => null,
            'periodoAberto' => $periodoAberto,
            'tiposDocumento' => $this->tipos->paraSelect(),
            'fornecedores' => $this->pessoas->paraSelect('Fornecedor'),
        ]);
    }

    public function edit(int $id)
    {
        $model = $this->notas->porId($id);
        $filialId = $this->tenant->getFilialId();
        $periodoAberto = $filialId ? $this->periodos->abertoDaFilial($filialId) : null;

        return view('telas.notas-entrada.form', [
            'model' => $model,
            'periodoAberto' => $periodoAberto,
            'tiposDocumento' => $this->tipos->paraSelect(),
            'fornecedores' => $this->pessoas->paraSelect('Fornecedor'),
        ]);
    }
}
