<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Empresa;
use Illuminate\Http\Request;

class EmpresaApiController extends Controller
{
    public function index()
    {
        return response()->json(
            Empresa::orderBy('razao_social')->get()
        );
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'cnpj' => 'required|string|size:14|unique:empresas,cnpj',
            'razao_social' => 'required|string|max:200',
            'nome_fantasia' => 'nullable|string|max:200',
            'regime_fiscal' => 'required|in:Simples,Presumido,Real',
            'setor' => 'required|in:Comercio,Servicos,Misto',
            'data_inicio' => 'required|date',
            'metodo_custo' => 'nullable|in:XML,Medio,Manual',
        ]);

        $empresa = Empresa::create($data);

        return response()->json($empresa, 201);
    }

    public function show(Empresa $empresa)
    {
        return response()->json($empresa);
    }

    public function update(Request $request, Empresa $empresa)
    {
        $data = $request->validate([
            'cnpj' => 'required|string|size:14|unique:empresas,cnpj,'.$empresa->id,
            'razao_social' => 'required|string|max:200',
            'nome_fantasia' => 'nullable|string|max:200',
            'regime_fiscal' => 'required|in:Simples,Presumido,Real',
            'setor' => 'required|in:Comercio,Servicos,Misto',
            'data_inicio' => 'required|date',
            'metodo_custo' => 'nullable|in:XML,Medio,Manual',
        ]);

        $empresa->update($data);

        return response()->json($empresa);
    }

    public function destroy(Empresa $empresa)
    {
        $empresa->delete();

        return response()->noContent();
    }
}
