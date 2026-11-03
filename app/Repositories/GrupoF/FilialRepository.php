<?php

namespace App\Repositories\GrupoF;

use App\Models\Filial;
use App\Repositories\BaseRepository;
use Illuminate\Database\Eloquent\Collection;

class FilialRepository extends BaseRepository
{
    public function __construct(Filial $model)
    {
        parent::__construct($model);
    }

    public function ativas(): Collection
    {
        return $this->query()
            ->where('ativo', true)
            ->orderBy('razao_social')
            ->get();
    }

    public function porCnpj(string $cnpj): ?Filial
    {
        return $this->query()->where('cnpj', $cnpj)->first();
    }

    /**
     * Busca a filial por ID, sem o global scope (usado no SetTenantContext,
     * TelaInicialService, MenuService — contextos onde o tenant pode não
     * estar setado ainda).
     */
    public function porIdSemEscopo(int $id): ?Filial
    {
        return $this->query()
            ->withoutGlobalScope('tenant')
            ->find($id);
    }

    /**
     * Nome fantasia da filial (para exibição em telas).
     */
    public function nomeFantasia(int $id): ?string
    {
        return $this->query()
            ->withoutGlobalScope('tenant')
            ->whereKey($id)
            ->value('nome_fantasia');
    }

    public function primeiraDaEmpresa(int $idEmpresa): ?Filial
    {
        return $this->query()
            ->where('id_empresa', $idEmpresa)
            ->orderBy('id')
            ->first();
    }

    /**
     * Filiais onde o usuário tem ator ativo (dropdown do topbar).
     *
     * @return \Illuminate\Support\Collection<int, array{id: int, nome: string}>
     */
    public function disponiveisParaUsuario(int $usuarioId): \Illuminate\Support\Collection
    {
        return $this->query()
            ->withoutGlobalScope('tenant')
            ->whereIn('id', function ($q) use ($usuarioId) {
                $q->select('id_filial')
                    ->from('usuarios_atores')
                    ->where('id_usuario', $usuarioId)
                    ->where('ativo', true);
            })
            ->orderBy('nome_fantasia')
            ->get(['id', 'nome_fantasia'])
            ->map(fn ($f) => ['id' => $f->id, 'nome' => $f->nome_fantasia]);
    }

    /**
     * Filiais onde o usuário tem ator ativo.
     *
     * @return \Illuminate\Support\Collection<int, Filial>
     */
    public function permitidasParaUsuario(int $usuarioId): \Illuminate\Support\Collection
    {
        return $this->query()
            ->withoutGlobalScope('tenant')
            ->whereIn('id', function ($q) use ($usuarioId) {
                $q->select('id_filial')
                    ->from('usuarios_atores')
                    ->where('id_usuario', $usuarioId)
                    ->where('ativo', true);
            })
            ->where('ativo', true)
            ->orderBy('nome_fantasia')
            ->get();
    }
}
