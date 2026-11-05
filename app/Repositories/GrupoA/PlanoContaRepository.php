<?php

namespace App\Repositories\GrupoA;

use App\Models\PlanoConta;
use App\Repositories\BaseRepository;
use Illuminate\Database\Eloquent\Collection;

class PlanoContaRepository extends BaseRepository
{
    public function __construct(PlanoConta $model)
    {
        parent::__construct($model);
    }

    public function analiticas(): Collection
    {
        return $this->query()
            ->where('aceita_lancamento', true)
            ->where('ativo', true)
            ->orderBy('codigo')
            ->get();
    }

    public function porCodigo(string $codigo): ?PlanoConta
    {
        return $this->query()->where('codigo', $codigo)->first();
    }

    public function filhos(int $idContaPai): Collection
    {
        return $this->query()
            ->where('id_conta_pai', $idContaPai)
            ->orderBy('codigo')
            ->get();
    }

    /**
     * Todas as contas da empresa do contexto, com pai e filhos carregados.
     * Usada para montar a árvore na tela 4.2.
     */
    public function todasComHierarquia(?string $busca = null): Collection
    {
        $query = $this->query()->orderBy('codigo');

        if ($busca !== null && $busca !== '') {
            $query->where(function ($q) use ($busca) {
                $q->where('codigo', 'like', '%'.$busca.'%')
                    ->orWhere('descricao', 'like', '%'.$busca.'%');
            });
        }

        return $query->get();
    }

    /**
     * Contas sintéticas (não aceitam lançamento) — usadas como possíveis pais.
     */
    public function sinteticas(): Collection
    {
        return $this->query()
            ->where('aceita_lancamento', false)
            ->orderBy('codigo')
            ->get(['id', 'codigo', 'descricao', 'nivel']);
    }

    public function porId(int $id): PlanoConta
    {
        return $this->query()->findOrFail($id);
    }

    /**
     * Valida que o pai (se informado) pertence à mesma empresa.
     * Já é garantido pelo global scope, mas retornamos null se não existir.
     */
    public function paiValido(?int $idPai): ?PlanoConta
    {
        if ($idPai === null) {
            return null;
        }

        return $this->query()->find($idPai);
    }

    /**
     * Sugere o próximo código filho, no formato `<codigo_pai>.<NN>`.
     * Se não há pai, sugere o próximo código de nível 1 (1, 2, 3, ...).
     */
    public function proximoCodigo(?int $idPai): string
    {
        if ($idPai === null) {
            $ultimo = $this->query()
                ->whereNull('id_conta_pai')
                ->orderByRaw('CAST(codigo AS UNSIGNED) DESC')
                ->value('codigo');

            return $ultimo === null ? '1' : (string) (((int) $ultimo) + 1);
        }

        $pai = $this->query()->findOrFail($idPai);
        $irmaos = $this->query()
            ->where('id_conta_pai', $idPai)
            ->orderByRaw('CAST(SUBSTRING_INDEX(codigo, ".", -1) AS UNSIGNED) DESC')
            ->value('codigo');

        if ($irmaos === null) {
            return $pai->codigo.'.01';
        }

        $sufixo = (int) substr($irmaos, strrpos($irmaos, '.') + 1);

        return $pai->codigo.'.'.str_pad((string) ($sufixo + 1), 2, '0', STR_PAD_LEFT);
    }

    /**
     * Contas analíticas (que aceitam lançamento) com dados para o 4.3.
     * Inclui conta_referencial para edição em lote.
     */
    public function analiticasComMapeamento(): Collection
    {
        return $this->query()
            ->where('aceita_lancamento', true)
            ->where('ativo', true)
            ->orderBy('codigo')
            ->get(['id', 'codigo', 'descricao', 'conta_referencial']);
    }
}
