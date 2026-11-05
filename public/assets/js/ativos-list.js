(function () {
  'use strict';

  function formatarMoeda(v) {
    if (v == null) return '—';
    return 'R$ ' + Number(v).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  async function carregarAtivos() {
    const tbody = document.querySelector('#tabela-ativos tbody');
    const vazio = document.getElementById('ativo-vazio');
    if (!tbody || !vazio) return;

    const resp = await fetch('/api/ativos', {
      headers: { 'Accept': 'application/json' },
      credentials: 'same-origin',
    });
    const ativos = await resp.json();

    if (ativos.length === 0) {
      tbody.innerHTML = '';
      vazio.style.display = '';
      return;
    }
    vazio.style.display = 'none';

    tbody.innerHTML = ativos.map(a => `
      <tr>
        <td><strong>${a.descricao}</strong></td>
        <td>${a.data_aquisicao ? a.data_aquisicao.slice(0, 10) : '—'}</td>
        <td>${formatarMoeda(a.valor_original)}</td>
        <td>${a.centro_custo ? a.centro_custo.nome : '—'}</td>
        <td>${a.status || '—'}</td>
        <td>${a.ativo ? 'Sim' : 'Não'}</td>
        <td>
          <a href="/ativos/${a.id}/edit" class="btn btn-secondary">Editar</a>
          <button type="button" class="btn btn-danger" data-id="${a.id}" data-acao="excluir">Excluir</button>
        </td>
      </tr>
    `).join('');

    tbody.querySelectorAll('button[data-acao="excluir"]').forEach(btn => {
      btn.addEventListener('click', () => excluir(parseInt(btn.dataset.id, 10)));
    });
  }

  async function excluir(id) {
    if (!confirm('Excluir este ativo? Ele sairá da lista e não poderá ser recuperado pela interface.')) return;

    try {
      const resp = await fetch('/api/ativos/' + id, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'X-XSRF-TOKEN': getCsrfToken(),
        },
        credentials: 'same-origin',
      });

      if (resp.status === 204) {
        carregarAtivos();
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
    carregarAtivos();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();