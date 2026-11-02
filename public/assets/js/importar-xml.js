/* ============================================================
   IMPORTAR XML — Comprador (5.4) e Faturista (6.4)
   Tela única, adaptada pelo ator (entrada/saída).
   ============================================================ */

screens['importar-xml'] = () => {
  const ator = (typeof USUARIO_ORDENS !== 'undefined' && USUARIO_ORDENS.ator) || 'comprador';
  const direcao = ator === 'faturista' ? 'saida' : 'entrada';
  return renderImportacao(direcao);
};

function renderImportacao(direcao) {
  const isEntrada = direcao === 'entrada';
  const titulo = isEntrada ? 'Importar Notas de Entrada' : 'Importar Notas de Saída';
  const subtitulo = isEntrada
    ? 'NF-e, NFS-e tomada, CT-e tomado ou RPA'
    : 'NF-e, NFS-e prestada ou CT-e emitido';

  // Se já estamos em pré-validação, mostrar o relatório
  if (importacaoForm && importacaoForm.direcao === direcao && importacaoForm.etapa === 'pre-validacao') {
    return renderPreValidacao(direcao);
  }
  if (importacaoForm && importacaoForm.direcao === direcao && importacaoForm.etapa === 'resultado') {
    return renderResultadoImportacao(direcao);
  }

  // Tela inicial de upload
  return `
    <div class="contador-header">
      <h1>${titulo}</h1>
      <span class="badge badge-status-pendente">${isEntrada ? 'comprador' : 'faturista'}</span>
    </div>
    <p class="subtitle">${subtitulo}</p>

    ${kpisImportacao(direcao)}

    <div class="card">
      <h2>Selecione a pasta ou o arquivo</h2>
      <p class="muted" style="margin-bottom:14px;">
        Os XMLs são organizados por ano/mês. Selecione a pasta correspondente ao período aberto.
      </p>

      <div class="pastas-sugeridas">
        ${['2026/10', '2026/09', '2026/08'].map(p => `
          <div class="pasta-chip" onclick="selecionarPasta('${direcao}', '${p}')">
            📁 ${p}
          </div>
        `).join('')}
        <div class="pasta-chip" onclick="selecionarPastaIndividual('${direcao}')">
          📄 Arquivo individual
        </div>
      </div>

      <div class="upload-area" onclick="selecionarPastaIndividual('${direcao}')">
        <div class="ua-icon">📥</div>
        <div class="ua-titulo">Arraste XMLs aqui ou clique para selecionar</div>
        <div class="ua-descricao">Aceita .xml de NF-e, NFS-e, CT-e e RPA</div>
        <div class="ua-tipos">Tamanho máximo: 50 MB por arquivo</div>
      </div>
    </div>

    <div class="card">
      <h2>Histórico de importações</h2>
      <table class="data data-regras">
        <thead>
          <tr>
            <th>Data</th>
            <th>Tipo</th>
            <th>Pasta</th>
            <th style="text-align:right;">Total</th>
            <th style="text-align:right;">Aceitos</th>
            <th style="text-align:right;">Rejeitados</th>
            <th>Usuário</th>
          </tr>
        </thead>
        <tbody>
          ${historicoImportacoes
            .filter(h => h.direcao === direcao)
            .map(h => `
              <tr>
                <td>${formatarDataHora(h.data)}</td>
                <td><span class="badge badge-info">${h.tipo}</span></td>
                <td>${h.pasta}</td>
                <td style="text-align:right;">${h.total}</td>
                <td style="text-align:right; color:#51cf66;">${h.aceitos + h.aceitosComAviso}</td>
                <td style="text-align:right; color:#ff6b6b;">${h.rejeitados}</td>
                <td>${h.usuario}</td>
              </tr>
            `).join('') || '<tr><td colspan="7" class="muted" style="text-align:center;">Nenhuma importação anterior.</td></tr>'}
        </tbody>
      </table>
    </div>
  `;
}

// ============================================================
// KPIs
// ============================================================

