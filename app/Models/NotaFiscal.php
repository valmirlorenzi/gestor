<?php

namespace App\Models;

use App\Models\Concerns\BelongsToTenant;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class NotaFiscal extends Model
{
    use BelongsToTenant, HasFactory, SoftDeletes;

    protected $table = 'notas_fiscais';

    protected $fillable = [
        'id_filial',
        'id_tipo_documento',
        'origem',
        'direcao',
        'chave',
        'numero',
        'serie',
        'data_emissao',
        'id_pessoa_emitente',
        'id_pessoa_destinatario',
        'id_municipio_emissao',
        'valor_produtos',
        'valor_desconto',
        'valor_frete',
        'valor_total',
        'xml_origem',
        'status_importacao',
        'status_fluxo',
        'motivo_cancelamento',
        'id_periodo',
        'dados_extras',
    ];

    protected $casts = [
        'data_emissao' => 'date',
        'valor_produtos' => 'decimal:2',
        'valor_desconto' => 'decimal:2',
        'valor_frete' => 'decimal:2',
        'valor_total' => 'decimal:2',
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

    public function tipoDocumento(): BelongsTo
    {
        return $this->belongsTo(TipoDocumento::class, 'id_tipo_documento');
    }

    public function periodo(): BelongsTo
    {
        return $this->belongsTo(Periodo::class, 'id_periodo');
    }

    public function emitente(): BelongsTo
    {
        return $this->belongsTo(Pessoa::class, 'id_pessoa_emitente');
    }

    public function destinatario(): BelongsTo
    {
        return $this->belongsTo(Pessoa::class, 'id_pessoa_destinatario');
    }

    public function municipioEmissao(): BelongsTo
    {
        return $this->belongsTo(Municipio::class, 'id_municipio_emissao');
    }

    public function itens(): HasMany
    {
        return $this->hasMany(NotaFiscalItem::class, 'id_nota_fiscal');
    }

    public function vinculosOrigem(): HasMany
    {
        return $this->hasMany(NotaFiscalVinculo::class, 'id_nota_fiscal');
    }

    public function vinculosDestino(): HasMany
    {
        return $this->hasMany(NotaFiscalVinculo::class, 'id_nota_vinculada');
    }
}
