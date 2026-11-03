<?php

namespace App\Models;

use App\Models\Concerns\BelongsToTenant;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class RegraClassificacao extends Model
{
    use BelongsToTenant, HasFactory, SoftDeletes;

    protected $table = 'regras_classificacao';

    protected $fillable = [
        'id_empresa',
        'descricao',
        'prioridade',
        'id_tipo_documento',
        'id_cfop',
        'id_cst',
        'id_ncm',
        'id_servico_lc116',
        'id_pessoa_fornecedor',
        'categoria_fornecedor',
        'historico_palavra_chave',
        'id_conta_destino',
        'id_centro_custo_padrao',
        'id_conta_contrapartida_padrao',
        'origem',
        'id_lancamento_origem',
        'ativo',
        'dados_extras',
    ];

    protected $casts = [
        'prioridade' => 'integer',
        'ativo' => 'boolean',
        'dados_extras' => 'array',
    ];

    public function hasTenantColumn(): bool
    {
        return true;
    }

    public function empresa(): BelongsTo
    {
        return $this->belongsTo(Empresa::class, 'id_empresa');
    }

    public function tipoDocumento(): BelongsTo
    {
        return $this->belongsTo(TipoDocumento::class, 'id_tipo_documento');
    }

    public function cfop(): BelongsTo
    {
        return $this->belongsTo(Cfop::class, 'id_cfop');
    }

    public function cst(): BelongsTo
    {
        return $this->belongsTo(Cst::class, 'id_cst');
    }

    public function ncm(): BelongsTo
    {
        return $this->belongsTo(Ncm::class, 'id_ncm');
    }

    public function servicoLc116(): BelongsTo
    {
        return $this->belongsTo(ServicoLc116::class, 'id_servico_lc116');
    }

    public function fornecedor(): BelongsTo
    {
        return $this->belongsTo(Pessoa::class, 'id_pessoa_fornecedor');
    }

    public function contaDestino(): BelongsTo
    {
        return $this->belongsTo(PlanoConta::class, 'id_conta_destino');
    }

    public function centroCustoPadrao(): BelongsTo
    {
        return $this->belongsTo(CentroCusto::class, 'id_centro_custo_padrao');
    }

    public function contaContrapartidaPadrao(): BelongsTo
    {
        return $this->belongsTo(PlanoConta::class, 'id_conta_contrapartida_padrao');
    }

    public function lancamentoOrigem(): BelongsTo
    {
        return $this->belongsTo(Lancamento::class, 'id_lancamento_origem');
    }

    public function logs(): HasMany
    {
        return $this->hasMany(RegraClassificacaoLog::class, 'id_regra_classificacao');
    }
}
