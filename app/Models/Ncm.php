<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Ncm extends Model
{
    use HasFactory;

    protected $table = 'ncms';

    public $timestamps = false;

    protected $fillable = [
        'codigo',
        'descricao',
        'id_ncm_pai',
        'aceita_lancamento',
        'nivel',
    ];

    protected $casts = [
        'aceita_lancamento' => 'boolean',
        'nivel' => 'integer',
    ];

    public function pai(): BelongsTo
    {
        return $this->belongsTo(Ncm::class, 'id_ncm_pai');
    }

    public function filhos(): HasMany
    {
        return $this->hasMany(Ncm::class, 'id_ncm_pai');
    }

    public function produtos(): HasMany
    {
        return $this->hasMany(Produto::class, 'id_ncm');
    }

    public function itensNota(): HasMany
    {
        return $this->hasMany(NotaFiscalItem::class, 'id_ncm');
    }

    public function regrasClassificacao(): HasMany
    {
        return $this->hasMany(RegraClassificacao::class, 'id_ncm');
    }
}
