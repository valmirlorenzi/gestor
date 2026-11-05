<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Usuario;
use App\Services\TenantContext;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UsuarioApiController extends Controller
{
    public function index()
    {
        // Usuario NÃO usa BelongsToTenant (D27). Filtro manual por empresa.
        $idEmpresa = app(TenantContext::class)->getId();

        return response()->json(
            Usuario::withoutGlobalScopes()
                ->where('id_empresa', $idEmpresa)
                ->orderBy('nome')
                ->get()
        );
    }

    public function store(Request $request)
    {
        $idEmpresa = app(TenantContext::class)->getId();

        if (! $idEmpresa) {
            return response()->json([
                'message' => 'Contexto de empresa não definido.',
            ], 422);
        }

        $data = $request->validate([
            'nome' => 'required|string|max:200',
            'email' => [
                'required', 'email', 'max:200',
                Rule::unique('usuarios', 'email')->whereNull('deleted_at'),
            ],
            'senha' => 'required|string|min:8|max:72',
            'ativo' => 'boolean',
        ]);

        $usuario = Usuario::create([
            'id_empresa' => $idEmpresa,
            'nome' => $data['nome'],
            'email' => $data['email'],
            'senha_hash' => Hash::make($data['senha']),
            'ativo' => $data['ativo'] ?? true,
        ]);

        return response()->json($usuario, 201);
    }

    public function show(int $id)
    {
        $usuario = Usuario::withoutGlobalScopes()
            ->where('id_empresa', app(TenantContext::class)->getId())
            ->findOrFail($id);

        return response()->json($usuario);
    }

    public function update(Request $request, int $id)
    {
        $usuario = Usuario::withoutGlobalScopes()
            ->where('id_empresa', app(TenantContext::class)->getId())
            ->findOrFail($id);

        $data = $request->validate([
            'nome' => 'required|string|max:200',
            'email' => [
                'required', 'email', 'max:200',
                Rule::unique('usuarios', 'email')
                    ->whereNull('deleted_at')
                    ->ignore($usuario->id),
            ],
            'senha' => 'nullable|string|min:8|max:72',
            'ativo' => 'boolean',
        ]);

        $usuario->nome = $data['nome'];
        $usuario->email = $data['email'];
        $usuario->ativo = $data['ativo'] ?? $usuario->ativo;

        if (! empty($data['senha'])) {
            $usuario->senha_hash = Hash::make($data['senha']);
        }

        $usuario->save();

        return response()->json($usuario);
    }

    public function destroy(int $id)
    {
        $usuario = Usuario::withoutGlobalScopes()
            ->where('id_empresa', app(TenantContext::class)->getId())
            ->findOrFail($id);

        DB::transaction(function () use ($usuario) {
            $usuario->update([
                'ativo' => false,
                'deleted_by' => app(TenantContext::class)->getUsuarioId(),
            ]);
            $usuario->delete();
        });

        return response()->noContent();
    }
}
