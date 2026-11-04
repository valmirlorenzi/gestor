<?php

namespace App\Repositories\GrupoA;

use App\Models\Usuario;
use App\Repositories\BaseRepository;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Hash;

class UsuarioRepository extends BaseRepository
{
    public function __construct(Usuario $model)
    {
        parent::__construct($model);
    }

    public function porEmail(string $email): ?Usuario
    {
        return $this->query()->where('email', $email)->first();
    }

    public function ativos(): Collection
    {
        return $this->query()->where('ativo', true)->orderBy('nome')->get();
    }

    public function nomePorId(int $id): ?string
    {
        return $this->query()->withoutGlobalScope('tenant')->whereKey($id)->value('nome');
    }

    public function porId(int $id): ?Usuario
    {
        return $this->query()->withoutGlobalScopes()->find($id);
    }

    /**
     * Listagem paginada para a tela 2.4. Filtro manual por empresa (D27/P98).
     */
    public function paginado(int $idEmpresa, ?string $busca = null, ?bool $ativo = null, int $perPage = 15): LengthAwarePaginator
    {
        return $this->query()
            ->withoutGlobalScopes()
            ->where('id_empresa', $idEmpresa)
            ->when($busca !== null && $busca !== '', function ($q) use ($busca) {
                $q->where(function ($qq) use ($busca) {
                    $qq->where('nome', 'like', '%'.$busca.'%')
                        ->orWhere('email', 'like', '%'.$busca.'%');
                });
            })
            ->when($ativo !== null, fn ($q) => $q->where('ativo', $ativo))
            ->orderBy('nome')
            ->paginate($perPage)
            ->withQueryString();
    }

    public function criarComSenha(array $data, int $idEmpresa): Usuario
    {
        /** @var Usuario $u */
        $u = parent::create([
            'id_empresa' => $idEmpresa,
            'nome' => $data['nome'],
            'email' => $data['email'],
            'senha_hash' => Hash::make($data['senha']),
            'ativo' => $data['ativo'] ?? true,
        ]);

        return $u;
    }

    public function atualizarComSenha(int $id, array $data): Usuario
    {
        $payload = array_filter([
            'nome' => $data['nome'] ?? null,
            'email' => $data['email'] ?? null,
            'ativo' => $data['ativo'] ?? null,
        ], fn ($v) => $v !== null);

        if (! empty($data['senha'])) {
            $payload['senha_hash'] = Hash::make($data['senha']);
        }

        /** @var Usuario $u */
        $u = $this->update($id, $payload);

        return $u;
    }
}
