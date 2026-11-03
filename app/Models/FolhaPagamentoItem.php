<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class FolhaPagamentoItem extends Model
{
    use HasFactory;

    protected $table = 'folhas_pagamento_itens';

    protected $fillable = [
        'id_folha_pagamento',
        'id_funcionario',
        'salario_base',
        'total_proventos',
        'total_descontos',
        'base_inss',
        'base_fgts',
        'base_irrf',
        'valor_inss_empregado',
        'valor_inss_patronal',
        'valor_fgts',
        'valor_irrf',
        'valor_rat',
        'valor_terceiros',
        'valor_liquido',
        'dados_extras',
    ];

    protected $casts = [
        'salario_base' => 'decimal:2',
        'total_proventos' => 'decimal:2',
        'total_descontos' => 'decimal:2',
        'base_inss' => 'decimal:2',
        'base_fgts' => 'decimal:2',
        'base_irrf' => 'decimal:2',
        'valor_inss_empregado' => 'decimal:2',
        'valor_inss_patronal' => 'decimal:2',
        'valor_fgts' => 'decimal:2',
        'valor_irrf' => 'decimal:2',
        'valor_rat' => 'decimal:2',
        'valor_terceiros' => 'decimal:2',
        'valor_liquido' => 'decimal:2',
        'dados_extras' => 'array',
    ];

    public function folhaPagamento(): BelongsTo
    {
        return $this->belongsTo(FolhaPagamento::class, 'id_folha_pagamento');
    }

    public function funcionario(): BelongsTo
    {
        return $this->belongsTo(Funcionario::class, 'id_funcionario');
    }

    public function proventosDescontos(): HasMany
    {
        return $this->hasMany(FolhaPagamentoProventoDesconto::class, 'id_folha_pagamento_item');
    }
}
