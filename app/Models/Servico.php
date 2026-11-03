<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Servico extends Model
{
    protected $table = 'servicos';

    protected $fillable = ['id_produto_servico', 'id_servico_lc116'];

    protected $casts = ['dados_extras' => 'array'];

    public function produtoServico()
    {
        return $this->belongsTo(ProdutoServico::class, 'id_produto_servico');
    }

    public function servicoLc116()
    {
        return $this->belongsTo(ServicoLc116::class, 'id_servico_lc116');
    }
}
