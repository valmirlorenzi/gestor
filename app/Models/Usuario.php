<?php

namespace App\Models;

use App\Repositories\GrupoF\FilialRepository;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Support\Collection;

class Usuario extends Authenticatable
{
    use HasFactory;
    use SoftDeletes;
    // use BelongsToTenant;   // <-- REMOVIDO

    protected $table = 'usuarios';

    protected $fillable = ['id_empresa', 'nome', 'email', 'senha_hash', 'ativo'];

    protected $hidden = ['senha_hash'];

    protected $casts = [
        'ativo' => 'boolean',
        'dados_extras' => 'array',
    ];

    public function empresa()
    {
        return $this->belongsTo(Empresa::class, 'id_empresa');
    }

    public function getAuthPassword(): string
    {
        return $this->senha_hash;
    }

    public function getAuthPasswordName(): string
    {
        return 'senha_hash';
    }

    public function getAuthIdentifierName(): string
    {
        return 'id';
    }

    public function atores(): HasMany
    {
        return $this->hasMany(UsuarioAtor::class, 'id_usuario');
    }

    public function filiaisPermitidas(): Collection
    {
        return app(FilialRepository::class)->permitidasParaUsuario((int) $this->id);
    }
}
