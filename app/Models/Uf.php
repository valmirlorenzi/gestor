<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Models\Municipio;

class Uf extends Model
{
    use HasFactory;

    protected $table = 'ufs';

    public $timestamps = false;

    protected $fillable = [
        'sigla',
        'nome',
    ];

    public function municipios(): HasMany
    {
        return $this->hasMany(Municipio::class, 'id_uf');
    }
}