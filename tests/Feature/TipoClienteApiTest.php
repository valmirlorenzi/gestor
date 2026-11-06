<?php

use App\Models\TipoCliente;
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

it('lista tipos de cliente da empresa do contexto', function () {
    $this->postJson('/api/tipos-cliente', ['descricao' => 'Distribuidor'])->assertCreated();

    $this->getJson('/api/tipos-cliente')
        ->assertOk()
        ->assertJsonCount(1)
        ->assertJsonFragment(['descricao' => 'Distribuidor']);
});

it('cria tipo com id_empresa do contexto', function () {
    $this->postJson('/api/tipos-cliente', ['descricao' => 'Atacadista'])->assertCreated();

    $this->assertDatabaseHas('tipos_cliente', [
        'id_empresa' => 1,
        'descricao' => 'Atacadista',
    ]);
});

it('faz soft delete de tipo', function () {
    $response = $this->postJson('/api/tipos-cliente', ['descricao' => 'Para excluir'])->assertCreated();
    $id = $response->json('id');

    $this->deleteJson('/api/tipos-cliente/'.$id)->assertNoContent();

    $tipo = TipoCliente::withoutGlobalScopes()->find($id);

    expect($tipo)->not->toBeNull();
    expect($tipo->deleted_at)->not->toBeNull();
    expect($tipo->ativo)->toBeFalse();
});
