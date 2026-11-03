<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class NotaFiscalVinculo extends Model
{
    use HasFactory;

    protected $table = 'notas_fiscais_vinculos';

    protected $fillable = [
        'id_nota_fiscal',
        'id_nota_vinculada',
        'tipo_vinculo',
    ];

    public function notaFiscal(): BelongsTo
    {
        return $this->belongsTo(NotaFiscal::class, 'id_nota_fiscal');
    }

    public function notaVinculada(): BelongsTo
    {
        return $this->belongsTo(NotaFiscal::class, 'id_nota_vinculada');
    }
}
