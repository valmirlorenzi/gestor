<?php

namespace App\Importacoes\Parsers\Exceptions;

use RuntimeException;

final class ParseException extends RuntimeException
{
    public static function estruturaInvalida(string $motivo): self
    {
        return new self("Estrutura inválida: {$motivo}");
    }
}
