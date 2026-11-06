<?php

use App\Http\Controllers\Api\ContaReceberApiController;
use App\Models\ContaReceber;
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

    $this->cliente = Pessoa::withoutGlobalScopes()->create([
        'id_empresa' => 1,
        'tipo' => 'PJ',
        'documento' => '98765432000188',
        'nome' => 'Cliente Teste',
        'ativo' => true,
    ]);

    $this->conta = ContaReceber::withoutGlobalScopes()->create([
        'id_filial' => 1,
        'id_pessoa' => $this->cliente->id,
        'numero_parcela' => 1,
        'total_parcelas' => 1,
        'valor' => 100.00,
        'data_emissao' => '2026-10-01',
        'data_vencimento' => '2026-10-20',
        'valor_recebido' => 0,
        'juros' => 0,
        'multa' => 0,
        'desconto' => 0,
        'status' => 'Aberta',
        'status_fluxo' => 'Aguardando recebimento',
    ]);
});

test('lista contas com kpis', function () {
    $resp = $this->getJson('/api/contas-receber');

    $resp->assertOk();
    expect($resp->json('contas'))->toBeArray()->toHaveCount(1);
    expect($resp->json('kpis.em_aberto'))->toEqual(100);
    expect($resp->json('kpis.contas_abertas'))->toBe(1);
});

test('recebe total', function () {
    $resp = $this->postJson('/api/contas-receber/'.$this->conta->id.'/receber', [
        'data_recebimento' => '2026-10-21',
        'valor_recebido' => 100.00,
    ]);

    $resp->assertOk();
    $resp->assertJsonFragment(['status' => 'Baixada']);

    $this->assertDatabaseHas('contas_receber', [
        'id' => $this->conta->id,
        'status' => 'Baixada',
        'status_fluxo' => 'Recebido',
        'valor_recebido' => 100.00,
    ]);
});

test('recebe parcial acumula', function () {
    $this->postJson('/api/contas-receber/'.$this->conta->id.'/receber', [
        'data_recebimento' => '2026-10-21',
        'valor_recebido' => 40.00,
    ])->assertOk()->assertJsonFragment(['status' => 'Parcialmente baixada']);

    $this->postJson('/api/contas-receber/'.$this->conta->id.'/receber', [
        'data_recebimento' => '2026-10-22',
        'valor_recebido' => 60.00,
    ])->assertOk()->assertJsonFragment(['status' => 'Baixada']);

    $this->assertDatabaseHas('contas_receber', [
        'id' => $this->conta->id,
        'status' => 'Baixada',
        'valor_recebido' => 100.00,
    ]);
});

test('juros e multa automáticos em conta atrasada', function () {
    $this->conta->update(['data_vencimento' => '2026-10-01']);

    $this->postJson('/api/contas-receber/'.$this->conta->id.'/receber', [
        'data_recebimento' => '2026-10-11',
        'valor_recebido' => 100.00,
    ])->assertOk();

    $conta = ContaReceber::withoutGlobalScopes()->find($this->conta->id);
    expect((float) $conta->juros)->toBeGreaterThan(0);
    expect((float) $conta->multa)->toBeGreaterThan(0);
});

test('rejeita data futura', function () {
    $resp = $this->postJson('/api/contas-receber/'.$this->conta->id.'/receber', [
        'data_recebimento' => '2099-01-01',
        'valor_recebido' => 100.00,
    ]);

    $resp->assertStatus(422);
    $resp->assertJsonValidationErrors(['data_recebimento']);
});

test('estorna baixa', function () {
    $this->postJson('/api/contas-receber/'.$this->conta->id.'/receber', [
        'data_recebimento' => '2026-10-21',
        'valor_recebido' => 100.00,
    ])->assertOk();

    $this->postJson('/api/contas-receber/'.$this->conta->id.'/estornar')
        ->assertOk()
        ->assertJsonFragment(['status' => 'Aberta', 'status_fluxo' => 'Aguardando recebimento']);

    $this->assertDatabaseHas('contas_receber', [
        'id' => $this->conta->id,
        'status' => 'Aberta',
        'valor_recebido' => 0,
    ]);
});

test('isolamento por empresa (D81)', function () {
    app(TenantContext::class)->set(2, 2, $this->usuario->id, null);

    $controller = app(ContaReceberApiController::class);
    $request = Request::create('/api/contas-receber', 'GET');
    $response = $controller->index($request);

    expect($response->getData(true)['contas'] ?? [])->toBeArray()->toHaveCount(0);
});
