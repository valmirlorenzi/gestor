<?php

use App\Models\Usuario;
use App\Services\TenantContext;
use Database\Seeders\AtorFuncionalSeeder;
use Database\Seeders\EmpresaFilialSeeder;
use Database\Seeders\UsuarioSeeder;
use Illuminate\Support\Facades\Hash;

beforeEach(function () {
    $this->seed(EmpresaFilialSeeder::class);
    $this->seed(AtorFuncionalSeeder::class);
    $this->seed(UsuarioSeeder::class);

    $this->admin = Usuario::withoutGlobalScopes()->where('email', 'admin@gestor.local')->firstOrFail();

    $ctx = app(TenantContext::class);
    $ctx->set(1, 1, $this->admin->id, null);

    $this->actingAs($this->admin);
});

test('lista só usuários da empresa do contexto', function () {
    $this->getJson('/api/usuarios')
        ->assertOk()
        ->assertJsonFragment(['email' => 'admin@gestor.local'])
        ->assertJsonMissing(['email' => 'nao@existe.local']);
});

test('cria usuário com senha hasheada', function () {
    $this->postJson('/api/usuarios', [
        'nome' => 'Novo User',
        'email' => 'novo@teste.local',
        'senha' => 'senha1234',
        'ativo' => true,
    ])->assertCreated();

    $u = Usuario::withoutGlobalScopes()->where('email', 'novo@teste.local')->firstOrFail();
    expect($u->id_empresa)->toBe(1);
    expect(Hash::check('senha1234', $u->senha_hash))->toBeTrue();
});

test('atualiza sem trocar senha', function () {
    $u = Usuario::withoutGlobalScopes()->where('email', 'admin@gestor.local')->firstOrFail();
    $hashOriginal = $u->senha_hash;

    $this->putJson("/api/usuarios/{$u->id}", [
        'nome' => 'Admin Novo',
        'email' => 'admin@gestor.local',
    ])->assertOk();

    $u->refresh();
    expect($u->nome)->toBe('Admin Novo');
    expect($u->senha_hash)->toBe($hashOriginal);
});

test('atualiza trocando senha', function () {
    $u = Usuario::withoutGlobalScopes()->where('email', 'admin@gestor.local')->firstOrFail();

    $this->putJson("/api/usuarios/{$u->id}", [
        'nome' => $u->nome,
        'email' => $u->email,
        'senha' => 'novasenha1',
    ])->assertOk();

    $u->refresh();
    expect(Hash::check('novasenha1', $u->senha_hash))->toBeTrue();
});
