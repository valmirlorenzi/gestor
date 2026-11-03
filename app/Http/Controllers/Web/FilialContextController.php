<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\UsuarioAtor;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

/**
 * Troca a filial ativa na sessão (P95).
 * Não troca de usuário nem de ator — é o mesmo usuário, mesmos atores.
 */
class FilialContextController extends Controller
{
    public function trocar(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'filial_id' => ['required', 'integer'],
        ]);

        $userId = (int) $request->user()->id;
        $filialId = (int) $data['filial_id'];

        // Segurança: só aceita filial onde o usuário tem ator ativo.
        $pertence = UsuarioAtor::withoutGlobalScope('tenant')
            ->where('id_usuario', $userId)
            ->where('id_filial', $filialId)
            ->where('ativo', true)
            ->exists();

        if (! $pertence) {
            abort(403, 'Você não tem acesso a esta filial.');
        }

        $request->session()->put('filial_id', $filialId);

        return redirect()->back();
    }
}
