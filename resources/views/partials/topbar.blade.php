<header class="topbar">
  <div class="brand">Gestor<span> Gerencial</span></div>
  <div class="actions">
    <span class="muted" id="period-label">Período: 10/2026 (Aberto) · Filial: Matriz</span>

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