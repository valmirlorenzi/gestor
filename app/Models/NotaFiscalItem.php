<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class NotaFiscalItem extends Model
{
    use HasFactory;

    protected $table = 'notas_fiscais_itens';

    protected $fillable = [
        'id_nota_fiscal',
        'numero_item',
        'id_produto_servico',
        'descricao',
        'id_cfop',
        'id_ncm',
        'id_servico_lc116',
        'quantidade',
        'valor_unitario',
        'custo_unitario',
        'valor_total',
        'valor_desconto',
        'valor_frete',
        'valor_seguro',
        'outras_despesas',
        'dados_extras',
    ];

    protected $casts = [
        'numero_item' => 'integer',
        'quantidade' => 'decimal:4',
        'valor_unitario' => 'decimal:4',
        'custo_unitario' => 'decimal:4',
        'valor_total' => 'decimal:2',
        'valor_desconto' => 'decimal:2',
        'valor_frete' => 'decimal:2',
        'valor_seguro' => 'decimal:2',
        'outras_despesas' => 'decimal:2',
        'dados_extras' => 'array',
    ];

    public function notaFiscal(): BelongsTo
    {
        return $this->belongsTo(NotaFiscal::class, 'id_nota_fiscal');
    }

    public function produtoServico(): BelongsTo
    {
        return $this->belongsTo(ProdutoServico::class, 'id_produto_servico');
    }

    public function cfop(): BelongsTo
    {
        return $this->belongsTo(Cfop::class, 'id_cfop');
    }

    public function ncm(): BelongsTo
    {
        return $this->belongsTo(Ncm::class, 'id_ncm');
    }

    public function servicoLc116(): BelongsTo
    {
        return $this->belongsTo(ServicoLc116::class, 'id_servico_lc116');
    }

    public function impostos(): HasMany
    {
        return $this->hasMany(NotaFiscalImposto::class, 'id_nota_fiscal_item');
    }
}