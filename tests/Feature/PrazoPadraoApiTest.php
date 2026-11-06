<?php

use App\Models\PrazoPadrao;
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

it('lista prazos por tipo', function () {
    $this->postJson('/api/prazos-padrao', [
        'descricao' => '30 dias', 'dias' => 30, 'parcelas' => 1, 'tipo' => 'compra',
    ])->assertCreated();

    $this->getJson('/api/prazos-padrao?tipo=compra')
        ->assertOk()
        ->assertJsonCount(1)
        ->assertJsonFragment(['descricao' => '30 dias']);
});

it('rejeita tipo inválido', function () {
    $this->getJson('/api/prazos-padrao?tipo=outro')->assertStatus(422);
});

it('faz soft delete de prazo', function () {
    $response = $this->postJson('/api/prazos-padrao', [
        'descricao' => '45 dias', 'dias' => 45, 'parcelas' => 1, 'tipo' => 'venda',
    ])->assertCreated();
    $id = $response->json('id');

    $this->deleteJson('/api/prazos-padrao/'.$id)->assertNoContent();

    $prazo = PrazoPadrao::withoutGlobalScopes()->find($id);

    expect($prazo)->not->toBeNull();
    expect($prazo->deleted_at)->not->toBeNull();
    expect($prazo->ativo)->toBeFalse();
});
