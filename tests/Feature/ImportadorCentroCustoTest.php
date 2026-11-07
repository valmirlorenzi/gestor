<?php

use App\Importacoes\ImportadorCadastroGenerico;
use App\Models\Usuario;
use App\Services\ImportacaoService;
use App\Services\TenantContext;
use Database\Seeders\AtorFuncionalSeeder;
use Database\Seeders\EmpresaFilialSeeder;
use Database\Seeders\UsuarioSeeder;

beforeEach(function () {
    $this->seed(EmpresaFilialSeeder::class);
    $this->seed(AtorFuncionalSeeder::class);
    $this->seed(UsuarioSeeder::class);

    $this->usuario = Usuario::withoutGlobalScopes()
        ->where('email', 'admin@gestor.local')->firstOrFail();
    app(TenantContext::class)->set(1, 1, $this->usuario->id, null);

    $this->service = app(ImportacaoService::class);
});

test('metadados do piloto centros_custo batem com o config', function () {
    $meta = app(ImportadorCadastroGenerico::class)->recurso('centros_custo');
    expect($meta['rotulo'])->toBe('Centros de Custo');
    expect($meta['motor'])->toBe('cadastro');
    expect($meta['tenant'])->toBe('empresa');
    expect($meta['chave_natural'])->toBe(['nome']);
    expect($meta['colunas_obrigatorias'])->toBe(['nome']);
    expect($meta['colunas_opcionais'])->toBe(['responsavel', 'ativo']);
    expect($meta['modos'])->toBe(['inserir', 'atualizar', 'upsert']);
});

test('template do piloto existe e tem cabeçalho correto', function () {
    $path = $this->service->template('centros_custo');
    expect(is_file($path))->toBeTrue();
    $cabecalho = strtok(file_get_contents($path), "\r\n");
    expect($cabecalho)->toBe('nome;responsavel;ativo');
});
