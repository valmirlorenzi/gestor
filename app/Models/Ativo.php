<?php

namespace App\Models;

use App\Models\Concerns\BelongsToTenant;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Ativo extends Model
{
    use BelongsToTenant, HasFactory, SoftDeletes;

    protected $table = 'ativos';

    protected $fillable = [
        'id_filial',
        'descricao',
        'data_aquisicao',
        'valor_original',
        'valor_residual',
        'vida_util_meses',
        'metodo_depreciacao',
        'mes_inicial_depreciacao',
        'id_centro_custo',
        'destino',
        'status',
        'ativo',
        'dados_extras',
    ];

    protected $casts = [
        'data_aquisicao' => 'date',
        'valor_original' => 'decimal:2',
        'valor_residual' => 'decimal:2',
        'vida_util_meses' => 'integer',
        'ativo' => 'boolean',
        'dados_extras' => 'array',
    ];

    /**
     * Grupo F: empresa herdada via filial.
     */
    public function hasTenantColumn(): bool
    {
        return false;
    }

    public function filial(): BelongsTo
    {
        return $this->belongsTo(Filial::class, 'id_filial');
    }

    public function centroCusto(): BelongsTo
    {
        return $this->belongsTo(CentroCusto::class, 'id_centro_custo');
    }
}
