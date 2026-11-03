(function () {
  'use strict';

  const state = { usuarioId: null };

  function getCsrfToken() {
    const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : '';
  }

  function coletarDados() {
    const senha = document.getElementById('usuario-senha').value;
    const d = {
      nome: document.getElementById('usuario-nome').value.trim(),
      email: document.getElementById('usuario-email').value.trim(),
      ativo: document.getElementById('usuario-ativo').value === '1',
    };
    if (senha) d.senha = senha;
    return d;
  }

  async function salvar() {
    const d = coletarDados();
    const erros = [];
    if (!d.nome) erros.push('Nome');
    if (!d.email) erros.push('E-mail');
    if (!state.usuarioId && !d.senha) erros.push('Senha');
    if (erros.length) {
      alert('Preencha: ' + erros.join(', '));
      return;
    }

    const url = state.usuarioId
      ? `/api/usuarios/${state.usuarioId}`
      : '/api/usuarios';
    const method = state.usuarioId ? 'PUT' : 'POST';

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

    window.location.href = '/usuarios';
  }

  function init() {
    const app = document.getElementById('usuario-form-app');
    if (!app) return;

    const id = app.dataset.id;
    if (id) state.usuarioId = parseInt(id, 10);

    const btn = document.getElementById('usuario-salvar');
    if (btn) btn.addEventListener('click', salvar);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();