<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Cnae extends Model
{
    use HasFactory;

    protected $table = 'cnaes';

    public $timestamps = false;

    protected $fillable = [
        'codigo',
        'descricao',
    ];

    public function filiais(): HasMany
    {
        return $this->hasMany(Filial::class, 'id_cnae');
    }
}
