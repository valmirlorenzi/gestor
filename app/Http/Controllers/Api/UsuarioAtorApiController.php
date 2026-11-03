<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Usuario;
use App\Models\UsuarioAtor;
use App\Repositories\GrupoF\UsuarioAtorRepository;
use Illuminate\Http\Request;

class UsuarioAtorApiController extends Controller
{
    public function __construct(
        private UsuarioAtorRepository $repo,
    ) {}

    public function index(Usuario $usuario)
    {
        // Retorna os vínculos ativos do usuário, agrupados por filial.
        $vinculos = $this->repo
            ->porUsuario((int) $usuario->id)
            ->groupBy('id_filial');

        return response()->json($vinculos);
    }

    public function sincronizar(Request $request, Usuario $usuario)
    {
        $data = $request->validate([
            'id_filial' => 'required|integer|exists:filiais,id',
            'id_atores' => 'required|array|min:1',
            'id_atores.*' => 'integer|exists:atores_funcionais,id',
        ]);

        $this->repo->sincronizarAtores(
            (int) $usuario->id,
            (int) $data['id_filial'],
            (array) $data['id_atores'],
        );

        return response()->json(
            $this->repo->porUsuarioEFilial((int) $usuario->id, (int) $data['id_filial'])
        );
    }

    public function destroy(UsuarioAtor $usuarioAtor)
    {
        $usuarioAtor->update(['ativo' => false]);

        return response()->noContent();
    }
}