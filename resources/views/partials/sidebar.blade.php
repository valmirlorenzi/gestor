<aside class="sidebar" id="sidebar">
  <div class="sidebar-header">
    <span class="muted user-name" id="user-label">{{ $usuarioJson['nome'] ?? 'Visitante' }}</span>
    <div class="toggle-btn" onclick="toggleSidebar()">☰</div>
  </div>

  <div class="goto-wrap">
    <input
      type="text"
      id="goto-input"
      class="goto-input"
      placeholder="Ir para: 4.10 (Ctrl+K)"
      autocomplete="off"
      aria-label="Ir para item do menu"
    >
    <div id="goto-feedback" class="goto-feedback" role="status" aria-live="polite"></div>
  </div>

  <div class="menu-acoes">
    <button type="button" onclick="expandirTodos()">Expandir todos</button>
    <button type="button" onclick="recolherTodos()">Recolher todos</button>
  </div>

  <nav class="menu" id="menu">
    {{-- preenchido via JS (menu.js) --}}
  </nav>

  @if ($menuJson !== null)
    <script>
      window.__MENU__    = @json($menuJson);
      window.__USUARIO__ = @json($usuarioJson);
      window.__BLOCOS__  = @json($blocosJson);
    </script>
  @endif
</aside>