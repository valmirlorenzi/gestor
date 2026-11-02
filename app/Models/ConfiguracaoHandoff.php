<?php

namespace App\Models;

use App\Models\Concerns\BelongsToTenant;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ConfiguracaoHandoff extends Model
{
    use BelongsToTenant, HasFactory;

    protected $table = 'configuracoes_handoff';

    protected $fillable = [
        'id_empresa',
        'handoff_ativo',
        'dados_extras',
    ];

    protected $casts = [
        'handoff_ativo' => 'boolean',
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