/* ============================================================
   FOLHA DE PAGAMENTO (10.6)
   Lista + wizard: importar/digitar + consolidar
   ============================================================ */

screens['folha'] = () => {
  const filtradas = filtrarFolhas(folhasPagamento);

  return `
    <div class="contador-header">
      <h1>Folha de Pagamento</h1>
      <div style="display:flex; gap:8px;">
        <button class="btn btn-secondary" onclick="importarFolha()">📥 Importar</button>
        <button class="btn btn-primary" onclick="digitarFolha()">✏️ Digitar</button>
      </div>
    </div>
    <p class="subtitle">Gerencie a folha de pagamento, encargos e provisões</p>

    ${kpisFolhas(folhasPagamento)}
    ${filtrosFolhas()}

    <div class="card">
      <table class="data data-regras">
        <thead>
          <tr>
            <th>Período</th>
            <th>Filial</th>
            <th>Funcionários</th>
            <th>Bruto</th>
            <th>Encargos</th>
            <th>Líquido</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          ${filtradas.map(f => linhaFolha(f)).join('')}
        </tbody>
      </table>
    </div>
  `;
};

function kpisFolhas(lista) {
  const calculadas = lista.filter(f => f.status === 'Calculada').length;
  const fechadas = lista.filter(f => f.status === 'Fechada').length;
  const totalLiquido = lista.reduce((s, f) => s + f.totalLiquido, 0);
  return `
    <div class="contador-kpis">
      <div class="kpi-card kpi-info">
        <span class="kpi-label">Total líquido</span>
        <span class="kpi-valor">${formatarMoeda(totalLiquido)}</span>
      </div>
      <div class="kpi-card kpi-aviso">
        <span class="kpi-label">Calculadas</span>
        <span class="kpi-valor">${calculadas}</span>
      </div>
      <div class="kpi-card kpi-ok">
        <span class="kpi-label">Fechadas</span>
        <span class="kpi-valor">${fechadas}</span>
      </div>
      <div class="kpi-card">
        <span class="kpi-label">Total</span>
        <span class="kpi-valor">${lista.length}</span>
      </div>
    </div>
  `;
}

function filtrosFolhas() {
  return `
    <div class="contador-filtros">
      <select onchange="setFiltroFolhas('status', this.value)">
        <option value="todas" ${filtroFolhas.status === 'todas' ? 'selected' : ''}>Todos os status</option>
        <option value="Calculada" ${filtroFolhas.status === 'Calculada' ? 'selected' : ''}>Calculadas</option>
        <option value="Fechada" ${filtroFolhas.status === 'Fechada' ? 'selected' : ''}>Fechadas</option>
      </select>
      <input type="text" placeholder="Buscar período..."
             value="${filtroFolhas.busca}"
             oninput="setFiltroFolhas('busca', this.value)">
    </div>
  `;
}

function setFiltroFolhas(campo, valor) {
  filtroFolhas[campo] = valor;
  document.getElementById('content').innerHTML = screens['folha']();
}

function filtrarFolhas(lista) {
  return lista.filter(f => {
    if (filtroFolhas.status !== 'todas' && f.status !== filtroFolhas.status) return false;
    if (filtroFolhas.busca && !f.mesAno.includes(filtroFolhas.busca)) return false;
    return true;
  });
}

function linhaFolha(f) {
  return `
    <tr>
      <td><strong>${f.mesAno}</strong></td>
      <td>${f.filial}</td>
      <td>${f.funcionarios}</td>
      <td>${formatarMoeda(f.totalBruto)}</td>
      <td>${formatarMoeda(f.totalEncargos)}</td>
      <td><strong>${formatarMoeda(f.totalLiquido)}</strong></td>
      <td>${f.status === 'Fechada' ? '<span class="badge badge-status-concluida">fechada</span>' : '<span class="badge badge-status-parcial">calculada</span>'}</td>
      <td>
        <div class="acoes-linha">
          <button class="btn-sm" onclick="verFolha(${f.id})">Ver</button>
          ${f.status === 'Calculada' ? `<button class="btn-sm" onclick="consolidarFolha(${f.id})">Consolidar</button>` : ''}
        </div>
      </td>
    </tr>
  `;
}

function verFolha(id) {
  const f = folhasPagamento.find(x => x.id === id);
  if (!f) return;
  document.getElementById('content').innerHTML = detalheFolha(f);
}

