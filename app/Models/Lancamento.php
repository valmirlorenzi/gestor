<?php

namespace App\Models;

use App\Models\Concerns\BelongsToTenant;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Lancamento extends Model
{
    use BelongsToTenant, HasFactory, SoftDeletes;

    protected $table = 'lancamentos';

    protected $fillable = [
        'id_filial',
        'id_periodo',
        'data_competencia',
        'data_emissao_documento',
        'historico',
        'valor',
        'id_conta_debito',
        'id_conta_credito',
        'id_centro_custo',
        'id_pessoa',
        'id_nota_fiscal',
        'id_nota_fiscal_item',
        'tipo_lancamento',
        'status_classificacao',
        'justificativa_classificacao',
        'id_lancamento_estorno',
        'dados_extras',
    ];

    protected $casts = [
        'data_competencia' => 'date',
        'data_emissao_documento' => 'date',
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

    public function contaDebito(): BelongsTo
    {
        return $this->belongsTo(PlanoConta::class, 'id_conta_debito');
    }

    public function contaCredito(): BelongsTo
    {
        return $this->belongsTo(PlanoConta::class, 'id_conta_credito');
    }

    public function centroCusto(): BelongsTo
    {
        return $this->belongsTo(CentroCusto::class, 'id_centro_custo');
    }

    public function pessoa(): BelongsTo
    {
        return $this->belongsTo(Pessoa::class, 'id_pessoa');
    }

    public function notaFiscal(): BelongsTo
    {
        return $this->belongsTo(NotaFiscal::class, 'id_nota_fiscal');
    }

    public function notaFiscalItem(): BelongsTo
    {
        return $this->belongsTo(NotaFiscalItem::class, 'id_nota_fiscal_item');
    }

    public function estorno(): BelongsTo
    {
        return $this->belongsTo(Lancamento::class, 'id_lancamento_estorno');
    }

    public function estornos(): HasMany
    {
        return $this->hasMany(Lancamento::class, 'id_lancamento_estorno');
    }
}
