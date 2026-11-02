/* ============================================================
   PROVENTOS E DESCONTOS (10.5) — Tabelas auxiliares de folha
   ============================================================ */

screens['tabelas-auxiliares'] = () => {
  const filtrados = filtrarProventosDescontos(proventosDescontos);

  return `
    <div class="contador-header">
      <h1>Proventos e Descontos</h1>
      <button class="btn btn-primary" onclick="novoProventoDesconto()">+ Novo</button>
    </div>
    <p class="subtitle">Tabelas auxiliares de folha — flags de incidência de INSS, FGTS e IRRF</p>

    ${kpisProventosDescontos(proventosDescontos)}
    ${filtrosProventosDescontos()}

    <div class="card">
      <table class="data data-regras">
        <thead>
          <tr>
            <th>Código</th>
            <th>Descrição</th>
            <th>Tipo</th>
            <th>INSS</th>
            <th>FGTS</th>
            <th>IRRF</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          ${filtrados.map(p => linhaProventoDesconto(p)).join('')}
        </tbody>
      </table>
    </div>
  `;
};

function kpisProventosDescontos(lista) {
  const proventos = lista.filter(p => p.tipo === 'Provento').length;
  const descontos = lista.filter(p => p.tipo === 'Desconto').length;
  const ativos = lista.filter(p => p.ativo).length;
  return `
    <div class="contador-kpis">
      <div class="kpi-card kpi-ok">
        <span class="kpi-label">Proventos</span>
        <span class="kpi-valor">${proventos}</span>
      </div>
      <div class="kpi-card kpi-erro">
        <span class="kpi-label">Descontos</span>
        <span class="kpi-valor">${descontos}</span>
      </div>
      <div class="kpi-card kpi-info">
        <span class="kpi-label">Ativos</span>
        <span class="kpi-valor">${ativos}</span>
      </div>
      <div class="kpi-card">
        <span class="kpi-label">Total</span>
        <span class="kpi-valor">${lista.length}</span>
      </div>
    </div>
  `;
}

function filtrosProventosDescontos() {
  return `
    <div class="contador-filtros">
      <select onchange="setFiltroProventosDescontos('tipo', this.value)">
        <option value="todos" ${filtroProventosDescontos.tipo === 'todos' ? 'selected' : ''}>Todos os tipos</option>
        <option value="Provento" ${filtroProventosDescontos.tipo === 'Provento' ? 'selected' : ''}>Proventos</option>
        <option value="Desconto" ${filtroProventosDescontos.tipo === 'Desconto' ? 'selected' : ''}>Descontos</option>
      </select>
      <select onchange="setFiltroProventosDescontos('ativo', this.value)">
        <option value="todos" ${filtroProventosDescontos.ativo === 'todos' ? 'selected' : ''}>Todos</option>
        <option value="ativos" ${filtroProventosDescontos.ativo === 'ativos' ? 'selected' : ''}>Só ativos</option>
        <option value="inativos" ${filtroProventosDescontos.ativo === 'inativos' ? 'selected' : ''}>Só inativos</option>
      </select>
      <input type="text" placeholder="Buscar código/descrição..."
             value="${filtroProventosDescontos.busca}"
             oninput="setFiltroProventosDescontos('busca', this.value)">
    </div>
  `;
}

function setFiltroProventosDescontos(campo, valor) {
  filtroProventosDescontos[campo] = valor;
  document.getElementById('content').innerHTML = screens['tabelas-auxiliares']();
}

function filtrarProventosDescontos(lista) {
  return lista.filter(p => {
    if (filtroProventosDescontos.tipo !== 'todos' && p.tipo !== filtroProventosDescontos.tipo) return false;
    if (filtroProventosDescontos.ativo === 'ativos' && !p.ativo) return false;
    if (filtroProventosDescontos.ativo === 'inativos' && p.ativo) return false;
    if (filtroProventosDescontos.busca) {
      const b = filtroProventosDescontos.busca.toLowerCase();
      if (!p.codigo.toLowerCase().includes(b) && !p.descricao.toLowerCase().includes(b)) return false;
    }
    return true;
  });
}

function linhaProventoDesconto(p) {
  return `
    <tr class="${p.ativo ? '' : 'inativa'}">
      <td><code>${p.codigo}</code></td>
      <td><strong>${p.descricao}</strong></td>
      <td><span class="badge ${p.tipo === 'Provento' ? 'badge-status-concluida' : 'badge-status-cancelada'}">${p.tipo}</span></td>
      <td>${p.entraINSS ? '<span class="badge badge-confianca-alta">✓</span>' : '<span class="muted">—</span>'}</td>
      <td>${p.entraFGTS ? '<span class="badge badge-confianca-alta">✓</span>' : '<span class="muted">—</span>'}</td>
      <td>${p.entraIRRF ? '<span class="badge badge-confianca-alta">✓</span>' : '<span class="muted">—</span>'}</td>
      <td>${p.ativo ? '<span class="badge badge-status-concluida">ativo</span>' : '<span class="badge badge-status-cancelada">inativo</span>'}</td>
      <td>
        <div class="acoes-linha">
          <button class="btn-sm" onclick="editarProventoDesconto(${p.id})">Editar</button>
          <button class="btn-sm" onclick="toggleProventoDesconto(${p.id})">${p.ativo ? 'Desativar' : 'Ativar'}</button>
        </div>
      </td>
    </tr>
  `;
}

function novoProventoDesconto() {
  const codigo = prompt('Código (ex: GRAT):');
  if (!codigo) return;
  const descricao = prompt('Descrição:');
  if (!descricao) return;
  const tipo = prompt('Tipo (Provento/Desconto):', 'Provento');
  if (!tipo || !['Provento', 'Desconto'].includes(tipo)) return;
  const entraINSS = confirm('Incide INSS?');
  const entraFGTS = confirm('Incide FGTS?');
  const entraIRRF = confirm('Incide IRRF?');
  const novoId = Math.max(0, ...proventosDescontos.map(p => p.id)) + 1;
  proventosDescontos.push({ id: novoId, codigo: codigo.toUpperCase(), descricao, tipo, entraINSS, entraFGTS, entraIRRF, ativo: true });
  showScreen('tabelas-auxiliares');
}

function editarProventoDesconto(id) {
  const p = proventosDescontos.find(x => x.id === id);
  if (!p) return;
  const nova = prompt('Nova descrição:', p.descricao);
  if (!nova) return;
  p.descricao = nova;
  showScreen('tabelas-auxiliares');
}

function toggleProventoDesconto(id) {
  const p = proventosDescontos.find(x => x.id === id);
  if (!p) return;
  p.ativo = !p.ativo;
  showScreen('tabelas-auxiliares');
}