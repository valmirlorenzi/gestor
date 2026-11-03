<?php

namespace App\Models;

use App\Models\Concerns\BelongsToTenant;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Pessoa extends Model
{
    use BelongsToTenant;
    use HasFactory;
    use SoftDeletes;

    protected $table = 'pessoas';

    protected $fillable = ['id_empresa', 'tipo', 'documento', 'nome', 'email', 'telefone', 'ativo'];

    protected $casts = [
        'ativo' => 'boolean',
        'dados_extras' => 'array',
    ];

    public function hasTenantColumn(): bool
    {
        return true;
    }

    public function empresa()
    {
        return $this->belongsTo(Empresa::class, 'id_empresa');
    }

    public function fisica()
    {
        return $this->hasOne(PessoaFisica::class, 'id_pessoa');
    }

    public function juridica()
    {
        return $this->hasOne(PessoaJuridica::class, 'id_pessoa');
    }

    public function tags()
    {
        return $this->hasMany(PessoaTag::class, 'id_pessoa');
    }

    public function funcionario()
    {
        return $this->hasOne(Funcionario::class, 'id_pessoa');
    }
}
