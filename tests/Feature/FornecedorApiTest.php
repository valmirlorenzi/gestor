<?php

use App\Http\Controllers\Api\FornecedorApiController;
use App\Models\Pessoa;
use App\Models\PessoaTag;
use App\Models\Usuario;
use App\Services\TenantContext;
use Database\Seeders\AtorFuncionalSeeder;
use Database\Seeders\EmpresaFilialSeeder;
use Database\Seeders\UsuarioSeeder;
use Illuminate\Http\Request;

beforeEach(function () {
    $this->seed(EmpresaFilialSeeder::class);
    $this->seed(AtorFuncionalSeeder::class);
    $this->seed(UsuarioSeeder::class);

    $this->usuario = Usuario::withoutGlobalScopes()->where('email', 'admin@gestor.local')->firstOrFail();

    app(TenantContext::class)->set(1, 1, $this->usuario->id, null);
    $this->actingAs($this->usuario);
});

function payloadFornecedorPJ(array $over = []): array
{
    return array_merge([
        'tipo' => 'PJ',
        'documento' => '12345678000199',
        'nome' => 'Fornecedor Teste LTDA',
        'email' => 'f@example.com',
        'telefone' => '11999998888',
        'categoria' => 'Insumos',
        'nome_fantasia' => 'FT',
        'prazo_padrao_dias' => 30,
    ], $over);
}

it('lista fornecedores vazio', function () {
    $this->getJson('/api/fornecedores')->assertOk()->assertJsonCount(0);
});

it('cria fornecedor PJ com filha e tag', function () {
    $this->postJson('/api/fornecedores', payloadFornecedorPJ())
        ->assertCreated()
        ->assertJsonFragment(['nome' => 'Fornecedor Teste LTDA', 'tipo' => 'PJ']);

    $this->assertDatabaseHas('pessoas', ['documento' => '12345678000199', 'tipo' => 'PJ']);
    $this->assertDatabaseHas('pessoas_juridicas', ['nome_fantasia' => 'FT']);
    $this->assertDatabaseHas('pessoas_tags', ['tag' => 'Fornecedor']);
    expect(Pessoa::withoutGlobalScopes()->where('documento', '12345678000199')->firstOrFail()->dados_extras)
        ->toBe(['categoria' => 'Insumos']);
});

it('cria fornecedor PF com data_nascimento', function () {
    $this->postJson('/api/fornecedores', [
        'tipo' => 'PF', 'documento' => '11122233344', 'nome' => 'Fulano',
        'data_nascimento' => '1990-01-01',
    ])->assertCreated()->assertJsonFragment(['tipo' => 'PF']);

    $this->assertDatabaseHas('pessoas_fisicas', ['data_nascimento' => '1990-01-01 00:00:00']);
    $this->assertDatabaseHas('pessoas_tags', ['tag' => 'Fornecedor']);
});

it('rejeita documento duplicado na mesma empresa', function () {
    $this->postJson('/api/fornecedores', payloadFornecedorPJ())->assertCreated();
    $this->postJson('/api/fornecedores', payloadFornecedorPJ(['nome' => 'Outro']))
        ->assertStatus(422)->assertJsonValidationErrors(['documento']);
});

it('mostra, atualiza e faz soft delete com deleted_by', function () {
    $id = $this->postJson('/api/fornecedores', payloadFornecedorPJ())->json('id');

    $this->getJson("/api/fornecedores/{$id}")->assertOk()->assertJsonFragment(['nome' => 'Fornecedor Teste LTDA']);

    $this->putJson("/api/fornecedores/{$id}", payloadFornecedorPJ(['nome' => 'Renomeado', 'email' => 'r@e.com']))
        ->assertOk()->assertJsonFragment(['nome' => 'Renomeado']);

    $this->deleteJson("/api/fornecedores/{$id}")->assertNoContent();

    $p = Pessoa::withoutGlobalScopes()->findOrFail($id);
    expect($p->refresh()->deleted_at)->not->toBeNull();
    expect($p->ativo)->toBeFalse();
    expect($p->deleted_by)->toBe($this->usuario->id);
    expect(PessoaTag::where('id_pessoa', $id)->where('tag', 'Fornecedor')->exists())->toBeTrue();
});

it('nao expoe cliente via endpoint de fornecedor', function () {
    $r = $this->postJson('/api/clientes', [
        'tipo' => 'PJ', 'documento' => '99999999000199', 'nome' => 'Cliente X', 'nome_fantasia' => 'CX',
    ])->assertCreated();

    $idCliente = $r->json('id');
    $this->getJson("/api/fornecedores/{$idCliente}")->assertStatus(404);
});

it('isola fornecedor por empresa (D81)', function () {
    $this->postJson('/api/fornecedores', payloadFornecedorPJ())->assertCreated();

    app(TenantContext::class)->set(2, 2, $this->usuario->id, null);

    $ctrl = app(FornecedorApiController::class);
    $req = Request::create('/api/fornecedores', 'GET');
    $resp = $ctrl->index($req);

    expect($resp->getData(true))->toBe([]);
});
