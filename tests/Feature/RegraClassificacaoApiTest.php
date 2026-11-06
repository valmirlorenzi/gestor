<?php

use App\Models\PlanoConta;
use App\Models\RegraClassificacao;
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

function payloadRegra(array $overrides = []): array
{
    return array_merge([
        'descricao' => 'Regra teste',
        'prioridade' => 3,
        'id_conta_destino' => null,
    ], $overrides);
}

it('lista regras da empresa do contexto', function () {
    $conta = PlanoConta::create([
        'id_empresa' => 1, 'codigo' => '1.1.1', 'nivel' => 3,
        'descricao' => 'Caixa', 'tipo' => 'Ativo', 'natureza' => 'Analitica',
        'aceita_lancamento' => true, 'ativo' => true,
    ]);

    $this->postJson('/api/regras-classificacao', [
        'descricao' => 'Regra A',
        'prioridade' => 2,
        'id_conta_destino' => $conta->id,
    ])->assertCreated();

    $this->getJson('/api/regras-classificacao')
        ->assertOk()
        ->assertJsonFragment(['descricao' => 'Regra A']);
});

it('cria regra com id_empresa do contexto e grava log', function () {
    $conta = PlanoConta::create([
        'id_empresa' => 1, 'codigo' => '1.1.1', 'nivel' => 3,
        'descricao' => 'Caixa', 'tipo' => 'Ativo', 'natureza' => 'Analitica',
        'aceita_lancamento' => true, 'ativo' => true,
    ]);

    $response = $this->postJson('/api/regras-classificacao', [
        'descricao' => 'Regra Nova',
        'prioridade' => 2,
        'id_conta_destino' => $conta->id,
    ])->assertCreated();

    $id = $response->json('id');

    $this->assertDatabaseHas('regras_classificacao', [
        'id' => $id,
        'id_empresa' => 1,
        'descricao' => 'Regra Nova',
        'origem' => 'Manual',
    ]);

    $this->assertDatabaseHas('regras_classificacao_logs', [
        'id_regra_classificacao' => $id,
        'acao' => 'Criada',
    ]);
});

it('atualiza regra e grava log de edição', function () {
    $conta = PlanoConta::create([
        'id_empresa' => 1, 'codigo' => '1.1.1', 'nivel' => 3,
        'descricao' => 'Caixa', 'tipo' => 'Ativo', 'natureza' => 'Analitica',
        'aceita_lancamento' => true, 'ativo' => true,
    ]);

    $response = $this->postJson('/api/regras-classificacao', [
        'descricao' => 'Antes',
        'prioridade' => 3,
        'id_conta_destino' => $conta->id,
    ])->assertCreated();

    $id = $response->json('id');

    $this->putJson('/api/regras-classificacao/'.$id, [
        'descricao' => 'Depois',
        'prioridade' => 4,
        'id_conta_destino' => $conta->id,
    ])->assertOk();

    $this->assertDatabaseHas('regras_classificacao', [
        'id' => $id,
        'descricao' => 'Depois',
        'prioridade' => 4,
    ]);

    $this->assertDatabaseHas('regras_classificacao_logs', [
        'id_regra_classificacao' => $id,
        'acao' => 'Editada',
    ]);
});

it('desativa regra com soft delete e grava log', function () {
    $conta = PlanoConta::create([
        'id_empresa' => 1, 'codigo' => '1.1.1', 'nivel' => 3,
        'descricao' => 'Caixa', 'tipo' => 'Ativo', 'natureza' => 'Analitica',
        'aceita_lancamento' => true, 'ativo' => true,
    ]);

    $response = $this->postJson('/api/regras-classificacao', [
        'descricao' => 'Regra a desativar',
        'prioridade' => 5,
        'id_conta_destino' => $conta->id,
    ])->assertCreated();

    $id = $response->json('id');

    $this->deleteJson('/api/regras-classificacao/'.$id)->assertNoContent();

    $regra = RegraClassificacao::withoutGlobalScopes()->find($id);

    expect($regra)->not->toBeNull();
    expect($regra->deleted_at)->not->toBeNull();
    expect($regra->ativo)->toBeFalse();

    $this->assertDatabaseHas('regras_classificacao_logs', [
        'id_regra_classificacao' => $id,
        'acao' => 'Desativada',
    ]);
});

it('testa motor e retorna regra vencedora por prioridade', function () {
    $conta = PlanoConta::create([
        'id_empresa' => 1, 'codigo' => '1.1.1', 'nivel' => 3,
        'descricao' => 'Caixa', 'tipo' => 'Ativo', 'natureza' => 'Analitica',
        'aceita_lancamento' => true, 'ativo' => true,
    ]);

    $this->postJson('/api/regras-classificacao', [
        'descricao' => 'Regra prioridade 1',
        'prioridade' => 1,
        'id_conta_destino' => $conta->id,
    ])->assertCreated();

    $this->postJson('/api/regras-classificacao', [
        'descricao' => 'Regra prioridade 5',
        'prioridade' => 5,
        'id_conta_destino' => $conta->id,
    ])->assertCreated();

    $this->postJson('/api/regras-classificacao/testar', [])
        ->assertOk()
        ->assertJsonFragment(['descricao' => 'Regra prioridade 1'])
        ->assertJsonPath('total_candidatas', 2);
});
