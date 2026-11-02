/* ============================================================
   FILIAL-FORM.JS — Criação/edição de filial (Blade + API)
   Lê o data-id do #filial-form-app; se existir, faz PUT.
   ============================================================ */

(function () {
  'use strict';

  const state = { filialId: null };

  function getCsrfToken() {
    const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : '';
  }

  function coletarDados() {
    return {
      cnpj: document.getElementById('filial-cnpj').value.trim(),
      razao_social: document.getElementById('filial-razao').value.trim(),
      nome_fantasia: document.getElementById('filial-fantasia').value.trim() || null,
      inscricao_estadual: document.getElementById('filial-ie').value.trim() || null,
      inscricao_municipal: document.getElementById('filial-im').value.trim() || null,
      endereco: document.getElementById('filial-endereco').value.trim() || null,
      data_inicio: document.getElementById('filial-data-inicio').value,
      ativo: document.getElementById('filial-ativo').value === '1',
    };
  }

  async function salvar() {
    const d = coletarDados();
    const erros = [];
    if (!d.cnpj || d.cnpj.length !== 14) erros.push('CNPJ (14 dígitos)');
    if (!d.razao_social) erros.push('Razão social');
    if (!d.data_inicio) erros.push('Data de início');
    if (erros.length) {
      alert('Preencha: ' + erros.join(', '));
      return;
    }

    const url = state.filialId
      ? `/api/filiais/${state.filialId}`
      : '/api/filiais';
    const method = state.filialId ? 'PUT' : 'POST';

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

    window.location.href = '/filial';
  }

  function init() {
    const app = document.getElementById('filial-form-app');
    if (!app) return;

    const id = app.dataset.id;
    if (id) state.filialId = parseInt(id, 10);

    const btn = document.getElementById('filial-salvar');
    if (btn) btn.addEventListener('click', salvar);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();