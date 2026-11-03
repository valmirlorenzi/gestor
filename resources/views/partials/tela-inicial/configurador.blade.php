@include('partials.tela-inicial._alertas', ['alertas' => []])
@include('partials.tela-inicial._kpis', ['kpis' => [
    ['label' => 'Empresas',        'valor' => $contadores['empresas']        ?? 0, 'classe' => 'info'],
    ['label' => 'Filiais',         'valor' => $contadores['filiais']         ?? 0, 'classe' => 'info'],
    ['label' => 'Usuários ativos', 'valor' => $contadores['usuarios_ativos'] ?? 0, 'classe' => 'ok'],
    ['label' => 'Handoff',         'valor' => 'Ativado',                            'classe' => 'ok'],
]])
@include('partials.tela-inicial._acoes', ['acoes' => [
    ['texto' => 'Empresa',            'rota' => route('empresa.index'), 'icone' => '🏢'],
    ['texto' => 'Filiais',            'rota' => route('filial.index'),  'icone' => '🏬'],
    ['texto' => 'Usuários e Atores',  'rota' => route('tela', '2.4'),   'icone' => '👥'],
    ['texto' => 'Handoff',            'rota' => route('tela', '2.8'),   'icone' => '🔄'],
]])
{{-- Minhas ordens: vazio para o configurador --}}
<section class="ti-resumo">
  <h2>📈 Últimas alterações</h2>
  <p class="muted">Em breve — Bloco 12 (Auditoria).</p>
</section>