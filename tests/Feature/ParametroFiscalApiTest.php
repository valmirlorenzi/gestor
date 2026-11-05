<?php

use App\Models\ParametroFiscal;
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

it('lista parâmetros da empresa e globais', function () {
    ParametroFiscal::create([
        'id_empresa' => null,
        'tipo_imposto' => 'ICMS',
        'descricao' => 'ICMS global',
        'aliquota' => 18.0000,
        'data_inicio_validade' => '2026-01-01',
    ]);

    $this->postJson('/api/parametros-fiscais', [
        'id_empresa' => 1,
        'tipo_imposto' => 'ICMS',
        'descricao' => 'ICMS empresa 1',
        'aliquota' => 20.0000,
        'data_inicio_validade' => '2026-01-01',
    ])->assertCreated();

    $this->getJson('/api/parametros-fiscais')
        ->assertOk()
        ->assertJsonFragment(['descricao' => 'ICMS global'])
        ->assertJsonFragment(['descricao' => 'ICMS empresa 1']);
});

it('cria parâmetro com id_empresa do contexto', function () {
    $this->postJson('/api/parametros-fiscais', [
        'id_empresa' => 1,
        'tipo_imposto' => 'PIS',
        'descricao' => 'PIS empresa 1',
        'aliquota' => 0.6500,
        'data_inicio_validade' => '2026-01-01',
    ])->assertCreated();

    $this->assertDatabaseHas('parametros_fiscais', [
        'id_empresa' => 1,
        'tipo_imposto' => 'PIS',
        'descricao' => 'PIS empresa 1',
    ]);
});

it('cria parâmetro global quando id_empresa é omitido', function () {
    $this->postJson('/api/parametros-fiscais', [
        'tipo_imposto' => 'COFINS',
        'descricao' => 'COFINS global',
        'aliquota' => 3.0000,
        'data_inicio_validade' => '2026-01-01',
    ])->assertCreated();

    $this->assertDatabaseHas('parametros_fiscais', [
        'id_empresa' => null,
        'tipo_imposto' => 'COFINS',
        'descricao' => 'COFINS global',
    ]);
});

it('atualiza parâmetro', function () {
    $response = $this->postJson('/api/parametros-fiscais', [
        'id_empresa' => 1,
        'tipo_imposto' => 'ISS',
        'descricao' => 'Antes',
        'aliquota' => 5.0000,
        'data_inicio_validade' => '2026-01-01',
    ])->assertCreated();

    $id = $response->json('id');

    $this->putJson('/api/parametros-fiscais/'.$id, [
        'tipo_imposto' => 'ISS',
        'descricao' => 'Depois',
        'aliquota' => 4.5000,
        'data_inicio_validade' => '2026-01-01',
    ])->assertOk();

    $this->assertDatabaseHas('parametros_fiscais', [
        'id' => $id,
        'descricao' => 'Depois',
        'aliquota' => 4.5000,
    ]);
});
