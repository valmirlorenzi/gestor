(function () {
    'use strict';

    async function carregarServicos() {
        const tbody = document.querySelector('#tabela-servicos tbody');
        const vazio = document.getElementById('servico-vazio');
        if (!tbody || !vazio) return;

        const resp = await fetch('/api/servicos', {
            headers: { 'Accept': 'application/json' },
            credentials: 'same-origin',
        });
        const servicos = await resp.json();

        if (servicos.length === 0) {
            tbody.innerHTML = '';
            vazio.style.display = '';
            return;
        }
        vazio.style.display = 'none';

        tbody.innerHTML = servicos.map(s => `
            <tr>
                <td><strong>${escapeHtml(s.descricao)}</strong></td>
                <td>${escapeHtml(s.codigo_interno || '—')}</td>
                <td>${escapeHtml((s.servico && s.servico.servico_lc116) ? s.servico.servico_lc116.codigo : '—')}</td>
                <td>${s.ativo ? 'Sim' : 'Não'}</td>
                <td>
                    <a href="/servicos/${s.id}/edit" class="btn btn-secondary">Editar</a>
                    <button type="button" class="btn btn-danger" data-id="${s.id}" data-acao="excluir">Excluir</button>
                </td>
            </tr>
        `).join('');

        tbody.querySelectorAll('button[data-acao="excluir"]').forEach(btn => {
            btn.addEventListener('click', () => excluir(parseInt(btn.dataset.id, 10)));
        });
    }

    async function excluir(id) {
        if (!confirm('Excluir este serviço? Ele sairá da lista e não poderá ser recuperado pela interface.')) return;

        try {
            const resp = await fetch('/api/servicos/' + id, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'X-XSRF-TOKEN': getCsrfToken(),
                },
                credentials: 'same-origin',
            });

            if (resp.status === 204) {
                carregarServicos();
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
        carregarServicos();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();