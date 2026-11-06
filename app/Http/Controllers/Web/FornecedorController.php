<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Repositories\GrupoA\PessoaRepository;

class FornecedorController extends Controller
{
    public function __construct(private PessoaRepository $pessoas) {}

    public function index()
    {
        return view('telas.fornecedores.index');
    }

    public function create()
    {
        return view('telas.fornecedores.form', ['model' => null]);
    }

    public function edit(int $id)
    {
        $model = $this->pessoas->porIdComFilhas($id);

        abort_if($model === null, 404);
        abort_unless($this->pessoas->pertenceATag($model, 'Fornecedor'), 404);

        return view('telas.fornecedores.form', compact('model'));
    }
}
