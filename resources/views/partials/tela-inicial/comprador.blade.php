@include('partials.tela-inicial._alertas', ['alertas' => [
    ['texto' => 'Ordens urgentes: ' . $contadores['ordens_pendentes'], 'rota' => route('tela', '1.1'), 'classe' => 'urg'],
    ['texto' => 'Notas com dados faltantes', 'rota' => route('tela', '5.5'), 'classe' => 'warn'],
]])
@include('partials.tela-inicial._kpis', ['kpis' => [
    ['label' => 'Notas de entrada (mês)',     'valor' => 0, 'classe' => 'info'],
    ['label' => 'Pendentes de classificação', 'valor' => 0, 'classe' => 'warn'],
    ['label' => 'Contas a pagar geradas',     'valor' => 'R$ 0', 'classe' => 'ok'],
    ['label' => 'Ordens pendentes',           'valor' => $contadores['ordens_pendentes'], 'classe' => 'info'],
]])
@include('partials.tela-inicial._acoes', ['acoes' => [
    ['texto' => 'Importar XML',           'rota' => route('tela', '5.4'), 'icone' => '📥'],
    ['texto' => 'Digitar nota',           'rota' => route('tela', '5.3'), 'icone' => '⌨️'],
    ['texto' => 'Revisar classificações', 'rota' => route('tela', '5.5'), 'icone' => '🔍'],
    ['texto' => 'Cadastrar fornecedor',   'rota' => route('tela', '5.2'), 'icone' => '🏭'],
]])
@include('partials.tela-inicial._ordens')

<section class="ti-resumo">
  <h2>📈 Últimas 5 notas importadas</h2>
  <p class="muted">Em breve — Bloco 10.</p>
</section>