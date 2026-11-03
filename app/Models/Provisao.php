<?php

namespace App\Models;

use App\Models\Concerns\BelongsToTenant;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Provisao extends Model
{
    use BelongsToTenant, HasFactory;

    protected $table = 'provisoes';

    protected $fillable = [
        'id_filial',
        'id_periodo',
        'id_funcionario',
        'tipo',
        'valor_provisao',
        'valor_encargos',
        'id_lancamento',
        'dados_extras',
    ];

    protected $casts = [
        'valor_provisao' => 'decimal:2',
        'valor_encargos' => 'decimal:2',
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

    public function funcionario(): BelongsTo
    {
        return $this->belongsTo(Funcionario::class, 'id_funcionario');
    }

    public function lancamento(): BelongsTo
    {
        return $this->belongsTo(Lancamento::class, 'id_lancamento');
    }
}
