@if ($ordens->isNotEmpty())
  <section class="ti-ordens">
    <header class="ti-section-header">
      <h2>📥 Minhas ordens</h2>
      <a href="{{ route('tarefas.entrada') }}" class="ti-link">Ver todas →</a>      
    </header>
    <ul class="ti-ordens-lista">
      @foreach ($ordens as $ordem)
        <li class="ti-ordem {{ $ordem->urgente ? 'urgente' : '' }}">
          <span class="ti-ordem-id">O{{ $ordem->id }}</span>
          <span class="ti-ordem-desc">{{ $ordem->descricao_resumida ?? '—' }}</span>
          <span class="ti-ordem-status">{{ $ordem->status }}</span>
          @if ($ordem->urgente)
            <span class="badge urgent">urgente</span>
          @endif
        </li>
      @endforeach
    </ul>
  </section>
@endif