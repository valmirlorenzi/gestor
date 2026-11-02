<?php

namespace App\Models\Concerns;

use App\Services\TenantContext;
use Illuminate\Database\Eloquent\Builder;

trait BelongsToTenant
{
    protected static function bootBelongsToTenant(): void
    {
        static::addGlobalScope('tenant', function (Builder $builder) {
            $context = app(TenantContext::class);

            if (! $context->hasId()) {
                // Sem contexto: retorna vazio (segurança).
                $builder->whereRaw('1 = 0');
                return;
            }

            $table = $builder->getModel()->getTable();

            if ($builder->getModel()->hasTenantColumn()) {
                // Grupo A: tabela tem id_empresa direto.
                $builder->where("{$table}.id_empresa", $context->getId());
            } else {
                // Grupo F: tabela tem id_filial -> herda empresa via filial.
                $builder->whereHas('filial', function (Builder $q) use ($context) {
                    $q->where('filiais.id_empresa', $context->getId());
                });
            }
        });

        // Auto-preenche id_empresa ao criar (Grupo A).
        static::creating(function ($model) {
            if ($model->hasTenantColumn() && empty($model->id_empresa)) {
                $model->id_empresa = app(TenantContext::class)->getId();
            }
        });
    }

    /**
     * Sobrescreva em models do Grupo A (que têm id_empresa).
     * Grupo F (só id_filial) retorna false.
     */
    public function hasTenantColumn(): bool
    {
        return false;
    }
}