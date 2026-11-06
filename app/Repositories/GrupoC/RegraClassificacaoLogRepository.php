<?php

namespace App\Repositories\GrupoC;

use App\Models\RegraClassificacaoLog;
use App\Repositories\BaseRepository;
use Illuminate\Database\Eloquent\Collection;

class RegraClassificacaoLogRepository extends BaseRepository
{
    public function __construct(RegraClassificacaoLog $model)
    {
        parent::__construct($model);
    }

    public function registrar(
        int $idRegra,
        string $acao,
        ?int $idUsuario = null,
        ?string $justificativa = null,
        ?array $dadosAnteriores = null,
        ?array $dadosNovos = null,
    ): RegraClassificacaoLog {
        return $this->create([
            'id_regra_classificacao' => $idRegra,
            'acao' => $acao,
            'id_usuario' => $idUsuario,
            'justificativa' => $justificativa,
            'dados_anteriores' => $dadosAnteriores,
            'dados_novos' => $dadosNovos,
            'created_at' => now(),
        ]);
    }

    public function porRegra(int $idRegra): Collection
    {
        return $this->query()
            ->where('id_regra_classificacao', $idRegra)
            ->orderByDesc('created_at')
            ->get();
    }
}
