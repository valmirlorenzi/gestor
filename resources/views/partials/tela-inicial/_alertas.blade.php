@if (! empty($alertas))
  <section class="ti-alertas">
    <h2>🔔 Alertas</h2>
    <ul>
      @foreach ($alertas as $a)
        <li class="ti-alerta ti-alerta-{{ $a['classe'] ?? 'info' }}">
          @if (! empty($a['rota']))
            <a href="{{ $a['rota'] }}">{{ $a['texto'] }}</a>
          @else
            {{ $a['texto'] }}
          @endif
        </li>
      @endforeach
    </ul>
  </section>
@endif