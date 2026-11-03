<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Repositories\GrupoA\AtorFuncionalRepository;
use App\Repositories\GrupoA\UsuarioRepository;
use App\Repositories\GrupoF\FilialRepository;
use App\Repositories\GrupoF\UsuarioAtorRepository;
use App\Services\TenantContext;
use Illuminate\Http\RedirectResponse;
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
        $busca     = $request->string('q')->toString() ?: null;
        $ativo     = $request->has('ativo')
            ? filter_var($request->input('ativo'), FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE)
            : null;

        $usuarios = $this->usuarios->paginado($idEmpresa, $busca, $ativo);

        return view('telas.usuarios.index', compact('usuarios', 'busca', 'ativo'));
    }

    public function create()
    {
        return view('telas.usuarios.form', ['usuario' => null]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'nome'  => ['required', 'string', 'max:200'],
            'email' => ['required', 'email', 'max:200', 'unique:usuarios,email'],
            'senha' => ['required', 'string', 'min:8', 'max:72'],
            'ativo' => ['sometimes', 'boolean'],
        ], [
            'nome.required'  => 'O nome do usuário é obrigatório.',
            'email.required' => 'O e-mail é obrigatório.',
            'email.unique'   => 'Já existe um usuário com este e-mail.',
            'senha.required' => 'A senha é obrigatória.',
            'senha.min'      => 'A senha deve ter no mínimo 8 caracteres.',
        ]);

        $this->usuarios->criarComSenha($data, (int) $this->context->getId());

        return redirect()->route('usuarios.index');
    }

    public function edit(int $id)
    {
        $usuario = $this->usuarios->findOrFail($id);

        return view('telas.usuarios.form', compact('usuario'));
    }

    public function update(Request $request, int $id): RedirectResponse
    {
        $this->usuarios->findOrFail($id);

        $data = $request->validate([
            'nome'  => ['required', 'string', 'max:200'],
            'email' => ['required', 'email', 'max:200', 'unique:usuarios,email,'.$id],
            'senha' => ['nullable', 'string', 'min:8', 'max:72'],
            'ativo' => ['sometimes', 'boolean'],
        ]);

        $this->usuarios->atualizarComSenha($id, $data);

        return redirect()->route('usuarios.index');
    }

    public function destroy(int $id): RedirectResponse
    {
        $usuario = $this->usuarios->findOrFail($id);
        $usuario->update(['ativo' => false]);
        $usuario->delete();

        return redirect()->route('usuarios.index');
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
        $atoresFuncionais    = $this->atoresFuncionais->all();

        return view('telas.usuarios.atores', compact(
            'usuario',
            'filiaisDisponiveis',
            'idFilialSelecionada',
            'atoresFuncionais',
            'idsAtorSelecionados',
        ));
    }

    public function sincronizarAtores(Request $request, int $id): RedirectResponse
    {
        $usuario = $this->usuarios->porId($id);
        abort_if($usuario === null, 404);

        $data = $request->validate([
            'id_filial'   => ['required', 'integer', 'exists:filiais,id'],
            'id_atores'   => ['required', 'array', 'min:1'],
            'id_atores.*' => ['integer', 'exists:atores_funcionais,id'],
        ]);

        $this->atores->sincronizarAtores(
            (int) $usuario->id,
            (int) $data['id_filial'],
            (array) $data['id_atores'],
        );

        return redirect()->route('usuarios.atores', [
            'id'        => $id,
            'id_filial' => $data['id_filial'],
        ]);
    }
}