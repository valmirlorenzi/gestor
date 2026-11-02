// ============================================================
// G10 — AGING DE CONTAS (A RECEBER E A PAGAR)
// Relatório do Administrador (item 3.12 do menu)
// Adicionado na v1.1 do wireframe (merge do 13)
// ============================================================

screens['aging-contas'] = () => {
  const dados = AGING_SIMULADO;

  // --- Renderizadores ---
  const renderizarFaixa = (faixa, max, tipo) => {
    // Cor da barra: aReceber = verde→vermelho conforme atraso; aPagar = cinza→vermelho
    let cor = 'info';
    if (tipo === 'receber') {
      if (faixa.faixa === '> 90 dias') cor = 'erro';
      else if (faixa.faixa === '61–90 dias') cor = 'aviso';
      else if (faixa.faixa === '31–60 dias') cor = 'aviso';
      else cor = 'ok';
    } else {
      if (faixa.faixa === 'Vencidas > 60d') cor = 'erro';
      else if (faixa.faixa === 'Vencidas 31–60d') cor = 'erro';
      else if (faixa.faixa === 'Vencidas 1–30d') cor = 'aviso';
      else cor = 'info';
    }
    const pct = max > 0 ? (faixa.valor / max) * 100 : 0;
    
    return `
    <tr class="aging-linha"
        data-drill="faixa"
        data-titulo="${escaparHtml(tipo === 'receber' ? 'A receber — ' : 'A pagar — ')}${escaparHtml(faixa.faixa)}"
        data-valor="${faixa.valor}"
        data-qtd="${faixa.qtd || 3}"
        style="cursor:pointer">
        <td class="aging-faixa">${escaparHtml(faixa.faixa)}</td>
        <td class="aging-qtd">${faixa.qtd}</td>
        <td class="aging-valor">${formatarMoeda(faixa.valor)}</td>
        <td class="aging-pct">${formatarPercentual(pct)}</td>
        <td class="aging-barra">${renderizarBarra(faixa.valor, max, cor)}</td>
      </tr>
    `;
  };

  const renderizarBloco = (titulo, bloco, tipo) => {
    const max = Math.max(...bloco.faixas.map(f => f.valor), 1);
    const indicadores = bloco.indicadores || {};
    return `
      <div class="aging-bloco">
        <h3 class="aging-titulo">${escaparHtml(titulo)}</h3>
        <table class="aging-tabela">
          <thead>
            <tr>
              <th>Faixa</th>
              <th>Qtd</th>
              <th>Valor (R$)</th>
              <th>%</th>
              <th>Distribuição</th>
            </tr>
          </thead>
          <tbody>
            ${bloco.faixas.map(f => renderizarFaixa(f, max, tipo)).join('')}
            <tr class="aging-total">
              <td colspan="2">TOTAL</td>
              <td class="aging-valor">${formatarMoeda(bloco.total)}</td>
              <td colspan="2"></td>
            </tr>
          </tbody>
        </table>
        <div class="aging-indicadores">
          ${indicadores.inadimplencia !== undefined ? `
            <div class="aging-indicador">
              <span class="aging-indicador-label">Inadimplência</span>
              <span class="aging-indicador-valor ${indicadores.inadimplencia > 10 ? 'variacao-negativa' : 'variacao-positiva'}">${formatarPercentual(indicadores.inadimplencia)}</span>
            </div>
          ` : ''}
          ${indicadores.pmr !== undefined ? `
            <div class="aging-indicador">
              <span class="aging-indicador-label">PMR</span>
              <span class="aging-indicador-valor">${formatarDias(indicadores.pmr)}</span>
            </div>
          ` : ''}
          ${indicadores.pmp !== undefined ? `
            <div class="aging-indicador">
              <span class="aging-indicador-label">PMP</span>
              <span class="aging-indicador-valor">${formatarDias(indicadores.pmp)}</span>
            </div>
          ` : ''}
          ${indicadores.concentracaoTop5 !== undefined ? `
            <div class="aging-indicador">
              <span class="aging-indicador-label">Concentração Top 5</span>
              <span class="aging-indicador-valor">${formatarPercentual(indicadores.concentracaoTop5)}</span>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  };

  return `
    <div class="screen aging-contas">
      <div class="screen-header">
        <h1>Aging de Contas</h1>
        <span class="screen-subtitulo">Período: ${escaparHtml(dados.periodo)}</span>
      </div>

      <div class="aging-blocos">
        ${renderizarBloco('Contas a Receber', dados.aReceber, 'receber')}
        ${renderizarBloco('Contas a Pagar', dados.aPagar, 'pagar')}
      </div>

      <div class="aging-rodape">
        <button class="btn btn-secundario" onclick="showScreen('exportacao')">📤 Exportar</button>
        <button class="btn btn-secundario" onclick="showScreen('painel-executivo')">↩ Voltar para o Painel Executivo</button>
      </div>
    </div>
  `;
};