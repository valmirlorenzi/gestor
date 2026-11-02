<?php

namespace App\Services;

class TenantContext
{
    private ?int $empresaId = null;
    private ?int $filialId = null;
    private ?int $usuarioId = null;
    private ?int $atorFuncionalId = null;

    public function set(
        ?int $empresaId,
        ?int $filialId = null,
        ?int $usuarioId = null,
        ?int $atorFuncionalId = null,
    ): void {
        $this->empresaId = $empresaId;
        $this->filialId = $filialId;
        $this->usuarioId = $usuarioId;
        $this->atorFuncionalId = $atorFuncionalId;
    }

    public function setId(?int $empresaId): void
    {
        // Mantido por compatibilidade com os testes e o SetTenantContextDev.
        $this->empresaId = $empresaId;
    }

    public function getId(): ?int
    {
        return $this->empresaId;
    }

    public function getFilialId(): ?int
    {
        return $this->filialId;
    }

    public function getUsuarioId(): ?int
    {
        return $this->usuarioId;
    }

    public function getAtorFuncionalId(): ?int
    {
        return $this->atorFuncionalId;
    }

    public function hasId(): bool
    {
        return $this->empresaId !== null;
    }

    public function isConfigurador(): bool
    {
        // O configurador tem acesso total; o middleware resolve isso
        // e seta id_ator_funcional. Sem contexto de ator, não é configurador.
        if ($this->atorFuncionalId === null) {
            return false;
        }

        return \App\Models\AtorFuncional::whereKey($this->atorFuncionalId)
            ->where('codigo', 'configurador')
            ->exists();
    }

    public function clear(): void
    {
        $this->empresaId = null;
        $this->filialId = null;
        $this->usuarioId = null;
        $this->atorFuncionalId = null;
    }
}