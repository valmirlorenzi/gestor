<?php

use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Web\AtivoController;
use App\Http\Controllers\Web\CentroCustoController;
use App\Http\Controllers\Web\ClienteController;
use App\Http\Controllers\Web\ConfiguracaoContabilController;
use App\Http\Controllers\Web\ConfiguracaoFiscalController;
use App\Http\Controllers\Web\EmpresaWebController;
use App\Http\Controllers\Web\FecharPeriodoController;
use App\Http\Controllers\Web\FilialContextController;
use App\Http\Controllers\Web\FilialWebController;
use App\Http\Controllers\Web\FornecedorController;
use App\Http\Controllers\Web\LancamentoManualController;
use App\Http\Controllers\Web\NotaFiscalController;
use App\Http\Controllers\Web\NotaFiscalSaidaController;
use App\Http\Controllers\Web\OsiController;
use App\Http\Controllers\Web\ParametroFiscalController;
use App\Http\Controllers\Web\PendenciaController;
use App\Http\Controllers\Web\PlanoContaController;
use App\Http\Controllers\Web\PrepararFechamentoController;
use App\Http\Controllers\Web\ProdutoController;
use App\Http\Controllers\Web\RegraClassificacaoController;
use App\Http\Controllers\Web\RevisaoLancamentoController;
use App\Http\Controllers\Web\ServicoController;
use App\Http\Controllers\Web\TabelaBasalComprasController;
use App\Http\Controllers\Web\TabelaBasalVendasController;
use App\Http\Controllers\Web\TarefaController;
use App\Http\Controllers\Web\TelaInicialController;
use App\Http\Controllers\Web\UsuarioController;
use App\Http\Controllers\Web\ValidacaoCalculoController;
use Illuminate\Support\Facades\Route;

// Login/logout (público)
Route::get('/login', [LoginController::class, 'showLoginForm'])->name('login');
Route::post('/login', [LoginController::class, 'login'])->name('login.post');
Route::post('/logout', [LoginController::class, 'logout'])->name('logout');

