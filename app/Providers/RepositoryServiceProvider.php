<?php

namespace App\Providers;

use App\Repositories\GrupoA\CenarioSimulacaoRepository;
use App\Repositories\GrupoA\CentroCustoRepository;
use App\Repositories\GrupoA\CondicaoPagamentoRepository;
use App\Repositories\GrupoA\FormaPagamentoRepository;
use App\Repositories\GrupoA\PessoaRepository;
use App\Repositories\GrupoA\PlanoContaRepository;
use App\Repositories\GrupoA\ProdutoServicoRepository;
use App\Repositories\GrupoA\ProventoDescontoRepository;
use App\Repositories\GrupoA\RegraClassificacaoRepository;
use App\Repositories\GrupoA\UsuarioRepository;
use App\Repositories\GrupoC\DocumentoEncadeadoRepository;
use App\Repositories\GrupoC\NotaFiscalImpostoRepository;
use App\Repositories\GrupoC\NotaFiscalItemRepository;
use App\Repositories\GrupoC\NotaFiscalVinculoRepository;
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
        ProventoDescontoRepository::class,
        RegraClassificacaoRepository::class,
        UsuarioRepository::class,
        CenarioSimulacaoRepository::class,
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
    ];

    public function register(): void
    {
        foreach ($this->repositories as $class) {
            $this->app->bind($class, $class);
        }
    }
}