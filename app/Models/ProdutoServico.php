<?php

namespace App\Models;

use App\Models\Concerns\BelongsToTenant;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProdutoServico extends Model
{
    use BelongsToTenant;
    use HasFactory;
    use SoftDeletes;

    protected $table = 'produtos_servicos';

    protected $fillable = ['id_empresa', 'tipo', 'codigo_interno', 'descricao', 'ativo'];

    protected $casts = [
        'ativo' => 'boolean',
        'dados_extras' => 'array',
    ];

    public function hasTenantColumn(): bool
    {
        return true;
    }

    public function empresa()
    {
        return $this->belongsTo(Empresa::class, 'id_empresa');
    }

    public function produto()
    {
        return $this->hasOne(Produto::class, 'id_produto_servico');
    }

    public function servico()
    {
        return $this->hasOne(Servico::class, 'id_produto_servico');
    }
}
