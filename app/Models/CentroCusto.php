<?php

namespace App\Models;

use App\Models\Concerns\BelongsToTenant;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CentroCusto extends Model
{
    use BelongsToTenant;
    use HasFactory;
    use SoftDeletes;

    protected $table = 'centros_custo';

    protected $fillable = ['id_empresa', 'nome', 'responsavel', 'ativo'];

    protected $casts = [
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

    public function areasNegocio()
    {
        return $this->belongsToMany(AreaNegocio::class, 'areas_negocio_centros_custo', 'id_centro_custo', 'id_area_negocio');
    }
}
