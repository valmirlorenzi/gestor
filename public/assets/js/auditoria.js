/* ============================================================
   AUDITORIA — 11.1 log, 11.2 documentos, 11.3 lançamentos, 11.4 handoff
   Tela única com abas.
   ============================================================ */

screens['auditoria'] = () => renderAuditoria('log');
screens['auditoria-documentos'] = () => renderAuditoria('documentos');
screens['auditoria-lancamentos'] = () => renderAuditoria('lancamentos');
screens['handoff-transicoes'] = () => renderAuditoria('handoff');

function renderAuditoria(aba) {
  abaAuditoria = aba;

  const tabs = [
    { id: 'log',         label: '📜 Auditoria (log)' },
    { id: 'documentos',  label: '📄 Documentos' },
    { id: 'lancamentos', label: '📝 Lançamentos' },
    { id: 'handoff',     label: '🔄 Handoff (transições)' },
  ];

  return `
    <div class="contador-header">
      <h1>Auditoria</h1>
      <span class="badge badge-info">somente leitura</span>
    </div>
    <p class="subtitle">Consulte o histórico de ações do sistema. O Auditor não altera nada.</p>

    <div class="auditor-tabs">
      ${tabs.map(t => `
        <button class="tab ${abaAuditoria === t.id ? 'active' : ''}"
                onclick="setAbaAuditoria('${t.id}')">
          ${t.label}
        </button>
      `).join('')}
    </div>

    <div class="tab-conteudo">
      ${aba === 'log'         ? abaAuditoriaLog() : ''}
      ${aba === 'documentos'  ? abaAuditoriaDocumentos() : ''}
      ${aba === 'lancamentos' ? abaAuditoriaLancamentos() : ''}
      ${aba === 'handoff'     ? abaHandoff() : ''}
    </div>
  `;
}

function setAbaAuditoria(aba) {
  const rotas = {
    log: 'auditoria',
    documentos: 'auditoria-documentos',
    lancamentos: 'auditoria-lancamentos',
    handoff: 'handoff-transicoes',
  };
  document.getElementById('content').innerHTML = screens[rotas[aba]]();
}

// ============================================================
// 11.1 — LOG GERAL
// ============================================================

function abaAuditoriaLog() {
  const filtrados = filtrarEventos(eventosAuditoria, filtroAuditoria);

  return `
    ${kpisEventos(eventosAuditoria)}
    ${filtrosEventos('log')}

    <div class="card">
      ${filtrados.length === 0
        ? vazioEventos()
        : filtrados.map(e => eventoCard(e)).join('')}
    </div>
  `;
}

// ============================================================
// 11.2 — DOCUMENTOS
// ============================================================

function abaAuditoriaDocumentos() {
  const filtrados = filtrarEventos(eventosDocumentos, filtroAuditoriaDocumentos);

  return `
    ${kpisEventos(eventosDocumentos)}
    ${filtrosEventos('documentos')}

    <div class="card">
      ${filtrados.length === 0
        ? vazioEventos()
        : filtrados.map(e => eventoCard(e)).join('')}
    </div>
  `;
}

// ============================================================
// 11.3 — LANÇAMENTOS
// ============================================================

function abaAuditoriaLancamentos() {
  const filtrados = filtrarEventos(eventosLancamentos, filtroAuditoriaLancamentos);

  return `
    ${kpisEventos(eventosLancamentos)}
    ${filtrosEventos('lancamentos')}

    <div class="card">
      ${filtrados.length === 0
        ? vazioEventos()
        : filtrados.map(e => eventoCard(e)).join('')}
    </div>
  `;
}

// ============================================================
// 11.4 — HANDOFF
// ============================================================

function abaHandoff() {
  const filtradas = filtrarTransicoes(transicoesHandoff);

  return `
    ${kpisHandoff(transicoesHandoff)}
    ${filtrosHandoff()}

    <div class="card">
      ${filtradas.length === 0
        ? vazioEventos()
        : filtradas.map(t => transicaoCard(t)).join('')}
    </div>
  `;
}

// ============================================================
// KPIs
// ============================================================

