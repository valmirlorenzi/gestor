@include('partials.tela-inicial._alertas', ['alertas' => [
    ['texto' => 'Saídas pendentes de validação',   'rota' => route('tela', '9.1'), 'classe' => 'warn'],
    ['texto' => 'Entradas pendentes de validação', 'rota' => route('tela', '9.2'), 'classe' => 'warn'],
]])
@include('partials.tela-inicial._kpis', ['kpis' => [
    ['label' => 'Saídas pendentes',   'valor' => 'R$ 0', 'classe' => 'warn'],
    ['label' => 'Entradas pendentes', 'valor' => 'R$ 0', 'classe' => 'warn'],
    ['label' => 'Confirmadas hoje',   'valor' => 0,      'classe' => 'ok'],
    ['label' => 'Rejeitadas',         'valor' => 0,      'classe' => 'erro'],
]])
@include('partials.tela-inicial._acoes', ['acoes' => [
    ['texto' => 'Validar saídas',   'rota' => route('tela', '9.1'), 'icone' => '🔒'],
    ['texto' => 'Validar entradas', 'rota' => route('tela', '9.2'), 'icone' => '🔓'],
    ['texto' => 'Posição de caixa', 'rota' => route('tela', '3.8'), 'icone' => '💰'],
]])
@include('partials.tela-inicial._ordens')

<section class="ti-resumo">
  <h2>📈 Últimas 5 movimentações validadas</h2>
  <p class="muted">Em breve — Bloco 10.</p>
</section>