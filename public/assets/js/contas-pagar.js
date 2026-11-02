/* ============================================================
   CONTAS A PAGAR
   Lista, baixa (total/parcial), juros/multa/desconto, estorno
   ============================================================ */

let filtroContasPagar = {
  status: 'todas',       // todas, abertas, baixadas, vencidas
  fornecedor: '',
  periodo: 'todos',      // todos, 30dias, 60dias, vencidas
};

let baixaFormPagar = null;    // estado do modal de baixa

// ============================================================
// TELA PRINCIPAL
// ============================================================

screens['contas-pagar'] = () => {
  const hoje = new Date('2026-10-24');
  const contasFiltradas = filtrarContasPagar(contasPagar, hoje);

  return `
    <div class="contas-header">
      <h1>Contas a Pagar</h1>
      <button class="btn btn-primary" onclick="abrirNovaContaPagar()">+ Nova conta</button>
    </div>
    <p class="subtitle">Gerencie pagamentos, baixas e juros/multa</p>

    ${kpisContasPagar(hoje)}

    ${filtrosContasPagar()}

    <div class="card">
      <table class="data data-contas">
        <thead>
          <tr>
            <th>Fornecedor</th>
            <th>Documento</th>
            <th>Parcela</th>
            <th>Vencimento</th>
            <th style="text-align:right;">Valor</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          ${contasFiltradas.length === 0
            ? '<tr><td colspan="7" style="text-align:center; color:rgba(255,255,255,0.4); padding:20px;">Nenhuma conta encontrada.</td></tr>'
            : contasFiltradas.map(c => linhaContaPagar(c, hoje)).join('')}
        </tbody>
      </table>
    </div>
  `;
};

// ============================================================
// KPIs
// ============================================================

function kpisContasPagar(hoje) {
  const abertas = contasPagar.filter(c => c.status === 'Aberta' || c.status === 'Parcialmente baixada');
  const vencidas = abertas.filter(c => new Date(c.dataVencimento) < hoje);
  const totalAberto = abertas.reduce((s, c) => s + (c.valor - c.valorPago), 0);
  const totalVencido = vencidas.reduce((s, c) => s + (c.valor - c.valorPago), 0);
  const totalPago = contasPagar.filter(c => c.status === 'Baixada').reduce((s, c) => s + c.valorPago, 0);

  return `
    <div class="contas-kpis">
      <div class="kpi-card kpi-pagar">
        <span class="kpi-label">Em aberto</span>
        <span class="kpi-valor">${formatarMoeda(totalAberto)}</span>
      </div>
      <div class="kpi-card kpi-vencido">
        <span class="kpi-label">Vencidas</span>
        <span class="kpi-valor">${formatarMoeda(totalVencido)}</span>
      </div>
      <div class="kpi-card">
        <span class="kpi-label">Pago</span>
        <span class="kpi-valor">${formatarMoeda(totalPago)}</span>
      </div>
      <div class="kpi-card kpi-saldo">
        <span class="kpi-label">Contas abertas</span>
        <span class="kpi-valor">${abertas.length}</span>
      </div>
    </div>
  `;
}

// ============================================================
// FILTROS
// ============================================================

function filtrosContasPagar() {
  return `
    <div class="contas-filtros">
      <select onchange="setFiltroContasPagar('status', this.value)">
        <option value="todas" ${filtroContasPagar.status === 'todas' ? 'selected' : ''}>Todas</option>
        <option value="abertas" ${filtroContasPagar.status === 'abertas' ? 'selected' : ''}>Abertas</option>
        <option value="vencidas" ${filtroContasPagar.status === 'vencidas' ? 'selected' : ''}>Vencidas</option>
        <option value="baixadas" ${filtroContasPagar.status === 'baixadas' ? 'selected' : ''}>Baixadas</option>
      </select>
      <input type="text" placeholder="Buscar fornecedor..."
             value="${filtroContasPagar.fornecedor}"
             oninput="setFiltroContasPagar('fornecedor', this.value)">
      <select onchange="setFiltroContasPagar('periodo', this.value)">
        <option value="todos" ${filtroContasPagar.periodo === 'todos' ? 'selected' : ''}>Todo o período</option>
        <option value="30dias" ${filtroContasPagar.periodo === '30dias' ? 'selected' : ''}>Próximos 30 dias</option>
        <option value="60dias" ${filtroContasPagar.periodo === '60dias' ? 'selected' : ''}>Próximos 60 dias</option>
        <option value="vencidas" ${filtroContasPagar.periodo === 'vencidas' ? 'selected' : ''}>Só vencidas</option>
      </select>
    </div>
  `;
}

