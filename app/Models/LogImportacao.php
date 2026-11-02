<?php

namespace App\Models;

use App\Models\Concerns\BelongsToTenant;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LogImportacao extends Model
{
    use BelongsToTenant, HasFactory;

    protected $table = 'logs_importacao';

    public $timestamps = false;

    protected $fillable = [
        'id_filial',
        'tipo_documento',
        'caminho_arquivo',
        'status',
        'mensagem',
        'created_at',
    ];

    protected $casts = [
        'created_at' => 'datetime',
    ];

    public function hasTenantColumn(): bool
    {
        return false;
    }

    public function filial(): BelongsTo
    {
        return $this->belongsTo(Filial::class, 'id_filial');
    }
}