/* ============================================================
   RELATÓRIOS — DRE (3.1), DRE por Centro de Custo (3.2), Resumo por Área (3.3)
   ============================================================ */

// ============================================================
// 3.1 — DRE GERENCIAL
// ============================================================

screens['dre'] = () => {
  return `
    <div class="contador-header">
      <h1>DRE Gerencial</h1>
      <div style="display:flex; gap:8px;">
        <button class="btn btn-secondary" onclick="exportarRelatorio('dre')">⬇️ Exportar</button>
      </div>
    </div>
    <p class="subtitle">Demonstração do Resultado do Exercício — ${dreData.periodo} · ${dreData.filial}</p>

    ${filtrosDRE()}
    ${kpisDRE()}
    ${estruturaDRE()}
  `;
};

function filtrosDRE() {
  return `
    <div class="contador-filtros">
      <select onchange="setFiltroDRE('periodo', this.value)">
        <option value="10/2026" ${filtroDRE.periodo === '10/2026' ? 'selected' : ''}>10/2026</option>
        <option value="09/2026" ${filtroDRE.periodo === '09/2026' ? 'selected' : ''}>09/2026</option>
        <option value="08/2026" ${filtroDRE.periodo === '08/2026' ? 'selected' : ''}>08/2026</option>
      </select>
      <select onchange="setFiltroDRE('filial', this.value)">
        <option value="Matriz" ${filtroDRE.filial === 'Matriz' ? 'selected' : ''}>Matriz</option>
        <option value="Todas" ${filtroDRE.filial === 'Todas' ? 'selected' : ''}>Todas as filiais</option>
      </select>
      <select onchange="setFiltroDRE('comparacao', this.value)">
        <option value="anterior" ${filtroDRE.comparacao === 'anterior' ? 'selected' : ''}>Comparar com período anterior</option>
        <option value="anoAnterior" ${filtroDRE.comparacao === 'anoAnterior' ? 'selected' : ''}>Comparar com mesmo período do ano anterior</option>
        <option value="nenhuma" ${filtroDRE.comparacao === 'nenhuma' ? 'selected' : ''}>Sem comparação</option>
      </select>
    </div>
  `;
}

function setFiltroDRE(campo, valor) {
  filtroDRE[campo] = valor;
  document.getElementById('content').innerHTML = screens['dre']();
}

function kpisDRE() {
  const d = dreData;
  const variacaoLucro = ((d.lucroLiquido - d.anterior.lucroLiquido) / d.anterior.lucroLiquido * 100);
  return `
    <div class="contador-kpis">
      <div class="kpi-card kpi-info">
        <span class="kpi-label">Receita líquida</span>
        <span class="kpi-valor">${formatarMoeda(d.receitaLiquida)}</span>
      </div>
      <div class="kpi-card kpi-ok">
        <span class="kpi-label">Lucro bruto</span>
        <span class="kpi-valor">${formatarMoeda(d.lucroBruto)}</span>
      </div>
      <div class="kpi-card kpi-aviso">
        <span class="kpi-label">Lucro operacional</span>
        <span class="kpi-valor">${formatarMoeda(d.lucroOperacional)}</span>
      </div>
      <div class="kpi-card kpi-ok">
        <span class="kpi-label">Lucro líquido</span>
        <span class="kpi-valor">${formatarMoeda(d.lucroLiquido)}</span>
      </div>
    </div>
  `;
}

