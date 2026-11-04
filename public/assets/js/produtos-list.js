(function () {
    'use strict';

    async function carregarProdutos() {
        const tbody = document.querySelector('#tabela-produtos tbody');
        const vazio = document.getElementById('produto-vazio');
        if (!tbody || !vazio) return;

        const resp = await fetch('/api/produtos', {
            headers: { 'Accept': 'application/json' },
            credentials: 'same-origin',
        });
        const produtos = await resp.json();

        if (produtos.length === 0) {
            tbody.innerHTML = '';
            vazio.style.display = '';
            return;
        }
        vazio.style.display = 'none';

        tbody.innerHTML = produtos.map(p => `
            <tr>
                <td><strong>${escapeHtml(p.descricao)}</strong></td>
                <td>${escapeHtml(p.codigo_interno || '—')}</td>
                <td>${escapeHtml((p.produto && p.produto.ncm) ? p.produto.ncm.codigo : '—')}</td>
                <td>${escapeHtml((p.produto && p.produto.unidade) ? p.produto.unidade : '—')}</td>
                <td>${p.ativo ? 'Sim' : 'Não'}</td>
                <td>
                    <a href="/produtos/${p.id}/edit" class="btn btn-secondary">Editar</a>
                    <button type="button" class="btn btn-danger" data-id="${p.id}" data-acao="excluir">Excluir</button>
                </td>
            </tr>
        `).join('');

        tbody.querySelectorAll('button[data-acao="excluir"]').forEach(btn => {
            btn.addEventListener('click', () => excluir(parseInt(btn.dataset.id, 10)));
        });
    }

    async function excluir(id) {
        if (!confirm('Excluir este produto? Ele sairá da lista e não poderá ser recuperado pela interface.')) return;

        try {
            const resp = await fetch('/api/produtos/' + id, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'X-XSRF-TOKEN': getCsrfToken(),
                },
                credentials: 'same-origin',
            });

            if (resp.status === 204) {
                carregarProdutos();
                return;
            }

            const err = await resp.json();
            alert('Erro ao excluir: ' + JSON.stringify(err.errors || err.message || err));
        } catch (e) {
            alert('Erro ao excluir: ' + e.message);
        }
    }

    function escapeHtml(s) {
        return String(s == null ? '' : s)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    function getCsrfToken() {
        const m = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
        return m ? decodeURIComponent(m[1]) : '';
    }

    function init() {
        carregarProdutos();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();