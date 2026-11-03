<?php

namespace App\Models;

use App\Models\Concerns\BelongsToTenant;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class CenarioSimulacao extends Model
{
    use BelongsToTenant, HasFactory, SoftDeletes;

    protected $table = 'cenarios_simulacao';

    protected $fillable = [
        'id_empresa',
        'nome',
        'descricao',
        'periodo_base',
        'escopo',
        'variaveis_ajustadas',
        'resultados_persistidos',
        'status',
        'dados_extras',
    ];

    protected $casts = [
        'variaveis_ajustadas' => 'array',
        'resultados_persistidos' => 'array',
        'dados_extras' => 'array',
    ];

    public function hasTenantColumn(): bool
    {
        return true;
    }

    public function empresa(): BelongsTo
    {
        return $this->belongsTo(Empresa::class, 'id_empresa');
    }
}
