<?php

use App\Http\Controllers\Api\ClienteApiController;
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

function payloadClientePJ(array $over = []): array
{
    return array_merge([
        'tipo' => 'PJ',
        'documento' => '55555555000199',
        'nome' => 'Cliente Teste LTDA',
        'email' => 'c@example.com',
        'telefone' => '11888887777',
        'categoria' => 'Varejo',
        'nome_fantasia' => 'CT',
        'prazo_padrao_dias' => 15,
    ], $over);
}

it('lista clientes vazio', function () {
    $this->getJson('/api/clientes')->assertOk()->assertJsonCount(0);
});

it('cria cliente PJ com filha e tag', function () {
    $this->postJson('/api/clientes', payloadClientePJ())
        ->assertCreated()
        ->assertJsonFragment(['nome' => 'Cliente Teste LTDA', 'tipo' => 'PJ']);

    $this->assertDatabaseHas('pessoas', ['documento' => '55555555000199', 'tipo' => 'PJ']);
    $this->assertDatabaseHas('pessoas_juridicas', ['nome_fantasia' => 'CT']);
    $this->assertDatabaseHas('pessoas_tags', ['tag' => 'Cliente']);
    expect(Pessoa::withoutGlobalScopes()->where('documento', '55555555000199')->firstOrFail()->dados_extras)
        ->toBe(['categoria' => 'Varejo']);
});

it('cria cliente PF com data_nascimento', function () {
    $this->postJson('/api/clientes', [
        'tipo' => 'PF', 'documento' => '22233344455', 'nome' => 'Beltrano',
        'data_nascimento' => '1985-05-05',
    ])->assertCreated()->assertJsonFragment(['tipo' => 'PF']);
    $this->assertDatabaseHas('pessoas_fisicas', ['data_nascimento' => '1985-05-05 00:00:00']);
    $this->assertDatabaseHas('pessoas_tags', ['tag' => 'Cliente']);
});

it('rejeita documento duplicado na mesma empresa', function () {
    $this->postJson('/api/clientes', payloadClientePJ())->assertCreated();
    $this->postJson('/api/clientes', payloadClientePJ(['nome' => 'Outro']))
        ->assertStatus(422)->assertJsonValidationErrors(['documento']);
});

it('mostra, atualiza e faz soft delete com deleted_by', function () {
    $id = $this->postJson('/api/clientes', payloadClientePJ())->json('id');

    $this->getJson("/api/clientes/{$id}")->assertOk()->assertJsonFragment(['nome' => 'Cliente Teste LTDA']);

    $this->putJson("/api/clientes/{$id}", payloadClientePJ(['nome' => 'Renomeado', 'email' => 'r@e.com']))
        ->assertOk()->assertJsonFragment(['nome' => 'Renomeado']);

    $this->deleteJson("/api/clientes/{$id}")->assertNoContent();

    $p = Pessoa::withoutGlobalScopes()->findOrFail($id);
    expect($p->refresh()->deleted_at)->not->toBeNull();
    expect($p->ativo)->toBeFalse();
    expect($p->deleted_by)->toBe($this->usuario->id);
    expect(PessoaTag::where('id_pessoa', $id)->where('tag', 'Cliente')->exists())->toBeTrue();
});

it('nao expoe fornecedor via endpoint de cliente', function () {
    $r = $this->postJson('/api/fornecedores', [
        'tipo' => 'PJ', 'documento' => '77777777000199', 'nome' => 'Fornecedor X', 'nome_fantasia' => 'FX',
    ])->assertCreated();

    $idFornecedor = $r->json('id');
    $this->getJson("/api/clientes/{$idFornecedor}")->assertStatus(404);
});

it('isola cliente por empresa (D81)', function () {
    $this->postJson('/api/clientes', payloadClientePJ())->assertCreated();

    app(TenantContext::class)->set(2, 2, $this->usuario->id, null);

    $ctrl = app(ClienteApiController::class);
    $req = Request::create('/api/clientes', 'GET');
    $resp = $ctrl->index($req);

    expect($resp->getData(true))->toBe([]);
});
