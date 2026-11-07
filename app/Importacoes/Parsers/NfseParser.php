<?php

namespace App\Importacoes\Parsers;

use App\Importacoes\Parsers\Exceptions\ParseException;

/**
 * Parser NFS-e (ABRASF + fallback genérico via local-name()).
 * NFS-e não tem CFOP/NCM/CST: tem itemListaServico (LC 116),
 * codigoTributacaoMunicipio, ISS e retenções.
 *
 * Usa apenas local-name() — o xpath de SimpleXMLElement exige namespace
 * registrado no próprio nó; como o layout municipal varia, é mais robusto
 * ignorar o prefixo e casar pelo nome local.
 */
final class NfseParser
{
    /** @return array{payload:array, cancelada:bool, motivo_cancelamento:?string, cnpj_empresa:?string, cnpj_emitente:?string, cnpj_destinatario:?string} */
    public function parse(string $xml): array
    {
        $xmlLimpo = trim($xml);
        if ($xmlLimpo === '') {
            throw ParseException::estruturaInvalida('XML vazio.');
        }
        $doc = @simplexml_load_string($xmlLimpo);
        if ($doc === false) {
            throw ParseException::estruturaInvalida('XML malformado.');
        }

        // Nó raiz da NFS-e (ABRASF usa InfNfse; alguns municípios usam infNFSe).
        $inf = $this->firstNode($doc, [
            '//*[local-name()="InfNfse"]',
            '//*[local-name()="infNFSe"]',
        ]);
        if ($inf === null) {
            throw ParseException::estruturaInvalida('InfNfse/infNFSe ausente.');
        }

        $chave = $this->extrairChave($inf);
        if ($chave === '') {
            throw ParseException::estruturaInvalida('Chave ausente/inválida.');
        }

        $prest = $this->firstNode($inf, [
            './*[local-name()="Prestador"]',
            './*[local-name()="PrestadorServico"]',
        ]);
        $tom = $this->firstNode($inf, [
            './*[local-name()="Tomador"]',
            './*[local-name()="TomadorServico"]',
        ]);
        if ($prest === null || $tom === null) {
            throw ParseException::estruturaInvalida('Prestador/Tomador ausentes.');
        }

        $cnpjPrest = $this->soDigitos($this->str($prest, [
            './/*[local-name()="Cnpj"]',
            './/*[local-name()="Cpf"]',
        ]));
        $cnpjTom = $this->soDigitos($this->str($tom, [
            './/*[local-name()="Cnpj"]',
            './/*[local-name()="Cpf"]',
        ]));
        if ($cnpjPrest === '') {
            throw ParseException::estruturaInvalida('CNPJ do prestador ausente.');
        }
        if ($cnpjTom === '') {
            throw ParseException::estruturaInvalida('CNPJ do tomador ausente.');
        }

        $dhEmi = $this->str($inf, [
            './/*[local-name()="DataEmissao"]',
            './/*[local-name()="Competencia"]',
        ]);
        $dataEmissao = $this->normalizarData($dhEmi);

        $numero = $this->str($inf, ['.//*[local-name()="Numero"]']);
        $serie = $this->str($inf, ['.//*[local-name()="Serie"]']);

        // Serviço (itemListaServico = LC116, codigoTributacaoMunicipio = municipal)
        $servico = $this->firstNode($inf, ['./*[local-name()="Servico"]']);
        if ($servico === null) {
            throw ParseException::estruturaInvalida('Servico ausente.');
        }
        $itemLista = $this->str($servico, ['.//*[local-name()="ItemListaServico"]']);
        $codMun = $this->str($servico, ['.//*[local-name()="CodigoTributacaoMunicipio"]']);
        $discrim = $this->str($servico, ['.//*[local-name()="Discriminacao"]']);
        $cMunPrest = $this->str($prest, [
            './/*[local-name()="CodigoMunicipio"]',
            './/*[local-name()="cMun"]',
        ]);

        // Valores
        $valores = $this->firstNode($inf, ['./*[local-name()="Valores"]']);
        $vServico = (float) $this->str($valores, ['.//*[local-name()="ValorServicos"]']);
        $vDeducoes = (float) $this->str($valores, ['.//*[local-name()="ValorDeducoes"]']);
        $vBase = (float) $this->str($valores, ['.//*[local-name()="BaseCalculo"]']);
        if ($vBase <= 0 && $vServico > 0) {
            $vBase = $vServico - $vDeducoes;
        }
        $aliqIss = (float) $this->str($valores, [
            './/*[local-name()="Aliquota"]',
            './/*[local-name()="AliquotaServicos"]',
        ]);
        $vIss = (float) $this->str($valores, [
            './/*[local-name()="ValorIss"]',
            './/*[local-name()="ValorISS"]',
        ]);
        if ($vIss <= 0 && $vBase > 0 && $aliqIss > 0) {
            $vIss = round($vBase * $aliqIss / 100, 2);
        }

        // Retenções (INSS/IRRF/ISS/PIS/COFINS/CSLL) — cada uma vira item.*.impostos[]
        $impostos = [];
        $this->addImposto($impostos, 'ISS', $vBase, $aliqIss, $vIss);
        $this->addImposto($impostos, 'INSS', 0, 0, (float) $this->str($valores, ['.//*[local-name()="ValorInss"]']));
        $this->addImposto($impostos, 'IRRF', 0, 0, (float) $this->str($valores, ['.//*[local-name()="ValorIr"]']));
        $this->addImposto($impostos, 'PIS', 0, 0, (float) $this->str($valores, ['.//*[local-name()="ValorPis"]']));
        $this->addImposto($impostos, 'COFINS', 0, 0, (float) $this->str($valores, ['.//*[local-name()="ValorCofins"]']));
        $this->addImposto($impostos, 'CSLL', 0, 0, (float) $this->str($valores, ['.//*[local-name()="ValorCsll"]']));

        // Cancelamento (cStat 101/135/155)
        $cStat = $this->str($doc, ['.//*[local-name()="cStat"]']);
        $cancelada = in_array($cStat, ['101', '135', '155'], true);
        $motivo = $cancelada
            ? $this->str($doc, ['.//*[local-name()="xMotivo"]', './/*[local-name()="xJustificativa"]'])
            : '';

        // NFS-e é serviço: um único "item" com discriminacao + LC116 + codigo municipal + ISS/retensões
        $itens = [[
            'numero_item' => 1,
            'descricao' => $discrim !== '' ? $discrim : 'Serviço',
            'id_produto_servico' => null,
            'id_cfop' => null,           // NFS-e não tem CFOP
            'id_ncm' => null,            // NFS-e não tem NCM
            'id_servico_lc116' => null,  // resolvido no DocumentoService (nullable)
            'quantidade' => 1,
            'valor_unitario' => $vServico,
            'valor_total' => $vServico,
            'valor_desconto' => 0,
            'valor_frete' => 0,
            'valor_seguro' => 0,
            'outras_despesas' => 0,
            '_codigo_servico_lc116' => $itemLista,
            '_codigo_servico_municipal' => $codMun !== '' ? $codMun : null,
            'impostos' => $impostos,
        ]];

        $payload = [
            'id_tipo_documento' => null,
            'chave' => $chave,
            'numero' => $numero,
            'serie' => $serie,
            'data_emissao' => $dataEmissao,
            'id_pessoa_emitente' => null,
            'id_pessoa_destinatario' => null,
            'id_municipio_emissao' => null,
            'valor_produtos' => $vServico,
            'valor_desconto' => $vDeducoes,
            'valor_frete' => 0,
            'valor_total' => $vServico - $vDeducoes,
            'xml_origem' => $xml,
            '_cnpj_emitente' => $cnpjPrest,     // prestador
            '_cnpj_destinatario' => $cnpjTom,   // tomador
            '_codigo_municipio_emissao' => $cMunPrest,
            'itens' => $itens,
        ];

        return [
            'payload' => $payload,
            'cancelada' => $cancelada,
            'motivo_cancelamento' => $motivo !== '' ? $motivo : null,
            // NFS-e cobre Entrada (tomada: empresa = tomador) e Saída (prestada: empresa = prestador).
            // Quem escolhe cnpj_empresa é o ImportadorDocumentoGenerico/ValidadorDocumento via meta['direcao'].
            'cnpj_empresa' => null,
            'cnpj_emitente' => $cnpjPrest,
            'cnpj_destinatario' => $cnpjTom,
        ];
    }

