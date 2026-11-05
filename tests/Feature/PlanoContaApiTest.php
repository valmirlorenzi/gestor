<?php

use App\Models\PlanoConta;
use App\Models\Usuario;
use App\Services\TenantContext;
use Database\Seeders\AtorFuncionalSeeder;
use Database\Seeders\EmpresaFilialSeeder;
use Database\Seeders\UsuarioSeeder;

beforeEach(function () {
    $this->seed(EmpresaFilialSeeder::class);
    $this->seed(AtorFuncionalSeeder::class);
    $this->seed(UsuarioSeeder::class);

    $this->usuario = Usuario::withoutGlobalScopes()
        ->where('email', 'admin@gestor.local')
        ->firstOrFail();

    app(TenantContext::class)->set(1, 1, $this->usuario->id, null);

    $this->actingAs($this->usuario);
});

it('lista contas da empresa do contexto', function () {
    $this->postJson('/api/plano-contas', [
        'codigo' => '1', 'descricao' => 'Ativo', 'tipo' => 'Ativo',
        'natureza' => 'Sintetica',
    ])->assertCreated();

    $this->postJson('/api/plano-contas', [
        'codigo' => '1.1', 'descricao' => 'Ativo Circulante', 'tipo' => 'Ativo',
        'natureza' => 'Sintetica',
    ])->assertCreated();

    $this->getJson('/api/plano-contas')
        ->assertOk()
        ->assertJsonCount(2)
        ->assertJsonFragment(['codigo' => '1'])
        ->assertJsonFragment(['codigo' => '1.1']);
});

it('cria conta com id_empresa do contexto e nível correto', function () {
    $this->postJson('/api/plano-contas', [
        'codigo' => '1', 'descricao' => 'Ativo', 'tipo' => 'Ativo',
        'natureza' => 'Sintetica',
    ])->assertCreated();

    $this->postJson('/api/plano-contas', [
        'codigo' => '1.1', 'descricao' => 'Ativo Circulante', 'tipo' => 'Ativo',
        'natureza' => 'Sintetica',
        'id_conta_pai' => PlanoConta::first()->id,
    ])->assertCreated();

    $this->assertDatabaseHas('planos_contas', [
        'codigo' => '1', 'id_empresa' => 1, 'nivel' => 1,
    ]);
    $this->assertDatabaseHas('planos_contas', [
        'codigo' => '1.1', 'id_empresa' => 1, 'nivel' => 2,
    ]);
});

it('rejeita conta pai inexistente', function () {
    $this->postJson('/api/plano-contas', [
        'codigo' => '9.9', 'descricao' => 'X', 'tipo' => 'Ativo',
        'natureza' => 'Sintetica', 'id_conta_pai' => 99999,
    ])->assertStatus(422);

    $this->assertDatabaseMissing('planos_contas', ['codigo' => '9.9']);
});

it('atualiza conta e mantém a empresa original', function () {
    $response = $this->postJson('/api/plano-contas', [
        'codigo' => '1', 'descricao' => 'Antes', 'tipo' => 'Ativo',
        'natureza' => 'Sintetica',
    ])->assertCreated();
    $id = $response->json('id');

    $this->putJson('/api/plano-contas/'.$id, [
        'codigo' => '1', 'descricao' => 'Depois', 'tipo' => 'Ativo',
        'natureza' => 'Sintetica',
    ])->assertOk();

    $this->assertDatabaseHas('planos_contas', [
        'id' => $id, 'descricao' => 'Depois', 'id_empresa' => 1,
    ]);
});

it('faz soft delete de conta', function () {
    $response = $this->postJson('/api/plano-contas', [
        'codigo' => '1', 'descricao' => 'Ativo', 'tipo' => 'Ativo',
        'natureza' => 'Sintetica',
    ])->assertCreated();
    $id = $response->json('id');

    $this->deleteJson('/api/plano-contas/'.$id)->assertNoContent();

    $plano = PlanoConta::withoutGlobalScopes()->find($id);

    expect($plano)->not->toBeNull();
    expect($plano->deleted_at)->not->toBeNull();
    expect($plano->ativo)->toBeFalse();
});
