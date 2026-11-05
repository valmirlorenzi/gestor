<?php

use App\Models\Auditoria;
use App\Models\ConfiguracaoHandoff;
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

it('show retorna default quando não há configuração', function () {
    $this->getJson('/api/osi')
        ->assertOk()
        ->assertJsonFragment(['config' => null])
        ->assertJsonFragment(['historico' => []]);
});

it('update cria configuração e registra auditoria', function () {
    $this->putJson('/api/osi', [
        'handoff_ativo' => true,
        'justificativa' => 'Ativando handoff para o novo setor',
    ])->assertOk();

    $config = ConfiguracaoHandoff::withoutGlobalScopes()->firstOrFail();

    expect($config->id_empresa)->toBe(1);
    expect($config->handoff_ativo)->toBeTrue();

    expect(Auditoria::query()->where('tabela', 'configuracoes_handoff')
        ->where('id_registro', $config->id)
        ->count()
    )->toBe(1);
});

it('update atualiza configuração existente e registra nova auditoria', function () {
    // Primeira alteração: ativa
    $this->putJson('/api/osi', [
        'handoff_ativo' => true,
        'justificativa' => 'Ativando',
    ])->assertOk();

    // Segunda alteração: desativa
    $this->putJson('/api/osi', [
        'handoff_ativo' => false,
        'justificativa' => 'Desativando',
    ])->assertOk();

    $config = ConfiguracaoHandoff::withoutGlobalScopes()->firstOrFail();

    expect($config->handoff_ativo)->toBeFalse();

    expect(Auditoria::query()->where('tabela', 'configuracoes_handoff')
        ->where('id_registro', $config->id)
        ->count()
    )->toBe(2);
});
