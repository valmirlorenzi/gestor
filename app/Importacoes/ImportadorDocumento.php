<?php

namespace App\Importacoes;

interface ImportadorDocumento
{
    /** @return array<string, array> chave => metadados */
    public function recursosDisponiveisParaAtor(int $atorFuncionalId): array;

    /** @return array metadados do recurso */
    public function recurso(string $chave): array;

    /** Pré-validação em memória (T9.5). Nada grava. */
    public function preValidar(string $chave, string $conteudo, ?string $caminhoArquivo = null): RelatorioCarga;

    /** Confirmação: grava em transação por documento (T9.6) e audita (T9.8/P154). */
    public function confirmar(string $chave, string $conteudo, ?string $caminhoArquivo = null): RelatorioCarga;
}
