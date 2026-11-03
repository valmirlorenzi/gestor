<?php

use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Web\EmpresaWebController;
use App\Http\Controllers\Web\FilialContextController;
use App\Http\Controllers\Web\FilialWebController;
use App\Http\Controllers\Web\TarefaController;
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
        Route::get('/',          [\App\Http\Controllers\Web\CentroCustoController::class, 'index'])->name('index');
        Route::get('/create',    [\App\Http\Controllers\Web\CentroCustoController::class, 'create'])->name('create');
        Route::get('/{id}/edit', [\App\Http\Controllers\Web\CentroCustoController::class, 'edit'])->name('edit');
    });

    Route::prefix('usuarios')->name('usuarios.')->group(function () {
        Route::get('/',           [\App\Http\Controllers\Web\UsuarioController::class, 'index'])->name('index');
        Route::get('/create',     [\App\Http\Controllers\Web\UsuarioController::class, 'create'])->name('create');
        Route::get('/{id}/edit',  [\App\Http\Controllers\Web\UsuarioController::class, 'edit'])->name('edit');
        Route::get('/{id}/atores',[\App\Http\Controllers\Web\UsuarioController::class, 'atores'])->name('atores');
    });    
    
});
