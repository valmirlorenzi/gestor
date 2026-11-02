/* ============================================================
   TABELAS BASAIS — Financeiro1 (7.1) e Financeiro2 (8.1)
   Tela única que se adapta ao ator logado.
   - Financeiro1: formas/condições de PAGAMENTO
   - Financeiro2: formas/condições de RECEBIMENTO
   Contas bancárias e bancos são compartilhados.
   ============================================================ */

screens['tabelas-basais-fin1'] = () => renderTabelasBasais('financeiro1');
screens['tabelas-basais-fin2'] = () => renderTabelasBasais('financeiro2');

function renderTabelasBasais(ator) {
  const isFin1 = ator === 'financeiro1';
  const titulo = isFin1 ? 'Tabelas basais — Contas a Pagar' : 'Tabelas basais — Contas a Receber';
  const abaAtiva = isFin1 ? abaTabelaBasalFin1 : abaTabelaBasalFin2;

  const tabs = [
    { id: 'formas', label: isFin1 ? 'Formas de pagamento' : 'Formas de recebimento' },
    { id: 'condicoes', label: isFin1 ? 'Condições de pagamento' : 'Condições de recebimento' },
    { id: 'contas', label: 'Contas bancárias' },
    { id: 'bancos', label: 'Bancos' },
  ];

  return `
    <div class="contador-header">
      <h1>${titulo}</h1>
      <span class="badge badge-status-pendente">${ator}</span>
    </div>
    <p class="subtitle">Tabelas de apoio usadas no dia a dia do financeiro</p>

    <div class="tabs">
      ${tabs.map(t => `
        <button class="tab ${abaAtiva === t.id ? 'active' : ''}"
                onclick="setAbaTabelaBasal('${ator}', '${t.id}')">
          ${t.label}
        </button>
      `).join('')}
    </div>

    <div class="tab-conteudo">
      ${abaAtiva === 'formas' ? abaFormas(ator) : ''}
      ${abaAtiva === 'condicoes' ? abaCondicoes(ator) : ''}
      ${abaAtiva === 'contas' ? abaContasBancarias(ator) : ''}
      ${abaAtiva === 'bancos' ? abaBancos(ator) : ''}
    </div>
  `;
}

function setAbaTabelaBasal(ator, aba) {
  if (ator === 'financeiro1') abaTabelaBasalFin1 = aba;
  else abaTabelaBasalFin2 = aba;
  const rota = ator === 'financeiro1' ? 'tabelas-basais-fin1' : 'tabelas-basais-fin2';
  document.getElementById('content').innerHTML = screens[rota]();
}

// ============================================================
// ABA: FORMAS DE PAGAMENTO / RECEBIMENTO
// ============================================================

