<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TabelaEncargos extends Model
{
    use HasFactory;

    protected $table = 'tabelas_encargos';

    protected $fillable = [
        'descricao',
        'aliquota',
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
}