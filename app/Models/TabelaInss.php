<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TabelaInss extends Model
{
    use HasFactory;

    protected $table = 'tabelas_inss';

    protected $fillable = [
        'faixa',
        'valor_inicial',
        'valor_final',
        'aliquota',
        'data_inicio_validade',
        'data_fim_validade',
        'dados_extras',
    ];

    protected $casts = [
        'faixa' => 'integer',
        'valor_inicial' => 'decimal:2',
        'valor_final' => 'decimal:2',
        'aliquota' => 'decimal:4',
        'data_inicio_validade' => 'date',
        'data_fim_validade' => 'date',
        'dados_extras' => 'array',
    ];
}
