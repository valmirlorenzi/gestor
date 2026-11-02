/* ============================================================
   TABELAS BASAIS — Comprador (5.1) e Faturista (6.1)
   Tela única, adaptada pelo ator.
   - Comprador: categorias de fornecedor, tipos de fornecedor, prazos de pagamento
   - Faturista: tipos de cliente, prazos de recebimento
   ============================================================ */

screens['tabelas-basais-comprador'] = () => renderTabelasBasaisComprasVendas('comprador');
screens['tabelas-basais-faturista'] = () => renderTabelasBasaisComprasVendas('faturista');

function renderTabelasBasaisComprasVendas(ator) {
  const isComprador = ator === 'comprador';
  const titulo = isComprador ? 'Tabelas basais — Compras' : 'Tabelas basais — Vendas';
  const abaAtiva = isComprador ? abaTabelaBasalCompras : abaTabelaBasalVendas;

  const tabs = isComprador
    ? [
        { id: 'categorias', label: 'Categorias de fornecedor' },
        { id: 'tiposFornecedor', label: 'Tipos de fornecedor' },
        { id: 'prazos', label: 'Prazos de pagamento' },
      ]
    : [
        { id: 'tiposCliente', label: 'Tipos de cliente' },
        { id: 'prazos', label: 'Prazos de recebimento' },
      ];

  return `
    <div class="contador-header">
      <h1>${titulo}</h1>
      <span class="badge badge-status-pendente">${ator}</span>
    </div>
    <p class="subtitle">Tabelas de apoio usadas no dia a dia de ${isComprador ? 'compras' : 'vendas'}</p>

    <div class="tabs">
      ${tabs.map(t => `
        <button class="tab ${abaAtiva === t.id ? 'active' : ''}"
                onclick="setAbaTabelaBasalComprasVendas('${ator}', '${t.id}')">
          ${t.label}
        </button>
      `).join('')}
    </div>

    <div class="tab-conteudo">
      ${isComprador && abaAtiva === 'categorias' ? abaCategoriasFornecedor() : ''}
      ${isComprador && abaAtiva === 'tiposFornecedor' ? abaTiposFornecedor() : ''}
      ${isComprador && abaAtiva === 'prazos' ? abaPrazosCompras() : ''}
      ${!isComprador && abaAtiva === 'tiposCliente' ? abaTiposCliente() : ''}
      ${!isComprador && abaAtiva === 'prazos' ? abaPrazosVendas() : ''}
    </div>
  `;
}

function setAbaTabelaBasalComprasVendas(ator, aba) {
  if (ator === 'comprador') abaTabelaBasalCompras = aba;
  else abaTabelaBasalVendas = aba;
  const rota = ator === 'comprador' ? 'tabelas-basais-comprador' : 'tabelas-basais-faturista';
  document.getElementById('content').innerHTML = screens[rota]();
}

// ============================================================
// COMPRADOR — CATEGORIAS DE FORNECEDOR
// ============================================================

