@include('partials.tela-inicial._alertas', ['alertas' => [
    ['texto' => 'Contas vencidas',        'rota' => route('tela', '7.2'), 'classe' => 'erro'],
    ['texto' => 'Contas a pagar hoje',    'rota' => route('tela', '7.2'), 'classe' => 'warn'],
]])
@include('partials.tela-inicial._kpis', ['kpis' => [
    ['label' => 'Em aberto',     'valor' => 'R$ 0', 'classe' => 'info'],
    ['label' => 'Vencidas',      'valor' => 'R$ 0', 'classe' => 'erro'],
    ['label' => 'Pagas no mês',  'valor' => 'R$ 0', 'classe' => 'ok'],
    ['label' => 'Contas abertas','valor' => 0,      'classe' => 'info'],
]])
@include('partials.tela-inicial._acoes', ['acoes' => [
    ['texto' => 'Pagar conta',      'rota' => route('tela', '7.3'), 'icone' => '💳'],
    ['texto' => 'Contas a pagar',   'rota' => route('tela', '7.2'), 'icone' => '📄'],
    ['texto' => 'Posição de caixa', 'rota' => route('tela', '3.8'), 'icone' => '💰'],
    ['texto' => 'Tabelas basais',   'rota' => route('tela', '7.1'), 'icone' => '📋'],
]])
@include('partials.tela-inicial._ordens')

<section class="ti-resumo">
  <h2>📈 Próximos vencimentos (7 dias)</h2>
  <p class="muted">Em breve — Bloco 10.</p>
</section>