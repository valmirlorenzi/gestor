(function () {
  'use strict';

  function init() {
    document.getElementById('config-fiscal-salvar').addEventListener('click', salvar);
  }

  function salvar() {
    var data = {
      regime_fiscal: document.getElementById('config-fiscal-regime').value,
      setor: document.getElementById('config-fiscal-setor').value,
      metodo_custo: document.getElementById('config-fiscal-metodo-custo').value,
    };

    fetch('/api/config-fiscais', {
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
          alert('Configurações fiscais atualizadas.');
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