/* ============================================================
   APONTAR PROBLEMAS (11.6) e SOLICITAR CORREÇÕES (11.7)
   ============================================================ */

screens['apontar'] = () => renderApontarSolicitar('apontar');
screens['solicitar'] = () => renderApontarSolicitar('solicitar');

function renderApontarSolicitar(tipo) {
  const isApontar = tipo === 'apontar';
  const titulo = isApontar ? 'Apontar Problemas' : 'Solicitar Correções';
  const subtitulo = isApontar
    ? 'O Auditor aponta o problema ao ator competente (O25)'
    : 'O Auditor solicita a correção ao ator competente (O26)';
  const lista = isApontar ? apontamentosAuditor : solicitacoesCorrecao;
  const filtro = isApontar ? filtroApontamentos : filtroSolicitacoes;
  const filtrados = filtrarApontamentosSolicitacoes(lista, filtro);

  return `
    <div class="contador-header">
      <h1>${titulo}</h1>
      <button class="btn btn-primary" onclick="novoApontamentoSolicitacao('${tipo}')">
        + ${isApontar ? 'Apontar problema' : 'Solicitar correção'}
      </button>
    </div>
    <p class="subtitle">${subtitulo}</p>

    ${kpisApontamentosSolicitacoes(lista)}
    ${filtrosApontamentosSolicitacoes(tipo)}

    ${filtrados.length === 0
      ? '<div class="ordens-vazio"><div class="vazio-icon">✅</div><p>Nenhum registro.</p></div>'
      : filtrados.map(r => cardApontamentoSolicitacao(r, isApontar)).join('')}
  `;
}

function kpisApontamentosSolicitacoes(lista) {
  const pendentes = lista.filter(r => r.status === 'pendente').length;
  const resolvidas = lista.filter(r => r.status === 'resolvida').length;
  return `
    <div class="contador-kpis">
      <div class="kpi-card kpi-aviso">
        <span class="kpi-label">Pendentes</span>
        <span class="kpi-valor">${pendentes}</span>
      </div>
      <div class="kpi-card kpi-ok">
        <span class="kpi-label">Resolvidas</span>
        <span class="kpi-valor">${resolvidas}</span>
      </div>
      <div class="kpi-card">
        <span class="kpi-label">Total</span>
        <span class="kpi-valor">${lista.length}</span>
      </div>
    </div>
  `;
}

function filtrosApontamentosSolicitacoes(tipo) {
  const filtro = tipo === 'apontar' ? filtroApontamentos : filtroSolicitacoes;
  return `
    <div class="contador-filtros">
      <select onchange="setFiltroApontamentosSolicitacoes('${tipo}', 'status', this.value)">
        <option value="todos" ${filtro.status === 'todos' ? 'selected' : ''}>Todos os status</option>
        <option value="pendente" ${filtro.status === 'pendente' ? 'selected' : ''}>Pendentes</option>
        <option value="resolvida" ${filtro.status === 'resolvida' ? 'selected' : ''}>Resolvidas</option>
      </select>
      <select onchange="setFiltroApontamentosSolicitacoes('${tipo}', 'ator', this.value)">
        <option value="todos" ${filtro.ator === 'todos' ? 'selected' : ''}>Todos os atores</option>
        ${['contador','comprador','faturista','financeiro1','financeiro2','rh'].map(a => `<option value="${a}" ${filtro.ator === a ? 'selected' : ''}>${a}</option>`).join('')}
      </select>
      <input type="text" placeholder="Buscar descrição/referência..."
             value="${filtro.busca}"
             oninput="setFiltroApontamentosSolicitacoes('${tipo}', 'busca', this.value)">
    </div>
  `;
}

function setFiltroApontamentosSolicitacoes(tipo, campo, valor) {
  if (tipo === 'apontar') filtroApontamentos[campo] = valor;
  else filtroSolicitacoes[campo] = valor;
  const rota = tipo === 'apontar' ? 'apontar' : 'solicitar';
  document.getElementById('content').innerHTML = screens[rota]();
}

