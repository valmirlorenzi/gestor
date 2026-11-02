/* ============================================================
   4.8 — VALIDAÇÃO DE CÁLCULOS — E1–E5
   Lista de cálculos pendentes/ok, com override
   ============================================================ */

screens['validacao'] = () => {
  const filtrados = filtrarValidacao(calculosPendentes);

  return `
    <div class="contador-header">
      <h1>Validação de Cálculos</h1>
      <span class="badge badge-info">E1–E5</span>
    </div>
    <p class="subtitle">Valide os cálculos de impostos, folha, depreciação e provisões</p>

    ${kpisValidacao(calculosPendentes)}
    ${filtrosValidacao()}

    ${filtrados.length === 0
      ? '<div class="ordens-vazio"><div class="vazio-icon">✅</div><p>Nenhum cálculo pendente.</p></div>'
      : filtrados.map(c => calculoCard(c)).join('')}
  `;
};

function kpisValidacao(lista) {
  const pendentes = lista.filter(c => c.status === 'pendente').length;
  const ok = lista.filter(c => c.status === 'ok').length;
  const divergentes = lista.filter(c => c.divergencia > 0 && c.status === 'pendente').length;
  return `
    <div class="contador-kpis">
      <div class="kpi-card kpi-aviso">
        <span class="kpi-label">Pendentes</span>
        <span class="kpi-valor">${pendentes}</span>
      </div>
      <div class="kpi-card kpi-erro">
        <span class="kpi-label">Divergências</span>
        <span class="kpi-valor">${divergentes}</span>
      </div>
      <div class="kpi-card kpi-ok">
        <span class="kpi-label">OK</span>
        <span class="kpi-valor">${ok}</span>
      </div>
      <div class="kpi-card">
        <span class="kpi-label">Total</span>
        <span class="kpi-valor">${lista.length}</span>
      </div>
    </div>
  `;
}

function filtrosValidacao() {
  return `
    <div class="contador-filtros">
      <select onchange="setFiltroValidacao('tipo', this.value)">
        <option value="todos" ${filtroValidacao.tipo === 'todos' ? 'selected' : ''}>Todos os tipos</option>
        <option value="Impostos sobre compras" ${filtroValidacao.tipo === 'Impostos sobre compras' ? 'selected' : ''}>Impostos sobre compras</option>
        <option value="Impostos sobre vendas" ${filtroValidacao.tipo === 'Impostos sobre vendas' ? 'selected' : ''}>Impostos sobre vendas</option>
        <option value="Folha de pagamento" ${filtroValidacao.tipo === 'Folha de pagamento' ? 'selected' : ''}>Folha</option>
        <option value="Depreciação" ${filtroValidacao.tipo === 'Depreciação' ? 'selected' : ''}>Depreciação</option>
        <option value="Provisões" ${filtroValidacao.tipo === 'Provisões' ? 'selected' : ''}>Provisões</option>
      </select>
      <select onchange="setFiltroValidacao('status', this.value)">
        <option value="todos" ${filtroValidacao.status === 'todos' ? 'selected' : ''}>Todos os status</option>
        <option value="pendente" ${filtroValidacao.status === 'pendente' ? 'selected' : ''}>Pendentes</option>
        <option value="ok" ${filtroValidacao.status === 'ok' ? 'selected' : ''}>OK</option>
      </select>
      <input type="text" placeholder="Buscar documento/contraparte..."
             value="${filtroValidacao.busca}"
             oninput="setFiltroValidacao('busca', this.value)">
    </div>
  `;
}

function setFiltroValidacao(campo, valor) {
  filtroValidacao[campo] = valor;
  document.getElementById('content').innerHTML = screens['validacao']();
}

function filtrarValidacao(lista) {
  return lista.filter(c => {
    if (filtroValidacao.tipo !== 'todos' && c.tipo !== filtroValidacao.tipo) return false;
    if (filtroValidacao.status !== 'todos' && c.status !== filtroValidacao.status) return false;
    if (filtroValidacao.busca) {
      const b = filtroValidacao.busca.toLowerCase();
      if (!c.documento.toLowerCase().includes(b) && !c.contraparte.toLowerCase().includes(b)) return false;
    }
    return true;
  });
}

