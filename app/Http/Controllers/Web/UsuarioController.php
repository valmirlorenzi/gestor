<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Repositories\GrupoA\AtorFuncionalRepository;
use App\Repositories\GrupoA\UsuarioRepository;
use App\Repositories\GrupoF\FilialRepository;
use App\Repositories\GrupoF\UsuarioAtorRepository;
use App\Services\TenantContext;
use Illuminate\Http\Request;

class UsuarioController extends Controller
{
    public function __construct(
        private UsuarioRepository $usuarios,
        private UsuarioAtorRepository $atores,
        private FilialRepository $filiais,
        private AtorFuncionalRepository $atoresFuncionais,
        private TenantContext $context,
    ) {}

    public function index(Request $request)
    {
        $idEmpresa = (int) $this->context->getId();
        $busca = $request->string('q')->toString() ?: null;
        $ativo = $request->has('ativo')
            ? filter_var($request->input('ativo'), FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE)
            : null;

        $usuarios = $this->usuarios->paginado($idEmpresa, $busca, $ativo);

        return view('telas.usuarios.index', compact('usuarios', 'busca', 'ativo'));
    }

    public function create()
    {
        return view('telas.usuarios.form', ['usuario' => null]);
    }

    public function edit(int $id)
    {
        $usuario = $this->usuarios->findOrFail($id);

        return view('telas.usuarios.form', compact('usuario'));
    }

    public function atores(Request $request, int $id)
    {
        $usuario = $this->usuarios->porId($id);
        abort_if($usuario === null, 404);

        $filiaisDisponiveis = $this->filiais->permitidasParaUsuario((int) $usuario->id);

        $idFilialSelecionada = (int) $request->integer('id_filial', 0);
        if ($idFilialSelecionada === 0 && $filiaisDisponiveis->isNotEmpty()) {
            $idFilialSelecionada = (int) $filiaisDisponiveis->first()->id;
        }

        $vinculos = $idFilialSelecionada > 0
            ? $this->atores->porUsuarioEFilial((int) $usuario->id, $idFilialSelecionada)
            : collect();

        $idsAtorSelecionados = $vinculos->pluck('id_ator_funcional')->all();
        $atoresFuncionais = $this->atoresFuncionais->todos();

        return view('telas.usuarios.atores', compact(
            'usuario',
            'filiaisDisponiveis',
            'idFilialSelecionada',
            'atoresFuncionais',
            'idsAtorSelecionados',
        ));
    }
}
