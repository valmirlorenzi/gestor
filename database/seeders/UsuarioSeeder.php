<?php

namespace Database\Seeders;

use App\Models\Usuario;
use App\Models\Filial;
use App\Models\AtorFuncional;
use App\Models\UsuarioAtor;
use App\Services\TenantContext;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UsuarioSeeder extends Seeder
{
    public function run(): void
    {
        app(TenantContext::class)->setId(1);

        $usuario = Usuario::withoutGlobalScope('tenant')->updateOrCreate(
            ['email' => 'admin@gestor.local'],
            [
                'id_empresa' => 1,
                'nome' => 'Administrador',
                'senha_hash' => Hash::make('senha123'),
                'ativo' => true,
            ]        
        );

        $atorConfigurador = AtorFuncional::where('codigo', 'configurador')->first();
        $filial = Filial::withoutGlobalScope('tenant')->where('id_empresa', 1)->orderBy('id')->first();

        if ($atorConfigurador && $filial) {
            UsuarioAtor::withoutGlobalScope('tenant')->updateOrCreate(
                [
                    'id_usuario' => $usuario->id,
                    'id_filial' => $filial->id,
                    'id_ator_funcional' => $atorConfigurador->id,
                ],
                ['ativo' => true]
            );
        }
    }
}