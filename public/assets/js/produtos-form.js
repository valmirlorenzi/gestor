(function () {
    'use strict';

    var state = { id: null };

    function init() {
        var app = document.getElementById('produto-form-app');
        if (!app) return;

        state.id = app.dataset.id ? parseInt(app.dataset.id, 10) : null;

        document.getElementById('produto-salvar').addEventListener('click', salvar);
    }

    function coletarDados() {
        return {
            descricao: document.getElementById('produto-descricao').value.trim(),
            codigo_interno: document.getElementById('produto-codigo-interno').value.trim() || null,
            id_ncm: document.getElementById('produto-id-ncm').value || null,
            unidade: document.getElementById('produto-unidade').value.trim() || null,
            ativo: document.getElementById('produto-ativo').value === '1',
        };
    }

    function salvar() {
        var data = coletarDados();

        if (!data.descricao) {
            alert('A descrição é obrigatória.');
            return;
        }

        if (data.id_ncm) data.id_ncm = parseInt(data.id_ncm, 10);

        var isEdit = state.id !== null;
        var url = isEdit ? '/api/produtos/' + state.id : '/api/produtos';
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
                    window.location.href = '/produtos';
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