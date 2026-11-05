<?php

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

it('retorna a empresa do contexto', function () {
    $this->getJson('/api/config-fiscais')
        ->assertOk()
        ->assertJsonFragment(['id' => 1]);
});

it('atualiza regime fiscal, setor e método de custo', function () {
    $this->putJson('/api/config-fiscais', [
        'regime_fiscal' => 'Real',
        'setor' => 'Misto',
        'metodo_custo' => 'Medio',
    ])->assertOk();

    $this->assertDatabaseHas('empresas', [
        'id' => 1,
        'regime_fiscal' => 'Real',
        'setor' => 'Misto',
        'metodo_custo' => 'Medio',
    ]);
});
