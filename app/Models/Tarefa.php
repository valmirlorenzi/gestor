<?php

namespace App\Models;

use App\Models\Concerns\BelongsToTenant;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Tarefa extends Model
{
    use BelongsToTenant, HasFactory, SoftDeletes;

    protected $table = 'tarefas';

    const CREATED_AT = null;
    const UPDATED_AT = 'updated_at';

    protected $fillable = [
        'id_filial',
        'tipo_ordem',
        'id_documento',
        'tipo_documento',
        'id_ator_origem',
        'id_ator_destino',
        'status',
        'urgente',
        'data_criacao',
        'data_conclusao',
        'id_ordem_anterior',
        'descricao_resumida',
        'prioridade',
        'dados_extras',
    ];

    protected $casts = [
        'urgente' => 'boolean',
        'data_criacao' => 'datetime',
        'data_conclusao' => 'datetime',
        'prioridade' => 'integer',
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

    public function atorOrigem(): BelongsTo
    {
        return $this->belongsTo(AtorFuncional::class, 'id_ator_origem');
    }

    public function atorDestino(): BelongsTo
    {
        return $this->belongsTo(AtorFuncional::class, 'id_ator_destino');
    }

    public function ordemAnterior(): BelongsTo
    {
        return $this->belongsTo(Tarefa::class, 'id_ordem_anterior');
    }

    public function ordensPosteriores(): HasMany
    {
        return $this->hasMany(Tarefa::class, 'id_ordem_anterior');
    }
}