<?php

namespace App\Http\Middleware;

use App\Models\Empresa;
use App\Services\TenantContext;
use Closure;
use Illuminate\Http\Request;

class SetTenantContextDev
{
    public function handle(Request $request, Closure $next)
    {
        $context = app(TenantContext::class);

        if (! $context->hasId()) {
            // Até termos login: empresa logada = ID 1.
            // Em desenvolvimento, permite ?empresa=ID para testar isolamento.
            $id = $request->query('empresa');

            if (app()->environment('local') && $id && Empresa::whereKey($id)->exists()) {
                $context->setId((int) $id);
            } else {
                $empresa = Empresa::find(1) ?? Empresa::first();
                if ($empresa) {
                    $context->setId($empresa->id);
                }
            }
        }

        return $next($request);
    }
}