function kpisEventos(lista) {
  const criacoes = lista.filter(e => e.acao === 'Criação').length;
  const edicoes = lista.filter(e => e.acao === 'Edição').length;
  const overrides = lista.filter(e => e.acao === 'Override').length;
  const outros = lista.length - criacoes - edicoes - overrides;
  return `
    <div class="contador-kpis">
      <div class="kpi-card kpi-ok">
        <span class="kpi-label">Criações</span>
        <span class="kpi-valor">${criacoes}</span>
      </div>
      <div class="kpi-card kpi-info">
        <span class="kpi-label">Edições</span>
        <span class="kpi-valor">${edicoes}</span>
      </div>
      <div class="kpi-card kpi-aviso">
        <span class="kpi-label">Overrides</span>
        <span class="kpi-valor">${overrides}</span>
      </div>
      <div class="kpi-card">
        <span class="kpi-label">Outros</span>
        <span class="kpi-valor">${outros}</span>
      </div>
    </div>
  `;
}

function kpisHandoff(lista) {
  const total = lista.length;
  const paraContador = lista.filter(t => t.para === 'contador').length;
  const paraFinanceiro = lista.filter(t => t.para.startsWith('financeiro')).length;
  return `
    <div class="contador-kpis">
      <div class="kpi-card kpi-info">
        <span class="kpi-label">Total de transições</span>
        <span class="kpi-valor">${total}</span>
      </div>
      <div class="kpi-card">
        <span class="kpi-label">→ Contador</span>
        <span class="kpi-valor">${paraContador}</span>
      </div>
      <div class="kpi-card">
        <span class="kpi-label">→ Financeiro</span>
        <span class="kpi-valor">${paraFinanceiro}</span>
      </div>
    </div>
  `;
}

// ============================================================
// FILTROS
// ============================================================

function filtrosEventos(aba) {
  const filtro = aba === 'log' ? filtroAuditoria
    : aba === 'documentos' ? filtroAuditoriaDocumentos
    : filtroAuditoriaLancamentos;

  return `
    <div class="contador-filtros">
      <select onchange="setFiltroEventos('${aba}', 'usuario', this.value)">
        <option value="todos" ${filtro.usuario === 'todos' ? 'selected' : ''}>Todos os usuários</option>
        ${[...new Set(eventosAuditoria.map(e => e.usuario))].map(u => `<option value="${u}" ${filtro.usuario === u ? 'selected' : ''}>${u}</option>`).join('')}
      </select>
      <select onchange="setFiltroEventos('${aba}', 'acao', this.value)">
        <option value="todas" ${filtro.acao === 'todas' ? 'selected' : ''}>Todas as ações</option>
        ${[...new Set(eventosAuditoria.map(e => e.acao))].map(a => `<option value="${a}" ${filtro.acao === a ? 'selected' : ''}>${a}</option>`).join('')}
      </select>
      <select onchange="setFiltroEventos('${aba}', 'periodo', this.value)">
        <option value="todos" ${filtro.periodo === 'todos' ? 'selected' : ''}>Todo o período</option>
        <option value="hoje" ${filtro.periodo === 'hoje' ? 'selected' : ''}>Hoje</option>
        <option value="7dias" ${filtro.periodo === '7dias' ? 'selected' : ''}>Últimos 7 dias</option>
        <option value="30dias" ${filtro.periodo === '30dias' ? 'selected' : ''}>Últimos 30 dias</option>
      </select>
      <input type="text" placeholder="Buscar registro/justificativa..."
             value="${filtro.busca}"
             oninput="setFiltroEventos('${aba}', 'busca', this.value)">
    </div>
  `;
}

function setFiltroEventos(aba, campo, valor) {
  if (aba === 'log') filtroAuditoria[campo] = valor;
  else if (aba === 'documentos') filtroAuditoriaDocumentos[campo] = valor;
  else filtroAuditoriaLancamentos[campo] = valor;
  const rotas = { log: 'auditoria', documentos: 'auditoria-documentos', lancamentos: 'auditoria-lancamentos' };
  document.getElementById('content').innerHTML = screens[rotas[aba]]();
}

function filtrarEventos(lista, filtro) {
  const hoje = new Date('2026-10-24');
  return lista.filter(e => {
    if (filtro.usuario !== 'todos' && e.usuario !== filtro.usuario) return false;
    if (filtro.acao !== 'todas' && e.acao !== filtro.acao) return false;
    if (filtro.periodo !== 'todos') {
      const data = new Date(e.data);
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
      if (!e.registro.toLowerCase().includes(b) && !(e.justificativa || '').toLowerCase().includes(b)) return false;
    }
    return true;
  }).sort((a, b) => new Date(b.data) - new Date(a.data));
}

