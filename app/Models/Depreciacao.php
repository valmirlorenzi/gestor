<?php

namespace App\Models;

use App\Models\Concerns\BelongsToTenant;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Depreciacao extends Model
{
    use BelongsToTenant, HasFactory;

    protected $table = 'depreciacoes';

    protected $fillable = [
        'id_filial',
        'id_periodo',
        'id_ativo',
        'valor_depreciacao',
        'depreciacao_acumulada',
        'valor_contabil_liquido',
        'id_lancamento',
        'dados_extras',
    ];

    protected $casts = [
        'valor_depreciacao' => 'decimal:2',
        'depreciacao_acumulada' => 'decimal:2',
        'valor_contabil_liquido' => 'decimal:2',
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

    public function ativo(): BelongsTo
    {
        return $this->belongsTo(Ativo::class, 'id_ativo');
    }

    public function lancamento(): BelongsTo
    {
        return $this->belongsTo(Lancamento::class, 'id_lancamento');
    }
}