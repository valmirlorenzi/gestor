<?php

namespace App\Models;

use App\Models\Concerns\BelongsToTenant;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ContaBancaria extends Model
{
    use SoftDeletes;
    use BelongsToTenant;

    protected $table = 'contas_bancarias';

    protected $fillable = [
        'id_filial', 'id_banco', 'agencia', 'numero', 'tipo',
        'saldo_inicial', 'saldo_inicial_data', 'ativo',
    ];

    protected $casts = [
        'saldo_inicial' => 'decimal:2',
        'saldo_inicial_data' => 'date',
        'ativo' => 'boolean',
        'dados_extras' => 'array',
    ];

    public function hasTenantColumn(): bool
    {
        return false; // Grupo F
    }

    public function filial()
    {
        return $this->belongsTo(Filial::class, 'id_filial');
    }

    public function banco()
    {
        return $this->belongsTo(Banco::class, 'id_banco');
    }
}