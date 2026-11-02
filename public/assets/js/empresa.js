/* ============================================================
   EMPRESA.JS — Edição da empresa (única) via API
   Lê o data-id do #empresa-app; se existir, faz PUT.
   ============================================================ */

(function () {
  'use strict';

  const state = {
    step: 1,
    empresaId: null,
  };

  function getCsrfToken() {
    const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : '';
  }

  function coletarDados() {
    const regime = document.querySelector('input[name="regime"]:checked')?.value;
    const setor = document.querySelector('input[name="setor"]:checked')?.value;
    const cnpj = document.getElementById('empresa-cnpj').value.trim();
    const razao = document.getElementById('empresa-razao').value.trim();
    const fantasia = document.getElementById('empresa-fantasia').value.trim();
    const dataInicio = document.getElementById('empresa-data-inicio').value;

    return {
      regime_fiscal: regime,
      setor: setor,
      cnpj: cnpj,
      razao_social: razao,
      nome_fantasia: fantasia || null,
      data_inicio: dataInicio,
      metodo_custo: 'XML',
    };
  }

  function validarPasso1() {
    const d = coletarDados();
    const erros = [];
    if (!d.regime_fiscal) erros.push('Regime fiscal');
    if (!d.setor) erros.push('Setor');
    if (!d.cnpj || d.cnpj.length !== 14) erros.push('CNPJ (14 dígitos)');
    if (!d.razao_social) erros.push('Razão social');
    if (!d.data_inicio) erros.push('Data de início');

    if (erros.length) {
      alert('Preencha: ' + erros.join(', '));
      return false;
    }
    return true;
  }

  function irParaPasso(n) {
    state.step = n;
    document.getElementById('empresa-step-1').style.display = n === 1 ? '' : 'none';
    document.getElementById('empresa-step-2').style.display = n === 2 ? '' : 'none';
    document.querySelectorAll('#empresa-steps .step').forEach(el => {
      el.classList.toggle('active', parseInt(el.dataset.step) === n);
    });

    if (n === 2) {
      const d = coletarDados();
      document.getElementById('resumo-regime').textContent = d.regime_fiscal || '—';
      document.getElementById('resumo-setor').textContent = d.setor || '—';
      document.getElementById('resumo-cnpj').textContent = d.cnpj || '—';
      document.getElementById('resumo-razao').textContent = d.razao_social || '—';
      document.getElementById('resumo-data').textContent = d.data_inicio || '—';
    }
  }

  async function concluir() {
    if (!validarPasso1()) return;

    const d = coletarDados();
    const url = state.empresaId
      ? `/api/empresas/${state.empresaId}`
      : '/api/empresas';
    const method = state.empresaId ? 'PUT' : 'POST';

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

    const empresa = await resp.json();
    state.empresaId = empresa.id;

    document.getElementById('empresa-step-1').style.display = 'none';
    document.getElementById('empresa-step-2').style.display = 'none';
    document.getElementById('empresa-sucesso').style.display = '';
  }

  function init() {
    const app = document.getElementById('empresa-app');
    if (!app) return;

    const id = app.dataset.id;
    if (id) state.empresaId = parseInt(id, 10);

    const btnProximo = document.getElementById('empresa-proximo');
    const btnVoltar = document.getElementById('empresa-voltar');
    const btnConcluir = document.getElementById('empresa-concluir');

    if (btnProximo) btnProximo.addEventListener('click', () => {
      if (validarPasso1()) irParaPasso(2);
    });
    if (btnVoltar) btnVoltar.addEventListener('click', () => irParaPasso(1));
    if (btnConcluir) btnConcluir.addEventListener('click', concluir);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();