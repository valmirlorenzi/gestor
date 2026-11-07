<?php

namespace App\Importacoes;

/**
 * Contrato do motor A (cadastro). O piloto `centros_custo` e os 12 recursos
 * do 10b-9 são atendidos por uma única implementação genérica
 * (ImportadorCadastroGenerico), que lê config/importacoes.php.
 */
interface ImportadorCadastro
{
    /**
     * Recursos do config que o ator pode importar (T9.10).
     *
     * @return array<string, array> chave => metadados
     */
    public function recursosDisponiveisParaAtor(int $atorFuncionalId): array;

    /**
     * Metadados de um recurso do config.
     *
     * @return array{rotulo:string,motor:string,modos:array,tenant:string,chave_natural:array,...}
     *
     * @throws \InvalidArgumentException se o recurso não existe no config
     */
    public function recurso(string $chave): array;

    /**
     * Caminho absoluto do template CSV do recurso (para o 10b-3 servir download).
     *
     * @throws \InvalidArgumentException se o recurso não existe
     */
    public function template(string $chave): string;

    /**
     * Pré-validação em memória (T9.5). NADA é gravado.
     *
     * @throws CabecalhoInvalidoException se faltar coluna obrigatória (rejeita o arquivo inteiro)
     * @throws \InvalidArgumentException se o recurso/modo não existir
     */
    public function preValidar(string $chave, string $conteudoCsv, string $modo): RelatorioCarga;

    /**
     * Confirmação: grava em transação por linha (T9.6) e registra auditoria (T9.8).
     *
     * @throws CabecalhoInvalidoException se faltar coluna obrigatória (rejeita o arquivo inteiro)
     * @throws \InvalidArgumentException se o recurso/modo não existir
     */
    public function confirmar(string $chave, string $conteudoCsv, string $modo): RelatorioCarga;
}
