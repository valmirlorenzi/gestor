<?php

use App\Models\Pendencia;
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

it('lista períodos abertos da filial', function () {
    $this->getJson('/api/fechar-periodo')
        ->assertOk()
        ->assertJsonCount(1)
        ->assertJsonFragment(['mes_ano' => '11/2026']);
});

it('rejeita fechamento com pendência de erro aberta', function () {
    Pendencia::create([
        'id_filial' => 1,
        'id_periodo' => $this->periodo->id,
        'categoria' => 'Erro',
        'tipo' => 'Nao classificado',
        'descricao' => 'Pendente',
        'status' => 'Aberta',
    ]);

    $this->putJson('/api/fechar-periodo/'.$this->periodo->id)
        ->assertStatus(422);
});

it('rejeita fechamento sem consolidação enviada', function () {
    $this->putJson('/api/fechar-periodo/'.$this->periodo->id)
        ->assertStatus(422);
});

it('fecha período quando pendências e consolidação estão ok', function () {
    Tarefa::create([
        'id_filial' => 1,
        'tipo_ordem' => 'O23',
        'id_documento' => $this->periodo->id,
        'tipo_documento' => 'periodo',
        'id_ator_origem' => 1,
        'id_ator_destino' => 1,
        'status' => 'pendente',
        'urgente' => false,
        'prioridade' => 2,
        'data_criacao' => now(),
    ]);

    $this->putJson('/api/fechar-periodo/'.$this->periodo->id)->assertOk();

    $this->assertDatabaseHas('periodos', [
        'id' => $this->periodo->id,
        'status' => 'Fechado',
        'id_usuario_fechamento' => $this->usuario->id,
    ]);
});
