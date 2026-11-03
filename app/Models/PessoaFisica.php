<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PessoaFisica extends Model
{
    protected $table = 'pessoas_fisicas';

    protected $fillable = ['id_pessoa', 'data_nascimento'];

    protected $casts = [
        'data_nascimento' => 'date',
        'dados_extras' => 'array',
    ];

    public function pessoa()
    {
        return $this->belongsTo(Pessoa::class, 'id_pessoa');
    }
}
