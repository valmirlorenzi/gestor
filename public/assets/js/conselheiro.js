/* ============================================================
   CONSELHEIRO (3.18)
   Sugestões de melhoria com base nos dados do sistema
   ============================================================ */

screens['conselheiro'] = () => {
  const lista = filtrarSugestoes(sugestoesConselheiro);
  const altas = lista.filter(s => s.prioridade === 'Alta' && !s.lida);
  const medias = lista.filter(s => s.prioridade === 'Média' && !s.lida);
  const baixas = lista.filter(s => s.prioridade === 'Baixa' && !s.lida);
  const lidas = lista.filter(s => s.lida);

  return `
    <div class="conselheiro-header">
      <div>
        <h1>💡 Conselheiro</h1>
        <p class="subtitle">Sugestões de melhoria com base nos dados do sistema</p>
      </div>
      <button class="btn btn-secondary" onclick="analisarNovamenteConselheiro()">
        🔄 Analisar novamente
      </button>
    </div>

    ${filtrosConselheiro()}
    ${kpisConselheiro(altas, medias, baixas, lidas)}

    ${altas.length > 0 ? `
      <div class="conselheiro-secao">
        <div class="conselheiro-secao-titulo">
          <span class="conselheiro-prio-badge alta">🔴 ALTA PRIORIDADE</span>
          <span class="muted">(${altas.length})</span>
        </div>
        ${altas.map(s => cardSugestao(s)).join('')}
      </div>
    ` : ''}

    ${medias.length > 0 ? `
      <div class="conselheiro-secao">
        <div class="conselheiro-secao-titulo">
          <span class="conselheiro-prio-badge media">🟡 MÉDIA PRIORIDADE</span>
          <span class="muted">(${medias.length})</span>
        </div>
        ${medias.map(s => cardSugestao(s)).join('')}
      </div>
    ` : ''}

    ${baixas.length > 0 ? `
      <div class="conselheiro-secao">
        <div class="conselheiro-secao-titulo">
          <span class="conselheiro-prio-badge baixa">🟢 BAIXA PRIORIDADE</span>
          <span class="muted">(${baixas.length})</span>
        </div>
        ${baixas.map(s => cardSugestao(s)).join('')}
      </div>
    ` : ''}

    ${lidas.length > 0 && filtroConselheiro.mostrarLidas ? `
      <div class="conselheiro-secao">
        <div class="conselheiro-secao-titulo">
          <span class="conselheiro-prio-badge">📋 SUGESTÕES LIDAS</span>
          <span class="muted">(${lidas.length})</span>
        </div>
        ${lidas.map(s => cardSugestao(s)).join('')}
      </div>
    ` : ''}

    ${altas.length + medias.length + baixas.length === 0 ? `
      <div class="ordens-vazio">
        <div class="vazio-icon">✅</div>
        <p>Nenhuma sugestão no momento.</p>
        <p style="font-size:12px; margin-top:6px;">
          O Conselheiro não encontrou anomalias, tendências ou oportunidades nos dados do período. Continue monitorando.
        </p>
      </div>
    ` : ''}
  `;
};

// ============================================================
// KPIs
// ============================================================

function kpisConselheiro(altas, medias, baixas, lidas) {
  return `
    <div class="contador-kpis">
      <div class="kpi-card kpi-info">
        <span class="kpi-label">Total</span>
        <span class="kpi-valor">${altas.length + medias.length + baixas.length + lidas.length}</span>
      </div>
      <div class="kpi-card kpi-erro">
        <span class="kpi-label">Alta</span>
        <span class="kpi-valor">${altas.length}</span>
      </div>
      <div class="kpi-card kpi-aviso">
        <span class="kpi-label">Média</span>
        <span class="kpi-valor">${medias.length}</span>
      </div>
      <div class="kpi-card kpi-ok">
        <span class="kpi-label">Baixa</span>
        <span class="kpi-valor">${baixas.length}</span>
      </div>
    </div>
  `;
}

// ============================================================
// FILTROS
// ============================================================

