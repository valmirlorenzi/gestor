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
        'razao_social' => 'E', 'nome_fantasia' => 'E', 'cnpj' => '00000000000001',
        'regime_fiscal' => 'Simples', 'setor' => 'Comercio',
        'data_inicio' => now()->subYear(), 'metodo_custo' => 'XML',
    ]);
    $this->filial = Filial::create([
        'id_empresa' => $this->empresa->id, 'cnpj' => '00000000000002',
        'razao_social' => 'F', 'nome_fantasia' => 'F',
        'data_inicio' => now()->subYear(), 'ativo' => true,
    ]);
    $this->ator = AtorFuncional::firstOrCreate(
        ['codigo' => 'contador'],
        ['descricao' => 'Contador', 'ativo' => true]
    );
    $this->usuario = Usuario::create([
        'id_empresa' => $this->empresa->id, 'nome' => 'Maria',
        'email' => 'maria@teste.local', 'senha_hash' => Hash::make('password'), 'ativo' => true,
    ]);
    UsuarioAtor::create([
        'id_usuario' => $this->usuario->id, 'id_filial' => $this->filial->id,
        'id_ator_funcional' => $this->ator->id, 'ativo' => true,
    ]);
    app(TenantContext::class)->set(
        empresaId: $this->empresa->id, filialId: $this->filial->id,
        usuarioId: $this->usuario->id, atorFuncionalId: $this->ator->id,
    );
});

function novaTarefa(array $extra = []): Tarefa
{
    return Tarefa::create(array_merge([
        'id_filial' => test()->filial->id,
        'tipo_ordem' => 'teste',
        'id_documento' => 1,
        'tipo_documento' => 'teste',
        'id_ator_origem' => test()->ator->id,
        'id_ator_destino' => test()->ator->id,
        'status' => 'pendente',
        'urgente' => false,
        'prioridade' => 3,
        'data_criacao' => now(),
        'descricao_resumida' => 'Tarefa teste',
    ], $extra));
}

it('entrada lista pendentes/em andamento do ator', function () {
    novaTarefa(['status' => 'pendente', 'descricao_resumida' => 'ENTRADA 1']);
    novaTarefa(['status' => 'concluida', 'descricao_resumida' => 'NAO ENTRADA']);

    $this->actingAs($this->usuario)
        ->get(route('tarefas.entrada'))
        ->assertOk()
        ->assertSee('ENTRADA 1')
        ->assertDontSee('NAO ENTRADA');
});

it('saida lista pendentes/em andamento do ator como origem', function () {
    novaTarefa(['status' => 'pendente', 'id_ator_origem' => $this->ator->id, 'descricao_resumida' => 'SAIDA 1']);

    $this->actingAs($this->usuario)
        ->get(route('tarefas.saida'))
        ->assertOk()
        ->assertSee('SAIDA 1');
});

it('historico lista concluidas do ator (origem ou destino)', function () {
    novaTarefa(['status' => 'concluida', 'descricao_resumida' => 'HIST 1', 'data_conclusao' => now()]);
    novaTarefa(['status' => 'pendente', 'descricao_resumida' => 'NAO HIST']);

    $this->actingAs($this->usuario)
        ->get(route('tarefas.historico'))
        ->assertOk()
        ->assertSee('HIST 1')
        ->assertDontSee('NAO HIST');
});

it('troca de filial so aceita filial em que o usuario tem ator', function () {
    $outraEmpresa = Empresa::create([
        'razao_social' => 'E2', 'nome_fantasia' => 'E2', 'cnpj' => '00000000000003',
        'regime_fiscal' => 'Simples', 'setor' => 'Comercio',
        'data_inicio' => now()->subYear(), 'metodo_custo' => 'XML',
    ]);
    $outraFilial = Filial::create([
        'id_empresa' => $outraEmpresa->id, 'cnpj' => '00000000000004',
        'razao_social' => 'F2', 'nome_fantasia' => 'F2',
        'data_inicio' => now()->subYear(), 'ativo' => true,
    ]);

    $this->actingAs($this->usuario)
        ->post(route('contexto.filial'), ['filial_id' => $outraFilial->id])
        ->assertForbidden();
});
