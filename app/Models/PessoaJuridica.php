<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PessoaJuridica extends Model
{
    protected $table = 'pessoas_juridicas';

    protected $fillable = ['id_pessoa', 'nome_fantasia', 'id_municipio', 'categoria_padrao', 'prazo_padrao_dias'];

    protected $casts = [
        'dados_extras' => 'array',
    ];

    public function pessoa()
    {
        return $this->belongsTo(Pessoa::class, 'id_pessoa');
    }

    public function municipio()
    {
        return $this->belongsTo(Municipio::class, 'id_municipio');
    }
}