function filtrosHandoff() {
  return `
    <div class="contador-filtros">
      <select onchange="setFiltroHandoff('ordem', this.value)">
        <option value="todas" ${filtroHandoff.ordem === 'todas' ? 'selected' : ''}>Todas as ordens</option>
        ${[...new Set(transicoesHandoff.map(t => t.ordem))].map(o => `<option value="${o}" ${filtroHandoff.ordem === o ? 'selected' : ''}>${o}</option>`).join('')}
      </select>
      <select onchange="setFiltroHandoff('periodo', this.value)">
        <option value="todos" ${filtroHandoff.periodo === 'todos' ? 'selected' : ''}>Todo o período</option>
        <option value="hoje" ${filtroHandoff.periodo === 'hoje' ? 'selected' : ''}>Hoje</option>
        <option value="7dias" ${filtroHandoff.periodo === '7dias' ? 'selected' : ''}>Últimos 7 dias</option>
      </select>
      <input type="text" placeholder="Buscar documento/ator..."
             value="${filtroHandoff.busca}"
             oninput="setFiltroHandoff('busca', this.value)">
    </div>
  `;
}

function setFiltroHandoff(campo, valor) {
  filtroHandoff[campo] = valor;
  document.getElementById('content').innerHTML = screens['handoff-transicoes']();
}

function filtrarTransicoes(lista) {
  const hoje = new Date('2026-10-24');
  return lista.filter(t => {
    if (filtroHandoff.ordem !== 'todas' && t.ordem !== filtroHandoff.ordem) return false;
    if (filtroHandoff.periodo !== 'todos') {
      const data = new Date(t.data);
      if (filtroHandoff.periodo === 'hoje') {
        if (data.toDateString() !== hoje.toDateString()) return false;
      } else {
        const limite = new Date(hoje.getTime() - 7 * 24 * 60 * 60 * 1000);
        if (data < limite) return false;
      }
    }
    if (filtroHandoff.busca) {
      const b = filtroHandoff.busca.toLowerCase();
      if (!t.documento.toLowerCase().includes(b) && !t.de.includes(b) && !t.para.includes(b)) return false;
    }
    return true;
  }).sort((a, b) => new Date(b.data) - new Date(a.data));
}

// ============================================================
// CARDS
// ============================================================

function eventoCard(e) {
  const classeAcao = 'acao-' + e.acao.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const diff = e.dadosAnteriores && e.dadosNovos
    ? `<div class="ev-diff">
        <span class="antes">${JSON.stringify(e.dadosAnteriores)}</span>
        → <span class="depois">${JSON.stringify(e.dadosNovos)}</span>
      </div>`
    : '';

  return `
    <div class="evento-auditoria ${classeAcao}">
      <div>
        <div class="ev-data">${formatarDataHora(e.data)}</div>
        <div class="ev-usuario">${e.usuario}</div>
      </div>
      <div class="ev-acao">${e.acao}</div>
      <div class="ev-detalhes">
        <strong>${e.registro}</strong>
        <br><small>tabela: ${e.tabela}</small>
        ${diff}
      </div>
      <div class="ev-detalhes">
        ${e.justificativa ? `<em>"${e.justificativa}"</em>` : '<span class="muted">—</span>'}
        <br><small>IP: ${e.ip}</small>
      </div>
    </div>
  `;
}

function transicaoCard(t) {
  return `
    <div class="transicao-handoff">
      <span class="th-ordem">${t.ordem}</span>
      <span class="th-ator">${t.de}</span>
      <span class="th-arrow">→</span>
      <span class="th-ator">${t.para}</span>
      <span class="th-estado">${t.estadoAnterior} → ${t.estadoNovo}</span>
      <span class="muted">·</span>
      <span>📄 ${t.documento}</span>
      <span class="th-data">${formatarDataHora(t.data)}</span>
    </div>
  `;
}

function vazioEventos() {
  return '<div class="ordens-vazio"><div class="vazio-icon">📜</div><p>Nenhum evento encontrado.</p></div>';
}