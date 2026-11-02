/* ============================================================
   CAIXA DE ENTRADA
   Ordens pendentes e em andamento do ator logado
   ============================================================ */

screens['caixa-entrada'] = () => {
  const ator = USUARIO_ORDENS.ator;
  const entradas = ordens.filter(o =>
    o.atorDestino === ator &&
    (o.status === 'pendente' || o.status === 'em_andamento')
  );

  const filtradas = filtrarCaixaEntrada(entradas);

  return `
    <div class="ordens-header">
      <h1>Caixa de Entrada</h1>
      <span class="badge badge-status-pendente">${ator}</span>
    </div>
    <p class="subtitle">Ordens pendentes e em andamento atribuídas a você</p>

    ${kpisCaixaEntrada(entradas)}

    ${filtrosCaixaEntrada()}

    ${filtradas.length === 0
      ? vazioCaixaEntrada()
      : `<div class="ordens-lista">${filtradas.map(o => ordemCardEntrada(o)).join('')}</div>`}
  `;
};

// ============================================================
// KPIs
// ============================================================

function kpisCaixaEntrada(entradas) {
  const pendentes = entradas.filter(o => o.status === 'pendente').length;
  const emAndamento = entradas.filter(o => o.status === 'em_andamento').length;
  const urgentes = entradas.filter(o => o.urgente).length;
  return `
    <div class="ordens-kpis">
      <div class="kpi-card kpi-pendente">
        <span class="kpi-label">Pendentes</span>
        <span class="kpi-valor">${pendentes}</span>
      </div>
      <div class="kpi-card kpi-andamento">
        <span class="kpi-label">Em andamento</span>
        <span class="kpi-valor">${emAndamento}</span>
      </div>
      <div class="kpi-card kpi-urgente">
        <span class="kpi-label">Urgentes</span>
        <span class="kpi-valor">${urgentes}</span>
      </div>
      <div class="kpi-card">
        <span class="kpi-label">Total</span>
        <span class="kpi-valor">${entradas.length}</span>
      </div>
    </div>
  `;
}

// ============================================================
// FILTROS
// ============================================================

function filtrosCaixaEntrada() {
  const tipos = [...new Set(ordens.filter(o => o.atorDestino === USUARIO_ORDENS.ator).map(o => o.tipoOrdem))].sort();
  return `
    <div class="ordens-filtros">
      <select onchange="setFiltroCaixaEntrada('tipo', this.value)">
        <option value="todos" ${filtroCaixaEntrada.tipo === 'todos' ? 'selected' : ''}>Todos os tipos</option>
        ${tipos.map(t => {
          const o = ordens.find(x => x.tipoOrdem === t);
          return `<option value="${t}" ${filtroCaixaEntrada.tipo === t ? 'selected' : ''}>${t} — ${o ? o.tipoOrdemNome : ''}</option>`;
        }).join('')}
      </select>
      <select onchange="setFiltroCaixaEntrada('urgente', this.value)">
        <option value="todos" ${filtroCaixaEntrada.urgente === 'todos' ? 'selected' : ''}>Todos</option>
        <option value="urgentes" ${filtroCaixaEntrada.urgente === 'urgentes' ? 'selected' : ''}>Só urgentes</option>
        <option value="normais" ${filtroCaixaEntrada.urgente === 'normais' ? 'selected' : ''}>Só normais</option>
      </select>
      <input type="text" placeholder="Buscar documento..."
             value="${filtroCaixaEntrada.documento}"
             oninput="setFiltroCaixaEntrada('documento', this.value)">
    </div>
  `;
}

function setFiltroCaixaEntrada(campo, valor) {
  filtroCaixaEntrada[campo] = valor;
  document.getElementById('content').innerHTML = screens['caixa-entrada']();
}

function filtrarCaixaEntrada(lista) {
  return lista.filter(o => {
    if (filtroCaixaEntrada.tipo !== 'todos' && o.tipoOrdem !== filtroCaixaEntrada.tipo) return false;
    if (filtroCaixaEntrada.urgente === 'urgentes' && !o.urgente) return false;
    if (filtroCaixaEntrada.urgente === 'normais' && o.urgente) return false;
    if (filtroCaixaEntrada.documento) {
      const d = filtroCaixaEntrada.documento.toLowerCase();
      if (!o.documento.toLowerCase().includes(d) && !o.descricaoResumida.toLowerCase().includes(d)) return false;
    }
    return true;
  }).sort((a, b) => {
    // Urgentes primeiro, depois por prioridade, depois por data (mais antigas primeiro)
    if (a.urgente !== b.urgente) return a.urgente ? -1 : 1;
    if (a.prioridade !== b.prioridade) return a.prioridade - b.prioridade;
    return new Date(a.dataCriacao) - new Date(b.dataCriacao);
  });
}

