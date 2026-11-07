<?php

namespace App\Importacoes;

final class RelatorioCarga
{
    /**
     * @param  LinhaCarga[]  $linhas
     */
    public function __construct(
        public readonly string $recurso,
        public readonly string $modo,
        public readonly array $linhas = [],
        public readonly ?string $erroArquivo = null,
    ) {}

    public function total(): int
    {
        return count($this->linhas);
    }

    public function aceitas(): int
    {
        return count(array_filter($this->linhas, fn (LinhaCarga $l) => $l->status === LinhaCarga::ACEITA));
    }

    public function avisos(): int
    {
        return count(array_filter($this->linhas, fn (LinhaCarga $l) => $l->status === LinhaCarga::ACEITA_COM_AVISO));
    }

    public function rejeitadas(): int
    {
        return count(array_filter($this->linhas, fn (LinhaCarga $l) => $l->status === LinhaCarga::REJEITADA));
    }

    /** @return int[] */
    public function idsCriados(): array
    {
        return array_values(array_filter(
            array_map(fn (LinhaCarga $l) => $l->idRegistro, $this->linhas),
            fn (?int $id) => $id !== null,
        ));
    }

    /** Resumo para `auditorias.dados_anteriores` (P154). */
    public function toAuditoriaResumo(): array
    {
        return [
            'recurso' => $this->recurso,
            'modo' => $this->modo,
            'total' => $this->total(),
            'aceitas' => $this->aceitas(),
            'avisos' => $this->avisos(),
            'rejeitadas' => $this->rejeitadas(),
            'erro_arquivo' => $this->erroArquivo,
        ];
    }
}