function abaFormas(ator) {
  const isFin1 = ator === 'financeiro1';
  const lista = isFin1 ? formasPagamento : formasRecebimento;
  const filtrados = filtrarFormas(lista);
  const titulo = isFin1 ? 'Formas de pagamento' : 'Formas de recebimento';

  return `
    <div class="card">
      <div class="contador-header">
        <h2>${titulo}</h2>
        <button class="btn btn-primary" onclick="novaForma('${ator}')">+ Nova forma</button>
      </div>
      ${filtrosFormas()}
      <table class="data data-regras">
        <thead><tr><th>Descrição</th><th>Status</th><th></th></tr></thead>
        <tbody>
          ${filtrados.map(f => `
            <tr class="${f.ativo ? '' : 'inativa'}">
              <td><strong>${f.descricao}</strong></td>
              <td>${f.ativo ? '<span class="badge badge-status-concluida">ativa</span>' : '<span class="badge badge-status-cancelada">inativa</span>'}</td>
              <td>
                <div class="acoes-linha">
                  <button class="btn-sm" onclick="editarForma('${ator}', ${f.id})">Editar</button>
                  <button class="btn-sm" onclick="toggleForma('${ator}', ${f.id})">${f.ativo ? 'Desativar' : 'Ativar'}</button>
                </div>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function filtrosFormas() {
  return `
    <div class="contador-filtros">
      <select onchange="setFiltroFormas('ativo', this.value)">
        <option value="todos" ${filtroFormas.ativo === 'todos' ? 'selected' : ''}>Todas</option>
        <option value="ativas" ${filtroFormas.ativo === 'ativas' ? 'selected' : ''}>Só ativas</option>
        <option value="inativas" ${filtroFormas.ativo === 'inativas' ? 'selected' : ''}>Só inativas</option>
      </select>
      <input type="text" placeholder="Buscar..."
             value="${filtroFormas.busca}"
             oninput="setFiltroFormas('busca', this.value)">
    </div>
  `;
}

function setFiltroFormas(campo, valor) {
  filtroFormas[campo] = valor;
  const ator = getAtorTabelaBasalAtual();
  const rota = ator === 'financeiro1' ? 'tabelas-basais-fin1' : 'tabelas-basais-fin2';
  document.getElementById('content').innerHTML = screens[rota]();
}

function filtrarFormas(lista) {
  return lista.filter(f => {
    if (filtroFormas.ativo === 'ativas' && !f.ativo) return false;
    if (filtroFormas.ativo === 'inativas' && f.ativo) return false;
    if (filtroFormas.busca) {
      const b = filtroFormas.busca.toLowerCase();
      if (!f.descricao.toLowerCase().includes(b)) return false;
    }
    return true;
  });
}

function getAtorTabelaBasalAtual() {
  // Descobre qual aba está ativa para saber quem é o ator
  return abaTabelaBasalFin1 !== undefined && window.__tabelaBasalAtor === 'financeiro1' ? 'financeiro1' : 'financeiro2';
}

function novaForma(ator) {
  const descricao = prompt('Descrição da nova forma:');
  if (!descricao) return;
  const lista = ator === 'financeiro1' ? formasPagamento : formasRecebimento;
  const novoId = Math.max(0, ...lista.map(f => f.id)) + 1;
  lista.push({ id: novoId, descricao, ativo: true });
  const rota = ator === 'financeiro1' ? 'tabelas-basais-fin1' : 'tabelas-basais-fin2';
  document.getElementById('content').innerHTML = screens[rota]();
}

function editarForma(ator, id) {
  const lista = ator === 'financeiro1' ? formasPagamento : formasRecebimento;
  const f = lista.find(x => x.id === id);
  if (!f) return;
  const nova = prompt('Nova descrição:', f.descricao);
  if (!nova) return;
  f.descricao = nova;
  const rota = ator === 'financeiro1' ? 'tabelas-basais-fin1' : 'tabelas-basais-fin2';
  document.getElementById('content').innerHTML = screens[rota]();
}

function toggleForma(ator, id) {
  const lista = ator === 'financeiro1' ? formasPagamento : formasRecebimento;
  const f = lista.find(x => x.id === id);
  if (!f) return;
  f.ativo = !f.ativo;
  const rota = ator === 'financeiro1' ? 'tabelas-basais-fin1' : 'tabelas-basais-fin2';
  document.getElementById('content').innerHTML = screens[rota]();
}

// ============================================================
// ABA: CONDIÇÕES DE PAGAMENTO / RECEBIMENTO
// ============================================================

function abaCondicoes(ator) {
  const isFin1 = ator === 'financeiro1';
  const lista = isFin1 ? condicoesPagamento : condicoesRecebimento;
  const filtrados = filtrarCondicoes(lista);
  const titulo = isFin1 ? 'Condições de pagamento' : 'Condições de recebimento';

  return `
    <div class="card">
      <div class="contador-header">
        <h2>${titulo}</h2>
        <button class="btn btn-primary" onclick="novaCondicao('${ator}')">+ Nova condição</button>
      </div>
      ${filtrosCondicoes()}
      <table class="data data-regras">
        <thead><tr><th>Descrição</th><th>Parcelas</th><th>Intervalo</th><th>Status</th><th></th></tr></thead>
        <tbody>
          ${filtrados.map(c => `
            <tr class="${c.ativo ? '' : 'inativa'}">
              <td><strong>${c.descricao}</strong></td>
              <td>${c.numeroParcelas}x</td>
              <td>${c.intervaloDias === 0 ? '—' : c.intervaloDias + ' dias'}</td>
              <td>${c.ativo ? '<span class="badge badge-status-concluida">ativa</span>' : '<span class="badge badge-status-cancelada">inativa</span>'}</td>
              <td>
                <div class="acoes-linha">
                  <button class="btn-sm" onclick="editarCondicao('${ator}', ${c.id})">Editar</button>
                  <button class="btn-sm" onclick="toggleCondicao('${ator}', ${c.id})">${c.ativo ? 'Desativar' : 'Ativar'}</button>
                </div>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function filtrosCondicoes() {
  return `
    <div class="contador-filtros">
      <select onchange="setFiltroCondicoes('ativo', this.value)">
        <option value="todos" ${filtroCondicoes.ativo === 'todos' ? 'selected' : ''}>Todas</option>
        <option value="ativas" ${filtroCondicoes.ativo === 'ativas' ? 'selected' : ''}>Só ativas</option>
        <option value="inativas" ${filtroCondicoes.ativo === 'inativas' ? 'selected' : ''}>Só inativas</option>
      </select>
      <input type="text" placeholder="Buscar..."
             value="${filtroCondicoes.busca}"
             oninput="setFiltroCondicoes('busca', this.value)">
    </div>
  `;
}

function setFiltroCondicoes(campo, valor) {
  filtroCondicoes[campo] = valor;
  const ator = getAtorTabelaBasalAtual();
  const rota = ator === 'financeiro1' ? 'tabelas-basais-fin1' : 'tabelas-basais-fin2';
  document.getElementById('content').innerHTML = screens[rota]();
}

function filtrarCondicoes(lista) {
  return lista.filter(c => {
    if (filtroCondicoes.ativo === 'ativas' && !c.ativo) return false;
    if (filtroCondicoes.ativo === 'inativas' && c.ativo) return false;
    if (filtroCondicoes.busca) {
      const b = filtroCondicoes.busca.toLowerCase();
      if (!c.descricao.toLowerCase().includes(b)) return false;
    }
    return true;
  });
}

function novaCondicao(ator) {
  const descricao = prompt('Descrição da nova condição:');
  if (!descricao) return;
  const parcelas = parseInt(prompt('Número de parcelas:', '1')) || 1;
  const intervalo = parseInt(prompt('Intervalo entre parcelas (dias):', '30')) || 30;
  const lista = ator === 'financeiro1' ? condicoesPagamento : condicoesRecebimento;
  const novoId = Math.max(0, ...lista.map(c => c.id)) + 1;
  lista.push({ id: novoId, descricao, numeroParcelas: parcelas, intervaloDias: intervalo, ativo: true });
  const rota = ator === 'financeiro1' ? 'tabelas-basais-fin1' : 'tabelas-basais-fin2';
  document.getElementById('content').innerHTML = screens[rota]();
}

function editarCondicao(ator, id) {
  const lista = ator === 'financeiro1' ? condicoesPagamento : condicoesRecebimento;
  const c = lista.find(x => x.id === id);
  if (!c) return;
  const nova = prompt('Nova descrição:', c.descricao);
  if (!nova) return;
  c.descricao = nova;
  const rota = ator === 'financeiro1' ? 'tabelas-basais-fin1' : 'tabelas-basais-fin2';
  document.getElementById('content').innerHTML = screens[rota]();
}

function toggleCondicao(ator, id) {
  const lista = ator === 'financeiro1' ? condicoesPagamento : condicoesRecebimento;
  const c = lista.find(x => x.id === id);
  if (!c) return;
  c.ativo = !c.ativo;
  const rota = ator === 'financeiro1' ? 'tabelas-basais-fin1' : 'tabelas-basais-fin2';
  document.getElementById('content').innerHTML = screens[rota]();
}

// ============================================================
// ABA: CONTAS BANCÁRIAS (compartilhada)
// ============================================================

function abaContasBancarias(ator) {
  const filtrados = filtrarContasBancarias(contasBancarias);

  return `
    <div class="card">
      <div class="contador-header">
        <h2>Contas bancárias</h2>
        <button class="btn btn-primary" onclick="novaContaBancaria('${ator}')">+ Nova conta</button>
      </div>
      <p class="muted" style="margin-bottom:10px;">Contas compartilhadas entre pagamentos e recebimentos.</p>
      ${filtrosContasBancarias()}
      <table class="data data-regras">
        <thead><tr><th>Banco</th><th>Agência</th><th>Número</th><th>Tipo</th><th>Saldo inicial</th><th>Status</th><th></th></tr></thead>
        <tbody>
          ${filtrados.map(c => `
            <tr class="${c.ativo ? '' : 'inativa'}">
              <td><strong>${c.banco}</strong></td>
              <td>${c.agencia}</td>
              <td>${c.numero}</td>
              <td>${c.tipo}</td>
              <td>${formatarMoeda(c.saldoInicial)}</td>
              <td>${c.ativo ? '<span class="badge badge-status-concluida">ativa</span>' : '<span class="badge badge-status-cancelada">inativa</span>'}</td>
              <td>
                <div class="acoes-linha">
                  <button class="btn-sm" onclick="editarContaBancaria('${ator}', ${c.id})">Editar</button>
                  <button class="btn-sm" onclick="toggleContaBancaria('${ator}', ${c.id})">${c.ativo ? 'Desativar' : 'Ativar'}</button>
                </div>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function filtrosContasBancarias() {
  return `
    <div class="contador-filtros">
      <select onchange="setFiltroContasBancarias('ativo', this.value)">
        <option value="todos" ${filtroContasBancarias.ativo === 'todos' ? 'selected' : ''}>Todas</option>
        <option value="ativas" ${filtroContasBancarias.ativo === 'ativas' ? 'selected' : ''}>Só ativas</option>
        <option value="inativas" ${filtroContasBancarias.ativo === 'inativas' ? 'selected' : ''}>Só inativas</option>
      </select>
      <input type="text" placeholder="Buscar banco/agência..."
             value="${filtroContasBancarias.busca}"
             oninput="setFiltroContasBancarias('busca', this.value)">
    </div>
  `;
}

function setFiltroContasBancarias(campo, valor) {
  filtroContasBancarias[campo] = valor;
  const ator = getAtorTabelaBasalAtual();
  const rota = ator === 'financeiro1' ? 'tabelas-basais-fin1' : 'tabelas-basais-fin2';
  document.getElementById('content').innerHTML = screens[rota]();
}

function filtrarContasBancarias(lista) {
  return lista.filter(c => {
    if (filtroContasBancarias.ativo === 'ativas' && !c.ativo) return false;
    if (filtroContasBancarias.ativo === 'inativas' && c.ativo) return false;
    if (filtroContasBancarias.busca) {
      const b = filtroContasBancarias.busca.toLowerCase();
      if (!c.banco.toLowerCase().includes(b) && !c.agencia.toLowerCase().includes(b)) return false;
    }
    return true;
  });
}

function novaContaBancaria(ator) {
  const bancoNome = prompt('Nome do banco (ex: Banco do Brasil):');
  if (!bancoNome) return;
  const agencia = prompt('Agência:');
  const numero = prompt('Número da conta:');
  const tipo = prompt('Tipo (Corrente/Poupança/Caixa):', 'Corrente') || 'Corrente';
  const banco = bancos.find(b => b.nome.toLowerCase() === bancoNome.toLowerCase());
  const novoId = Math.max(0, ...contasBancarias.map(c => c.id)) + 1;
  contasBancarias.push({ id: novoId, idBanco: banco ? banco.id : null, banco: banco ? banco.nome : bancoNome, agencia, numero, tipo, saldoInicial: 0, ativo: true });
  const rota = ator === 'financeiro1' ? 'tabelas-basais-fin1' : 'tabelas-basais-fin2';
  document.getElementById('content').innerHTML = screens[rota]();
}

function editarContaBancaria(ator, id) {
  const c = contasBancarias.find(x => x.id === id);
  if (!c) return;
  const nova = prompt('Nova agência:', c.agencia);
  if (!nova) return;
  c.agencia = nova;
  const rota = ator === 'financeiro1' ? 'tabelas-basais-fin1' : 'tabelas-basais-fin2';
  document.getElementById('content').innerHTML = screens[rota]();
}

function toggleContaBancaria(ator, id) {
  const c = contasBancarias.find(x => x.id === id);
  if (!c) return;
  c.ativo = !c.ativo;
  const rota = ator === 'financeiro1' ? 'tabelas-basais-fin1' : 'tabelas-basais-fin2';
  document.getElementById('content').innerHTML = screens[rota]();
}

// ============================================================
// ABA: BANCOS (referência — cadastrados pelo Configurador)
// ============================================================

function abaBancos(ator) {
  const filtrados = filtrarBancos(bancos);

  return `
    <div class="card">
      <h2>Bancos</h2>
      <p class="muted" style="margin-bottom:10px;">Tabela de referência (cadastrada pelo Configurador). Consulta apenas.</p>
      ${filtrosBancos()}
      <table class="data data-regras">
        <thead><tr><th>Código</th><th>Nome</th><th>Status</th></tr></thead>
        <tbody>
          ${filtrados.map(b => `
            <tr class="${b.ativo ? '' : 'inativa'}">
              <td><code>${b.codigo}</code></td>
              <td><strong>${b.nome}</strong></td>
              <td>${b.ativo ? '<span class="badge badge-status-concluida">ativo</span>' : '<span class="badge badge-status-cancelada">inativo</span>'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function filtrosBancos() {
  return `
    <div class="contador-filtros">
      <select onchange="setFiltroBancos('ativo', this.value)">
        <option value="todos" ${filtroBancos.ativo === 'todos' ? 'selected' : ''}>Todos</option>
        <option value="ativos" ${filtroBancos.ativo === 'ativos' ? 'selected' : ''}>Só ativos</option>
        <option value="inativos" ${filtroBancos.ativo === 'inativos' ? 'selected' : ''}>Só inativos</option>
      </select>
      <input type="text" placeholder="Buscar código/nome..."
             value="${filtroBancos.busca}"
             oninput="setFiltroBancos('busca', this.value)">
    </div>
  `;
}

function setFiltroBancos(campo, valor) {
  filtroBancos[campo] = valor;
  const ator = getAtorTabelaBasalAtual();
  const rota = ator === 'financeiro1' ? 'tabelas-basais-fin1' : 'tabelas-basais-fin2';
  document.getElementById('content').innerHTML = screens[rota]();
}

function filtrarBancos(lista) {
  return lista.filter(b => {
    if (filtroBancos.ativo === 'ativos' && !b.ativo) return false;
    if (filtroBancos.ativo === 'inativos' && b.ativo) return false;
    if (filtroBancos.busca) {
      const busca = filtroBancos.busca.toLowerCase();
      if (!b.codigo.includes(busca) && !b.nome.toLowerCase().includes(busca)) return false;
    }
    return true;
  });
}