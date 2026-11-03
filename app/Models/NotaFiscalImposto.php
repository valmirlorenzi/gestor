<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class NotaFiscalImposto extends Model
{
    use HasFactory;

    protected $table = 'notas_fiscais_impostos';

    protected $fillable = [
        'id_nota_fiscal_item',
        'tipo_imposto',
        'id_cst',
        'base_calculo',
        'aliquota',
        'valor',
        'valor_st',
        'dados_extras',
    ];

    protected $casts = [
        'base_calculo' => 'decimal:2',
        'aliquota' => 'decimal:4',
        'valor' => 'decimal:2',
        'valor_st' => 'decimal:2',
        'dados_extras' => 'array',
    ];

    public function item(): BelongsTo
    {
        return $this->belongsTo(NotaFiscalItem::class, 'id_nota_fiscal_item');
    }

    public function cst(): BelongsTo
    {
        return $this->belongsTo(Cst::class, 'id_cst');
    }
}
