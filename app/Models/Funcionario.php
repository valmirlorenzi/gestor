<?php

namespace App\Models;

use App\Models\Concerns\BelongsToTenant;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Funcionario extends Model
{
    use HasFactory;
    use SoftDeletes;
    use BelongsToTenant;

    protected $table = 'funcionarios';

    protected $fillable = [
        'id_pessoa', 'id_filial', 'cargo', 'id_centro_custo',
        'salario_base', 'data_admissao', 'data_demissao', 'natureza', 'ativo',
    ];

    protected $casts = [
        'salario_base' => 'decimal:2',
        'data_admissao' => 'date',
        'data_demissao' => 'date',
        'ativo' => 'boolean',
        'dados_extras' => 'array',
    ];

    public function hasTenantColumn(): bool
    {
        return false; // Grupo F: herda empresa via filial
    }

    public function filial()
    {
        return $this->belongsTo(Filial::class, 'id_filial');
    }

    public function pessoa()
    {
        return $this->belongsTo(Pessoa::class, 'id_pessoa');
    }

    public function centroCusto()
    {
        return $this->belongsTo(CentroCusto::class, 'id_centro_custo');
    }

    public function centrosCustoRateio()
    {
        return $this->belongsToMany(CentroCusto::class, 'funcionarios_centros_custo', 'id_funcionario', 'id_centro_custo')
            ->withPivot('percentual');
    }
}