(function () {
  'use strict';

  var state = { ativo: true };

  async function carregar() {
    const resp = await fetch('/api/osi', {
      headers: { 'Accept': 'application/json' },
      credentials: 'same-origin',
    });

    const data = await resp.json();
    const config = data.config;
    const historico = data.historico || [];

    state.ativo = config ? !!config.handoff_ativo : true;

    renderStatus();
    renderHistorico(historico);
  }

  function renderStatus() {
    const statusEl = document.getElementById('osi-status');
    const badgeEl = document.getElementById('osi-badge');
    const explicacaoEl = document.getElementById('osi-explicacao');
    const toggleEl = document.getElementById('osi-toggle');

    if (state.ativo) {
      statusEl.textContent = 'ATIVADO';
      statusEl.style.color = '#16a34a';
      badgeEl.className = 'badge badge-ok';
      badgeEl.textContent = 'ativado';
      explicacaoEl.textContent = 'Os documentos geram ordens para o próximo setor. Cada ator vê suas tarefas na caixa de entrada.';
      toggleEl.textContent = 'Desativar handoff';
      toggleEl.className = 'btn btn-secondary';
    } else {
      statusEl.textContent = 'DESATIVADO';
      statusEl.style.color = '#dc2626';
      badgeEl.className = 'badge badge-err';
      badgeEl.textContent = 'desativado';
      explicacaoEl.textContent = 'Os documentos avançam de estado automaticamente (sem tarefa para outro ator). A continuidade aparece na mesma tela do usuário que acumula os atores.';
      toggleEl.textContent = 'Ativar handoff';
      toggleEl.className = 'btn btn-primary';
    }
  }

  function renderHistorico(historico) {
    const tbody = document.getElementById('osi-historico');
    const vazio = document.getElementById('osi-historico-vazio');
    if (!tbody || !vazio) return;

    if (historico.length === 0) {
      tbody.innerHTML = '';
      vazio.style.display = '';
      return;
    }
    vazio.style.display = 'none';

    tbody.innerHTML = historico.map(h => {
      const data = h.created_at ? new Date(h.created_at).toLocaleString('pt-BR') : '—';
      const acao = h.acao === 'ativar'
        ? '<span class="badge badge-ok">Ativado</span>'
        : '<span class="badge badge-err">Desativado</span>';

      return `
        <tr>
          <td>${data}</td>
          <td>${h.id_usuario || '—'}</td>
          <td>${acao}</td>
          <td class="muted">${h.justificativa || '—'}</td>
        </tr>
      `;
    }).join('');
  }

  async function toggle() {
    const acao = state.ativo ? 'desativar' : 'ativar';
    const justificativa = prompt(`Justificativa para ${acao} o handoff (registrada em auditoria):`);
    if (!justificativa) return;

    try {
      const resp = await fetch('/api/osi', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-XSRF-TOKEN': getCsrfToken(),
        },
        credentials: 'same-origin',
        body: JSON.stringify({
          handoff_ativo: !state.ativo,
          justificativa: justificativa,
        }),
      });

      if (resp.ok) {
        alert(`Handoff ${!state.ativo ? 'ativado' : 'desativado'} com sucesso.`);
        carregar();
        return;
      }

      const err = await resp.json();
      alert('Erro: ' + JSON.stringify(err.errors || err.message || err));
    } catch (e) {
      alert('Erro: ' + e.message);
    }
  }

  function getCsrfToken() {
    const m = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
    return m ? decodeURIComponent(m[1]) : '';
  }

  function init() {
    const toggleEl = document.getElementById('osi-toggle');
    if (toggleEl) toggleEl.addEventListener('click', toggle);

    carregar();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();