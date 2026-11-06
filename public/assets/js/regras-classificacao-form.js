(function () {
  'use strict';

  var state = { id: null };

  function init() {
    var app = document.getElementById('regra-form-app');
    if (!app) return;

    state.id = app.dataset.id ? parseInt(app.dataset.id, 10) : null;

    document.getElementById('regra-salvar').addEventListener('click', salvar);
  }

  function coletarDados() {
    function val(id) {
      var el = document.getElementById(id);
      return el && el.value ? el.value : null;
    }

    return {
      descricao: document.getElementById('regra-descricao').value.trim(),
      prioridade: parseInt(document.getElementById('regra-prioridade').value, 10),
      id_tipo_documento: val('regra-tipo-documento'),
      id_cfop: val('regra-cfop'),
      id_cst: val('regra-cst'),
      id_servico_lc116: val('regra-servico-lc116'),
      id_pessoa_fornecedor: val('regra-fornecedor'),
      categoria_fornecedor: val('regra-categoria-fornecedor'),
      historico_palavra_chave: val('regra-palavra-chave'),
      id_conta_destino: val('regra-conta-destino'),
      id_centro_custo_padrao: val('regra-centro-custo'),
      id_conta_contrapartida_padrao: val('regra-conta-contrapartida'),
      ativo: document.getElementById('regra-ativo').value === '1',
    };
  }

  function salvar() {
    var data = coletarDados();

    if (!data.descricao || !data.id_conta_destino) {
      alert('Preencha os campos obrigatórios (descrição, conta destino).');
      return;
    }

    Object.keys(data).forEach(function (k) {
      if (data[k] !== null && ['id_tipo_documento','id_cfop','id_cst','id_servico_lc116','id_pessoa_fornecedor','id_conta_destino','id_centro_custo_padrao','id_conta_contrapartida_padrao'].includes(k)) {
        data[k] = parseInt(data[k], 10);
      }
    });

    var isEdit = state.id !== null;
    var url = isEdit ? '/api/regras-classificacao/' + state.id : '/api/regras-classificacao';
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
          window.location.href = '/contador/regras';
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