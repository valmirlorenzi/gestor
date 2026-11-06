(function () {
  'use strict';

  function init() {
    document.getElementById('lancamento-salvar').addEventListener('click', salvar);
  }

  function coletarDados() {
    return {
      data_competencia: document.getElementById('lancamento-data').value || null,
      historico: document.getElementById('lancamento-historico').value.trim(),
      valor: parseFloat(document.getElementById('lancamento-valor').value) || 0,
      id_conta_debito: document.getElementById('lancamento-conta-debito').value || null,
      id_conta_credito: document.getElementById('lancamento-conta-credito').value || null,
      id_centro_custo: document.getElementById('lancamento-centro-custo').value || null,
      id_pessoa: document.getElementById('lancamento-pessoa').value || null,
    };
  }

  function salvar() {
    var data = coletarDados();

    if (!data.data_competencia || !data.historico || data.valor <= 0 || !data.id_conta_debito || !data.id_conta_credito) {
      alert('Preencha os campos obrigatórios.');
      return;
    }

    ['id_conta_debito','id_conta_credito','id_centro_custo','id_pessoa'].forEach(function (k) {
      if (data[k] !== null) data[k] = parseInt(data[k], 10);
    });

    fetch('/api/lancamentos-manuais', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-XSRF-TOKEN': getCsrfToken(),
      },
      credentials: 'same-origin',
      body: JSON.stringify(data),
    })
      .then(function (res) {
        if (res.ok) {
          window.location.href = '/contador/revisao';
          return;
        }
        return res.json().then(function (err) {
          throw new Error(JSON.stringify(err.errors || err.message || err));
        });
      })
      .catch(function (err) { alert('Erro: ' + err.message); });
  }

  function getCsrfToken() {
    const m = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
    return m ? decodeURIComponent(m[1]) : '';
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();