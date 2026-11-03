<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FolhaPagamentoProventoDesconto extends Model
{
    use HasFactory;

    protected $table = 'folhas_pagamento_proventos_descontos';

    protected $fillable = [
        'id_folha_pagamento_item',
        'id_provento_desconto',
        'valor',
    ];

    protected $casts = [
        'valor' => 'decimal:2',
    ];

    public function item(): BelongsTo
    {
        return $this->belongsTo(FolhaPagamentoItem::class, 'id_folha_pagamento_item');
    }

    public function proventoDesconto(): BelongsTo
    {
        return $this->belongsTo(ProventoDesconto::class, 'id_provento_desconto');
    }
}