function detalheFolha(f) {
  return `
    <div class="contador-header">
      <h1>Folha ${f.mesAno}</h1>
      <button class="btn btn-secondary" onclick="showScreen('folha')">← Voltar</button>
    </div>
    <p class="subtitle">${f.filial} · ${f.funcionarios} funcionários · Status: ${f.status}</p>

    <div class="contador-kpis">
      <div class="kpi-card">
        <span class="kpi-label">Bruto</span>
        <span class="kpi-valor">${formatarMoeda(f.totalBruto)}</span>
      </div>
      <div class="kpi-card kpi-aviso">
        <span class="kpi-label">Encargos</span>
        <span class="kpi-valor">${formatarMoeda(f.totalEncargos)}</span>
      </div>
      <div class="kpi-card kpi-info">
        <span class="kpi-label">Provisões</span>
        <span class="kpi-valor">${formatarMoeda(f.totalProvisoes)}</span>
      </div>
      <div class="kpi-card kpi-ok">
        <span class="kpi-label">Líquido</span>
        <span class="kpi-valor">${formatarMoeda(f.totalLiquido)}</span>
      </div>
    </div>

    <div class="card">
      <h2>Detalhamento por funcionário</h2>
      ${itensFolhaAtual.map(item => itemFolhaCard(item)).join('')}
    </div>

    <div class="card">
      <h2>Consolidação (E3)</h2>
      <div class="alert ${f.status === 'Fechada' ? 'alert-success' : 'alert-warn'}">
        ${f.status === 'Fechada'
          ? '✅ Folha consolidada e fechada. Lançamentos gerados no razão e DRE.'
          : '⚠️ Folha calculada, aguardando consolidação. Clique em "Consolidar" para gerar os lançamentos.'}
      </div>
      ${f.status === 'Calculada' ? `
        <div class="form-actions" style="justify-content:flex-start; margin-top:12px;">
          <button class="btn btn-primary" onclick="consolidarFolha(${f.id})">Consolidar folha</button>
        </div>
      ` : ''}
    </div>
  `;
}

function itemFolhaCard(item) {
  return `
    <div class="lancamento-card" style="margin-bottom:12px;">
      <div class="lc-topo">
        <div class="lc-dados">
          <div class="lc-titulo">${item.funcionario} · ${item.cargo}</div>
          <div class="lc-meta">
            <span>🏢 ${item.centroCusto}</span>
            <span>💰 Salário: ${formatarMoeda(item.salarioBase)}</span>
          </div>
        </div>
        <div class="lc-valor">${formatarMoeda(item.valorLiquido)}</div>
      </div>

      <div class="lc-sugestao" style="display:grid; grid-template-columns:repeat(auto-fit, minmax(130px, 1fr)); gap:12px;">
        <div>
          <div class="muted" style="font-size:11px;">Proventos</div>
          <div style="font-size:13px; font-weight:600;">${formatarMoeda(item.totalProventos)}</div>
        </div>
        <div>
          <div class="muted" style="font-size:11px;">Descontos</div>
          <div style="font-size:13px; font-weight:600; color:#ff922b;">${formatarMoeda(item.totalDescontos)}</div>
        </div>
        <div>
          <div class="muted" style="font-size:11px;">INSS empregado</div>
          <div style="font-size:13px;">${formatarMoeda(item.inssEmpregado)}</div>
        </div>
        <div>
          <div class="muted" style="font-size:11px;">IRRF</div>
          <div style="font-size:13px;">${formatarMoeda(item.irrf)}</div>
        </div>
      </div>

      <div class="lc-sugestao" style="display:grid; grid-template-columns:repeat(auto-fit, minmax(130px, 1fr)); gap:12px; background:rgba(74,158,255,0.05);">
        <div>
          <div class="muted" style="font-size:11px;">INSS patronal</div>
          <div style="font-size:13px;">${formatarMoeda(item.inssPatronal)}</div>
        </div>
        <div>
          <div class="muted" style="font-size:11px;">FGTS</div>
          <div style="font-size:13px;">${formatarMoeda(item.fgts)}</div>
        </div>
        <div>
          <div class="muted" style="font-size:11px;">RAT</div>
          <div style="font-size:13px;">${formatarMoeda(item.rat)}</div>
        </div>
        <div>
          <div class="muted" style="font-size:11px;">Terceiros</div>
          <div style="font-size:13px;">${formatarMoeda(item.terceiros)}</div>
        </div>
      </div>
    </div>
  `;
}

function consolidarFolha(id) {
  const f = folhasPagamento.find(x => x.id === id);
  if (!f) return;
  if (!confirm(`Consolidar a folha ${f.mesAno}? Os lançamentos contábeis e provisões serão gerados.`)) return;
  f.status = 'Fechada';
  alert(`Folha ${f.mesAno} consolidada com sucesso!\n\n` +
    `Lançamentos gerados:\n` +
    `• Custo/Despesa de Pessoal (bruto + encargos)\n` +
    `• INSS a Recolher\n` +
    `• FGTS a Recolher\n` +
    `• IRRF a Recolher\n` +
    `• Provisões de Férias e 13º`);
  showScreen('folha');
}

function importarFolha() {
  alert('No wireframe, a importação de folha é feita via upload de arquivo (a implementar).\n\n' +
    'Na versão real: upload de planilha/CSV, pré-validação, mapeamento de colunas, cálculo de encargos.');
}

function digitarFolha() {
  alert('No wireframe, a digitação de folha é feita via formulário (a implementar).\n\n' +
    'Na versão real: seleção de funcionários, proventos/descontos, cálculo automático, override.');
}