<?php

use App\Models\CentroCusto;
use App\Models\Empresa;
use App\Models\Filial;
use App\Models\ParametroFiscal;
use App\Models\PlanoConta;
use App\Models\Usuario;
use App\Repositories\GrupoA\CentroCustoRepository;
use App\Repositories\GrupoA\PlanoContaRepository;
use App\Repositories\GrupoA\UsuarioRepository;
use App\Repositories\GrupoF\AtivoRepository;
use App\Repositories\GrupoF\FilialRepository;
use App\Repositories\GrupoF\UsuarioAtorRepository;
use App\Repositories\GrupoH\ParametroFiscalRepository;
use App\Services\TenantContext;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Validation\ValidationException;

uses(RefreshDatabase::class);

beforeEach(function () {
    app(TenantContext::class)->clear();
    // Atores funcionais (FK de usuarios_atores)
    \App\Models\AtorFuncional::create(['codigo' => 'configurador', 'descricao' => 'Configurador', 'ativo' => true]);
    \App\Models\AtorFuncional::create(['codigo' => 'administrador', 'descricao' => 'Administrador', 'ativo' => true]);
    
    // Empresa 1
    $this->empresa1 = Empresa::factory()->create(['id' => 1]);
    $this->filial1 = Filial::factory()->create(['id' => 1, 'id_empresa' => 1]);

    // Empresa 2
    $this->empresa2 = Empresa::factory()->create(['id' => 2]);
    $this->filial2 = Filial::factory()->create(['id' => 2, 'id_empresa' => 2]);

    // Registros da empresa 1
    $this->centro1 = CentroCusto::withoutGlobalScope('tenant')
        ->create(['id_empresa' => 1, 'nome' => 'CC 1', 'ativo' => true]);
    $this->plano1 = PlanoConta::withoutGlobalScope('tenant')
        ->create([
            'id_empresa' => 1, 'codigo' => '1.1.1.01', 'nivel' => 4,
            'descricao' => 'Caixa 1', 'tipo' => 'Ativo', 'natureza' => 'Analitica',
            'aceita_lancamento' => true, 'ativo' => true,
        ]);
    $this->usuario1 = Usuario::withoutGlobalScope('tenant')
        ->create([
            'id_empresa' => 1, 'nome' => 'Admin 1',
            'email' => 'admin1@test.local', 'senha_hash' => bcrypt('x'), 'ativo' => true,
        ]);

    // Registros da empresa 2
    $this->centro2 = CentroCusto::withoutGlobalScope('tenant')
        ->create(['id_empresa' => 2, 'nome' => 'CC 2', 'ativo' => true]);
    $this->plano2 = PlanoConta::withoutGlobalScope('tenant')
        ->create([
            'id_empresa' => 2, 'codigo' => '1.1.1.01', 'nivel' => 4,
            'descricao' => 'Caixa 2', 'tipo' => 'Ativo', 'natureza' => 'Analitica',
            'aceita_lancamento' => true, 'ativo' => true,
        ]);
    $this->usuario2 = Usuario::withoutGlobalScope('tenant')
        ->create([
            'id_empresa' => 2, 'nome' => 'Admin 2',
            'email' => 'admin2@test.local', 'senha_hash' => bcrypt('x'), 'ativo' => true,
        ]);
});

// =====================================================================
// GRUPO A: WHERE id_empresa = :t
// =====================================================================

it('Grupo A: isolamento de PlanoConta', function () {
    app(TenantContext::class)->setId(1);
    $repo = app(PlanoContaRepository::class);

    expect($repo->all())->toHaveCount(1);
    expect($repo->find($this->plano1->id))->not->toBeNull();
    expect($repo->find($this->plano2->id))->toBeNull();
});

it('Grupo A: isolamento de CentroCusto', function () {
    app(TenantContext::class)->setId(1);
    $repo = app(CentroCustoRepository::class);

    expect($repo->all())->toHaveCount(1);
    expect($repo->find($this->centro1->id))->not->toBeNull();
    expect($repo->find($this->centro2->id))->toBeNull();
});

it('Grupo A: sem contexto retorna vazio', function () {
    app(TenantContext::class)->clear();
    $repo = app(PlanoContaRepository::class);

    expect($repo->all())->toHaveCount(0);
});

// =====================================================================
// GRUPO F: JOIN filiais
// =====================================================================

