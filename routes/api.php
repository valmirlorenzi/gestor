<?php

use App\Http\Controllers\Api\CentroCustoApiController;
use App\Http\Controllers\Api\EmpresaApiController;
use App\Http\Controllers\Api\FilialApiController;
use App\Http\Controllers\Api\UsuarioApiController;
use App\Http\Controllers\Api\UsuarioAtorApiController;
use Illuminate\Support\Facades\Route;

Route::middleware(['web'])->group(function () {
    Route::apiResource('empresas', EmpresaApiController::class);
    Route::apiResource('filiais', FilialApiController::class);
    Route::apiResource('centros-custo', CentroCustoApiController::class);
    Route::apiResource('usuarios', UsuarioApiController::class);

    Route::get('usuarios/{usuario}/atores',  [UsuarioAtorApiController::class, 'index']);
    Route::post('usuarios/{usuario}/atores', [UsuarioAtorApiController::class, 'sincronizar']);
    Route::delete('usuario-atores/{usuarioAtor}', [UsuarioAtorApiController::class, 'destroy']);
});