function estruturaDRE() {
  const d = dreData;
  const rl = d.receitaLiquida;

  return `
    <div class="card">
      <h2>Estrutura do DRE</h2>
      <div class="dre-estrutura">
        ${linhaDRE('1. RECEITA BRUTA', d.receitaBruta, null, null, 'titulo')}
        ${linhaDRE('  1.1 Venda de Mercadorias', d.receitaMercadorias, rl)}
        ${linhaDRE('  1.2 Prestação de Serviços', d.receitaServicos, rl)}
        ${linhaDRE('  1.3 Outras Receitas Operacionais', d.outrasReceitas, rl)}

        ${linhaDRE('2. (-) DEDUÇÕES DA RECEITA', -d.deducoes, rl, null, 'subtotal')}
        ${linhaDRE('  2.1 Impostos sobre Vendas', -d.impostosVendas, rl)}
        ${linhaDRE('  2.2 Devoluções e Abatimentos', -d.devolucoes, rl)}

        ${linhaDRE('3. = RECEITA LÍQUIDA', d.receitaLiquida, rl, null, 'subtotal')}

        ${linhaDRE('4. (-) CUSTOS', -d.custos, rl, null, 'titulo')}
        ${linhaDRE('  4.1 CMV', -d.cmv, rl)}
        ${linhaDRE('  4.2 Custo de Serviços', -d.custoServicos, rl)}

        ${linhaDRE('5. = LUCRO BRUTO', d.lucroBruto, rl, null, 'subtotal')}

        ${linhaDRE('6. (-) DESPESAS OPERACIONAIS', -d.despesasOperacionais, rl, null, 'titulo')}
        ${linhaDRE('  6.1 Despesas Fixas', -d.despesasFixas, rl)}
        ${linhaDRE('  6.2 Despesas Variáveis', -d.despesasVariaveis, rl)}
        ${linhaDRE('  6.3 Despesas Não Operacionais', -d.despesasNaoOperacionais, rl)}

        ${linhaDRE('7. = LUCRO OPERACIONAL', d.lucroOperacional, rl, null, 'subtotal')}

        ${linhaDRE('8. (+/-) RESULTADO FINANCEIRO', d.resultadoFinanceiro, rl, null, 'titulo')}
        ${linhaDRE('  8.1 Receitas Financeiras', d.receitasFinanceiras, rl)}
        ${linhaDRE('  8.2 (-) Despesas Financeiras', -d.despesasFinanceiras, rl)}

        ${linhaDRE('9. = LUCRO ANTES DO IR/CSLL', d.lucroAntesIR, rl, null, 'subtotal')}

        ${linhaDRE('10. (-) IR/CSLL (estimativa)', -d.irCsll, rl)}

        ${linhaDRE('11. = LUCRO LÍQUIDO', d.lucroLiquido, rl, null, 'total')}
      </div>
    </div>
  `;
}

function linhaDRE(label, valor, receitaLiquida, variacao, tipo) {
  const classeTipo = tipo || '';
  const classeValor = valor < 0 ? 'negativo' : '';
  const percentual = receitaLiquida ? ((valor / receitaLiquida) * 100).toFixed(1) + '%' : '';
  return `
    <div class="dre-linha ${classeTipo} ${classeValor}">
      <span class="label">${label}</span>
      <span class="valor">${formatarMoeda(valor)}</span>
      <span class="percentual">${percentual}</span>
    </div>
  `;
}

// ============================================================
// 3.2 — DRE POR CENTRO DE CUSTO
// ============================================================

