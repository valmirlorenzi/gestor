(function () {
  'use strict';

  const state = { usuarioId: null, filiais: [], atores: [] };

  function getCsrfToken() {
    const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : '';
  }

  function montarSelectFiliais() {
    const sel = document.getElementById('atores-filial');
    if (!sel) return;
    sel.innerHTML = state.filiais.map(f =>
      `<option value="${f.id}">${f.nome_fantasia || f.razao_social || f.id}</option>`
    ).join('');
    sel.addEventListener('change', carregarAtoresDaFilial);
  }

  async function carregarAtoresDaFilial() {
    const sel = document.getElementById('atores-filial');
    const idFilial = parseInt(sel.value, 10);
    if (!idFilial) return;

    const resp = await fetch(`/api/usuarios/${state.usuarioId}/atores`, {
      headers: { 'Accept': 'application/json' },
      credentials: 'same-origin',
    });
    const porFilial = await resp.json();
    const selecionados = (porFilial[idFilial] || []).map(a => a.id_ator_funcional);

    const container = document.getElementById('atores-checkboxes');
    container.innerHTML = state.atores.map(a => `
      <label style="display:flex; align-items:center; gap:8px; font-weight:400;">
        <input type="checkbox" value="${a.id}" ${selecionados.includes(a.id) ? 'checked' : ''}>
        ${a.nome}
      </label>
    `).join('');
  }

  async function salvar() {
    const sel = document.getElementById('atores-filial');
    const idFilial = parseInt(sel.value, 10);
    if (!idFilial) return;

    const marcados = Array.from(
      document.querySelectorAll('#atores-checkboxes input:checked')
    ).map(el => parseInt(el.value, 10));

    if (marcados.length === 0) {
      alert('Selecione pelo menos um ator.');
      return;
    }

    const resp = await fetch(`/api/usuarios/${state.usuarioId}/atores`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-XSRF-TOKEN': getCsrfToken(),
      },
      credentials: 'same-origin',
      body: JSON.stringify({ id_filial: idFilial, id_atores: marcados }),
    });

    if (!resp.ok) {
      const err = await resp.json();
      alert('Erro: ' + JSON.stringify(err.errors || err.message || err));
      return;
    }

    alert('Atores atualizados.');
  }

  function init() {
    const app = document.getElementById('usuario-atores-app');
    if (!app) return;

    state.usuarioId = parseInt(app.dataset.id, 10);
    state.filiais = JSON.parse(app.dataset.filiais || '[]');
    state.atores = JSON.parse(app.dataset.atores || '[]');

    montarSelectFiliais();
    carregarAtoresDaFilial();

    const btn = document.getElementById('atores-salvar');
    if (btn) btn.addEventListener('click', salvar);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();