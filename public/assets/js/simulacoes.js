/* ============================================================
   3.9 — SIMULAÇÕES (fase 2)
   Placeholder com mensagem informativa
   ============================================================ */

screens['simulacoes'] = () => {
  return `
    <div class="contador-header">
      <h1>Simulações</h1>
      <span class="badge badge-status-parcial">fase 2</span>
    </div>
    <p class="subtitle">Módulo de simulação de cenários</p>

    <div class="card">
      <div class="simulacao-placeholder">
        <div class="sp-icon">🔮</div>
        <h2>Disponível na fase 2</h2>
        <p>
          O módulo de simulação permite criar cenários "e se...?" sobre os dados reais,
          ajustar variáveis (preço, custo, salário, alíquota, regime) e comparar resultados,
          sem alterar os dados reais.
        </p>
        <p style="font-size:12px;">
          <strong>O que estará disponível:</strong><br>
          • Criar cenário (H1) — snapshot isolado dos dados<br>
          • Ajustar variáveis (H2) — preço, custo, pessoal, impostos<br>
          • Recalcular e comparar (H3) — DRE lado a lado<br>
          • Salvar cenário (H4) — para referência futura<br>
          • Comparar dois cenários salvos (H5)
        </p>
      </div>
    </div>

    <div class="card" style="margin-top:20px;">
      <h2>Roadmap</h2>
      <div class="timeline">
        <div class="timeline-item concluida">
          <div class="ti-data">Fase 1</div>
          <div class="ti-titulo">✓ Em produção</div>
          <div class="ti-descricao">Todos os módulos atuais (configuração, cadastros, entrada, classificação, cálculos, financeiro, relatórios)</div>
        </div>
        <div class="timeline-item pendente">
          <div class="ti-data">Fase 2</div>
          <div class="ti-titulo">🔮 Simulação</div>
          <div class="ti-descricao">Cenários, ajuste de variáveis, comparação</div>
        </div>
      </div>
    </div>
  `;
};