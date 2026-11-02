// ============================================================
// G14 — PONTO DE EQUILÍBRIO
// Relatório do Administrador (item 3.16 do menu)
// Adicionado na v1.1 do wireframe (merge do 13)
// ============================================================

screens['ponto-equilibrio'] = () => {
  const dados = PONTO_EQUILIBRIO_SIMULADO;

  // --- Cálculos ---
  const margemPct = dados.margemContribuicaoPct / 100;
  const peContabil = margemPct > 0 ? dados.custosFixos / margemPct : null;
  const peFinanceiro = margemPct > 0
    ? (dados.custosFixos - (dados.depreciacao || 0)) / margemPct
    : null;
  const margemSeguranca = dados.receita > 0 && peContabil
    ? ((dados.receita - peContabil) / dados.receita) * 100
    : null;

  const margemNegativa = dados.margemContribuicao < 0;

  // --- Renderizadores ---
  const renderizarKpi = (label, valor, classe = '') => `
    <div class="pe-kpi ${classe}">
      <span class="pe-kpi-label">${escaparHtml(label)}</span>
      <span class="pe-kpi-valor">${valor}</span>
    </div>
  `;

  const renderizarGrafico = () => {
    // Escala: eixo X vai de 0 a 1,5 × max(receita, PE)
    const maxX = Math.max(dados.receita, peContabil || 0) * 1.5;
    const maxY = maxX; // mesma escala para simplificar (linha de 45°)
    const px = (v) => (v / maxX) * 100;
    const py = (v) => 100 - (v / maxY) * 100;

    // Linha de receita (y = x, 45°)
    const x1r = px(0), y1r = py(0);
    const x2r = px(maxX), y2r = py(maxX);

    // Linha de custo total (y = custos fixos + margem variável × x)
    const coefVar = dados.custosVariaveis / dados.receita;
    const custoEm = (x) => dados.custosFixos + coefVar * x;
    const x1c = px(0), y1c = py(dados.custosFixos);
    const x2c = px(maxX), y2c = py(custoEm(maxX));

    // Ponto de equilíbrio (interseção)
    const peX = px(peContabil || 0);
    const peY = py(peContabil || 0);

    return `
      <div class="pe-grafico-wrap">
        <h3 class="pe-grafico-titulo">Receita × Custos</h3>
        <svg class="pe-grafico" viewBox="0 0 100 100" preserveAspectRatio="none">
          <!-- Linha de receita -->
          <line x1="${x1r}" y1="${y1r}" x2="${x2r}" y2="${y2r}" stroke="#27ae60" stroke-width="0.8" vector-effect="non-scaling-stroke"/>
          <!-- Linha de custo total -->
          <line x1="${x1c}" y1="${y1c}" x2="${x2c}" y2="${y2c}" stroke="#e74c3c" stroke-width="0.8" vector-effect="non-scaling-stroke"/>
          <!-- Linha de custo fixo (horizontal) -->
          <line x1="0" y1="${py(dados.custosFixos)}" x2="100" y2="${py(dados.custosFixos)}" stroke="#95a5a6" stroke-width="0.4" stroke-dasharray="2,2" vector-effect="non-scaling-stroke"/>
          <!-- Ponto de equilíbrio -->
          <circle cx="${peX}" cy="${peY}" r="1.8" fill="#f39c12">
            <title>PE: ${formatarMoeda(peContabil || 0)}</title>
          </circle>
        </svg>
        <div class="pe-grafico-legenda">
          <span class="pe-legenda pe-legenda-receita">Receita</span>
          <span class="pe-legenda pe-legenda-custo">Custo total</span>
          <span class="pe-legenda pe-legenda-fixo">Custo fixo</span>
          <span class="pe-legenda pe-legenda-pe">Ponto de equilíbrio</span>
        </div>
      </div>
    `;
  };

  // --- Render ---
  if (margemNegativa) {
    return `
      <div class="screen ponto-equilibrio">
        <div class="screen-header">
          <h1>Ponto de Equilíbrio</h1>
          <span class="screen-subtitulo">Período: ${escaparHtml(dados.periodo)}</span>
        </div>
        <div class="pe-alerta pe-alerta-erro">
          ⚠️ <strong>Margem de contribuição negativa.</strong>
          A receita não cobre os custos variáveis. Não é possível calcular o ponto de equilíbrio.
          Reveja preços ou custos variáveis.
        </div>
        <div class="pe-rodape">
          <button class="btn btn-secundario" onclick="showScreen('painel-executivo')">↩ Voltar para o Painel Executivo</button>
        </div>
      </div>
    `;
  }

  return `
    <div class="screen ponto-equilibrio">
      <div class="screen-header">
        <h1>Ponto de Equilíbrio</h1>
        <span class="screen-subtitulo">Período: ${escaparHtml(dados.periodo)}</span>
      </div>

      <div class="pe-kpis">
        ${renderizarKpi('Receita atual', formatarMoeda(dados.receita))}
        ${renderizarKpi('Custos fixos', formatarMoeda(dados.custosFixos))}
        ${renderizarKpi('Custos variáveis', formatarMoeda(dados.custosVariaveis))}
        ${renderizarKpi('Margem de contribuição', formatarMoeda(dados.margemContribuicao) + ' (' + formatarPercentual(dados.margemContribuicaoPct) + ')')}
      </div>

      <div class="pe-kpis pe-kpis-destaque">
        ${renderizarKpi('PE contábil', formatarMoeda(peContabil || 0), 'pe-kpi-destaque')}
        ${renderizarKpi('PE financeiro', formatarMoeda(peFinanceiro || 0), 'pe-kpi-destaque')}
        ${renderizarKpi('Margem de segurança', margemSeguranca !== null ? formatarPercentual(margemSeguranca) : '—', margemSeguranca !== null && margemSeguranca < 10 ? 'pe-kpi-alerta' : 'pe-kpi-ok')}
      </div>

      ${renderizarGrafico()}

      <div class="pe-tabela-wrap">
        <h3 class="pe-tabela-titulo">Detalhamento</h3>
        <table class="pe-tabela">
          <tbody>
            <tr><td>Receita bruta</td><td class="pe-valor">${formatarMoeda(dados.receita)}</td></tr>
            <tr><td>(−) Custos variáveis</td><td class="pe-valor">${formatarMoeda(dados.custosVariaveis)}</td></tr>
            <tr class="pe-subtotal"><td>= Margem de contribuição</td><td class="pe-valor">${formatarMoeda(dados.margemContribuicao)}</td></tr>
            <tr><td>(−) Custos fixos</td><td class="pe-valor">${formatarMoeda(dados.custosFixos)}</td></tr>
            <tr class="pe-total"><td>= Resultado</td><td class="pe-valor ${dados.receita - dados.custosFixos - dados.custosVariaveis >= 0 ? 'variacao-positiva' : 'variacao-negativa'}">${formatarMoeda(dados.receita - dados.custosFixos - dados.custosVariaveis)}</td></tr>
          </tbody>
        </table>
      </div>

      <div class="pe-rodape">
        <button class="btn btn-secundario" onclick="showScreen('exportacao')">📤 Exportar</button>
        <button class="btn btn-secundario" onclick="showScreen('painel-executivo')">↩ Voltar para o Painel Executivo</button>
      </div>
    </div>
  `;
};