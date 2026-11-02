/* ============================================================
   4.1 — TABELAS BASAIS (FISCAIS) — I2
   Consulta/ajuste de parâmetros fiscais
   ============================================================ */

screens['tabelas-fiscais'] = () => {
  const filtrados = filtrarParametros(parametrosFiscais);

  return `
    <div class="contador-header">
      <h1>Tabelas basais (fiscais)</h1>
      <span class="badge badge-status-pendente">Contador</span>
    </div>
    <p class="subtitle">Parâmetros fiscais adaptáveis por empresa (tributos estaduais/municipais)</p>

    ${kpisParametros(parametrosFiscais)}
    ${filtrosParametros()}

    <div class="card">
      <table class="data data-regras">
        <thead>
          <tr>
            <th>Tipo</th>
            <th>Descrição</th>
            <th>Alíquota</th>
            <th>Base de cálculo</th>
            <th>Vigência</th>
            <th>Universal</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          ${filtrados.map(p => linhaParametro(p)).join('')}
        </tbody>
      </table>
    </div>

    <div class="card" style="margin-top:20px;">
      <h2>Outras tabelas</h2>
      <p class="muted">Consulte as tabelas de INSS, IRRF e encargos (trabalhistas — não adaptáveis)</p>
      <div class="form-actions" style="justify-content:flex-start;">
        <button class="btn btn-secondary" onclick="showScreen('tabelas-inss')">Ver INSS</button>
        <button class="btn btn-secondary" onclick="showScreen('tabelas-irrf')">Ver IRRF</button>
        <button class="btn btn-secondary" onclick="showScreen('tabelas-encargos')">Ver Encargos</button>
      </div>
    </div>
  `;
};

function kpisParametros(lista) {
  const ativos = lista.filter(p => p.ativo).length;
  const universais = lista.filter(p => p.universal).length;
  const adaptaveis = lista.filter(p => !p.universal).length;
  return `
    <div class="contador-kpis">
      <div class="kpi-card kpi-ok">
        <span class="kpi-label">Ativos</span>
        <span class="kpi-valor">${ativos}</span>
      </div>
      <div class="kpi-card kpi-info">
        <span class="kpi-label">Universais</span>
        <span class="kpi-valor">${universais}</span>
      </div>
      <div class="kpi-card kpi-aviso">
        <span class="kpi-label">Adaptáveis</span>
        <span class="kpi-valor">${adaptaveis}</span>
      </div>
      <div class="kpi-card">
        <span class="kpi-label">Total</span>
        <span class="kpi-valor">${lista.length}</span>
      </div>
    </div>
  `;
}

function filtrosParametros() {
  return `
    <div class="contador-filtros">
      <select onchange="setFiltroParametros('tipoImposto', this.value)">
        <option value="todos" ${filtroParametros.tipoImposto === 'todos' ? 'selected' : ''}>Todos os impostos</option>
        ${['ICMS','IPI','PIS','COFINS','ISS','IBS','CBS'].map(t => `<option value="${t}" ${filtroParametros.tipoImposto === t ? 'selected' : ''}>${t}</option>`).join('')}
      </select>
      <select onchange="setFiltroParametros('universal', this.value)">
        <option value="todos" ${filtroParametros.universal === 'todos' ? 'selected' : ''}>Universal/adaptável</option>
        <option value="universal" ${filtroParametros.universal === 'universal' ? 'selected' : ''}>Só universais</option>
        <option value="adaptavel" ${filtroParametros.universal === 'adaptavel' ? 'selected' : ''}>Só adaptáveis</option>
      </select>
      <input type="text" placeholder="Buscar descrição..."
             value="${filtroParametros.busca}"
             oninput="setFiltroParametros('busca', this.value)">
    </div>
  `;
}

function setFiltroParametros(campo, valor) {
  filtroParametros[campo] = valor;
  document.getElementById('content').innerHTML = screens['tabelas-fiscais']();
}

function filtrarParametros(lista) {
  return lista.filter(p => {
    if (filtroParametros.tipoImposto !== 'todos' && p.tipoImposto !== filtroParametros.tipoImposto) return false;
    if (filtroParametros.universal === 'universal' && !p.universal) return false;
    if (filtroParametros.universal === 'adaptavel' && p.universal) return false;
    if (filtroParametros.busca) {
      const b = filtroParametros.busca.toLowerCase();
      if (!p.descricao.toLowerCase().includes(b)) return false;
    }
    return true;
  });
}

