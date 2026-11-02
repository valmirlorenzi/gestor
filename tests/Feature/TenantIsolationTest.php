<?php

use App\Models\Empresa;
use App\Models\Filial;
use App\Services\TenantContext;

beforeEach(function () {
    $this->context = app(TenantContext::class);
    $this->context->clear();
});

test('isolamento: empresa A nao ve filiais da empresa B', function () {
    $empresaA = Empresa::factory()->create();
    $empresaB = Empresa::factory()->create();

    $filialA = Filial::factory()->create(['id_empresa' => $empresaA->id]);
    $filialB = Filial::factory()->create(['id_empresa' => $empresaB->id]);

    $this->context->setId($empresaA->id);
    $visiveis = Filial::all();

    expect($visiveis)->toHaveCount(1);
    expect($visiveis->first()->id)->toBe($filialA->id);

    $this->context->setId($empresaB->id);
    $visiveis = Filial::all();

    expect($visiveis)->toHaveCount(1);
    expect($visiveis->first()->id)->toBe($filialB->id);
});

test('isolamento: sem contexto, nenhuma filial e visivel', function () {
    Empresa::factory()->create();
    Filial::factory()->create();

    $this->context->setId(null);

    expect(Filial::all())->toHaveCount(0);
});

test('isolamento: criar filial sem contexto falha', function () {
    $empresa = Empresa::factory()->create();
    $this->context->setId(null);

    expect(fn () => Filial::factory()->create(['id_empresa' => $empresa->id]))
        ->toThrow(\Illuminate\Database\QueryException::class);
});