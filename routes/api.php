<?php

use App\Http\Controllers\Api\AtivoApiController;
use App\Http\Controllers\Api\CentroCustoApiController;
use App\Http\Controllers\Api\ClienteApiController;
use App\Http\Controllers\Api\ConfiguracaoContabilApiController;
use App\Http\Controllers\Api\ConfiguracaoFiscalApiController;
use App\Http\Controllers\Api\ContaPagarApiController;
use App\Http\Controllers\Api\ContaReceberApiController;
use App\Http\Controllers\Api\EmpresaApiController;
use App\Http\Controllers\Api\FecharPeriodoApiController;
use App\Http\Controllers\Api\FilialApiController;
use App\Http\Controllers\Api\FornecedorApiController;
use App\Http\Controllers\Api\LancamentoManualApiController;
use App\Http\Controllers\Api\NotaFiscalApiController;
use App\Http\Controllers\Api\NotaFiscalSaidaApiController;
use App\Http\Controllers\Api\OsiApiController;
use App\Http\Controllers\Api\ParametroFiscalApiController;
use App\Http\Controllers\Api\PendenciaApiController;
use App\Http\Controllers\Api\PlanoContaApiController;
use App\Http\Controllers\Api\PrazoPadraoApiController;
use App\Http\Controllers\Api\PrepararFechamentoApiController;
use App\Http\Controllers\Api\ProdutoApiController;
use App\Http\Controllers\Api\RegraClassificacaoApiController;
use App\Http\Controllers\Api\RevisaoLancamentoApiController;
use App\Http\Controllers\Api\ServicoApiController;
use App\Http\Controllers\Api\TabelaAuxiliarApiController;
use App\Http\Controllers\Api\TipoClienteApiController;
use App\Http\Controllers\Api\TipoFornecedorApiController;
use App\Http\Controllers\Api\UsuarioApiController;
use App\Http\Controllers\Api\UsuarioAtorApiController;
use App\Http\Controllers\Api\ValidacaoCalculoApiController;
use Illuminate\Support\Facades\Route;

