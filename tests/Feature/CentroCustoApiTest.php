<?php

use App\Models\CentroCusto;
use App\Models\Empresa;
use App\Models\Filial;
use App\Models\Usuario;
use App\Services\TenantContext;
use Database\Seeders\AtorFuncionalSeeder;
use Database\Seeders\EmpresaFilialSeeder;
use Database\Seeders\UsuarioSeeder;

beforeEach(function () {
    $this->seed(EmpresaFilialSeeder::class);
    $this->seed(AtorFuncionalSeeder::class);
    $this->seed(UsuarioSeeder::class);

    $this->usuario = Usuario::withoutGlobalScopes()->where('email', 'admin@gestor.local')->firstOrFail();

    $ctx = app(TenantContext::class);
    $ctx->set(1, 1, $this->usuario->id, null);

    $this->actingAs($this->usuario);
});

test('lista só centros da empresa do contexto', function () {
    CentroCusto::create(['id_empresa' => 1, 'nome' => 'CC da empresa 1', 'ativo' => true]);
    CentroCusto::create(['id_empresa' => 2, 'nome' => 'CC da empresa 2', 'ativo' => true]);

    $this->getJson('/api/centros-custo')
        ->assertOk()
        ->assertJsonCount(1)
        ->assertJsonFragment(['nome' => 'CC da empresa 1'])
        ->assertJsonMissing(['nome' => 'CC da empresa 2']);
});

test('cria centro de custo com id_empresa do contexto', function () {
    $this->postJson('/api/centros-custo', [
        'nome' => 'Novo CC',
        'responsavel' => 'Fulano',
    ])->assertCreated()
      ->assertJsonFragment(['nome' => 'Novo CC']);

    expect(CentroCusto::withoutGlobalScopes()->where('nome', 'Novo CC')->first()->id_empresa)->toBe(1);
});

test('não deixa o cliente definir id_empresa', function () {
    $this->postJson('/api/centros-custo', [
        'nome' => 'Invasor',
        'id_empresa' => 2,
    ])->assertCreated();

    expect(CentroCusto::withoutGlobalScopes()->where('nome', 'Invasor')->first()->id_empresa)->toBe(1);
});

test('atualiza centro de custo', function () {
    $cc = CentroCusto::create(['id_empresa' => 1, 'nome' => 'Antigo', 'ativo' => true]);

    $this->putJson("/api/centros-custo/{$cc->id}", ['nome' => 'Novo'])
        ->assertOk()
        ->assertJsonFragment(['nome' => 'Novo']);
});

test('destroy faz soft delete e desativa', function () {
    $cc = CentroCusto::create(['id_empresa' => 1, 'nome' => 'X', 'ativo' => true]);

    $this->deleteJson("/api/centros-custo/{$cc->id}")->assertNoContent();

    $cc->refresh();
    expect($cc->ativo)->toBeFalse();
    expect($cc->deleted_at)->not->toBeNull();
});