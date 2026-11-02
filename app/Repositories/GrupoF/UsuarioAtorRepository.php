<?php

namespace App\Repositories\GrupoF;

use App\Models\Filial;
use App\Models\Usuario;
use App\Models\UsuarioAtor;
use App\Repositories\BaseRepository;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Validation\ValidationException;

class UsuarioAtorRepository extends BaseRepository
{
    public function __construct(UsuarioAtor $model)
    {
        parent::__construct($model);
    }

    public function porUsuario(int $idUsuario): Collection
    {
        return $this->query()
            ->where('id_usuario', $idUsuario)
            ->where('ativo', true)
            ->get();
    }

    public function porFilial(int $idFilial): Collection
    {
        return $this->query()
            ->where('id_filial', $idFilial)
            ->where('ativo', true)
            ->get();
    }

    /**
     * P45 (crítica): valida que usuario.id_empresa == filial.id_empresa
     * antes de gravar. FK do banco não garante.
     */
    public function create(array $data): UsuarioAtor
    {
        $this->validarUsuarioDaMesmaEmpresa(
            (int) $data['id_usuario'],
            (int) $data['id_filial']
        );

        /** @var UsuarioAtor $ua */
        $ua = parent::create($data);

        return $ua;
    }

    private function validarUsuarioDaMesmaEmpresa(int $idUsuario, int $idFilial): void
    {
        $idEmpresaUsuario = Usuario::withoutGlobalScope('tenant')
            ->where('id', $idUsuario)
            ->value('id_empresa');

        $idEmpresaFilial = Filial::withoutGlobalScope('tenant')
            ->where('id', $idFilial)
            ->value('id_empresa');

        if ($idEmpresaUsuario === null || $idEmpresaFilial === null) {
            throw ValidationException::withMessages([
                'id_usuario' => 'Usuário ou filial inexistente.',
            ]);
        }

        if ((int) $idEmpresaUsuario !== (int) $idEmpresaFilial) {
            throw ValidationException::withMessages([
                'id_filial' => 'A filial pertence a outra empresa (P45).',
            ]);
        }
    }
}