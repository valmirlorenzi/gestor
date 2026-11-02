<?php

namespace App\Models;

use App\Models\Concerns\BelongsToTenant;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CondicaoPagamento extends Model
{
    use SoftDeletes;
    use BelongsToTenant;

    protected $table = 'condicoes_pagamento';

    protected $fillable = ['id_empresa', 'descricao', 'numero_parcelas', 'intervalo_dias', 'ativo'];

    protected $casts = [
        'ativo' => 'boolean',
        'dados_extras' => 'array',
    ];

    public function hasTenantColumn(): bool
    {
        return true;
    }

    public function empresa()
    {
        return $this->belongsTo(Empresa::class, 'id_empresa');
    }
}