function setFiltroContasPagar(campo, valor) {
  filtroContasPagar[campo] = valor;
  document.getElementById('content').innerHTML = screens['contas-pagar']();
}

function filtrarContasPagar(contas, hoje) {
  return contas.filter(c => {
    // Status
    if (filtroContasPagar.status === 'abertas' && c.status !== 'Aberta' && c.status !== 'Parcialmente baixada') return false;
    if (filtroContasPagar.status === 'baixadas' && c.status !== 'Baixada') return false;
    if (filtroContasPagar.status === 'vencidas') {
      if (c.status === 'Baixada') return false;
      if (new Date(c.dataVencimento) >= hoje) return false;
    }
    // Fornecedor
    if (filtroContasPagar.fornecedor) {
      const f = filtroContasPagar.fornecedor.toLowerCase();
      if (!c.fornecedor.toLowerCase().includes(f)) return false;
    }
    // Período
    if (filtroContasPagar.periodo === '30dias') {
      const venc = new Date(c.dataVencimento);
      const em30 = new Date(hoje.getTime() + 30 * 24 * 60 * 60 * 1000);
      if (venc < hoje || venc > em30) return false;
    }
    if (filtroContasPagar.periodo === '60dias') {
      const venc = new Date(c.dataVencimento);
      const em60 = new Date(hoje.getTime() + 60 * 24 * 60 * 60 * 1000);
      if (venc < hoje || venc > em60) return false;
    }
    if (filtroContasPagar.periodo === 'vencidas') {
      if (c.status === 'Baixada') return false;
      if (new Date(c.dataVencimento) >= hoje) return false;
    }
    return true;
  });
}

// ============================================================
// LINHA DA TABELA
// ============================================================

function linhaContaPagar(c, hoje) {
  const vencida = c.status !== 'Baixada' && new Date(c.dataVencimento) < hoje;
  const classes = [
    vencida ? 'linha-vencida' : '',
    c.status === 'Baixada' ? 'linha-baixada' : '',
  ].filter(Boolean).join(' ');

  return `
    <tr class="${classes}">
      <td><strong>${c.fornecedor}</strong></td>
      <td>${c.documento}</td>
      <td>${c.numeroParcela}/${c.totalParcelas}</td>
      <td>${formatarData(c.dataVencimento)}${vencida ? ' <span class="badge badge-status-vencida">vencida</span>' : ''}</td>
      <td class="valor">${formatarMoeda(c.valor)}</td>
      <td>${badgeStatusPagar(c)}</td>
      <td>
        <div class="acoes-linha">
          ${c.status !== 'Baixada'
            ? `<button class="btn-sm" onclick="abrirBaixaPagar(${c.id})">Pagar</button>`
            : `<button class="btn-sm" onclick="estornarBaixaPagar(${c.id})" title="Estornar baixa">Estornar</button>`}
          <button class="btn-sm" onclick="verDetalhesPagar(${c.id})" title="Ver detalhes">Ver</button>
        </div>
      </td>
    </tr>
  `;
}

function badgeStatusPagar(c) {
  switch (c.status) {
    case 'Aberta': return '<span class="badge badge-status-aberta">Aberta</span>';
    case 'Parcialmente baixada': return '<span class="badge badge-status-parcial">Parcial</span>';
    case 'Baixada': return '<span class="badge badge-status-baixada">Baixada</span>';
    case 'Cancelada': return '<span class="badge badge-status-cancelada">Cancelada</span>';
    default: return '<span class="badge">—</span>';
  }
}

// ============================================================
// MODAL DE BAIXA
// ============================================================

