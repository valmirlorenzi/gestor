<?php

namespace App\Models;

use App\Models\Concerns\BelongsToTenant;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class FolhaPagamento extends Model
{
    use BelongsToTenant, HasFactory, SoftDeletes;

    protected $table = 'folhas_pagamento';

    protected $fillable = [
        'id_filial',
        'id_periodo',
        'mes_ano_referencia',
        'status',
        'id_lancamento',
        'dados_extras',
    ];

    protected $casts = [
        'dados_extras' => 'array',
    ];

    public function hasTenantColumn(): bool
    {
        return false;
    }

    public function filial(): BelongsTo
    {
        return $this->belongsTo(Filial::class, 'id_filial');
    }

    public function periodo(): BelongsTo
    {
        return $this->belongsTo(Periodo::class, 'id_periodo');
    }

    public function lancamento(): BelongsTo
    {
        return $this->belongsTo(Lancamento::class, 'id_lancamento');
    }

    public function itens(): HasMany
    {
        return $this->hasMany(FolhaPagamentoItem::class, 'id_folha_pagamento');
    }
}