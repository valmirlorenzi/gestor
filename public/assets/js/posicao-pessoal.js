// ============================================================
// G12 — POSIÇÃO DE PESSOAL
// Relatório do Administrador (item 3.14 do menu)
// Adicionado na v1.1 do wireframe (merge do 13)
// ============================================================

screens['posicao-pessoal'] = () => {
  const dados = POSICAO_PESSOAL_SIMULADO;

  // --- Renderizadores ---
  const renderizarKpi = (label, valor, classe = '') => `
    <div class="pessoal-kpi ${classe}">
      <span class="pessoal-kpi-label">${escaparHtml(label)}</span>
      <span class="pessoal-kpi-valor">${valor}</span>
    </div>
  `;

  const renderizarArea = (area, max) => `
  <tr class="pessoal-area-linha"
      data-drill="area"
      data-titulo="Funcionários — ${escaparHtml(area.area)}"
      data-valor="${area.valor}"
      data-qtd="2"
      style="cursor:pointer">
    <td class="pessoal-area-nome">${escaparHtml(area.area)}</td>
    <td class="pessoal-area-valor">${formatarMoeda(area.valor)}</td>
    <td class="pessoal-area-barra">${renderizarBarra(area.valor, max, 'info')}</td>
  </tr>
  `;

  const renderizarEvolucao = (evolucao) => {
    if (!evolucao || evolucao.length === 0) return '';
    const max = Math.max(...evolucao.map(e => e.custo), 1);
    const pontos = evolucao.map((e, i) => {
      const x = (i / (evolucao.length - 1 || 1)) * 100;
      const y = 100 - (e.custo / max) * 100;
      return `${x},${y}`;
    }).join(' ');
    return `
      <div class="pessoal-evolucao">
        <h3 class="pessoal-evolucao-titulo">Evolução mensal do custo de pessoal</h3>
        <svg class="pessoal-grafico" viewBox="0 0 100 100" preserveAspectRatio="none">
          <polyline points="${pontos}" fill="none" stroke="#2980b9" stroke-width="0.8" vector-effect="non-scaling-stroke"/>
          ${evolucao.map((e, i) => {
            const x = (i / (evolucao.length - 1 || 1)) * 100;
            const y = 100 - (e.custo / max) * 100;
            return `<circle cx="${x}" cy="${y}" r="1.2" fill="#2980b9"><title>${escaparHtml(e.mes)}: ${formatarMoeda(e.custo)} (${e.headcount} func.)</title></circle>`;
          }).join('')}
        </svg>
        <div class="pessoal-evolucao-labels">
          ${evolucao.map(e => `<span class="pessoal-evolucao-label">${escaparHtml(e.mes)}</span>`).join('')}
        </div>
      </div>
    `;
  };

  const maxArea = Math.max(...dados.porArea.map(a => a.valor), 1);
  const classePeso = dados.pesoReceita > 40 ? 'variacao-negativa' : (dados.pesoReceita > 30 ? 'alerta-medio' : 'variacao-positiva');

  return `
    <div class="screen posicao-pessoal">
      <div class="screen-header">
        <h1>Posição de Pessoal</h1>
        <span class="screen-subtitulo">Período: ${escaparHtml(dados.periodo)}</span>
      </div>

      <div class="pessoal-kpis">
        ${renderizarKpi('Custo total de pessoal', formatarMoeda(dados.custoTotal))}
        ${renderizarKpi('Peso sobre a receita', `<span class="${classePeso}">${formatarPercentual(dados.pesoReceita)}</span>`)}
        ${renderizarKpi('Provisões acumuladas', formatarMoeda(dados.provisoesAcumuladas), 'pessoal-kpi-destaque')}
        ${renderizarKpi('Headcount', dados.headcount)}
        ${renderizarKpi('Custo médio por funcionário', formatarMoeda(dados.custoMedio))}
      </div>

      <div class="pessoal-areas">
        <h3 class="pessoal-areas-titulo">Custo de pessoal por área</h3>
        <table class="pessoal-area-tabela">
          <thead>
            <tr>
              <th>Área</th>
              <th>Valor (R$)</th>
              <th>Distribuição</th>
            </tr>
          </thead>
          <tbody>
            ${dados.porArea.map(a => renderizarArea(a, maxArea)).join('')}
            <tr class="pessoal-area-total">
              <td>TOTAL</td>
              <td class="pessoal-area-valor">${formatarMoeda(dados.porArea.reduce((a, x) => a + x.valor, 0))}</td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>

      ${renderizarEvolucao(dados.evolucaoMensal)}

      <div class="pessoal-rodape">
        <button class="btn btn-secundario" onclick="showScreen('exportacao')">📤 Exportar</button>
        <button class="btn btn-secundario" onclick="showScreen('painel-executivo')">↩ Voltar para o Painel Executivo</button>
      </div>
    </div>
  `;
};