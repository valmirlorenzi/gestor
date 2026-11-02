/* ============================================================
   4.3 — CONFIGURAÇÕES CONTÁBEIS — A5
   Mapeamento referencial ECD/ECF
   ============================================================ */

screens['config-contabeis'] = () => {
  const filtrados = filtrarMapeamento(mapeamentoReferencial);

  return `
    <div class="contador-header">
      <h1>Configurações contábeis</h1>
      <span class="badge badge-info">ECD/ECF</span>
    </div>
    <p class="subtitle">Mapeamento das contas internas para o plano referencial da Receita Federal</p>

    ${kpisMapeamento(mapeamentoReferencial)}
    ${filtrosMapeamento()}

    <div class="card">
      <table class="data data-regras">
        <thead>
          <tr>
            <th>Conta interna</th>
            <th>Descrição</th>
            <th>Conta referencial</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          ${filtrados.map(m => linhaMapeamento(m)).join('')}
        </tbody>
      </table>
    </div>
  `;
};

function kpisMapeamento(lista) {
  const ok = lista.filter(m => m.status === 'ok').length;
  const pendente = lista.filter(m => m.status === 'pendente').length;
  return `
    <div class="contador-kpis">
      <div class="kpi-card kpi-ok">
        <span class="kpi-label">Mapeadas</span>
        <span class="kpi-valor">${ok}</span>
      </div>
      <div class="kpi-card kpi-aviso">
        <span class="kpi-label">Pendentes</span>
        <span class="kpi-valor">${pendente}</span>
      </div>
      <div class="kpi-card">
        <span class="kpi-label">Total</span>
        <span class="kpi-valor">${lista.length}</span>
      </div>
    </div>
  `;
}

function filtrosMapeamento() {
  return `
    <div class="contador-filtros">
      <select onchange="setFiltroMapeamento('status', this.value)">
        <option value="todos" ${filtroMapeamento.status === 'todos' ? 'selected' : ''}>Todos os status</option>
        <option value="ok" ${filtroMapeamento.status === 'ok' ? 'selected' : ''}>Mapeadas</option>
        <option value="pendente" ${filtroMapeamento.status === 'pendente' ? 'selected' : ''}>Pendentes</option>
      </select>
      <input type="text" placeholder="Buscar conta..."
             value="${filtroMapeamento.busca}"
             oninput="setFiltroMapeamento('busca', this.value)">
    </div>
  `;
}

function setFiltroMapeamento(campo, valor) {
  filtroMapeamento[campo] = valor;
  document.getElementById('content').innerHTML = screens['config-contabeis']();
}

function filtrarMapeamento(lista) {
  return lista.filter(m => {
    if (filtroMapeamento.status !== 'todos' && m.status !== filtroMapeamento.status) return false;
    if (filtroMapeamento.busca) {
      const b = filtroMapeamento.busca.toLowerCase();
      if (!m.contaInterna.includes(b) && !m.descricao.toLowerCase().includes(b) && !m.contaReferencial.includes(b)) return false;
    }
    return true;
  });
}

function linhaMapeamento(m) {
  return `
    <tr>
      <td><code>${m.contaInterna}</code></td>
      <td>${m.descricao}</td>
      <td><code>${m.contaReferencial || '—'}</code></td>
      <td>${m.status === 'ok' ? '<span class="badge badge-status-concluida">✓ ok</span>' : '<span class="badge badge-status-parcial">pendente</span>'}</td>
      <td>
        <div class="acoes-linha">
          <button class="btn-sm" onclick="editarMapeamento(${m.id})">Editar</button>
        </div>
      </td>
    </tr>
  `;
}

function editarMapeamento(id) {
  const m = mapeamentoReferencial.find(x => x.id === id);
  if (!m) return;
  const nova = prompt(`Conta referencial para "${m.descricao}" (atual: ${m.contaReferencial}):`, m.contaReferencial);
  if (nova === null) return;
  m.contaReferencial = nova;
  m.status = nova ? 'ok' : 'pendente';
  showScreen('config-contabeis');
}