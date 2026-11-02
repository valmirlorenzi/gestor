<?php

namespace App\Models;

use App\Models\Concerns\BelongsToTenant;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RazaoImposto extends Model
{
    use BelongsToTenant, HasFactory;

    protected $table = 'razoes_impostos';

    protected $fillable = [
        'id_filial',
        'id_periodo',
        'tipo_imposto',
        'id_lancamento',
        'natureza',
        'valor',
        'id_pessoa',
        'id_nota_fiscal',
        'dados_extras',
    ];

    protected $casts = [
        'valor' => 'decimal:2',
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

    public function periodo(): BelongsTo
    {
        return $this->belongsTo(Periodo::class, 'id_periodo');
    }

    public function lancamento(): BelongsTo
    {
        return $this->belongsTo(Lancamento::class, 'id_lancamento');
    }

    public function pessoa(): BelongsTo
    {
        return $this->belongsTo(Pessoa::class, 'id_pessoa');
    }

    public function notaFiscal(): BelongsTo
    {
        return $this->belongsTo(NotaFiscal::class, 'id_nota_fiscal');
    }
}