function abrirBaixaPagar(id) {
  const c = contasPagar.find(x => x.id === id);
  if (!c) return;
  const hoje = '2026-10-24';
  const venc = new Date(c.dataVencimento);
  const hojeDate = new Date(hoje);
  const diasAtraso = Math.max(0, Math.floor((hojeDate - venc) / (24 * 60 * 60 * 1000)));

  baixaFormPagar = {
    contaId: id,
    valorConta: c.valor,
    valorPago: c.valor,
    dataPagamento: hoje,
    juros: diasAtraso > 0 ? (c.valor * PARAMETROS_JUROS.jurosAoDia / 100 * diasAtraso) : 0,
    multa: diasAtraso > 0 ? (c.valor * PARAMETROS_JUROS.multa / 100) : 0,
    desconto: 0,
    idContaBancaria: 1,
    idFormaPagamento: 1,
    observacoes: '',
    diasAtraso,
  };

  document.body.insertAdjacentHTML('beforeend', modalBaixaPagar());
}

function modalBaixaPagar() {
  const total = baixaFormPagar.valorPago + baixaFormPagar.juros + baixaFormPagar.multa - baixaFormPagar.desconto;
  return `
    <div class="modal-backdrop" id="modal-baixa-pagar" onclick="fecharModalBaixaPagar(event)">
      <div class="modal" onclick="event.stopPropagation()">
        <div class="modal-header">
          <h2>Registrar pagamento</h2>
          <button class="modal-close" onclick="fecharModalBaixaPagar()">×</button>
        </div>
        <div class="modal-body">
          ${baixaFormPagar.diasAtraso > 0 ? `
            <div class="alerta-inadimplencia">
              ⚠️ Conta vencida há <strong>${baixaFormPagar.diasAtraso} dia(s)</strong>.
              Juros e multa calculados automaticamente.
            </div>
          ` : ''}

          <div class="form-grid">
            <div class="form-row">
              <label>Data do pagamento</label>
              <input type="date" value="${baixaFormPagar.dataPagamento}"
                     onchange="baixaFormPagar.dataPagamento=this.value; atualizarModalBaixaPagar()">
            </div>
            <div class="form-row">
              <label>Valor pago</label>
              <input type="number" step="0.01" value="${baixaFormPagar.valorPago}"
                     onchange="baixaFormPagar.valorPago=parseFloat(this.value)||0; atualizarModalBaixaPagar()">
            </div>
            <div class="form-row">
              <label>Juros</label>
              <input type="number" step="0.01" value="${baixaFormPagar.juros.toFixed(2)}"
                     onchange="baixaFormPagar.juros=parseFloat(this.value)||0; atualizarModalBaixaPagar()">
            </div>
            <div class="form-row">
              <label>Multa</label>
              <input type="number" step="0.01" value="${baixaFormPagar.multa.toFixed(2)}"
                     onchange="baixaFormPagar.multa=parseFloat(this.value)||0; atualizarModalBaixaPagar()">
            </div>
            <div class="form-row">
              <label>Desconto</label>
              <input type="number" step="0.01" value="${baixaFormPagar.desconto}"
                     onchange="baixaFormPagar.desconto=parseFloat(this.value)||0; atualizarModalBaixaPagar()">
            </div>
            <div class="form-row">
              <label>Conta bancária</label>
              <select onchange="baixaFormPagar.idContaBancaria=parseInt(this.value)">
                ${CONTAS_BANCARIAS.map(cb => `
                  <option value="${cb.id}" ${baixaFormPagar.idContaBancaria === cb.id ? 'selected' : ''}>
                    ${cb.banco} — ${cb.agencia} / ${cb.numero}
                  </option>
                `).join('')}
              </select>
            </div>
            <div class="form-row">
              <label>Forma de pagamento</label>
              <select onchange="baixaFormPagar.idFormaPagamento=parseInt(this.value)">
                ${FORMAS_PAGAMENTO.map(f => `
                  <option value="${f.id}" ${baixaFormPagar.idFormaPagamento === f.id ? 'selected' : ''}>
                    ${f.descricao}
                  </option>
                `).join('')}
              </select>
            </div>
          </div>

          <div class="form-row" style="margin-top:10px;">
            <label>Observações</label>
            <textarea rows="2" onchange="baixaFormPagar.observacoes=this.value">${baixaFormPagar.observacoes}</textarea>
          </div>

          <div class="baixa-resumo" id="baixa-resumo">
            <div class="linha">
              <span class="label">Valor da conta</span>
              <span class="valor">${formatarMoeda(baixaFormPagar.valorConta)}</span>
            </div>
            <div class="linha">
              <span class="label">Valor pago</span>
              <span class="valor">${formatarMoeda(baixaFormPagar.valorPago)}</span>
            </div>
            <div class="linha">
              <span class="label">Juros</span>
              <span class="valor">${formatarMoeda(baixaFormPagar.juros)}</span>
            </div>
            <div class="linha">
              <span class="label">Multa</span>
              <span class="valor">${formatarMoeda(baixaFormPagar.multa)}</span>
            </div>
            <div class="linha">
              <span class="label">Desconto</span>
              <span class="valor">- ${formatarMoeda(baixaFormPagar.desconto)}</span>
            </div>
            <div class="linha total">
              <span class="label">Total a pagar</span>
              <span class="valor">${formatarMoeda(total)}</span>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="fecharModalBaixaPagar()">Cancelar</button>
          <button class="btn btn-primary" onclick="confirmarBaixaPagar()">Confirmar pagamento</button>
        </div>
      </div>
    </div>
  `;
}

