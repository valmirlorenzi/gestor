<?php

namespace App\Importacoes;

final class LinhaCarga
{
    public const ACEITA = 'aceita';

    public const ACEITA_COM_AVISO = 'aceita_com_aviso';

    public const REJEITADA = 'rejeitada';

    /**
     * @param  string[]  $avisos
     */
    public function __construct(
        public readonly int $numeroLinha,
        public readonly string $status,
        public readonly ?string $motivo = null,
        public readonly array $avisos = [],
        public readonly ?int $idRegistro = null,
    ) {}

    public function isRejeitada(): bool
    {
        return $this->status === self::REJEITADA;
    }

    public function toArray(): array
    {
        return [
            'numero_linha' => $this->numeroLinha,
            'status' => $this->status,
            'motivo' => $this->motivo,
            'avisos' => $this->avisos,
            'id_registro' => $this->idRegistro,
        ];
    }
}
