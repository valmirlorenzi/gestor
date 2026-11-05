(function () {
  'use strict';

  var state = { id: null };

  function init() {
    var app = document.getElementById('plano-conta-form-app');
    if (!app) return;

    state.id = app.dataset.id ? parseInt(app.dataset.id, 10) : null;

    document.getElementById('plano-salvar').addEventListener('click', salvar);

    // Sugere próximo código ao trocar o pai (só no create).
    if (state.id === null) {
      document.getElementById('plano-id-conta-pai').addEventListener('change', sugerirCodigo);
    }
  }

  async function sugerirCodigo() {
    var idPai = document.getElementById('plano-id-conta-pai').value || null;
    if (!idPai) return;

    try {
      var resp = await fetch('/api/plano-contas/proximo-codigo?id_conta_pai=' + encodeURIComponent(idPai), {
        headers: { 'Accept': 'application/json' },
        credentials: 'same-origin',
      });
      var data = await resp.json();
      if (data.codigo) {
        document.getElementById('plano-codigo').value = data.codigo;
      }
    } catch (e) {
      // Silencioso: usuário pode digitar manualmente.
    }
  }

  function coletarDados() {
    return {
      codigo: document.getElementById('plano-codigo').value.trim(),
      descricao: document.getElementById('plano-descricao').value.trim(),
      tipo: document.getElementById('plano-tipo').value,
      subtipo: document.getElementById('plano-subtipo').value.trim() || null,
      natureza: document.getElementById('plano-natureza').value,
      aceita_lancamento: document.getElementById('plano-aceita').value === '1',
      id_conta_pai: document.getElementById('plano-id-conta-pai').value || null,
      conta_referencial: document.getElementById('plano-conta-referencial').value.trim() || null,
      ativo: document.getElementById('plano-ativo').value === '1',
    };
  }

  function salvar() {
    var data = coletarDados();

    if (!data.codigo || !data.descricao) {
      alert('Preencha os campos obrigatórios (código e descrição).');
      return;
    }

    if (data.id_conta_pai) data.id_conta_pai = parseInt(data.id_conta_pai, 10);

    var isEdit = state.id !== null;
    var url = isEdit ? '/api/plano-contas/' + state.id : '/api/plano-contas';
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
          window.location.href = '/contador/plano-contas';
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