// ============================================================
// G8 — BALANÇO PATRIMONIAL
// Relatório do Administrador (item 3.10 do menu)
// Adicionado na v1.1 do wireframe (merge do 13)
// ============================================================

screens['balanco'] = () => {
  const dados = BALANCO_SIMULADO;

  // --- Cálculos ---
  const somar = (arr) => arr.reduce((acc, item) => acc + item.valor, 0);

  const totalCirculanteAtivo = somar(dados.ativo.circulante);
  const totalNaoCirculanteAtivo = somar(dados.ativo.naoCirculante);
  const totalAtivo = totalCirculanteAtivo + totalNaoCirculanteAtivo;

  const totalCirculantePassivo = somar(dados.passivo.circulante);
  const totalNaoCirculantePassivo = somar(dados.passivo.naoCirculante);
  const totalPassivoExigivel = totalCirculantePassivo + totalNaoCirculantePassivo;

  const totalPatrimonioLiquido = somar(dados.patrimonioLiquido);
  const totalPassivo = totalPassivoExigivel + totalPatrimonioLiquido;

  const diferenca = totalAtivo - totalPassivo;
  const equacaoOk = Math.abs(diferenca) < 0.01;

  // --- Análise vertical (% sobre o total do Ativo) ---
  const av = (valor) => totalAtivo > 0 ? (valor / totalAtivo) * 100 : 0;

  // --- Renderizadores ---
  const renderizarConta = (item, classe = '') => `
  <tr class="balanco-linha ${classe}"
      data-drill="conta"
      data-titulo="Lançamentos — ${escaparHtml(item.conta)} ${escaparHtml(item.descricao)}"
      data-valor="${item.valor}"
      data-qtd="5"
      style="cursor:pointer">
    <td class="balanco-conta">${escaparHtml(item.conta)}</td>
    <td class="balanco-descricao">${escaparHtml(item.descricao)}</td>
    <td class="balanco-valor">${formatarMoeda(item.valor)}</td>
    <td class="balanco-av">${formatarPercentual(av(item.valor))}</td>
  </tr>
`;

  const renderizarGrupo = (titulo, itens, total, classeTotal = '') => `
    <tr class="balanco-grupo-titulo">
      <td colspan="4">${escaparHtml(titulo)}</td>
    </tr>
    ${itens.map(item => renderizarConta(item)).join('')}
    <tr class="balanco-subtotal ${classeTotal}">
      <td colspan="2">Total ${escaparHtml(titulo)}</td>
      <td class="balanco-valor">${formatarMoeda(total)}</td>
      <td class="balanco-av">${formatarPercentual(av(total))}</td>
    </tr>
  `;

  return `
    <div class="screen balanco">
      <div class="screen-header">
        <h1>Balanço Patrimonial</h1>
        <span class="screen-subtitulo">Data de corte: ${escaparHtml(dados.dataCorte)}</span>
      </div>

      ${!equacaoOk ? `
        <div class="balanco-alerta">
          ⚠️ <strong>Equação patrimonial não fecha.</strong>
          Diferença: ${formatarMoeda(diferenca)}.
          Verifique lançamentos incompletos ou classificações incorretas.
        </div>
      ` : `
        <div class="balanco-ok">
          ✅ Equação patrimonial conferida: Ativo = Passivo + PL
        </div>
      `}

      <table class="balanco-tabela">
        <thead>
          <tr>
            <th class="balanco-conta">Conta</th>
            <th class="balanco-descricao">Descrição</th>
            <th class="balanco-valor">Valor (R$)</th>
            <th class="balanco-av">AV (%)</th>
          </tr>
        </thead>
        <tbody>
          <!-- ATIVO -->
          <tr class="balanco-secao"><td colspan="4">ATIVO</td></tr>
          ${renderizarGrupo('Ativo Circulante', dados.ativo.circulante, totalCirculanteAtivo)}
          ${renderizarGrupo('Ativo Não Circulante', dados.ativo.naoCirculante, totalNaoCirculanteAtivo)}
          <tr class="balanco-total">
            <td colspan="2">TOTAL DO ATIVO</td>
            <td class="balanco-valor">${formatarMoeda(totalAtivo)}</td>
            <td class="balanco-av">${formatarPercentual(100)}</td>
          </tr>

          <!-- PASSIVO -->
          <tr class="balanco-secao"><td colspan="4">PASSIVO</td></tr>
          ${renderizarGrupo('Passivo Circulante', dados.passivo.circulante, totalCirculantePassivo)}
          ${renderizarGrupo('Passivo Não Circulante', dados.passivo.naoCirculante, totalNaoCirculantePassivo)}
          <tr class="balanco-subtotal">
            <td colspan="2">Total do Passivo Exigível</td>
            <td class="balanco-valor">${formatarMoeda(totalPassivoExigivel)}</td>
            <td class="balanco-av">${formatarPercentual(av(totalPassivoExigivel))}</td>
          </tr>

          <!-- PATRIMÔNIO LÍQUIDO -->
          <tr class="balanco-secao"><td colspan="4">PATRIMÔNIO LÍQUIDO</td></tr>
          ${dados.patrimonioLiquido.map(item => renderizarConta(item)).join('')}
          <tr class="balanco-subtotal">
            <td colspan="2">Total do Patrimônio Líquido</td>
            <td class="balanco-valor">${formatarMoeda(totalPatrimonioLiquido)}</td>
            <td class="balanco-av">${formatarPercentual(av(totalPatrimonioLiquido))}</td>
          </tr>

          <tr class="balanco-total">
            <td colspan="2">TOTAL DO PASSIVO + PL</td>
            <td class="balanco-valor">${formatarMoeda(totalPassivo)}</td>
            <td class="balanco-av">${formatarPercentual(av(totalPassivo))}</td>
          </tr>
        </tbody>
      </table>

      <div class="balanco-rodape">
        <button class="btn btn-secundario" onclick="showScreen('exportacao')">📤 Exportar</button>
        <button class="btn btn-secundario" onclick="showScreen('painel-executivo')">↩ Voltar para o Painel Executivo</button>
      </div>
    </div>
  `;
};