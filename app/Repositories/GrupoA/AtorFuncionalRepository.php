<?php

namespace App\Repositories\GrupoA;

use App\Models\AtorFuncional;
use Illuminate\Database\Eloquent\Collection;

class AtorFuncionalRepository
{
    public function porId(int $id): ?AtorFuncional
    {
        return AtorFuncional::query()->whereKey($id)->first();
    }

    /**
     * Todos os atores ativos (para o select da tela 2.4).
     *
     * @return Collection<int, AtorFuncional>
     */
    public function todos(): Collection
    {
        return AtorFuncional::query()
            ->where('ativo', true)
            ->orderBy('codigo')
            ->get();
    }

    public function porUsuarioNaFilial(int $usuarioId, int $filialId): Collection
    {
        return AtorFuncional::query()
            ->whereIn('id', function ($q) use ($usuarioId, $filialId) {
                $q->select('id_ator_funcional')
                    ->from('usuarios_atores')
                    ->where('id_usuario', $usuarioId)
                    ->where('id_filial', $filialId)
                    ->where('ativo', true);
            })
            ->where('ativo', true)
            ->orderBy('codigo')
            ->get();
    }

    public function ehConfigurador(int $id): bool
    {
        return AtorFuncional::query()
            ->whereKey($id)
            ->where('codigo', 'configurador')
            ->exists();
    }

    public function principalDoUsuarioNaFilial(int $usuarioId, int $filialId): ?AtorFuncional
    {
        return AtorFuncional::query()
            ->whereIn('id', function ($q) use ($usuarioId, $filialId) {
                $q->select('id_ator_funcional')
                    ->from('usuarios_atores')
                    ->where('id_usuario', $usuarioId)
                    ->where('id_filial', $filialId)
                    ->where('ativo', true);
            })
            ->where('ativo', true)
            ->orderByRaw("CASE WHEN codigo = 'configurador' THEN 0 ELSE 1 END")
            ->orderBy('codigo')
            ->first();
    }
}