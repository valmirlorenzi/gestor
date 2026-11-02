<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use app\Models\AtorFuncional;

class MenuItem extends Model
{
    use HasFactory;

    protected $table = 'menus_itens';

    protected $fillable = [
        'codigo',
        'nome',
        'rota',
        'fase',
        'ativo',
        'dados_extras',
    ];

    protected $casts = [
        'fase' => 'integer',
        'ativo' => 'boolean',
        'dados_extras' => 'array',
    ];

    public function atores(): BelongsToMany
    {
        return $this->belongsToMany(
            AtorFuncional::class,
            'menus_itens_atores',
            'id_menu_item',
            'id_ator_funcional'
        );
    }
}