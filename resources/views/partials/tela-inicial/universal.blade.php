@include('partials.tela-inicial._alertas', ['alertas' => []])
@include('partials.tela-inicial._kpis', ['kpis' => [
    ['label' => 'Ordens pendentes', 'valor' => $contadores['ordens_pendentes'], 'classe' => 'info'],
    ['label' => 'Pendências',       'valor' => $contadores['pendencias'],       'classe' => 'warn'],
    ['label' => 'Lançamentos',      'valor' => $contadores['lancamentos_pend'], 'classe' => 'info'],
    ['label' => 'Contas vencidas',  'valor' => $contadores['contas_vencidas'],  'classe' => 'erro'],
]])
@include('partials.tela-inicial._acoes', ['acoes' => [
    ['texto' => 'Caixa de Entrada', 'rota' => route('tarefas.entrada'), 'icone' => '📥'],
    ['texto' => 'Caixa de Saída',   'rota' => route('tarefas.saida'), 'icone' => '📤'],
    ['texto' => 'Histórico',        'rota' => route('tarefas.historico'), 'icone' => '🕘'],
]])
@include('partials.tela-inicial._ordens')