function atualizarModalBaixaPagar() {
  const el = document.getElementById('modal-baixa-pagar');
  if (el) {
    el.outerHTML = modalBaixaPagar();
  }
}

function fecharModalBaixaPagar(event) {
  if (event && event.target.id !== 'modal-baixa-pagar') return;
  const el = document.getElementById('modal-baixa-pagar');
  if (el) el.remove();
  baixaFormPagar = null;
}

function confirmarBaixaPagar() {
  const c = contasPagar.find(x => x.id === baixaFormPagar.contaId);
  if (!c) return;

  c.valorPago = baixaFormPagar.valorPago;
  c.juros = baixaFormPagar.juros;
  c.multa = baixaFormPagar.multa;
  c.desconto = baixaFormPagar.desconto;
  c.dataPagamento = baixaFormPagar.dataPagamento;
  c.status = c.valorPago >= c.valor ? 'Baixada' : 'Parcialmente baixada';
  c.statusFluxo = c.status === 'Baixada' ? 'Pago' : 'Parcialmente pago';

  fecharModalBaixaPagar();
  showScreen('contas-pagar');
}

// ============================================================
// ESTORNO
// ============================================================

function estornarBaixaPagar(id) {
  if (!confirm('Estornar a baixa desta conta? O status voltará para "Aberta".')) return;
  const c = contasPagar.find(x => x.id === id);
  if (!c) return;
  c.valorPago = 0;
  c.juros = 0;
  c.multa = 0;
  c.desconto = 0;
  c.dataPagamento = null;
  c.status = 'Aberta';
  c.statusFluxo = 'Aguardando pagamento';
  showScreen('contas-pagar');
}

// ============================================================
// DETALHES
// ============================================================

function verDetalhesPagar(id) {
  const c = contasPagar.find(x => x.id === id);
  if (!c) return;
  alert(
    `Fornecedor: ${c.fornecedor}\n` +
    `Documento: ${c.documento}\n` +
    `Parcela: ${c.numeroParcela}/${c.totalParcelas}\n` +
    `Valor: ${formatarMoeda(c.valor)}\n` +
    `Vencimento: ${formatarData(c.dataVencimento)}\n` +
    `Status: ${c.status}\n` +
    (c.dataPagamento ? `Pago em: ${formatarData(c.dataPagamento)} (${formatarMoeda(c.valorPago)})` : '')
  );
}

// ============================================================
// NOVA CONTA
// ============================================================

function abrirNovaContaPagar() {
  alert('No wireframe, a nova conta a pagar é gerada automaticamente a partir da nota de entrada (F1).');
}