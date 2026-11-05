<?php

use App\Models\Ncm;
use App\Repositories\GrupoU\NcmRepository;

it('retorna ncms ordenados por código', function () {
    Ncm::create(['codigo' => '99999999', 'descricao' => 'Z', 'aceita_lancamento' => true, 'nivel' => 1]);
    Ncm::create(['codigo' => '11111111', 'descricao' => 'A', 'aceita_lancamento' => true, 'nivel' => 1]);

    $repo = new NcmRepository(new Ncm);
    $todos = $repo->todosOrdenadosPorCodigo();

    expect($todos->first()->codigo)->toBe('11111111');
    expect($todos->last()->codigo)->toBe('99999999');
});

it('retorna apenas id, codigo e descricao', function () {
    Ncm::create(['codigo' => '12345678', 'descricao' => 'X', 'aceita_lancamento' => true, 'nivel' => 1]);

    $repo = new NcmRepository(new Ncm);
    $atributos = $repo->todosOrdenadosPorCodigo()->first()->getAttributes();

    expect(array_keys($atributos))->toBe(['id', 'codigo', 'descricao']);
});
