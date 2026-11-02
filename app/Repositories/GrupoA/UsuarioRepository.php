<?php

namespace App\Repositories\GrupoA;

use App\Models\Usuario;
use App\Repositories\BaseRepository;
use Illuminate\Database\Eloquent\Collection;

class UsuarioRepository extends BaseRepository
{
    public function __construct(Usuario $model)
    {
        parent::__construct($model);
    }

    public function porEmail(string $email): ?Usuario
    {
        return $this->query()->where('email', $email)->first();
    }

    public function ativos(): Collection
    {
        return $this->query()
            ->where('ativo', true)
            ->orderBy('nome')
            ->get();
    }
}