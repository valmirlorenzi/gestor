// ============================================================
// G11 — POSIÇÃO DE IMPOSTOS
// Relatório do Administrador (item 3.13 do menu)
// Adicionado na v1.1 do wireframe (merge do 13)
// ============================================================

screens['posicao-impostos'] = () => {
  const dados = POSICAO_IMPOSTOS_SIMULADO;

  // --- Renderizadores ---
  const renderizarLinha = (imp) => {
    const classeSaldo = imp.saldo > 0 ? 'saldo-devedor' : (imp.saldo < 0 ? 'saldo-credor' : 'saldo-zerado');
    const labelSaldo = imp.saldo > 0 ? 'Devedor' : (imp.saldo < 0 ? 'Credor' : '—');
    return `
      <tr class="imposto-linha"
        data-drill="tipo_imposto"
        data-titulo="Documentos com ${escaparHtml(imp.tipo)}"
        data-valor="${Math.abs(imp.saldo)}"
        data-qtd="5"
        style="cursor:pointer">
        <td class="imposto-tipo">${escaparHtml(imp.tipo)}</td>
        <td class="imposto-valor">${formatarMoeda(imp.debitos)}</td>
        <td class="imposto-valor">${formatarMoeda(imp.creditos)}</td>
        <td class="imposto-valor ${classeSaldo}">${formatarMoeda(Math.abs(imp.saldo))}</td>
        <td class="imposto-natureza ${classeSaldo}">${labelSaldo}</td>
      </tr>
    `;
  };

  const renderizarEvolucao = (evolucao) => {
    if (!evolucao || evolucao.length === 0) return '';
    const max = Math.max(...evolucao.map(e => e.saldo), 1);
    const pontos = evolucao.map((e, i) => {
      const x = (i / (evolucao.length - 1 || 1)) * 100;
      const y = 100 - (e.saldo / max) * 100;
      return `${x},${y}`;
    }).join(' ');
    return `
      <div class="imposto-evolucao">
        <h3 class="imposto-evolucao-titulo">Evolução mensal do saldo devedor</h3>
        <svg class="imposto-grafico" viewBox="0 0 100 100" preserveAspectRatio="none">
          <polyline points="${pontos}" fill="none" stroke="#e74c3c" stroke-width="0.8" vector-effect="non-scaling-stroke"/>
          ${evolucao.map((e, i) => {
            const x = (i / (evolucao.length - 1 || 1)) * 100;
            const y = 100 - (e.saldo / max) * 100;
            return `<circle cx="${x}" cy="${y}" r="1.2" fill="#e74c3c"><title>${escaparHtml(e.mes)}: ${formatarMoeda(e.saldo)}</title></circle>`;
          }).join('')}
        </svg>
        <div class="imposto-evolucao-labels">
          ${evolucao.map(e => `<span class="imposto-evolucao-label">${escaparHtml(e.mes)}</span>`).join('')}
        </div>
      </div>
    `;
  };

  return `
    <div class="screen posicao-impostos">
      <div class="screen-header">
        <h1>Posição de Impostos</h1>
        <span class="screen-subtitulo">Período: ${escaparHtml(dados.periodo)}</span>
      </div>

      <div class="imposto-alerta-gerencial">
        ⚠️ Este relatório é <strong>gerencial</strong>. Não substitui apuração fiscal oficial.
      </div>

      <div class="imposto-kpis">
        <div class="imposto-kpi">
          <span class="imposto-kpi-label">Carga tributária efetiva</span>
          <span class="imposto-kpi-valor">${formatarPercentual(dados.indicadores.cargaTributaria)}</span>
        </div>
        <div class="imposto-kpi">
          <span class="imposto-kpi-label">Saldo devedor total</span>
          <span class="imposto-kpi-valor saldo-devedor">${formatarMoeda(dados.indicadores.saldoDevedorTotal)}</span>
        </div>
        <div class="imposto-kpi">
          <span class="imposto-kpi-label">Saldo credor total</span>
          <span class="imposto-kpi-valor saldo-credor">${formatarMoeda(dados.indicadores.saldoCredorTotal)}</span>
        </div>
      </div>

      <table class="imposto-tabela">
        <thead>
          <tr>
            <th>Tipo de imposto</th>
            <th>Débitos (R$)</th>
            <th>Créditos (R$)</th>
            <th>Saldo (R$)</th>
            <th>Natureza</th>
          </tr>
        </thead>
        <tbody>
          ${dados.impostos.map(renderizarLinha).join('')}
          <tr class="imposto-total">
            <td>TOTAL</td>
            <td class="imposto-valor">${formatarMoeda(dados.impostos.reduce((a, i) => a + i.debitos, 0))}</td>
            <td class="imposto-valor">${formatarMoeda(dados.impostos.reduce((a, i) => a + i.creditos, 0))}</td>
            <td class="imposto-valor saldo-devedor">${formatarMoeda(dados.indicadores.saldoDevedorTotal)}</td>
            <td></td>
          </tr>
        </tbody>
      </table>

      ${renderizarEvolucao(dados.evolucaoMensal)}

      <div class="imposto-rodape">
        <button class="btn btn-secundario" onclick="showScreen('exportacao')">📤 Exportar</button>
        <button class="btn btn-secundario" onclick="showScreen('painel-executivo')">↩ Voltar para o Painel Executivo</button>
      </div>
    </div>
  `;
};