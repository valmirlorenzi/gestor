(function () {
  'use strict';

  var state = { id: null };

  function init() {
    var app = document.getElementById('config-contabil-form-app');
    if (!app) return;

    state.id = parseInt(app.dataset.id, 10);

    document.getElementById('config-contabil-salvar').addEventListener('click', salvar);
  }

  function salvar() {
    var conta = document.getElementById('config-contabil-conta').value.trim() || null;

    fetch('/api/config-contabeis/' + state.id, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-XSRF-TOKEN': getCsrfToken(),
      },
      credentials: 'same-origin',
      body: JSON.stringify({ conta_referencial: conta }),
    })
      .then(function (res) {
        if (res.ok) {
          window.location.href = '/contador/config-contabeis';
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