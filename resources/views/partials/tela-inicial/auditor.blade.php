@include('partials.tela-inicial._alertas', ['alertas' => [
    ['texto' => 'Fechamento aguardando validação', 'rota' => route('tela', '11.8'), 'classe' => 'warn'],
    ['texto' => 'Apontamento pendente',            'rota' => route('tela', '11.6'), 'classe' => 'warn'],
]])
@include('partials.tela-inicial._kpis', ['kpis' => [
    ['label' => 'Eventos hoje',        'valor' => 0, 'classe' => 'info'],
    ['label' => 'Apontamentos abertos','valor' => 0, 'classe' => 'erro'],
    ['label' => 'Solicitações abertas','valor' => 0, 'classe' => 'warn'],
    ['label' => 'Fechamento',          'valor' => 'Aguardando', 'classe' => 'info'],
]])
@include('partials.tela-inicial._acoes', ['acoes' => [
    ['texto' => 'Consultar auditoria',  'rota' => route('tela', '11.1'), 'icone' => '📜'],
    ['texto' => 'Apontar problema',     'rota' => route('tela', '11.6'), 'icone' => '🚩'],
    ['texto' => 'Solicitar correção',   'rota' => route('tela', '11.7'), 'icone' => '✉️'],
    ['texto' => 'Validar fechamento',   'rota' => route('tela', '11.8'), 'icone' => '✔️'],
]])
@include('partials.tela-inicial._ordens')

<section class="ti-resumo">
  <h2>📈 Últimos 5 eventos</h2>
  <p class="muted">Em breve — Bloco 12.</p>
</section>