<?php

use App\Models\Produto;
use App\Models\ProdutoServico;
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

it('lista produtos da empresa do contexto', function () {
    $this->getJson('/api/produtos')->assertOk();

    $this->postJson('/api/produtos', [
        'descricao' => 'Produto A',
        'codigo_interno' => 'P-A',
        'unidade' => 'UN',
    ])->assertCreated();

    $this->postJson('/api/produtos', [
        'descricao' => 'Produto B',
        'codigo_interno' => 'P-B',
        'unidade' => 'KG',
    ])->assertCreated();

    $response = $this->getJson('/api/produtos');

    $response->assertOk()
        ->assertJsonCount(2)
        ->assertJsonFragment(['descricao' => 'Produto A'])
        ->assertJsonFragment(['descricao' => 'Produto B']);
});

it('cria produto com id_empresa do contexto', function () {
    $response = $this->postJson('/api/produtos', [
        'descricao' => 'Produto Novo',
        'codigo_interno' => 'PN-1',
        'unidade' => 'UN',
    ]);

    $response->assertCreated();

    $this->assertDatabaseHas('produtos_servicos', [
        'id_empresa' => 1,
        'tipo' => 'P',
        'descricao' => 'Produto Novo',
        'codigo_interno' => 'PN-1',
    ]);

    $produtoServico = ProdutoServico::withoutGlobalScopes()
        ->where('descricao', 'Produto Novo')
        ->firstOrFail();

    $this->assertDatabaseHas('produtos', [
        'id_produto_servico' => $produtoServico->id,
        'unidade' => 'UN',
    ]);
});

it('cria produto com NCM válido', function () {
    $this->postJson('/api/produtos', [
        'descricao' => 'Produto com NCM',
        'codigo_interno' => 'PN-2',
        'unidade' => 'UN',
        'id_ncm' => null,
    ])->assertCreated();

    $this->assertDatabaseHas('produtos_servicos', [
        'descricao' => 'Produto com NCM',
        'id_empresa' => 1,
    ]);
});

it('atualiza produto e seus dados de produto', function () {
    $response = $this->postJson('/api/produtos', [
        'descricao' => 'Antes',
        'codigo_interno' => 'ANT',
        'unidade' => 'UN',
    ])->assertCreated();

    $id = $response->json('id');

    $this->putJson('/api/produtos/' . $id, [
        'descricao' => 'Depois',
        'codigo_interno' => 'DEP',
        'unidade' => 'CX',
    ])->assertOk();

    $this->assertDatabaseHas('produtos_servicos', [
        'id' => $id,
        'descricao' => 'Depois',
        'codigo_interno' => 'DEP',
    ]);

    $this->assertDatabaseHas('produtos', [
        'id_produto_servico' => $id,
        'unidade' => 'CX',
    ]);
});

it('faz soft delete de produto', function () {
    $response = $this->postJson('/api/produtos', [
        'descricao' => 'Para excluir',
        'codigo_interno' => 'DEL',
        'unidade' => 'UN',
    ])->assertCreated();

    $id = $response->json('id');

    $this->deleteJson('/api/produtos/' . $id)->assertNoContent();

    $produtoServico = ProdutoServico::withoutGlobalScopes()->find($id);

    expect($produtoServico)->not->toBeNull();
    expect($produtoServico->deleted_at)->not->toBeNull();
    expect($produtoServico->ativo)->toBeFalse();
});

it('não vê produtos de outra empresa', function () {
    // Cria produto na empresa 1 (contexto do beforeEach)
    $this->postJson('/api/produtos', [
        'descricao' => 'Produto Empresa 1',
        'codigo_interno' => 'E1',
        'unidade' => 'UN',
    ])->assertCreated();

    // Muda o contexto pra empresa 2 (direto no singleton)
    app(TenantContext::class)->set(2, 2, $this->usuario->id, null);

    // Chama o controller direto (sem middleware, que resetaria o contexto)
    $controller = new \App\Http\Controllers\Api\ProdutoApiController();
    $request = \Illuminate\Http\Request::create('/api/produtos', 'GET');
    $response = $controller->index($request);

    $data = $response->getData(true);
    $descricoes = array_column($data, 'descricao');

    expect($descricoes)->not->toContain('Produto Empresa 1');
});