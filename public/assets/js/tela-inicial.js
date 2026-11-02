/* ============================================================
   TELA INICIAL (DASHBOARD) — item 1.0 do menu
   Adaptada por ator. Fixa (customizável é fase 2).
   ============================================================ */

// ============================================================
// TELA INICIAL — RESUMO DO PAINEL EXECUTIVO (FA do 13)
// Adicionado na v1.1 do wireframe (merge do 13)
// Exibido apenas para o Administrador, no lugar do mini-DRE.
// ============================================================

function renderizarResumoPainelExecutivo() {
  if (typeof PAINEL_EXECUTIVO_SIMULADO === 'undefined') {
    return `<div class="ti-resumo-vazio">Painel Executivo indisponível.</div>`;
  }
  const dados = PAINEL_EXECUTIVO_SIMULADO;

  // 6 KPIs principais para o resumo (um por bloco + 2 extras)
  const selecionados = ['Receita Líquida', 'Lucro Líquido', 'Margem Líquida', 'Liquidez Corrente', 'Endividamento Geral', 'ROE'];
  const kpis = selecionados
    .map(nome => dados.kpis.find(k => k.nome === nome))
    .filter(Boolean);

  const renderizarKpiMini = (kpi) => {
    const valorFormatado = formatarKpi(kpi.valor, kpi.formato);
    const variacaoFormatada = formatarKpiVariacao(kpi.variacao, kpi.formato);
    const classeVar = classeVariacao(kpi.variacao);
    const classeSem = classeSemaforo(kpi.semaforo);
    const icone = iconeSemaforo(kpi.semaforo);
    return `
      <div class="ti-kpi-mini ${classeSem}" data-rota="painel-executivo" title="Clique para abrir o Painel Executivo">
        <div class="ti-kpi-mini-header">
          <span class="ti-kpi-mini-nome">${escaparHtml(kpi.nome)}</span>
          <span class="ti-kpi-mini-semaforo">${icone}</span>
        </div>
        <div class="ti-kpi-mini-valor">${valorFormatado}</div>
        <div class="ti-kpi-mini-variacao ${classeVar}">${variacaoFormatada}</div>
      </div>
    `;
  };

  return `
    <div class="ti-resumo ti-resumo-painel">
      <div class="ti-resumo-header">
        <h3 class="ti-resumo-titulo">📊 Painel Executivo — resumo</h3>
        <button class="btn btn-link" onclick="showScreen('painel-executivo')">Ver painel completo →</button>
      </div>
      <div class="ti-kpi-grid-mini">
        ${kpis.map(renderizarKpiMini).join('')}
      </div>
      ${dados.alertas && dados.alertas.length > 0 ? `
        <div class="ti-resumo-alertas">
          ${dados.alertas.map(a => `
            <span class="ti-resumo-alerta ti-resumo-alerta-${escaparHtml(a.severidade)}">
              ${a.severidade === 'vermelho' ? '🔴' : a.severidade === 'amarelo' ? '🟡' : '🟢'}
              ${escaparHtml(a.texto)}
            </span>
          `).join('')}
        </div>
      ` : ''}
    </div>
  `;
}

screens['tela-inicial'] = () => {
  const ator = (typeof USUARIO_ORDENS !== 'undefined' && USUARIO_ORDENS.ator) || 'configurador';
  return renderTelaInicial(ator);
};

function renderTelaInicial(ator) {
  const info = getInfoAtor(ator);
  const hoje = new Date();
  const dataFormatada = hoje.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });

  return `
    <div class="ti-header">
      <div class="ti-saudacao">
        <h1>Olá, ${info.nome.split(' ')[0]} 👋</h1>
        <div class="ti-contexto">
          <span>${dataFormatada}</span>
          <span class="ti-sep">·</span>
          <span>Período: 10/2026 (Aberto)</span>
          <span class="ti-sep">·</span>
          <span>Filial: Matriz</span>
        </div>
      </div>
      <div>
        <span class="badge badge-status-pendente">${info.icone} ${info.nome}</span>
      </div>
    </div>

    ${renderAlertas(ator)}
    ${renderKpis(ator)}
    ${renderAcoes(ator)}
    ${renderOrdens(ator)}
    ${renderResumo(ator)}
    ${ator === 'administrador' ? cardConselheiroDashboard() : ''}    
  `;
}

// ============================================================
// ALERTAS
// ============================================================

function renderAlertas(ator) {
  const alertas = alertasTelaInicial[ator] || [];
  if (alertas.length === 0) return '';

  return `
    <div class="ti-alertas">
      ${alertas.map(a => `
        <div class="ti-alerta ${a.tipo}" onclick="showScreen('${a.rota}')">
          <span class="ti-alerta-icon">${a.icone}</span>
          <span class="ti-alerta-texto">${a.texto}</span>
          <span class="ti-alerta-seta">→</span>
        </div>
      `).join('')}
    </div>
  `;
}

