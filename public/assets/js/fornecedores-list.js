(function () {
    'use strict';

    function getCsrfToken() {
        const m = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
        return m ? decodeURIComponent(m[1]) : '';
    }

    async function carregar() {
        const tbody = document.querySelector('#tabela-fornecedores tbody');
        const vazio = document.getElementById('fornecedores-vazio');

        try {
            const resp = await fetch('/api/fornecedores', {
                headers: { 'Accept': 'application/json' },
                credentials: 'same-origin',
            });

            if (!resp.ok) throw new Error('Falha ao carregar fornecedores (' + resp.status + ')');

            const data = await resp.json();

            if (!data.length) {
                tbody.innerHTML = '';
                vazio.style.display = '';
                return;
            }

            vazio.style.display = 'none';
            tbody.innerHTML = data.map((item) => {
                const categoria = item.dados_extras && item.dados_extras.categoria
                    ? item.dados_extras.categoria
                    : '';
                const status = item.ativo ? 'Ativo' : 'Inativo';
                return `<tr>
                    <td>${item.nome}</td>
                    <td>${item.documento}</td>
                    <td>${item.tipo}</td>
                    <td>${categoria}</td>
                    <td>${item.email || ''}</td>
                    <td>${item.telefone || ''}</td>
                    <td>${status}</td>
                    <td>
                        <a href="/comprador/fornecedores/${item.id}/edit" class="btn btn-secondary">Editar</a>
                        <button type="button" class="btn btn-danger" data-id="${item.id}" data-acao="excluir">Excluir</button>
                    </td>
                </tr>`;
            }).join('');
        } catch (err) {
            alert('Erro: ' + (err.message || err));
        }
    }

    async function excluir(id) {
        if (!confirm('Excluir este fornecedor?')) return;

        try {
            const resp = await fetch('/api/fornecedores/' + id, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'X-XSRF-TOKEN': getCsrfToken(),
                },
                credentials: 'same-origin',
            });

            if (!resp.ok) {
                const err = await resp.json().catch(() => ({}));
                alert('Erro: ' + JSON.stringify(err.errors || err.message || err));
                return;
            }

            await carregar();
        } catch (err) {
            alert('Erro: ' + (err.message || err));
        }
    }

    function init() {
        carregar();

        document.addEventListener('click', (ev) => {
            const btn = ev.target.closest('[data-acao="excluir"]');
            if (!btn) return;
            excluir(btn.dataset.id);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();