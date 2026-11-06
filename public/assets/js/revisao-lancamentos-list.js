(function () {
  'use strict';

  function formatarMoeda(v) {
    return 'R$ ' + Number(v).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function formatarData(iso) {
    if (!iso) return '—';
    const d = iso.slice(0, 10);
    const [y, m, day] = d.split('-');
    return `${day}/${m}/${y}`;
  }

  async function carregarLancamentos() {
    const tbody = document.querySelector('#tabela-revisao tbody');
    const vazio = document.getElementById('revisao-vazio');
    if (!tbody || !vazio) return;

    const resp = await fetch('/api/revisao-lancamentos', {
      headers: { 'Accept': 'application/json' },
      credentials: 'same-origin',
    });
    const lancamentos = await resp.json();

    if (lancamentos.length === 0) {
      tbody.innerHTML = '';
      vazio.style.display = '';
      return;
    }
    vazio.style.display = 'none';

    tbody.innerHTML = lancamentos.map(l => {
      const podeReclassificar = ['Nao classificado','Conflito','Classificado automaticamente'].includes(l.status_classificacao);

      return `
        <tr>
          <td>${formatarData(l.data_competencia)}</td>
          <td>${l.historico}</td>
          <td><strong>${formatarMoeda(l.valor)}</strong></td>
          <td>${l.conta_debito ? l.conta_debito.codigo : '—'}</td>
          <td>${l.conta_credito ? l.conta_credito.codigo : '—'}</td>
          <td><span class="badge badge-aviso">${l.status_classificacao}</span></td>
          <td>
            ${podeReclassificar ? `
              <button type="button" class="btn btn-secondary" data-id="${l.id}" data-acao="reclassificar">Reclassificar</button>
              <button type="button" class="btn btn-primary" data-id="${l.id}" data-acao="validar">Validar</button>
            ` : '—'}
          </td>
        </tr>
      `;
    }).join('');

    tbody.querySelectorAll('button[data-acao="reclassificar"]').forEach(btn => {
      btn.addEventListener('click', () => window.abrirReclassificacao(parseInt(btn.dataset.id, 10)));
    });

    tbody.querySelectorAll('button[data-acao="validar"]').forEach(btn => {
      btn.addEventListener('click', () => validar(parseInt(btn.dataset.id, 10)));
    });
  }

  async function validar(id) {
    if (!confirm('Validar este lançamento como "Classificado manualmente"?')) return;

    try {
      const resp = await fetch('/api/revisao-lancamentos/' + id + '/validar', {
        method: 'PUT',
        headers: { 'Accept': 'application/json', 'X-XSRF-TOKEN': getCsrfToken() },
        credentials: 'same-origin',
      });

      if (resp.ok) { carregarLancamentos(); return; }

      const err = await resp.json();
      alert('Erro ao validar: ' + JSON.stringify(err.errors || err.message || err));
    } catch (e) { alert('Erro: ' + e.message); }
  }

  function getCsrfToken() {
    const m = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
    return m ? decodeURIComponent(m[1]) : '';
  }

  window.carregarRevisao = carregarLancamentos;

  function init() {
    carregarLancamentos();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();