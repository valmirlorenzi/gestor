<?php

use App\Models\ProdutoServico;
use App\Models\ServicoLc116;
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

it('lista servicos da empresa do contexto', function () {
    $this->postJson('/api/servicos', [
        'descricao' => 'Serviço A',
        'codigo_interno' => 'S-A',
    ])->assertCreated();

    $this->postJson('/api/servicos', [
        'descricao' => 'Serviço B',
        'codigo_interno' => 'S-B',
    ])->assertCreated();

    $this->getJson('/api/servicos')
        ->assertOk()
        ->assertJsonCount(2)
        ->assertJsonFragment(['descricao' => 'Serviço A'])
        ->assertJsonFragment(['descricao' => 'Serviço B']);
});

it('cria servico com id_empresa do contexto', function () {
    $this->postJson('/api/servicos', [
        'descricao' => 'Serviço Novo',
        'codigo_interno' => 'SN-1',
    ])->assertCreated();

    $this->assertDatabaseHas('produtos_servicos', [
        'id_empresa' => 1,
        'tipo' => 'S',
        'descricao' => 'Serviço Novo',
        'codigo_interno' => 'SN-1',
    ]);

    $ps = ProdutoServico::withoutGlobalScopes()
        ->where('descricao', 'Serviço Novo')
        ->firstOrFail();

    $this->assertDatabaseHas('servicos', [
        'id_produto_servico' => $ps->id,
    ]);
});

it('cria servico com LC116 valido', function () {
    $lc116Id = ServicoLc116::query()->value('id');

    $this->postJson('/api/servicos', [
        'descricao' => 'Serviço com LC116',
        'codigo_interno' => 'SN-2',
        'id_servico_lc116' => $lc116Id,
    ])->assertCreated();

    $this->assertDatabaseHas('produtos_servicos', [
        'descricao' => 'Serviço com LC116',
        'id_empresa' => 1,
        'tipo' => 'S',
    ]);
});

it('atualiza servico e seus dados de servico', function () {
    $response = $this->postJson('/api/servicos', [
        'descricao' => 'Antes',
        'codigo_interno' => 'ANT',
    ])->assertCreated();

    $id = $response->json('id');

    $this->putJson('/api/servicos/'.$id, [
        'descricao' => 'Depois',
        'codigo_interno' => 'DEP',
    ])->assertOk();

    $this->assertDatabaseHas('produtos_servicos', [
        'id' => $id,
        'descricao' => 'Depois',
        'codigo_interno' => 'DEP',
    ]);
});

it('faz soft delete de servico', function () {
    $response = $this->postJson('/api/servicos', [
        'descricao' => 'Para excluir',
        'codigo_interno' => 'DEL',
    ])->assertCreated();

    $id = $response->json('id');

    $this->deleteJson('/api/servicos/'.$id)->assertNoContent();

    $ps = ProdutoServico::withoutGlobalScopes()->find($id);

    expect($ps)->not->toBeNull();
    expect($ps->deleted_at)->not->toBeNull();
    expect($ps->ativo)->toBeFalse();
});
