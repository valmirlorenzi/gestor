<?php

namespace App\Importacoes;

use App\Repositories\GrupoF\NotaFiscalRepository;
use App\Repositories\GrupoF\PeriodoRepository;

/**
 * Valida um documento (NF-e) em memória (T9.5). Não grava.
 * Retorna LinhaCarga (aceita/aceita_com_aviso/rejeitada).
 */
final class ValidadorDocumento
{
    public function __construct(
        private NotaFiscalRepository $notas,
        private PeriodoRepository $periodos,
    ) {}

    /**
     * @param  array  $parseado  retorno do NfeParser::parse()
     * @param  array  $meta  metadados do config
     * @param  int|null  $idFilial  filial resolvida (ou null se não)
     */
    public function validar(int $numeroDocumento, array $parseado, array $meta, ?int $idFilial): LinhaCarga
    {
        $avisos = [];

        // 1) Estrutura (o parser já lança se quebrado; aqui só defesa)
        if (empty($parseado['payload']['chave']) || empty($parseado['payload']['itens'])) {
            return new LinhaCarga($numeroDocumento, LinhaCarga::REJEITADA, 'Estrutura mínima inválida.');
        }

        // 2) Cancelamento
        if ($parseado['cancelada']) {
            return new LinhaCarga(
                $numeroDocumento,
                LinhaCarga::REJEITADA,
                'NF-e cancelada'.($parseado['motivo_cancelamento'] ? ': '.$parseado['motivo_cancelamento'] : '.')
            );
        }

        // 3) Duplicidade
        if ($this->notas->porChave($parseado['payload']['chave']) !== null) {
            return new LinhaCarga($numeroDocumento, LinhaCarga::REJEITADA, 'Duplicidade: chave já importada.');
        }

        // 4) Empresa identificada (destinatário na entrada, emitente na saída)
        $cnpjEmpresa = ($meta['direcao'] ?? 'Entrada') === 'Saida'
            ? $parseado['cnpj_emitente']
            : $parseado['cnpj_destinatario'];
        if (empty($cnpjEmpresa)) {
            return new LinhaCarga($numeroDocumento, LinhaCarga::REJEITADA, 'Empresa não identificada no XML.');
        }

        // 5) Filial resolvida
        if ($idFilial === null) {
            $avisos[] = 'Filial não resolvida (CNPJ do destinatário não corresponde a uma filial da empresa). Escolha manual necessária.';
        }

        // 6) Período (só se filial resolvida)
        if ($idFilial !== null && ! empty($parseado['payload']['data_emissao'])) {
            $mesAno = substr($parseado['payload']['data_emissao'], 5, 2).'/'.substr($parseado['payload']['data_emissao'], 0, 4);
            $periodo = $this->periodos->porFilialEMesAno($idFilial, $mesAno);
            if ($periodo === null || $periodo->status !== 'Aberto') {
                $avisos[] = "Período {$mesAno} não está aberto. Confirmação necessária (T5.3).";
            }
        }

        // 7) Emitente/destinatário cadastrados (o DocumentoService resolve; o validador só sinaliza)
        //     — não temos os ids ainda; o DocumentoService marca rejeitada no confirmar.

        return empty($avisos)
            ? new LinhaCarga($numeroDocumento, LinhaCarga::ACEITA)
            : new LinhaCarga($numeroDocumento, LinhaCarga::ACEITA_COM_AVISO, null, $avisos);
    }
}
