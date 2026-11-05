<?php

use App\Models\ConfiguracaoHandoff;
use App\Models\Usuario;
use App\Repositories\GrupoA\ConfiguracaoHandoffRepository;
use App\Services\TenantContext;
use Database\Seeders\AtorFuncionalSeeder;
use Database\Seeders\EmpresaFilialSeeder;
use Database\Seeders\UsuarioSeeder;

beforeEach(function () {
    $this->seed(EmpresaFilialSeeder::class);
    $this->seed(AtorFuncionalSeeder::class);
    $this->seed(UsuarioSeeder::class);

    $usuario = Usuario::withoutGlobalScopes()->where('email', 'admin@gestor.local')->firstOrFail();
    app(TenantContext::class)->set(1, 1, $usuario->id, null);
});

it('retorna null quando não há configuração', function () {
    $repo = new ConfiguracaoHandoffRepository(new ConfiguracaoHandoff);
    expect($repo->daEmpresa())->toBeNull();
});

it('retorna a configuração da empresa do contexto', function () {
    ConfiguracaoHandoff::create(['id_empresa' => 1, 'handoff_ativo' => true]);

    $repo = new ConfiguracaoHandoffRepository(new ConfiguracaoHandoff);
    $config = $repo->daEmpresa();

    expect($config)->not->toBeNull();
    expect($config->id_empresa)->toBe(1);
    expect($config->handoff_ativo)->toBeTrue();
});
