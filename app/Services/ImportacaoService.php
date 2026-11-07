<?php

namespace App\Services;

use App\Importacoes\ImportadorCadastro;
use App\Importacoes\ImportadorDocumento;
use App\Importacoes\RelatorioCarga;

/**
 * Fachada fina para a UI (10b-3) e testes. Delega ao ImportadorCadastro (motor A).
 */
final class ImportacaoService
{
    public function __construct(
        private ImportadorCadastro $cadastro,
        private ImportadorDocumento $documento,
    ) {}

    // (mantém os métodos do motor A delegando a $this->cadastro em vez de $this->importador)

    public function recursosDocumentoParaAtor(int $atorFuncionalId): array
    {
        return $this->documento->recursosDisponiveisParaAtor($atorFuncionalId);
    }

    public function preValidarDocumento(string $chave, string $conteudo, ?string $caminho = null): RelatorioCarga
    {
        return $this->documento->preValidar($chave, $conteudo, $caminho);
    }

    public function confirmarDocumento(string $chave, string $conteudo, ?string $caminho = null): RelatorioCarga
    {
        return $this->documento->confirmar($chave, $conteudo, $caminho);
    }

    /**
     * Recursos do config/importacoes.php que o ator pode importar (T9.10).
     *
     * @return array<string, array> chave => metadados
     */
    public function recursosDisponiveisParaAtor(int $atorFuncionalId): array
    {
        return $this->cadastro->recursosDisponiveisParaAtor($atorFuncionalId);
    }

    public function template(string $chave): string
    {
        return $this->cadastro->template($chave);
    }

    public function preValidar(string $chave, string $conteudoCsv, string $modo): RelatorioCarga
    {
        return $this->cadastro->preValidar($chave, $conteudoCsv, $modo);
    }

    public function confirmar(string $chave, string $conteudoCsv, string $modo): RelatorioCarga
    {
        return $this->cadastro->confirmar($chave, $conteudoCsv, $modo);
    }
}
