/* ============================================================
   TABELAS TRABALHISTAS — INSS (10.1), IRRF (10.2), Encargos (10.3)
   Tela única com abas. Tabelas universais (não adaptáveis).
   ============================================================ */

screens['tabelas-inss'] = () => renderTabelasTrabalhistas('inss');
screens['tabelas-irrf'] = () => renderTabelasTrabalhistas('irrf');
screens['tabelas-gerais'] = () => renderTabelasTrabalhistas('encargos');

function renderTabelasTrabalhistas(aba) {
  abaTabelaTrabalhista = aba;

  const tabs = [
    { id: 'inss',     label: 'INSS' },
    { id: 'irrf',     label: 'IRRF' },
    { id: 'encargos', label: 'Encargos' },
  ];

  return `
    <div class="contador-header">
      <h1>Tabelas trabalhistas</h1>
      <span class="badge badge-info">universais · não adaptáveis</span>
    </div>
    <p class="subtitle">Tabelas federais de INSS, IRRF e encargos. Vigência 2026.</p>

    <div class="tabs">
      ${tabs.map(t => `
        <button class="tab ${abaTabelaTrabalhista === t.id ? 'active' : ''}"
                onclick="setAbaTabelaTrabalhista('${t.id}')">
          ${t.label}
        </button>
      `).join('')}
    </div>

    <div class="tab-conteudo">
      ${aba === 'inss' ? abaINSS() : ''}
      ${aba === 'irrf' ? abaIRRF() : ''}
      ${aba === 'encargos' ? abaEncargos() : ''}
    </div>
  `;
}

function setAbaTabelaTrabalhista(aba) {
  const rotas = { inss: 'tabelas-inss', irrf: 'tabelas-irrf', encargos: 'tabelas-gerais' };
  document.getElementById('content').innerHTML = screens[rotas[aba]]();
}

// ============================================================
// ABA: INSS (10.1)
// ============================================================

