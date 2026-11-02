<?php

namespace App\Repositories\GrupoF;

use App\Models\Pendencia;
use App\Repositories\BaseRepository;
use Illuminate\Database\Eloquent\Collection;

class PendenciaRepository extends BaseRepository
{
    public function __construct(Pendencia $model)
    {
        parent::__construct($model);
    }

    public function abertas(): Collection
    {
        return $this->query()
            ->where('status', 'Aberta')
            ->orderByDesc('created_at')
            ->get();
    }

    public function porPeriodo(int $idPeriodo): Collection
    {
        return $this->query()
            ->where('id_periodo', $idPeriodo)
            ->orderBy('categoria')
            ->get();
    }

    public function erros(): Collection
    {
        return $this->query()
            ->where('categoria', 'Erro')
            ->where('status', 'Aberta')
            ->get();
    }

    public function avisos(): Collection
    {
        return $this->query()
            ->where('categoria', 'Aviso')
            ->where('status', 'Aberta')
            ->get();
    }

    public function resolver(int $id, array $dados): Pendencia
    {
        $pendencia = $this->findOrFail($id);

        $pendencia->update([
            'status' => $dados['status'] ?? 'Resolvida',
            'id_usuario_resolucao' => $dados['id_usuario_resolucao'] ?? null,
            'data_resolucao' => now(),
            'justificativa' => $dados['justificativa'] ?? null,
        ]);

        return $pendencia->refresh();
    }
}