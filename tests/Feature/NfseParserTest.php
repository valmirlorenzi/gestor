<?php

use App\Importacoes\Parsers\Exceptions\ParseException;
use App\Importacoes\Parsers\NfseParser;

function xmlNfse(string $arquivo): string
{
    return file_get_contents(base_path("tests/fixtures/importacoes/{$arquivo}"));
}

it('parseia NFS-e tomada (empresa = tomador)', function () {
    $parseado = (new NfseParser)->parse(xmlNfse('nfse_tomada/valido.xml'));

    expect($parseado['cancelada'])->toBeFalse()
        ->and($parseado['cnpj_emitente'])->toBe('12345678000199')    // prestador
        ->and($parseado['cnpj_destinatario'])->toBe('11111111111111') // tomador
        ->and($parseado['cnpj_empresa'])->toBeNull();                 // decidido pelo meta['direcao']

    $payload = $parseado['payload'];
    expect($payload['chave'])->toHaveLength(44)
        ->and($payload['valor_total'])->toEqual(1000.0)
        ->and($payload['itens'])->toHaveCount(1);

    $item = $payload['itens'][0];
    expect($item['_codigo_servico_lc116'])->toBe('07.02')
        ->and($item['_codigo_servico_municipal'])->toBe('702')
        ->and($item['id_cfop'])->toBeNull()
        ->and($item['id_ncm'])->toBeNull();

    $tipos = array_column($item['impostos'], 'tipo_imposto');
    expect($tipos)->toContain('ISS')->toContain('IRRF');

    $iss = collect($item['impostos'])->firstWhere('tipo_imposto', 'ISS');
    expect($iss['valor'])->toEqual(50.0)
        ->and($iss['base_calculo'])->toEqual(1000.0)
        ->and($iss['aliquota'])->toEqual(5.0);
});

it('parseia NFS-e prestada (empresa = prestador)', function () {
    $parseado = (new NfseParser)->parse(xmlNfse('nfse_prestada/valido.xml'));

    expect($parseado['cancelada'])->toBeFalse()
        ->and($parseado['cnpj_emitente'])->toBe('11111111111111')     // prestador (empresa)
        ->and($parseado['cnpj_destinatario'])->toBe('12345678000199'); // tomador

    expect($parseado['payload']['itens'][0]['_codigo_servico_lc116'])->toBe('01.01');
});

it('rejeita XML sem InfNfse', function () {
    (new NfseParser)->parse('<CompNfse xmlns="http://www.abrasf.org.br/nfse.xsd"></CompNfse>');
})->throws(ParseException::class);