Route::middleware(['web', 'auth', 'tenant'])->name('api.')->group(function () {
    Route::apiResource('empresas', EmpresaApiController::class);
    Route::apiResource('filiais', FilialApiController::class);
    Route::apiResource('centros-custo', CentroCustoApiController::class);
    Route::apiResource('usuarios', UsuarioApiController::class);
    Route::apiResource('produtos', ProdutoApiController::class);
    Route::apiResource('servicos', ServicoApiController::class);
    Route::apiResource('ativos', AtivoApiController::class);
    Route::apiResource('plano-contas', PlanoContaApiController::class);

    Route::get('usuarios/{usuario}/atores', [UsuarioAtorApiController::class, 'index'])->name('usuarios.atores.index');
    Route::post('usuarios/{usuario}/atores', [UsuarioAtorApiController::class, 'sincronizar'])->name('usuarios.atores.sincronizar');
    Route::delete('usuario-atores/{usuarioAtor}', [UsuarioAtorApiController::class, 'destroy'])->name('usuario-atores.destroy');
    Route::get('osi', [OsiApiController::class, 'show'])->name('osi.show');
    Route::put('osi', [OsiApiController::class, 'update'])->name('osi.update');
    Route::get('plano-contas/proximo-codigo', [PlanoContaApiController::class, 'proximoCodigo'])->name('api.plano-contas.proximo-codigo');

    Route::get('tabelas-inss', [TabelaAuxiliarApiController::class, 'inss'])->name('api.tabelas-inss.index');
    Route::get('tabelas-irrf', [TabelaAuxiliarApiController::class, 'irrf'])->name('api.tabelas-irrf.index');
    Route::get('tabelas-encargos', [TabelaAuxiliarApiController::class, 'encargos'])->name('api.tabelas-encargos.index');

    Route::apiResource('parametros-fiscais', ParametroFiscalApiController::class)->except(['destroy']);

    Route::get('config-contabeis', [ConfiguracaoContabilApiController::class, 'index'])->name('api.config-contabeis.index');
    Route::put('config-contabeis/{id}', [ConfiguracaoContabilApiController::class, 'update'])->name('api.config-contabeis.update');

    Route::get('config-fiscais', [ConfiguracaoFiscalApiController::class, 'show'])->name('api.config-fiscais.show');
    Route::put('config-fiscais', [ConfiguracaoFiscalApiController::class, 'update'])->name('api.config-fiscais.update');

    Route::post('regras-classificacao/testar', [RegraClassificacaoApiController::class, 'testar'])
        ->name('api.regras-classificacao.testar');
    Route::post('regras-classificacao/{id}/reativar', [RegraClassificacaoApiController::class, 'reativar'])
        ->name('api.regras-classificacao.reativar');
    Route::apiResource('regras-classificacao', RegraClassificacaoApiController::class);

    Route::post('lancamentos-manuais', [LancamentoManualApiController::class, 'store'])->name('api.lancamentos-manuais.store');

    Route::get('revisao-lancamentos', [RevisaoLancamentoApiController::class, 'index'])->name('api.revisao-lancamentos.index');
    Route::put('revisao-lancamentos/{id}/reclassificar', [RevisaoLancamentoApiController::class, 'reclassificar'])->name('api.revisao-lancamentos.reclassificar');
    Route::put('revisao-lancamentos/{id}/validar', [RevisaoLancamentoApiController::class, 'validar'])->name('api.revisao-lancamentos.validar');

    Route::get('validacao/razoes-impostos', [ValidacaoCalculoApiController::class, 'razoesImpostos'])->name('api.validacao.razoes-impostos');
    Route::put('validacao/razoes-impostos/{id}/validar', [ValidacaoCalculoApiController::class, 'validarRazao'])->name('api.validacao.validar-razao');
    Route::put('validacao/razoes-impostos/{id}/override', [ValidacaoCalculoApiController::class, 'overrideRazao'])->name('api.validacao.override-razao');

    Route::get('pendencias', [PendenciaApiController::class, 'index'])->name('api.pendencias.index');
    Route::put('pendencias/{id}/resolver', [PendenciaApiController::class, 'resolver'])->name('api.pendencias.resolver');

    Route::get('preparar-fechamento', [PrepararFechamentoApiController::class, 'show'])->name('api.preparar-fechamento.show');
    Route::post('preparar-fechamento/enviar-auditor', [PrepararFechamentoApiController::class, 'enviarAuditor'])->name('api.preparar-fechamento.enviar-auditor');

    Route::get('fechar-periodo', [FecharPeriodoApiController::class, 'index'])->name('api.fechar-periodo.index');
    Route::put('fechar-periodo/{id}', [FecharPeriodoApiController::class, 'fechar'])->name('api.fechar-periodo.fechar');

    Route::apiResource('tipos-fornecedor', TipoFornecedorApiController::class);
    Route::apiResource('tipos-cliente', TipoClienteApiController::class);
    Route::apiResource('prazos-padrao', PrazoPadraoApiController::class);

    Route::apiResource('fornecedores', FornecedorApiController::class);
    Route::apiResource('clientes', ClienteApiController::class);

    Route::apiResource('notas-entrada', NotaFiscalApiController::class)->parameters(['notas-entrada' => 'id']);
    Route::post('notas-entrada/rascunho', [NotaFiscalApiController::class, 'salvarRascunho'])->name('api.notas-entrada.rascunho');
    Route::post('notas-entrada/{id}/confirmar', [NotaFiscalApiController::class, 'confirmar'])->name('api.notas-entrada.confirmar');

    Route::apiResource('notas-saida', NotaFiscalSaidaApiController::class)->parameters(['notas-saida' => 'id']);
    Route::post('notas-saida/rascunho', [NotaFiscalSaidaApiController::class, 'salvarRascunho'])->name('api.notas-saida.rascunho');
    Route::post('notas-saida/{id}/confirmar', [NotaFiscalSaidaApiController::class, 'confirmar'])->name('api.notas-saida.confirmar');

    Route::get('contas-pagar', [ContaPagarApiController::class, 'index'])->name('api.contas-pagar.index');
    Route::get('contas-pagar/{id}', [ContaPagarApiController::class, 'show'])->name('api.contas-pagar.show');
    Route::post('contas-pagar/{id}/baixar', [ContaPagarApiController::class, 'baixar'])->name('api.contas-pagar.baixar');
    Route::post('contas-pagar/{id}/estornar', [ContaPagarApiController::class, 'estornar'])->name('api.contas-pagar.estornar');
    Route::get('contas-pagar/opcoes', [ContaPagarApiController::class, 'opcoes'])->name('api.contas-pagar.opcoes');

    Route::get('contas-receber', [ContaReceberApiController::class, 'index'])->name('api.contas-receber.index');
    Route::get('contas-receber/opcoes', [ContaReceberApiController::class, 'opcoes'])->name('api.contas-receber.opcoes');
    Route::get('contas-receber/{id}', [ContaReceberApiController::class, 'show'])->name('api.contas-receber.show');
    Route::post('contas-receber/{id}/receber', [ContaReceberApiController::class, 'receber'])->name('api.contas-receber.receber');
    Route::post('contas-receber/{id}/estornar', [ContaReceberApiController::class, 'estornar'])->name('api.contas-receber.estornar');
});