function calculoCard(c) {
  const temDivergencia = c.divergencia > 0;
  return `
    <div class="lancamento-card ${temDivergencia && c.status === 'pendente' ? 'conflito' : ''}">
      <div class="lc-topo">
        <div class="lc-dados">
          <div class="lc-titulo">${c.tipo} · ${c.documento}</div>
          <div class="lc-meta">
            <span>👤 ${c.contraparte}</span>
            <span class="badge ${c.status === 'ok' ? 'badge-confianca-alta' : temDivergencia ? 'badge-confianca-baixa' : 'badge-confianca-media'}">
              ${c.status === 'ok' ? '✓ ok' : temDivergencia ? '⚠️ divergência' : 'pendente'}
            </span>
          </div>
        </div>
        <div class="lc-valor">${formatarMoeda(c.valorCalculado)}</div>
      </div>

      <table class="data data-regras" style="margin:10px 0;">
        <thead><tr><th>Imposto</th><th>Calculado</th><th>XML</th><th>Status</th></tr></thead>
        <tbody>
          ${c.detalhes.map(d => `
            <tr>
              <td>${d.imposto}</td>
              <td>${formatarMoeda(d.calculado)}</td>
              <td>${formatarMoeda(d.xml)}</td>
              <td>${d.status === 'ok'
                ? '<span class="badge badge-status-concluida">✓</span>'
                : '<span class="badge badge-status-parcial">⚠️ ' + formatarMoeda(d.calculado - d.xml) + '</span>'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      ${temDivergencia && c.status === 'pendente' ? `
        <div class="alert alert-warn" style="margin:10px 0;">
          ⚠️ Divergência total: <strong>${formatarMoeda(c.divergencia)}</strong> entre o calculado (${formatarMoeda(c.valorCalculado)}) e o XML (${formatarMoeda(c.valorXml)}).
        </div>
        <div class="lc-acoes">
          <button class="btn btn-primary" onclick="aceitarCalculo(${c.id})">Aceitar calculado</button>
          <button class="btn btn-secondary" onclick="overrideCalculo(${c.id})">Override (justificar)</button>
          <button class="btn btn-secondary" onclick="manterXml(${c.id})">Manter valor do XML</button>
        </div>
      ` : `
        <div class="lc-acoes">
          <button class="btn btn-secondary" onclick="verDetalhesCalculo(${c.id})">Ver detalhes</button>
        </div>
      `}
    </div>
  `;
}

function aceitarCalculo(id) {
  const c = calculosPendentes.find(x => x.id === id);
  if (!c) return;
  c.status = 'ok';
  c.valorXml = c.valorCalculado;
  c.divergencia = 0;
  c.detalhes.forEach(d => { d.xml = d.calculado; d.status = 'ok'; });
  showScreen('validacao');
}

function overrideCalculo(id) {
  const c = calculosPendentes.find(x => x.id === id);
  if (!c) return;
  const justificativa = prompt('Justificativa para o override (obrigatória):');
  if (!justificativa) return;
  c.status = 'ok';
  c.justificativa = justificativa;
  showScreen('validacao');
}

function manterXml(id) {
  const c = calculosPendentes.find(x => x.id === id);
  if (!c) return;
  c.status = 'ok';
  c.valorCalculado = c.valorXml;
  c.divergencia = 0;
  c.detalhes.forEach(d => { d.calculado = d.xml; d.status = 'ok'; });
  showScreen('validacao');
}

function verDetalhesCalculo(id) {
  const c = calculosPendentes.find(x => x.id === id);
  if (!c) return;
  alert(
    `${c.tipo} · ${c.documento}\n` +
    `Contraparte: ${c.contraparte}\n` +
    `Valor calculado: ${formatarMoeda(c.valorCalculado)}\n` +
    `Valor XML: ${formatarMoeda(c.valorXml)}\n` +
    `Divergência: ${formatarMoeda(c.divergencia)}\n` +
    (c.justificativa ? `\nJustificativa: ${c.justificativa}` : '')
  );
}