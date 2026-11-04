(function () {
  'use strict';

  var state = { id: null };

  function init() {
    var app = document.getElementById('ativo-form-app');
    if (!app) return;

    state.id = app.dataset.id ? parseInt(app.dataset.id, 10) : null;

    document.getElementById('ativo-salvar').addEventListener('click', salvar);
  }

  function coletarDados() {
    return {
      descricao: document.getElementById('ativo-descricao').value.trim(),
      data_aquisicao: document.getElementById('ativo-data-aquisicao').value || null,
      valor_original: parseFloat(document.getElementById('ativo-valor-original').value) || 0,
      valor_residual: parseFloat(document.getElementById('ativo-valor-residual').value) || 0,
      vida_util_meses: parseInt(document.getElementById('ativo-vida-util').value, 10) || 0,
      metodo_depreciacao: document.getElementById('ativo-metodo').value.trim() || 'Linear',
      mes_inicial_depreciacao: document.getElementById('ativo-mes-inicial').value.trim(),
      id_centro_custo: document.getElementById('ativo-id-centro-custo').value || null,
      destino: document.getElementById('ativo-destino').value.trim(),
      status: document.getElementById('ativo-status').value.trim() || 'Em uso',
    };
  }

  function salvar() {
    var data = coletarDados();

    if (!data.descricao || !data.data_aquisicao || !data.vida_util_meses || !data.mes_inicial_depreciacao || !data.destino) {
      alert('Preencha os campos obrigatórios (descrição, aquisição, vida útil, mês inicial, destino).');
      return;
    }

    if (data.id_centro_custo) data.id_centro_custo = parseInt(data.id_centro_custo, 10);

    var isEdit = state.id !== null;
    var url = isEdit ? '/api/ativos/' + state.id : '/api/ativos';
    var method = isEdit ? 'PUT' : 'POST';

    fetch(url, {
      method: method,
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
          window.location.href = '/ativos';
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

  document.addEventListener('DOMContentLoaded', init);
})();