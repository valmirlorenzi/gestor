<?php

namespace App\Models;

use App\Models\Concerns\BelongsToTenant;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UsuarioAtor extends Model
{
    use BelongsToTenant, HasFactory;

    protected $table = 'usuarios_atores';

    public $timestamps = false;

    protected $fillable = [
        'id_usuario',
        'id_filial',
        'id_ator_funcional',
        'ativo',
    ];

    protected $casts = [
        'ativo' => 'boolean',
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

    public function atorFuncional(): BelongsTo
    {
        return $this->belongsTo(AtorFuncional::class, 'id_ator_funcional');
    }
}