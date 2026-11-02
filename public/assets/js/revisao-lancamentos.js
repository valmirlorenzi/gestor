/* ============================================================
   REVISÃO DE LANÇAMENTOS (D3)
   ============================================================ */

screens['revisao-lancamentos'] = () => {
  const filtrados = filtrarRevisao(lancamentosPendentes);

  return `
    <div class="contador-header">
      <h1>Revisão de Lançamentos</h1>
      <span class="badge badge-confianca-alta">${lancamentosPendentes.length} pendentes</span>
    </div>
    <p class="subtitle">Aceite, altere ou rejeite as sugestões do motor de classificação</p>

    ${kpisRevisao(lancamentosPendentes)}
    ${filtrosRevisao()}

    ${filtrados.length === 0
      ? '<div class="ordens-vazio"><div class="vazio-icon">✅</div><p>Nenhum lançamento pendente de revisão.</p></div>'
      : filtrados.map(l => lancamentoCardRevisao(l)).join('')}
  `;
};

function kpisRevisao(lista) {
  const altaConfianca = lista.filter(l => l.confianca === 'alta' && l.status !== 'Conflito').length;
  const conflito = lista.filter(l => l.status === 'Conflito').length;
  const naoClassificado = lista.filter(l => l.status === 'Nao classificado').length;
  return `
    <div class="contador-kpis">
      <div class="kpi-card kpi-ok">
        <span class="kpi-label">Alta confiança</span>
        <span class="kpi-valor">${altaConfianca}</span>
      </div>
      <div class="kpi-card kpi-aviso">
        <span class="kpi-label">Conflitos</span>
        <span class="kpi-valor">${conflito}</span>
      </div>
      <div class="kpi-card kpi-erro">
        <span class="kpi-label">Não classificados</span>
        <span class="kpi-valor">${naoClassificado}</span>
      </div>
      <div class="kpi-card kpi-info">
        <span class="kpi-label">Total</span>
        <span class="kpi-valor">${lista.length}</span>
      </div>
    </div>
  `;
}

function filtrosRevisao() {
  return `
    <div class="contador-filtros">
      <select onchange="setFiltroRevisao('status', this.value)">
        <option value="todos" ${filtroRevisao.status === 'todos' ? 'selected' : ''}>Todos os status</option>
        <option value="Classificado automaticamente" ${filtroRevisao.status === 'Classificado automaticamente' ? 'selected' : ''}>Classificado automaticamente</option>
        <option value="Conflito" ${filtroRevisao.status === 'Conflito' ? 'selected' : ''}>Conflito</option>
        <option value="Nao classificado" ${filtroRevisao.status === 'Nao classificado' ? 'selected' : ''}>Não classificado</option>
      </select>
      <select onchange="setFiltroRevisao('confianca', this.value)">
        <option value="todas" ${filtroRevisao.confianca === 'todas' ? 'selected' : ''}>Todas as confianças</option>
        <option value="alta" ${filtroRevisao.confianca === 'alta' ? 'selected' : ''}>Alta</option>
        <option value="media" ${filtroRevisao.confianca === 'media' ? 'selected' : ''}>Média</option>
        <option value="baixa" ${filtroRevisao.confianca === 'baixa' ? 'selected' : ''}>Baixa</option>
      </select>
      <input type="text" placeholder="Buscar documento/contraparte..."
             value="${filtroRevisao.busca}"
             oninput="setFiltroRevisao('busca', this.value)">
      <button class="btn btn-secondary" onclick="aceitarAltaConfianca()">✓ Aceitar todos de alta confiança</button>
    </div>
  `;
}

function setFiltroRevisao(campo, valor) {
  filtroRevisao[campo] = valor;
  document.getElementById('content').innerHTML = screens['revisao-lancamentos']();
}

function filtrarRevisao(lista) {
  return lista.filter(l => {
    if (filtroRevisao.status !== 'todos' && l.status !== filtroRevisao.status) return false;
    if (filtroRevisao.confianca !== 'todas' && l.confianca !== filtroRevisao.confianca) return false;
    if (filtroRevisao.busca) {
      const b = filtroRevisao.busca.toLowerCase();
      if (!l.documento.toLowerCase().includes(b) && !l.contraparte.toLowerCase().includes(b)) return false;
    }
    return true;
  });
}

