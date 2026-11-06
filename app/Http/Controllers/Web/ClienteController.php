<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Repositories\GrupoA\PessoaRepository;

class ClienteController extends Controller
{
    public function __construct(private PessoaRepository $pessoas) {}

    public function index()
    {
        return view('telas.clientes.index');
    }

    public function create()
    {
        return view('telas.clientes.form', ['model' => null]);
    }

    public function edit(int $id)
    {
        $model = $this->pessoas->porIdComFilhas($id);

        abort_if($model === null, 404);
        abort_unless($this->pessoas->pertenceATag($model, 'Cliente'), 404);

        return view('telas.clientes.form', compact('model'));
    }
}
