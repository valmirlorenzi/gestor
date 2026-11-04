<header class="topbar">
  <div class="brand">Gestor<span> Gerencial</span></div>
  <div class="actions">
    <span class="muted" id="period-label">Período: 10/2026 (Aberto)</span>
    @if (! empty($filiaisDisponiveis) && count($filiaisDisponiveis) > 1)
      <form method="POST" action="{{ route('contexto.filial') }}" class="filial-switcher">
        @csrf
        <label for="filial-select" class="sr-only">Filial</label>
        <select name="filial_id" id="filial-select" onchange="this.form.submit()">
          @foreach ($filiaisDisponiveis as $f)
            <option value="{{ $f['id'] }}" @selected($f['id'] === $filialAtualId)>
              {{ $f['nome'] }}
            </option>
          @endforeach
        </select>
      </form>
    @elseif (! empty($filiaisDisponiveis) && count($filiaisDisponiveis) === 1)
      <span class="filial-label">{{ $filiaisDisponiveis[0]['nome'] }}</span>
    @endif
    <div id="seletor-ator-container"></div>

    <div class="theme-switcher">
      <button onclick="setTheme('modern')" class="active" id="btn-modern">Moderno</button>
      <button onclick="setTheme('classic')" id="btn-classic">Clássico</button>
      <button onclick="setTheme('retro')" id="btn-retro">Desktop</button>
    </div>

    <div class="font-switcher" role="group" aria-label="Tamanho da fonte">
      <button data-fonte="pequena" onclick="setFonte('pequena')" title="Fonte pequena" aria-label="Fonte pequena">A-</button>
      <button data-fonte="media"   onclick="setFonte('media')"   title="Fonte média"   aria-label="Fonte média">A</button>
      <button data-fonte="grande"  onclick="setFonte('grande')"  title="Fonte grande"  aria-label="Fonte grande">A+</button>
      <button data-fonte="extra"   onclick="setFonte('extra')"   title="Fonte extra grande" aria-label="Fonte extra grande">A++</button>
    </div>
  </div>
</header>