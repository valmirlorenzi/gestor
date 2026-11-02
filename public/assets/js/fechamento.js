/* ============================================================
   FECHAMENTO DE PERÍODO (A6)
   4.10 Preparar fechamento + 4.11 Fechar período
   ============================================================ */

screens['preparar-fechamento'] = () => {
  const f = fechamentoData;
  const temErro = pendencias.some(p => p.categoria === 'Erro' && p.status === 'Aberta');
  const provisoesPendente = f.consolidacoes.provisoes.status !== 'ok';

  return `
    <div class="contador-header">
      <h1>Preparar Fechamento</h1>
      <span class="badge badge-status-pendente">${f.periodo} · ${f.filial}</span>
    </div>
    <p class="subtitle">Consolide os cálculos e resolva as pendências antes de fechar</p>

    ${kpisFechamento(f, temErro)}

    <div class="fechamento-etapas">
      ${etapaFechamento(1, 'Consolidar folha', f.consolidacoes.folha, 'Consolidação da folha de pagamento (E3)')}
      ${etapaFechamento(2, 'Consolidar depreciação', f.consolidacoes.depreciacao, 'Cálculo da depreciação (E4)')}
      ${etapaFechamento(3, 'Consolidar provisões', f.consolidacoes.provisoes, 'Provisões de férias e 13º (E5)')}
      ${etapaFechamento(4, 'Resolver pendências', { status: temErro ? 'pendente' : 'ok', data: null }, temErro ? 'Há erros que bloqueiam o fechamento' : 'Todas as pendências resolvidas')}
      ${etapaFechamento(5, 'Enviar para o Auditor', { status: f.auditoria.validado ? 'ok' : 'pendente', data: f.auditoria.data }, f.auditoria.validado ? 'Validado pelo Auditor' : 'Aguardando validação do Auditor')}
      ${etapaFechamento(6, 'Congelar período e abrir o próximo', { status: 'pendente', data: null }, 'O fechamento congela o período e abre o próximo automaticamente')}
    </div>

    <div class="form-actions">
      <button class="btn btn-secondary" onclick="showScreen('pendencias')">Ver pendências</button>
      ${!temErro && !provisoesPendente && !f.auditoria.validado
        ? '<button class="btn btn-primary" onclick="enviarParaAuditor()">Enviar para o Auditor</button>'
        : ''}
      ${!temErro && !provisoesPendente && f.auditoria.validado
        ? '<button class="btn btn-primary" onclick="fecharPeriodo()">Fechar período</button>'
        : ''}
    </div>
  `;
};

function kpisFechamento(f, temErro) {
  return `
    <div class="contador-kpis">
      <div class="kpi-card ${temErro ? 'kpi-erro' : 'kpi-ok'}">
        <span class="kpi-label">Erros</span>
        <span class="kpi-valor">${f.pendenciasErro}</span>
      </div>
      <div class="kpi-card kpi-aviso">
        <span class="kpi-label">Avisos</span>
        <span class="kpi-valor">${f.pendenciasAviso}</span>
      </div>
      <div class="kpi-card ${f.auditoria.validado ? 'kpi-ok' : 'kpi-info'}">
        <span class="kpi-label">Auditor</span>
        <span class="kpi-valor">${f.auditoria.validado ? '✓' : '—'}</span>
      </div>
      <div class="kpi-card">
        <span class="kpi-label">Status</span>
        <span class="kpi-valor" style="font-size:14px;">${f.status}</span>
      </div>
    </div>
  `;
}

function etapaFechamento(numero, titulo, estado, descricao) {
  const classe = estado.status === 'ok' ? 'concluida' : estado.status === 'pendente' ? 'pendente' : 'bloqueada';
  return `
    <div class="etapa-fechamento ${classe}">
      <div class="etapa-numero">${estado.status === 'ok' ? '✓' : numero}</div>
      <div class="etapa-conteudo">
        <div class="etapa-titulo">${titulo}</div>
        <div class="etapa-descricao">${descricao}${estado.data ? ' · ' + formatarData(estado.data) : ''}</div>
      </div>
    </div>
  `;
}

function enviarParaAuditor() {
  if (!confirm('Enviar a consolidação para o Auditor validar?')) return;
  fechamentoData.auditoria = {
    validado: false,
    auditor: 'Ana Souza',
    data: new Date().toISOString().split('T')[0],
    observacao: 'Aguardando validação',
  };
  // Simula validação automática (no wireframe)
  setTimeout(() => {
    fechamentoData.auditoria.validado = true;
    fechamentoData.auditoria.observacao = 'Aprovado';
    showScreen('preparar-fechamento');
  }, 1000);
  showScreen('preparar-fechamento');
}

function fecharPeriodo() {
  if (!confirm('Fechar o período ' + fechamentoData.periodo + '? Esta ação é irreversível.')) return;
  fechamentoData.status = 'Fechado';
  alert('Período ' + fechamentoData.periodo + ' fechado. O período 11/2026 foi aberto automaticamente.');
  showScreen('preparar-fechamento');
}

screens['fechar-periodo'] = () => screens['preparar-fechamento']();