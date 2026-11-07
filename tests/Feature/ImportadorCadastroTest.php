<?php

use App\Importacoes\CabecalhoInvalidoException;
use App\Importacoes\GravadorLinha;
use App\Importacoes\RelatorioCarga;
use App\Models\AtorFuncional;
use App\Models\Auditoria;
use App\Models\CentroCusto;
use App\Models\Usuario;
use App\Repositories\BaseRepository;
use App\Repositories\GrupoA\CentroCustoRepository;
use App\Services\ImportacaoService;
use App\Services\TenantContext;
use Database\Seeders\AtorFuncionalSeeder;
use Database\Seeders\EmpresaFilialSeeder;
use Database\Seeders\UsuarioSeeder;

beforeEach(function () {
    $this->seed(EmpresaFilialSeeder::class);
    $this->seed(AtorFuncionalSeeder::class);
    $this->seed(UsuarioSeeder::class);

    $this->usuario = Usuario::withoutGlobalScopes()
        ->where('email', 'admin@gestor.local')->firstOrFail();
    app(TenantContext::class)->set(1, 1, $this->usuario->id, null);

    $this->service = app(ImportacaoService::class);
    $this->csv = file_get_contents(base_path('tests/fixtures/importacoes/centros_custo.csv'));
});

test('lista recursos para o configurador', function () {
    $recursos = $this->service->recursosDisponiveisParaAtor(
        AtorFuncional::where('codigo', 'configurador')->value('id')
    );
    expect($recursos)->toHaveKey('centros_custo');
});

test('lista recursos para o contador (inclui centros_custo)', function () {
    $recursos = $this->service->recursosDisponiveisParaAtor(
        AtorFuncional::where('codigo', 'contador')->value('id')
    );
    expect($recursos)->toHaveKey('centros_custo');
});

test('lista recursos para ator não autorizado (não inclui centros_custo)', function () {
    $recursos = $this->service->recursosDisponiveisParaAtor(
        AtorFuncional::where('codigo', 'financeiro1')->value('id')
    );
    expect($recursos)->not->toHaveKey('centros_custo');
});

test('pré-validação não grava nada', function () {
    $rel = $this->service->preValidar('centros_custo', $this->csv, 'inserir');
    expect($rel)->toBeInstanceOf(RelatorioCarga::class);
    expect($rel->total())->toBe(4);
    expect($rel->aceitas())->toBe(3);
    expect($rel->rejeitadas())->toBe(1);
    expect(CentroCusto::withoutGlobalScopes()->count())->toBe(0);
});

test('confirmação modo inserir cria centros', function () {
    $rel = $this->service->confirmar('centros_custo', $this->csv, 'inserir');
    expect($rel->aceitas())->toBe(3);
    expect($rel->idsCriados())->toHaveCount(3);
    expect(CentroCusto::withoutGlobalScopes()->where('id_empresa', 1)->count())->toBe(3);
});

test('inserir falha quando já existe (unique por id_empresa+nome)', function () {
    CentroCusto::create(['id_empresa' => 1, 'nome' => 'Comercial', 'ativo' => true]);
    $rel = $this->service->confirmar('centros_custo', $this->csv, 'inserir');
    expect($rel->rejeitadas())->toBeGreaterThanOrEqual(2); // a existente + a inválida (sem nome)
});

test('atualizar funciona em existentes e falha em novos', function () {
    CentroCusto::create(['id_empresa' => 1, 'nome' => 'Comercial', 'responsavel' => 'Antigo', 'ativo' => true]);
    $rel = $this->service->confirmar('centros_custo', $this->csv, 'atualizar');
    expect($rel->aceitas())->toBeGreaterThanOrEqual(1);
    expect($rel->rejeitadas())->toBeGreaterThanOrEqual(2); // Operações/Administrativo não existem + inválida
    $cc = CentroCusto::withoutGlobalScopes()->where('id_empresa', 1)->where('nome', 'Comercial')->first();
    expect($cc->responsavel)->toBe('João Silva');
});

