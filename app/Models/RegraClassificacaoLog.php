<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RegraClassificacaoLog extends Model
{
    use HasFactory;

    protected $table = 'regras_classificacao_logs';

    public $timestamps = false;

    protected $fillable = [
        'id_regra_classificacao',
        'acao',
        'id_usuario',
        'justificativa',
        'dados_anteriores',
        'dados_novos',
        'created_at',
    ];

    protected $casts = [
        'dados_anteriores' => 'array',
        'dados_novos' => 'array',
        'created_at' => 'datetime',
    ];

    public function regraClassificacao(): BelongsTo
    {
        return $this->belongsTo(RegraClassificacao::class, 'id_regra_classificacao');
    }

    public function usuario(): BelongsTo
    {
        return $this->belongsTo(Usuario::class, 'id_usuario');
    }
}
