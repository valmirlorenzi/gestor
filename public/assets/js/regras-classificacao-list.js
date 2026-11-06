(function () {
  'use strict';

  async function carregarRegras() {
    const tbody = document.querySelector('#tabela-regras tbody');
    const vazio = document.getElementById('regras-vazio');
    if (!tbody || !vazio) return;

    const resp = await fetch('/api/regras-classificacao', {
      headers: { 'Accept': 'application/json' },
      credentials: 'same-origin',
    });
    const regras = await resp.json();

    if (regras.length === 0) {
      tbody.innerHTML = '';
      vazio.style.display = '';
      return;
    }
    vazio.style.display = 'none';

    tbody.innerHTML = regras.map(r => `
      <tr>
        <td>${r.prioridade}</td>
        <td><strong>${r.descricao}</strong></td>
        <td><span class="badge ${r.origem === 'Manual' ? 'badge-info' : 'badge-aviso'}">${r.origem}</span></td>
        <td>${r.conta_destino ? r.conta_destino.codigo + ' — ' + r.conta_destino.descricao : '—'}</td>
        <td>${r.ativo ? 'Sim' : 'Não'}</td>
        <td>
          <a href="/contador/regras/${r.id}/edit" class="btn btn-secondary">Editar</a>
          <button type="button" class="btn btn-danger" data-id="${r.id}" data-acao="excluir">Desativar</button>
        </td>
      </tr>
    `).join('');

    tbody.querySelectorAll('button[data-acao="excluir"]').forEach(btn => {
      btn.addEventListener('click', () => desativar(parseInt(btn.dataset.id, 10)));
    });
  }

  async function desativar(id) {
    if (!confirm('Desativar esta regra? Ela deixa de ser aplicada pelo motor, mas o histórico é preservado.')) return;

    try {
      const resp = await fetch('/api/regras-classificacao/' + id, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'X-XSRF-TOKEN': getCsrfToken(),
        },
        credentials: 'same-origin',
      });

      if (resp.status === 204) {
        carregarRegras();
        return;
      }

      const err = await resp.json();
      alert('Erro ao desativar: ' + JSON.stringify(err.errors || err.message || err));
    } catch (e) {
      alert('Erro ao desativar: ' + e.message);
    }
  }

  function getCsrfToken() {
    const m = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
    return m ? decodeURIComponent(m[1]) : '';
  }

  function init() {
    carregarRegras();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();