<?php

namespace Database\Seeders;

use App\Models\AtorFuncional;
use App\Models\Filial;
use App\Models\Usuario;
use App\Models\UsuarioAtor;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UsuarioSeeder extends Seeder
{
    /**
     * Admin (configurador) + 1 usuário de teste por ator, na primeira filial.
     * Senha padrão: 'password' (fraca — trocar em prod, P59).
     */
    public function run(): void
    {
        $filial = Filial::withoutGlobalScope('tenant')->orderBy('id')->first();

        if (! $filial) {
            $this->command->error('UsuarioSeeder: nenhuma filial encontrada. Rode EmpresaFilialSeeder antes.');

            return;
        }

        $admin = Usuario::firstOrCreate(
            ['email' => 'admin@gestor.local'],
            [
                'id_empresa' => $filial->id_empresa,
                'nome' => 'Administrador (Configurador)',
                'senha_hash' => Hash::make('password'),
                'ativo' => true,
            ]
        );

        $this->vincular($admin, $filial, 'configurador');

        $porAtor = [
            'administrador' => 'Administrador',
            'contador' => 'Contador',
            'comprador' => 'Comprador',
            'faturista' => 'Faturista',
            'financeiro1' => 'Financeiro 1 (Contas a Pagar)',
            'financeiro2' => 'Financeiro 2 (Contas a Receber)',
            'gerente_financeiro' => 'Gerente Financeiro',
            'rh' => 'RH',
            'auditor' => 'Auditor',
        ];

        foreach ($porAtor as $codigo => $nome) {
            $user = Usuario::firstOrCreate(
                ['email' => "{$codigo}@gestor.local"],
                [
                    'id_empresa' => $filial->id_empresa,
                    'nome' => $nome,
                    'senha_hash' => Hash::make('password'),
                    'ativo' => true,
                ]
            );

            $this->vincular($user, $filial, $codigo);
        }

        $this->command->info('Usuarios: admin + 9 atores (senha: password).');
    }

    private function vincular(Usuario $usuario, Filial $filial, string $codigoAtor): void
    {
        $ator = AtorFuncional::where('codigo', $codigoAtor)->first();

        if (! $ator) {
            $this->command->warn("Ator '{$codigoAtor}' não encontrado. Pulando {$usuario->email}.");

            return;
        }

        UsuarioAtor::firstOrCreate(
            [
                'id_usuario' => $usuario->id,
                'id_filial' => $filial->id,
                'id_ator_funcional' => $ator->id,
            ],
            ['ativo' => true]
        );
    }
}
