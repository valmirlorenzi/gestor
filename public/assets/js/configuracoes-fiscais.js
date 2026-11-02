/* ============================================================
   4.4 — CONFIGURAÇÕES FISCAIS — A4 / I2
   Alíquotas por UF, NCM, regime
   ============================================================ */

screens['config-fiscais'] = () => {
  return `
    <div class="contador-header">
      <h1>Configurações fiscais</h1>
      <span class="badge badge-info">por UF · NCM · regime</span>
    </div>
    <p class="subtitle">Parâmetros fiscais da empresa: alíquotas, benefícios, regime</p>

    <div class="card">
      <h2>Regime fiscal</h2>
      <div class="form-grid">
        <div class="form-row">
          <label>Regime</label>
          <select onchange="editarRegime(this.value)">
            <option value="Simples" ${PARAMETROS_FISCAIS.regime === 'Simples' ? 'selected' : ''}>Simples Nacional</option>
            <option value="Presumido" ${PARAMETROS_FISCAIS.regime === 'Presumido' ? 'selected' : ''}>Lucro Presumido</option>
            <option value="Real" ${PARAMETROS_FISCAIS.regime === 'Real' ? 'selected' : ''}>Lucro Real</option>
          </select>
        </div>
        <div class="form-row">
          <label>UF</label>
          <select onchange="editarUF(this.value)">
            <option value="SP" ${PARAMETROS_FISCAIS.uf === 'SP' ? 'selected' : ''}>SP</option>
            <option value="RJ" ${PARAMETROS_FISCAIS.uf === 'RJ' ? 'selected' : ''}>RJ</option>
            <option value="MG" ${PARAMETROS_FISCAIS.uf === 'MG' ? 'selected' : ''}>MG</option>
          </select>
        </div>
      </div>
    </div>

    <div class="card">
      <h2>Alíquotas aplicadas (visão consolidada)</h2>
      <table class="data data-regras">
        <thead><tr><th>Imposto</th><th>Alíquota padrão</th><th>Observação</th></tr></thead>
        <tbody>
          <tr><td>ICMS</td><td><strong>${PARAMETROS_FISCAIS.icms}%</strong></td><td>Por UF</td></tr>
          <tr><td>IPI</td><td><strong>${PARAMETROS_FISCAIS.ipi}%</strong></td><td>Por NCM (TIPI)</td></tr>
          <tr><td>PIS</td><td><strong>${PARAMETROS_FISCAIS.pis}%</strong></td><td>${PARAMETROS_FISCAIS.regime === 'Real' ? 'Não cumulativo' : 'Cumulativo'}</td></tr>
          <tr><td>COFINS</td><td><strong>${PARAMETROS_FISCAIS.cofins}%</strong></td><td>${PARAMETROS_FISCAIS.regime === 'Real' ? 'Não cumulativo' : 'Cumulativo'}</td></tr>
          <tr><td>IBS</td><td><strong>${PARAMETROS_FISCAIS.ibs}%</strong></td><td>Fase teste 2026</td></tr>
          <tr><td>CBS</td><td><strong>${PARAMETROS_FISCAIS.cbs}%</strong></td><td>Fase teste 2026</td></tr>
        </tbody>
      </table>
    </div>

    <div class="card">
      <h2>Benefícios fiscais</h2>
      <p class="muted">Nenhum benefício cadastrado. (Fase 2 — pendência 05)</p>
    </div>
  `;
};

function editarRegime(regime) {
  PARAMETROS_FISCAIS.regime = regime;
  // Ajusta PIS/COFINS conforme regime
  PARAMETROS_FISCAIS.pis = regime === 'Real' ? 1.65 : 0.65;
  PARAMETROS_FISCAIS.cofins = regime === 'Real' ? 7.60 : 3.00;
  showScreen('config-fiscais');
}

function editarUF(uf) {
  PARAMETROS_FISCAIS.uf = uf;
  // Ajusta ICMS conforme UF (mock)
  const icmsPorUF = { SP: 18.00, RJ: 20.00, MG: 18.00 };
  PARAMETROS_FISCAIS.icms = icmsPorUF[uf] || 18.00;
  showScreen('config-fiscais');
}