function abaCategoriasFornecedor() {
  const filtrados = filtrarTabela(categoriasFornecedor);
  return `
    <div class="card">
      <div class="contador-header">
        <h2>Categorias de fornecedor</h2>
        <button class="btn btn-primary" onclick="novaCategoriaFornecedor()">+ Nova categoria</button>
      </div>
      <p class="muted" style="margin-bottom:12px;">As categorias alimentam o motor de classificação (D1, prioridade 3).</p>
      ${filtrosTabela('comprador')}
      <table class="data data-regras">
        <thead><tr><th>Descrição</th><th>Usos</th><th>Status</th><th></th></tr></thead>
        <tbody>
          ${filtrados.map(c => `
            <tr class="${c.ativo ? '' : 'inativa'}">
              <td><strong>${c.descricao}</strong></td>
              <td>${c.usos}</td>
              <td>${c.ativo ? '<span class="badge badge-status-concluida">ativa</span>' : '<span class="badge badge-status-cancelada">inativa</span>'}</td>
              <td>
                <div class="acoes-linha">
                  <button class="btn-sm" onclick="editarCategoriaFornecedor(${c.id})">Editar</button>
                  <button class="btn-sm" onclick="toggleCategoriaFornecedor(${c.id})">${c.ativo ? 'Desativar' : 'Ativar'}</button>
                </div>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function novaCategoriaFornecedor() {
  const desc = prompt('Descrição da nova categoria:');
  if (!desc) return;
  const novoId = Math.max(0, ...categoriasFornecedor.map(c => c.id)) + 1;
  categoriasFornecedor.push({ id: novoId, descricao: desc, ativo: true, usos: 0 });
  showScreen('tabelas-basais-comprador');
}

function editarCategoriaFornecedor(id) {
  const c = categoriasFornecedor.find(x => x.id === id);
  if (!c) return;
  const nova = prompt('Nova descrição:', c.descricao);
  if (!nova) return;
  c.descricao = nova;
  showScreen('tabelas-basais-comprador');
}

function toggleCategoriaFornecedor(id) {
  const c = categoriasFornecedor.find(x => x.id === id);
  if (!c) return;
  c.ativo = !c.ativo;
  showScreen('tabelas-basais-comprador');
}

// ============================================================
// COMPRADOR — TIPOS DE FORNECEDOR
// ============================================================

function abaTiposFornecedor() {
  const filtrados = filtrarTabela(tiposFornecedor);
  return `
    <div class="card">
      <div class="contador-header">
        <h2>Tipos de fornecedor</h2>
        <button class="btn btn-primary" onclick="novoTipoFornecedor()">+ Novo tipo</button>
      </div>
      ${filtrosTabela('comprador')}
      <table class="data data-regras">
        <thead><tr><th>Descrição</th><th>Status</th><th></th></tr></thead>
        <tbody>
          ${filtrados.map(t => `
            <tr class="${t.ativo ? '' : 'inativa'}">
              <td><strong>${t.descricao}</strong></td>
              <td>${t.ativo ? '<span class="badge badge-status-concluida">ativo</span>' : '<span class="badge badge-status-cancelada">inativo</span>'}</td>
              <td>
                <div class="acoes-linha">
                  <button class="btn-sm" onclick="editarTipoFornecedor(${t.id})">Editar</button>
                  <button class="btn-sm" onclick="toggleTipoFornecedor(${t.id})">${t.ativo ? 'Desativar' : 'Ativar'}</button>
                </div>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function novoTipoFornecedor() {
  const desc = prompt('Descrição do novo tipo:');
  if (!desc) return;
  const novoId = Math.max(0, ...tiposFornecedor.map(t => t.id)) + 1;
  tiposFornecedor.push({ id: novoId, descricao: desc, ativo: true });
  showScreen('tabelas-basais-comprador');
}

function editarTipoFornecedor(id) {
  const t = tiposFornecedor.find(x => x.id === id);
  if (!t) return;
  const nova = prompt('Nova descrição:', t.descricao);
  if (!nova) return;
  t.descricao = nova;
  showScreen('tabelas-basais-comprador');
}

function toggleTipoFornecedor(id) {
  const t = tiposFornecedor.find(x => x.id === id);
  if (!t) return;
  t.ativo = !t.ativo;
  showScreen('tabelas-basais-comprador');
}

// ============================================================
// COMPRADOR — PRAZOS DE PAGAMENTO
// ============================================================

function abaPrazosCompras() {
  const filtrados = filtrarTabela(prazosCompras);
  return `
    <div class="card">
      <div class="contador-header">
        <h2>Prazos de pagamento</h2>
        <button class="btn btn-primary" onclick="novoPrazoCompras()">+ Novo prazo</button>
      </div>
      ${filtrosTabela('comprador')}
      <table class="data data-regras">
        <thead><tr><th>Descrição</th><th>Dias</th><th>Parcelas</th><th>Status</th><th></th></tr></thead>
        <tbody>
          ${filtrados.map(p => `
            <tr class="${p.ativo ? '' : 'inativa'}">
              <td><strong>${p.descricao}</strong></td>
              <td>${p.dias}</td>
              <td>${p.parcelas || 1}x</td>
              <td>${p.ativo ? '<span class="badge badge-status-concluida">ativo</span>' : '<span class="badge badge-status-cancelada">inativo</span>'}</td>
              <td>
                <div class="acoes-linha">
                  <button class="btn-sm" onclick="editarPrazoCompras(${p.id})">Editar</button>
                  <button class="btn-sm" onclick="togglePrazoCompras(${p.id})">${p.ativo ? 'Desativar' : 'Ativar'}</button>
                </div>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function novoPrazoCompras() {
  const desc = prompt('Descrição do novo prazo:');
  if (!desc) return;
  const dias = parseInt(prompt('Dias:', '30')) || 30;
  const parcelas = parseInt(prompt('Parcelas:', '1')) || 1;
  const novoId = Math.max(0, ...prazosCompras.map(p => p.id)) + 1;
  prazosCompras.push({ id: novoId, descricao: desc, dias, parcelas, ativo: true });
  showScreen('tabelas-basais-comprador');
}

function editarPrazoCompras(id) {
  const p = prazosCompras.find(x => x.id === id);
  if (!p) return;
  const nova = prompt('Nova descrição:', p.descricao);
  if (!nova) return;
  p.descricao = nova;
  showScreen('tabelas-basais-comprador');
}

function togglePrazoCompras(id) {
  const p = prazosCompras.find(x => x.id === id);
  if (!p) return;
  p.ativo = !p.ativo;
  showScreen('tabelas-basais-comprador');
}

// ============================================================
// FATURISTA — TIPOS DE CLIENTE
// ============================================================

function abaTiposCliente() {
  const filtrados = filtrarTabela(tiposCliente);
  return `
    <div class="card">
      <div class="contador-header">
        <h2>Tipos de cliente</h2>
        <button class="btn btn-primary" onclick="novoTipoCliente()">+ Novo tipo</button>
      </div>
      ${filtrosTabela('faturista')}
      <table class="data data-regras">
        <thead><tr><th>Descrição</th><th>Usos</th><th>Status</th><th></th></tr></thead>
        <tbody>
          ${filtrados.map(t => `
            <tr class="${t.ativo ? '' : 'inativa'}">
              <td><strong>${t.descricao}</strong></td>
              <td>${t.usos}</td>
              <td>${t.ativo ? '<span class="badge badge-status-concluida">ativo</span>' : '<span class="badge badge-status-cancelada">inativo</span>'}</td>
              <td>
                <div class="acoes-linha">
                  <button class="btn-sm" onclick="editarTipoCliente(${t.id})">Editar</button>
                  <button class="btn-sm" onclick="toggleTipoCliente(${t.id})">${t.ativo ? 'Desativar' : 'Ativar'}</button>
                </div>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function novoTipoCliente() {
  const desc = prompt('Descrição do novo tipo:');
  if (!desc) return;
  const novoId = Math.max(0, ...tiposCliente.map(t => t.id)) + 1;
  tiposCliente.push({ id: novoId, descricao: desc, ativo: true, usos: 0 });
  showScreen('tabelas-basais-faturista');
}

function editarTipoCliente(id) {
  const t = tiposCliente.find(x => x.id === id);
  if (!t) return;
  const nova = prompt('Nova descrição:', t.descricao);
  if (!nova) return;
  t.descricao = nova;
  showScreen('tabelas-basais-faturista');
}

function toggleTipoCliente(id) {
  const t = tiposCliente.find(x => x.id === id);
  if (!t) return;
  t.ativo = !t.ativo;
  showScreen('tabelas-basais-faturista');
}

// ============================================================
// FATURISTA — PRAZOS DE RECEBIMENTO
// ============================================================

function abaPrazosVendas() {
  const filtrados = filtrarTabela(prazosVendas);
  return `
    <div class="card">
      <div class="contador-header">
        <h2>Prazos de recebimento</h2>
        <button class="btn btn-primary" onclick="novoPrazoVendas()">+ Novo prazo</button>
      </div>
      ${filtrosTabela('faturista')}
      <table class="data data-regras">
        <thead><tr><th>Descrição</th><th>Dias</th><th>Parcelas</th><th>Status</th><th></th></tr></thead>
        <tbody>
          ${filtrados.map(p => `
            <tr class="${p.ativo ? '' : 'inativa'}">
              <td><strong>${p.descricao}</strong></td>
              <td>${p.dias}</td>
              <td>${p.parcelas || 1}x</td>
              <td>${p.ativo ? '<span class="badge badge-status-concluida">ativo</span>' : '<span class="badge badge-status-cancelada">inativo</span>'}</td>
              <td>
                <div class="acoes-linha">
                  <button class="btn-sm" onclick="editarPrazoVendas(${p.id})">Editar</button>
                  <button class="btn-sm" onclick="togglePrazoVendas(${p.id})">${p.ativo ? 'Desativar' : 'Ativar'}</button>
                </div>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function novoPrazoVendas() {
  const desc = prompt('Descrição do novo prazo:');
  if (!desc) return;
  const dias = parseInt(prompt('Dias:', '30')) || 30;
  const parcelas = parseInt(prompt('Parcelas:', '1')) || 1;
  const novoId = Math.max(0, ...prazosVendas.map(p => p.id)) + 1;
  prazosVendas.push({ id: novoId, descricao: desc, dias, parcelas, ativo: true });
  showScreen('tabelas-basais-faturista');
}

function editarPrazoVendas(id) {
  const p = prazosVendas.find(x => x.id === id);
  if (!p) return;
  const nova = prompt('Nova descrição:', p.descricao);
  if (!nova) return;
  p.descricao = nova;
  showScreen('tabelas-basais-faturista');
}

function togglePrazoVendas(id) {
  const p = prazosVendas.find(x => x.id === id);
  if (!p) return;
  p.ativo = !p.ativo;
  showScreen('tabelas-basais-faturista');
}

// ============================================================
// FILTROS COMPARTILHADOS
// ============================================================

function filtrosTabela(ator) {
  const filtro = ator === 'comprador' ? filtroTabelasCompras : filtroTabelasVendas;
  return `
    <div class="contador-filtros">
      <select onchange="setFiltroTabela('${ator}', 'ativo', this.value)">
        <option value="todos" ${filtro.ativo === 'todos' ? 'selected' : ''}>Todas</option>
        <option value="ativas" ${filtro.ativo === 'ativas' ? 'selected' : ''}>Só ativas</option>
        <option value="inativas" ${filtro.ativo === 'inativas' ? 'selected' : ''}>Só inativas</option>
      </select>
      <input type="text" placeholder="Buscar..."
             value="${filtro.busca}"
             oninput="setFiltroTabela('${ator}', 'busca', this.value)">
    </div>
  `;
}

function setFiltroTabela(ator, campo, valor) {
  if (ator === 'comprador') filtroTabelasCompras[campo] = valor;
  else filtroTabelasVendas[campo] = valor;
  const rota = ator === 'comprador' ? 'tabelas-basais-comprador' : 'tabelas-basais-faturista';
  document.getElementById('content').innerHTML = screens[rota]();
}

function filtrarTabela(lista) {
  // Usa o filtro do ator atual (comprador ou faturista)
  const ator = (typeof USUARIO_ORDENS !== 'undefined' && USUARIO_ORDENS.ator === 'faturista') ? 'faturista' : 'comprador';
  const filtro = ator === 'comprador' ? filtroTabelasCompras : filtroTabelasVendas;
  return lista.filter(i => {
    if (filtro.ativo === 'ativas' && !i.ativo) return false;
    if (filtro.ativo === 'inativas' && i.ativo) return false;
    if (filtro.busca) {
      const b = filtro.busca.toLowerCase();
      if (!i.descricao.toLowerCase().includes(b)) return false;
    }
    return true;
  });
}