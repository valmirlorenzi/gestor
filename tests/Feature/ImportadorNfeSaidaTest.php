<?php

use App\Models\AtorFuncional;
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

    $this->usuario = Usuario::withoutGlobalScopes()
        ->where('email', 'admin@gestor.local')->firstOrFail();
    app(TenantContext::class)->set(1, 1, $this->usuario->id, null);

    // Cliente (destinatário da saída)
    Pessoa::withoutGlobalScopes()->create([
        'id_empresa' => 1, 'tipo' => 'PJ',
        'documento' => '12345678000199', 'nome' => 'Cliente Exemplo', 'ativo' => true,
    ]);

    $this->service = app(ImportacaoService::class);
    $this->xml = file_get_contents(base_path('tests/fixtures/importacoes/nfe_saida/valido.xml'));
});

test('nfe_saida está no config e no mapa de recursos do faturista', function () {
    $recursos = $this->service->recursosDocumentoParaAtor(
        AtorFuncional::where('codigo', 'faturista')->value('id')
    );
    expect($recursos)->toHaveKey('nfe_saida');
    expect($recursos['nfe_saida']['direcao'])->toBe('Saida');
});

test('preValidar nfe_saida não grava', function () {
    $rel = $this->service->preValidarDocumento('nfe_saida', $this->xml);
    expect($rel->total())->toBe(1);
    expect($rel->rejeitadas())->toBe(0);
    expect(NotaFiscal::withoutGlobalScopes()->count())->toBe(0);
});

test('confirmar nfe_saida cria nota com direcao Saida', function () {
    $rel = $this->service->confirmarDocumento('nfe_saida', $this->xml);
    expect($rel->aceitas())->toBe(1);
    expect($rel->idsCriados())->toHaveCount(1);

    $nota = NotaFiscal::withoutGlobalScopes()->find($rel->idsCriados()[0]);
    expect($nota->direcao)->toBe('Saida');
    expect($nota->chave)->toBe('35240611111111000111550010000000021000000020');
    expect($nota->id_filial)->toBe(1);
    expect($nota->id_pessoa_emitente)->toBeNull();
    expect($nota->id_pessoa_destinatario)->not->toBeNull();

    $this->assertDatabaseHas('logs_importacao', [
        'id_filial' => 1, 'tipo_documento' => 'NF-e', 'status' => 'Importado',
    ]);
});

test('duplicata de nfe_saida é rejeitada', function () {
    $this->service->confirmarDocumento('nfe_saida', $this->xml);
    $rel = $this->service->confirmarDocumento('nfe_saida', $this->xml);
    expect($rel->rejeitadas())->toBe(1);
    expect($rel->linhas[0]->motivo)->toContain('Duplicidade');
});
