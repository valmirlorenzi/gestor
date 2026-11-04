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
          <button type="button" class="btn btn-danger" data-id="${f.id}" data-acao="excluir">Excluir</button>          
        </td>
      </tr>
    `).join('');
    tbody.querySelectorAll('button[data-acao="excluir"]').forEach(btn => {
      btn.addEventListener('click', () => excluir(parseInt(btn.dataset.id, 10)));
    });    
  }

  async function excluir(id) {
    if (!confirm('Excluir esta filial? Ela sairá da lista e não poderá ser recuperada pela interface.')) return;

    try {
      const resp = await fetch('/api/filiais/' + id, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'X-XSRF-TOKEN': getCsrfToken(),
        },
        credentials: 'same-origin',
      });

      if (resp.status === 204) {
        carregarFiliais();
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
    carregarFiliais();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();