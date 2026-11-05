<?php

use App\Models\Ativo;
use App\Models\CentroCusto;
use App\Models\Usuario;
use App\Services\TenantContext;
use Database\Seeders\AtorFuncionalSeeder;
use Database\Seeders\EmpresaFilialSeeder;
use Database\Seeders\UsuarioSeeder;

beforeEach(function () {
    $this->seed(EmpresaFilialSeeder::class);
    $this->seed(AtorFuncionalSeeder::class);
    $this->seed(UsuarioSeeder::class);
    $this->seed(CentroCustoSeeder::class);

    $this->usuario = Usuario::withoutGlobalScopes()
        ->where('email', 'admin@gestor.local')
        ->firstOrFail();

    app(TenantContext::class)->set(1, 1, $this->usuario->id, null);

    $this->actingAs($this->usuario);
});

function payloadAtivo(array $overrides = []): array
{
    return array_merge([
        'descricao' => 'Notebook Dell',
        'data_aquisicao' => '2025-01-15',
        'valor_original' => 5000.00,
        'valor_residual' => 500.00,
        'vida_util_meses' => 60,
        'metodo_depreciacao' => 'Linear',
        'mes_inicial_depreciacao' => '2025-02',
        'id_centro_custo' => null,
        'destino' => 'TI',
        'status' => 'Em uso',
    ], $overrides);
}

it('lista ativos da filial do contexto', function () {
    $this->postJson('/api/ativos', payloadAtivo())->assertCreated();
    $this->postJson('/api/ativos', payloadAtivo(['descricao' => 'Impressora HP']))->assertCreated();

    $this->getJson('/api/ativos')
        ->assertOk()
        ->assertJsonCount(2)
        ->assertJsonFragment(['descricao' => 'Notebook Dell'])
        ->assertJsonFragment(['descricao' => 'Impressora HP']);
});

it('cria ativo com id_filial do contexto', function () {
    $this->postJson('/api/ativos', payloadAtivo())->assertCreated();

    $this->assertDatabaseHas('ativos', [
        'id_filial' => 1,
        'descricao' => 'Notebook Dell',
        'valor_original' => 5000.00,
    ]);
});

it('cria ativo com centro de custo da mesma empresa (P23 ok)', function () {
    $cc = CentroCusto::query()->firstOrFail();

    $this->postJson('/api/ativos', payloadAtivo(['id_centro_custo' => $cc->id]))
        ->assertCreated();

    $this->assertDatabaseHas('ativos', [
        'descricao' => 'Notebook Dell',
        'id_centro_custo' => $cc->id,
    ]);
});

it('rejeita centro de custo de outra empresa (P23)', function () {
    // Cria centro de custo na empresa 2 (via bypass do global scope)
    $ccEmpresa2 = CentroCusto::withoutGlobalScopes()->create([
        'id_empresa' => 2,
        'nome' => 'CC Empresa 2',
        'ativo' => true,
    ]);

    $this->postJson('/api/ativos', payloadAtivo(['id_centro_custo' => $ccEmpresa2->id]))
        ->assertStatus(422);

    $this->assertDatabaseMissing('ativos', [
        'descricao' => 'Notebook Dell',
    ]);
});

it('atualiza ativo', function () {
    $response = $this->postJson('/api/ativos', payloadAtivo())->assertCreated();
    $id = $response->json('id');

    $this->putJson('/api/ativos/'.$id, payloadAtivo(['descricao' => 'Notebook Dell Atualizado']))
        ->assertOk();

    $this->assertDatabaseHas('ativos', [
        'id' => $id,
        'descricao' => 'Notebook Dell Atualizado',
    ]);
});

it('faz soft delete de ativo', function () {
    $response = $this->postJson('/api/ativos', payloadAtivo())->assertCreated();
    $id = $response->json('id');

    $this->deleteJson('/api/ativos/'.$id)->assertNoContent();

    $ativo = Ativo::withoutGlobalScopes()->find($id);

    expect($ativo)->not->toBeNull();
    expect($ativo->deleted_at)->not->toBeNull();
    expect($ativo->ativo)->toBeFalse();
});
