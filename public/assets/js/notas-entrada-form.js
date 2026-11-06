(function () {
    'use strict';

    const state = {
        id: null,
        etapa: 1,
        dados: null,
        tipos: [],
        fornecedores: [],
        periodoAberto: '',
    };

    function getCsrfToken() {
        const m = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
        return m ? decodeURIComponent(m[1]) : '';
    }

    function formatarMoeda(v) {
        const n = Number(v) || 0;
        return 'R$ ' + n.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }

    function novoEstado() {
        return {
            id_tipo_documento: state.tipos[0] ? state.tipos[0].id : '',
            chave: '',
            numero: '',
            serie: '1',
            data_emissao: '',
            id_pessoa_emitente: '',
            valor_produtos: 0,
            valor_desconto: 0,
            valor_frete: 0,
            valor_total: 0,
            itens: [novoItem()],
        };
    }

    function novoItem() {
        return {
            numero_item: 1,
            descricao: '',
            id_cfop: null,
            id_ncm: null,
            quantidade: 1,
            valor_unitario: 0,
            valor_total: 0,
            valor_desconto: 0,
            valor_frete: 0,
            valor_seguro: 0,
            outras_despesas: 0,
            impostos: [],
        };
    }

    // ===================== RENDER =====================

    function render() {
        const wizard = document.getElementById('wizard');
        if (state.etapa === 1) wizard.innerHTML = renderEtapa1();
        else if (state.etapa === 2) wizard.innerHTML = renderEtapa2();
        else if (state.etapa === 3) wizard.innerHTML = renderEtapa3();
        else wizard.innerHTML = renderEtapa4();

        ligarEventos();
    }

    function renderProgresso() {
        const etapas = ['Dados', 'Itens', 'Impostos', 'Revisão'];
        return `<div class="wizard-progress">
            ${etapas.map((nome, i) => {
                const n = i + 1;
                let cls = 'step';
                if (n < state.etapa) cls += ' done';
                else if (n === state.etapa) cls += ' current';
                return `<div class="${cls}" title="${nome}">${n < state.etapa ? '✓' : n}</div>`;
            }).join('')}
        </div>`;
    }

    function renderEtapa1() {
        const d = state.dados;
        return `${renderProgresso()}
        <div class="card">
            <h2>Dados do documento</h2>
            <div class="form-grid">
                <div class="form-row">
                    <label>Tipo de documento *</label>
                    <select id="f-tipo">
                        ${state.tipos.map(t => `<option value="${t.id}" ${d.id_tipo_documento == t.id ? 'selected' : ''}>${t.codigo} — ${t.descricao}</option>`).join('')}
                    </select>
                </div>
                <div class="form-row">
                    <label>Fornecedor *</label>
                    <select id="f-fornecedor">
                        <option value="">— Selecione —</option>
                        ${state.fornecedores.map(p => `<option value="${p.id}" ${d.id_pessoa_emitente == p.id ? 'selected' : ''}>${p.nome}</option>`).join('')}
                    </select>
                </div>
                <div class="form-row">
                    <label>Número *</label>
                    <input id="f-numero" value="${d.numero}">
                </div>
                <div class="form-row">
                    <label>Série</label>
                    <input id="f-serie" value="${d.serie}">
                </div>
                <div class="form-row">
                    <label>Chave (44 dígitos, opcional)</label>
                    <input id="f-chave" maxlength="44" value="${d.chave}">
                </div>
                <div class="form-row">
                    <label>Data de emissão *</label>
                    <input id="f-data" type="date" value="${d.data_emissao}">
                </div>
            </div>
            <p class="muted" style="margin-top:8px;">Período aberto da filial: <strong>${state.periodoAberto || '—'}</strong></p>
        </div>
        <div class="form-actions" style="justify-content:flex-end;">
            <button type="button" class="btn btn-primary" id="btn-proximo">Próximo →</button>
        </div>`;
    }

    function renderEtapa2() {
        const d = state.dados;
        return `${renderProgresso()}
        <div class="card">
            <h2>Itens</h2>
            <table class="data data-editavel">
                <thead>
                    <tr>
                        <th style="width:40px;">#</th>
                        <th>Descrição</th>
                        <th style="width:100px;">Qtd</th>
                        <th style="width:120px;">Vlr unit.</th>
                        <th style="width:120px;">Total</th>
                        <th style="width:40px;"></th>
                    </tr>
                </thead>
                <tbody>
                    ${d.itens.map((it, i) => `
                        <tr>
                            <td>${i + 1}</td>
                            <td><input data-item="${i}" data-campo="descricao" value="${it.descricao}"></td>
                            <td><input data-item="${i}" data-campo="quantidade" type="number" step="0.0001" value="${it.quantidade}"></td>
                            <td><input data-item="${i}" data-campo="valor_unitario" type="number" step="0.01" value="${it.valor_unitario}"></td>
                            <td><input data-item="${i}" data-campo="valor_total" type="number" step="0.01" value="${it.valor_total}"></td>
                            <td><button type="button" class="btn btn-danger" data-remover-item="${i}">×</button></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            <div class="form-actions" style="justify-content:flex-start; margin-top:10px;">
                <button type="button" class="btn btn-secondary" id="btn-add-item">+ Adicionar item</button>
            </div>
        </div>
        <div class="form-actions">
            <button type="button" class="btn btn-secondary" id="btn-voltar">← Voltar</button>
            <button type="button" class="btn btn-primary" id="btn-proximo">Próximo →</button>
        </div>`;
    }

    function renderEtapa3() {
        const d = state.dados;
        return `${renderProgresso()}
        <div class="card">
            <h2>Impostos</h2>
            <p class="muted">Informe os impostos por item (tipo e valor). Deixe em branco se não houver.</p>
            ${d.itens.map((it, i) => `
                <h3 style="margin-top:16px;">Item ${i + 1}: ${it.descricao || '—'}</h3>
                <table class="data data-editavel">
                    <thead>
                        <tr>
                            <th>Tipo</th>
                            <th style="width:140px;">Base</th>
                            <th style="width:100px;">Alíquota</th>
                            <th style="width:140px;">Valor</th>
                            <th style="width:40px;"></th>
                        </tr>
                    </thead>
                    <tbody>
                        ${it.impostos.map((imp, j) => `
                            <tr>
                                <td><input data-item="${i}" data-imposto="${j}" data-campo="tipo_imposto" value="${imp.tipo_imposto}"></td>
                                <td><input data-item="${i}" data-imposto="${j}" data-campo="base_calculo" type="number" step="0.01" value="${imp.base_calculo}"></td>
                                <td><input data-item="${i}" data-imposto="${j}" data-campo="aliquota" type="number" step="0.01" value="${imp.aliquota}"></td>
                                <td><input data-item="${i}" data-imposto="${j}" data-campo="valor" type="number" step="0.01" value="${imp.valor}"></td>
                                <td><button type="button" class="btn btn-danger" data-remover-imposto="${i}:${j}">×</button></td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                <div class="form-actions" style="justify-content:flex-start; margin-top:8px;">
                    <button type="button" class="btn btn-secondary" data-add-imposto="${i}">+ Imposto</button>
                </div>
            `).join('')}
        </div>
        <div class="form-actions">
            <button type="button" class="btn btn-secondary" id="btn-voltar">← Voltar</button>
            <button type="button" class="btn btn-primary" id="btn-proximo">Revisar →</button>
        </div>`;
    }

    function renderEtapa4() {
        const d = state.dados;
        return `${renderProgresso()}
        <div class="card">
            <h2>Revisão</h2>
            <p><strong>Número:</strong> ${d.numero} / ${d.serie} · <strong>Data:</strong> ${d.data_emissao} · <strong>Chave:</strong> ${d.chave || '—'}</p>
            <p><strong>Itens:</strong> ${d.itens.length} · <strong>Valor total:</strong> ${formatarMoeda(d.valor_total)}</p>
            <h3>Itens</h3>
            <table class="data">
                <thead><tr><th>#</th><th>Descrição</th><th>Qtd</th><th>Vlr unit.</th><th>Total</th><th>Impostos</th></tr></thead>
                <tbody>
                    ${d.itens.map((it, i) => `
                        <tr>
                            <td>${i + 1}</td>
                            <td>${it.descricao || '—'}</td>
                            <td>${it.quantidade}</td>
                            <td>${formatarMoeda(it.valor_unitario)}</td>
                            <td>${formatarMoeda(it.valor_total)}</td>
                            <td>${(it.impostos || []).map(x => x.tipo_imposto + ': ' + formatarMoeda(x.valor)).join('<br>') || '—'}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
        <div class="form-actions">
            <button type="button" class="btn btn-secondary" id="btn-voltar">← Voltar</button>
        </div>`;
    }

    // ===================== EVENTOS =====================

    function ligarEventos() {
        const proximo = document.getElementById('btn-proximo');
        if (proximo) proximo.addEventListener('click', avancar);

        const voltar = document.getElementById('btn-voltar');
        if (voltar) voltar.addEventListener('click', () => { state.etapa--; render(); });

        if (state.etapa === 1) {
            document.getElementById('f-tipo').addEventListener('change', (e) => state.dados.id_tipo_documento = Number(e.target.value));
            document.getElementById('f-fornecedor').addEventListener('change', (e) => state.dados.id_pessoa_emitente = e.target.value ? Number(e.target.value) : '');
            document.getElementById('f-numero').addEventListener('input', (e) => state.dados.numero = e.target.value);
            document.getElementById('f-serie').addEventListener('input', (e) => state.dados.serie = e.target.value);
            document.getElementById('f-chave').addEventListener('input', (e) => state.dados.chave = e.target.value);
            document.getElementById('f-data').addEventListener('change', (e) => state.dados.data_emissao = e.target.value);
        }

        if (state.etapa === 2) {
            document.querySelectorAll('[data-item][data-campo]').forEach((el) => {
                el.addEventListener('input', (e) => {
                    const i = Number(e.target.dataset.item);
                    const campo = e.target.dataset.campo;
                    const v = e.target.value;
                    state.dados.itens[i][campo] = (campo === 'descricao') ? v : (parseFloat(v) || 0);
                    if (campo === 'quantidade' || campo === 'valor_unitario') {
                        const it = state.dados.itens[i];
                        it.valor_total = (it.quantidade || 0) * (it.valor_unitario || 0);
                    }
                });
            });
            document.querySelectorAll('[data-remover-item]').forEach((el) => {
                el.addEventListener('click', (e) => {
                    const i = Number(e.target.dataset.removerItem);
                    if (state.dados.itens.length === 1) { alert('A nota precisa ter pelo menos um item.'); return; }
                    state.dados.itens.splice(i, 1);
                    render();
                });
            });
            document.getElementById('btn-add-item').addEventListener('click', () => {
                const it = novoItem();
                it.numero_item = state.dados.itens.length + 1;
                state.dados.itens.push(it);
                render();
            });
        }

        if (state.etapa === 3) {
            document.querySelectorAll('[data-imposto][data-campo]').forEach((el) => {
                el.addEventListener('input', (e) => {
                    const i = Number(e.target.dataset.item);
                    const j = Number(e.target.dataset.imposto);
                    const campo = e.target.dataset.campo;
                    const v = e.target.value;
                    state.dados.itens[i].impostos[j][campo] = (campo === 'tipo_imposto') ? v : (parseFloat(v) || 0);
                });
            });
            document.querySelectorAll('[data-remover-imposto]').forEach((el) => {
                el.addEventListener('click', (e) => {
                    const [i, j] = e.target.dataset.removerImposto.split(':').map(Number);
                    state.dados.itens[i].impostos.splice(j, 1);
                    render();
                });
            });
            document.querySelectorAll('[data-add-imposto]').forEach((el) => {
                el.addEventListener('click', (e) => {
                    const i = Number(e.target.dataset.addImposto);
                    state.dados.itens[i].impostos.push({
                        tipo_imposto: '', id_cst: null, base_calculo: 0, aliquota: 0, valor: 0, valor_st: 0,
                    });
                    render();
                });
            });
        }
    }

    function validarEtapa1() {
        const d = state.dados;
        if (!d.id_tipo_documento) { alert('Selecione o tipo de documento.'); return false; }
        if (!d.id_pessoa_emitente) { alert('Selecione o fornecedor.'); return false; }
        if (!d.numero) { alert('Informe o número.'); return false; }
        if (!d.data_emissao) { alert('Informe a data de emissão.'); return false; }
        if (d.chave && d.chave.length !== 44) { alert('A chave deve ter 44 caracteres.'); return false; }
        return true;
    }

    function validarEtapa2() {
        const d = state.dados;
        if (!d.itens.length) { alert('A nota precisa ter pelo menos um item.'); return false; }
        for (const it of d.itens) {
            if (!it.descricao) { alert('Preencha a descrição de todos os itens.'); return false; }
            if (!it.quantidade || it.quantidade <= 0) { alert('Quantidade deve ser > 0.'); return false; }
            if (it.valor_total === 0) { alert('Informe o valor total do item.'); return false; }
        }
        return true;
    }

    function recalcularTotal() {
        const d = state.dados;
        d.valor_produtos = d.itens.reduce((s, it) => s + (Number(it.valor_total) || 0), 0);
        d.valor_total = d.valor_produtos - (Number(d.valor_desconto) || 0) + (Number(d.valor_frete) || 0);
    }

    function avancar() {
        if (state.etapa === 1) {
            if (!validarEtapa1()) return;
            state.etapa = 2;
        } else if (state.etapa === 2) {
            if (!validarEtapa2()) return;
            recalcularTotal();
            state.etapa = 3;
        } else if (state.etapa === 3) {
            recalcularTotal();
            state.etapa = 4;
        }
        render();
    }

    // ===================== AÇÕES FINAIS =====================

    function payload() {
        return {
            id_tipo_documento: state.dados.id_tipo_documento,
            chave: state.dados.chave || null,
            numero: state.dados.numero,
            serie: state.dados.serie || null,
            data_emissao: state.dados.data_emissao,
            id_pessoa_emitente: state.dados.id_pessoa_emitente,
            valor_produtos: state.dados.valor_produtos,
            valor_desconto: state.dados.valor_desconto,
            valor_frete: state.dados.valor_frete,
            valor_total: state.dados.valor_total,
            itens: state.dados.itens.map((it, i) => ({
                numero_item: i + 1,
                descricao: it.descricao,
                id_cfop: it.id_cfop,
                id_ncm: it.id_ncm,
                quantidade: it.quantidade,
                valor_unitario: it.valor_unitario,
                valor_total: it.valor_total,
                valor_desconto: it.valor_desconto || 0,
                valor_frete: it.valor_frete || 0,
                valor_seguro: it.valor_seguro || 0,
                outras_despesas: it.outras_despesas || 0,
                impostos: (it.impostos || []).map(x => ({
                    tipo_imposto: x.tipo_imposto,
                    id_cst: x.id_cst || null,
                    base_calculo: x.base_calculo || 0,
                    aliquota: x.aliquota || 0,
                    valor: x.valor || 0,
                    valor_st: x.valor_st || 0,
                })),
            })),
        };
    }

    async function enviar(url, metodo) {
        const resp = await fetch(url, {
            method: metodo,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-XSRF-TOKEN': getCsrfToken(),
            },
            credentials: 'same-origin',
            body: JSON.stringify(payload()),
        });

        if (!resp.ok) {
            const err = await resp.json().catch(() => ({}));
            alert('Erro: ' + JSON.stringify(err.errors || err.message || err));
            return null;
        }

        return resp.json();
    }

    async function salvarRascunho() {
        const r = await enviar('/api/notas-entrada/rascunho', 'POST');
        if (r) {
            alert('Rascunho salvo.');
            window.location.href = '/comprador/nota-entrada';
        }
    }

    async function confirmar() {
        const url = state.id ? '/api/notas-entrada/' + state.id : '/api/notas-entrada';
        const metodo = state.id ? 'PUT' : 'POST';

        const r = await enviar(url, metodo);
        if (!r) return;

        if (r.id) {
            const conf = await fetch('/api/notas-entrada/' + r.id + '/confirmar', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'X-XSRF-TOKEN': getCsrfToken(),
                },
                credentials: 'same-origin',
            });
            if (!conf.ok) {
                const err = await conf.json().catch(() => ({}));
                alert('Erro ao confirmar: ' + JSON.stringify(err.errors || err.message || err));
                return;
            }
        }

        window.location.href = '/comprador/nota-entrada';
    }

    // ===================== INIT =====================

    function init() {
        const app = document.getElementById('notas-entrada-form-app');
        state.id = app.dataset.id ? Number(app.dataset.id) : null;
        state.periodoAberto = app.dataset.periodoAberto || '';
        state.tipos = JSON.parse(app.dataset.tipos || '[]');
        state.fornecedores = JSON.parse(app.dataset.fornecedores || '[]');
        state.dados = novoEstado();

        if (state.id) {
            fetch('/api/notas-entrada/' + state.id, {
                headers: { 'Accept': 'application/json' },
                credentials: 'same-origin',
            })
            .then(r => r.ok ? r.json() : Promise.reject(r))
            .then(n => {
                state.dados.id_tipo_documento = n.id_tipo_documento;
                state.dados.chave = n.chave || '';
                state.dados.numero = n.numero || '';
                state.dados.serie = n.serie || '';
                state.dados.data_emissao = String(n.data_emissao || '').slice(0, 10);
                state.dados.id_pessoa_emitente = n.id_pessoa_emitente || '';
                state.dados.valor_produtos = Number(n.valor_produtos) || 0;
                state.dados.valor_desconto = Number(n.valor_desconto) || 0;
                state.dados.valor_frete = Number(n.valor_frete) || 0;
                state.dados.valor_total = Number(n.valor_total) || 0;
                state.dados.itens = (n.itens || []).map(it => ({
                    numero_item: it.numero_item,
                    descricao: it.descricao,
                    id_cfop: it.id_cfop,
                    id_ncm: it.id_ncm,
                    quantidade: Number(it.quantidade) || 0,
                    valor_unitario: Number(it.valor_unitario) || 0,
                    valor_total: Number(it.valor_total) || 0,
                    valor_desconto: Number(it.valor_desconto) || 0,
                    valor_frete: Number(it.valor_frete) || 0,
                    valor_seguro: Number(it.valor_seguro) || 0,
                    outras_despesas: Number(it.outras_despesas) || 0,
                    impostos: (it.impostos || []).map(x => ({
                        tipo_imposto: x.tipo_imposto,
                        id_cst: x.id_cst,
                        base_calculo: Number(x.base_calculo) || 0,
                        aliquota: Number(x.aliquota) || 0,
                        valor: Number(x.valor) || 0,
                        valor_st: Number(x.valor_st) || 0,
                    })),
                }));
                render();
            })
            .catch(() => alert('Nota não encontrada.'));
        } else {
            render();
        }

        document.getElementById('btn-rascunho').addEventListener('click', salvarRascunho);
        document.getElementById('btn-confirmar').addEventListener('click', confirmar);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();