(function () {
  'use strict';

  function formatarMoeda(v) {
    return 'R$ ' + Number(v).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  async function carregar() {
    const tbody = document.querySelector('#tabela-validacao tbody');
    const vazio = document.getElementById('validacao-vazio');
    if (!tbody || !vazio) return;

    const resp = await fetch('/api/validacao/razoes-impostos', {
      headers: { 'Accept': 'application/json' },
      credentials: 'same-origin',
    });
    const razoes = await resp.json();

    if (razoes.length === 0) {
      tbody.innerHTML = '';
      vazio.style.display = '';
      return;
    }
    vazio.style.display = 'none';

    tbody.innerHTML = razoes.map(r => `
      <tr>
        <td>${r.tipo_imposto}</td>
        <td>${r.natureza}</td>
        <td><strong>${formatarMoeda(r.valor)}</strong></td>
        <td>${r.validado ? '<span class="badge badge-info">Sim</span>' : '<span class="badge badge-aviso">Não</span>'}</td>
        <td>
          <button type="button" class="btn btn-primary" data-id="${r.id}" data-acao="validar">Validar</button>
          <button type="button" class="btn btn-secondary" data-id="${r.id}" data-acao="override">Override</button>
        </td>
      </tr>
    `).join('');

    tbody.querySelectorAll('button[data-acao="validar"]').forEach(btn => {
      btn.addEventListener('click', () => validar(parseInt(btn.dataset.id, 10)));
    });

    tbody.querySelectorAll('button[data-acao="override"]').forEach(btn => {
      btn.addEventListener('click', () => override(parseInt(btn.dataset.id, 10)));
    });
  }

  async function validar(id) {
    if (!confirm('Validar este cálculo?')) return;

    const resp = await fetch('/api/validacao/razoes-impostos/' + id + '/validar', {
      method: 'PUT',
      headers: { 'Accept': 'application/json', 'X-XSRF-TOKEN': getCsrfToken() },
      credentials: 'same-origin',
    });

    if (resp.ok) { carregar(); return; }
    alert('Erro ao validar.');
  }

  async function override(id) {
    const justificativa = prompt('Justificativa do override:');
    if (!justificativa) return;

    const resp = await fetch('/api/validacao/razoes-impostos/' + id + '/override', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-XSRF-TOKEN': getCsrfToken(),
      },
      credentials: 'same-origin',
      body: JSON.stringify({ justificativa: justificativa }),
    });

    if (resp.ok) { carregar(); return; }
    alert('Erro ao aplicar override.');
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