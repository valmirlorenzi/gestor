<?php

namespace App\Models;

use App\Models\Concerns\BelongsToTenant;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProventoDesconto extends Model
{
    use BelongsToTenant, HasFactory, SoftDeletes;

    protected $table = 'proventos_descontos';

    protected $fillable = [
        'id_empresa',
        'codigo',
        'descricao',
        'tipo',
        'entra_inss',
        'entra_fgts',
        'entra_irrf',
        'ativo',
        'dados_extras',
    ];

    protected $casts = [
        'entra_inss' => 'boolean',
        'entra_fgts' => 'boolean',
        'entra_irrf' => 'boolean',
        'ativo' => 'boolean',
        'dados_extras' => 'array',
    ];

    /**
     * Grupo A: id_empresa direto.
     */
    public function hasTenantColumn(): bool
    {
        return true;
    }

    public function empresa(): BelongsTo
    {
        return $this->belongsTo(Empresa::class, 'id_empresa');
    }
}
