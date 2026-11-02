// ============================================================
// G15 — RESUMO EXECUTIVO (1 PÁGINA)
// Relatório do Administrador (item 3.17 do menu)
// Adicionado na v1.1 do wireframe (merge do 13)
// ============================================================

screens['resumo-executivo'] = () => {
  const dados = RESUMO_EXECUTIVO_SIMULADO;

  // --- Renderizadores ---
  const renderizarDestaque = (d) => `
    <div class="resumo-destaque">
      <span class="resumo-destaque-icone">${d.icone || '•'}</span>
      <span class="resumo-destaque-texto">${escaparHtml(d.texto)}</span>
      ${d.variacao !== undefined ? `<span class="resumo-destaque-variacao ${classeVariacao(d.variacao)}">${formatarVariacao(d.variacao)}</span>` : ''}
    </div>
  `;

  const renderizarRisco = (r) => {
    const icone = r.severidade === 'alto' ? '🔴'
                : r.severidade === 'medio' ? '🟡'
                : '🟢';
    return `
      <li class="resumo-risco resumo-risco-${escaparHtml(r.severidade)}">
        <span class="resumo-risco-icone">${icone}</span>
        <span class="resumo-risco-texto">${escaparHtml(r.texto)}</span>
      </li>
    `;
  };

  const renderizarOportunidade = (o) => `
    <li class="resumo-oportunidade">
      <span class="resumo-oportunidade-icone">💡</span>
      <span class="resumo-oportunidade-texto">${escaparHtml(o.texto)}</span>
    </li>
  `;

  const renderizarAcao = (a) => `
    <li class="resumo-acao">
      <span class="resumo-acao-icone">→</span>
      <span class="resumo-acao-texto">${escaparHtml(a.texto)}</span>
    </li>
  `;

  return `
    <div class="screen resumo-executivo">
      <div class="screen-header resumo-header">
        <div>
          <h1>Resumo Executivo</h1>
          <span class="screen-subtitulo">Período: ${escaparHtml(dados.periodo)}</span>
        </div>
        <div class="resumo-header-acoes">
          <button class="btn btn-secundario" onclick="window.print()">🖨️ Imprimir / PDF</button>
          <button class="btn btn-secundario" onclick="showScreen('exportacao')">📤 Exportar</button>
        </div>
      </div>

      <div class="resumo-pagina">

        <section class="resumo-secao">
          <h2 class="resumo-secao-titulo">📌 Destaques do período</h2>
          <div class="resumo-destaques">
            ${dados.destaques.map(renderizarDestaque).join('')}
          </div>
        </section>

        <section class="resumo-secao">
          <h2 class="resumo-secao-titulo">⚠️ Top 3 riscos</h2>
          <ul class="resumo-lista resumo-riscos">
            ${dados.riscos.map(renderizarRisco).join('')}
          </ul>
        </section>

        <section class="resumo-secao">
          <h2 class="resumo-secao-titulo">💡 Top 3 oportunidades</h2>
          <ul class="resumo-lista resumo-oportunidades">
            ${dados.oportunidades.map(renderizarOportunidade).join('')}
          </ul>
        </section>

        <section class="resumo-secao">
          <h2 class="resumo-secao-titulo">🎯 Ações sugeridas</h2>
          <ul class="resumo-lista resumo-acoes">
            ${dados.acoesSugeridas.map(renderizarAcao).join('')}
          </ul>
        </section>

      </div>

      <div class="resumo-rodape">
        <button class="btn btn-secundario" onclick="showScreen('painel-executivo')">↩ Voltar para o Painel Executivo</button>
      </div>
    </div>
  `;
};