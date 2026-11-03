<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AtorFuncional extends Model
{
    use HasFactory;

    protected $table = 'atores_funcionais';

    protected $fillable = [
        'codigo',
        'descricao',
        'ativo',
    ];

    protected $casts = [
        'ativo' => 'boolean',
    ];

    public $timestamps = false;

    public function usuariosAtores(): HasMany
    {
        return $this->hasMany(UsuarioAtor::class, 'id_ator_funcional');
    }

    public function tarefasOrigem(): HasMany
    {
        return $this->hasMany(Tarefa::class, 'id_ator_origem');
    }

    public function tarefasDestino(): HasMany
    {
        return $this->hasMany(Tarefa::class, 'id_ator_destino');
    }

    public function menuItens(): BelongsToMany
    {
        return $this->belongsToMany(
            MenuItem::class,
            'menus_itens_atores',
            'id_ator_funcional',
            'id_menu_item'
        );
    }
}
