(function () {
    'use strict';

    const state = {
        contas: [],
        kpis: {},
        opcoes: { contas_bancarias: [], formas_pagamento: [] },
        filtros: { status: 'todas', fornecedor: '', periodo: 'todos' },
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
                fetch('/api/contas-pagar', {
                    headers: { 'Accept': 'application/json' },
                    credentials: 'same-origin',
                }),
                fetch('/api/contas-pagar/opcoes', {
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
        document.getElementById('contas-pagar-kpis').innerHTML = `
            <div class="kpi-card kpi-pagar">
                <span class="kpi-label">Em aberto</span>
                <span class="kpi-valor">${formatarMoeda(k.em_aberto)}</span>
            </div>
            <div class="kpi-card kpi-vencido">
                <span class="kpi-label">Vencidas</span>
                <span class="kpi-valor">${formatarMoeda(k.vencidas)}</span>
            </div>
            <div class="kpi-card">
                <span class="kpi-label">Pago</span>
                <span class="kpi-valor">${formatarMoeda(k.pago)}</span>
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

            if (state.filtros.fornecedor) {
                const nome = (c.pessoa && c.pessoa.nome) ? c.pessoa.nome.toLowerCase() : '';
                if (!nome.includes(state.filtros.fornecedor.toLowerCase())) return false;
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
        const tbody = document.querySelector('#tabela-contas-pagar tbody');
        const vazio = document.getElementById('contas-pagar-vazio');
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
            const classes = [vencida ? 'linha-vencida' : '', c.status === 'Baixada' ? 'linha-baixada' : ''].filter(Boolean).join(' ');
            const fornecedor = c.pessoa ? c.pessoa.nome : '—';
            const doc = c.nota_fiscal ? (c.nota_fiscal.numero || 'NF') : '—';

            return `<tr class="${classes}">
                <td><strong>${fornecedor}</strong></td>
                <td>${doc}</td>
                <td>${c.numero_parcela}/${c.total_parcelas}</td>
                <td>${formatarData(c.data_vencimento)}${vencida ? ' <span class="badge badge-status-vencida">vencida</span>' : ''}</td>
                <td class="valor">${formatarMoeda(c.valor)}</td>
                <td>${badge(c)}</td>
                <td>
                    <div class="acoes-linha">
                        ${c.status !== 'Baixada'
                            ? `<button type="button" class="btn-sm" data-baixar="${c.id}">Pagar</button>`
                            : `<button type="button" class="btn-sm" data-estornar="${c.id}" title="Estornar baixa">Estornar</button>`}
                    </div>
                </td>
            </tr>`;
        }).join('');
    }

    function badge(c) {
        switch (c.status) {
            case 'Aberta': return '<span class="badge badge-status-aberta">Aberta</span>';
            case 'Parcialmente baixada': return '<span class="badge badge-status-parcial">Parcial</span>';
            case 'Baixada': return '<span class="badge badge-status-baixada">Baixada</span>';
            case 'Cancelada': return '<span class="badge badge-status-cancelada">Cancelada</span>';
            default: return '<span class="badge">—</span>';
        }
    }

    // ===================== MODAL DE BAIXA =====================

    function abrirModalBaixa(id) {
        const conta = state.contas.find((c) => c.id === id);
        if (!conta) return;

        const hoje = new Date();
        const hojeIso = hoje.toISOString().slice(0, 10);
        const venc = new Date(String(conta.data_vencimento).slice(0, 10));
        const diasAtraso = Math.max(0, Math.floor((hoje - venc) / (24 * 60 * 60 * 1000)));
        const saldo = Number(conta.valor) - Number(conta.valor_pago);

        state.baixa = {
            conta_id: id,
            valor_conta: Number(conta.valor),
            saldo: saldo,
            valor_pago: saldo,
            data_pagamento: hojeIso,
            juros: diasAtraso > 0 ? +(saldo * 0.00033 * diasAtraso).toFixed(2) : 0,
            multa: diasAtraso > 0 ? +(saldo * 0.02).toFixed(2) : 0,
            desconto: 0,
            id_conta_bancaria: state.opcoes.contas_bancarias[0]?.id || null,
            id_forma_pagamento: state.opcoes.formas_pagamento[0]?.id || null,
            observacoes: '',
            dias_atraso: diasAtraso,
        };

        document.body.insertAdjacentHTML('beforeend', modalBaixa());
    }

    function modalBaixa() {
        const b = state.baixa;
        const total = b.valor_pago + b.juros + b.multa - b.desconto;

        return `
        <div class="modal-backdrop" id="modal-baixa-pagar">
            <div class="modal">
                <div class="modal-header">
                    <h2>Registrar pagamento</h2>
                    <button type="button" class="modal-close" data-fechar-modal>×</button>
                </div>
                <div class="modal-body">
                    ${b.dias_atraso > 0 ? `<div class="alerta-inadimplencia">⚠️ Conta vencida há <strong>${b.dias_atraso} dia(s)</strong>. Juros e multa sugeridos automaticamente.</div>` : ''}

                    <div class="form-grid">
                        <div class="form-row">
                            <label>Data do pagamento</label>
                            <input id="b-data" type="date" value="${b.data_pagamento}">
                        </div>
                        <div class="form-row">
                            <label>Valor pago</label>
                            <input id="b-valor" type="number" step="0.01" value="${b.valor_pago}">
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
                            <label>Forma de pagamento</label>
                            <select id="b-forma">
                                ${state.opcoes.formas_pagamento.map((f) => `<option value="${f.id}" ${b.id_forma_pagamento === f.id ? 'selected' : ''}>${f.descricao}</option>`).join('')}
                            </select>
                        </div>
                    </div>

                    <div class="form-row" style="margin-top:10px;">
                        <label>Observações</label>
                        <textarea id="b-obs" rows="2">${b.observacoes}</textarea>
                    </div>

                    <div class="baixa-resumo">
                        <div class="linha"><span class="label">Saldo</span><span class="valor">${formatarMoeda(b.saldo)}</span></div>
                        <div class="linha"><span class="label">Valor pago</span><span class="valor">${formatarMoeda(b.valor_pago)}</span></div>
                        <div class="linha"><span class="label">Juros</span><span class="valor">${formatarMoeda(b.juros)}</span></div>
                        <div class="linha"><span class="label">Multa</span><span class="valor">${formatarMoeda(b.multa)}</span></div>
                        <div class="linha"><span class="label">Desconto</span><span class="valor">- ${formatarMoeda(b.desconto)}</span></div>
                        <div class="linha total"><span class="label">Total a pagar</span><span class="valor">${formatarMoeda(total)}</span></div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-fechar-modal>Cancelar</button>
                    <button type="button" class="btn btn-primary" id="btn-confirmar-baixa">Confirmar pagamento</button>
                </div>
            </div>
        </div>`;
    }

    function lerModalBaixa() {
        state.baixa.data_pagamento = document.getElementById('b-data').value;
        state.baixa.valor_pago = parseFloat(document.getElementById('b-valor').value) || 0;
        state.baixa.juros = parseFloat(document.getElementById('b-juros').value) || 0;
        state.baixa.multa = parseFloat(document.getElementById('b-multa').value) || 0;
        state.baixa.desconto = parseFloat(document.getElementById('b-desconto').value) || 0;
        state.baixa.id_conta_bancaria = Number(document.getElementById('b-conta').value) || null;
        state.baixa.id_forma_pagamento = Number(document.getElementById('b-forma').value) || null;
        state.baixa.observacoes = document.getElementById('b-obs').value;
    }

    function fecharModal() {
        const el = document.getElementById('modal-baixa-pagar');
        if (el) el.remove();
        state.baixa = null;
    }

    async function confirmarBaixa() {
        lerModalBaixa();
        const b = state.baixa;

        try {
            const resp = await fetch('/api/contas-pagar/' + b.conta_id + '/baixar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-XSRF-TOKEN': getCsrfToken(),
                },
                credentials: 'same-origin',
                body: JSON.stringify({
                    data_pagamento: b.data_pagamento,
                    valor_pago: b.valor_pago,
                    juros: b.juros,
                    multa: b.multa,
                    desconto: b.desconto,
                    id_conta_bancaria: b.id_conta_bancaria,
                    id_forma_pagamento: b.id_forma_pagamento,
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
        if (!confirm('Estornar a baixa desta conta? O status voltará para "Aberta".')) return;

        try {
            const resp = await fetch('/api/contas-pagar/' + id + '/estornar', {
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
        document.getElementById('filtro-fornecedor').addEventListener('input', (e) => { state.filtros.fornecedor = e.target.value; renderTabela(); });
        document.getElementById('filtro-periodo').addEventListener('change', (e) => { state.filtros.periodo = e.target.value; renderTabela(); });

        document.addEventListener('click', (ev) => {
            const btnBaixar = ev.target.closest('[data-baixar]');
            if (btnBaixar) { abrirModalBaixa(Number(btnBaixar.dataset.baixar)); return; }

            const btnEstornar = ev.target.closest('[data-estornar]');
            if (btnEstornar) { estornar(Number(btnEstornar.dataset.estornar)); return; }

            if (ev.target.closest('[data-fechar-modal]')) { fecharModal(); return; }

            if (ev.target.id === 'btn-confirmar-baixa') { confirmarBaixa(); return; }

            // Recalcula total ao digitar nos campos do modal
            if (['b-valor', 'b-juros', 'b-multa', 'b-desconto'].includes(ev.target.id)) {
                const modal = ev.target.closest('.modal');
                if (modal) {
                    lerModalBaixa();
                    const b = state.baixa;
                    const total = b.valor_pago + b.juros + b.multa - b.desconto;
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