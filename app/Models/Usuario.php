<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;

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

    public function atores(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(\App\Models\UsuarioAtor::class, 'id_usuario');
    }

    public function filiaisPermitidas(): \Illuminate\Support\Collection
    {
        return \App\Models\Filial::query()
            ->whereIn('id', $this->atores()->select('id_filial'))
            ->where('ativo', true)
            ->whereNull('deleted_at')
            ->get();
    }
}