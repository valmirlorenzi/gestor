(function () {
  'use strict';

  let currentData = null;

  async function carregar() {
    const ul = document.getElementById('checklist');
    if (!ul) return;

    const resp = await fetch('/api/preparar-fechamento', {
      headers: { 'Accept': 'application/json' },
      credentials: 'same-origin',
    });

    if (!resp.ok) {
      ul.innerHTML = '<li class="muted">Erro ao carregar checklist.</li>';
      return;
    }

    currentData = await resp.json();
    const c = currentData.checklist;

    ul.innerHTML = `
      <li>${c.pendencias_erro === 0
        ? '<span style="color:green;">✔</span>'
        : '<span style="color:red;">✘</span>'}
        Pendências de erro abertas: <strong>${c.pendencias_erro}</strong></li>
      <li>${c.pendencias_aviso === 0
        ? '<span style="color:green;">✔</span>'
        : '<span style="color:orange;">!</span>'}
        Pendências de aviso abertas: <strong>${c.pendencias_aviso}</strong></li>
      <li>${c.consolidacao_feita
        ? '<span style="color:green;">✔</span>'
        : '<span style="color:red;">✘</span>'}
        Consolidação enviada ao Auditor</li>
      <li><strong>Pode fechar?</strong> ${currentData.pode_fechar ? 'Sim' : 'Não'}</li>
    `;

    const btn = document.getElementById('enviar-auditor');
    btn.disabled = c.consolidacao_feita;
    if (c.consolidacao_feita) btn.textContent = 'Já enviado ao Auditor';
  }

  async function enviarAuditor() {
    const resp = await fetch('/api/preparar-fechamento/enviar-auditor', {
      method: 'POST',
      headers: { 'Accept': 'application/json', 'X-XSRF-TOKEN': getCsrfToken() },
      credentials: 'same-origin',
    });

    if (resp.status === 201) {
      alert('Consolidação enviada ao Auditor.');
      carregar();
      return;
    }

    const err = await resp.json();
    alert('Erro: ' + (err.message || JSON.stringify(err)));
  }

  function getCsrfToken() {
    const m = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
    return m ? decodeURIComponent(m[1]) : '';
  }

  function init() {
    carregar();
    document.getElementById('enviar-auditor').addEventListener('click', enviarAuditor);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();