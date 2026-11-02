<?php

namespace App\Models;

use App\Models\Concerns\BelongsToTenant;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Pendencia extends Model
{
    use BelongsToTenant, HasFactory;

    protected $table = 'pendencias';

    protected $fillable = [
        'id_filial',
        'id_periodo',
        'categoria',
        'tipo',
        'descricao',
        'id_referencia',
        'tabela_referencia',
        'status',
        'id_usuario_resolucao',
        'data_resolucao',
        'justificativa',
        'dados_extras',
    ];

    protected $casts = [
        'data_resolucao' => 'datetime',
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

    public function usuarioResolucao(): BelongsTo
    {
        return $this->belongsTo(Usuario::class, 'id_usuario_resolucao');
    }
}