function lancamentoCardRevisao(l) {
  const classe = l.status === 'Conflito' ? 'conflito' : l.status === 'Nao classificado' ? 'nao-classificado' : l.confianca === 'alta' ? 'alta-confianca' : '';
  const badgeConfianca = l.confianca === 'alta' ? 'badge-confianca-alta' : l.confianca === 'media' ? 'badge-confianca-media' : 'badge-confianca-baixa';

  return `
    <div class="lancamento-card ${classe}">
      <div class="lc-topo">
        <div class="lc-dados">
          <div class="lc-titulo">Lançamento #${l.id} · ${l.documento}</div>
          <div class="lc-meta">
            <span>📅 ${formatarData(l.data)}</span>
            <span>👤 ${l.contraparte}</span>
            <span class="badge ${badgeConfianca}">confiança ${l.confianca}</span>
            ${l.status === 'Conflito' ? '<span class="badge badge-confianca-media">⚠️ Conflito</span>' : ''}
            ${l.status === 'Nao classificado' ? '<span class="badge badge-confianca-baixa">❌ Não classificado</span>' : ''}
          </div>
        </div>
        <div class="lc-valor">${formatarMoeda(l.valor)}</div>
      </div>

      ${l.contaSugerida ? `
        <div class="lc-sugestao">
          <span class="lc-conta">${l.contaSugerida}</span>
          <span>${descricaoConta(l.contaSugerida)}</span>
          <span class="muted">·</span>
          <span>CC: ${l.centroCustoSugerido || '—'}</span>
          <span class="muted">·</span>
          <span>Contrapartida: ${l.contrapartidaSugerida || '—'}</span>
          <button class="btn-sm" onclick="verPorque(${l.id})">Por que?</button>
        </div>
        <div class="lc-justificativa">${l.justificativa}</div>
      ` : `
        <div class="lc-sugestao" style="background:rgba(255,107,107,0.1);">
          <span>❌ Sem sugestão de classificação. Classifique manualmente.</span>
        </div>
      `}

      <div class="lc-acoes">
        ${l.contaSugerida ? `
          <button class="btn btn-primary" onclick="aceitarLancamento(${l.id})">✓ Aceitar</button>
          <button class="btn btn-secondary" onclick="alterarLancamento(${l.id})">✎ Alterar</button>
          <button class="btn btn-secondary" onclick="rejeitarLancamento(${l.id})">✗ Rejeitar</button>
        ` : `
          <button class="btn btn-primary" onclick="alterarLancamento(${l.id})">Classificar manualmente</button>
        `}
      </div>
    </div>
  `;
}

function descricaoConta(codigo) {
  const conta = PLANO_CONTAS.find(c => c.codigo === codigo);
  return conta ? conta.descricao : codigo;
}

function verPorque(id) {
  const l = lancamentosPendentes.find(x => x.id === id);
  if (!l) return;
  alert(
    `Conta sugerida: ${l.contaSugerida} (${descricaoConta(l.contaSugerida)})\n\n` +
    `Regra aplicada: ${l.justificativa}\n\n` +
    `Contexto: ${JSON.stringify(l.contexto, null, 2)}\n\n` +
    `Confiança: ${l.confianca}`
  );
}

function aceitarLancamento(id) {
  const l = lancamentosPendentes.find(x => x.id === id);
  if (!l) return;
  l.status = 'Classificado automaticamente';
  removerPendente(id);
  showScreen('revisao-lancamentos');
}

function alterarLancamento(id) {
  const l = lancamentosPendentes.find(x => x.id === id);
  if (!l) return;
  const novaConta = prompt(`Nova conta para o lançamento #${id} (atual: ${l.contaSugerida || '—'}):`);
  if (!novaConta) return;
  l.contaSugerida = novaConta;
  l.status = 'Classificado manualmente';
  l.justificativa = `Classificado manualmente pelo operador (era: ${l.justificativa})`;
  removerPendente(id);
  if (confirm('Deseja criar uma regra para futuros lançamentos com este mesmo contexto?')) {
    alert('Regra criada (simulação).');
  }
  showScreen('revisao-lancamentos');
}

function rejeitarLancamento(id) {
  const l = lancamentosPendentes.find(x => x.id === id);
  if (!l) return;
  l.status = 'Nao classificado';
  l.contaSugerida = null;
  showScreen('revisao-lancamentos');
}

function aceitarAltaConfianca() {
  const alta = lancamentosPendentes.filter(l => l.confianca === 'alta' && l.status !== 'Conflito');
  if (alta.length === 0) { alert('Nenhum lançamento de alta confiança pendente.'); return; }
  if (!confirm(`Aceitar ${alta.length} lançamento(s) de alta confiança?`)) return;
  alta.forEach(l => removerPendente(l.id));
  showScreen('revisao-lancamentos');
}

function removerPendente(id) {
  const idx = lancamentosPendentes.findIndex(x => x.id === id);
  if (idx >= 0) lancamentosPendentes.splice(idx, 1);
}