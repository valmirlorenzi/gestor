/* ============================================================
   CONTAS A RECEBER
   Lista, baixa (total/parcial), juros/multa/desconto, estorno,
   inadimplência
   ============================================================ */

let filtroContasReceber = {
  status: 'todas',
  cliente: '',
  periodo: 'todos',
};

let baixaFormReceber = null;

// ============================================================
// TELA PRINCIPAL
// ============================================================

screens['contas-receber'] = () => {
  const hoje = new Date('2026-10-24');
  const contasFiltradas = filtrarContasReceber(contasReceber, hoje);

  return `
    <div class="contas-header">
      <h1>Contas a Receber</h1>
      <button class="btn btn-primary" onclick="abrirNovaContaReceber()">+ Nova conta</button>
    </div>
    <p class="subtitle">Gerencie recebimentos, baixas e inadimplência</p>

    ${kpisContasReceber(hoje)}

    ${filtrosContasReceber()}

    <div class="card">
      <table class="data data-contas">
        <thead>
          <tr>
            <th>Cliente</th>
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
            : contasFiltradas.map(c => linhaContaReceber(c, hoje)).join('')}
        </tbody>
      </table>
    </div>
  `;
};

// ============================================================
// KPIs
// ============================================================

function kpisContasReceber(hoje) {
  const abertas = contasReceber.filter(c => c.status === 'Aberta' || c.status === 'Parcialmente baixada');
  const vencidas = abertas.filter(c => new Date(c.dataVencimento) < hoje);
  const totalAberto = abertas.reduce((s, c) => s + (c.valor - c.valorRecebido), 0);
  const totalVencido = vencidas.reduce((s, c) => s + (c.valor - c.valorRecebido), 0);
  const totalRecebido = contasReceber.filter(c => c.status === 'Baixada').reduce((s, c) => s + c.valorRecebido, 0);

  return `
    <div class="contas-kpis">
      <div class="kpi-card kpi-receber">
        <span class="kpi-label">Em aberto</span>
        <span class="kpi-valor">${formatarMoeda(totalAberto)}</span>
      </div>
      <div class="kpi-card kpi-vencido">
        <span class="kpi-label">Inadimplência</span>
        <span class="kpi-valor">${formatarMoeda(totalVencido)}</span>
      </div>
      <div class="kpi-card">
        <span class="kpi-label">Recebido</span>
        <span class="kpi-valor">${formatarMoeda(totalRecebido)}</span>
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

function filtrosContasReceber() {
  return `
    <div class="contas-filtros">
      <select onchange="setFiltroContasReceber('status', this.value)">
        <option value="todas" ${filtroContasReceber.status === 'todas' ? 'selected' : ''}>Todas</option>
        <option value="abertas" ${filtroContasReceber.status === 'abertas' ? 'selected' : ''}>Abertas</option>
        <option value="vencidas" ${filtroContasReceber.status === 'vencidas' ? 'selected' : ''}>Inadimplentes</option>
        <option value="baixadas" ${filtroContasReceber.status === 'baixadas' ? 'selected' : ''}>Recebidas</option>
      </select>
      <input type="text" placeholder="Buscar cliente..."
             value="${filtroContasReceber.cliente}"
             oninput="setFiltroContasReceber('cliente', this.value)">
      <select onchange="setFiltroContasReceber('periodo', this.value)">
        <option value="todos" ${filtroContasReceber.periodo === 'todos' ? 'selected' : ''}>Todo o período</option>
        <option value="30dias" ${filtroContasReceber.periodo === '30dias' ? 'selected' : ''}>Próximos 30 dias</option>
        <option value="60dias" ${filtroContasReceber.periodo === '60dias' ? 'selected' : ''}>Próximos 60 dias</option>
        <option value="vencidas" ${filtroContasReceber.periodo === 'vencidas' ? 'selected' : ''}>Só inadimplentes</option>
      </select>
    </div>
  `;
}

function setFiltroContasReceber(campo, valor) {
  filtroContasReceber[campo] = valor;
  document.getElementById('content').innerHTML = screens['contas-receber']();
}

function filtrarContasReceber(contas, hoje) {
  return contas.filter(c => {
    if (filtroContasReceber.status === 'abertas' && c.status !== 'Aberta' && c.status !== 'Parcialmente baixada') return false;
    if (filtroContasReceber.status === 'baixadas' && c.status !== 'Baixada') return false;
    if (filtroContasReceber.status === 'vencidas') {
      if (c.status === 'Baixada') return false;
      if (new Date(c.dataVencimento) >= hoje) return false;
    }
    if (filtroContasReceber.cliente) {
      const f = filtroContasReceber.cliente.toLowerCase();
      if (!c.cliente.toLowerCase().includes(f)) return false;
    }
    if (filtroContasReceber.periodo === '30dias') {
      const venc = new Date(c.dataVencimento);
      const em30 = new Date(hoje.getTime() + 30 * 24 * 60 * 60 * 1000);
      if (venc < hoje || venc > em30) return false;
    }
    if (filtroContasReceber.periodo === '60dias') {
      const venc = new Date(c.dataVencimento);
      const em60 = new Date(hoje.getTime() + 60 * 24 * 60 * 60 * 1000);
      if (venc < hoje || venc > em60) return false;
    }
    if (filtroContasReceber.periodo === 'vencidas') {
      if (c.status === 'Baixada') return false;
      if (new Date(c.dataVencimento) >= hoje) return false;
    }
    return true;
  });
}

// ============================================================
// LINHA
// ============================================================

function linhaContaReceber(c, hoje) {
  const vencida = c.status !== 'Baixada' && new Date(c.dataVencimento) < hoje;
  const diasAtraso = vencida
    ? Math.floor((hoje - new Date(c.dataVencimento)) / (24 * 60 * 60 * 1000))
    : 0;
  const classes = [
    vencida ? 'linha-vencida' : '',
    c.status === 'Baixada' ? 'linha-baixada' : '',
  ].filter(Boolean).join(' ');

  return `
    <tr class="${classes}">
      <td><strong>${c.cliente}</strong></td>
      <td>${c.documento}</td>
      <td>${c.numeroParcela}/${c.totalParcelas}</td>
      <td>
        ${formatarData(c.dataVencimento)}
        ${vencida ? `<span class="badge badge-status-vencida">${diasAtraso}d atraso</span>` : ''}
      </td>
      <td class="valor">${formatarMoeda(c.valor)}</td>
      <td>${badgeStatusReceber(c, vencida)}</td>
      <td>
        <div class="acoes-linha">
          ${c.status !== 'Baixada'
            ? `<button class="btn-sm" onclick="abrirBaixaReceber(${c.id})">Receber</button>`
            : `<button class="btn-sm" onclick="estornarBaixaReceber(${c.id})" title="Estornar baixa">Estornar</button>`}
          <button class="btn-sm" onclick="verDetalhesReceber(${c.id})" title="Ver detalhes">Ver</button>
        </div>
      </td>
    </tr>
  `;
}

function badgeStatusReceber(c, vencida) {
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

// ============================================================
// MODAL DE BAIXA (RECEBIMENTO)
// ============================================================

function abrirBaixaReceber(id) {
  const c = contasReceber.find(x => x.id === id);
  if (!c) return;
  const hoje = '2026-10-24';
  const venc = new Date(c.dataVencimento);
  const hojeDate = new Date(hoje);
  const diasAtraso = Math.max(0, Math.floor((hojeDate - venc) / (24 * 60 * 60 * 1000)));

  baixaFormReceber = {
    contaId: id,
    valorConta: c.valor,
    valorRecebido: c.valor,
    dataRecebimento: hoje,
    juros: diasAtraso > 0 ? (c.valor * PARAMETROS_JUROS.jurosAoDia / 100 * diasAtraso) : 0,
    multa: diasAtraso > 0 ? (c.valor * PARAMETROS_JUROS.multa / 100) : 0,
    desconto: 0,
    idContaBancaria: 1,
    idFormaRecebimento: 1,
    observacoes: '',
    diasAtraso,
  };

  document.body.insertAdjacentHTML('beforeend', modalBaixaReceber());
}

function modalBaixaReceber() {
  const total = baixaFormReceber.valorRecebido + baixaFormReceber.juros + baixaFormReceber.multa - baixaFormReceber.desconto;
  return `
    <div class="modal-backdrop" id="modal-baixa-receber" onclick="fecharModalBaixaReceber(event)">
      <div class="modal" onclick="event.stopPropagation()">
        <div class="modal-header">
          <h2>Registrar recebimento</h2>
          <button class="modal-close" onclick="fecharModalBaixaReceber()">×</button>
        </div>
        <div class="modal-body">
          ${baixaFormReceber.diasAtraso > 0 ? `
            <div class="alerta-inadimplencia">
              ⚠️ Recebimento em atraso de <strong>${baixaFormReceber.diasAtraso} dia(s)</strong>.
              Juros e multa calculados automaticamente.
            </div>
          ` : ''}

          <div class="form-grid">
            <div class="form-row">
              <label>Data do recebimento</label>
              <input type="date" value="${baixaFormReceber.dataRecebimento}"
                     onchange="baixaFormReceber.dataRecebimento=this.value; atualizarModalBaixaReceber()">
            </div>
            <div class="form-row">
              <label>Valor recebido</label>
              <input type="number" step="0.01" value="${baixaFormReceber.valorRecebido}"
                     onchange="baixaFormReceber.valorRecebido=parseFloat(this.value)||0; atualizarModalBaixaReceber()">
            </div>
            <div class="form-row">
              <label>Juros</label>
              <input type="number" step="0.01" value="${baixaFormReceber.juros.toFixed(2)}"
                     onchange="baixaFormReceber.juros=parseFloat(this.value)||0; atualizarModalBaixaReceber()">
            </div>
            <div class="form-row">
              <label>Multa</label>
              <input type="number" step="0.01" value="${baixaFormReceber.multa.toFixed(2)}"
                     onchange="baixaFormReceber.multa=parseFloat(this.value)||0; atualizarModalBaixaReceber()">
            </div>
            <div class="form-row">
              <label>Desconto</label>
              <input type="number" step="0.01" value="${baixaFormReceber.desconto}"
                     onchange="baixaFormReceber.desconto=parseFloat(this.value)||0; atualizarModalBaixaReceber()">
            </div>
            <div class="form-row">
              <label>Conta bancária</label>
              <select onchange="baixaFormReceber.idContaBancaria=parseInt(this.value)">
                ${CONTAS_BANCARIAS.map(cb => `
                  <option value="${cb.id}" ${baixaFormReceber.idContaBancaria === cb.id ? 'selected' : ''}>
                    ${cb.banco} — ${cb.agencia} / ${cb.numero}
                  </option>
                `).join('')}
              </select>
            </div>
            <div class="form-row">
              <label>Forma de recebimento</label>
              <select onchange="baixaFormReceber.idFormaRecebimento=parseInt(this.value)">
                ${FORMAS_PAGAMENTO.map(f => `
                  <option value="${f.id}" ${baixaFormReceber.idFormaRecebimento === f.id ? 'selected' : ''}>
                    ${f.descricao}
                  </option>
                `).join('')}
              </select>
            </div>
          </div>

          <div class="form-row" style="margin-top:10px;">
            <label>Observações</label>
            <textarea rows="2" onchange="baixaFormReceber.observacoes=this.value">${baixaFormReceber.observacoes}</textarea>
          </div>

          <div class="baixa-resumo" id="baixa-resumo-receber">
            <div class="linha">
              <span class="label">Valor da conta</span>
              <span class="valor">${formatarMoeda(baixaFormReceber.valorConta)}</span>
            </div>
            <div class="linha">
              <span class="label">Valor recebido</span>
              <span class="valor">${formatarMoeda(baixaFormReceber.valorRecebido)}</span>
            </div>
            <div class="linha">
              <span class="label">Juros</span>
              <span class="valor">${formatarMoeda(baixaFormReceber.juros)}</span>
            </div>
            <div class="linha">
              <span class="label">Multa</span>
              <span class="valor">${formatarMoeda(baixaFormReceber.multa)}</span>
            </div>
            <div class="linha">
              <span class="label">Desconto</span>
              <span class="valor">- ${formatarMoeda(baixaFormReceber.desconto)}</span>
            </div>
            <div class="linha total">
              <span class="label">Total recebido</span>
              <span class="valor">${formatarMoeda(total)}</span>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="fecharModalBaixaReceber()">Cancelar</button>
          <button class="btn btn-primary" onclick="confirmarBaixaReceber()">Confirmar recebimento</button>
        </div>
      </div>
    </div>
  `;
}

function atualizarModalBaixaReceber() {
  const el = document.getElementById('modal-baixa-receber');
  if (el) el.outerHTML = modalBaixaReceber();
}

function fecharModalBaixaReceber(event) {
  if (event && event.target.id !== 'modal-baixa-receber') return;
  const el = document.getElementById('modal-baixa-receber');
  if (el) el.remove();
  baixaFormReceber = null;
}

function confirmarBaixaReceber() {
  const c = contasReceber.find(x => x.id === baixaFormReceber.contaId);
  if (!c) return;

  c.valorRecebido = baixaFormReceber.valorRecebido;
  c.juros = baixaFormReceber.juros;
  c.multa = baixaFormReceber.multa;
  c.desconto = baixaFormReceber.desconto;
  c.dataRecebimento = baixaFormReceber.dataRecebimento;
  c.status = c.valorRecebido >= c.valor ? 'Baixada' : 'Parcialmente baixada';
  c.statusFluxo = c.status === 'Baixada' ? 'Recebido' : 'Parcialmente recebido';

  fecharModalBaixaReceber();
  showScreen('contas-receber');
}

// ============================================================
// ESTORNO
// ============================================================

function estornarBaixaReceber(id) {
  if (!confirm('Estornar o recebimento desta conta? O status voltará para "Aberta".')) return;
  const c = contasReceber.find(x => x.id === id);
  if (!c) return;
  c.valorRecebido = 0;
  c.juros = 0;
  c.multa = 0;
  c.desconto = 0;
  c.dataRecebimento = null;
  c.status = 'Aberta';
  c.statusFluxo = 'Aguardando recebimento';
  showScreen('contas-receber');
}

// ============================================================
// DETALHES
// ============================================================

function verDetalhesReceber(id) {
  const c = contasReceber.find(x => x.id === id);
  if (!c) return;
  alert(
    `Cliente: ${c.cliente}\n` +
    `Documento: ${c.documento}\n` +
    `Parcela: ${c.numeroParcela}/${c.totalParcelas}\n` +
    `Valor: ${formatarMoeda(c.valor)}\n` +
    `Vencimento: ${formatarData(c.dataVencimento)}\n` +
    `Status: ${c.status}\n` +
    (c.dataRecebimento ? `Recebido em: ${formatarData(c.dataRecebimento)} (${formatarMoeda(c.valorRecebido)})` : '')
  );
}

// ============================================================
// NOVA CONTA
// ============================================================

function abrirNovaContaReceber() {
  alert('No wireframe, a nova conta a receber é gerada automaticamente a partir da nota de saída (F2).');
}