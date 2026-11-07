<?php

namespace App\Importacoes\Parsers;

use App\Importacoes\Parsers\Exceptions\ParseException;

/**
 * Parser NF-e (XML) → payload canônico que o NotaFiscalApiController::store()
 * aceita. Sem dependência externa (simplexml + DOM nativo do PHP).
 */
final class NfeParser
{
    /**
     * @return array{payload:array, cancelada:bool, motivo_cancelamento:?string, cnpj_empresa:?string, cnpj_emitente:?string, cnpj_destinatario:?string}
     *
     * @throws ParseException
     */
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

        // NF-e declara xmlns; xpath com namespace registrado é imune a aninhamento.
        $doc->registerXPathNamespace('nfe', 'http://www.portalfiscal.inf.br/nfe');
        $infArr = $doc->xpath('//nfe:infNFe');
        $inf = $infArr[0] ?? null;
        if ($inf === null || ! isset($inf['Id'])) {
            throw ParseException::estruturaInvalida('infNFe ausente.');
        }

        $chave = (string) str_replace('NFe', '', (string) $inf['Id']);
        if (! preg_match('/^\d{44}$/', $chave)) {
            throw ParseException::estruturaInvalida('Chave de 44 dígitos inválida.');
        }

        $ide = $inf->ide;
        $emit = $inf->emit;
        $dest = $inf->dest ?? null;
        $total = $inf->total->ICMSTot ?? null;

        if ($ide === null || $emit === null) {
            throw ParseException::estruturaInvalida('ide/emit ausentes.');
        }

        // Cancelamento (cStat 101, 135, 155 — protocolo/evento)
        $cStat = $this->firstNonEmpty([
            $this->xpathString($doc, '//nfe:protNFe/nfe:infProt/nfe:cStat'),
            $this->xpathString($doc, '//nfe:retConsReciNFe/nfe:protNFe/nfe:infProt/nfe:cStat'),
        ]);
        $cancelada = in_array($cStat, ['101', '135', '155'], true);
        $motivo = $this->firstNonEmpty([
            (string) ($doc->protNFe->infProt->xMotivo ?? ''),
            (string) ($doc->retConsReciNFe->protNFe->infProt->xMotivo ?? ''),
        ]);

        $cnpjEmitente = $this->soDigitos((string) ($emit->CNPJ ?? $emit->CPF ?? ''));
        $cnpjDestinatario = $this->soDigitos((string) ($dest->CNPJ ?? $dest->CPF ?? ''));

        $dataEmissao = $this->normalizarData((string) ($ide->dhEmi ?? $ide->dEmi ?? ''));

        $itens = [];
        $det = $inf->det ?? [];
        foreach ($det as $d) {
            $prod = $d->prod;
            if ($prod === null) {
                continue;
            }
            $impostos = $this->extrairImpostos($d->imposto ?? null);

            $itens[] = [
                'numero_item' => (int) ($d['nItem'] ?? (count($itens) + 1)),
                'descricao' => (string) ($prod->xProd ?? ''),
                'id_produto_servico' => null, // 10b-9 resolve via código interno
                'id_cfop' => null,            // resolvido pelo DocumentoService
                'id_ncm' => null,             // resolvido pelo DocumentoService
                'id_servico_lc116' => null,   // NF-e não tem LC116
                'quantidade' => (float) ($prod->qCom ?? 0),
                'valor_unitario' => (float) ($prod->vUnCom ?? 0),
                'valor_total' => (float) ($prod->vProd ?? 0),
                'valor_desconto' => (float) ($prod->vDesc ?? 0),
                'valor_frete' => (float) ($prod->vFrete ?? 0),
                'valor_seguro' => (float) ($prod->vSeg ?? 0),
                'outras_despesas' => (float) ($prod->vOutro ?? 0),
                '_codigo_cfop' => (string) ($prod->CFOP ?? ''),
                '_codigo_ncm' => (string) ($prod->NCM ?? ''),
                'impostos' => $impostos,
            ];
        }

        if (empty($itens)) {
            throw ParseException::estruturaInvalida('Sem itens.');
        }

