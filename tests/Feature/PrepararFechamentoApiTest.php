<?php

use App\Models\Periodo;
use App\Models\Tarefa;
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
});

it('retorna checklist do período aberto', function () {
    $this->getJson('/api/preparar-fechamento')
        ->assertOk()
        ->assertJsonPath('periodo.mes_ano', '11/2026')
        ->assertJsonPath('checklist.consolidacao_feita', false);
});

it('envia consolidação ao auditor e cria tarefa O23', function () {
    $this->postJson('/api/preparar-fechamento/enviar-auditor')
        ->assertCreated();

    $this->assertDatabaseHas('tarefas', [
        'id_filial' => 1,
        'tipo_ordem' => 'O23',
        'id_documento' => $this->periodo->id,
        'tipo_documento' => 'periodo',
    ]);
});

it('não duplica envio ao auditor', function () {
    $this->postJson('/api/preparar-fechamento/enviar-auditor')->assertCreated();
    $this->postJson('/api/preparar-fechamento/enviar-auditor')->assertOk();

    expect(Tarefa::where('tipo_ordem', 'O23')->count())->toBe(1);
});
