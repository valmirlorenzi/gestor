<?php

use App\Models\Periodo;
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

    // Período aberto 11/2026 (hoje é 2026-11-05)
    $this->periodo = Periodo::create([
        'id_filial' => 1,
        'mes_ano' => '11/2026',
        'status' => 'Aberto',
    ]);

    $this->contaDebito = PlanoConta::create([
        'id_empresa' => 1, 'codigo' => '1.1.1', 'nivel' => 3,
        'descricao' => 'Caixa', 'tipo' => 'Ativo', 'natureza' => 'Analitica',
        'aceita_lancamento' => true, 'ativo' => true,
    ]);

    $this->contaCredito = PlanoConta::create([
        'id_empresa' => 1, 'codigo' => '2.1.1', 'nivel' => 3,
        'descricao' => 'Fornecedores', 'tipo' => 'Passivo', 'natureza' => 'Analitica',
        'aceita_lancamento' => true, 'ativo' => true,
    ]);
});

it('cria lançamento manual com filial e período do contexto', function () {
    $this->postJson('/api/lancamentos-manuais', [
        'data_competencia' => '2026-11-10',
        'historico' => 'Ajuste manual',
        'valor' => 100.00,
        'id_conta_debito' => $this->contaDebito->id,
        'id_conta_credito' => $this->contaCredito->id,
    ])->assertCreated();

    $this->assertDatabaseHas('lancamentos', [
        'id_filial' => 1,
        'id_periodo' => $this->periodo->id,
        'historico' => 'Ajuste manual',
        'tipo_lancamento' => 'Manual',
        'status_classificacao' => 'Classificado manualmente',
    ]);
});

it('rejeita lançamento quando período não está aberto', function () {
    $this->postJson('/api/lancamentos-manuais', [
        'data_competencia' => '2026-10-10',
        'historico' => 'Teste',
        'valor' => 50.00,
        'id_conta_debito' => $this->contaDebito->id,
        'id_conta_credito' => $this->contaCredito->id,
    ])->assertStatus(422);

    $this->assertDatabaseMissing('lancamentos', ['historico' => 'Teste']);
});
