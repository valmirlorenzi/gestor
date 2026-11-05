<?php

use App\Models\ServicoLc116;
use App\Repositories\GrupoU\ServicoLc116Repository;

it('retorna servicos lc116 ordenados por código', function () {
    ServicoLc116::create(['codigo' => '99.99', 'descricao' => 'Z']);
    ServicoLc116::create(['codigo' => '01.01', 'descricao' => 'A']);

    $repo = new ServicoLc116Repository(new ServicoLc116);
    $todos = $repo->todosOrdenadosPorCodigo();

    expect($todos->first()->codigo)->toBe('01.01');
    expect($todos->last()->codigo)->toBe('99.99');
});

it('retorna apenas id, codigo e descricao', function () {
    ServicoLc116::create(['codigo' => '10.02', 'descricao' => 'X']);

    $repo = new ServicoLc116Repository(new ServicoLc116);
    $atributos = $repo->todosOrdenadosPorCodigo()->first()->getAttributes();

    expect(array_keys($atributos))->toBe(['id', 'codigo', 'descricao']);
});
