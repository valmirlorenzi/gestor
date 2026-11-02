/* ============================================================
   GERENTE FINANCEIRO — Validar Saídas (9.1) e Entradas (9.2)
   Tela única, adaptada pelo tipo (saida/entrada).
   ============================================================ */

screens['validar-saidas'] = () => renderValidacaoFinanceira('saida');
screens['validar-entradas'] = () => renderValidacaoFinanceira('entrada');

function renderValidacaoFinanceira(tipo) {
  const isSaida = tipo === 'saida';
  const titulo = isSaida ? 'Validar Saídas de Caixa/Banco' : 'Validar Entradas de Caixa/Banco';
  const subtitulo = isSaida
    ? 'Confirme ou rejeite as saídas geradas pelo Financeiro1'
    : 'Confirme ou rejeite as entradas geradas pelo Financeiro2';
  const filtro = isSaida ? filtroValidacaoSaidas : filtroValidacaoEntradas;
  const lista = ordensValidacao.filter(o => o.tipo === tipo);
  const filtradas = filtrarValidacaoFinanceira(lista, filtro);

  return `
    <div class="contador-header">
      <h1>${titulo}</h1>
      <span class="badge ${isSaida ? 'badge-status-parcial' : 'badge-status-concluida'}">
        ${isSaida ? 'saídas' : 'entradas'}
      </span>
    </div>
    <p class="subtitle">${subtitulo}</p>

    ${kpisValidacaoFinanceira(lista, isSaida)}
    ${filtrosValidacaoFinanceira(tipo)}

    ${filtradas.length === 0
      ? vazioValidacaoFinanceira(isSaida)
      : filtradas.map(o => cardValidacaoFinanceira(o, isSaida)).join('')}
  `;
}

// ============================================================
// KPIs
// ============================================================

function kpisValidacaoFinanceira(lista, isSaida) {
  const pendentes = lista.filter(o => o.status === 'pendente').length;
  const confirmadas = lista.filter(o => o.status === 'confirmada').length;
  const rejeitadas = lista.filter(o => o.status === 'rejeitada').length;
  const totalPendente = lista
    .filter(o => o.status === 'pendente')
    .reduce((s, o) => s + o.total, 0);

  return `
    <div class="contador-kpis">
      <div class="kpi-card ${isSaida ? 'kpi-erro' : 'kpi-ok'}">
        <span class="kpi-label">Total pendente</span>
        <span class="kpi-valor">${formatarMoeda(totalPendente)}</span>
      </div>
      <div class="kpi-card kpi-aviso">
        <span class="kpi-label">Pendentes</span>
        <span class="kpi-valor">${pendentes}</span>
      </div>
      <div class="kpi-card kpi-ok">
        <span class="kpi-label">Confirmadas</span>
        <span class="kpi-valor">${confirmadas}</span>
      </div>
      <div class="kpi-card kpi-erro">
        <span class="kpi-label">Rejeitadas</span>
        <span class="kpi-valor">${rejeitadas}</span>
      </div>
    </div>
  `;
}

// ============================================================
// FILTROS
// ============================================================

function filtrosValidacaoFinanceira(tipo) {
  const filtro = tipo === 'saida' ? filtroValidacaoSaidas : filtroValidacaoEntradas;
  const prefixo = tipo === 'saida' ? 'Saidas' : 'Entradas';

  return `
    <div class="contador-filtros">
      <select onchange="setFiltroValidacaoFinanceira('${tipo}', 'status', this.value)">
        <option value="pendente" ${filtro.status === 'pendente' ? 'selected' : ''}>Pendentes</option>
        <option value="confirmada" ${filtro.status === 'confirmada' ? 'selected' : ''}>Confirmadas</option>
        <option value="rejeitada" ${filtro.status === 'rejeitada' ? 'selected' : ''}>Rejeitadas</option>
        <option value="todas" ${filtro.status === 'todas' ? 'selected' : ''}>Todas</option>
      </select>
      <select onchange="setFiltroValidacaoFinanceira('${tipo}', 'periodo', this.value)">
        <option value="todos" ${filtro.periodo === 'todos' ? 'selected' : ''}>Todo o período</option>
        <option value="hoje" ${filtro.periodo === 'hoje' ? 'selected' : ''}>Hoje</option>
        <option value="7dias" ${filtro.periodo === '7dias' ? 'selected' : ''}>Últimos 7 dias</option>
        <option value="30dias" ${filtro.periodo === '30dias' ? 'selected' : ''}>Últimos 30 dias</option>
      </select>
      <input type="text" placeholder="Buscar contraparte/documento..."
             value="${filtro.busca}"
             oninput="setFiltroValidacaoFinanceira('${tipo}', 'busca', this.value)">
    </div>
  `;
}