function kpisImportacao(direcao) {
  const hist = historicoImportacoes.filter(h => h.direcao === direcao);
  const total = hist.reduce((s, h) => s + h.total, 0);
  const aceitos = hist.reduce((s, h) => s + h.aceitos + h.aceitosComAviso, 0);
  const rejeitados = hist.reduce((s, h) => s + h.rejeitados, 0);
  return `
    <div class="contador-kpis">
      <div class="kpi-card kpi-info">
        <span class="kpi-label">Total importado</span>
        <span class="kpi-valor">${total}</span>
      </div>
      <div class="kpi-card kpi-ok">
        <span class="kpi-label">Aceitos</span>
        <span class="kpi-valor">${aceitos}</span>
      </div>
      <div class="kpi-card kpi-erro">
        <span class="kpi-label">Rejeitados</span>
        <span class="kpi-valor">${rejeitados}</span>
      </div>
      <div class="kpi-card">
        <span class="kpi-label">Importações</span>
        <span class="kpi-valor">${hist.length}</span>
      </div>
    </div>
  `;
}

// ============================================================
// SELEÇÃO DE PASTA
// ============================================================

function selecionarPasta(direcao, pasta) {
  // Simula a varredura da pasta (mock)
  importacaoForm = {
    direcao,
    pasta,
    etapa: 'pre-validacao',
    xmls: (xmlsSimulados[direcao] || []).map(x => ({ ...x, selecionado: x.status === 'aceito' || x.status === 'aceito_com_aviso' })),
  };
  document.getElementById('content').innerHTML = renderPreValidacao(direcao);
}

function selecionarPastaIndividual(direcao) {
  // No wireframe, simula a seleção de um único XML
  importacaoForm = {
    direcao,
    pasta: 'arquivo individual',
    etapa: 'pre-validacao',
    xmls: [(xmlsSimulados[direcao] || [])[0]].filter(Boolean).map(x => ({ ...x, selecionado: true })),
  };
  document.getElementById('content').innerHTML = renderPreValidacao(direcao);
}

// ============================================================
// PRÉ-VALIDAÇÃO
// ============================================================

function renderPreValidacao(direcao) {
  const isEntrada = direcao === 'entrada';
  const xmls = importacaoForm.xmls;
  const filtrados = filtrarXmls(xmls);
  const resumo = resumoPreValidacao(xmls);

  return `
    <div class="contador-header">
      <h1>Pré-validação</h1>
      <span class="badge badge-info">${importacaoForm.pasta}</span>
    </div>
    <p class="subtitle">${isEntrada ? 'Entrada' : 'Saída'} · ${xmls.length} XMLs encontrados</p>

    <div class="resumo-pre-validacao">
      <div class="rpv-card rpv-aceitos">
        <div class="rpv-label">Aceitos</div>
        <div class="rpv-valor">${resumo.aceitos}</div>
      </div>
      <div class="rpv-card rpv-aceitos-aviso">
        <div class="rpv-label">Aceitos com aviso</div>
        <div class="rpv-valor">${resumo.aceitosComAviso}</div>
      </div>
      <div class="rpv-card rpv-cancelados">
        <div class="rpv-label">Cancelados</div>
        <div class="rpv-valor">${resumo.cancelados}</div>
      </div>
      <div class="rpv-card rpv-rejeitados">
        <div class="rpv-label">Rejeitados</div>
        <div class="rpv-valor">${resumo.rejeitados}</div>
      </div>
    </div>

    ${filtrosXmls()}

    <div class="card">
      ${filtrados.length === 0
        ? '<div class="ordens-vazio"><div class="vazio-icon">📭</div><p>Nenhum XML para este filtro.</p></div>'
        : filtrados.map(x => xmlItem(x)).join('')}
    </div>

    <div class="form-actions">
      <button class="btn btn-secondary" onclick="cancelarImportacao()">Cancelar</button>
      <button class="btn btn-primary" onclick="confirmarImportacao()"
              ${resumo.aceitos + resumo.aceitosComAviso === 0 ? 'disabled title="Nenhum XML selecionado"' : ''}>
        Confirmar importação (${resumo.aceitos + resumo.aceitosComAviso} XMLs)
      </button>
    </div>
  `;
}