// Rotas autenticadas + contexto
Route::middleware(['auth', 'tenant'])->group(function () {
    Route::get('/', [TelaInicialController::class, 'index'])->name('tela-inicial');
    Route::get('/tela-inicial', [TelaInicialController::class, 'index'])->name('tela-inicial.alias');

    Route::prefix('empresa')->name('empresa.')->group(function () {
        Route::get('/', [EmpresaWebController::class, 'index'])->name('index');
    });

    Route::prefix('filial')->name('filial.')->group(function () {
        Route::get('/', [FilialWebController::class, 'index'])->name('index');
        Route::get('/create', [FilialWebController::class, 'create'])->name('create');
        Route::get('/{filial}/edit', [FilialWebController::class, 'edit'])->name('edit');
    });

    Route::post('/contexto/filial', [FilialContextController::class, 'trocar'])->name('contexto.filial');

    Route::get('/tela/{codigo}', function (string $codigo) {
        $view = 'telas.'.str_replace('.', '-', $codigo);
        if (view()->exists($view)) {
            return view($view, compact('codigo'));
        }
        abort(404);
    })->where('codigo', '[0-9.]+')->name('tela');

    Route::prefix('tarefas')->name('tarefas.')->group(function () {
        Route::get('/entrada', [TarefaController::class, 'entrada'])->name('entrada');
        Route::get('/saida', [TarefaController::class, 'saida'])->name('saida');
        Route::get('/historico', [TarefaController::class, 'historico'])->name('historico');
    });

    Route::prefix('centros-custo')->name('centros-custo.')->group(function () {
        Route::get('/', [CentroCustoController::class, 'index'])->name('index');
        Route::get('/create', [CentroCustoController::class, 'create'])->name('create');
        Route::get('/{id}/edit', [CentroCustoController::class, 'edit'])->name('edit');
    });

    Route::prefix('usuarios')->name('usuarios.')->group(function () {
        Route::get('/', [UsuarioController::class, 'index'])->name('index');
        Route::get('/create', [UsuarioController::class, 'create'])->name('create');
        Route::get('/{id}/edit', [UsuarioController::class, 'edit'])->name('edit');
        Route::get('/{id}/atores', [UsuarioController::class, 'atores'])->name('atores');
    });

    // routes/web.php (dentro do grupo auth+tenant)
    Route::prefix('produtos')->name('produtos.')->group(function () {
        Route::get('/', [ProdutoController::class, 'index'])->name('index');
        Route::get('/create', [ProdutoController::class, 'create'])->name('create');
        Route::get('/{id}/edit', [ProdutoController::class, 'edit'])->name('edit');
    });

    // routes/web.php
    Route::prefix('servicos')->name('servicos.')->group(function () {
        Route::get('/', [ServicoController::class, 'index'])->name('index');
        Route::get('/create', [ServicoController::class, 'create'])->name('create');
        Route::get('/{id}/edit', [ServicoController::class, 'edit'])->name('edit');
    });

    Route::prefix('ativos')->name('ativos.')->group(function () {
        Route::get('/', [AtivoController::class, 'index'])->name('index');
        Route::get('/create', [AtivoController::class, 'create'])->name('create');
        Route::get('/{id}/edit', [AtivoController::class, 'edit'])->name('edit');
        Route::get('/osi', [OsiController::class, 'index'])->name('osi.index');
    });

    Route::prefix('contador/plano-contas')->name('plano-contas.')->group(function () {
        Route::get('/', [PlanoContaController::class, 'index'])->name('index');
        Route::get('/create', [PlanoContaController::class, 'create'])->name('create');
        Route::get('/{id}/edit', [PlanoContaController::class, 'edit'])->name('edit');
    });

    Route::prefix('contador/tabelas-fiscais')->name('tabelas-fiscais.')->group(function () {
        Route::get('/', [ParametroFiscalController::class, 'index'])->name('index');
        Route::get('/create', [ParametroFiscalController::class, 'create'])->name('create');
        Route::get('/inss', [ParametroFiscalController::class, 'inss'])->name('inss');
        Route::get('/irrf', [ParametroFiscalController::class, 'irrf'])->name('irrf');
        Route::get('/encargos', [ParametroFiscalController::class, 'encargos'])->name('encargos');
        Route::get('/{id}/edit', [ParametroFiscalController::class, 'edit'])->name('edit');
    });

    Route::prefix('contador/config-contabeis')->name('config-contabeis.')->group(function () {
        Route::get('/', [ConfiguracaoContabilController::class, 'index'])->name('index');
        Route::get('/{id}/edit', [ConfiguracaoContabilController::class, 'edit'])->name('edit');
    });

    Route::get('contador/config-fiscais', [ConfiguracaoFiscalController::class, 'index'])->name('config-fiscais.index');

    Route::prefix('contador/regras')->name('regras-classificacao.')->group(function () {
        Route::get('/', [RegraClassificacaoController::class, 'index'])->name('index');
        Route::get('/create', [RegraClassificacaoController::class, 'create'])->name('create');
        Route::get('/{id}/edit', [RegraClassificacaoController::class, 'edit'])->name('edit');
    });

    Route::get('contador/lancamento-manual/create', [LancamentoManualController::class, 'create'])->name('lancamento-manual.create');
    Route::get('contador/revisao', [RevisaoLancamentoController::class, 'index'])->name('revisao-lancamentos.index');
    Route::get('contador/lancamento-manual', [LancamentoManualController::class, 'create'])->name('lancamento-manual.index');

    Route::get('contador/validacao', [ValidacaoCalculoController::class, 'index'])->name('validacao.index');
    Route::get('contador/pendencias', [PendenciaController::class, 'index'])->name('pendencias.index');

    Route::get('contador/preparar-fechamento', [PrepararFechamentoController::class, 'index'])->name('preparar-fechamento.index');
    Route::get('contador/fechar', [FecharPeriodoController::class, 'index'])->name('fechar-periodo.index');

    Route::get('comprador/tabelas', [TabelaBasalComprasController::class, 'index'])->name('comprador.tabelas.index');
    Route::get('faturista/tabelas', [TabelaBasalVendasController::class, 'index'])->name('faturista.tabelas.index');

    Route::prefix('comprador/fornecedores')->name('comprador.fornecedores.')->group(function () {
        Route::get('/', [FornecedorController::class, 'index'])->name('index');
        Route::get('/create', [FornecedorController::class, 'create'])->name('create');
        Route::get('/{id}/edit', [FornecedorController::class, 'edit'])->name('edit');
    });

    Route::prefix('comprador/nota-entrada')->name('comprador.nota-entrada.')->group(function () {
        Route::get('/', [NotaFiscalController::class, 'index'])->name('index');
        Route::get('/create', [NotaFiscalController::class, 'create'])->name('create');
        Route::get('/{id}/edit', [NotaFiscalController::class, 'edit'])->name('edit');
    });

    Route::prefix('faturista/clientes')->name('faturista.clientes.')->group(function () {
        Route::get('/', [ClienteController::class, 'index'])->name('index');
        Route::get('/create', [ClienteController::class, 'create'])->name('create');
        Route::get('/{id}/edit', [ClienteController::class, 'edit'])->name('edit');
    });

    // 6.3 Digitar Notas de Saída
    Route::prefix('faturista/nota-saida')->name('faturista.nota-saida.')->group(function () {
        Route::get('/', [NotaFiscalSaidaController::class, 'index'])->name('index');
        Route::get('/create', [NotaFiscalSaidaController::class, 'create'])->name('create');
        Route::get('/{id}/edit', [NotaFiscalSaidaController::class, 'edit'])->name('edit');
    });

});
