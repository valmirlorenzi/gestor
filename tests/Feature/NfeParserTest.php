<?php

use App\Importacoes\Parsers\Exceptions\ParseException;
use App\Importacoes\Parsers\NfeParser;

test('parse devolve payload canônico de uma NF-e válida', function () {
    $xml = file_get_contents(base_path('tests/fixtures/importacoes/nfe_entrada/valido.xml'));
    $p = (new NfeParser)->parse($xml);

    expect($p['cancelada'])->toBeFalse();
    expect($p['payload']['chave'])->toBe('35240612345678000199550010000000011000000010');
    expect($p['payload']['numero'])->toBe('1');
    expect($p['payload']['data_emissao'])->toBe('2026-11-01');
    expect($p['cnpj_emitente'])->toBe('12345678000199');
    expect($p['cnpj_destinatario'])->toBe('11111111111111');
    expect($p['payload']['itens'])->toHaveCount(1);
    expect($p['payload']['itens'][0]['descricao'])->toBe('Produto Teste');
    expect($p['payload']['itens'][0]['_codigo_cfop'])->toBe('1102');
    expect($p['payload']['itens'][0]['_codigo_ncm'])->toBe('12345678');
    expect($p['payload']['xml_origem'])->toBe($xml);
});

test('parse detecta cancelamento (cStat=101)', function () {
    $xml = file_get_contents(base_path('tests/fixtures/importacoes/nfe_entrada/cancelada.xml'));
    $p = (new NfeParser)->parse($xml);
    expect($p['cancelada'])->toBeTrue();
    expect($p['motivo_cancelamento'])->toContain('Cancel');
});

test('parse lança ParseException em XML malformado', function () {
    $this->expectException(ParseException::class);
    (new NfeParser)->parse('<nfeProc><quebrado');
});

test('parse lança ParseException em estrutura inválida', function () {
    $xml = file_get_contents(base_path('tests/fixtures/importacoes/nfe_entrada/estrutura_invalida.xml'));
    $this->expectException(ParseException::class);
    (new NfeParser)->parse($xml);
});