it('Grupo F: isolamento de Filial', function () {
    app(TenantContext::class)->setId(1);
    $repo = app(FilialRepository::class);

    expect($repo->all())->toHaveCount(1);
    expect($repo->find($this->filial1->id))->not->toBeNull();
    expect($repo->find($this->filial2->id))->toBeNull();
});

// =====================================================================
// GRUPO H: híbrido
// =====================================================================

it('Grupo H: globais aparecem para todas as empresas', function () {
    app(TenantContext::class)->clear();

    $p = ParametroFiscal::create([
        'id_empresa' => null,
        'tipo_imposto' => 'ICMS',
        'descricao' => 'Global',
        'aliquota' => 18,
        'data_inicio_validade' => now()->toDateString(),
    ]);

    dump('ID criado:', $p->id);
    dump('Sem escopo (todos):', ParametroFiscal::withoutGlobalScope('tenant_hibrido')->count());
    dump('Com escopo, sem contexto:', ParametroFiscal::count());

    app(TenantContext::class)->setId(1);
    dump('Com escopo, contexto 1:', ParametroFiscal::count());
    dump('vigentes(1):', app(ParametroFiscalRepository::class)->vigentes('ICMS')->toArray());

    expect(app(ParametroFiscalRepository::class)->vigentes('ICMS'))->toHaveCount(1);
});

it('Grupo H: override de uma empresa NÃO vaza para outra', function () {
    ParametroFiscal::create([
        'id_empresa' => null, 'tipo_imposto' => 'ICMS', 'descricao' => 'Global',
        'aliquota' => 18, 'data_inicio_validade' => now()->toDateString(),
    ]);
    ParametroFiscal::create([
        'id_empresa' => 1, 'tipo_imposto' => 'ICMS', 'descricao' => 'Override E1',
        'aliquota' => 20, 'data_inicio_validade' => now()->toDateString(),
    ]);

    app(TenantContext::class)->setId(1);
    expect(app(ParametroFiscalRepository::class)->vigentes('ICMS'))->toHaveCount(2);

    app(TenantContext::class)->setId(2);
    expect(app(ParametroFiscalRepository::class)->vigentes('ICMS'))->toHaveCount(1);
});

// =====================================================================
// P23: Ativo × Centro de Custo
// =====================================================================

it('P23: rejeita centro de custo de outra empresa', function () {
    app(TenantContext::class)->setId(1);
    $repo = app(AtivoRepository::class);

    expect(fn () => $repo->create([
        'id_filial' => 1,
        'descricao' => 'Ativo X',
        'data_aquisicao' => now()->toDateString(),
        'valor_original' => 1000,
        'vida_util_meses' => 60,
        'metodo_depreciacao' => 'Linear',
        'mes_inicial_depreciacao' => now()->format('m/Y'),
        'id_centro_custo' => $this->centro2->id, // empresa 2!
        'destino' => 'Custo',
        'status' => 'Em uso',
    ]))->toThrow(ValidationException::class);
});

it('P23: aceita centro de custo da mesma empresa', function () {
    app(TenantContext::class)->setId(1);
    $repo = app(AtivoRepository::class);

    $ativo = $repo->create([
        'id_filial' => 1,
        'descricao' => 'Ativo OK',
        'data_aquisicao' => now()->toDateString(),
        'valor_original' => 1000,
        'vida_util_meses' => 60,
        'metodo_depreciacao' => 'Linear',
        'mes_inicial_depreciacao' => now()->format('m/Y'),
        'id_centro_custo' => $this->centro1->id,
        'destino' => 'Custo',
        'status' => 'Em uso',
    ]);

    expect($ativo)->not->toBeNull();
});

// =====================================================================
// P45: UsuarioAtor × Filial
// =====================================================================

it('P45: rejeita ator de usuário em filial de outra empresa', function () {
    app(TenantContext::class)->setId(1);
    $repo = app(UsuarioAtorRepository::class);

    expect(fn () => $repo->create([
        'id_usuario' => $this->usuario2->id, // empresa 2
        'id_filial' => 1,                    // empresa 1
        'id_ator_funcional' => 1,
        'ativo' => true,
    ]))->toThrow(ValidationException::class);
});

it('P45: aceita usuário e filial da mesma empresa', function () {
    app(TenantContext::class)->setId(1);
    $repo = app(UsuarioAtorRepository::class);

    $ua = $repo->create([
        'id_usuario' => $this->usuario1->id,
        'id_filial' => 1,
        'id_ator_funcional' => 1,
        'ativo' => true,
    ]);

    expect($ua)->not->toBeNull();
});