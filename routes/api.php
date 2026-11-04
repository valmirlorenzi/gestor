<?php

use App\Http\Controllers\Api\AtivoApiController;
use App\Http\Controllers\Api\CentroCustoApiController;
use App\Http\Controllers\Api\EmpresaApiController;
use App\Http\Controllers\Api\FilialApiController;
use App\Http\Controllers\Api\OsiApiController;
use App\Http\Controllers\Api\ProdutoApiController;
use App\Http\Controllers\Api\UsuarioApiController;
use App\Http\Controllers\Api\UsuarioAtorApiController;
use App\Http\Controllers\Api\ServicoApiController;
use Illuminate\Support\Facades\Route;

Route::middleware(['web', 'auth', 'tenant'])->name('api.')->group(function () {
    Route::apiResource('empresas', EmpresaApiController::class);
    Route::apiResource('filiais', FilialApiController::class);
    Route::apiResource('centros-custo', CentroCustoApiController::class);
    Route::apiResource('usuarios', UsuarioApiController::class);
    Route::apiResource('produtos', ProdutoApiController::class);    
    Route::apiResource('servicos', ServicoApiController::class);    
    Route::apiResource('ativos', AtivoApiController::class);

    Route::get('usuarios/{usuario}/atores', [UsuarioAtorApiController::class, 'index'])->name('usuarios.atores.index');
    Route::post('usuarios/{usuario}/atores', [UsuarioAtorApiController::class, 'sincronizar'])->name('usuarios.atores.sincronizar');
    Route::delete('usuario-atores/{usuarioAtor}', [UsuarioAtorApiController::class, 'destroy'])->name('usuario-atores.destroy');
    Route::get('osi', [OsiApiController::class, 'show'])->name('osi.show');
    Route::put('osi', [OsiApiController::class, 'update'])->name('osi.update');

});
