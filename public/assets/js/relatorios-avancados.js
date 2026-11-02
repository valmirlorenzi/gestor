/* ============================================================
   RELATÓRIOS AVANÇADOS — Fluxo de Caixa (3.4), Análise de Custos (3.5),
   Margem por Cliente/Produto (3.6)
   ============================================================ */

// ============================================================
// 3.4 — FLUXO DE CAIXA PROJETADO
// ============================================================

screens['fluxo-caixa'] = () => {
  return `
    <div class="contador-header">
      <h1>Fluxo de Caixa Projetado</h1>
      <button class="btn btn-secondary" onclick="exportarRelatorio('fluxo-caixa')">⬇️ Exportar</button>
    </div>
    <p class="subtitle">Visão gerencial do fluxo projetado (médio/longo prazo)</p>

    ${filtrosFluxoCaixa()}
    ${kpisFluxoCaixa()}

    <div class="card">
      <h2>Projeção por período</h2>
      <table class="data data-regras">
        <thead>
          <tr>
            <th>Data</th>
            <th style="text-align:right;">Entradas</th>
            <th style="text-align:right;">Saídas</th>
            <th style="text-align:right;">Saldo do dia</th>
            <th style="text-align:right;">Saldo acumulado</th>
          </tr>
        </thead>
        <tbody>
          ${fluxoCaixaProjetado.map(f => `
            <tr>
              <td><strong>${formatarData(f.data)}</strong></td>
              <td style="text-align:right; color:#51cf66;">${formatarMoeda(f.entradas)}</td>
              <td style="text-align:right; color:#ff6b6b;">${formatarMoeda(f.saidas)}</td>
              <td style="text-align:right; color:${f.saldoDia >= 0 ? '#51cf66' : '#ff6b6b'}; font-weight:600;">
                ${formatarMoeda(f.saldoDia)}
              </td>
              <td style="text-align:right; color:${f.saldoAcumulado >= 0 ? '#fff' : '#ff6b6b'}; font-weight:700;">
                ${formatarMoeda(f.saldoAcumulado)}
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    ${fluxoCaixaProjetado.some(f => f.saldoAcumulado < 0) ? `
      <div class="alert alert-warn" style="margin-top:16px;">
        ⚠️ <strong>Saldo negativo projetado</strong> em ${fluxoCaixaProjetado.filter(f => f.saldoAcumulado < 0).map(f => formatarData(f.data)).join(', ')}.
        Considere antecipar recebimentos ou postergar pagamentos.
      </div>
    ` : ''}
  `;
};

function filtrosFluxoCaixa() {
  return `
    <div class="contador-filtros">
      <select onchange="setFiltroFluxoCaixa('horizonte', this.value)">
        <option value="3meses" ${filtroFluxoCaixa.horizonte === '3meses' ? 'selected' : ''}>3 meses</option>
        <option value="6meses" ${filtroFluxoCaixa.horizonte === '6meses' ? 'selected' : ''}>6 meses</option>
        <option value="12meses" ${filtroFluxoCaixa.horizonte === '12meses' ? 'selected' : ''}>12 meses</option>
      </select>
      <select onchange="setFiltroFluxoCaixa('granularidade', this.value)">
        <option value="dia" ${filtroFluxoCaixa.granularidade === 'dia' ? 'selected' : ''}>Por dia</option>
        <option value="semana" ${filtroFluxoCaixa.granularidade === 'semana' ? 'selected' : ''}>Por semana</option>
        <option value="mes" ${filtroFluxoCaixa.granularidade === 'mes' ? 'selected' : ''}>Por mês</option>
      </select>
      <label style="display:flex; align-items:center; gap:6px; font-size:13px;">
        <input type="checkbox" ${filtroFluxoCaixa.incluirEstimativas ? 'checked' : ''}
               onchange="setFiltroFluxoCaixa('incluirEstimativas', this.checked)">
        Incluir estimativas
      </label>
    </div>
  `;
}

function setFiltroFluxoCaixa(campo, valor) {
  filtroFluxoCaixa[campo] = valor;
  document.getElementById('content').innerHTML = screens['fluxo-caixa']();
}

function kpisFluxoCaixa() {
  const totalEntradas = fluxoCaixaProjetado.reduce((s, f) => s + f.entradas, 0);
  const totalSaidas = fluxoCaixaProjetado.reduce((s, f) => s + f.saidas, 0);
  const saldoFinal = fluxoCaixaProjetado[fluxoCaixaProjetado.length - 1].saldoAcumulado;
  return `
    <div class="contador-kpis">
      <div class="kpi-card kpi-ok">
        <span class="kpi-label">Entradas previstas</span>
        <span class="kpi-valor">${formatarMoeda(totalEntradas)}</span>
      </div>
      <div class="kpi-card kpi-erro">
        <span class="kpi-label">Saídas previstas</span>
        <span class="kpi-valor">${formatarMoeda(totalSaidas)}</span>
      </div>
      <div class="kpi-card kpi-info">
        <span class="kpi-label">Saldo final</span>
        <span class="kpi-valor">${formatarMoeda(saldoFinal)}</span>
      </div>
    </div>
  `;
}

// ============================================================
// 3.5 — ANÁLISE DE CUSTOS
// ============================================================

screens['analise-custos'] = () => {
  const lista = filtroAnaliseCustos.visao === 'fornecedor' ? custosPorFornecedor : custosPorCategoria;
  const total = lista.reduce((s, i) => s + i.valor, 0);

  return `
    <div class="contador-header">
      <h1>Análise de Custos</h1>
      <button class="btn btn-secondary" onclick="exportarRelatorio('analise-custos')">⬇️ Exportar</button>
    </div>
    <p class="subtitle">Onde o dinheiro está sendo gasto — ${filtroAnaliseCustos.periodo}</p>

    ${filtrosAnaliseCustos()}

    <div class="contador-kpis">
      <div class="kpi-card kpi-erro">
        <span class="kpi-label">Total gasto</span>
        <span class="kpi-valor">${formatarMoeda(total)}</span>
      </div>
      <div class="kpi-card kpi-info">
        <span class="kpi-label">${filtroAnaliseCustos.visao === 'fornecedor' ? 'Fornecedores' : 'Categorias'}</span>
        <span class="kpi-valor">${lista.length}</span>
      </div>
    </div>

    <div class="card">
      <table class="data data-regras">
        <thead>
          <tr>
            <th>${filtroAnaliseCustos.visao === 'fornecedor' ? 'Fornecedor' : 'Categoria'}</th>
            ${filtroAnaliseCustos.visao === 'fornecedor' ? '<th>Categoria</th>' : ''}
            <th style="text-align:right;">Valor gasto</th>
            <th style="text-align:right;">Documentos</th>
            <th style="text-align:right;">% do total</th>
            <th style="text-align:right;">Variação</th>
          </tr>
        </thead>
        <tbody>
          ${lista.map(i => `
            <tr>
              <td><strong>${filtroAnaliseCustos.visao === 'fornecedor' ? i.fornecedor : i.categoria}</strong></td>
              ${filtroAnaliseCustos.visao === 'fornecedor' ? `<td class="muted">${i.categoria}</td>` : ''}
              <td style="text-align:right; font-weight:600;">${formatarMoeda(i.valor)}</td>
              <td style="text-align:right;">${i.documentos}</td>
              <td style="text-align:right;">${i.percentual.toFixed(2)}%</td>
              <td style="text-align:right; color:${i.variacao >= 0 ? '#ff6b6b' : '#51cf66'};">
                ${i.variacao >= 0 ? '↑' : '↓'} ${Math.abs(i.variacao).toFixed(1)}%
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <div class="card" style="margin-top:20px;">
      <h2>Concentração</h2>
      ${graficoBarras(lista.map(i => ({
        label: filtroAnaliseCustos.visao === 'fornecedor' ? i.fornecedor.substring(0, 20) : i.categoria.substring(0, 20),
        valor: i.valor
      })))}
    </div>
  `;
};

function filtrosAnaliseCustos() {
  return `
    <div class="contador-filtros">
      <select onchange="setFiltroAnaliseCustos('visao', this.value)">
        <option value="fornecedor" ${filtroAnaliseCustos.visao === 'fornecedor' ? 'selected' : ''}>Por fornecedor</option>
        <option value="categoria" ${filtroAnaliseCustos.visao === 'categoria' ? 'selected' : ''}>Por categoria</option>
      </select>
      <select onchange="setFiltroAnaliseCustos('periodo', this.value)">
        <option value="10/2026" ${filtroAnaliseCustos.periodo === '10/2026' ? 'selected' : ''}>10/2026</option>
        <option value="09/2026" ${filtroAnaliseCustos.periodo === '09/2026' ? 'selected' : ''}>09/2026</option>
      </select>
    </div>
  `;
}

function setFiltroAnaliseCustos(campo, valor) {
  filtroAnaliseCustos[campo] = valor;
  document.getElementById('content').innerHTML = screens['analise-custos']();
}

// ============================================================
// 3.6 — MARGEM POR CLIENTE/PRODUTO
// ============================================================

screens['margem'] = () => {
  const isCliente = filtroMargem.visao === 'cliente';
  const lista = isCliente ? margemPorCliente : margemPorProduto;

  return `
    <div class="contador-header">
      <h1>Margem por ${isCliente ? 'Cliente' : 'Produto/Serviço'}</h1>
      <button class="btn btn-secondary" onclick="exportarRelatorio('margem')">⬇️ Exportar</button>
    </div>
    <p class="subtitle">Rentabilidade por ${isCliente ? 'cliente' : 'produto'} — ${filtroMargem.periodo}</p>

    ${filtrosMargem()}

    <div class="card">
      <table class="data data-regras">
        <thead>
          <tr>
            <th>${isCliente ? 'Cliente' : 'Produto'}</th>
            <th style="text-align:right;">Receita</th>
            <th style="text-align:right;">${isCliente ? 'Custos + desp. var.' : 'Custo'}</th>
            <th style="text-align:right;">Margem contrib.</th>
            <th style="text-align:right;">% margem</th>
            <th style="text-align:right;">Variação</th>
          </tr>
        </thead>
        <tbody>
          ${lista.map(i => {
            const margem = isCliente ? i.margemContribuicao : i.margemContribuicao;
            const baseCusto = isCliente ? (i.custos + i.despesasVariaveis) : i.custo;
            const corMargem = i.percentual >= 20 ? '#51cf66' : i.percentual >= 10 ? '#ff922b' : '#ff6b6b';
            return `
              <tr>
                <td><strong>${isCliente ? i.cliente : i.produto}</strong></td>
                <td style="text-align:right;">${formatarMoeda(i.receita)}</td>
                <td style="text-align:right;">${formatarMoeda(baseCusto)}</td>
                <td style="text-align:right; font-weight:600; color:${corMargem};">${formatarMoeda(margem)}</td>
                <td style="text-align:right; color:${corMargem}; font-weight:600;">${i.percentual.toFixed(2)}%</td>
                <td style="text-align:right; color:${i.variacao >= 0 ? '#51cf66' : '#ff6b6b'};">
                  ${i.variacao >= 0 ? '↑' : '↓'} ${Math.abs(i.variacao).toFixed(1)}%
                </td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    </div>

    <div class="card" style="margin-top:20px;">
      <h2>Margem de contribuição (%)</h2>
      ${graficoBarras(lista.map(i => ({
        label: (isCliente ? i.cliente : i.produto).substring(0, 20),
        valor: i.percentual
      })))}
    </div>
  `;
};

function filtrosMargem() {
  return `
    <div class="contador-filtros">
      <select onchange="setFiltroMargem('visao', this.value)">
        <option value="cliente" ${filtroMargem.visao === 'cliente' ? 'selected' : ''}>Por cliente</option>
        <option value="produto" ${filtroMargem.visao === 'produto' ? 'selected' : ''}>Por produto/serviço</option>
      </select>
      <select onchange="setFiltroMargem('periodo', this.value)">
        <option value="10/2026" ${filtroMargem.periodo === '10/2026' ? 'selected' : ''}>10/2026</option>
        <option value="09/2026" ${filtroMargem.periodo === '09/2026' ? 'selected' : ''}>09/2026</option>
      </select>
    </div>
  `;
}

function setFiltroMargem(campo, valor) {
  filtroMargem[campo] = valor;
  document.getElementById('content').innerHTML = screens['margem']();
}