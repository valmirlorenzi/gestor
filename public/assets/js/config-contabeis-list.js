(function () {
  'use strict';

  async function carregarContas() {
    const tbody = document.querySelector('#tabela-config-contabeis tbody');
    const vazio = document.getElementById('config-contabeis-vazio');
    if (!tbody || !vazio) return;

    const resp = await fetch('/api/config-contabeis', {
      headers: { 'Accept': 'application/json' },
      credentials: 'same-origin',
    });
    const contas = await resp.json();

    if (contas.length === 0) {
      tbody.innerHTML = '';
      vazio.style.display = '';
      return;
    }
    vazio.style.display = 'none';

    tbody.innerHTML = contas.map(c => {
      const badge = c.status === 'ok'
        ? '<span class="badge badge-info">OK</span>'
        : '<span class="badge badge-aviso">Pendente</span>';

      return `
        <tr>
          <td><strong>${c.codigo}</strong></td>
          <td>${c.descricao}</td>
          <td>${c.conta_referencial || '—'}</td>
          <td>${badge}</td>
          <td>
            <a href="/contador/config-contabeis/${c.id}/edit" class="btn btn-secondary">Editar</a>
          </td>
        </tr>
      `;
    }).join('');
  }

  function init() {
    carregarContas();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();