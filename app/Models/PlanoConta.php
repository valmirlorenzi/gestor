<?php

namespace App\Models;

use App\Models\Concerns\BelongsToTenant;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class PlanoConta extends Model
{
    use HasFactory;
    use SoftDeletes;
    use BelongsToTenant;

    protected $table = 'planos_contas';

    protected $fillable = [
        'id_empresa', 'codigo', 'nivel', 'descricao', 'tipo', 'subtipo',
        'natureza', 'aceita_lancamento', 'id_conta_pai', 'conta_referencial',
        'id_plano_contas_origem', 'ativo',
    ];

    protected $casts = [
        'aceita_lancamento' => 'boolean',
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

    public function pai()
    {
        return $this->belongsTo(PlanoConta::class, 'id_conta_pai');
    }

    public function filhos()
    {
        return $this->hasMany(PlanoConta::class, 'id_conta_pai');
    }
}