        $payload = [
            'id_tipo_documento' => null, // resolvido no DocumentoService
            'chave' => $chave,
            'numero' => (string) ($ide->nNF ?? ''),
            'serie' => (string) ($ide->serie ?? ''),
            'data_emissao' => $dataEmissao,
            'id_pessoa_emitente' => null,     // resolvido no DocumentoService
            'id_pessoa_destinatario' => null, // resolvido no DocumentoService
            'id_municipio_emissao' => null,   // resolvido no DocumentoService
            'valor_produtos' => (float) ($total->vProd ?? 0),
            'valor_desconto' => (float) ($total->vDesc ?? 0),
            'valor_frete' => (float) ($total->vFrete ?? 0),
            'valor_total' => (float) ($total->vNF ?? 0),
            'xml_origem' => $xml,
            '_cnpj_emitente' => $cnpjEmitente,
            '_cnpj_destinatario' => $cnpjDestinatario,
            '_codigo_municipio_emissao' => (string) ($emit->enderEmit->cMun ?? ''),
            'itens' => $itens,
        ];

        // Decide qual lado é a empresa (emitente ou destinatário) — o motor B
        // sempre trata NF-e de ENTRADA, então a empresa é o DESTINATÁRIO.
        // Se nenhum dos dois for filial, o ValidadorDocumento marca aviso.
        return [
            'payload' => $payload,
            'cancelada' => $cancelada,
            'motivo_cancelamento' => $motivo !== '' ? $motivo : null,
            'cnpj_empresa' => $cnpjDestinatario,
            'cnpj_emitente' => $cnpjEmitente,
            'cnpj_destinatario' => $cnpjDestinatario,
        ];
    }

    /** @return array<int,array> */
    private function extrairImpostos(?\SimpleXMLElement $imp): array
    {
        if ($imp === null) {
            return [];
        }
        $out = [];

        if (isset($imp->ICMS)) {
            foreach ($imp->ICMS->children() as $grupo) {
                $out[] = $this->imposto('ICMS', $grupo);
                break;
            }
        }
        if (isset($imp->IPI->IPITrib)) {
            $out[] = $this->imposto('IPI', $imp->IPI->IPITrib);
        }
        if (isset($imp->PIS->PISAliq)) {
            $out[] = $this->imposto('PIS', $imp->PIS->PISAliq);
        }
        if (isset($imp->COFINS->COFINSAliq)) {
            $out[] = $this->imposto('COFINS', $imp->COFINS->COFINSAliq);
        }
        if (isset($imp->IBSCBS)) {
            $out[] = $this->imposto('IBS', $imp->IBSCBS->gIBSCBS ?? null);
        }

        return $out;
    }

    private function imposto(string $tipo, ?\SimpleXMLElement $g): array
    {
        $base = (float) ($g->vBC ?? 0);
        $aliq = (float) ($g->pICMS ?? $g->pIPI ?? $g->pPIS ?? $g->pCOFINS ?? $g->pIBS ?? 0);
        $valor = (float) ($g->vICMS ?? $g->vIPI ?? $g->vPIS ?? $g->vCOFINS ?? $g->vIBS ?? 0);
        $st = (float) ($g->vICMSST ?? 0);
        $cst = (string) ($g->CST ?? $g->CSOSN ?? '');

        return [
            'tipo_imposto' => $tipo,
            'id_cst' => null,       // resolvido no DocumentoService
            'base_calculo' => $base,
            'aliquota' => $aliq,
            'valor' => $valor,
            'valor_st' => $st,
            '_cst_codigo' => $cst,
        ];
    }

    private function normalizarData(string $raw): string
    {
        if ($raw === '') {
            return '';
        }
        // dhEmi vem ISO8601 (com timezone); dEmi vem YYYY-MM-DD
        $ts = strtotime($raw);

        return $ts ? date('Y-m-d', $ts) : '';
    }

    private function soDigitos(string $s): string
    {
        return preg_replace('/\D/', '', $s) ?? '';
    }

    /**
     * Helper: primeira ocorrência de uma expressão XPath como string,
     * ou '' se não achar. Usa o namespace 'nfe' já registrado no parse().
     */
    private function xpathString(\SimpleXMLElement $doc, string $expr): string
    {
        $arr = $doc->xpath($expr);

        return isset($arr[0]) ? (string) $arr[0] : '';
    }

    /** @param string[] $vals */
    private function firstNonEmpty(array $vals): string
    {
        foreach ($vals as $v) {
            if (trim($v) !== '') {
                return $v;
            }
        }

        return '';
    }
}
