<?php

use App\Http\Controllers\Api\NotaFiscalApiController;
use App\Models\NotaFiscal;
use App\Models\Periodo;
use App\Models\Pessoa;
use App\Models\TipoDocumento;
use App\Models\Usuario;
use App\Services\TenantContext;
use Database\Seeders\AtorFuncionalSeeder;
use Database\Seeders\EmpresaFilialSeeder;
use Database\Seeders\TipoDocumentoSeeder;
use Database\Seeders\UsuarioSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Request;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed(EmpresaFilialSeeder::class);
    $this->seed(AtorFuncionalSeeder::class);
    $this->seed(UsuarioSeeder::class);
    $this->seed(TipoDocumentoSeeder::class);

    $this->usuario = Usuario::withoutGlobalScopes()->where('email', 'admin@gestor.local')->firstOrFail();
    app(TenantContext::class)->set(1, 1, $this->usuario->id, null);
    $this->actingAs($this->usuario);

    $this->tipo = TipoDocumento::where('codigo', 'NF-e')->firstOrFail();

    $this->fornecedor = Pessoa::withoutGlobalScopes()->create([
        'id_empresa' => 1,
        'tipo' => 'PJ',
        'documento' => '11222333000144',
        'nome' => 'Fornecedor Teste',
        'ativo' => true,
    ]);

    $this->periodo = Periodo::withoutGlobalScopes()->create([
        'id_filial' => 1,
        'mes_ano' => '10/2026',
        'status' => 'Aberto',
    ]);

    $this->payload = [
        'id_tipo_documento' => $this->tipo->id,
        'numero' => '1234',
        'serie' => '1',
        'data_emissao' => '2026-10-15',
        'id_pessoa_emitente' => $this->fornecedor->id,
        'valor_produtos' => 100,
        'valor_total' => 100,
        'itens' => [
            [
                'numero_item' => 1,
                'descricao' => 'Produto X',
                'quantidade' => 1,
                'valor_unitario' => 100,
                'valor_total' => 100,
                'impostos' => [
                    ['tipo_imposto' => 'ICMS', 'base_calculo' => 100, 'aliquota' => 18, 'valor' => 18],
                ],
            ],
        ],
    ];
});

test('cria nota de entrada com itens e impostos', function () {
    $resp = $this->postJson('/api/notas-entrada', $this->payload);

    $resp->assertCreated();
    expect($resp->json('id'))->toBeInt();
    expect($resp->json('itens'))->toHaveCount(1);
    expect($resp->json('itens.0.impostos'))->toHaveCount(1);

    $this->assertDatabaseHas('notas_fiscais', [
        'id_filial' => 1,
        'id_periodo' => $this->periodo->id,
        'direcao' => 'Entrada',
        'status_importacao' => 'Importado',
        'numero' => '1234',
    ]);
    $this->assertDatabaseHas('notas_fiscais_itens', ['descricao' => 'Produto X']);
    $this->assertDatabaseHas('notas_fiscais_impostos', ['tipo_imposto' => 'ICMS', 'valor' => 18]);
});

test('rejeita chave duplicada', function () {
    $this->payload['chave'] = str_repeat('1', 44);
    $this->postJson('/api/notas-entrada', $this->payload)->assertCreated();

    $this->payload['numero'] = '9999';
    $resp = $this->postJson('/api/notas-entrada', $this->payload);

    $resp->assertStatus(422);
    $resp->assertJsonValidationErrors(['chave']);
});

test('rejeita período fechado', function () {
    $this->periodo->update(['status' => 'Fechado']);

    $resp = $this->postJson('/api/notas-entrada', $this->payload);

    $resp->assertStatus(422);
    $resp->assertJsonValidationErrors(['data_emissao']);
});

test('rejeita período inexistente', function () {
    $this->periodo->delete();

    $resp = $this->postJson('/api/notas-entrada', $this->payload);

    $resp->assertStatus(422);
    $resp->assertJsonValidationErrors(['data_emissao']);
});

test('isolamento por empresa (D81)', function () {
    $this->postJson('/api/notas-entrada', $this->payload)->assertCreated();

    app(TenantContext::class)->set(2, 2, $this->usuario->id, null);

    $controller = app(NotaFiscalApiController::class);
    $request = Request::create('/api/notas-entrada', 'GET');
    $response = $controller->index($request);

    expect($response->getData(true))->toBeArray()->toHaveCount(0);
});

test('soft delete preenche deleted_by', function () {
    $id = $this->postJson('/api/notas-entrada', $this->payload)->json('id');

    $this->deleteJson('/api/notas-entrada/'.$id)->assertNoContent();

    $nota = NotaFiscal::withoutGlobalScopes()->findOrFail($id);
    expect($nota->deleted_at)->not->toBeNull();
    expect($nota->deleted_by)->toBe($this->usuario->id);
});

test('rascunho e confirmar', function () {
    $id = $this->postJson('/api/notas-entrada/rascunho', $this->payload)->json('id');

    $nota = NotaFiscal::withoutGlobalScopes()->findOrFail($id);
    expect($nota->dados_extras['rascunho'])->toBeTrue();

    $this->postJson('/api/notas-entrada/'.$id.'/confirmar')->assertOk();

    $nota->refresh();
    expect($nota->dados_extras['rascunho'])->toBeFalse();
});
