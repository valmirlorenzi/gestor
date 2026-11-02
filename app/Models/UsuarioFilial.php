<?php

namespace App\Models;

use App\Models\Concerns\BelongsToTenant;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @deprecated Substituído por UsuarioAtor. Mantido apenas para migração de dados históricos.
 */
class UsuarioFilial extends Model
{
    use BelongsToTenant, HasFactory;

    protected $table = 'usuarios_filiais';

    public $timestamps = false;

    protected $fillable = [
        'id_usuario',
        'id_filial',
        'perfil',
    ];

    public function hasTenantColumn(): bool
    {
        return false;
    }

    public function usuario(): BelongsTo
    {
        return $this->belongsTo(Usuario::class, 'id_usuario');
    }

    public function filial(): BelongsTo
    {
        return $this->belongsTo(Filial::class, 'id_filial');
    }
}