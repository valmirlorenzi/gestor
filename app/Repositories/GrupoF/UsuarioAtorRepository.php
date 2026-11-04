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
        return $this->query()->where('id_usuario', $idUsuario)->where('ativo', true)->get();
    }

    public function porFilial(int $idFilial): Collection
    {
        return $this->query()->where('id_filial', $idFilial)->where('ativo', true)->get();
    }

    public function todosPorUsuario(int $idUsuario): Collection
    {
        return $this->query()
            ->where('id_usuario', $idUsuario)
            ->orderBy('id_filial')
            ->orderBy('id_ator_funcional')
            ->get();
    }

    public function porUsuarioEFilial(int $idUsuario, int $idFilial): Collection
    {
        return $this->query()
            ->where('id_usuario', $idUsuario)
            ->where('id_filial', $idFilial)
            ->where('ativo', true)
            ->get();
    }

    public function sincronizarAtores(int $idUsuario, int $idFilial, array $idsAtor): void
    {
        $this->validarUsuarioDaMesmaEmpresa($idUsuario, $idFilial);

        $idsAtor = array_values(array_unique(array_map('intval', $idsAtor)));

        $existentes = $this->query()
            ->where('id_usuario', $idUsuario)
            ->where('id_filial', $idFilial)
            ->get()
            ->keyBy('id_ator_funcional');

        foreach ($existentes as $idAtor => $ua) {
            if (! in_array((int) $idAtor, $idsAtor, true) && $ua->ativo) {
                $ua->update(['ativo' => false]);
            }
        }

        foreach ($idsAtor as $idAtor) {
            if ($existentes->has($idAtor)) {
                $ua = $existentes->get($idAtor);
                if (! $ua->ativo) {
                    $ua->update(['ativo' => true]);
                }

                continue;
            }

            parent::create([
                'id_usuario' => $idUsuario,
                'id_filial' => $idFilial,
                'id_ator_funcional' => $idAtor,
                'ativo' => true,
            ]);
        }
    }

    public function desativar(int $id): bool
    {
        $ua = $this->findOrFail($id);
        $ua->update(['ativo' => false]);

        return true;
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
        $idEmpresaUsuario = Usuario::withoutGlobalScope('tenant')->where('id', $idUsuario)->value('id_empresa');
        $idEmpresaFilial = Filial::withoutGlobalScope('tenant')->where('id', $idFilial)->value('id_empresa');

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
