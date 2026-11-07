<?php

use App\Models\NotaFiscal;
use App\Models\Pessoa;
use App\Models\Usuario;
use App\Services\ImportacaoService;
use App\Services\TenantContext;
use Database\Seeders\AtorFuncionalSeeder;
use Database\Seeders\CstSeeder;
use Database\Seeders\EmpresaFilialSeeder;
use Database\Seeders\PeriodoSeeder;
use Database\Seeders\TipoDocumentoSeeder;
use Database\Seeders\UsuarioSeeder;

beforeEach(function () {
    $this->seed(EmpresaFilialSeeder::class);
    $this->seed(PeriodoSeeder::class);
    $this->seed(AtorFuncionalSeeder::class);
    $this->seed(UsuarioSeeder::class);
    $this->seed(TipoDocumentoSeeder::class);
    $this->seed(CstSeeder::class);
    // cfop: usa o importer se existir, senão pula (o teste tolera)

    $this->usuario = Usuario::withoutGlobalScopes()
        ->where('email', 'admin@gestor.local')->firstOrFail();
    app(TenantContext::class)->set(1, 1, $this->usuario->id, null);

    // Criar emitente (CNPJ do XML) e filial (CNPJ do destinatário)
    Pessoa::withoutGlobalScopes()->create([
        'id_empresa' => 1, 'tipo' => 'PJ',
        'documento' => '12345678000199', 'nome' => 'Fornecedor Exemplo', 'ativo' => true,
    ]);

    $this->service = app(ImportacaoService::class);
    $this->xml = file_get_contents(base_path('tests/fixtures/importacoes/nfe_entrada/valido.xml'));
});

test('preValidar não grava nada', function () {
    $rel = $this->service->preValidarDocumento('nfe_entrada', $this->xml);
    expect($rel->total())->toBe(1);
    expect($rel->rejeitadas())->toBe(0);
    expect(NotaFiscal::withoutGlobalScopes()->count())->toBe(0);
});

test('confirmar cria nota + log e audita', function () {
    $rel = $this->service->confirmarDocumento('nfe_entrada', $this->xml);
    expect($rel->aceitas())->toBe(1);
    expect($rel->idsCriados())->toHaveCount(1);

    $nota = NotaFiscal::withoutGlobalScopes()->find($rel->idsCriados()[0]);
    expect($nota)->not->toBeNull();
    expect($nota->chave)->toBe('35240612345678000199550010000000011000000010');
    expect($nota->direcao)->toBe('Entrada');

    $this->assertDatabaseHas('logs_importacao', [
        'id_filial' => 1, 'tipo_documento' => 'NF-e', 'status' => 'Importado',
    ]);
    $this->assertDatabaseHas('auditorias', ['acao' => 'importacao', 'tabela' => 'importacoes']);
});

test('cancelada é rejeitada', function () {
    $xml = file_get_contents(base_path('tests/fixtures/importacoes/nfe_entrada/cancelada.xml'));
    $rel = $this->service->confirmarDocumento('nfe_entrada', $xml);
    expect($rel->rejeitadas())->toBe(1);
    expect($rel->linhas[0]->motivo)->toContain('cancelada');
});

test('duplicata é rejeitada', function () {
    $this->service->confirmarDocumento('nfe_entrada', $this->xml);
    $rel = $this->service->confirmarDocumento('nfe_entrada', $this->xml);
    expect($rel->rejeitadas())->toBe(1);
    expect($rel->linhas[0]->motivo)->toContain('Duplicidade');
});
