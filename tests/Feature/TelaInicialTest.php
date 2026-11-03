<?php

use App\Models\AtorFuncional;
use App\Models\Empresa;
use App\Models\Filial;
use App\Models\Tarefa;
use App\Models\Usuario;
use App\Models\UsuarioAtor;
use App\Services\TenantContext;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->empresa = Empresa::create([
        'razao_social' => 'Empresa Teste',
        'nome_fantasia' => 'Empresa Teste',
        'cnpj' => '00000000000001',
        'regime_fiscal' => 'Simples',
        'setor' => 'Comercio',
        'data_inicio' => now()->subYear(),
        'metodo_custo' => 'XML',
    ]);

    $this->filial = Filial::create([
        'id_empresa' => $this->empresa->id,
        'cnpj' => '00000000000002',
        'razao_social' => 'Filial Teste',
        'nome_fantasia' => 'Filial Teste',
        'data_inicio' => now()->subYear(),
        'ativo' => true,
    ]);

    $this->atorContador = AtorFuncional::firstOrCreate(
        ['codigo' => 'contador'],
        ['descricao' => 'Contador', 'ativo' => true]
    );

    $this->usuario = Usuario::create([
        'id_empresa' => $this->empresa->id,
        'nome' => 'Maria Contadora',
        'email' => 'maria@teste.local',
        'senha_hash' => Hash::make('password'),
        'ativo' => true,
    ]);

    UsuarioAtor::create([
        'id_usuario' => $this->usuario->id,
        'id_filial' => $this->filial->id,
        'id_ator_funcional' => $this->atorContador->id,
        'ativo' => true,
    ]);

    app(TenantContext::class)->set(
        empresaId: $this->empresa->id,
        filialId: $this->filial->id,
        usuarioId: $this->usuario->id,
        atorFuncionalId: $this->atorContador->id,
    );
});

it('renderiza a Tela Inicial com a variante do contador', function () {
    $this->actingAs($this->usuario)
        ->get('/')
        ->assertOk()
        ->assertViewIs('telas.tela-inicial')
        ->assertViewHas('variante', 'contador')
        ->assertViewHas('ator', 'contador')
        ->assertSee('Olá, Maria Contadora')
        ->assertSee('Revisar lançamentos');
});

it('mostra as 3 primeiras ordens do ator (RN7)', function () {
    foreach ([1, 2, 3, 4] as $i) {
        Tarefa::create([
            'id_filial' => $this->filial->id,
            'tipo_ordem' => 'teste',          // NOT NULL
            'id_documento' => 1,                 // NOT NULL (sem FK)
            'tipo_documento' => 'teste',           // NOT NULL
            'id_ator_origem' => $this->atorContador->id,
            'id_ator_destino' => $this->atorContador->id,
            'status' => 'pendente',
            'urgente' => $i === 1,
            'prioridade' => 5 - $i,
            'data_criacao' => now()->subDays($i),
            'descricao_resumida' => "Ordem {$i}",
        ]);
    }

    $this->actingAs($this->usuario)
        ->get('/')
        ->assertOk()
        ->assertViewHas('ordens', fn ($ordens) => $ordens->count() === 3);
});

it('cai em universal quando o usuário não tem ator', function () {
    UsuarioAtor::where('id_usuario', $this->usuario->id)->delete();

    $this->actingAs($this->usuario)
        ->get('/')
        ->assertOk()
        ->assertViewHas('variante', 'universal')
        ->assertViewHas('ator', null);
});

it('prefere configurador quando o usuário tem múltiplos atores', function () {
    $atorConfig = AtorFuncional::firstOrCreate(
        ['codigo' => 'configurador'],
        ['descricao' => 'Configurador', 'ativo' => true]
    );

    UsuarioAtor::create([
        'id_usuario' => $this->usuario->id,
        'id_filial' => $this->filial->id,
        'id_ator_funcional' => $atorConfig->id,
        'ativo' => true,
    ]);

    $this->actingAs($this->usuario)
        ->get('/')
        ->assertOk()
        ->assertViewHas('variante', 'configurador');
});
