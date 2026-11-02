/* ============================================================
   RELATÓRIO DE PENDÊNCIAS (T6)
   ============================================================ */

screens['pendencias'] = () => {
  const filtradas = filtrarPendencias(pendencias);

  return `
    <div class="contador-header">
      <h1>Relatório de Pendências</h1>
      <span class="badge badge-confianca-baixa">${pendencias.filter(p => p.categoria === 'Erro' && p.status === 'Aberta').length} erros</span>
    </div>
    <p class="subtitle">Tudo que precisa ser resolvido antes do fechamento</p>

    ${kpisPendencias(pendencias)}
    ${filtrosPendencias()}

    ${filtradas.length === 0
      ? '<div class="ordens-vazio"><div class="vazio-icon">✅</div><p>Nenhuma pendência.</p></div>'
      : filtradas.map(p => pendenciaItem(p)).join('')}
  `;
};

function kpisPendencias(lista) {
  const erros = lista.filter(p => p.categoria === 'Erro' && p.status === 'Aberta').length;
  const avisos = lista.filter(p => p.categoria === 'Aviso' && p.status === 'Aberta').length;
  const resolvidas = lista.filter(p => p.status === 'Resolvida').length;
  return `
    <div class="contador-kpis">
      <div class="kpi-card kpi-erro">
        <span class="kpi-label">Erros (bloqueiam)</span>
        <span class="kpi-valor">${erros}</span>
      </div>
      <div class="kpi-card kpi-aviso">
        <span class="kpi-label">Avisos</span>
        <span class="kpi-valor">${avisos}</span>
      </div>
      <div class="kpi-card kpi-ok">
        <span class="kpi-label">Resolvidas</span>
        <span class="kpi-valor">${resolvidas}</span>
      </div>
      <div class="kpi-card">
        <span class="kpi-label">Total</span>
        <span class="kpi-valor">${lista.length}</span>
      </div>
    </div>
  `;
}

function filtrosPendencias() {
  return `
    <div class="contador-filtros">
      <select onchange="setFiltroPendencias('categoria', this.value)">
        <option value="todas" ${filtroPendencias.categoria === 'todas' ? 'selected' : ''}>Todas as categorias</option>
        <option value="Erro" ${filtroPendencias.categoria === 'Erro' ? 'selected' : ''}>Erro</option>
        <option value="Aviso" ${filtroPendencias.categoria === 'Aviso' ? 'selected' : ''}>Aviso</option>
      </select>
      <select onchange="setFiltroPendencias('status', this.value)">
        <option value="todas" ${filtroPendencias.status === 'todas' ? 'selected' : ''}>Todos os status</option>
        <option value="Aberta" ${filtroPendencias.status === 'Aberta' ? 'selected' : ''}>Abertas</option>
        <option value="Resolvida" ${filtroPendencias.status === 'Resolvida' ? 'selected' : ''}>Resolvidas</option>
      </select>
      <input type="text" placeholder="Buscar descrição..."
             value="${filtroPendencias.busca}"
             oninput="setFiltroPendencias('busca', this.value)">
    </div>
  `;
}

function setFiltroPendencias(campo, valor) {
  filtroPendencias[campo] = valor;
  document.getElementById('content').innerHTML = screens['pendencias']();
}

function filtrarPendencias(lista) {
  return lista.filter(p => {
    if (filtroPendencias.categoria !== 'todas' && p.categoria !== filtroPendencias.categoria) return false;
    if (filtroPendencias.status !== 'todas' && p.status !== filtroPendencias.status) return false;
    if (filtroPendencias.busca) {
      const b = filtroPendencias.busca.toLowerCase();
      if (!p.descricao.toLowerCase().includes(b)) return false;
    }
    return true;
  }).sort((a, b) => {
    // Erros primeiro, depois Avisos
    if (a.categoria !== b.categoria) return a.categoria === 'Erro' ? -1 : 1;
    return new Date(a.dataCriacao) - new Date(b.dataCriacao);
  });
}

function pendenciaItem(p) {
  const classe = p.status === 'Resolvida' ? 'resolvida' : p.categoria === 'Erro' ? 'erro' : 'aviso';
  const icon = p.categoria === 'Erro' ? '🔴' : '🟡';
  return `
    <div class="pendencia-item ${classe}">
      <div class="p-icon">${icon}</div>
      <div class="p-conteudo">
        <div class="p-titulo">${p.categoria} · ${p.tipo}</div>
        <div class="p-descricao">${p.descricao}</div>
        <div class="p-meta">
          <span>📄 ${p.referencia}</span>
          <span>🕐 ${formatarData(p.dataCriacao)}</span>
          <span class="badge ${p.status === 'Resolvida' ? 'badge-status-concluida' : 'badge-status-pendente'}">${p.status}</span>
        </div>
      </div>
      ${p.status === 'Aberta' ? `
        <div class="acoes-linha">
          <button class="btn-sm" onclick="resolverPendencia(${p.id})">Resolver</button>
        </div>
      ` : ''}
    </div>
  `;
}

function resolverPendencia(id) {
  const p = pendencias.find(x => x.id === id);
  if (!p) return;
  if (p.categoria === 'Erro') {
    alert(`Para resolver o erro "${p.tipo}", vá até a tela correspondente:\n\n` +
      (p.tipo === 'Nao classificado' || p.tipo === 'Conflito de regras'
        ? '→ Revisão de Lançamentos (4.7)'
        : '→ Tela do documento'));
    return;
  }
  if (!confirm(`Marcar a pendência "${p.descricao}" como resolvida?`)) return;
  p.status = 'Resolvida';
  showScreen('pendencias');
}