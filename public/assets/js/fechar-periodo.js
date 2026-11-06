(function () {
  'use strict';

  async function carregar() {
    const tbody = document.querySelector('#tabela-periodos tbody');
    const vazio = document.getElementById('periodos-vazio');
    if (!tbody || !vazio) return;

    const resp = await fetch('/api/fechar-periodo', {
      headers: { 'Accept': 'application/json' },
      credentials: 'same-origin',
    });
    const periodos = await resp.json();

    if (periodos.length === 0) {
      tbody.innerHTML = '';
      vazio.style.display = '';
      return;
    }
    vazio.style.display = 'none';

    tbody.innerHTML = periodos.map(p => `
      <tr>
        <td><strong>${p.mes_ano}</strong></td>
        <td>${p.status}</td>
        <td>
          <button type="button" class="btn btn-primary" data-id="${p.id}" data-acao="fechar">Fechar</button>
        </td>
      </tr>
    `).join('');

    tbody.querySelectorAll('button[data-acao="fechar"]').forEach(btn => {
      btn.addEventListener('click', () => fechar(parseInt(btn.dataset.id, 10)));
    });
  }

  async function fechar(id) {
    if (!confirm('Fechar este período? Esta ação não pode ser desfeita.')) return;

    const resp = await fetch('/api/fechar-periodo/' + id, {
      method: 'PUT',
      headers: { 'Accept': 'application/json', 'X-XSRF-TOKEN': getCsrfToken() },
      credentials: 'same-origin',
    });

    if (resp.ok) {
      carregar();
      return;
    }

    const err = await resp.json();
    alert('Erro ao fechar: ' + (err.message || JSON.stringify(err)));
  }

  function getCsrfToken() {
    const m = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
    return m ? decodeURIComponent(m[1]) : '';
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', carregar);
  } else {
    carregar();
  }
})();