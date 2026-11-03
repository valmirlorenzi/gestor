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
        // P96: só roda em local/testing. Em produção, é no-op.
        if (! app()->environment('local', 'testing')) {
            return $next($request);
        }

        $context = app(TenantContext::class);

        if (! $context->hasId()) {
            // Em dev, permite ?empresa=ID para testar isolamento.
            $id = $request->query('empresa');

            if ($id && Empresa::whereKey($id)->exists()) {
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
