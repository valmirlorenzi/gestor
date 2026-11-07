<?php

use App\Importacoes\ImportadorDocumentoGenerico;
use App\Models\NotaFiscal;
use App\Models\Pessoa;
use App\Models\Periodo;
use App\Models\ServicoLc116;
use App\Models\Usuario;
use App\Services\TenantContext;

beforeEach(function () {
    $this->seed(\Database\Seeders\EmpresaFilialSeeder::class);
    $this->seed(\Database\Seeders\AtorFuncionalSeeder::class);
    $this->seed(\Database\Seeders\UsuarioSeeder::class);
    $this->seed(\Database\Seeders\TipoDocumentoSeeder::class);

    $this->usuario = Usuario::withoutGlobalScopes()->where('email', 'admin@gestor.local')->firstOrFail();
    app(TenantContext::class)->set(1, 1, $this->usuario->id, null);
    $this->actingAs($this->usuario);

    // Prestador/tomador 12345678000199 (pode ou não vir do EmpresaFilialSeeder).
    $p = Pessoa::withoutGlobalScopes()->where('documento', '12345678000199')->first();
    if ($p === null) {
        $p = Pessoa::withoutGlobalScopes()->create([
            'id_empresa' => 1,
            'tipo' => 'PJ',
            'documento' => '12345678000199',
            'nome' => 'Prestador/Tomador Exemplo',
        ]);
    }
    $this->pessoa = $p;

    // Empresa (tomador na tomada / prestador na prestada).
    if (Pessoa::withoutGlobalScopes()->where('documento', '11111111111111')->first() === null) {
        Pessoa::withoutGlobalScopes()->create([
            'id_empresa' => 1,
            'tipo' => 'PJ',
            'documento' => '11111111111111',
            'nome' => 'Empresa Exemplo Ltda.',
        ]);
    }

    // LC116 usados nos fixtures (07.02 na tomada; 01.01 na prestada).
    ServicoLc116::withoutGlobalScopes()->firstOrCreate(['codigo' => '07.02'], ['descricao' => 'Manutenção de software']);
    ServicoLc116::withoutGlobalScopes()->firstOrCreate(['codigo' => '01.01'], ['descricao' => 'Análise e desenvolvimento de sistemas']);
    $this->servico = ServicoLc116::withoutGlobalScopes()->where('codigo', '07.02')->firstOrFail();

    // Período 11/2026 aberto na filial do contexto (fixtures usam 2026-11-01).
    Periodo::withoutGlobalScopes()->firstOrCreate(
        ['id_filial' => 1, 'mes_ano' => '11/2026'],
        ['status' => 'Aberto'],
    );
});

function xmlFixture(string $caminho): string
{
    return file_get_contents(base_path("tests/fixtures/importacoes/{$caminho}"));
}

it('importa NFS-e tomada como Entrada', function () {
    $rel = app(ImportadorDocumentoGenerico::class)
        ->confirmar('nfse_tomada', xmlFixture('nfse_tomada/valido.xml'));

    expect($rel->rejeitadas())->toBe(0)
        ->and($rel->aceitas() + $rel->avisos())->toBe(1);

    $nota = NotaFiscal::withoutGlobalScopes()
        ->where('chave', '35240612345678000199000000000000000000000001')
        ->firstOrFail();

    expect($nota->direcao)->toBe('Entrada')
        ->and($nota->id_pessoa_emitente)->toBe($this->pessoa->id)   // prestador
        ->and($nota->id_pessoa_destinatario)->not->toBeNull();      // tomador (empresa)

    $item = $nota->itens()->firstOrFail();
    expect($item->id_servico_lc116)->toBe($this->servico->id)
        ->and($item->id_cfop)->toBeNull()
        ->and($item->id_ncm)->toBeNull();
});

it('importa NFS-e prestada como Saida', function () {
    $rel = app(ImportadorDocumentoGenerico::class)
        ->confirmar('nfse_prestada', xmlFixture('nfse_prestada/valido.xml'));

    expect($rel->rejeitadas())->toBe(0);

    $nota = NotaFiscal::withoutGlobalScopes()
        ->where('chave', '35240611111111000199000000000000000000000010')
        ->firstOrFail();

    expect($nota->direcao)->toBe('Saida')
        ->and($nota->id_pessoa_emitente)->toBeNull()
        ->and($nota->id_pessoa_destinatario)->toBe($this->pessoa->id); // tomador = pessoa

    $servico0101 = ServicoLc116::withoutGlobalScopes()->where('codigo', '01.01')->firstOrFail();
    expect($nota->itens()->firstOrFail()->id_servico_lc116)->toBe($servico0101->id);
});

it('rejeita NFS-e duplicada', function () {
    app(ImportadorDocumentoGenerico::class)
        ->confirmar('nfse_tomada', xmlFixture('nfse_tomada/valido.xml'));

    $rel = app(ImportadorDocumentoGenerico::class)
        ->confirmar('nfse_tomada', xmlFixture('nfse_tomada/valido.xml'));

    expect($rel->rejeitadas())->toBe(1);
});

it('aceita LC116 desconhecido (id_servico_lc116 = null)', function () {
    $xml = str_replace(
        '<ItemListaServico>07.02</ItemListaServico>',
        '<ItemListaServico>99.99</ItemListaServico>',
        xmlFixture('nfse_tomada/valido.xml'),
    );

    $rel = app(ImportadorDocumentoGenerico::class)->confirmar('nfse_tomada', $xml);
    expect($rel->rejeitadas())->toBe(0);

    $nota = NotaFiscal::withoutGlobalScopes()
        ->where('chave', '35240612345678000199000000000000000000000001')
        ->firstOrFail();

    expect($nota->itens()->firstOrFail()->id_servico_lc116)->toBeNull();
});