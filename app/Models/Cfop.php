<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Cfop extends Model
{
    use HasFactory;

    protected $table = 'cfops';

    public $timestamps = false;

    protected $fillable = [
        'codigo',
        'descricao',
        'natureza',
    ];

    public function itensNota(): HasMany
    {
        return $this->hasMany(NotaFiscalItem::class, 'id_cfop');
    }

    public function regrasClassificacao(): HasMany
    {
        return $this->hasMany(RegraClassificacao::class, 'id_cfop');
    }
}
