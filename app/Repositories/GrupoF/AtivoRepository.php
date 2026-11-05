<?php

namespace App\Repositories\GrupoF;

use App\Models\Ativo;
use App\Models\CentroCusto;
use App\Models\Filial;
use App\Repositories\BaseRepository;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Validation\ValidationException;

class AtivoRepository extends BaseRepository
{
    public function __construct(Ativo $model)
    {
        parent::__construct($model);
    }

    public function emUso(): Collection
    {
        return $this->query()
            ->where('status', 'Em uso')
            ->orderBy('descricao')
            ->get();
    }

    public function porFilial(int $idFilial): Collection
    {
        return $this->query()
            ->where('id_filial', $idFilial)
            ->orderBy('descricao')
            ->get();
    }

    /**
     * P23: valida que o centro de custo pertence à mesma empresa da filial
     * antes de gravar. FK do banco não garante.
     */
    public function create(array $data): Ativo
    {
        $this->validarCentroCustoDaMesmaEmpresa(
            (int) $data['id_filial'],
            isset($data['id_centro_custo']) ? (int) $data['id_centro_custo'] : null
        );

        /** @var Ativo $ativo */
        $ativo = parent::create($data);

        return $ativo;
    }

    public function update(int $id, array $data): Ativo
    {
        $ativo = $this->findOrFail($id);

        $idFilial = isset($data['id_filial']) ? (int) $data['id_filial'] : $ativo->id_filial;
        $idCentroCusto = array_key_exists('id_centro_custo', $data)
            ? ($data['id_centro_custo'] !== null ? (int) $data['id_centro_custo'] : null)
            : $ativo->id_centro_custo;

        $this->validarCentroCustoDaMesmaEmpresa($idFilial, $idCentroCusto);

        $ativo->update($data);

        return $ativo->refresh();
    }

    private function validarCentroCustoDaMesmaEmpresa(int $idFilial, ?int $idCentroCusto): void
    {
        if ($idCentroCusto === null) {
            return;
        }

        $idEmpresaFilial = Filial::withoutGlobalScope('tenant')
            ->where('id', $idFilial)
            ->value('id_empresa');

        $idEmpresaCentro = CentroCusto::withoutGlobalScope('tenant')
            ->where('id', $idCentroCusto)
            ->value('id_empresa');

        if ($idEmpresaFilial === null || $idEmpresaCentro === null) {
            throw ValidationException::withMessages([
                'id_centro_custo' => 'Filial ou centro de custo inexistente.',
            ]);
        }

        if ($idEmpresaFilial !== $idEmpresaCentro) {
            throw ValidationException::withMessages([
                'id_centro_custo' => 'O centro de custo pertence a outra empresa.',
            ]);
        }
    }

    public function listarComCentroCusto(?string $busca = null): Collection
    {
        $query = $this->query()->with('centroCusto');

        if ($busca !== null && $busca !== '') {
            $query->where('descricao', 'like', '%'.$busca.'%');
        }

        return $query->orderBy('descricao')->get();
    }

    public function comCentroCusto(int $id): Ativo
    {
        return $this->query()->with('centroCusto')->findOrFail($id);
    }

    public function porId(int $id): Ativo
    {
        return $this->query()->findOrFail($id);
    }
}
