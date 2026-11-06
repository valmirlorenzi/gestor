<?php

use App\Http\Controllers\Api\ContaPagarApiController;
use App\Models\ContaPagar;
use App\Models\Pessoa;
use App\Models\Usuario;
use App\Services\TenantContext;
use Database\Seeders\AtorFuncionalSeeder;
use Database\Seeders\EmpresaFilialSeeder;
use Database\Seeders\UsuarioSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Request;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed(EmpresaFilialSeeder::class);
    $this->seed(AtorFuncionalSeeder::class);
    $this->seed(UsuarioSeeder::class);

    $this->usuario = Usuario::withoutGlobalScopes()->where('email', 'admin@gestor.local')->firstOrFail();
    app(TenantContext::class)->set(1, 1, $this->usuario->id, null);
    $this->actingAs($this->usuario);

    $this->fornecedor = Pessoa::withoutGlobalScopes()->create([
        'id_empresa' => 1,
        'tipo' => 'PJ',
        'documento' => '12345678000199',
        'nome' => 'Fornecedor Teste',
        'ativo' => true,
    ]);

    $this->conta = ContaPagar::withoutGlobalScopes()->create([
        'id_filial' => 1,
        'id_pessoa' => $this->fornecedor->id,
        'numero_parcela' => 1,
        'total_parcelas' => 1,
        'valor' => 100.00,
        'data_emissao' => '2026-10-01',
        'data_vencimento' => '2026-10-20',
        'valor_pago' => 0,
        'juros' => 0,
        'multa' => 0,
        'desconto' => 0,
        'status' => 'Aberta',
        'status_fluxo' => 'Aguardando pagamento',
    ]);
});

test('lista contas com kpis', function () {
    $resp = $this->getJson('/api/contas-pagar');

    $resp->assertOk();
    expect($resp->json('contas'))->toBeArray()->toHaveCount(1);
    expect($resp->json('kpis.em_aberto'))->toEqual(100);
    expect($resp->json('kpis.contas_abertas'))->toBe(1);
});

test('baixa total', function () {
    $resp = $this->postJson('/api/contas-pagar/'.$this->conta->id.'/baixar', [
        'data_pagamento' => '2026-10-21',
        'valor_pago' => 100.00,
    ]);

    $resp->assertOk();
    $resp->assertJsonFragment(['status' => 'Baixada']);

    $this->assertDatabaseHas('contas_pagar', [
        'id' => $this->conta->id,
        'status' => 'Baixada',
        'status_fluxo' => 'Pago',
        'valor_pago' => 100.00,
    ]);
});

test('baixa parcial acumula', function () {
    $this->postJson('/api/contas-pagar/'.$this->conta->id.'/baixar', [
        'data_pagamento' => '2026-10-21',
        'valor_pago' => 40.00,
    ])->assertOk()->assertJsonFragment(['status' => 'Parcialmente baixada']);

    $this->postJson('/api/contas-pagar/'.$this->conta->id.'/baixar', [
        'data_pagamento' => '2026-10-22',
        'valor_pago' => 60.00,
    ])->assertOk()->assertJsonFragment(['status' => 'Baixada']);

    $this->assertDatabaseHas('contas_pagar', [
        'id' => $this->conta->id,
        'status' => 'Baixada',
        'valor_pago' => 100.00,
    ]);
});

test('juros e multa automáticos em conta vencida', function () {
    $this->conta->update(['data_vencimento' => '2026-10-01']);

    $resp = $this->postJson('/api/contas-pagar/'.$this->conta->id.'/baixar', [
        'data_pagamento' => '2026-10-11',
        'valor_pago' => 100.00,
    ]);

    $resp->assertOk();
    $conta = ContaPagar::withoutGlobalScopes()->find($this->conta->id);
    expect((float) $conta->juros)->toBeGreaterThan(0);
    expect((float) $conta->multa)->toBeGreaterThan(0);
});

test('rejeita data futura', function () {
    $resp = $this->postJson('/api/contas-pagar/'.$this->conta->id.'/baixar', [
        'data_pagamento' => '2099-01-01',
        'valor_pago' => 100.00,
    ]);

    $resp->assertStatus(422);
    $resp->assertJsonValidationErrors(['data_pagamento']);
});

test('estorna baixa', function () {
    $this->postJson('/api/contas-pagar/'.$this->conta->id.'/baixar', [
        'data_pagamento' => '2026-10-21',
        'valor_pago' => 100.00,
    ])->assertOk();

    $this->postJson('/api/contas-pagar/'.$this->conta->id.'/estornar')
        ->assertOk()
        ->assertJsonFragment(['status' => 'Aberta', 'status_fluxo' => 'Aguardando pagamento']);

    $this->assertDatabaseHas('contas_pagar', [
        'id' => $this->conta->id,
        'status' => 'Aberta',
        'valor_pago' => 0,
    ]);
});

test('isolamento por empresa (D81)', function () {
    app(TenantContext::class)->set(2, 2, $this->usuario->id, null);

    $controller = app(ContaPagarApiController::class);
    $request = Request::create('/api/contas-pagar', 'GET');
    $response = $controller->index($request);

    expect($response->getData(true)['contas'] ?? [])->toBeArray()->toHaveCount(0);
});
