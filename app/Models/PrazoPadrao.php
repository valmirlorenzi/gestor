<?php

namespace App\Models;

use App\Models\Concerns\BelongsToTenant;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class PrazoPadrao extends Model
{
    use BelongsToTenant, HasFactory, SoftDeletes;

    protected $table = 'prazos_padrao';

    protected $fillable = [
        'id_empresa', 'descricao', 'dias', 'parcelas', 'tipo', 'ativo', 'dados_extras',
    ];

    protected $casts = [
        'dias' => 'integer',
        'parcelas' => 'integer',
        'ativo' => 'boolean',
        'dados_extras' => 'array',
    ];

    public function hasTenantColumn(): bool
    {
        return true;
    }

    public function empresa()
    {
        return $this->belongsTo(Empresa::class, 'id_empresa');
    }
}
