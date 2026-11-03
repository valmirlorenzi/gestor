<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ServicoLc116 extends Model
{
    use HasFactory;

    protected $table = 'servicos_lc116';

    public $timestamps = false;

    protected $fillable = [
        'codigo',
        'descricao',
    ];

    public function servicos(): HasMany
    {
        return $this->hasMany(Servico::class, 'id_servico_lc116');
    }

    public function itensNota(): HasMany
    {
        return $this->hasMany(NotaFiscalItem::class, 'id_servico_lc116');
    }

    public function regrasClassificacao(): HasMany
    {
        return $this->hasMany(RegraClassificacao::class, 'id_servico_lc116');
    }
}
