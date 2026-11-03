<?php

namespace App\Models;

use App\Services\TenantContext;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ParametroFiscal extends Model
{
    use HasFactory;

    protected $table = 'parametros_fiscais';

    protected $fillable = [
        'id_empresa',
        'tipo_imposto',
        'descricao',
        'aliquota',
        'base_calculo',
        'data_inicio_validade',
        'data_fim_validade',
        'dados_extras',
    ];

    protected $casts = [
        'aliquota' => 'decimal:4',
        'data_inicio_validade' => 'date',
        'data_fim_validade' => 'date',
        'dados_extras' => 'array',
    ];

    /**
     * Grupo H: global scope customizado (não usa BelongsToTenant).
     * Filtra por (id_empresa = contexto) OR (id_empresa IS NULL).
     * Sem contexto: só os globais (id_empresa IS NULL).
     */
    protected static function booted(): void
    {
        static::addGlobalScope('tenant_hibrido', function (Builder $builder) {
            $context = app(TenantContext::class);

            if (! $context->hasId()) {
                $builder->whereNull('parametros_fiscais.id_empresa');

                return;
            }

            $builder->where(function (Builder $q) use ($context) {
                $q->where('parametros_fiscais.id_empresa', $context->getId())
                    ->orWhereNull('parametros_fiscais.id_empresa');
            });
        });
    }

    /**
     * Escopo explícito por empresa (inclui globais).
     */
    public function scopeParaEmpresa(Builder $query, int $idEmpresa): Builder
    {
        return $query->withoutGlobalScope('tenant_hibrido')
            ->where(function (Builder $q) use ($idEmpresa) {
                $q->where('parametros_fiscais.id_empresa', $idEmpresa)
                    ->orWhereNull('parametros_fiscais.id_empresa');
            });
    }

    /**
     * Escopo só globais (sem override de empresa).
     */
    public function scopeSomenteGlobais(Builder $query): Builder
    {
        return $query->withoutGlobalScope('tenant_hibrido')
            ->whereNull('parametros_fiscais.id_empresa');
    }

    public function empresa(): BelongsTo
    {
        return $this->belongsTo(Empresa::class, 'id_empresa');
    }
}
