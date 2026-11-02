/* ============================================================
   3.8 — POSIÇÃO DE CAIXA
   Consulta operacional consolidada
   ============================================================ */

screens['posicao-caixa'] = () => {
  const p = posicaoCaixa;

  return `
    <div class="contador-header">
      <h1>Posição de Caixa e Bancos</h1>
      <span class="badge badge-info">${formatarData(p.data)}</span>
    </div>
    <p class="subtitle">Saldo consolidado e fluxo projetado de curto prazo</p>

    <div class="caixa-cards">
      <div class="caixa-card cc-disponivel">
        <span class="cc-label">Disponível</span>
        <span class="cc-valor">${formatarMoeda(p.totalDisponivel)}</span>
      </div>
      <div class="caixa-card cc-pagar">
        <span class="cc-label">Contas a pagar (abertas)</span>
        <span class="cc-valor">${formatarMoeda(p.contasPagarAbertas)}</span>
      </div>
      <div class="caixa-card cc-receber">
        <span class="cc-label">Contas a receber (abertas)</span>
        <span class="cc-valor">${formatarMoeda(p.contasReceberAbertas)}</span>
      </div>
      <div class="caixa-card cc-projetado">
        <span class="cc-label">Saldo projetado</span>
        <span class="cc-valor">${formatarMoeda(p.saldoProjetado)}</span>
      </div>
    </div>

    <div class="card">
      <h2>Saldo por conta bancária</h2>
      <table class="data data-regras">
        <thead>
          <tr>
            <th>Banco</th>
            <th>Agência</th>
            <th>Número</th>
            <th style="text-align:right;">Saldo</th>
          </tr>
        </thead>
        <tbody>
          ${p.contasBancarias.map(c => `
            <tr>
              <td><strong>${c.banco}</strong></td>
              <td>${c.agencia}</td>
              <td>${c.numero}</td>
              <td style="text-align:right; font-weight:600; color:#4a9eff;">${formatarMoeda(c.saldo)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <div class="card" style="margin-top:20px;">
      <h2>Fluxo projetado (próximos dias)</h2>
      <table class="data data-regras">
        <thead>
          <tr>
            <th>Data</th>
            <th style="text-align:right;">Entradas</th>
            <th style="text-align:right;">Saídas</th>
            <th style="text-align:right;">Saldo acumulado</th>
          </tr>
        </thead>
        <tbody>
          ${fluxoCaixaProjetado.slice(0, 5).map(f => `
            <tr>
              <td>${formatarData(f.data)}</td>
              <td style="text-align:right; color:#51cf66;">${formatarMoeda(f.entradas)}</td>
              <td style="text-align:right; color:#ff6b6b;">${formatarMoeda(f.saidas)}</td>
              <td style="text-align:right; font-weight:600; color:${f.saldoAcumulado >= 0 ? '#fff' : '#ff6b6b'};">
                ${formatarMoeda(f.saldoAcumulado)}
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
};