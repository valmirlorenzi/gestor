/* ============================================================
   FILIAL-LIST.JS — Listagem de filiais (Blade + API)
   ============================================================ */

(function () {
  'use strict';

  async function carregarFiliais() {
    const tbody = document.querySelector('#tabela-filiais tbody');
    const vazio = document.getElementById('filial-vazio');
    if (!tbody || !vazio) return;

    const resp = await fetch('/api/filiais', {
      headers: { 'Accept': 'application/json' },
      credentials: 'same-origin',
    });
    const filiais = await resp.json();

    if (filiais.length === 0) {
      tbody.innerHTML = '';
      vazio.style.display = '';
      return;
    }
    vazio.style.display = 'none';

    tbody.innerHTML = filiais.map(f => `
      <tr>
        <td>${f.cnpj}</td>
        <td>${f.razao_social}</td>
        <td>${f.nome_fantasia || '—'}</td>
        <td>${f.data_inicio ? f.data_inicio.slice(0, 10) : '—'}</td>
        <td>${f.ativo ? 'Sim' : 'Não'}</td>
        <td>
          <a href="/filial/${f.id}/edit" class="btn btn-sm btn-secondary">Editar</a>
        </td>
      </tr>
    `).join('');
  }

  function init() {
    carregarFiliais();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();