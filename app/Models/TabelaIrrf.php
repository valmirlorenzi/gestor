<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TabelaIrrf extends Model
{
    use HasFactory;

    protected $table = 'tabelas_irrf';

    protected $fillable = [
        'faixa',
        'valor_inicial',
        'valor_final',
        'aliquota',
        'deducao',
        'redutor',
        'data_inicio_validade',
        'data_fim_validade',
        'dados_extras',
    ];

    protected $casts = [
        'faixa' => 'integer',
        'valor_inicial' => 'decimal:2',
        'valor_final' => 'decimal:2',
        'aliquota' => 'decimal:4',
        'deducao' => 'decimal:2',
        'redutor' => 'decimal:2',
        'data_inicio_validade' => 'date',
        'data_fim_validade' => 'date',
        'dados_extras' => 'array',
    ];
}