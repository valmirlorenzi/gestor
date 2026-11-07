<?php

use App\Importacoes\LinhaCarga;
use App\Importacoes\ValidadorLinha;
use App\Models\CentroCusto;
use App\Models\Usuario;
use App\Repositories\GrupoA\CentroCustoRepository;
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

    $this->repo = app(CentroCustoRepository::class);
    $this->meta = config('importacoes')['centros_custo'];
    $this->validador = new ValidadorLinha;
});

test('rejeita linha sem campo obrigatório', function () {
    $l = $this->validador->validar(1, ['nome' => '', 'responsavel' => 'X'], $this->meta, 'inserir', $this->repo, 1);
    expect($l->status)->toBe(LinhaCarga::REJEITADA);
    expect($l->motivo)->toContain('obrigatório');
});

test('aceita linha válida (modo inserir, registro novo)', function () {
    $l = $this->validador->validar(1, ['nome' => 'Novo', 'responsavel' => 'X', 'ativo' => '1'], $this->meta, 'inserir', $this->repo, 1);
    expect($l->status)->toBe(LinhaCarga::ACEITA);
});

test('rejeita em inserir quando já existe', function () {
    CentroCusto::create(['id_empresa' => 1, 'nome' => 'Já Existe', 'ativo' => true]);
    $l = $this->validador->validar(1, ['nome' => 'Já Existe'], $this->meta, 'inserir', $this->repo, 1);
    expect($l->status)->toBe(LinhaCarga::REJEITADA);
    expect($l->motivo)->toContain('já existe');
});

test('rejeita em atualizar quando não existe', function () {
    $l = $this->validador->validar(1, ['nome' => 'Não Existe'], $this->meta, 'atualizar', $this->repo, 1);
    expect($l->status)->toBe(LinhaCarga::REJEITADA);
    expect($l->motivo)->toContain('não existe');
});

test('aceita em upsert (registro novo)', function () {
    $l = $this->validador->validar(1, ['nome' => 'Novo'], $this->meta, 'upsert', $this->repo, 1);
    expect($l->status)->toBe(LinhaCarga::ACEITA);
});

test('aviso para coluna extra (não rejeita)', function () {
    $l = $this->validador->validar(1, ['nome' => 'X', 'coluna_estranha' => 'Y'], $this->meta, 'inserir', $this->repo, 1);
    expect($l->status)->toBe(LinhaCarga::ACEITA_COM_AVISO);
    expect($l->avisos)->toHaveCount(1);
});
