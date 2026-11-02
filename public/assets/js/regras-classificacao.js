/* ============================================================
   REGRAS DE CLASSIFICAÇÃO (D5)
   ============================================================ */

screens['regras-classificacao'] = () => {
  const filtradas = filtrarRegras(regrasClassificacao);

  return `
    <div class="contador-header">
      <h1>Regras de Classificação</h1>
      <button class="btn btn-primary" onclick="novaRegra()">+ Nova regra</button>
    </div>
    <p class="subtitle">Gerencie as regras do motor de classificação (D1)</p>

    ${kpisRegras(regrasClassificacao)}
    ${filtrosRegras()}

    <div class="card">
      <table class="data data-regras">
        <thead>
          <tr>
            <th>Prioridade</th>
            <th>Descrição</th>
            <th>Contexto</th>
            <th>Conta destino</th>
            <th>Origem</th>
            <th>Usos</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          ${filtradas.map(r => linhaRegra(r)).join('')}
        </tbody>
      </table>
    </div>
  `;
};

function kpisRegras(lista) {
  const ativas = lista.filter(r => r.ativo).length;
  const inativas = lista.filter(r => !r.ativo).length;
  const aprendidas = lista.filter(r => r.origem === 'Aprendida').length;
  return `
    <div class="contador-kpis">
      <div class="kpi-card kpi-ok">
        <span class="kpi-label">Ativas</span>
        <span class="kpi-valor">${ativas}</span>
      </div>
      <div class="kpi-card kpi-info">
        <span class="kpi-label">Aprendidas</span>
        <span class="kpi-valor">${aprendidas}</span>
      </div>
      <div class="kpi-card">
        <span class="kpi-label">Inativas</span>
        <span class="kpi-valor">${inativas}</span>
      </div>
      <div class="kpi-card">
        <span class="kpi-label">Total</span>
        <span class="kpi-valor">${lista.length}</span>
      </div>
    </div>
  `;
}

function filtrosRegras() {
  return `
    <div class="contador-filtros">
      <select onchange="setFiltroRegras('prioridade', this.value)">
        <option value="todas" ${filtroRegras.prioridade === 'todas' ? 'selected' : ''}>Todas as prioridades</option>
        ${[1,2,3,4,5,6,7,8].map(p => `<option value="${p}" ${filtroRegras.prioridade === String(p) ? 'selected' : ''}>Prioridade ${p}</option>`).join('')}
      </select>
      <select onchange="setFiltroRegras('origem', this.value)">
        <option value="todas" ${filtroRegras.origem === 'todas' ? 'selected' : ''}>Todas as origens</option>
        <option value="Manual" ${filtroRegras.origem === 'Manual' ? 'selected' : ''}>Manual</option>
        <option value="Aprendida" ${filtroRegras.origem === 'Aprendida' ? 'selected' : ''}>Aprendida</option>
      </select>
      <select onchange="setFiltroRegras('ativo', this.value)">
        <option value="todos" ${filtroRegras.ativo === 'todos' ? 'selected' : ''}>Todas</option>
        <option value="ativas" ${filtroRegras.ativo === 'ativas' ? 'selected' : ''}>Só ativas</option>
        <option value="inativas" ${filtroRegras.ativo === 'inativas' ? 'selected' : ''}>Só inativas</option>
      </select>
      <input type="text" placeholder="Buscar descrição/contexto..."
             value="${filtroRegras.busca}"
             oninput="setFiltroRegras('busca', this.value)">
    </div>
  `;
}

function setFiltroRegras(campo, valor) {
  filtroRegras[campo] = valor;
  document.getElementById('content').innerHTML = screens['regras-classificacao']();
}

function filtrarRegras(lista) {
  return lista.filter(r => {
    if (filtroRegras.prioridade !== 'todas' && String(r.prioridade) !== filtroRegras.prioridade) return false;
    if (filtroRegras.origem !== 'todas' && r.origem !== filtroRegras.origem) return false;
    if (filtroRegras.ativo === 'ativas' && !r.ativo) return false;
    if (filtroRegras.ativo === 'inativas' && r.ativo) return false;
    if (filtroRegras.busca) {
      const b = filtroRegras.busca.toLowerCase();
      if (!r.descricao.toLowerCase().includes(b) && !r.contexto.toLowerCase().includes(b)) return false;
    }
    return true;
  }).sort((a, b) => a.prioridade - b.prioridade);
}

function linhaRegra(r) {
  return `
    <tr class="${r.ativo ? '' : 'inativa'}">
      <td><span class="badge badge-prioridade">${r.prioridade}</span></td>
      <td><strong>${r.descricao}</strong></td>
      <td class="muted">${r.contexto}</td>
      <td><code>${r.contaDestino}</code> — ${descricaoConta(r.contaDestino)}</td>
      <td>${r.origem === 'Aprendida' ? '<span class="badge badge-confianca-alta">aprendida</span>' : '<span class="badge badge-info">manual</span>'}</td>
      <td>${r.usos}</td>
      <td>${r.ativo ? '<span class="badge badge-status-concluida">ativa</span>' : '<span class="badge badge-status-cancelada">inativa</span>'}</td>
      <td>
        <div class="acoes-linha">
          <button class="btn-sm" onclick="editarRegra(${r.id})">Editar</button>
          <button class="btn-sm" onclick="toggleRegra(${r.id})">${r.ativo ? 'Desativar' : 'Ativar'}</button>
          <button class="btn-sm" onclick="testarRegra(${r.id})">Testar</button>
        </div>
      </td>
    </tr>
  `;
}

function novaRegra() {
  alert('No wireframe, a criação de regra é feita via modal (a implementar).');
}

function editarRegra(id) {
  const r = regrasClassificacao.find(x => x.id === id);
  if (!r) return;
  const nova = prompt(`Descrição da regra #${id}:`, r.descricao);
  if (!nova) return;
  r.descricao = nova;
  showScreen('regras-classificacao');
}

function toggleRegra(id) {
  const r = regrasClassificacao.find(x => x.id === id);
  if (!r) return;
  r.ativo = !r.ativo;
  showScreen('regras-classificacao');
}

function testarRegra(id) {
  const r = regrasClassificacao.find(x => x.id === id);
  if (!r) return;
  alert(`Teste da regra #${id}:\n\nContexto: ${r.contexto}\nConta destino: ${r.contaDestino}\n\nSimulação: a regra seria aplicada a lançamentos com este contexto.`);
}