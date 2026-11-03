@include('partials.tela-inicial._alertas', ['alertas' => [
    ['texto' => 'Lançamentos não classificados', 'rota' => route('tela', '4.7'), 'classe' => 'warn'],
    ['texto' => 'Contas vencidas',                'rota' => route('tela', '7.2'), 'classe' => 'erro'],
]])
@include('partials.tela-inicial._kpis', ['kpis' => [
    ['label' => 'Receita líquida',  'valor' => '—', 'classe' => 'info'], // Bloco 11
    ['label' => 'Lucro líquido',    'valor' => '—', 'classe' => 'ok'],
    ['label' => 'Saldo de caixa',   'valor' => '—', 'classe' => 'info'],
    ['label' => 'Margem líquida',   'valor' => '—', 'classe' => 'ok'],
]])
@include('partials.tela-inicial._acoes', ['acoes' => [
    ['texto' => 'Ver DRE',           'rota' => route('tela', '3.1'),  'icone' => '📈'],
    ['texto' => 'Posição de caixa',  'rota' => route('tela', '3.8'),  'icone' => '💰'],
    ['texto' => 'Fluxo de caixa',    'rota' => route('tela', '3.4'),  'icone' => '💵'],
    ['texto' => 'Exportar relatório','rota' => route('tela', '3.7'),  'icone' => '📤'],
]])

{{-- Card do Conselheiro (3.11) --}}
<section class="ti-conselheiro">
  <header class="ti-section-header">
    <h2>💡 Sugestões do Conselheiro</h2>
    <a href="{{ route('tela', '3.18') }}" class="ti-link">Ver todas →</a>
  </header>
  <p class="muted">Nenhuma sugestão no momento.</p>
</section>

{{-- Resumo: mini-DRE (placeholder — Bloco 11) --}}
<section class="ti-resumo">
  <h2>📈 Mini-DRE</h2>
  <p class="muted">Em breve — Bloco 11 (DRE Gerencial).</p>
</section>