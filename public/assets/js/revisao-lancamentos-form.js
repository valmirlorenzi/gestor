(function () {
  'use strict';

  window.abrirReclassificacao = function (id) {
    const lancamento = window.__lancamentosCache ? window.__lancamentosCache[id] : null;

    document.getElementById('modal-lancamento-id').value = id;
    document.getElementById('modal-justificativa').value = '';
    document.getElementById('modal-reclassificar').style.display = '';

    if (lancamento) {
      document.getElementById('modal-conta-debito').value = lancamento.id_conta_debito || '';
      document.getElementById('modal-conta-credito').value = lancamento.id_conta_credito || '';
      document.getElementById('modal-centro-custo').value = lancamento.id_centro_custo || '';
    }
  };

  function init() {
    document.getElementById('modal-cancelar').addEventListener('click', function () {
      document.getElementById('modal-reclassificar').style.display = 'none';
    });

    document.getElementById('modal-salvar').addEventListener('click', salvar);
  }

  function salvar() {
    const id = parseInt(document.getElementById('modal-lancamento-id').value, 10);
    const justificativa = document.getElementById('modal-justificativa').value.trim();

    if (!justificativa) {
      alert('Justificativa é obrigatória.');
      return;
    }

    const data = {
      id_conta_debito: parseInt(document.getElementById('modal-conta-debito').value, 10),
      id_conta_credito: parseInt(document.getElementById('modal-conta-credito').value, 10),
      id_centro_custo: document.getElementById('modal-centro-custo').value
        ? parseInt(document.getElementById('modal-centro-custo').value, 10)
        : null,
      justificativa: justificativa,
    };

    fetch('/api/revisao-lancamentos/' + id + '/reclassificar', {
      method: 'PUT',
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
          document.getElementById('modal-reclassificar').style.display = 'none';
          window.carregarRevisao();
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