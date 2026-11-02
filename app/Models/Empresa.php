<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Filial;   

class Empresa extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = 'empresas';

    protected $fillable = [
        'cnpj',
        'razao_social',
        'nome_fantasia',
        'regime_fiscal',
        'setor',
        'data_inicio',
        'id_filial_matriz',
        'id_plano_contas_sugerido',
        'metodo_custo',
    ];

    protected $casts = [
        'dados_extras' => 'array',
        'data_inicio' => 'date',
        'data_fim' => 'date',
        'ativo' => 'boolean',
    ];

    public function filiais()
    {
        return $this->hasMany(Filial::class, 'id_empresa');
    }
}