function resumoPreValidacao(xmls) {
  return {
    aceitos: xmls.filter(x => x.status === 'aceito').length,
    aceitosComAviso: xmls.filter(x => x.status === 'aceito_com_aviso').length,
    cancelados: xmls.filter(x => x.status === 'cancelado').length,
    rejeitados: xmls.filter(x => x.status === 'rejeitado').length,
  };
}

function filtrosXmls() {
  return `
    <div class="contador-filtros">
      <select onchange="setFiltroImportacao('status', this.value)">
        <option value="todos" ${filtroImportacao.status === 'todos' ? 'selected' : ''}>Todos os status</option>
        <option value="aceito" ${filtroImportacao.status === 'aceito' ? 'selected' : ''}>Aceitos</option>
        <option value="aceito_com_aviso" ${filtroImportacao.status === 'aceito_com_aviso' ? 'selected' : ''}>Aceitos com aviso</option>
        <option value="cancelado" ${filtroImportacao.status === 'cancelado' ? 'selected' : ''}>Cancelados</option>
        <option value="rejeitado" ${filtroImportacao.status === 'rejeitado' ? 'selected' : ''}>Rejeitados</option>
      </select>
      <input type="text" placeholder="Buscar arquivo/contraparte..."
             value="${filtroImportacao.busca}"
             oninput="setFiltroImportacao('busca', this.value)">
    </div>
  `;
}

function setFiltroImportacao(campo, valor) {
  filtroImportacao[campo] = valor;
  document.getElementById('content').innerHTML = renderPreValidacao(importacaoForm.direcao);
}

function filtrarXmls(xmls) {
  return xmls.filter(x => {
    if (filtroImportacao.status !== 'todos' && x.status !== filtroImportacao.status) return false;
    if (filtroImportacao.busca) {
      const b = filtroImportacao.busca.toLowerCase();
      if (!(x.arquivo || '').toLowerCase().includes(b) && !(x.contraparte || '').toLowerCase().includes(b)) return false;
    }
    return true;
  });
}

function xmlItem(x) {
  const labelStatus = {
    'aceito': '<span class="badge badge-status-concluida">✓ aceito</span>',
    'aceito_com_aviso': '<span class="badge badge-status-parcial">⚠️ aceito c/ aviso</span>',
    'cancelado': '<span class="badge badge-status-pendente">cancelado</span>',
    'rejeitado': '<span class="badge badge-status-cancelada">✗ rejeitado</span>',
  };
  const podeSelecionar = x.status === 'aceito' || x.status === 'aceito_com_aviso';

  return `
    <div class="xml-item status-${x.status}">
      <div class="xml-checkbox">
        ${podeSelecionar ? `<input type="checkbox" ${x.selecionado ? 'checked' : ''}
                                   onchange="toggleXmlSelecionado('${x.arquivo}')">` : '—'}
      </div>
      <div class="xml-info">
        <div class="xml-arquivo">${x.arquivo || '—'}</div>
        <div class="xml-meta">
          ${x.numero ? `Nº ${x.numero}` : '—'}
          ${x.dataEmissao ? ` · ${formatarData(x.dataEmissao)}` : ''}
          ${x.contraparte ? ` · ${x.contraparte}` : ''}
        </div>
        ${x.motivo ? `<div class="xml-motivo">${x.motivo}</div>` : ''}
      </div>
      <div class="xml-valor">${x.valorTotal ? formatarMoeda(x.valorTotal) : '—'}</div>
      <div class="xml-badge">${labelStatus[x.status] || '—'}</div>
    </div>
  `;
}

function toggleXmlSelecionado(arquivo) {
  const x = importacaoForm.xmls.find(i => i.arquivo === arquivo);
  if (!x) return;
  x.selecionado = !x.selecionado;
  document.getElementById('content').innerHTML = renderPreValidacao(importacaoForm.direcao);
}

// ============================================================
// CONFIRMAÇÃO E RESULTADO
// ============================================================

