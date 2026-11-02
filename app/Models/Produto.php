<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Produto extends Model
{
    protected $table = 'produtos';

    protected $fillable = ['id_produto_servico', 'id_ncm', 'unidade'];

    protected $casts = ['dados_extras' => 'array'];

    public function produtoServico()
    {
        return $this->belongsTo(ProdutoServico::class, 'id_produto_servico');
    }

    public function ncm()
    {
        return $this->belongsTo(Ncm::class, 'id_ncm');
    }
}