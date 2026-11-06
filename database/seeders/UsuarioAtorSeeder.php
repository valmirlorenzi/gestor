<?php

namespace Database\Seeders;

use App\Models\AtorFuncional;
use App\Models\Filial;
use App\Models\Usuario;
use App\Models\UsuarioAtor;
use Illuminate\Database\Seeder;

class UsuarioAtorSeeder extends Seeder
{
    public function run(): void
    {
        $atores = AtorFuncional::pluck('id', 'codigo')->all();
        $filial1 = Filial::withoutGlobalScopes()
            ->where('id_empresa', 1)
            ->orderBy('id')
            ->first();

        if ($filial1 === null) {
            $this->command->warn('Nenhuma filial da empresa 1 — rode EmpresaFilialSeeder antes.');

            return;
        }

        $admin = Usuario::withoutGlobalScopes()->where('email', 'admin@gestor.local')->first();
        if ($admin !== null && isset($atores['configurador'])) {
            foreach (Filial::withoutGlobalScopes()->get() as $filial) {
                UsuarioAtor::firstOrCreate(
                    [
                        'id_usuario' => $admin->id,
                        'id_filial' => $filial->id,
                        'id_ator_funcional' => $atores['configurador'],
                    ],
                    ['ativo' => true],
                );
            }
        }

        $mapa = [
            'contador', 'comprador', 'faturista',
            'financeiro1', 'financeiro2', 'gerente_financeiro',
            'rh', 'auditor', 'administrador',
        ];

        foreach ($mapa as $codigo) {
            $usuario = Usuario::withoutGlobalScopes()
                ->where('email', $codigo.'@gestor.local')
                ->first();

            if ($usuario === null || ! isset($atores[$codigo])) {
                continue;
            }

            UsuarioAtor::firstOrCreate(
                [
                    'id_usuario' => $usuario->id,
                    'id_filial' => $filial1->id,
                    'id_ator_funcional' => $atores[$codigo],
                ],
                ['ativo' => true],
            );
        }

        $this->command->info(
            'UsuarioAtor: admin (configurador em todas as filiais) + 9 atores na filial 1.'
        );
    }
}
