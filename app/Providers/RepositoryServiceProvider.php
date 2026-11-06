<?php

namespace App\Providers;

use App\Repositories\GrupoA\AtorFuncionalRepository;
use App\Repositories\GrupoA\CenarioSimulacaoRepository;
use App\Repositories\GrupoA\CentroCustoRepository;
use App\Repositories\GrupoA\CondicaoPagamentoRepository;
use App\Repositories\GrupoA\ConfiguracaoHandoffRepository;
use App\Repositories\GrupoA\DashboardRepository;
use App\Repositories\GrupoA\EmpresaRepository;
use App\Repositories\GrupoA\FormaPagamentoRepository;
use App\Repositories\GrupoA\MenuItemRepository;
use App\Repositories\GrupoA\PessoaRepository;
use App\Repositories\GrupoA\PlanoContaRepository;
use App\Repositories\GrupoA\PrazoPadraoRepository;
use App\Repositories\GrupoA\ProdutoServicoRepository;
use App\Repositories\GrupoA\ProventoDescontoRepository;
use App\Repositories\GrupoA\RegraClassificacaoRepository;
use App\Repositories\GrupoA\TipoClienteRepository;
use App\Repositories\GrupoA\TipoFornecedorRepository;
use App\Repositories\GrupoA\UsuarioRepository;
use App\Repositories\GrupoC\DocumentoEncadeadoRepository;
use App\Repositories\GrupoC\NotaFiscalImpostoRepository;
use App\Repositories\GrupoC\NotaFiscalItemRepository;
use App\Repositories\GrupoC\NotaFiscalVinculoRepository;
use App\Repositories\GrupoC\RegraClassificacaoLogRepository;
use App\Repositories\GrupoF\AtivoRepository;
use App\Repositories\GrupoF\ContaBancariaRepository;
use App\Repositories\GrupoF\ContaPagarRepository;
use App\Repositories\GrupoF\ContaReceberRepository;
use App\Repositories\GrupoF\DepreciacaoRepository;
use App\Repositories\GrupoF\FilialRepository;
use App\Repositories\GrupoF\FolhaPagamentoRepository;
use App\Repositories\GrupoF\FuncionarioRepository;
use App\Repositories\GrupoF\LancamentoRepository;
use App\Repositories\GrupoF\LogImportacaoRepository;
use App\Repositories\GrupoF\NotaFiscalRepository;
use App\Repositories\GrupoF\PendenciaRepository;
use App\Repositories\GrupoF\PeriodoRepository;
use App\Repositories\GrupoF\ProvisaoRepository;
use App\Repositories\GrupoF\RazaoImpostoRepository;
use App\Repositories\GrupoF\TarefaRepository;
use App\Repositories\GrupoF\UsuarioAtorRepository;
use App\Repositories\GrupoH\ParametroFiscalRepository;
use App\Repositories\GrupoU\CfopRepository;
use App\Repositories\GrupoU\CstRepository;
use App\Repositories\GrupoU\NcmRepository;
use App\Repositories\GrupoU\ServicoLc116Repository;
use App\Repositories\GrupoU\TabelaEncargosRepository;
use App\Repositories\GrupoU\TabelaInssRepository;
use App\Repositories\GrupoU\TabelaIrrfRepository;
use App\Repositories\GrupoU\TipoDocumentoRepository;
use Illuminate\Support\ServiceProvider;

class RepositoryServiceProvider extends ServiceProvider
{
    /** @var array<int, class-string> */
    public array $repositories = [
        // Grupo A
        PlanoContaRepository::class,
        CentroCustoRepository::class,
        PessoaRepository::class,
        ProdutoServicoRepository::class,
        FormaPagamentoRepository::class,
        CondicaoPagamentoRepository::class,
        DashboardRepository::class,
        ProventoDescontoRepository::class,
        RegraClassificacaoRepository::class,
        UsuarioRepository::class,
        CenarioSimulacaoRepository::class,
        AtorFuncionalRepository::class,
        MenuItemRepository::class,
        ConfiguracaoHandoffRepository::class,
        TipoFornecedorRepository::class,
        TipoClienteRepository::class,
        PrazoPadraoRepository::class,
        // Grupo F
        FilialRepository::class,
        PeriodoRepository::class,
        FuncionarioRepository::class,
        ContaBancariaRepository::class,
        AtivoRepository::class,
        NotaFiscalRepository::class,
        ContaPagarRepository::class,
        ContaReceberRepository::class,
        LancamentoRepository::class,
        FolhaPagamentoRepository::class,
        DepreciacaoRepository::class,
        ProvisaoRepository::class,
        RazaoImpostoRepository::class,
        PendenciaRepository::class,
        LogImportacaoRepository::class,
        TarefaRepository::class,
        UsuarioAtorRepository::class,
        // Grupo C
        NotaFiscalItemRepository::class,
        NotaFiscalImpostoRepository::class,
        NotaFiscalVinculoRepository::class,
        DocumentoEncadeadoRepository::class,
        // Grupo H
        ParametroFiscalRepository::class,
        // Grupo U (universais)
        NcmRepository::class,
        ServicoLc116Repository::class,
        CfopRepository::class,
        CstRepository::class,
        TipoDocumentoRepository::class,
        // ...
        EmpresaRepository::class,
        TabelaInssRepository::class,
        TabelaIrrfRepository::class,
        TabelaEncargosRepository::class,
        RegraClassificacaoLogRepository::class,
    ];

    public function register(): void
    {
        foreach ($this->repositories as $class) {
            $this->app->bind($class, $class);
        }
    }
}
