<?php

use App\Models\PlanoConta;
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

it('lista contas analíticas com status derivado', function () {
    PlanoConta::create([
        'id_empresa' => 1, 'codigo' => '1.1.1', 'nivel' => 3,
        'descricao' => 'Caixa', 'tipo' => 'Ativo', 'natureza' => 'Analitica',
        'aceita_lancamento' => true, 'ativo' => true,
        'conta_referencial' => '1.01.01',
    ]);
    PlanoConta::create([
        'id_empresa' => 1, 'codigo' => '1.1.2', 'nivel' => 3,
        'descricao' => 'Bancos', 'tipo' => 'Ativo', 'natureza' => 'Analitica',
        'aceita_lancamento' => true, 'ativo' => true,
    ]);

    $this->getJson('/api/config-contabeis')
        ->assertOk()
        ->assertJsonFragment(['conta_referencial' => '1.01.01', 'status' => 'ok'])
        ->assertJsonFragment(['conta_referencial' => null, 'status' => 'pendente']);
});

it('atualiza conta referencial de uma conta', function () {
    $conta = PlanoConta::create([
        'id_empresa' => 1, 'codigo' => '1.1.1', 'nivel' => 3,
        'descricao' => 'Caixa', 'tipo' => 'Ativo', 'natureza' => 'Analitica',
        'aceita_lancamento' => true, 'ativo' => true,
    ]);

    $this->putJson('/api/config-contabeis/'.$conta->id, [
        'conta_referencial' => '1.01.01',
    ])->assertOk();

    $this->assertDatabaseHas('planos_contas', [
        'id' => $conta->id,
        'conta_referencial' => '1.01.01',
    ]);
});
