@include('partials.tela-inicial._alertas', ['alertas' => [
    ['texto' => 'Folha do mês calculada (aguardando consolidação)', 'rota' => route('tela', '10.6'), 'classe' => 'warn'],
]])
@include('partials.tela-inicial._kpis', ['kpis' => [
    ['label' => 'Funcionários ativos', 'valor' => 0,      'classe' => 'info'],
    ['label' => 'Folha do mês',        'valor' => 'R$ 0', 'classe' => 'ok'],
    ['label' => 'Encargos',            'valor' => 'R$ 0', 'classe' => 'warn'],
    ['label' => 'Provisões',           'valor' => 'R$ 0', 'classe' => 'info'],
]])
@include('partials.tela-inicial._acoes', ['acoes' => [
    ['texto' => 'Importar folha',     'rota' => route('tela', '10.6'), 'icone' => '📥'],
    ['texto' => 'Digitar folha',      'rota' => route('tela', '10.6'), 'icone' => '⌨️'],
    ['texto' => 'Consolidar folha',   'rota' => route('tela', '10.6'), 'icone' => '📦'],
    ['texto' => 'Cadastrar funcionário','rota' => route('tela', '10.4'), 'icone' => '👷'],
]])
@include('partials.tela-inicial._ordens')

<section class="ti-resumo">
  <h2>📈 Folha do mês (resumo por funcionário)</h2>
  <p class="muted">Em breve — Bloco 10.</p>
</section>