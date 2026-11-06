<?php

use App\Models\Periodo;
use App\Models\RazaoImposto;
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

    $this->razao = RazaoImposto::create([
        'id_filial' => 1,
        'id_periodo' => $this->periodo->id,
        'tipo_imposto' => 'ICMS',
        'natureza' => 'Debito',
        'valor' => 180.00,
    ]);
});

it('lista razões do período aberto', function () {
    $this->getJson('/api/validacao/razoes-impostos')
        ->assertOk()
        ->assertJsonCount(1)
        ->assertJsonFragment(['tipo_imposto' => 'ICMS']);
});

it('valida razão e grava auditoria', function () {
    $this->putJson('/api/validacao/razoes-impostos/'.$this->razao->id.'/validar')
        ->assertOk();

    $this->assertDatabaseHas('auditorias', [
        'tabela' => 'razoes_impostos',
        'id_registro' => $this->razao->id,
        'acao' => 'Validacao_razao',
    ]);
});

it('aplica override com justificativa e grava auditoria', function () {
    $this->putJson('/api/validacao/razoes-impostos/'.$this->razao->id.'/override', [
        'justificativa' => 'Valor conforme documento físico',
    ])->assertOk();

    $this->assertDatabaseHas('auditorias', [
        'tabela' => 'razoes_impostos',
        'id_registro' => $this->razao->id,
        'acao' => 'Override_razao',
        'justificativa' => 'Valor conforme documento físico',
    ]);
});

it('rejeita override sem justificativa', function () {
    $this->putJson('/api/validacao/razoes-impostos/'.$this->razao->id.'/override', [])
        ->assertStatus(422);
});
