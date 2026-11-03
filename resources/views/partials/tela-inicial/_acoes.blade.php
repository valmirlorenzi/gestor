@if (! empty($acoes))
  <section class="ti-acoes">
    <h2>⚡ Ações rápidas</h2>
    <div class="ti-acoes-grid">
      @foreach ($acoes as $a)
        <a href="{{ $a['rota'] }}" class="ti-acao">
          <span class="ti-acao-icone">{{ $a['icone'] ?? '•' }}</span>
          <span class="ti-acao-texto">{{ $a['texto'] }}</span>
        </a>
      @endforeach
    </div>
  </section>
@endif