screens['dre-centro'] = () => {
  return `
    <div class="contador-header">
      <h1>DRE por Centro de Custo</h1>
      <button class="btn btn-secondary" onclick="exportarRelatorio('dre-centro')">⬇️ Exportar</button>
    </div>
    <p class="subtitle">Resultado segmentado por centro de custo — ${filtroDRECentro.periodo}</p>

    ${filtrosDRECentro()}

    <div class="card">
      <table class="data data-regras">
        <thead>
          <tr>
            <th>Centro de custo</th>
            <th style="text-align:right;">Receita</th>
            <th style="text-align:right;">Custos</th>
            <th style="text-align:right;">Despesas</th>
            <th style="text-align:right;">Resultado</th>
            <th style="text-align:right;">Margem</th>
            <th style="text-align:right;">% receita</th>
          </tr>
        </thead>
        <tbody>
          ${dreCentrosCusto.map(c => `
            <tr>
              <td><strong>${c.centroCusto}</strong></td>
              <td class="valor" style="text-align:right;">${formatarMoeda(c.receita)}</td>
              <td class="valor" style="text-align:right;">${formatarMoeda(c.custos)}</td>
              <td class="valor" style="text-align:right;">${formatarMoeda(c.despesas)}</td>
              <td class="valor" style="text-align:right; color:${c.resultado >= 0 ? '#51cf66' : '#ff6b6b'}; font-weight:600;">
                ${formatarMoeda(c.resultado)}
              </td>
              <td style="text-align:right;">${c.margem.toFixed(2)}%</td>
              <td style="text-align:right;">${c.percentualReceita.toFixed(1)}%</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <div class="card" style="margin-top:20px;">
      <h2>Gráfico: resultado por centro de custo</h2>
      ${graficoBarras(dreCentrosCusto.map(c => ({ label: c.centroCusto, valor: c.resultado })))}
    </div>
  `;
};

function filtrosDRECentro() {
  return `
    <div class="contador-filtros">
      <select onchange="setFiltroDRECentro('periodo', this.value)">
        <option value="10/2026" ${filtroDRECentro.periodo === '10/2026' ? 'selected' : ''}>10/2026</option>
        <option value="09/2026" ${filtroDRECentro.periodo === '09/2026' ? 'selected' : ''}>09/2026</option>
      </select>
      <select onchange="setFiltroDRECentro('filial', this.value)">
        <option value="Matriz" ${filtroDRECentro.filial === 'Matriz' ? 'selected' : ''}>Matriz</option>
        <option value="Todas" ${filtroDRECentro.filial === 'Todas' ? 'selected' : ''}>Todas as filiais</option>
      </select>
    </div>
  `;
}

function setFiltroDRECentro(campo, valor) {
  filtroDRECentro[campo] = valor;
  document.getElementById('content').innerHTML = screens['dre-centro']();
}

// ============================================================
// 3.3 — RESUMO POR ÁREA
// ============================================================

screens['resumo-area'] = () => {
  const totalReceita = resumoAreas.reduce((s, a) => s + a.receita, 0);
  const totalResultado = resumoAreas.reduce((s, a) => s + a.resultado, 0);

  return `
    <div class="contador-header">
      <h1>Resumo por Área</h1>
      <button class="btn btn-secondary" onclick="exportarRelatorio('resumo-area')">⬇️ Exportar</button>
    </div>
    <p class="subtitle">Visão executiva consolidada por área de negócio — ${filtroResumoArea.periodo}</p>

    ${filtrosResumoArea()}

    <div class="resumo-cards">
      ${resumoAreas.map(a => resumoAreaCard(a)).join('')}
    </div>

    <div class="card">
      <h2>Consolidado da empresa</h2>
      <div class="dre-estrutura">
        ${linhaDRE('Receita total', totalReceita, totalReceita, null, 'subtotal')}
        ${linhaDRE('Resultado total', totalResultado, totalReceita, null, 'total')}
      </div>
    </div>
  `;
};

function filtrosResumoArea() {
  return `
    <div class="contador-filtros">
      <select onchange="setFiltroResumoArea('periodo', this.value)">
        <option value="10/2026" ${filtroResumoArea.periodo === '10/2026' ? 'selected' : ''}>10/2026</option>
        <option value="09/2026" ${filtroResumoArea.periodo === '09/2026' ? 'selected' : ''}>09/2026</option>
      </select>
      <select onchange="setFiltroResumoArea('filial', this.value)">
        <option value="Matriz" ${filtroResumoArea.filial === 'Matriz' ? 'selected' : ''}>Matriz</option>
        <option value="Todas" ${filtroResumoArea.filial === 'Todas' ? 'selected' : ''}>Todas as filiais</option>
      </select>
    </div>
  `;
}

function setFiltroResumoArea(campo, valor) {
  filtroResumoArea[campo] = valor;
  document.getElementById('content').innerHTML = screens['resumo-area']();
}

function resumoAreaCard(a) {
  const classeVariacao = a.variacao >= 0 ? 'positiva' : 'negativa';
  return `
    <div class="resumo-card">
      <div class="rc-header">
        <span class="rc-icone">${a.icone}</span>
        <span class="rc-area">${a.area}</span>
        <span class="rc-variacao ${classeVariacao}">
          ${a.variacao >= 0 ? '↑' : '↓'} ${Math.abs(a.variacao).toFixed(1)}%
        </span>
      </div>
      <div class="rc-valor">${formatarMoeda(a.resultado)}</div>
      <div class="rc-detalhes">
        <div class="rc-item"><span>Receita:</span><span>${formatarMoeda(a.receita)}</span></div>
        <div class="rc-item"><span>Custos:</span><span>${formatarMoeda(a.custos)}</span></div>
        <div class="rc-item"><span>Desp. fixas:</span><span>${formatarMoeda(a.despesasFixas)}</span></div>
        <div class="rc-item"><span>Desp. var.:</span><span>${formatarMoeda(a.despesasVariaveis)}</span></div>
      </div>
      <div class="rc-detalhes" style="margin-top:6px;">
        <div class="rc-item"><span>Margem:</span><span>${a.margem.toFixed(2)}%</span></div>
      </div>
    </div>
  `;
}

// ============================================================
// HELPERS
// ============================================================

function graficoBarras(itens) {
  const max = Math.max(...itens.map(i => Math.abs(i.valor)));
  return `
    <div class="grafico-barras">
      ${itens.map(i => {
        const pct = max > 0 ? (Math.abs(i.valor) / max) * 100 : 0;
        const classe = i.valor >= 0 ? 'positiva' : 'negativa';
        return `
          <div class="barra-item">
            <span class="barra-label">${i.label}</span>
            <div class="barra-track">
              <div class="barra-fill ${classe}" style="width:${pct}%;"></div>
            </div>
            <span class="barra-valor" style="color:${i.valor >= 0 ? '#51cf66' : '#ff6b6b'};">
              ${formatarMoeda(i.valor)}
            </span>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

function exportarRelatorio(relatorio) {
  alert(`📥 Exportação simulada\n\nRelatório: ${relatorio}\nFormato: Excel (.xlsx)\n\nNa aplicação real, o arquivo seria gerado e disponibilizado para download.`);
}