function filtrosConselheiro() {
  return `
    <div class="contador-filtros">
      <select onchange="setFiltroConselheiro('periodo', this.value)">
        <option value="10/2026" ${filtroConselheiro.periodo === '10/2026' ? 'selected' : ''}>10/2026</option>
        <option value="09/2026" ${filtroConselheiro.periodo === '09/2026' ? 'selected' : ''}>09/2026</option>
        <option value="08/2026" ${filtroConselheiro.periodo === '08/2026' ? 'selected' : ''}>08/2026</option>
      </select>
      <select onchange="setFiltroConselheiro('filial', this.value)">
        <option value="Matriz" ${filtroConselheiro.filial === 'Matriz' ? 'selected' : ''}>Matriz</option>
        <option value="Todas" ${filtroConselheiro.filial === 'Todas' ? 'selected' : ''}>Todas as filiais</option>
      </select>
      <select onchange="setFiltroConselheiro('area', this.value)">
        <option value="todas" ${filtroConselheiro.area === 'todas' ? 'selected' : ''}>Todas as áreas</option>
        <option value="Rentabilidade" ${filtroConselheiro.area === 'Rentabilidade' ? 'selected' : ''}>Rentabilidade</option>
        <option value="Custos" ${filtroConselheiro.area === 'Custos' ? 'selected' : ''}>Custos</option>
        <option value="Caixa" ${filtroConselheiro.area === 'Caixa' ? 'selected' : ''}>Caixa</option>
        <option value="Impostos" ${filtroConselheiro.area === 'Impostos' ? 'selected' : ''}>Impostos</option>
        <option value="Eficiência" ${filtroConselheiro.area === 'Eficiência' ? 'selected' : ''}>Eficiência</option>
        <option value="Risco" ${filtroConselheiro.area === 'Risco' ? 'selected' : ''}>Risco</option>
      </select>
      <select onchange="setFiltroConselheiro('prioridade', this.value)">
        <option value="todas" ${filtroConselheiro.prioridade === 'todas' ? 'selected' : ''}>Todas as prioridades</option>
        <option value="Alta" ${filtroConselheiro.prioridade === 'Alta' ? 'selected' : ''}>Alta</option>
        <option value="Média" ${filtroConselheiro.prioridade === 'Média' ? 'selected' : ''}>Média</option>
        <option value="Baixa" ${filtroConselheiro.prioridade === 'Baixa' ? 'selected' : ''}>Baixa</option>
      </select>
      <label style="display:flex; align-items:center; gap:6px; font-size:13px;">
        <input type="checkbox" ${filtroConselheiro.mostrarLidas ? 'checked' : ''}
               onchange="setFiltroConselheiro('mostrarLidas', this.checked)">
        Mostrar lidas
      </label>
    </div>
  `;
}

function setFiltroConselheiro(campo, valor) {
  filtroConselheiro[campo] = valor;
  document.getElementById('content').innerHTML = screens['conselheiro']();
}

function filtrarSugestoes(lista) {
  return lista.filter(s => {
    if (filtroConselheiro.area !== 'todas' && s.area !== filtroConselheiro.area) return false;
    if (filtroConselheiro.prioridade !== 'todas' && s.prioridade !== filtroConselheiro.prioridade) return false;
    return true;
  });
}

// ============================================================
// CARD DE SUGESTÃO
// ============================================================

function cardSugestao(s) {
  const classeLida = s.lida ? 'lida' : '';
  const classeArea = 'area-' + s.area.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const classePrioridade = 'prio-' + s.prioridade.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const classeConfianca = 'conf-' + s.confianca.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  return `
    <div class="conselheiro-card ${classeArea} ${classeLida}">
      <div class="conselheiro-card-topo">
        <div class="conselheiro-card-titulo">
          <span class="conselheiro-card-icone">${s.icone}</span>
          <div>
            <div class="conselheiro-card-codigo">${s.id} · ${s.area}</div>
            <div class="conselheiro-card-nome">${s.titulo}</div>
          </div>
        </div>
        <div class="conselheiro-card-badges">
          <span class="conselheiro-prio-badge ${s.prioridade.toLowerCase()}">${s.prioridade}</span>
          <span class="conselheiro-conf-badge ${classeConfianca}">confiança ${s.confianca.toLowerCase()}</span>
        </div>
      </div>

      <div class="conselheiro-card-descricao">${s.descricao}</div>

      <div class="conselheiro-card-meta">
        <div class="conselheiro-meta-item">
          <span class="muted">Impacto:</span>
          <strong>${s.impacto}${s.impactoEstimado ? ' (' + s.impactoEstimado + ')' : ''}</strong>
        </div>
        <div class="conselheiro-meta-item">
          <span class="muted">Esforço:</span>
          <strong>${s.esforco}</strong>
        </div>
        <div class="conselheiro-meta-item">
          <span class="muted">Fonte:</span>
          <strong>${s.fonte}</strong>
        </div>
      </div>

      <div class="conselheiro-card-acao">
        <span class="muted">Ação sugerida:</span> ${s.acaoSugerida}
      </div>

      <div class="conselheiro-card-botoes">
        <button class="btn-sm" onclick="verDadosConselheiro('${s.id}')">👁️ Ver dados</button>
        <button class="btn-sm" onclick="irParaTelaConselheiro('${s.rota}')">→ Ir para ${nomeTela(s.rota)}</button>
        ${s.lida
          ? `<button class="btn-sm" onclick="desmarcarLidaConselheiro('${s.id}')">↩️ Desmarcar como lida</button>`
          : `<button class="btn-sm" onclick="marcarLidaConselheiro('${s.id}')">✓ Marcar como lida</button>`}
      </div>
    </div>
  `;
}

