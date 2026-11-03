<?php

namespace App\Models;

use App\Models\Concerns\BelongsToTenant;
use Illuminate\Database\Eloquent\Model;

class ProdutoCusto extends Model
{
    use BelongsToTenant;

    protected $table = 'produtos_custos';

    protected $fillable = ['id_produto_servico', 'id_filial', 'data_referencia', 'custo_medio'];

    protected $casts = [
        'data_referencia' => 'date',
        'custo_medio' => 'decimal:4',
        'dados_extras' => 'array',
    ];

    public function hasTenantColumn(): bool
    {
        return false; // Grupo F: herda empresa via filial
    }

    public function filial()
    {
        return $this->belongsTo(Filial::class, 'id_filial');
    }

    public function produtoServico()
    {
        return $this->belongsTo(ProdutoServico::class, 'id_produto_servico');
    }
}