function setFiltroValidacaoFinanceira(tipo, campo, valor) {
  if (tipo === 'saida') filtroValidacaoSaidas[campo] = valor;
  else filtroValidacaoEntradas[campo] = valor;
  const rota = tipo === 'saida' ? 'validar-saidas' : 'validar-entradas';
  document.getElementById('content').innerHTML = screens[rota]();
}

function filtrarValidacaoFinanceira(lista, filtro) {
  return lista.filter(o => {
    if (filtro.status !== 'todas' && o.status !== filtro.status) return false;
    if (filtro.periodo !== 'todos') {
      const data = new Date(o.tipo === 'saida' ? o.dataPagamento : o.dataRecebimento);
      const hoje = new Date('2026-10-24');
      if (filtro.periodo === 'hoje') {
        if (data.toDateString() !== hoje.toDateString()) return false;
      } else {
        const dias = filtro.periodo === '7dias' ? 7 : 30;
        const limite = new Date(hoje.getTime() - dias * 24 * 60 * 60 * 1000);
        if (data < limite) return false;
      }
    }
    if (filtro.busca) {
      const b = filtro.busca.toLowerCase();
      if (!o.contraparte.toLowerCase().includes(b) && !o.documento.toLowerCase().includes(b)) return false;
    }
    return true;
  }).sort((a, b) => {
    // Pendentes primeiro, depois por data (mais antigas primeiro)
    if (a.status !== b.status) return a.status === 'pendente' ? -1 : 1;
    const dataA = new Date(a.tipo === 'saida' ? a.dataPagamento : a.dataRecebimento);
    const dataB = new Date(b.tipo === 'saida' ? b.dataPagamento : b.dataRecebimento);
    return dataA - dataB;
  });
}

// ============================================================
// CARD DA ORDEM
// ============================================================

function cardValidacaoFinanceira(o, isSaida) {
  const classe = o.status === 'pendente' ? '' : o.status === 'confirmada' ? 'status-concluida' : 'status-cancelada';
  const badgeStatus = o.status === 'pendente'
    ? '<span class="badge badge-status-pendente">pendente</span>'
    : o.status === 'confirmada'
      ? '<span class="badge badge-status-concluida">✓ confirmada</span>'
      : '<span class="badge badge-status-cancelada">✗ rejeitada</span>';

  const data = isSaida ? o.dataPagamento : o.dataRecebimento;
  const forma = isSaida ? o.formaPagamento : o.formaRecebimento;

  return `
    <div class="lancamento-card ${classe}">
      <div class="lc-topo">
        <div class="lc-dados">
          <div class="lc-titulo">
            ${isSaida ? '💸 Saída' : '💰 Entrada'} · ${o.contraparte}
            <span class="badge badge-info" style="margin-left:8px;">${o.tipoOrdem}</span>
          </div>
          <div class="lc-meta">
            <span>📄 ${o.documento}</span>
            <span>📅 ${formatarData(data)}</span>
            <span>🏦 ${o.contaBancaria}</span>
            <span>💳 ${forma}</span>
            ${badgeStatus}
          </div>
        </div>
        <div class="lc-valor">${formatarMoeda(o.total)}</div>
      </div>

      <div class="lc-sugestao" style="display:grid; grid-template-columns:repeat(auto-fit, minmax(140px, 1fr)); gap:12px;">
        <div>
          <div class="muted" style="font-size:11px;">Valor original</div>
          <div style="font-size:14px; font-weight:600;">${formatarMoeda(o.valor)}</div>
        </div>
        ${o.juros > 0 ? `
          <div>
            <div class="muted" style="font-size:11px;">Juros</div>
            <div style="font-size:14px; font-weight:600; color:#ff922b;">${formatarMoeda(o.juros)}</div>
          </div>
        ` : ''}
        ${o.multa > 0 ? `
          <div>
            <div class="muted" style="font-size:11px;">Multa</div>
            <div style="font-size:14px; font-weight:600; color:#ff922b;">${formatarMoeda(o.multa)}</div>
          </div>
        ` : ''}
        ${o.desconto > 0 ? `
          <div>
            <div class="muted" style="font-size:11px;">Desconto</div>
            <div style="font-size:14px; font-weight:600; color:#51cf66;">- ${formatarMoeda(o.desconto)}</div>
          </div>
        ` : ''}
        <div>
          <div class="muted" style="font-size:11px;">Total ${isSaida ? 'a pagar' : 'a receber'}</div>
          <div style="font-size:14px; font-weight:700;">${formatarMoeda(o.total)}</div>
        </div>
      </div>

      ${o.status === 'pendente' ? `
        <div class="lc-acoes">
          <button class="btn btn-primary" onclick="confirmarValidacao(${o.id})">
            ✓ Confirmar ${isSaida ? 'saída' : 'entrada'}
          </button>
          <button class="btn btn-secondary" onclick="rejeitarValidacao(${o.id})">
            ✗ Rejeitar
          </button>
        </div>
      ` : `
        <div class="lc-acoes">
          <button class="btn btn-secondary" onclick="verDetalhesValidacao(${o.id})">Ver detalhes</button>
        </div>
      `}
    </div>
  `;
}

