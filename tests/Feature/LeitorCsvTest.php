<?php

use App\Importacoes\LeitorCsv;

test('lê UTF-8 com separador ponto e vírgula', function () {
    $lido = (new LeitorCsv)->ler("nome;responsavel\nA;B\nC;D\n");
    expect($lido['cabecalho'])->toBe(['nome', 'responsavel']);
    expect($lido['linhas'])->toHaveCount(2);
    expect($lido['linhas'][0]['valores'])->toBe(['nome' => 'A', 'responsavel' => 'B']);
    expect($lido['separador'])->toBe(';');
});

test('detecta vírgula como separador', function () {
    $lido = (new LeitorCsv)->ler("nome,responsavel\nA,B\n");
    expect($lido['separador'])->toBe(',');
    expect($lido['linhas'][0]['valores'])->toBe(['nome' => 'A', 'responsavel' => 'B']);
});

test('detecta tab como separador', function () {
    $lido = (new LeitorCsv)->ler("nome\tresponsavel\nA\tB\n");
    expect($lido['separador'])->toBe("\t");
});

test('ignora linha vazia e linha com #', function () {
    $lido = (new LeitorCsv)->ler("nome;responsavel\n# comentario\nA;B\n\nC;D\n");
    expect($lido['linhas'])->toHaveCount(2);
});

test('remove BOM UTF-8', function () {
    $lido = (new LeitorCsv)->ler("\xEF\xBB\xBFnome;responsavel\nA;B\n");
    expect($lido['cabecalho'])->toBe(['nome', 'responsavel']);
});

test('converte Windows-1252 para UTF-8', function () {
    $lido = (new LeitorCsv)->ler(mb_convert_encoding("nome;responsavel\nAção;B\n", 'Windows-1252', 'UTF-8'));
    expect($lido['linhas'][0]['valores']['nome'])->toBe('Ação');
});
