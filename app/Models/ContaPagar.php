<?php

namespace App\Models;

use App\Models\Concerns\BelongsToTenant;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class ContaPagar extends Model
{
    use BelongsToTenant, HasFactory, SoftDeletes;

    protected $table = 'contas_pagar';

    protected $fillable = [
        'id_filial',
        'id_nota_fiscal',
        'id_pessoa',
        'numero_parcela',
        'total_parcelas',
        'valor',
        'data_emissao',
        'data_vencimento',
        'data_pagamento',
        'valor_pago',
        'juros',
        'multa',
        'desconto',
        'status',
        'status_fluxo',
        'id_conta_bancaria',
        'id_forma_pagamento',
        'id_condicao_pagamento',
        'id_lancamento_baixa',
        'dados_extras',
    ];

    protected $casts = [
        'numero_parcela' => 'integer',
        'total_parcelas' => 'integer',
        'valor' => 'decimal:2',
        'data_emissao' => 'date',
        'data_vencimento' => 'date',
        'data_pagamento' => 'date',
        'valor_pago' => 'decimal:2',
        'juros' => 'decimal:2',
        'multa' => 'decimal:2',
        'desconto' => 'decimal:2',
        'dados_extras' => 'array',
    ];

    public function hasTenantColumn(): bool
    {
        return false;
    }

    public function filial(): BelongsTo
    {
        return $this->belongsTo(Filial::class, 'id_filial');
    }

    public function notaFiscal(): BelongsTo
    {
        return $this->belongsTo(NotaFiscal::class, 'id_nota_fiscal');
    }

    public function pessoa(): BelongsTo
    {
        return $this->belongsTo(Pessoa::class, 'id_pessoa');
    }

    public function contaBancaria(): BelongsTo
    {
        return $this->belongsTo(ContaBancaria::class, 'id_conta_bancaria');
    }

    public function formaPagamento(): BelongsTo
    {
        return $this->belongsTo(FormaPagamento::class, 'id_forma_pagamento');
    }

    public function condicaoPagamento(): BelongsTo
    {
        return $this->belongsTo(CondicaoPagamento::class, 'id_condicao_pagamento');
    }

    public function lancamentoBaixa(): BelongsTo
    {
        return $this->belongsTo(Lancamento::class, 'id_lancamento_baixa');
    }
}