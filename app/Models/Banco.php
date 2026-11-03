<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Banco extends Model
{
    use HasFactory;

    protected $table = 'bancos';

    public $timestamps = false;

    protected $fillable = [
        'codigo',
        'nome',
    ];

    public function contasBancarias(): HasMany
    {
        return $this->hasMany(ContaBancaria::class, 'id_banco');
    }
}
