<?php

use App\Models\Usuario;
use App\Services\TenantContext;
use Database\Seeders\AtorFuncionalSeeder;
use Database\Seeders\EmpresaFilialSeeder;
use Database\Seeders\UsuarioSeeder;

beforeEach(function () {
    $this->seed(EmpresaFilialSeeder::class);
    $this->seed(AtorFuncionalSeeder::class);
    $this->seed(UsuarioSeeder::class);

    $this->admin = Usuario::withoutGlobalScopes()
        ->where('email', 'admin@gestor.local')
        ->firstOrFail();

    $ctx = app(TenantContext::class);
    $ctx->set(1, 1, $this->admin->id, null);

    $this->actingAs($this->admin);
});

test('empresa 1 não vê usuários da empresa 2', function () {
    $this->getJson('/api/usuarios')
        ->assertOk()
        ->assertJsonMissing(['id_empresa' => 2]);
});

test('empresa 1 não cria usuário na empresa 2', function () {
    $this->postJson('/api/usuarios', [
        'nome' => 'Invasor',
        'email' => 'invasor@teste.local',
        'senha' => 'senha1234',
        'id_empresa' => 2,
    ])->assertCreated();

    $u = Usuario::withoutGlobalScopes()->where('email', 'invasor@teste.local')->firstOrFail();
    expect($u->id_empresa)->toBe(1);
});
