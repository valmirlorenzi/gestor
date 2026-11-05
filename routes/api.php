<?php

use App\Http\Controllers\Api\AtivoApiController;
use App\Http\Controllers\Api\CentroCustoApiController;
use App\Http\Controllers\Api\ConfiguracaoContabilApiController;
use App\Http\Controllers\Api\ConfiguracaoFiscalApiController;
use App\Http\Controllers\Api\EmpresaApiController;
use App\Http\Controllers\Api\FilialApiController;
use App\Http\Controllers\Api\OsiApiController;
use App\Http\Controllers\Api\ParametroFiscalApiController;
use App\Http\Controllers\Api\PlanoContaApiController;
use App\Http\Controllers\Api\ProdutoApiController;
use App\Http\Controllers\Api\ServicoApiController;
use App\Http\Controllers\Api\TabelaAuxiliarApiController;
use App\Http\Controllers\Api\UsuarioApiController;
use App\Http\Controllers\Api\UsuarioAtorApiController;
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

});
