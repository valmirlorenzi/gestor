(function () {
    'use strict';

    const state = {
        contas: [],
        kpis: {},
        opcoes: { contas_bancarias: [], formas_pagamento: [] },
        filtros: { status: 'todas', cliente: '', periodo: 'todos' },
        baixa: null,
    };

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
        try {
            const [respContas, respOpcoes] = await Promise.all([
                fetch('/api/contas-receber', {
                    headers: { 'Accept': 'application/json' },
                    credentials: 'same-origin',
                }),
                fetch('/api/contas-receber/opcoes', {
                    headers: { 'Accept': 'application/json' },
                    credentials: 'same-origin',
                }),
            ]);

            if (!respContas.ok) throw new Error('Falha ao carregar contas (' + respContas.status + ')');

            const data = await respContas.json();
            state.contas = data.contas || [];
            state.kpis = data.kpis || {};

            if (respOpcoes.ok) {
                state.opcoes = await respOpcoes.json();
            }

            render();
        } catch (err) {
            alert('Erro: ' + (err.message || err));
        }
    }

    function render() {
        renderKpis();
        renderTabela();
    }

    function renderKpis() {
        const k = state.kpis;
        document.getElementById('contas-receber-kpis').innerHTML = `
            <div class="kpi-card kpi-receber">
                <span class="kpi-label">Em aberto</span>
                <span class="kpi-valor">${formatarMoeda(k.em_aberto)}</span>
            </div>
            <div class="kpi-card kpi-vencido">
                <span class="kpi-label">Inadimplência</span>
                <span class="kpi-valor">${formatarMoeda(k.inadimplencia)}</span>
            </div>
            <div class="kpi-card">
                <span class="kpi-label">Recebido</span>
                <span class="kpi-valor">${formatarMoeda(k.recebido)}</span>
            </div>
            <div class="kpi-card kpi-saldo">
                <span class="kpi-label">Contas abertas</span>
                <span class="kpi-valor">${k.contas_abertas || 0}</span>
            </div>
        `;
    }

    function filtrar() {
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);

        return state.contas.filter((c) => {
            const status = c.status;
            const venc = new Date(String(c.data_vencimento).slice(0, 10));
            const vencida = status !== 'Baixada' && venc < hoje;

            if (state.filtros.status === 'abertas' && status !== 'Aberta' && status !== 'Parcialmente baixada') return false;
            if (state.filtros.status === 'baixadas' && status !== 'Baixada') return false;
            if (state.filtros.status === 'vencidas' && !vencida) return false;

            if (state.filtros.cliente) {
                const nome = (c.pessoa && c.pessoa.nome) ? c.pessoa.nome.toLowerCase() : '';
                if (!nome.includes(state.filtros.cliente.toLowerCase())) return false;
            }

            if (state.filtros.periodo === '30dias') {
                const em30 = new Date(hoje.getTime() + 30 * 24 * 60 * 60 * 1000);
                if (venc < hoje || venc > em30) return false;
            }
            if (state.filtros.periodo === '60dias') {
                const em60 = new Date(hoje.getTime() + 60 * 24 * 60 * 60 * 1000);
                if (venc < hoje || venc > em60) return false;
            }
            if (state.filtros.periodo === 'vencidas' && !vencida) return false;

            return true;
        });
    }

    function renderTabela() {
        const tbody = document.querySelector('#tabela-contas-receber tbody');
        const vazio = document.getElementById('contas-receber-vazio');
        const lista = filtrar();
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);

        if (!lista.length) {
            tbody.innerHTML = '';
            vazio.style.display = '';
            return;
        }

        vazio.style.display = 'none';
        tbody.innerHTML = lista.map((c) => {
            const venc = new Date(String(c.data_vencimento).slice(0, 10));
            const vencida = c.status !== 'Baixada' && venc < hoje;
            const diasAtraso = vencida ? Math.floor((hoje - venc) / (24 * 60 * 60 * 1000)) : 0;
            const classes = [vencida ? 'linha-vencida' : '', c.status === 'Baixada' ? 'linha-baixada' : ''].filter(Boolean).join(' ');
            const cliente = c.pessoa ? c.pessoa.nome : '—';
            const doc = c.nota_fiscal ? (c.nota_fiscal.numero || 'NF') : '—';

            return `<tr class="${classes}">
                <td><strong>${cliente}</strong></td>
                <td>${doc}</td>
                <td>${c.numero_parcela}/${c.total_parcelas}</td>
                <td>${formatarData(c.data_vencimento)}${vencida ? ` <span class="badge badge-status-vencida">${diasAtraso}d atraso</span>` : ''}</td>
                <td class="valor">${formatarMoeda(c.valor)}</td>
                <td>${badge(c, vencida)}</td>
                <td>
                    <div class="acoes-linha">
                        ${c.status !== 'Baixada'
                            ? `<button type="button" class="btn-sm" data-receber="${c.id}">Receber</button>`
                            : `<button type="button" class="btn-sm" data-estornar="${c.id}" title="Estornar baixa">Estornar</button>`}
                    </div>
                </td>
            </tr>`;
        }).join('');
    }

    function badge(c, vencida) {
        if (vencida && c.status !== 'Baixada') {
            return '<span class="badge badge-status-vencida">Inadimplente</span>';
        }
        switch (c.status) {
            case 'Aberta': return '<span class="badge badge-status-aberta">Aberta</span>';
            case 'Parcialmente baixada': return '<span class="badge badge-status-parcial">Parcial</span>';
            case 'Baixada': return '<span class="badge badge-status-baixada">Recebida</span>';
            case 'Cancelada': return '<span class="badge badge-status-cancelada">Cancelada</span>';
            default: return '<span class="badge">—</span>';
        }
    }

    // ===================== MODAL DE BAIXA =====================

    function abrirModalReceber(id) {
        const conta = state.contas.find((c) => c.id === id);
        if (!conta) return;

        const hoje = new Date();
        const hojeIso = hoje.toISOString().slice(0, 10);
        const venc = new Date(String(conta.data_vencimento).slice(0, 10));
        const diasAtraso = Math.max(0, Math.floor((hoje - venc) / (24 * 60 * 60 * 1000)));
        const saldo = Number(conta.valor) - Number(conta.valor_recebido);

        state.baixa = {
            conta_id: id,
            valor_conta: Number(conta.valor),
            saldo: saldo,
            valor_recebido: saldo,
            data_recebimento: hojeIso,
            juros: diasAtraso > 0 ? +(saldo * 0.00033 * diasAtraso).toFixed(2) : 0,
            multa: diasAtraso > 0 ? +(saldo * 0.02).toFixed(2) : 0,
            desconto: 0,
            id_conta_bancaria: state.opcoes.contas_bancarias[0]?.id || null,
            id_forma_recebimento: state.opcoes.formas_pagamento[0]?.id || null,
            observacoes: '',
            dias_atraso: diasAtraso,
        };

        document.body.insertAdjacentHTML('beforeend', modalReceber());
    }

    function modalReceber() {
        const b = state.baixa;
        const total = b.valor_recebido + b.juros + b.multa - b.desconto;

        return `
        <div class="modal-backdrop" id="modal-baixa-receber">
            <div class="modal">
                <div class="modal-header">
                    <h2>Registrar recebimento</h2>
                    <button type="button" class="modal-close" data-fechar-modal>×</button>
                </div>
                <div class="modal-body">
                    ${b.dias_atraso > 0 ? `<div class="alerta-inadimplencia">⚠️ Recebimento em atraso de <strong>${b.dias_atraso} dia(s)</strong>. Juros e multa sugeridos automaticamente.</div>` : ''}

                    <div class="form-grid">
                        <div class="form-row">
                            <label>Data do recebimento</label>
                            <input id="b-data" type="date" value="${b.data_recebimento}">
                        </div>
                        <div class="form-row">
                            <label>Valor recebido</label>
                            <input id="b-valor" type="number" step="0.01" value="${b.valor_recebido}">
                        </div>
                        <div class="form-row">
                            <label>Juros</label>
                            <input id="b-juros" type="number" step="0.01" value="${b.juros}">
                        </div>
                        <div class="form-row">
                            <label>Multa</label>
                            <input id="b-multa" type="number" step="0.01" value="${b.multa}">
                        </div>
                        <div class="form-row">
                            <label>Desconto</label>
                            <input id="b-desconto" type="number" step="0.01" value="${b.desconto}">
                        </div>
                        <div class="form-row">
                            <label>Conta bancária</label>
                            <select id="b-conta">
                                ${state.opcoes.contas_bancarias.map((cb) => `<option value="${cb.id}" ${b.id_conta_bancaria === cb.id ? 'selected' : ''}>${cb.agencia} / ${cb.numero}</option>`).join('')}
                            </select>
                        </div>
                        <div class="form-row">
                            <label>Forma de recebimento</label>
                            <select id="b-forma">
                                ${state.opcoes.formas_pagamento.map((f) => `<option value="${f.id}" ${b.id_forma_recebimento === f.id ? 'selected' : ''}>${f.descricao}</option>`).join('')}
                            </select>
                        </div>
                    </div>

                    <div class="form-row" style="margin-top:10px;">
                        <label>Observações</label>
                        <textarea id="b-obs" rows="2">${b.observacoes}</textarea>
                    </div>

                    <div class="baixa-resumo">
                        <div class="linha"><span class="label">Saldo</span><span class="valor">${formatarMoeda(b.saldo)}</span></div>
                        <div class="linha"><span class="label">Valor recebido</span><span class="valor">${formatarMoeda(b.valor_recebido)}</span></div>
                        <div class="linha"><span class="label">Juros</span><span class="valor">${formatarMoeda(b.juros)}</span></div>
                        <div class="linha"><span class="label">Multa</span><span class="valor">${formatarMoeda(b.multa)}</span></div>
                        <div class="linha"><span class="label">Desconto</span><span class="valor">- ${formatarMoeda(b.desconto)}</span></div>
                        <div class="linha total"><span class="label">Total recebido</span><span class="valor">${formatarMoeda(total)}</span></div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-fechar-modal>Cancelar</button>
                    <button type="button" class="btn btn-primary" id="btn-confirmar-receber">Confirmar recebimento</button>
                </div>
            </div>
        </div>`;
    }

    function lerModal() {
        state.baixa.data_recebimento = document.getElementById('b-data').value;
        state.baixa.valor_recebido = parseFloat(document.getElementById('b-valor').value) || 0;
        state.baixa.juros = parseFloat(document.getElementById('b-juros').value) || 0;
        state.baixa.multa = parseFloat(document.getElementById('b-multa').value) || 0;
        state.baixa.desconto = parseFloat(document.getElementById('b-desconto').value) || 0;
        state.baixa.id_conta_bancaria = Number(document.getElementById('b-conta').value) || null;
        state.baixa.id_forma_recebimento = Number(document.getElementById('b-forma').value) || null;
        state.baixa.observacoes = document.getElementById('b-obs').value;
    }

    function fecharModal() {
        const el = document.getElementById('modal-baixa-receber');
        if (el) el.remove();
        state.baixa = null;
    }

    async function confirmarReceber() {
        lerModal();
        const b = state.baixa;

        try {
            const resp = await fetch('/api/contas-receber/' + b.conta_id + '/receber', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-XSRF-TOKEN': getCsrfToken(),
                },
                credentials: 'same-origin',
                body: JSON.stringify({
                    data_recebimento: b.data_recebimento,
                    valor_recebido: b.valor_recebido,
                    juros: b.juros,
                    multa: b.multa,
                    desconto: b.desconto,
                    id_conta_bancaria: b.id_conta_bancaria,
                    id_forma_recebimento: b.id_forma_recebimento,
                    observacoes: b.observacoes,
                }),
            });

            if (!resp.ok) {
                const err = await resp.json().catch(() => ({}));
                alert('Erro: ' + JSON.stringify(err.errors || err.message || err));
                return;
            }

            fecharModal();
            await carregar();
        } catch (err) {
            alert('Erro: ' + (err.message || err));
        }
    }

    async function estornar(id) {
        if (!confirm('Estornar o recebimento desta conta? O status voltará para "Aberta".')) return;

        try {
            const resp = await fetch('/api/contas-receber/' + id + '/estornar', {
                method: 'POST',
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
        document.getElementById('filtro-status').addEventListener('change', (e) => { state.filtros.status = e.target.value; renderTabela(); });
        document.getElementById('filtro-cliente').addEventListener('input', (e) => { state.filtros.cliente = e.target.value; renderTabela(); });
        document.getElementById('filtro-periodo').addEventListener('change', (e) => { state.filtros.periodo = e.target.value; renderTabela(); });

        document.addEventListener('click', (ev) => {
            const btnReceber = ev.target.closest('[data-receber]');
            if (btnReceber) { abrirModalReceber(Number(btnReceber.dataset.receber)); return; }

            const btnEstornar = ev.target.closest('[data-estornar]');
            if (btnEstornar) { estornar(Number(btnEstornar.dataset.estornar)); return; }

            if (ev.target.closest('[data-fechar-modal]')) { fecharModal(); return; }

            if (ev.target.id === 'btn-confirmar-receber') { confirmarReceber(); return; }

            if (['b-valor', 'b-juros', 'b-multa', 'b-desconto'].includes(ev.target.id)) {
                const modal = ev.target.closest('.modal');
                if (modal) {
                    lerModal();
                    const b = state.baixa;
                    const total = b.valor_recebido + b.juros + b.multa - b.desconto;
                    const linha = modal.querySelector('.baixa-resumo .linha.total .valor');
                    if (linha) linha.textContent = formatarMoeda(total);
                }
            }
        });

        carregar();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();