(function () {
  'use strict';

  async function carregarEmpresas() {
    const tbody = document.querySelector('#tabela-empresas tbody');
    const vazio = document.getElementById('empresa-vazio');
    if (!tbody || !vazio) return;

    const resp = await fetch('/api/empresas', {
      headers: { 'Accept': 'application/json' },
      credentials: 'same-origin',
    });
    const empresas = await resp.json();

    if (empresas.length === 0) {
      tbody.innerHTML = '';
      vazio.style.display = '';
      return;
    }
    vazio.style.display = 'none';

    tbody.innerHTML = empresas.map(e => `
      <tr>
        <td>${e.cnpj}</td>
        <td>${e.razao_social}</td>
        <td>${e.regime_fiscal}</td>
        <td>${e.setor}</td>
        <td>
          <a href="/empresa/${e.id}/edit" class="btn btn-sm btn-secondary">Editar</a>
        </td>
      </tr>
    `).join('');
  }

  function init() {
    carregarEmpresas();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();