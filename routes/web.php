<?php

use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Web\EmpresaWebController;
use App\Http\Controllers\Web\FilialWebController;
use App\Http\Controllers\Web\TelaInicialController;
use Illuminate\Support\Facades\Route;

// Login/logout (público)
Route::get('/login', [LoginController::class, 'showLoginForm'])->name('login');
Route::post('/login', [LoginController::class, 'login'])->name('login.post');
Route::post('/logout', [LoginController::class, 'logout'])->name('logout');

// Rotas autenticadas + contexto
Route::middleware(['auth', 'tenant'])->group(function () {
    Route::get('/', [TelaInicialController::class, 'index'])->name('tela-inicial');

    Route::prefix('empresa')->name('empresa.')->group(function () {
        Route::get('/', [EmpresaWebController::class, 'index'])->name('index');
    });

    Route::prefix('filial')->name('filial.')->group(function () {
        Route::get('/', [FilialWebController::class, 'index'])->name('index');
        Route::get('/create', [FilialWebController::class, 'create'])->name('create');
        Route::get('/{filial}/edit', [FilialWebController::class, 'edit'])->name('edit');
    });

    Route::get('/tela/{codigo}', function (string $codigo) {
        $view = 'telas.' . str_replace('.', '-', $codigo);
        if (view()->exists($view)) {
            return view($view, compact('codigo'));
        }
        abort(404);
    })->where('codigo', '[0-9.]+')->name('tela');
});