function abaINSS() {
  return `
    <div class="card">
      <div class="contador-header">
        <h2>Tabela INSS 2026</h2>
        <span class="badge badge-status-concluida">vigência 01/01/2026 — 31/12/2026</span>
      </div>
      <p class="muted" style="margin-bottom:12px;">
        Tabela progressiva. Alíquotas efetivas sobre a faixa (não sobre o total).
      </p>
      <table class="data data-regras">
        <thead><tr><th>Faixa</th><th>Valor inicial</th><th>Valor final</th><th>Alíquota</th></tr></thead>
        <tbody>
          ${tabelasINSS.map(t => `
            <tr>
              <td><strong>${t.faixa}ª</strong></td>
              <td>${formatarMoeda(t.valorInicial)}</td>
              <td>${formatarMoeda(t.valorFinal)}</td>
              <td><span class="badge badge-info">${t.aliquota.toFixed(2)}%</span></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      <p class="muted" style="margin-top:12px; font-size:12px;">
        ⚠️ Tabela <strong>federal</strong> — não pode ser alterada pelo RH. Atualizada anualmente pelo governo.
      </p>
    </div>

    <div class="card" style="margin-top:20px;">
      <h2>Simulador</h2>
      <div class="form-grid">
        <div class="form-row">
          <label>Salário de contribuição (R$)</label>
          <input type="number" id="sim-inss-base" step="0.01" value="3500" oninput="simularINSS()">
        </div>
      </div>
      <div class="baixa-resumo" id="sim-inss-resultado" style="margin-top:12px;">
        ${resultadoSimulacaoINSS(3500)}
      </div>
    </div>
  `;
}

function resultadoSimulacaoINSS(base) {
  const inss = calcularINSS(base);
  const aliquotaEfetiva = (inss / base * 100).toFixed(2);
  return `
    <div class="linha">
      <span class="label">Salário de contribuição</span>
      <span class="valor">${formatarMoeda(base)}</span>
    </div>
    <div class="linha">
      <span class="label">INSS empregado</span>
      <span class="valor">${formatarMoeda(inss)}</span>
    </div>
    <div class="linha total">
      <span class="label">Alíquota efetiva</span>
      <span class="valor">${aliquotaEfetiva}%</span>
    </div>
  `;
}

function simularINSS() {
  const base = parseFloat(document.getElementById('sim-inss-base').value) || 0;
  document.getElementById('sim-inss-resultado').innerHTML = resultadoSimulacaoINSS(base);
}

// ============================================================
// ABA: IRRF (10.2)
// ============================================================

function abaIRRF() {
  return `
    <div class="card">
      <div class="contador-header">
        <h2>Tabela IRRF 2026</h2>
        <span class="badge badge-status-concluida">vigência 01/01/2026 — 31/12/2026</span>
      </div>
      <p class="muted" style="margin-bottom:12px;">
        Tabela progressiva. Base de cálculo = salário − INSS − dependentes.
      </p>
      <table class="data data-regras">
        <thead><tr><th>Faixa</th><th>Valor inicial</th><th>Valor final</th><th>Alíquota</th><th>Dedução</th></tr></thead>
        <tbody>
          ${tabelasIRRF.map(t => `
            <tr>
              <td><strong>${t.faixa}ª</strong></td>
              <td>${formatarMoeda(t.valorInicial)}</td>
              <td>${formatarMoeda(t.valorFinal)}</td>
              <td><span class="badge badge-info">${t.aliquota.toFixed(2)}%</span></td>
              <td>${formatarMoeda(t.deducao)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      <p class="muted" style="margin-top:12px; font-size:12px;">
        ⚠️ Tabela <strong>federal</strong> — não pode ser alterada pelo RH.
      </p>
    </div>

    <div class="card" style="margin-top:20px;">
      <h2>Simulador</h2>
      <div class="form-grid">
        <div class="form-row">
          <label>Salário bruto (R$)</label>
          <input type="number" id="sim-irrf-base" step="0.01" value="3500" oninput="simularIRRF()">
        </div>
      </div>
      <div class="baixa-resumo" id="sim-irrf-resultado" style="margin-top:12px;">
        ${resultadoSimulacaoIRRF(3500)}
      </div>
    </div>
  `;
}

function resultadoSimulacaoIRRF(base) {
  const inss = calcularINSS(base);
  const irrf = calcularIRRF(base, inss);
  return `
    <div class="linha">
      <span class="label">Salário bruto</span>
      <span class="valor">${formatarMoeda(base)}</span>
    </div>
    <div class="linha">
      <span class="label">(-) INSS</span>
      <span class="valor">${formatarMoeda(inss)}</span>
    </div>
    <div class="linha">
      <span class="label">Base de cálculo do IRRF</span>
      <span class="valor">${formatarMoeda(base - inss)}</span>
    </div>
    <div class="linha total">
      <span class="label">IRRF</span>
      <span class="valor">${formatarMoeda(irrf)}</span>
    </div>
  `;
}

function simularIRRF() {
  const base = parseFloat(document.getElementById('sim-irrf-base').value) || 0;
  document.getElementById('sim-irrf-resultado').innerHTML = resultadoSimulacaoIRRF(base);
}

// ============================================================
// ABA: ENCARGOS (10.3)
// ============================================================

function abaEncargos() {
  return `
    <div class="card">
      <div class="contador-header">
        <h2>Tabela de Encargos</h2>
        <span class="badge badge-status-concluida">vigência 2026</span>
      </div>
      <p class="muted" style="margin-bottom:12px;">
        Encargos patronais sobre a folha. Alíquotas universais.
      </p>
      <table class="data data-regras">
        <thead><tr><th>Descrição</th><th>Alíquota</th><th>Incidência</th></tr></thead>
        <tbody>
          ${tabelasEncargos.map(t => `
            <tr>
              <td><strong>${t.descricao}</strong></td>
              <td><span class="badge badge-info">${t.aliquota.toFixed(2)}%</span></td>
              <td class="muted">Sobre a folha bruta</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      <div class="alert alert-info" style="margin-top:12px;">
        <strong>Total de encargos patronais:</strong> ${tabelasEncargos.reduce((s, t) => s + t.aliquota, 0).toFixed(2)}%
        <br><small>INSS patronal (20%) + FGTS (8%) + RAT (1%) + Terceiros (5,80%)</small>
      </div>
      <p class="muted" style="margin-top:12px; font-size:12px;">
        ⚠️ Tabela <strong>federal</strong> — não pode ser alterada pelo RH.
        RAT pode variar conforme o CNAE da filial (risco leve/médio/grave).
      </p>
    </div>
  `;
}