function confirmarImportacao() {
  const selecionados = importacaoForm.xmls.filter(x => x.selecionado && (x.status === 'aceito' || x.status === 'aceito_com_aviso'));
  if (selecionados.length === 0) {
    alert('Nenhum XML selecionado para importar.');
    return;
  }
  if (!confirm(`Importar ${selecionados.length} XML(s)?\n\nOs documentos, lançamentos e contas serão gerados automaticamente.`)) return;

  // Marca os selecionados como importados
  selecionados.forEach(x => {
    x.importado = true;
  });

  importacaoForm.etapa = 'resultado';
  importacaoForm.importados = selecionados;

  // Atualiza o histórico (mock)
  const resumo = resumoPreValidacao(importacaoForm.xmls);
  historicoImportacoes.unshift({
    id: Math.max(0, ...historicoImportacoes.map(h => h.id)) + 1,
    data: new Date().toISOString(),
    tipo: 'NF-e',
    direcao: importacaoForm.direcao,
    pasta: importacaoForm.pasta,
    total: importacaoForm.xmls.length,
    aceitos: resumo.aceitos,
    aceitosComAviso: resumo.aceitosComAviso,
    cancelados: resumo.cancelados,
    rejeitados: resumo.rejeitados,
    usuario: (typeof USUARIO_ORDENS !== 'undefined' && USUARIO_ORDENS.nome) || 'Usuário',
  });

  document.getElementById('content').innerHTML = renderResultadoImportacao(importacaoForm.direcao);
}

function cancelarImportacao() {
  if (!confirm('Cancelar a importação? Nenhum XML será importado.')) return;
  importacaoForm = null;
  showScreen('importar-xml');
}

function renderResultadoImportacao(direcao) {
  const isEntrada = direcao === 'entrada';
  const importados = importacaoForm.importados || [];
  const totalValor = importados.reduce((s, x) => s + (x.valorTotal || 0), 0);

  return `
    <div class="contador-header">
      <h1>✅ Importação concluída</h1>
      <span class="badge badge-status-concluida">${importados.length} XMLs</span>
    </div>
    <p class="subtitle">${isEntrada ? 'Entrada' : 'Saída'} · ${formatarMoeda(totalValor)} · ${importacaoForm.pasta}</p>

    <div class="card">
      <h2>O que foi gerado</h2>
      <div class="contador-kpis">
        <div class="kpi-card kpi-ok">
          <span class="kpi-label">Documentos</span>
          <span class="kpi-valor">${importados.length}</span>
        </div>
        <div class="kpi-card kpi-info">
          <span class="kpi-label">Lançamentos</span>
          <span class="kpi-valor">${importados.length * 2}</span>
        </div>
        <div class="kpi-card kpi-aviso">
          <span class="kpi-label">Contas a ${isEntrada ? 'pagar' : 'receber'}</span>
          <span class="kpi-valor">${importados.length}</span>
        </div>
        <div class="kpi-card">
          <span class="kpi-label">Valor total</span>
          <span class="kpi-valor">${formatarMoeda(totalValor)}</span>
        </div>
      </div>

      <table class="data data-regras" style="margin-top:16px;">
        <thead>
          <tr>
            <th>Arquivo</th>
            <th>Nº</th>
            <th>Contraparte</th>
            <th style="text-align:right;">Valor</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${importados.map(x => `
            <tr>
              <td><code style="font-size:11px;">${x.arquivo}</code></td>
              <td>${x.numero || '—'}</td>
              <td>${x.contraparte || '—'}</td>
              <td style="text-align:right;">${formatarMoeda(x.valorTotal)}</td>
              <td>${x.status === 'aceito_com_aviso'
                ? '<span class="badge badge-status-parcial">aceito c/ aviso</span>'
                : '<span class="badge badge-status-concluida">✓ importado</span>'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      ${importados.some(x => x.status === 'aceito_com_aviso') ? `
        <div class="alert alert-warn" style="margin-top:16px;">
          ⚠️ Alguns XMLs foram importados com aviso. Verifique as pendências (T6) antes do fechamento.
        </div>
      ` : ''}
    </div>

    <div class="form-actions">
      <button class="btn btn-secondary" onclick="novaImportacao()">Nova importação</button>
      <button class="btn btn-primary" onclick="irParaRevisao()">Ir para revisão de classificações →</button>
    </div>
  `;
}

function novaImportacao() {
  importacaoForm = null;
  showScreen('importar-xml');
}

function irParaRevisao() {
  showScreen('revisao-classificacoes');
}