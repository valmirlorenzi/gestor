@include('partials.tela-inicial._alertas', ['alertas' => [
    ['texto' => 'Cliente inadimplente',   'rota' => route('tela', '8.2'), 'classe' => 'erro'],
    ['texto' => 'Contas a receber hoje',  'rota' => route('tela', '8.2'), 'classe' => 'warn'],
]])
@include('partials.tela-inicial._kpis', ['kpis' => [
    ['label' => 'Em aberto',       'valor' => 'R$ 0', 'classe' => 'info'],
    ['label' => 'Inadimplência',   'valor' => 'R$ 0', 'classe' => 'erro'],
    ['label' => 'Recebido no mês', 'valor' => 'R$ 0', 'classe' => 'ok'],
    ['label' => 'Contas abertas',  'valor' => 0,      'classe' => 'info'],
]])
@include('partials.tela-inicial._acoes', ['acoes' => [
    ['texto' => 'Receber conta',     'rota' => route('tela', '8.3'), 'icone' => '💵'],
    ['texto' => 'Contas a receber',  'rota' => route('tela', '8.2'), 'icone' => '📄'],
    ['texto' => 'Inadimplência',     'rota' => route('tela', '8.2'), 'icone' => '⚠️'],
    ['texto' => 'Tabelas basais',    'rota' => route('tela', '8.1'), 'icone' => '📋'],
]])
@include('partials.tela-inicial._ordens')

<section class="ti-resumo">
  <h2>📈 Próximos vencimentos + inadimplência</h2>
  <p class="muted">Em breve — Bloco 10.</p>
</section>