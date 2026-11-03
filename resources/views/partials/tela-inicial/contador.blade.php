@include('partials.tela-inicial._alertas', ['alertas' => [
    ['texto' => $contadores['lancamentos_pend'] . ' lançamentos não classificados', 'rota' => route('tela', '4.7'), 'classe' => 'warn'],
    ['texto' => 'Fechamento aguardando validação',                                  'rota' => route('tela', '4.11'), 'classe' => 'info'],
]])
@include('partials.tela-inicial._kpis', ['kpis' => [
    ['label' => 'Lançamentos pendentes', 'valor' => $contadores['lancamentos_pend'], 'classe' => 'warn'],
    ['label' => 'Conflitos',             'valor' => 0,                               'classe' => 'erro'],
    ['label' => 'Pendências (Erro)',     'valor' => $contadores['pendencias'],       'classe' => 'erro'],
    ['label' => 'Fechamento',            'valor' => 'Aguardando',                    'classe' => 'info'],
]])
@include('partials.tela-inicial._acoes', ['acoes' => [
    ['texto' => 'Revisar lançamentos', 'rota' => route('tela', '4.7'),  'icone' => '🔍'],
    ['texto' => 'Validar cálculos',    'rota' => route('tela', '4.8'),  'icone' => '✔️'],
    ['texto' => 'Ver pendências',      'rota' => route('tela', '4.9'),  'icone' => '⚠️'],
    ['texto' => 'Preparar fechamento', 'rota' => route('tela', '4.10'), 'icone' => '📦'],
]])
@include('partials.tela-inicial._ordens')

<section class="ti-resumo">
  <h2>📈 Timeline do fechamento</h2>
  <p class="muted">Em breve — Bloco 13 (serviço de fechamento).</p>
</section>