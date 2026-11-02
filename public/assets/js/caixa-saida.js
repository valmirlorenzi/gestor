/* ============================================================
   CAIXA DE SAÍDA
   Ordens emitidas pelo ator e ainda pendentes/em andamento
   ============================================================ */

screens['caixa-saida'] = () => {
  const ator = USUARIO_ORDENS.ator;
  const saidas = ordens.filter(o =>
    o.atorOrigem === ator &&
    (o.status === 'pendente' || o.status === 'em_andamento')
  );

  const filtradas = filtrarCaixaSaida(saidas);

  return `
    <div class="ordens-header">
      <h1>Caixa de Saída</h1>
      <span class="badge badge-status-pendente">${ator}</span>
    </div>
    <p class="subtitle">Ordens que você emitiu e ainda estão pendentes ou em andamento</p>

    ${kpisCaixaSaida(saidas)}

    ${filtrosCaixaSaida()}

    ${filtradas.length === 0
      ? vazioCaixaSaida()
      : `<div class="ordens-lista">${filtradas.map(o => ordemCardSaida(o)).join('')}</div>`}
  `;
};

function kpisCaixaSaida(saidas) {
  const pendentes = saidas.filter(o => o.status === 'pendente').length;
  const emAndamento = saidas.filter(o => o.status === 'em_andamento').length;
  const urgentes = saidas.filter(o => o.urgente).length;
  return `
    <div class="ordens-kpis">
      <div class="kpi-card kpi-pendente">
        <span class="kpi-label">Aguardando</span>
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
        <span class="kpi-valor">${saidas.length}</span>
      </div>
    </div>
  `;
}

function filtrosCaixaSaida() {
  return `
    <div class="ordens-filtros">
      <select onchange="setFiltroCaixaSaida('status', this.value)">
        <option value="todos" ${filtroCaixaSaida.status === 'todos' ? 'selected' : ''}>Todos os status</option>
        <option value="pendente" ${filtroCaixaSaida.status === 'pendente' ? 'selected' : ''}>Pendente</option>
        <option value="em_andamento" ${filtroCaixaSaida.status === 'em_andamento' ? 'selected' : ''}>Em andamento</option>
      </select>
      <input type="text" placeholder="Buscar documento..."
             value="${filtroCaixaSaida.documento}"
             oninput="setFiltroCaixaSaida('documento', this.value)">
    </div>
  `;
}

function setFiltroCaixaSaida(campo, valor) {
  filtroCaixaSaida[campo] = valor;
  document.getElementById('content').innerHTML = screens['caixa-saida']();
}

function filtrarCaixaSaida(lista) {
  return lista.filter(o => {
    if (filtroCaixaSaida.status !== 'todos' && o.status !== filtroCaixaSaida.status) return false;
    if (filtroCaixaSaida.documento) {
      const d = filtroCaixaSaida.documento.toLowerCase();
      if (!o.documento.toLowerCase().includes(d) && !o.descricaoResumida.toLowerCase().includes(d)) return false;
    }
    return true;
  }).sort((a, b) => new Date(b.dataCriacao) - new Date(a.dataCriacao));
}

function ordemCardSaida(o) {
  const classes = [
    'ordem-card',
    o.urgente ? 'urgente' : '',
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
          <span class="meta-item">👤 ${o.atorDestino}</span>
          <span class="meta-item">🕐 ${formatarDataHora(o.dataCriacao)}</span>
          ${badgeStatusOrdem(o.status)}
        </div>
      </div>
      <div class="ordem-acoes">
        <button class="btn-sm" onclick="verOrdem(${o.id})" title="Ver detalhes">Ver</button>
      </div>
    </div>
  `;
}

function verOrdem(id) {
  const o = ordens.find(x => x.id === id);
  if (!o) return;
  alert(
    `Ordem ${o.tipoOrdem} — ${o.tipoOrdemNome}\n\n` +
    `Documento: ${o.documento}\n` +
    `Origem: ${o.atorOrigem}\n` +
    `Destino: ${o.atorDestino}\n` +
    `Status: ${o.status}\n` +
    `Urgente: ${o.urgente ? 'sim' : 'não'}\n` +
    `Criada em: ${formatarDataHora(o.dataCriacao)}\n` +
    (o.dataConclusao ? `Concluída em: ${formatarDataHora(o.dataConclusao)}\n` : '') +
    `\nDescrição: ${o.descricaoResumida}`
  );
}

function vazioCaixaSaida() {
  return `
    <div class="ordens-vazio">
      <div class="vazio-icon">📤</div>
      <p>Nenhuma ordem emitida por você está pendente.</p>
      <p style="font-size:12px; margin-top:6px;">Quando você encaminhar algo para outro ator, aparecerá aqui até ser concluído.</p>
    </div>
  `;
}