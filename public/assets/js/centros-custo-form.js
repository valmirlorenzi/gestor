(function () {
  'use strict';

  const state = { centroId: null };

  function getCsrfToken() {
    const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : '';
  }

  function coletarDados() {
    return {
      nome: document.getElementById('centro-custo-nome').value.trim(),
      responsavel: document.getElementById('centro-custo-responsavel').value.trim() || null,
      ativo: document.getElementById('centro-custo-ativo').value === '1',
    };
  }

  async function salvar() {
    const d = coletarDados();
    if (!d.nome) {
      alert('Preencha: Nome');
      return;
    }

    const url = state.centroId
      ? `/api/centros-custo/${state.centroId}`
      : '/api/centros-custo';
    const method = state.centroId ? 'PUT' : 'POST';

    const resp = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-XSRF-TOKEN': getCsrfToken(),
      },
      credentials: 'same-origin',
      body: JSON.stringify(d),
    });

    if (!resp.ok) {
      const err = await resp.json();
      alert('Erro: ' + JSON.stringify(err.errors || err.message || err));
      return;
    }

    window.location.href = '/centros-custo';
  }

  function init() {
    const app = document.getElementById('centro-custo-form-app');
    if (!app) return;

    const id = app.dataset.id;
    if (id) state.centroId = parseInt(id, 10);

    const btn = document.getElementById('centro-custo-salvar');
    if (btn) btn.addEventListener('click', salvar);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();