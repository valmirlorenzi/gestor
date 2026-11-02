<?php

namespace App\Models;

use App\Models\Concerns\BelongsToTenant;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Periodo extends Model
{
    use HasFactory;
    use SoftDeletes;
    use BelongsToTenant;

    protected $table = 'periodos';

    protected $fillable = [
        'id_filial', 'mes_ano', 'status', 'data_fechamento', 'id_usuario_fechamento',
    ];

    protected $casts = [
        'data_fechamento' => 'datetime',
        'dados_extras' => 'array',
    ];

    public function hasTenantColumn(): bool
    {
        return false; // Grupo F: herda empresa via filial
    }

    public function filial()
    {
        return $this->belongsTo(Filial::class, 'id_filial');
    }

    public function usuarioFechamento()
    {
        return $this->belongsTo(Usuario::class, 'id_usuario_fechamento');
    }
}