function linhaParametro(p) {
  return `
    <tr>
      <td><span class="badge badge-info">${p.tipoImposto}</span></td>
      <td>${p.descricao}</td>
      <td><strong>${p.aliquota.toFixed(2)}%</strong></td>
      <td class="muted">${p.baseCalculo}</td>
      <td class="muted">${formatarData(p.vigenciaInicio)}${p.vigenciaFim ? ' — ' + formatarData(p.vigenciaFim) : ''}</td>
      <td>${p.universal ? '<span class="badge badge-status-concluida">universal</span>' : '<span class="badge badge-status-parcial">adaptável</span>'}</td>
      <td>${p.ativo ? '<span class="badge badge-status-concluida">ativo</span>' : '<span class="badge badge-status-cancelada">inativo</span>'}</td>
      <td>
        <div class="acoes-linha">
          <button class="btn-sm" onclick="editarParametro(${p.id})">Editar</button>
        </div>
      </td>
    </tr>
  `;
}

function editarParametro(id) {
  const p = parametrosFiscais.find(x => x.id === id);
  if (!p) return;
  const nova = prompt(`Nova alíquota para "${p.descricao}" (atual: ${p.aliquota}%):`, p.aliquota);
  if (!nova) return;
  p.aliquota = parseFloat(nova) || 0;
  showScreen('tabelas-fiscais');
}

/* ---------- Tabelas de INSS, IRRF e Encargos (4.1 — sub-telas) ---------- */

screens['tabelas-inss'] = () => `
  <div class="contador-header">
    <h1>Tabela INSS</h1>
    <button class="btn btn-secondary" onclick="showScreen('tabelas-fiscais')">← Voltar</button>
  </div>
  <p class="subtitle">Tabela universal (não adaptável — federal). Vigência 2026.</p>
  <div class="card">
    <table class="data data-regras">
      <thead><tr><th>Faixa</th><th>Valor inicial</th><th>Valor final</th><th>Alíquota</th></tr></thead>
      <tbody>
        ${tabelasINSS.map(t => `
          <tr>
            <td>${t.faixa}ª</td>
            <td>${formatarMoeda(t.valorInicial)}</td>
            <td>${formatarMoeda(t.valorFinal)}</td>
            <td><strong>${t.aliquota.toFixed(2)}%</strong></td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>
`;

screens['tabelas-irrf'] = () => `
  <div class="contador-header">
    <h1>Tabela IRRF</h1>
    <button class="btn btn-secondary" onclick="showScreen('tabelas-fiscais')">← Voltar</button>
  </div>
  <p class="subtitle">Tabela universal (não adaptável — federal). Vigência 2026.</p>
  <div class="card">
    <table class="data data-regras">
      <thead><tr><th>Faixa</th><th>Valor inicial</th><th>Valor final</th><th>Alíquota</th><th>Dedução</th></tr></thead>
      <tbody>
        ${tabelasIRRF.map(t => `
          <tr>
            <td>${t.faixa}ª</td>
            <td>${formatarMoeda(t.valorInicial)}</td>
            <td>${formatarMoeda(t.valorFinal)}</td>
            <td><strong>${t.aliquota.toFixed(2)}%</strong></td>
            <td>${formatarMoeda(t.deducao)}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>
`;

screens['tabelas-encargos'] = () => `
  <div class="contador-header">
    <h1>Tabela de Encargos</h1>
    <button class="btn btn-secondary" onclick="showScreen('tabelas-fiscais')">← Voltar</button>
  </div>
  <p class="subtitle">Tabela universal (não adaptável — federal). Vigência 2026.</p>
  <div class="card">
    <table class="data data-regras">
      <thead><tr><th>Descrição</th><th>Alíquota</th></tr></thead>
      <tbody>
        ${tabelasEncargos.map(t => `
          <tr>
            <td>${t.descricao}</td>
            <td><strong>${t.aliquota.toFixed(2)}%</strong></td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>
`;