// ============================================================
// CARD DE ORDEM
// ============================================================

function ordemCardEntrada(o) {
  const classes = [
    'ordem-card',
    o.urgente ? 'urgente' : '',
    o.status === 'em_andamento' ? 'status-andamento' : '',
  ].filter(Boolean).join(' ');

  return `
    <div class="${classes}">
      <div class="ordem-icon">${iconeTipoOrdem(o.tipoOrdem)}</div>
      <div class="ordem-conteudo">
        <div class="ordem-titulo">
          <span class="ordem-tipo">${o.tipoOrdem}</span>
          ${o.tipoOrdemNome}
          ${o.urgente ? '<span class="badge-urgente">urgente</span>' : ''}
        </div>
        <div class="ordem-descricao">${o.descricaoResumida}</div>
        <div class="ordem-meta">
          <span class="meta-item">📄 ${o.documento}</span>
          <span class="meta-item">👤 ${o.atorOrigem}</span>
          <span class="meta-item">🕐 ${formatarDataHora(o.dataCriacao)}</span>
          ${badgeStatusOrdem(o.status)}
        </div>
      </div>
      <div class="ordem-acoes">
        ${o.status === 'pendente'
          ? `<button class="btn-sm" onclick="iniciarOrdem(${o.id})">Iniciar</button>`
          : `<button class="btn-sm btn-primary" onclick="concluirOrdem(${o.id})">Concluir</button>`}
        <button class="btn-sm" onclick="marcarUrgente(${o.id})" title="Marcar urgente">${o.urgente ? '★' : '☆'}</button>
        <button class="btn-sm" onclick="cancelarOrdem(${o.id})" title="Cancelar">×</button>
      </div>
    </div>
  `;
}

function iconeTipoOrdem(tipo) {
  const mapa = {
    O1: '📥', O2: '📤', O3: '📥', O4: '📤', O5: '📄', O6: '💼',
    O7: '🔍', O8: '⚖️', O9: '⚠️',
    O10: '✅', O11: '✅', O12: '✅', O13: '✅', O14: '✅',
    O15: '📄', O16: '📄', O17: '💸', O18: '💰', O19: '🔒', O20: '🔓', O21: '💼',
    O22: '📦', O23: '🔍', O24: '🔒',
    O25: '🚩', O26: '✉️', O27: '🔄', O28: '⚙️',
    O29: '🤖', O30: '🤖', O31: '🤖', O32: '🤖',
  };
  return mapa[tipo] || '📋';
}

function badgeStatusOrdem(status) {
  switch (status) {
    case 'pendente': return '<span class="badge badge-status-pendente">pendente</span>';
    case 'em_andamento': return '<span class="badge badge-status-andamento">em andamento</span>';
    case 'concluida': return '<span class="badge badge-status-concluida">concluída</span>';
    case 'cancelada': return '<span class="badge badge-status-cancelada">cancelada</span>';
    default: return '';
  }
}

// ============================================================
// AÇÕES
// ============================================================

function iniciarOrdem(id) {
  const o = ordens.find(x => x.id === id);
  if (!o) return;
  o.status = 'em_andamento';
  showScreen('caixa-entrada');
}

function concluirOrdem(id) {
  const o = ordens.find(x => x.id === id);
  if (!o) return;
  if (!confirm(`Concluir a ordem ${o.tipoOrdem} — ${o.tipoOrdemNome}?`)) return;
  o.status = 'concluida';
  o.dataConclusao = new Date().toISOString();
  showScreen('caixa-entrada');
}

function marcarUrgente(id) {
  const o = ordens.find(x => x.id === id);
  if (!o) return;
  o.urgente = !o.urgente;
  showScreen('caixa-entrada');
}

function cancelarOrdem(id) {
  const o = ordens.find(x => x.id === id);
  if (!o) return;
  const motivo = prompt('Motivo do cancelamento:');
  if (!motivo) return;
  o.status = 'cancelada';
  o.dataConclusao = new Date().toISOString();
  o.descricaoResumida += ` (cancelada: ${motivo})`;
  showScreen('caixa-entrada');
}

// ============================================================
// EMPTY STATE
// ============================================================

function vazioCaixaEntrada() {
  return `
    <div class="ordens-vazio">
      <div class="vazio-icon">📭</div>
      <p>Nenhuma ordem pendente ou em andamento.</p>
      <p style="font-size:12px; margin-top:6px;">Quando houver algo para você fazer, aparecerá aqui.</p>
    </div>
  `;
}

// Helper de data/hora
function formatarDataHora(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}