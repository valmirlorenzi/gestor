<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TipoDocumento extends Model
{
    use HasFactory;

    protected $table = 'tipos_documento';

    public $timestamps = false;

    protected $fillable = [
        'codigo',
        'descricao',
    ];

    public function notasFiscais(): HasMany
    {
        return $this->hasMany(NotaFiscal::class, 'id_tipo_documento');
    }

    public function regrasClassificacao(): HasMany
    {
        return $this->hasMany(RegraClassificacao::class, 'id_tipo_documento');
    }
}