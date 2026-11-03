<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Municipio extends Model
{
    use HasFactory;

    protected $table = 'municipios';

    public $timestamps = false;

    protected $fillable = [
        'codigo_ibge',
        'nome',
        'id_uf',
        'aliquota_iss_padrao',
        'dados_extras',
    ];

    protected $casts = [
        'aliquota_iss_padrao' => 'decimal:2',
        'dados_extras' => 'array',
    ];

    public function uf(): BelongsTo
    {
        return $this->belongsTo(Uf::class, 'id_uf');
    }

    public function filiais(): HasMany
    {
        return $this->hasMany(Filial::class, 'id_municipio');
    }

    public function pessoasJuridicas(): HasMany
    {
        return $this->hasMany(PessoaJuridica::class, 'id_municipio');
    }

    public function notasFiscais(): HasMany
    {
        return $this->hasMany(NotaFiscal::class, 'id_municipio_emissao');
    }
}
