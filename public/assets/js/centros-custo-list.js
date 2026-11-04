/* ============================================================
   CENTROS-CUSTO-LIST.JS — Listagem de centros de custo (Blade + API)
   ============================================================ */

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
          <a href="/centros-custo/${c.id}/edit" class="btn btn-secondary">Editar</a>
          <button type="button" class="btn btn-danger" data-id="${c.id}" data-acao="excluir">Excluir</button>
        </td>
      </tr>
    `).join('');

    tbody.querySelectorAll('button[data-acao="excluir"]').forEach(btn => {
      btn.addEventListener('click', () => excluir(parseInt(btn.dataset.id, 10)));
    });
  }

  async function excluir(id) {
    if (!confirm('Excluir este centro de custo? Ele sairá da lista e não poderá ser recuperado pela interface.')) return;

    try {
      const resp = await fetch('/api/centros-custo/' + id, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'X-XSRF-TOKEN': getCsrfToken(),
        },
        credentials: 'same-origin',
      });

      if (resp.status === 204) {
        carregarCentros();
        return;
      }

      const err = await resp.json();
      alert('Erro ao excluir: ' + JSON.stringify(err.errors || err.message || err));
    } catch (e) {
      alert('Erro ao excluir: ' + e.message);
    }
  }

  function getCsrfToken() {
    const m = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
    return m ? decodeURIComponent(m[1]) : '';
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