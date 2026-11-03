<?php

namespace App\Http\Middleware;

use App\Models\UsuarioAtor;
use App\Services\TenantContext;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SetTenantContext
{
    public function __construct(private TenantContext $context) {}

    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user === null) {
            // Sem login: limpa e segue. O BelongsToTenant filtra tudo (whereRaw 1=0).
            $this->context->clear();

            return $next($request);
        }

        // Empresa: sempre a do usuário.
        $empresaId = (int) $user->id_empresa;

        // Filial: a primeira filial permitida, ou a da sessão (se o usuário escolheu).
        $filialId = $request->session()->get('filial_id');

        if ($filialId === null) {
            $primeiraFilial = UsuarioAtor::withoutGlobalScope('tenant')
                ->where('id_usuario', $user->id)
                ->where('ativo', true)
                ->orderBy('id_filial')
                ->value('id_filial');

            $filialId = $primeiraFilial !== null ? (int) $primeiraFilial : null;
        }

        // Ator: o da filial atual. Se o usuário tem múltiplos atores na filial,
        // pega o primeiro (o menu junta todos — ver MenuService).
        $atorId = null;

        if ($filialId !== null) {
            $atorId = UsuarioAtor::withoutGlobalScope('tenant')
                ->where('id_usuario', $user->id)
                ->where('id_filial', $filialId)
                ->where('ativo', true)
                ->orderBy('id_ator_funcional')
                ->value('id_ator_funcional');

            $atorId = $atorId !== null ? (int) $atorId : null;
        }

        $this->context->set(
            empresaId: $empresaId,
            filialId: $filialId,
            usuarioId: (int) $user->id,
            atorFuncionalId: $atorId,
        );

        return $next($request);
    }
}
