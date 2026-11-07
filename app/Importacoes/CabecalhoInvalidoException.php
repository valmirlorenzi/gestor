<?php

namespace App\Importacoes;

use RuntimeException;

final class CabecalhoInvalidoException extends RuntimeException
{
    /** @param string[] $faltando */
    public static function faltandoColunas(array $faltando): self
    {
        return new self('Cabeçalho inválido. Colunas obrigatórias ausentes: '.implode(', ', $faltando));
    }
}