function nomeTela(rota) {
  const nomes = {
    'margem': 'Margem',
    'fluxo-caixa': 'Fluxo de Caixa',
    'analise-custos': 'Análise de Custos',
    'dre': 'DRE',
    'contas-receber': 'Contas a Receber',
    'contas-pagar': 'Contas a Pagar',
    'posicao-caixa': 'Posição de Caixa',
    'posicao-impostos': 'Posição de Impostos',
    'folha': 'Folha',
    'ativos': 'Ativos',
    'fornecedores': 'Fornecedores',
  };
  return nomes[rota] || rota;
}

// ============================================================
// AÇÕES
// ============================================================

function verDadosConselheiro(id) {
  const s = sugestoesConselheiro.find(x => x.id === id);
  if (!s) return;
  const f = s.fundamento || {};
  alert(
    `Sugestão ${s.id} — ${s.titulo}\n\n` +
    `Área: ${s.area}\n` +
    `Métrica: ${f.metrica || '—'}\n` +
    `Valor atual: ${f.valorAtual || '—'}\n` +
    `Valor de referência: ${f.valorReferencia || '—'}\n` +
    `Período: ${f.periodo || '—'}\n` +
    `Comparação: ${f.comparacao || '—'}\n\n` +
    `Impacto: ${s.impacto}${s.impactoEstimado ? ' (' + s.impactoEstimado + ')' : ''}\n` +
    `Esforço: ${s.esforco}\n` +
    `Confiança: ${s.confianca}\n\n` +
    `Fonte: ${s.fonte}`
  );
}

function irParaTelaConselheiro(rota) {
  showScreen(rota);
}

function marcarLidaConselheiro(id) {
  const s = sugestoesConselheiro.find(x => x.id === id);
  if (!s) return;
  s.lida = true;
  document.getElementById('content').innerHTML = screens['conselheiro']();
}

function desmarcarLidaConselheiro(id) {
  const s = sugestoesConselheiro.find(x => x.id === id);
  if (!s) return;
  s.lida = false;
  document.getElementById('content').innerHTML = screens['conselheiro']();
}

function analisarNovamenteConselheiro() {
  // No wireframe, apenas re-renderiza (na produção, recalcularia as heurísticas)
  document.getElementById('content').innerHTML = screens['conselheiro']();
}

// ============================================================
// CARD NO DASHBOARD (TELA INICIAL DO ADMINISTRADOR)
// ============================================================

function cardConselheiroDashboard() {
  const top3 = sugestoesConselheiro
    .filter(s => s.prioridade === 'Alta' && !s.lida)
    .slice(0, 3);

  if (top3.length === 0) {
    return `
      <div class="conselheiro-dashboard-card">
        <div class="conselheiro-dashboard-header">
          <h2>💡 Sugestões do Conselheiro</h2>
          <a class="ti-ver-todas" onclick="showScreen('conselheiro')">Ver todas →</a>
        </div>
        <p class="muted" style="font-size:13px;">Nenhuma sugestão no momento.</p>
      </div>
    `;
  }

  return `
    <div class="conselheiro-dashboard-card">
      <div class="conselheiro-dashboard-header">
        <h2>💡 Sugestões do Conselheiro (${top3.length})</h2>
        <a class="ti-ver-todas" onclick="showScreen('conselheiro')">Ver todas →</a>
      </div>
      ${top3.map(s => `
        <div class="conselheiro-dashboard-item" onclick="showScreen('conselheiro')">
          <span class="conselheiro-dashboard-codigo">${s.id}</span>
          <span class="conselheiro-dashboard-texto">${s.titulo}</span>
          <span class="conselheiro-prio-badge ${s.prioridade.toLowerCase()}">${s.prioridade}</span>
        </div>
      `).join('')}
    </div>
  `;
}