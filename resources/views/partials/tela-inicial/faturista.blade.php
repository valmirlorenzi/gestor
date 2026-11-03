@include('partials.tela-inicial._alertas', ['alertas' => [
    ['texto' => 'Nota com aviso (chave ausente)', 'rota' => route('tela', '6.5'), 'classe' => 'warn'],
]])
@include('partials.tela-inicial._kpis', ['kpis' => [
    ['label' => 'Notas de saída (mês)',       'valor' => 0, 'classe' => 'info'],
    ['label' => 'Pendentes de classificação', 'valor' => 0, 'classe' => 'warn'],
    ['label' => 'Contas a receber geradas',   'valor' => 'R$ 0', 'classe' => 'ok'],
    ['label' => 'Ordens pendentes',           'valor' => $contadores['ordens_pendentes'], 'classe' => 'info'],
]])
@include('partials.tela-inicial._acoes', ['acoes' => [
    ['texto' => 'Importar XML',           'rota' => route('tela', '6.4'), 'icone' => '📤'],
    ['texto' => 'Digitar nota',           'rota' => route('tela', '6.3'), 'icone' => '⌨️'],
    ['texto' => 'Revisar classificações', 'rota' => route('tela', '6.5'), 'icone' => '🔍'],
    ['texto' => 'Cadastrar cliente',      'rota' => route('tela', '6.2'), 'icone' => '🧑‍💼'],
]])
@include('partials.tela-inicial._ordens')

<section class="ti-resumo">
  <h2>📈 Últimas 5 notas emitidas</h2>
  <p class="muted">Em breve — Bloco 10.</p>
</section>