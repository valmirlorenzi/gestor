<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PessoaTag extends Model
{
    protected $table = 'pessoas_tags';

    public $timestamps = false;

    protected $fillable = ['id_pessoa', 'tag'];

    public function pessoa()
    {
        return $this->belongsTo(Pessoa::class, 'id_pessoa');
    }
}