    // ---- helpers ----

    private function extrairChave(\SimpleXMLElement $inf): string
    {
        // 1) atributo Id (ABRASF): "NFS..." ou só dígitos
        $idAttr = (string) ($inf['Id'] ?? '');
        $d = $this->soDigitos($idAttr);
        if (strlen($d) >= 44) {
            return substr($d, 0, 44);
        }
        // 2) elemento <Chave> explícito
        $ch = $this->str($inf, ['.//*[local-name()="Chave"]']);
        $d = $this->soDigitos($ch);
        if (strlen($d) >= 44) {
            return substr($d, 0, 44);
        }

        return '';
    }

    /** @param string[] $exprs */
    private function firstNode(\SimpleXMLElement $ctx, array $exprs): ?\SimpleXMLElement
    {
        foreach ($exprs as $expr) {
            $arr = $ctx->xpath($expr);
            if (! empty($arr)) {
                return $arr[0];
            }
        }

        return null;
    }

    /** @param string[] $exprs */
    private function str(?\SimpleXMLElement $ctx, array $exprs): string
    {
        if ($ctx === null) {
            return '';
        }
        $n = $this->firstNode($ctx, $exprs);

        return $n !== null ? trim((string) $n) : '';
    }

    /** @param array<int,array> $out */
    private function addImposto(array &$out, string $tipo, float $base, float $aliq, float $valor): void
    {
        if ($valor <= 0) {
            return;
        }
        $out[] = [
            'tipo_imposto' => $tipo,
            'id_cst' => null,
            'base_calculo' => $base,
            'aliquota' => $aliq,
            'valor' => $valor,
            'valor_st' => 0,
            '_cst_codigo' => '',
        ];
    }

    private function normalizarData(string $raw): string
    {
        if ($raw === '') {
            return '';
        }
        $ts = strtotime($raw);

        return $ts ? date('Y-m-d', $ts) : '';
    }

    private function soDigitos(string $s): string
    {
        return preg_replace('/\D/', '', $s) ?? '';
    }
}