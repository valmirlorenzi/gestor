/* ============================================================
   2.8 — HANDOFF (ativar/desativar)
   Configuração do fluxo de documentos entre setores
   ============================================================ */

screens['handoff'] = () => {
  const h = handoffData;

  return `
    <div class="contador-header">
      <h1>Handoff — Fluxo entre Setores</h1>
      <span class="badge ${h.ativo ? 'badge-status-concluida' : 'badge-status-cancelada'}">
        ${h.ativo ? 'ativado' : 'desativado'}
      </span>
    </div>
    <p class="subtitle">Ative ou desative o fluxo de documentos entre setores para esta empresa</p>

    ${kpisHandoff(h)}
    ${cardStatusHandoff(h)}
    ${cardExplicacaoHandoff()}
    ${cardHistoricoHandoff(h)}
  `;
};

function kpisHandoff(h) {
  return `
    <div class="contador-kpis">
      <div class="kpi-card ${h.ativo ? 'kpi-ok' : 'kpi-erro'}">
        <span class="kpi-label">Status</span>
        <span class="kpi-valor" style="font-size:16px;">${h.ativo ? 'Ativado' : 'Desativado'}</span>
      </div>
      <div class="kpi-card kpi-info">
        <span class="kpi-label">Última alteração</span>
        <span class="kpi-valor" style="font-size:13px;">${formatarData(h.ultimaAlteracao.data)}</span>
      </div>
      <div class="kpi-card">
        <span class="kpi-label">Alterações</span>
        <span class="kpi-valor">${h.historico.length}</span>
      </div>
    </div>
  `;
}

function cardStatusHandoff(h) {
  return `
    <div class="card">
      <h2>Configuração atual</h2>
      <div style="display:flex; align-items:center; justify-content:space-between; gap:20px; flex-wrap:wrap;">
        <div>
          <p style="font-size:15px; font-weight:600; margin-bottom:6px;">
            Handoff está <span style="color:${h.ativo ? '#51cf66' : '#ff6b6b'};">${h.ativo ? 'ATIVADO' : 'DESATIVADO'}</span>
          </p>
          <p class="muted" style="font-size:13px;">
            ${h.ativo
              ? 'Os documentos geram ordens para o próximo setor. Cada ator vê suas tarefas na caixa de entrada.'
              : 'Os documentos avançam de estado automaticamente (sem tarefa para outro ator). A continuidade aparece na mesma tela do usuário que acumula os atores.'}
          </p>
        </div>
        <button class="btn ${h.ativo ? 'btn-secondary' : 'btn-primary'}"
                onclick="toggleHandoff()">
          ${h.ativo ? 'Desativar handoff' : 'Ativar handoff'}
        </button>
      </div>
    </div>
  `;
}

function cardExplicacaoHandoff() {
  return `
    <div class="card" style="margin-top:20px;">
      <h2>O que muda ao ativar/desativar</h2>
      <table class="data data-regras">
        <thead>
          <tr>
            <th>Aspecto</th>
            <th>Handoff ATIVADO</th>
            <th>Handoff DESATIVADO</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Fluxo de documentos</strong></td>
            <td>Documentos geram ordens para o próximo setor</td>
            <td>Documentos avançam automaticamente de estado</td>
          </tr>
          <tr>
            <td><strong>Caixa de entrada</strong></td>
            <td>Ator vê as tarefas que recebeu</td>
            <td>Ator vê as tarefas da sua área (acumuladas)</td>
          </tr>
          <tr>
            <td><strong>Auditoria</strong></td>
            <td>Registra cada transição de estado (T8.7)</td>
            <td>Registra apenas a ação do ator</td>
          </tr>
          <tr>
            <td><strong>Indicação para</strong></td>
            <td>Empresas com múltiplos setores</td>
            <td>Empresas pequenas (uma pessoa acumula funções)</td>
          </tr>
        </tbody>
      </table>
      <p class="muted" style="margin-top:12px; font-size:12px;">
        ⚠️ A alteração <strong>não afeta</strong> documentos já processados. Vale apenas para novos documentos.
      </p>
    </div>
  `;
}

function cardHistoricoHandoff(h) {
  return `
    <div class="card" style="margin-top:20px;">
      <h2>Histórico de alterações</h2>
      <table class="data data-regras">
        <thead>
          <tr>
            <th>Data</th>
            <th>Usuário</th>
            <th>Ação</th>
            <th>Observação</th>
          </tr>
        </thead>
        <tbody>
          ${h.historico.map(ev => `
            <tr>
              <td>${formatarDataHora(ev.data)}</td>
              <td>${ev.usuario}</td>
              <td><span class="badge ${ev.acao === 'Ativado' ? 'badge-status-concluida' : 'badge-status-cancelada'}">${ev.acao}</span></td>
              <td class="muted">${ev.observacao}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function toggleHandoff() {
  const h = handoffData;
  const acao = h.ativo ? 'Desativar' : 'Ativar';
  const justificativa = prompt(`Justificativa para ${acao.toLowerCase()} o handoff (registrada em auditoria):`);
  if (!justificativa) return;

  h.ativo = !h.ativo;
  const novoEvento = {
    data: new Date().toISOString(),
    usuario: (typeof USUARIO_ORDENS !== 'undefined' && USUARIO_ORDENS.nome) || 'Usuário',
    acao: h.ativo ? 'Ativado' : 'Desativado',
    observacao: justificativa,
  };
  h.historico.unshift(novoEvento);
  h.ultimaAlteracao = novoEvento;

  alert(`Handoff ${h.ativo ? 'ativado' : 'desativado'} com sucesso.\n\nA alteração foi registrada em auditoria.`);
  showScreen('handoff');
}