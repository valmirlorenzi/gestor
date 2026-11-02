<?php

use App\Http\Controllers\Api\EmpresaApiController;
use App\Http\Controllers\Api\FilialApiController;
use Illuminate\Support\Facades\Route;

Route::middleware(['web'])->group(function () {
    Route::apiResource('empresas', EmpresaApiController::class);
    Route::apiResource('filiais', FilialApiController::class);
});