(function () {
  'use strict';

  async function carregar() {
    const tbody = document.querySelector('#tabela-pendencias tbody');
    const vazio = document.getElementById('pendencias-vazio');
    if (!tbody || !vazio) return;

    const resp = await fetch('/api/pendencias', {
      headers: { 'Accept': 'application/json' },
      credentials: 'same-origin',
    });
    const pendencias = await resp.json();

    if (pendencias.length === 0) {
      tbody.innerHTML = '';
      vazio.style.display = '';
      return;
    }
    vazio.style.display = 'none';

    tbody.innerHTML = pendencias.map(p => `
      <tr>
        <td>${p.categoria}</td>
        <td>${p.tipo}</td>
        <td>${p.descricao}</td>
        <td><span class="badge ${p.status === 'Aberta' ? 'badge-aviso' : 'badge-info'}">${p.status}</span></td>
        <td>
          <button type="button" class="btn btn-primary" data-id="${p.id}" data-acao="resolver">Resolver</button>
        </td>
      </tr>
    `).join('');

    tbody.querySelectorAll('button[data-acao="resolver"]').forEach(btn => {
      btn.addEventListener('click', () => abrirModal(parseInt(btn.dataset.id, 10)));
    });
  }

  function abrirModal(id) {
    document.getElementById('modal-pendencia-id').value = id;
    document.getElementById('modal-justificativa').value = '';
    document.getElementById('modal-resolver').style.display = '';
  }

  function init() {
    carregar();

    document.getElementById('modal-cancelar').addEventListener('click', function () {
      document.getElementById('modal-resolver').style.display = 'none';
    });

    document.getElementById('modal-salvar').addEventListener('click', salvar);
  }

  async function salvar() {
    const id = parseInt(document.getElementById('modal-pendencia-id').value, 10);
    const justificativa = document.getElementById('modal-justificativa').value.trim();

    if (!justificativa) { alert('Justificativa é obrigatória.'); return; }

    const resp = await fetch('/api/pendencias/' + id + '/resolver', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-XSRF-TOKEN': getCsrfToken(),
      },
      credentials: 'same-origin',
      body: JSON.stringify({ justificativa: justificativa }),
    });

    if (resp.ok) {
      document.getElementById('modal-resolver').style.display = 'none';
      carregar();
      return;
    }
    alert('Erro ao resolver pendência.');
  }

  function getCsrfToken() {
    const m = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
    return m ? decodeURIComponent(m[1]) : '';
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();