<?php

namespace App\Models;

use App\Models\Concerns\BelongsToTenant;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class AreaNegocio extends Model
{
    use BelongsToTenant;
    use HasFactory;
    use SoftDeletes;

    protected $table = 'areas_negocio';

    protected $fillable = ['id_empresa', 'nome', 'ativo'];

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

    public function centrosCusto()
    {
        return $this->belongsToMany(CentroCusto::class, 'areas_negocio_centros_custo', 'id_area_negocio', 'id_centro_custo');
    }
}
