/* ============================================================
   VALIDAR FECHAMENTO (11.8) — visão do Auditor
   Reusa a lógica do 4.10, mas com ações de aprovar/reprovar.
   ============================================================ */

screens['validar-fechamento'] = () => {
  const f = fechamentoAuditor;
  const temErro = f.pendenciasErro > 0;
  const jaAprovado = f.status === 'Aprovado';
  const jaReprovado = f.status === 'Reprovado';

  return `
    <div class="contador-header">
      <h1>Validar Fechamento</h1>
      <span class="badge badge-status-pendente">${f.periodo} · ${f.filial}</span>
    </div>
    <p class="subtitle">O Auditor valida a consolidação antes de o Contador fechar o período</p>

    ${kpisValidarFechamento(f)}

    <div class="card">
      <h2>Consolidação enviada pelo Contador</h2>
      <div class="timeline">
        <div class="timeline-item concluida">
          <div class="ti-data">${f.consolidacoes.folha.data}</div>
          <div class="ti-titulo">Folha consolidada (E3)</div>
          <div class="ti-descricao">${formatarMoeda(f.consolidacoes.folha.valor || 14887.54)}</div>
        </div>
        <div class="timeline-item concluida">
          <div class="ti-data">${f.consolidacoes.depreciacao.data}</div>
          <div class="ti-titulo">Depreciação calculada (E4)</div>
          <div class="ti-descricao">${formatarMoeda(f.consolidacoes.depreciacao.valor || 83.33)}</div>
        </div>
        <div class="timeline-item concluida">
          <div class="ti-data">${f.consolidacoes.provisoes.data}</div>
          <div class="ti-titulo">Provisões calculadas (E5)</div>
          <div class="ti-descricao">${formatarMoeda(f.consolidacoes.provisoes.valor || 1149.00)}</div>
        </div>
        <div class="timeline-item pendente">
          <div class="ti-data">—</div>
          <div class="ti-titulo">Validação do Auditor</div>
          <div class="ti-descricao">
            ${temErro
              ? `⚠️ ${f.pendenciasErro} erro(s) pendente(s) — precisa resolver antes de aprovar`
              : 'Aguardando sua decisão'}
          </div>
        </div>
        <div class="timeline-item ${temErro ? 'bloqueada' : 'pendente'}">
          <div class="ti-data">—</div>
          <div class="ti-titulo">Fechamento do período pelo Contador</div>
          <div class="ti-descricao">Só acontece após a aprovação do Auditor</div>
        </div>
      </div>
    </div>

    <div class="card">
      <h2>Pendências</h2>
      <table class="data data-regras">
        <thead><tr><th>Categoria</th><th>Descrição</th><th>Status</th></tr></thead>
        <tbody>
          ${pendencias.map(p => `
            <tr>
              <td>${p.categoria === 'Erro' ? '<span class="badge badge-status-cancelada">Erro</span>' : '<span class="badge badge-status-parcial">Aviso</span>'}</td>
              <td>${p.descricao}</td>
              <td>${p.status === 'Aberta' ? '<span class="badge badge-status-pendente">Aberta</span>' : '<span class="badge badge-status-concluida">Resolvida</span>'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    ${f.historico.length > 0 ? `
      <div class="card">
        <h2>Histórico</h2>
        <div class="timeline">
          ${f.historico.map(h => `
            <div class="timeline-item concluida">
              <div class="ti-data">${formatarDataHora(h.data)}</div>
              <div class="ti-titulo">${h.acao}</div>
              <div class="ti-descricao">por ${h.usuario}</div>
            </div>
          `).join('')}
        </div>
      </div>
    ` : ''}

    ${!jaAprovado && !jaReprovado ? `
      <div class="form-actions">
        <button class="btn btn-secondary" onclick="showScreen('pendencias')">Ver pendências</button>
        <button class="btn btn-primary" onclick="aprovarFechamento()" ${temErro ? 'disabled title="Resolva os erros antes de aprovar"' : ''}>
          ✓ Aprovar fechamento
        </button>
        <button class="btn btn-secondary" onclick="reprovarFechamento()">✗ Reprovar</button>
      </div>
    ` : `
      <div class="alert ${jaAprovado ? 'alert-success' : 'alert-warn'}">
        ${jaAprovado
          ? '✅ Fechamento aprovado. O Contador pode fechar o período.'
          : '❌ Fechamento reprovado. O Contador deve corrigir e reenviar.'}
      </div>
    `}
  `;
};

function kpisValidarFechamento(f) {
  return `
    <div class="contador-kpis">
      <div class="kpi-card ${f.pendenciasErro > 0 ? 'kpi-erro' : 'kpi-ok'}">
        <span class="kpi-label">Erros</span>
        <span class="kpi-valor">${f.pendenciasErro}</span>
      </div>
      <div class="kpi-card kpi-aviso">
        <span class="kpi-label">Avisos</span>
        <span class="kpi-valor">${f.pendenciasAviso}</span>
      </div>
      <div class="kpi-card kpi-info">
        <span class="kpi-label">Consolidações</span>
        <span class="kpi-valor">${Object.keys(f.consolidacoes).length}</span>
      </div>
      <div class="kpi-card">
        <span class="kpi-label">Status</span>
        <span class="kpi-valor" style="font-size:13px;">${f.status}</span>
      </div>
    </div>
  `;
}

function aprovarFechamento() {
  if (fechamentoAuditor.pendenciasErro > 0) {
    alert('Não é possível aprovar: há erros pendentes.');
    return;
  }
  if (!confirm('Aprovar o fechamento do período ' + fechamentoAuditor.periodo + '?')) return;
  fechamentoAuditor.status = 'Aprovado';
  fechamentoAuditor.historico.push({
    data: new Date().toISOString(),
    acao: 'Auditor aprovou o fechamento',
    usuario: 'Ana Souza',
  });
  document.getElementById('content').innerHTML = screens['validar-fechamento']();
}

function reprovarFechamento() {
  const motivo = prompt('Motivo da reprovação (será enviado ao Contador):');
  if (!motivo) return;
  fechamentoAuditor.status = 'Reprovado';
  fechamentoAuditor.historico.push({
    data: new Date().toISOString(),
    acao: 'Auditor reprovou: ' + motivo,
    usuario: 'Ana Souza',
  });
  document.getElementById('content').innerHTML = screens['validar-fechamento']();
}