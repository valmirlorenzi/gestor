<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Repositories\GrupoA\CentroCustoRepository;
use App\Repositories\GrupoA\PessoaRepository;
use App\Repositories\GrupoA\PlanoContaRepository;
use App\Repositories\GrupoA\RegraClassificacaoRepository;
use App\Repositories\GrupoU\CfopRepository;
use App\Repositories\GrupoU\CstRepository;
use App\Repositories\GrupoU\ServicoLc116Repository;
use App\Repositories\GrupoU\TipoDocumentoRepository;

class RegraClassificacaoController extends Controller
{
    public function __construct(
        private RegraClassificacaoRepository $regras,
        private PlanoContaRepository $planos,
        private CentroCustoRepository $centrosCusto,
        private TipoDocumentoRepository $tiposDocumento,
        private CfopRepository $cfops,
        private CstRepository $csts,
        private ServicoLc116Repository $servicosLc116,
        private PessoaRepository $fornecedores,
    ) {}

    public function index()
    {
        return view('telas.regras-classificacao.index');
    }

    public function create()
    {
        return view('telas.regras-classificacao.form', $this->dadosAuxiliares() + ['model' => null]);
    }

    public function edit(int $id)
    {
        $model = $this->regras->porId($id);

        return view('telas.regras-classificacao.form', $this->dadosAuxiliares() + compact('model'));
    }

    private function dadosAuxiliares(): array
    {
        return [
            'tiposDocumento' => $this->tiposDocumento->paraSelect(),
            'cfops' => $this->cfops->paraSelect(),
            'csts' => $this->csts->paraSelect(),
            'servicosLc116' => $this->servicosLc116->paraSelect(),
            'fornecedores' => $this->fornecedores->paraSelectFornecedores(),
            'planosConta' => $this->planos->analiticas(),
            'centrosCusto' => $this->centrosCusto->ativos(),
        ];
    }
}
