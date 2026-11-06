(function () {
    'use strict';

    function getCsrfToken() {
        const m = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
        return m ? decodeURIComponent(m[1]) : '';
    }

    function formatarMoeda(v) {
        const n = Number(v) || 0;
        return 'R$ ' + n.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }

    function formatarData(s) {
        if (!s) return '';
        const iso = String(s).slice(0, 10);
        const [a, m, d] = iso.split('-');
        return d + '/' + m + '/' + a;
    }

    async function carregar() {
        const tbody = document.querySelector('#tabela-notas-entrada tbody');
        const vazio = document.getElementById('notas-entrada-vazio');

        try {
            const resp = await fetch('/api/notas-entrada', {
                headers: { 'Accept': 'application/json' },
                credentials: 'same-origin',
            });

            if (!resp.ok) throw new Error('Falha ao carregar notas (' + resp.status + ')');

            const data = await resp.json();

            if (!data.length) {
                tbody.innerHTML = '';
                vazio.style.display = '';
                return;
            }

            vazio.style.display = 'none';
            tbody.innerHTML = data.map((n) => {
                const fornecedor = n.emitente ? n.emitente.nome : '—';
                const tipo = n.tipo_documento ? n.tipo_documento.codigo : '—';
                return `<tr>
                    <td>${tipo}</td>
                    <td>${fornecedor}</td>
                    <td>${n.numero || ''} / ${n.serie || ''}</td>
                    <td>${formatarData(n.data_emissao)}</td>
                    <td>${formatarMoeda(n.valor_total)}</td>
                    <td>${n.status_importacao || ''}</td>
                    <td>
                        <a href="/comprador/nota-entrada/${n.id}/edit" class="btn btn-secondary">Editar</a>
                        <button type="button" class="btn btn-danger" data-id="${n.id}" data-acao="excluir">Excluir</button>
                    </td>
                </tr>`;
            }).join('');
        } catch (err) {
            alert('Erro: ' + (err.message || err));
        }
    }

    async function excluir(id) {
        if (!confirm('Excluir esta nota de entrada?')) return;

        try {
            const resp = await fetch('/api/notas-entrada/' + id, {
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