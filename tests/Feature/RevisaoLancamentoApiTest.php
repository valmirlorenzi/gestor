<?php

use App\Models\Lancamento;
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

    $this->periodo = Periodo::create([
        'id_filial' => 1, 'mes_ano' => '11/2026', 'status' => 'Aberto',
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

    $this->lancamento = Lancamento::create([
        'id_filial' => 1,
        'id_periodo' => $this->periodo->id,
        'data_competencia' => '2026-11-10',
        'historico' => 'Compra',
        'valor' => 500.00,
        'id_conta_debito' => $this->contaCredito->id,
        'id_conta_credito' => $this->contaDebito->id,
        'tipo_lancamento' => 'NotaFiscal',
        'status_classificacao' => 'Nao classificado',
    ]);
});

it('lista lançamentos para revisão (status revisáveis)', function () {
    $this->getJson('/api/revisao-lancamentos')
        ->assertOk()
        ->assertJsonFragment(['historico' => 'Compra']);
});

it('reclassifica lançamento e grava auditoria', function () {
    $this->putJson('/api/revisao-lancamentos/'.$this->lancamento->id.'/reclassificar', [
        'id_conta_debito' => $this->contaDebito->id,
        'id_conta_credito' => $this->contaCredito->id,
        'justificativa' => 'Correção manual',
    ])->assertOk();

    $this->assertDatabaseHas('lancamentos', [
        'id' => $this->lancamento->id,
        'status_classificacao' => 'Classificado manualmente',
    ]);

    $this->assertDatabaseHas('auditorias', [
        'tabela' => 'lancamentos',
        'id_registro' => $this->lancamento->id,
        'acao' => 'Reclassificacao',
    ]);
});

it('rejeita reclassificação sem justificativa', function () {
    $this->putJson('/api/revisao-lancamentos/'.$this->lancamento->id.'/reclassificar', [
        'id_conta_debito' => $this->contaDebito->id,
        'id_conta_credito' => $this->contaCredito->id,
    ])->assertStatus(422);
});

it('valida lançamento sem alterar contas', function () {
    $idContaDebitoOriginal = $this->lancamento->id_conta_debito;

    $this->putJson('/api/revisao-lancamentos/'.$this->lancamento->id.'/validar')
        ->assertOk();

    $this->assertDatabaseHas('lancamentos', [
        'id' => $this->lancamento->id,
        'id_conta_debito' => $idContaDebitoOriginal,
        'status_classificacao' => 'Classificado manualmente',
    ]);
});
