(function () {
  'use strict';

  async function carregarContas() {
    const tbody = document.querySelector('#tabela-plano-contas tbody');
    const vazio = document.getElementById('plano-contas-vazio');
    if (!tbody || !vazio) return;

    const resp = await fetch('/api/plano-contas', {
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

    tbody.innerHTML = contas.map(c => `
      <tr>
        <td><strong>${c.codigo}</strong></td>
        <td>${c.descricao}</td>
        <td>${c.tipo}</td>
        <td>${c.natureza === 'Analitica' ? 'Analítica' : 'Sintética'}</td>
        <td>${c.ativo ? 'Sim' : 'Não'}</td>
        <td>
          <a href="/contador/plano-contas/${c.id}/edit" class="btn btn-secondary">Editar</a>
          <button type="button" class="btn btn-danger" data-id="${c.id}" data-acao="excluir">Excluir</button>
        </td>
      </tr>
    `).join('');

    tbody.querySelectorAll('button[data-acao="excluir"]').forEach(btn => {
      btn.addEventListener('click', () => excluir(parseInt(btn.dataset.id, 10)));
    });
  }

  async function excluir(id) {
    if (!confirm('Excluir esta conta? Ela sairá da lista e não poderá ser recuperada pela interface.')) return;

    try {
      const resp = await fetch('/api/plano-contas/' + id, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'X-XSRF-TOKEN': getCsrfToken(),
        },
        credentials: 'same-origin',
      });

      if (resp.status === 204) {
        carregarContas();
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
    carregarContas();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();