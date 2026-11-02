/* ============================================================
   HISTÓRICO
   Ordens concluídas e canceladas (consulta)
   ============================================================ */

screens['historico'] = () => {
  const ator = USUARIO_ORDENS.ator;
  const historico = ordens.filter(o =>
    (o.atorDestino === ator || o.atorOrigem === ator) &&
    (o.status === 'concluida' || o.status === 'cancelada')
  );

  const filtradas = filtrarHistorico(historico);

  return `
    <div class="ordens-header">
      <h1>Histórico</h1>
      <span class="badge badge-status-pendente">${ator}</span>
    </div>
    <p class="subtitle">Ordens concluídas e canceladas (suas ou endereçadas a você)</p>

    ${kpisHistorico(historico)}

    ${filtrosHistorico()}

    ${filtradas.length === 0
      ? vazioHistorico()
      : `<div class="ordens-lista">${filtradas.map(o => ordemCardHistorico(o)).join('')}</div>`}
  `;
};

function kpisHistorico(historico) {
  const concluidas = historico.filter(o => o.status === 'concluida').length;
  const canceladas = historico.filter(o => o.status === 'cancelada').length;
  return `
    <div class="ordens-kpis">
      <div class="kpi-card kpi-concluida">
        <span class="kpi-label">Concluídas</span>
        <span class="kpi-valor">${concluidas}</span>
      </div>
      <div class="kpi-card kpi-cancelada">
        <span class="kpi-label">Canceladas</span>
        <span class="kpi-valor">${canceladas}</span>
      </div>
      <div class="kpi-card">
        <span class="kpi-label">Total</span>
        <span class="kpi-valor">${historico.length}</span>
      </div>
    </div>
  `;
}

function filtrosHistorico() {
  return `
    <div class="ordens-filtros">
      <select onchange="setFiltroHistorico('status', this.value)">
        <option value="todos" ${filtroHistorico.status === 'todos' ? 'selected' : ''}>Todos os status</option>
        <option value="concluida" ${filtroHistorico.status === 'concluida' ? 'selected' : ''}>Concluídas</option>
        <option value="cancelada" ${filtroHistorico.status === 'cancelada' ? 'selected' : ''}>Canceladas</option>
      </select>
      <select onchange="setFiltroHistorico('periodo', this.value)">
        <option value="todos" ${filtroHistorico.periodo === 'todos' ? 'selected' : ''}>Todo o período</option>
        <option value="7dias" ${filtroHistorico.periodo === '7dias' ? 'selected' : ''}>Últimos 7 dias</option>
        <option value="30dias" ${filtroHistorico.periodo === '30dias' ? 'selected' : ''}>Últimos 30 dias</option>
        <option value="90dias" ${filtroHistorico.periodo === '90dias' ? 'selected' : ''}>Últimos 90 dias</option>
      </select>
      <input type="text" placeholder="Buscar documento..."
             value="${filtroHistorico.documento}"
             oninput="setFiltroHistorico('documento', this.value)">
    </div>
  `;
}

function setFiltroHistorico(campo, valor) {
  filtroHistorico[campo] = valor;
  document.getElementById('content').innerHTML = screens['historico']();
}

function filtrarHistorico(lista) {
  return lista.filter(o => {
    if (filtroHistorico.status !== 'todos' && o.status !== filtroHistorico.status) return false;
    if (filtroHistorico.documento) {
      const d = filtroHistorico.documento.toLowerCase();
      if (!o.documento.toLowerCase().includes(d) && !o.descricaoResumida.toLowerCase().includes(d)) return false;
    }
    if (filtroHistorico.periodo !== 'todos') {
      const dias = filtroHistorico.periodo === '7dias' ? 7 : filtroHistorico.periodo === '30dias' ? 30 : 90;
      const limite = new Date(Date.now() - dias * 24 * 60 * 60 * 1000);
      const data = new Date(o.dataConclusao || o.dataCriacao);
      if (data < limite) return false;
    }
    return true;
  }).sort((a, b) => new Date(b.dataConclusao || b.dataCriacao) - new Date(a.dataConclusao || a.dataCriacao));
}

function ordemCardHistorico(o) {
  const classes = [
    'ordem-card',
    o.status === 'concluida' ? 'status-concluida' : 'status-cancelada',
  ].join(' ');

  return `
    <div class="${classes}">
      <div class="ordem-icon">${iconeTipoOrdem(o.tipoOrdem)}</div>
      <div class="ordem-conteudo">
        <div class="ordem-titulo">
          <span class="ordem-tipo">${o.tipoOrdem}</span>
          ${o.tipoOrdemNome}
        </div>
        <div class="ordem-descricao">${o.descricaoResumida}</div>
        <div class="ordem-meta">
          <span class="meta-item">📄 ${o.documento}</span>
          <span class="meta-item">👤 ${o.atorOrigem} → ${o.atorDestino}</span>
          <span class="meta-item">🕐 ${formatarDataHora(o.dataConclusao || o.dataCriacao)}</span>
          ${badgeStatusOrdem(o.status)}
        </div>
      </div>
      <div class="ordem-acoes">
        <button class="btn-sm" onclick="verOrdem(${o.id})" title="Ver detalhes">Ver</button>
      </div>
    </div>
  `;
}

function vazioHistorico() {
  return `
    <div class="ordens-vazio">
      <div class="vazio-icon">🗂️</div>
      <p>Nenhuma ordem no histórico.</p>
    </div>
  `;
}