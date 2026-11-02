// ============================================================
// G9 — PAINEL EXECUTIVO
// Relatório do Administrador (item 3.11 do menu)
// Adicionado na v1.1 do wireframe (merge do 13)
// ============================================================

screens['painel-executivo'] = () => {
  const dados = PAINEL_EXECUTIVO_SIMULADO;

  // Agrupa KPIs por bloco, preservando a ordem
  const blocos = {};
  dados.kpis.forEach(kpi => {
    if (!blocos[kpi.bloco]) blocos[kpi.bloco] = [];
    blocos[kpi.bloco].push(kpi);
  });

  const renderizarKpi = (kpi) => {
    const valorFormatado = formatarKpi(kpi.valor, kpi.formato);
    const variacaoFormatada = formatarKpiVariacao(kpi.variacao, kpi.formato);
    const classeVar = classeVariacao(kpi.variacao);
    const classeSem = classeSemaforo(kpi.semaforo);
    const icone = iconeSemaforo(kpi.semaforo);

    return `
      <div class="kpi-card ${classeSem}" data-rota="${escaparHtml(kpi.rota)}" title="Clique para ver o relatório detalhado">
        <div class="kpi-header">
          <span class="kpi-nome">${escaparHtml(kpi.nome)}</span>
          <span class="kpi-semaforo">${icone}</span>
        </div>
        <div class="kpi-valor">${valorFormatado}</div>
        <div class="kpi-variacao ${classeVar}">${variacaoFormatada} vs. período anterior</div>
      </div>
    `;
  };

  const renderizarBloco = (nomeBloco, kpis) => `
    <div class="painel-bloco">
      <h3 class="painel-bloco-titulo">${escaparHtml(nomeBloco)}</h3>
      <div class="kpi-grid">
        ${kpis.map(renderizarKpi).join('')}
      </div>
    </div>
  `;

  const renderizarAlerta = (alerta) => {
    const icone = alerta.severidade === 'vermelho' ? '🔴'
                : alerta.severidade === 'amarelo' ? '🟡'
                : '🟢';
    return `
      <div class="painel-alerta painel-alerta-${escaparHtml(alerta.severidade)}" data-rota="${escaparHtml(alerta.rota)}">
        <span class="painel-alerta-icone">${icone}</span>
        <span class="painel-alerta-texto">${escaparHtml(alerta.texto)}</span>
      </div>
    `;
  };

  return `
    <div class="screen painel-executivo">
      <div class="screen-header">
        <h1>Painel Executivo</h1>
        <span class="screen-subtitulo">Período: ${escaparHtml(dados.periodo)}</span>
      </div>

      ${dados.alertas && dados.alertas.length > 0 ? `
        <div class="painel-alertas">
          ${dados.alertas.map(renderizarAlerta).join('')}
        </div>
      ` : ''}

      <div class="painel-blocos">
        ${Object.entries(blocos).map(([nome, kpis]) => renderizarBloco(nome, kpis)).join('')}
      </div>

      <div class="painel-rodape">
        <button class="btn btn-secundario" onclick="showScreen('exportacao')">📤 Exportar</button>
        <button class="btn btn-secundario" onclick="showScreen('tela-inicial')">↩ Voltar para a Tela Inicial</button>
      </div>
    </div>
  `;
};

// --- Delegação de clique nos cards e alertas ---
document.addEventListener('click', (e) => {
  const card = e.target.closest('.kpi-card[data-rota]');
  if (card) {
    showScreen(card.dataset.rota);
    return;
  }
  const alerta = e.target.closest('.painel-alerta[data-rota]');
  if (alerta) {
    showScreen(alerta.dataset.rota);
    return;
  }
});