// ============================================================
// AÇÕES
// ============================================================

function confirmarValidacao(id) {
  const o = ordensValidacao.find(x => x.id === id);
  if (!o) return;
  if (!confirm(`Confirmar ${o.tipo === 'saida' ? 'saída' : 'entrada'} de ${formatarMoeda(o.total)} de ${o.contraparte}?`)) return;
  o.status = 'confirmada';
  o.observacoes = 'Confirmado pelo Gerente Financeiro';
  const rota = o.tipo === 'saida' ? 'validar-saidas' : 'validar-entradas';
  document.getElementById('content').innerHTML = screens[rota]();
}

function rejeitarValidacao(id) {
  const o = ordensValidacao.find(x => x.id === id);
  if (!o) return;
  const motivo = prompt('Motivo da rejeição (será enviado ao ' + (o.tipo === 'saida' ? 'Financeiro1' : 'Financeiro2') + '):');
  if (!motivo) return;
  o.status = 'rejeitada';
  o.observacoes = motivo;
  const rota = o.tipo === 'saida' ? 'validar-saidas' : 'validar-entradas';
  document.getElementById('content').innerHTML = screens[rota]();
}

function verDetalhesValidacao(id) {
  const o = ordensValidacao.find(x => x.id === id);
  if (!o) return;
  alert(
    `Ordem ${o.tipoOrdem} — ${o.tipoOrdemNome}\n\n` +
    `Contraparte: ${o.contraparte}\n` +
    `Documento: ${o.documento}\n` +
    `Valor original: ${formatarMoeda(o.valor)}\n` +
    `Juros: ${formatarMoeda(o.juros)}\n` +
    `Multa: ${formatarMoeda(o.multa)}\n` +
    `Desconto: ${formatarMoeda(o.desconto)}\n` +
    `Total: ${formatarMoeda(o.total)}\n` +
    `Data: ${formatarData(o.tipo === 'saida' ? o.dataPagamento : o.dataRecebimento)}\n` +
    `Conta bancária: ${o.contaBancaria}\n` +
    `Forma: ${o.tipo === 'saida' ? o.formaPagamento : o.formaRecebimento}\n` +
    `Status: ${o.status}\n` +
    (o.observacoes ? `\nObservações: ${o.observacoes}` : '')
  );
}

// ============================================================
// EMPTY STATE
// ============================================================

function vazioValidacaoFinanceira(isSaida) {
  return `
    <div class="ordens-vazio">
      <div class="vazio-icon">${isSaida ? '💸' : '💰'}</div>
      <p>Nenhuma ${isSaida ? 'saída' : 'entrada'} pendente de validação.</p>
      <p style="font-size:12px; margin-top:6px;">
        Quando o ${isSaida ? 'Financeiro1' : 'Financeiro2'} gerar uma nova ${isSaida ? 'saída' : 'entrada'}, aparecerá aqui.
      </p>
    </div>
  `;
}