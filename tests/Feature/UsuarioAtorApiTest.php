<?php

use App\Models\AtorFuncional;
use App\Models\Usuario;
use App\Services\TenantContext;
use Database\Seeders\AtorFuncionalSeeder;
use Database\Seeders\EmpresaFilialSeeder;
use Database\Seeders\UsuarioSeeder;

beforeEach(function () {
    $this->seed(EmpresaFilialSeeder::class);
    $this->seed(AtorFuncionalSeeder::class);
    $this->seed(UsuarioSeeder::class);

    $this->admin = Usuario::withoutGlobalScopes()->where('email', 'admin@gestor.local')->firstOrFail();

    $ctx = app(TenantContext::class);
    $ctx->set(1, 1, $this->admin->id, null);

    $this->actingAs($this->admin);
});

test('sincroniza atores do usuário na filial', function () {
    $atorContador = AtorFuncional::where('codigo', 'contador')->firstOrFail();

    $this->postJson("/api/usuarios/{$this->admin->id}/atores", [
        'id_filial' => 1,
        'id_atores' => [$atorContador->id],
    ])->assertOk();

    $this->assertDatabaseHas('usuarios_atores', [
        'id_usuario' => $this->admin->id,
        'id_filial' => 1,
        'id_ator_funcional' => $atorContador->id,
        'ativo' => true,
    ]);
});

test('rejeita filial de outra empresa (P45)', function () {
    $atorContador = AtorFuncional::where('codigo', 'contador')->firstOrFail();

    $this->postJson("/api/usuarios/{$this->admin->id}/atores", [
        'id_filial' => 3, // filial da empresa 2
        'id_atores' => [$atorContador->id],
    ])->assertStatus(422)
        ->assertJsonValidationErrors(['id_filial']);
});