// ============================================================
// KPIs
// ============================================================

function renderKpis(ator) {
  const kpis = kpisTelaInicial[ator] || [];
  return `
    <div class="ti-kpis">
      ${kpis.map(k => `
        <div class="ti-kpi ti-kpi-${k.cor}">
          <span class="ti-kpi-label">${k.label}</span>
          <span class="ti-kpi-valor ${k.texto ? 'texto' : ''}">${k.valor}</span>
        </div>
      `).join('')}
    </div>
  `;
}

// ============================================================
// AÇÕES RÁPIDAS
// ============================================================

function renderAcoes(ator) {
  const acoes = acoesTelaInicial[ator] || [];
  return `
    <div class="ti-acoes">
      ${acoes.map(a => `
        <div class="ti-acao" onclick="showScreen('${a.rota}')">
          <span class="ti-acao-icone">${a.icone}</span>
          <span class="ti-acao-label">${a.label}</span>
        </div>
      `).join('')}
    </div>
  `;
}

// ============================================================
// MINHAS ORDENS
// ============================================================

function renderOrdens(ator) {
  if (typeof ordens === 'undefined') return '';

  const minhas = ordens
    .filter(o => o.atorDestino === ator && (o.status === 'pendente' || o.status === 'em_andamento'))
    .sort((a, b) => {
      if (a.urgente !== b.urgente) return a.urgente ? -1 : 1;
      return new Date(a.dataCriacao) - new Date(b.dataCriacao);
    })
    .slice(0, 3);

  if (minhas.length === 0) {
    return `
      <div class="ti-ordens">
        <div class="ti-ordens-header">
          <h2>📥 Minhas ordens</h2>
          <a class="ti-ver-todas" onclick="showScreen('caixa-entrada')">Ver todas →</a>
        </div>
        <p class="muted" style="font-size:13px;">Nenhuma ordem pendente ou em andamento.</p>
      </div>
    `;
  }

  return `
    <div class="ti-ordens">
      <div class="ti-ordens-header">
        <h2>📥 Minhas ordens (${minhas.length})</h2>
        <a class="ti-ver-todas" onclick="showScreen('caixa-entrada')">Ver todas →</a>
      </div>
      ${minhas.map(o => `
        <div class="ti-ordem-item ${o.urgente ? 'urgente' : ''}" onclick="showScreen('caixa-entrada')">
          <span class="ti-ordem-tipo">${o.tipoOrdem}</span>
          <span class="ti-ordem-descricao">${o.descricaoResumida}</span>
          ${o.urgente ? '<span class="ti-ordem-badge">urgente</span>' : ''}
        </div>
      `).join('')}
    </div>
  `;
}

// ============================================================
// RESUMO
// ============================================================

function renderResumo(ator) {

  // FA do merge do 13 — Administrador vê o resumo do Painel Executivo
  if (ator === 'administrador') {
    return renderizarResumoPainelExecutivo();
  }

  const resumo = resumoTelaInicial[ator];
  if (!resumo) return '';

  if (resumo.tipo === 'lista') {
    return `
      <div class="ti-resumo">
        <h2>${resumo.titulo}</h2>
        <div class="ti-resumo-lista">
          ${resumo.itens.map(i => `
            <div class="ti-resumo-item">
              <span class="ti-resumo-texto">${i.texto}</span>
              <span class="ti-resumo-data">${i.data}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  if (resumo.tipo === 'mini-dre') {
    return `
      <div class="ti-resumo">
        <h2>${resumo.titulo}</h2>
        <div class="ti-mini-dre">
          ${resumo.linhas.map(l => `
            <div class="ti-mini-dre-linha ${l.destaque ? 'destaque' : ''}">
              <span>${l.label}</span>
              <span class="ti-mini-dre-valor" style="color:${l.cor === 'ok' ? '#51cf66' : l.cor === 'info' ? '#4a9eff' : '#fff'};">${l.valor}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  if (resumo.tipo === 'tabela') {
    return `
      <div class="ti-resumo">
        <h2>${resumo.titulo}</h2>
        <div class="ti-resumo-tabela">
          <table>
            <thead><tr>${resumo.colunas.map(c => `<th>${c}</th>`).join('')}</tr></thead>
            <tbody>
              ${resumo.linhas.map(l => `<tr>${l.map(v => `<td>${v}</td>`).join('')}</tr>`).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  if (resumo.tipo === 'timeline') {
    return `
      <div class="ti-resumo">
        <h2>${resumo.titulo}</h2>
        <div class="ti-timeline">
          ${resumo.itens.map(i => `
            <div class="ti-tl-item ${i.status}">
              <div>${i.titulo}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  return '';
}

// ============================================================
// Delegação de clique nos mini-KPIs do resumo do Painel Executivo
// ============================================================

document.addEventListener('click', (e) => {
  const mini = e.target.closest('.ti-kpi-mini[data-rota]');
  if (mini) {
    showScreen(mini.dataset.rota);
  }
});