test('upsert cria novos e atualiza existentes', function () {
    CentroCusto::create(['id_empresa' => 1, 'nome' => 'Comercial', 'responsavel' => 'Antigo', 'ativo' => true]);
    $rel = $this->service->confirmar('centros_custo', $this->csv, 'upsert');
    expect($rel->aceitas())->toBe(3);
    expect(CentroCusto::withoutGlobalScopes()->where('id_empresa', 1)->count())->toBe(3);
    $cc = CentroCusto::withoutGlobalScopes()->where('id_empresa', 1)->where('nome', 'Comercial')->first();
    expect($cc->responsavel)->toBe('João Silva');
});

test('GravadorLinha devolve null quando o repositório lança (e o caller marca rejeitada)', function () {
    // Mock do repositório: create() lança na 2ª chamada, sucede na 1ª e 3ª.
    $real = app(CentroCustoRepository::class);
    $mock = Mockery::mock(BaseRepository::class);
    $ids = [1, 2, 3];
    $chamadas = 0;
    $mock->shouldReceive('create')->andReturnUsing(function () use (&$chamadas, $ids) {
        $chamadas++;
        if ($chamadas === 2) {
            throw new RuntimeException('Falha simulada no DB');
        }
        $m = new CentroCusto;
        $m->id = $ids[$chamadas - 1];

        return $m;
    });
    $mock->shouldReceive('existsByChaveNatural')->andReturn(false);

    $gravador = app(GravadorLinha::class);
    $meta = config('importacoes')['centros_custo'];

    $r1 = $gravador->gravar(1, ['nome' => 'OK1', 'responsavel' => '', 'ativo' => '1'], $meta, 'inserir', $mock, 1);
    $r2 = $gravador->gravar(2, ['nome' => 'OK2', 'responsavel' => '', 'ativo' => '1'], $meta, 'inserir', $mock, 1);
    $r3 = $gravador->gravar(3, ['nome' => 'OK3', 'responsavel' => '', 'ativo' => '1'], $meta, 'inserir', $mock, 1);

    expect($r1)->toBe(1);
    expect($r2)->toBeNull();   // falha na 2ª → null
    expect($r3)->toBe(3);      // 3ª continua
});

test('auditoria registrada com acao=importacao', function () {
    $this->service->confirmar('centros_custo', $this->csv, 'inserir');
    $aud = Auditoria::where('acao', 'importacao')->where('tabela', 'importacoes')->first();
    expect($aud)->not->toBeNull();
    expect($aud->justificativa)->toBe('Carga inicial: Centros de Custo (inserir)');
    expect($aud->dados_anteriores)->toHaveKeys(['recurso', 'modo', 'total', 'aceitas', 'avisos', 'rejeitadas']);
    expect($aud->dados_novos)->toHaveKey('ids');
    expect(count($aud->dados_novos['ids']))->toBe(3);
});

test('cabeçalho inválido rejeita arquivo inteiro', function () {
    $this->expectException(CabecalhoInvalidoException::class);
    $this->service->preValidar('centros_custo', "foo;bar\n1;2\n", 'inserir');
});

test('isolamento: recurso não vaza entre empresas', function () {
    // Empresa 1 importa 3 centros
    $this->service->confirmar('centros_custo', $this->csv, 'inserir');

    // Troca para empresa 2
    app(TenantContext::class)->set(2, 3, $this->usuario->id, null);
    $this->service->confirmar('centros_custo', "nome;responsavel;ativo\nA;;1\nB;;1\n", 'inserir');

    expect(CentroCusto::withoutGlobalScopes()->where('id_empresa', 1)->count())->toBe(3);
    expect(CentroCusto::withoutGlobalScopes()->where('id_empresa', 2)->count())->toBe(2);
});
