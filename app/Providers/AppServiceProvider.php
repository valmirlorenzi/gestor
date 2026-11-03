<?php

namespace App\Providers;

use App\Repositories\GrupoF\FilialRepository;
use App\Services\MenuService;
use App\Services\TenantContext;
use Illuminate\Support\Facades\View;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        // P114: TenantContext PRECISA ser singleton. Sem isso, o middleware
        // SetTenantContext seta uma instância e o TelaInicialService (injetado
        // no controller) recebe outra vazia -> variante = universal.
        $this->app->singleton(TenantContext::class);
    }

    public function boot(): void
    {
        View::composer('partials.sidebar', function ($view) {
            $context = app(TenantContext::class);
            $menuJson = null;
            $usuarioJson = null;
            $blocosJson = null;

            if ($context->getUsuarioId() !== null && $context->getFilialId() !== null) {
                $service = app(MenuService::class);
                $payload = $service->paraUsuario(
                    $context->getUsuarioId(),
                    $context->getId(),
                    $context->getFilialId(),
                );

                $menuJson = $payload['itens'];
                $usuarioJson = $payload['usuario'];
                $blocosJson = $payload['blocos'];
            }

            $view->with('menuJson', $menuJson)
                ->with('usuarioJson', $usuarioJson)
                ->with('blocosJson', $blocosJson);
        });

        View::composer('partials.topbar', function ($view) {
            $context = app(TenantContext::class);
            $usuarioId = $context->getUsuarioId();
            $filialAtual = $context->getFilialId();

            $filiais = [];
            if ($usuarioId !== null) {
                $filiais = app(FilialRepository::class)
                    ->permitidasParaUsuario($usuarioId)
                    ->map(fn ($f) => ['id' => $f->id, 'nome' => $f->nome_fantasia])
                    ->all();
            }

            $view->with('filiaisDisponiveis', $filiais)
                ->with('filialAtualId', $filialAtual);
        });
    }
}
