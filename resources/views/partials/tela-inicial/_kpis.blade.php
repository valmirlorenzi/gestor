@if (! empty($kpis))
  <section class="ti-kpis">
    @foreach ($kpis as $kpi)
      <div class="ti-kpi ti-kpi-{{ $kpi['classe'] ?? 'info' }}">
        <span class="ti-kpi-valor">{{ $kpi['valor'] }}</span>
        <span class="ti-kpi-label">{{ $kpi['label'] }}</span>
      </div>
    @endforeach
  </section>
@endif