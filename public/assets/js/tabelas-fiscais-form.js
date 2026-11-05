(function () {
  'use strict';

  var state = { id: null };

  function init() {
    var app = document.getElementById('parametro-form-app');
    if (!app) return;

    state.id = app.dataset.id ? parseInt(app.dataset.id, 10) : null;

    document.getElementById('parametro-salvar').addEventListener('click', salvar);
  }

  function coletarDados() {
    return {
      tipo_imposto: document.getElementById('parametro-tipo').value.trim(),
      descricao: document.getElementById('parametro-descricao').value.trim(),
      aliquota: parseFloat(document.getElementById('parametro-aliquota').value) || 0,
      base_calculo: document.getElementById('parametro-base').value.trim() || null,
      data_inicio_validade: document.getElementById('parametro-inicio').value || null,
      data_fim_validade: document.getElementById('parametro-fim').value || null,
    };
  }

  function salvar() {
    var data = coletarDados();

    if (!data.tipo_imposto || !data.descricao || !data.data_inicio_validade) {
      alert('Preencha os campos obrigatórios (tipo, descrição, início da vigência).');
      return;
    }

    var isEdit = state.id !== null;
    var url = isEdit ? '/api/parametros-fiscais/' + state.id : '/api/parametros-fiscais';
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
          window.location.href = '/contador/tabelas-fiscais';
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