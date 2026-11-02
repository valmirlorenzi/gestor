// ============================================================
// G13 — POSIÇÃO DE ATIVOS E DEPRECIAÇÃO
// Relatório do Administrador (item 3.15 do menu)
// Adicionado na v1.1 do wireframe (merge do 13)
// ============================================================

screens['posicao-ativos'] = () => {
  const dados = POSICAO_ATIVOS_SIMULADO;

  // --- Renderizadores ---
  const renderizarKpi = (label, valor, classe = '') => `
    <div class="ativos-kpi ${classe}">
      <span class="ativos-kpi-label">${escaparHtml(label)}</span>
      <span class="ativos-kpi-valor">${valor}</span>
    </div>
  `;

  const renderizarAtivo = (ativo) => {
    const classeStatus = ativo.status === 'Em uso' ? 'status-uso'
                        : ativo.status === 'Ocioso' ? 'status-ocioso'
                        : 'status-alienado';
    const pctDepreciado = ativo.valorOriginal > 0
      ? (ativo.depreciacaoAcumulada / ativo.valorOriginal) * 100
      : 0;
    return `
    <tr class="ativo-linha"
        data-drill="ativo"
        data-titulo="Histórico — ${escaparHtml(ativo.descricao)}"
        data-valor="${ativo.depreciacaoAcumulada}"
        data-qtd="6"
        style="cursor:pointer">
        <td class="ativo-descricao">${escaparHtml(ativo.descricao)}</td>
        <td class="ativo-valor">${formatarMoeda(ativo.valorOriginal)}</td>
        <td class="ativo-valor">${formatarMoeda(ativo.depreciacaoAcumulada)}</td>
        <td class="ativo-valor">${formatarMoeda(ativo.valorContabilLiquido)}</td>
        <td class="ativo-valor">${formatarMoeda(ativo.depreciacaoPeriodo)}</td>
        <td class="ativo-vida">${formatarDias(ativo.vidaUtilRestante * 30)}</td>
        <td class="ativo-status"><span class="ativo-status-badge ${classeStatus}">${escaparHtml(ativo.status)}</span></td>
        <td class="ativo-centro">${escaparHtml(ativo.centroCusto || '—')}</td>
      </tr>
    `;
  };

  const renderizarProjecao = (projecaoTotal) => {
    // Distribuição linear simplificada nos próximos 12 meses
    const meses = [];
    const base = projecaoTotal / 12;
    const hoje = new Date(2026, 9, 1); // out/2026
    for (let i = 0; i < 12; i++) {
      const d = new Date(hoje.getFullYear(), hoje.getMonth() + i, 1);
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const yyyy = d.getFullYear();
      meses.push({ mes: `${mm}/${yyyy}`, valor: base });
    }
    const max = Math.max(...meses.map(m => m.valor), 1);
    return `
      <div class="ativos-projecao">
        <h3 class="ativos-projecao-titulo">Projeção de depreciação — próximos 12 meses</h3>
        <div class="ativos-projecao-barras">
          ${meses.map(m => `
            <div class="ativos-projecao-barra-wrap">
              <div class="ativos-projecao-barra" style="height:${(m.valor / max) * 100}%"></div>
              <span class="ativos-projecao-mes">${m.mes.substring(0, 2)}</span>
              <span class="ativos-projecao-valor">${formatarMoeda(m.valor)}</span>
            </div>
          `).join('')}
        </div>
        <p class="ativos-projecao-total">Total estimado: <strong>${formatarMoeda(projecaoTotal)}</strong></p>
      </div>
    `;
  };

  return `
    <div class="screen posicao-ativos">
      <div class="screen-header">
        <h1>Posição de Ativos</h1>
        <span class="screen-subtitulo">Período: ${escaparHtml(dados.periodo)}</span>
      </div>

      <div class="ativos-kpis">
        ${renderizarKpi('Total do imobilizado (líquido)', formatarMoeda(dados.indicadores.totalImobilizado))}
        ${renderizarKpi('Depreciação acumulada', formatarMoeda(dados.indicadores.depreciacaoAcumuladaTotal))}
        ${renderizarKpi('Depreciação do período', formatarMoeda(dados.indicadores.depreciacaoPeriodoTotal))}
        ${renderizarKpi('Projeção 12 meses', formatarMoeda(dados.indicadores.projecao12Meses))}
      </div>

      <table class="ativos-tabela">
        <thead>
          <tr>
            <th>Ativo</th>
            <th>Valor original</th>
            <th>Depreciação acumulada</th>
            <th>Valor contábil líquido</th>
            <th>Depreciação do período</th>
            <th>Vida útil restante</th>
            <th>Status</th>
            <th>Centro de custo</th>
          </tr>
        </thead>
        <tbody>
          ${dados.ativos.map(renderizarAtivo).join('')}
          <tr class="ativo-total">
            <td>TOTAL</td>
            <td class="ativo-valor">${formatarMoeda(dados.ativos.reduce((a, x) => a + x.valorOriginal, 0))}</td>
            <td class="ativo-valor">${formatarMoeda(dados.ativos.reduce((a, x) => a + x.depreciacaoAcumulada, 0))}</td>
            <td class="ativo-valor">${formatarMoeda(dados.ativos.reduce((a, x) => a + x.valorContabilLiquido, 0))}</td>
            <td class="ativo-valor">${formatarMoeda(dados.ativos.reduce((a, x) => a + x.depreciacaoPeriodo, 0))}</td>
            <td colspan="3"></td>
          </tr>
        </tbody>
      </table>

      ${renderizarProjecao(dados.indicadores.projecao12Meses)}

      <div class="ativos-rodape">
        <button class="btn btn-secundario" onclick="showScreen('exportacao')">📤 Exportar</button>
        <button class="btn btn-secundario" onclick="showScreen('painel-executivo')">↩ Voltar para o Painel Executivo</button>
      </div>
    </div>
  `;
};