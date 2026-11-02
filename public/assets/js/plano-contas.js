/* ============================================================
   4.2 — CADASTRO DE PLANO DE CONTAS — A2
   Árvore de contas (sintéticas e analíticas)
   ============================================================ */

screens['plano-contas'] = () => {
  return `
    <div class="contador-header">
      <h1>Plano de Contas</h1>
      <button class="btn btn-primary" onclick="novaConta()">+ Nova conta</button>
    </div>
    <p class="subtitle">Árvore de contas gerenciais (sintéticas e analíticas)</p>

    ${kpisPlanoContas()}
    ${filtrosPlanoContas()}

    <div class="card">
      <div class="plano-arvore">
        ${planoContasArvore.map(raiz => renderContaArvore(raiz, 0)).join('')}
      </div>
    </div>
  `;
};

function kpisPlanoContas() {
  const todas = contarContas(planoContasArvore);
  const analiticas = todas.filter(c => c.aceitaLancamento).length;
  const sinteticas = todas.filter(c => !c.aceitaLancamento).length;
  return `
    <div class="contador-kpis">
      <div class="kpi-card kpi-info">
        <span class="kpi-label">Analíticas</span>
        <span class="kpi-valor">${analiticas}</span>
      </div>
      <div class="kpi-card">
        <span class="kpi-label">Sintéticas</span>
        <span class="kpi-valor">${sinteticas}</span>
      </div>
      <div class="kpi-card">
        <span class="kpi-label">Total</span>
        <span class="kpi-valor">${todas.length}</span>
      </div>
    </div>
  `;
}

function contarContas(arvore) {
  let total = [];
  arvore.forEach(c => {
    total.push(c);
    if (c.filhos) total = total.concat(contarContas(c.filhos));
  });
  return total;
}

function filtrosPlanoContas() {
  return `
    <div class="contador-filtros">
      <select onchange="setFiltroPlanoContas('tipo', this.value)">
        <option value="todos" ${filtroPlanoContas.tipo === 'todos' ? 'selected' : ''}>Todos os tipos</option>
        ${['Ativo','Passivo','Custo','Despesa','Receita'].map(t => `<option value="${t}" ${filtroPlanoContas.tipo === t ? 'selected' : ''}>${t}</option>`).join('')}
      </select>
      <select onchange="setFiltroPlanoContas('natureza', this.value)">
        <option value="todos" ${filtroPlanoContas.natureza === 'todos' ? 'selected' : ''}>Sintética/analítica</option>
        <option value="Analitica" ${filtroPlanoContas.natureza === 'Analitica' ? 'selected' : ''}>Só analíticas</option>
        <option value="Sintetica" ${filtroPlanoContas.natureza === 'Sintetica' ? 'selected' : ''}>Só sintéticas</option>
      </select>
      <input type="text" placeholder="Buscar código/descrição..."
             value="${filtroPlanoContas.busca}"
             oninput="setFiltroPlanoContas('busca', this.value)">
    </div>
  `;
}

function setFiltroPlanoContas(campo, valor) {
  filtroPlanoContas[campo] = valor;
  document.getElementById('content').innerHTML = screens['plano-contas']();
}

function renderContaArvore(conta, nivel) {
  if (!contaPassaFiltro(conta)) return '';
  const indent = nivel * 20;
  const temFilhos = conta.filhos && conta.filhos.length > 0;
  return `
    <div class="plano-linha" style="padding-left:${indent}px;">
      <span class="plano-codigo">${conta.codigo}</span>
      <span class="plano-descricao">${temFilhos ? '📁' : '📄'} ${conta.descricao}</span>
      <span class="badge ${conta.aceitaLancamento ? 'badge-status-concluida' : 'badge-info'}">${conta.aceitaLancamento ? 'analítica' : 'sintética'}</span>
      <span class="badge badge-prioridade">${conta.tipo}</span>
      ${conta.aceitaLancamento ? `<span class="muted" style="font-size:11px;">map: ${conta.mapeamento}</span>` : ''}
      <button class="btn-sm" onclick="editarConta(${conta.id})">Editar</button>
    </div>
    ${temFilhos ? conta.filhos.map(f => renderContaArvore(f, nivel + 1)).join('') : ''}
  `;
}

function contaPassaFiltro(c) {
  if (filtroPlanoContas.tipo !== 'todos' && c.tipo !== filtroPlanoContas.tipo) return false;
  if (filtroPlanoContas.natureza !== 'todos' && c.natureza !== filtroPlanoContas.natureza) return false;
  if (filtroPlanoContas.busca) {
    const b = filtroPlanoContas.busca.toLowerCase();
    if (!c.codigo.includes(b) && !c.descricao.toLowerCase().includes(b)) return false;
  }
  return true;
}

function novaConta() {
  alert('No wireframe, a criação de conta é feita via modal (a implementar).');
}

function editarConta(id) {
  const todas = contarContas(planoContasArvore);
  const c = todas.find(x => x.id === id);
  if (!c) return;
  const nova = prompt(`Descrição da conta ${c.codigo}:`, c.descricao);
  if (!nova) return;
  c.descricao = nova;
  showScreen('plano-contas');
}