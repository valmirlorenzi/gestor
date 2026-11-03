(function () {
  'use strict';

  async function carregarCentros() {
    const tbody = document.querySelector('#tabela-centros-custo tbody');
    const vazio = document.getElementById('centro-custo-vazio');
    if (!tbody || !vazio) return;

    const resp = await fetch('/api/centros-custo', {
      headers: { 'Accept': 'application/json' },
      credentials: 'same-origin',
    });
    const centros = await resp.json();

    if (centros.length === 0) {
      tbody.innerHTML = '';
      vazio.style.display = '';
      return;
    }
    vazio.style.display = 'none';

    tbody.innerHTML = centros.map(c => `
      <tr>
        <td>${c.nome}</td>
        <td>${c.responsavel || '—'}</td>
        <td>${c.ativo ? 'Sim' : 'Não'}</td>
        <td>
          <a href="/centros-custo/${c.id}/edit" class="btn btn-sm btn-secondary">Editar</a>
        </td>
      </tr>
    `).join('');
  }

  function init() {
    carregarCentros();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();