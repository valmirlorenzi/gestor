<?php

namespace App\Repositories\GrupoA;

use App\Models\MenuItem;
use Illuminate\Database\Eloquent\Collection;

/**
 * MenuItem é domínio global (não tem id_empresa). Repository simples.
 */
class MenuItemRepository
{
    /**
     * Itens visíveis para um conjunto de atores (ou todos, se configurador).
     *
     * @param  array<int>  $idsAtores
     * @return Collection<int, MenuItem>
     */
    public function visiveisParaAtores(bool $ehConfigurador, array $idsAtores): Collection
    {
        $query = MenuItem::query()
            ->where('ativo', true)
            ->where('fase', 1)
            ->orderBy('codigo');

        if (! $ehConfigurador) {
            if (empty($idsAtores)) {
                $query->where('codigo', 'like', '1.%');
            } else {
                $query->where(function ($q) use ($idsAtores) {
                    $q->whereHas('atores', fn ($qq) => $qq->whereIn('atores_funcionais.id', $idsAtores))
                        ->orWhere('codigo', 'like', '1.%');
                });
            }
        }

        return $query->get();
    }
}
