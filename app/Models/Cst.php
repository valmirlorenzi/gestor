<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Cst extends Model
{
    use HasFactory;

    protected $table = 'csts';

    public $timestamps = false;

    protected $fillable = [
        'tipo_imposto',
        'codigo',
        'descricao',
    ];

    public function impostosNota(): HasMany
    {
        return $this->hasMany(NotaFiscalImposto::class, 'id_cst');
    }

    public function regrasClassificacao(): HasMany
    {
        return $this->hasMany(RegraClassificacao::class, 'id_cst');
    }
}