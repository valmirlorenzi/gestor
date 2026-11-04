(function () {
    'use strict';

    var state = { id: null };

    function init() {
        var app = document.getElementById('servico-form-app');
        if (!app) return;

        state.id = app.dataset.id ? parseInt(app.dataset.id, 10) : null;

        document.getElementById('servico-salvar').addEventListener('click', salvar);
    }

    function coletarDados() {
        return {
            descricao: document.getElementById('servico-descricao').value.trim(),
            codigo_interno: document.getElementById('servico-codigo-interno').value.trim() || null,
            id_servico_lc116: document.getElementById('servico-id-lc116').value || null,
            ativo: document.getElementById('servico-ativo').value === '1',
        };
    }

    function salvar() {
        var data = coletarDados();

        if (!data.descricao) {
            alert('A descrição é obrigatória.');
            return;
        }

        if (data.id_servico_lc116) data.id_servico_lc116 = parseInt(data.id_servico_lc116, 10);

        var isEdit = state.id !== null;
        var url = isEdit ? '/api/servicos/' + state.id : '/api/servicos';
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
                    window.location.href = '/servicos';
                    return;
                }
                return res.json().then(function (err) {
                    throw new Error(JSON.stringify(err.errors || err.message || err));
                });
            })
            .catch(function (err) { alert('Erro: ' + err.message); });
    }

    function getCsrfToken() {
        var m = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
        return m ? decodeURIComponent(m[1]) : '';
    }

    document.addEventListener('DOMContentLoaded', init);
})();