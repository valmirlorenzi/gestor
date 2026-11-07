<?php

use App\Models\CentroCusto;
use App\Models\Usuario;
use App\Services\TenantContext;
use Database\Seeders\AtorFuncionalSeeder;
use Database\Seeders\CstSeeder;
use Database\Seeders\EmpresaFilialSeeder;
use Database\Seeders\PeriodoSeeder;
use Database\Seeders\TipoDocumentoSeeder;
use Database\Seeders\UsuarioSeeder;

beforeEach(function () {
    $this->seed(EmpresaFilialSeeder::class);
    $this->seed(PeriodoSeeder::class);
    $this->seed(AtorFuncionalSeeder::class);
    $this->seed(UsuarioSeeder::class);
    $this->seed(TipoDocumentoSeeder::class);
    $this->seed(CstSeeder::class);

    $this->usuario = Usuario::withoutGlobalScopes()
        ->where('email', 'admin@gestor.local')->firstOrFail();

    $ctx = app(TenantContext::class);
    $ctx->set(1, 1, $this->usuario->id, null);

    $this->actingAs($this->usuario);
});

test('index lista recursos do ator logado', function () {
    $this->get('/importacoes')
        ->assertOk()
        ->assertSee('Importar cadastros')
        ->assertSee('Centros de Custo')
        ->assertSee('Importar documentos');
});

test('template de centros_custo baixa', function () {
    $resp = $this->get('/api/importacoes/template/centros_custo');
    $resp->assertOk();
    expect($resp->headers->get('content-type'))->toContain('text/csv');
});

test('pre-validar centros_custo devolve relatorio', function () {
    $csv = file_get_contents(base_path('tests/fixtures/importacoes/centros_custo.csv'));

    $this->postJson('/api/importacoes/pre-validar', [
        'recurso' => 'centros_custo',
        'modo' => 'inserir',
        'conteudo' => $csv,
    ])
        ->assertOk()
        ->assertJsonPath('total', 4)
        ->assertJsonPath('aceitas', 3)
        ->assertJsonPath('rejeitadas', 1);
});

test('confirmar centros_custo cria centros', function () {
    $csv = file_get_contents(base_path('tests/fixtures/importacoes/centros_custo.csv'));

    $this->postJson('/api/importacoes/confirmar', [
        'recurso' => 'centros_custo',
        'modo' => 'inserir',
        'conteudo' => $csv,
    ])->assertOk();

    expect(CentroCusto::withoutGlobalScopes()->where('id_empresa', 1)->count())->toBe(3);
});
