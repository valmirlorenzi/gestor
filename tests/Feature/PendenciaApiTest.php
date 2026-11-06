<?php

use App\Models\Pendencia;
use App\Models\Periodo;
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

    $this->pendencia = Pendencia::create([
        'id_filial' => 1,
        'id_periodo' => $this->periodo->id,
        'categoria' => 'Erro',
        'tipo' => 'Nao classificado',
        'descricao' => 'Lançamento pendente',
        'status' => 'Aberta',
    ]);
});

it('lista pendências da filial', function () {
    $this->getJson('/api/pendencias')
        ->assertOk()
        ->assertJsonCount(1)
        ->assertJsonFragment(['descricao' => 'Lançamento pendente']);
});

it('resolve pendência e grava auditoria', function () {
    $this->putJson('/api/pendencias/'.$this->pendencia->id.'/resolver', [
        'justificativa' => 'Corrigido manualmente',
    ])->assertOk();

    $this->assertDatabaseHas('pendencias', [
        'id' => $this->pendencia->id,
        'status' => 'Resolvida',
        'justificativa' => 'Corrigido manualmente',
    ]);

    $this->assertDatabaseHas('auditorias', [
        'tabela' => 'pendencias',
        'id_registro' => $this->pendencia->id,
        'acao' => 'Resolucao_pendencia',
    ]);
});

it('rejeita resolução sem justificativa', function () {
    $this->putJson('/api/pendencias/'.$this->pendencia->id.'/resolver', [])
        ->assertStatus(422);
});
