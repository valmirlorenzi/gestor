<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Models\AtorFuncional;

class MenuItemAtor extends Model
{
    use HasFactory;

    protected $table = 'menus_itens_atores';

    public $timestamps = false;

    protected $fillable = [
        'id_menu_item',
        'id_ator_funcional',
    ];

    public function menuItem(): BelongsTo
    {
        return $this->belongsTo(MenuItem::class, 'id_menu_item');
    }

    public function atorFuncional(): BelongsTo
    {
        return $this->belongsTo(AtorFuncional::class, 'id_ator_funcional');
    }
}