<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DocumentoEncadeado extends Model
{
    use HasFactory;

    protected $table = 'documentos_encadeados';

    public $timestamps = false;

    protected $fillable = [
        'id_documento_origem',
        'id_documento_destino',
        'tipo_relacao',
        'dados_extras',
        'created_at',
    ];

    protected $casts = [
        'dados_extras' => 'array',
        'created_at' => 'datetime',
    ];
}