function filtrarApontamentosSolicitacoes(lista, filtro) {
  return lista.filter(r => {
    if (filtro.status !== 'todos' && r.status !== filtro.status) return false;
    if (filtro.ator !== 'todos' && r.atorCompetente !== filtro.ator) return false;
    if (filtro.busca) {
      const b = filtro.busca.toLowerCase();
      if (!r.descricao.toLowerCase().includes(b) && !r.referencia.toLowerCase().includes(b)) return false;
    }
    return true;
  }).sort((a, b) => {
    if (a.status !== b.status) return a.status === 'pendente' ? -1 : 1;
    return new Date(b.data) - new Date(a.data);
  });
}

function cardApontamentoSolicitacao(r, isApontar) {
  const classe = r.status === 'resolvida' ? 'status-concluida' : '';
  const badgeStatus = r.status === 'pendente'
    ? '<span class="badge badge-status-pendente">pendente</span>'
    : '<span class="badge badge-status-concluida">✓ resolvida</span>';

  return `
    <div class="lancamento-card ${classe}">
      <div class="lc-topo">
        <div class="lc-dados">
          <div class="lc-titulo">
            ${isApontar ? '🚩' : '✉️'} ${isApontar ? r.tipoProblema : r.tipoCorrecao}
            <span class="badge badge-info" style="margin-left:8px;">${isApontar ? 'O25' : 'O26'}</span>
          </div>
          <div class="lc-meta">
            <span>📄 ${r.referencia}</span>
            <span>👤 → ${r.atorCompetente}</span>
            <span>📅 ${formatarData(r.data)}</span>
            <span>⏰ prazo: ${formatarData(r.prazo)}</span>
            ${badgeStatus}
          </div>
        </div>
      </div>

      <div class="lc-justificativa">${r.descricao}</div>

      ${r.status === 'pendente' ? `
        <div class="lc-acoes">
          <button class="btn btn-primary" onclick="marcarResolvida('${isApontar ? 'apontar' : 'solicitar'}', ${r.id})">
            ✓ Marcar como resolvida
          </button>
        </div>
      ` : ''}
    </div>
  `;
}

function marcarResolvida(tipo, id) {
  const lista = tipo === 'apontar' ? apontamentosAuditor : solicitacoesCorrecao;
  const r = lista.find(x => x.id === id);
  if (!r) return;
  if (!confirm(`Marcar "${r.descricao}" como resolvida?`)) return;
  r.status = 'resolvida';
  const rota = tipo === 'apontar' ? 'apontar' : 'solicitar';
  document.getElementById('content').innerHTML = screens[rota]();
}

function novoApontamentoSolicitacao(tipo) {
  const isApontar = tipo === 'apontar';
  const descricao = prompt(isApontar ? 'Descrição do problema:' : 'Descrição da correção:');
  if (!descricao) return;
  const referencia = prompt('Referência (ex: Lançamento #102):');
  if (!referencia) return;
  const atorCompetente = prompt('Ator competente (contador/comprador/faturista/financeiro1/financeiro2/rh):', 'contador');
  if (!atorCompetente) return;
  const prazo = prompt('Prazo (AAAA-MM-DD):', '2026-10-30');
  if (!prazo) return;
  const lista = isApontar ? apontamentosAuditor : solicitacoesCorrecao;
  const novoId = Math.max(0, ...lista.map(x => x.id)) + 1;
  const novo = {
    id: novoId,
    data: new Date().toISOString(),
    descricao,
    referencia,
    atorCompetente,
    status: 'pendente',
    prazo,
  };
  if (isApontar) novo.tipoProblema = 'Classificação incorreta';
  else novo.tipoCorrecao = 'Reclassificação';
  lista.push(novo);
  alert(`${isApontar ? 'Apontamento' : 'Solicitação'} criada(o).`);
  const rota = isApontar ? 'apontar' : 'solicitar';
  document.getElementById('content').innerHTML = screens[rota]();
}