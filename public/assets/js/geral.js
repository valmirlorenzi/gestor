/* ============================================================
   GERAL.JS — Helpers, navegação, tema e sidebar
   ============================================================ */

/* ---------- Tema ---------- */
function setTheme(theme) {
  document.body.className = 'theme-' + theme;
  ['modern', 'classic', 'retro'].forEach(t => {
    document.getElementById('btn-' + t).classList.toggle('active', t === theme);
  });
  localStorage.setItem('tema', theme);
}

/* ---------- Sidebar ---------- */
function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('collapsed');
}

/* ---------- Navegação ---------- */
const screens = {};

function showScreen(id) {
  document.querySelectorAll('.menu-item').forEach(m => m.classList.remove('active'));
  const el = Array.from(document.querySelectorAll('.menu-item'))
    .find(m => m.getAttribute('onclick')?.includes("'" + id + "'"));
  if (el) el.classList.add('active');

  const container = document.getElementById('content');
  if (screens[id]) {
    container.innerHTML = screens[id]();
  } else {
    container.innerHTML = `
      <h1>Tela em construção</h1>
      <p class="subtitle">A tela "<strong>${id}</strong>" ainda não foi implementada neste wireframe.</p>
      <div class="card">
        <p class="muted">Isso é esperado: cada bloco do wireframe é entregue em partes. Volte após a próxima entrega.</p>
      </div>
    `;
  }
}

/* ---------- Helpers de formatação ---------- */
function formatarMoeda(valor) {
  return 'R$ ' + Number(valor || 0).toFixed(2).replace('.', ',');
}

function formatarData(dataISO) {
  if (!dataISO) return '—';
  const [ano, mes, dia] = dataISO.split('-');
  return `${dia}/${mes}/${ano}`;
}

function formatarMesAno(mesAno) {
  if (!mesAno) return '—';
  const [ano, mes] = mesAno.split('-');
  return `${mes}/${ano}`;
}

/* ---------- Inicialização ---------- */
window.addEventListener('DOMContentLoaded', () => {
  const temaSalvo = localStorage.getItem('tema') || 'modern';
  setTheme(temaSalvo);
});

// ============================================================
// FUNÇÕES UTILITÁRIAS — RELATÓRIOS DO ADMINISTRADOR (G8–G15)
// Adicionado na v1.1 do wireframe (merge do 13)
// ============================================================

/**
 * Formata um número como percentual brasileiro.
 * @param {number} valor - Ex: 14.6
 * @param {number} [casas=1] - Casas decimais (padrão: 1)
 * @returns {string} Ex: "14,6%"
 */
function formatarPercentual(valor, casas = 1) {
  if (valor === null || valor === undefined || isNaN(valor)) return '—';
  return valor.toFixed(casas).replace('.', ',') + '%';
}

/**
 * Formata um número como índice (2 casas, vírgula).
 * @param {number} valor - Ex: 1.85
 * @returns {string} Ex: "1,85"
 */
function formatarIndice(valor) {
  if (valor === null || valor === undefined || isNaN(valor)) return '—';
  return valor.toFixed(2).replace('.', ',');
}

/**
 * Formata um número como "dias".
 * @param {number} valor - Ex: 32
 * @returns {string} Ex: "32 dias"
 */
function formatarDias(valor) {
  if (valor === null || valor === undefined || isNaN(valor)) return '—';
  return `${Math.round(valor)} ${Math.round(valor) === 1 ? 'dia' : 'dias'}`;
}

/**
 * Formata uma variação (Δ) com sinal e percentual.
 * @param {number} valor - Ex: +8.5 ou -3.2
 * @param {string} [formato='percentual'] - 'percentual' | 'indice' | 'dias' | 'moeda'
 * @returns {string} Ex: "+8,5%" ou "−3,2%" ou "+0,10"
 */
function formatarVariacao(valor, formato = 'percentual') {
  if (valor === null || valor === undefined || isNaN(valor)) return '—';
  const sinal = valor > 0 ? '+' : (valor < 0 ? '−' : '');
  const abs = Math.abs(valor);
  if (formato === 'moeda') return sinal + formatarMoeda(abs);
  if (formato === 'indice') return sinal + formatarIndice(abs);
  if (formato === 'dias') return sinal + Math.round(abs) + 'd';
  return sinal + abs.toFixed(1).replace('.', ',') + '%';
}

/**
 * Retorna a classe CSS do semáforo.
 * @param {'verde'|'amarelo'|'vermelho'} cor
 * @returns {string} Ex: "semaforo-verde"
 */
function classeSemaforo(cor) {
  const mapa = {
    verde: 'semaforo-verde',
    amarelo: 'semaforo-amarelo',
    vermelho: 'semaforo-vermelho'
  };
  return mapa[cor] || 'semaforo-cinza';
}

/**
 * Retorna o ícone do semáforo (emoji).
 * @param {'verde'|'amarelo'|'vermelho'} cor
 * @returns {string} Ex: "🟢"
 */
function iconeSemaforo(cor) {
  const mapa = { verde: '🟢', amarelo: '🟡', vermelho: '🔴' };
  return mapa[cor] || '⚪';
}

/**
 * Formata um KPI de acordo com o campo `formato`.
 * @param {number} valor
 * @param {'moeda'|'percentual'|'indice'|'dias'} formato
 * @returns {string}
 */
function formatarKpi(valor, formato) {
  if (valor === null || valor === undefined || isNaN(valor)) return '—';
  if (formato === 'moeda') return formatarMoeda(valor);
  if (formato === 'percentual') return formatarPercentual(valor);
  if (formato === 'indice') return formatarIndice(valor);
  if (formato === 'dias') return formatarDias(valor);
  return String(valor);
}

/**
 * Formata a variação de um KPI de acordo com o campo `formato`.
 * @param {number} valor
 * @param {'moeda'|'percentual'|'indice'|'dias'} formato
 * @returns {string}
 */
function formatarKpiVariacao(valor, formato) {
  return formatarVariacao(valor, formato);
}

/**
 * Retorna a classe CSS da variação (positiva = verde, negativa = vermelho,
 * zero = neutro). Para KPIs onde "menor é melhor" (ex: ciclo de caixa,
 * endividamento), o chamador inverte o sinal antes de passar.
 * @param {number} valor
 * @returns {string} Ex: "variacao-positiva" | "variacao-negativa" | "variacao-neutra"
 */
function classeVariacao(valor) {
  if (valor === null || valor === undefined || isNaN(valor) || valor === 0) return 'variacao-neutra';
  return valor > 0 ? 'variacao-positiva' : 'variacao-negativa';
}

/**
 * Renderiza uma barra horizontal proporcional (usada em aging, custos por área,
 * distribuição de impostos).
 * @param {number} valor
 * @param {number} max
 * @param {string} [cor='info'] - 'info' | 'ok' | 'aviso' | 'erro'
 * @returns {string} HTML da barra
 */
function renderizarBarra(valor, max, cor = 'info') {
  const pct = max > 0 ? Math.round((valor / max) * 100) : 0;
  return `<div class="barra-container">
    <div class="barra-preenchimento barra-${cor}" style="width:${pct}%"></div>
  </div>`;
}

/**
 * Escapa HTML para evitar injeção em textos dinâmicos.
 * @param {string} texto
 * @returns {string}
 */
function escaparHtml(texto) {
  if (texto === null || texto === undefined) return '';
  return String(texto)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// ============================================================
// MODAL GENÉRICO DE DRILL-DOWN
// Usado pelos relatórios do Administrador (G8–G15).
// ============================================================

function abrirModalDrillDown(titulo, linhas) {
  // Remove modal anterior, se existir
  const anterior = document.getElementById('modal-drilldown');
  if (anterior) anterior.remove();

  const modal = document.createElement('div');
  modal.id = 'modal-drilldown';
  modal.className = 'modal-drilldown-overlay';
  modal.innerHTML = `
    <div class="modal-drilldown" role="dialog" aria-modal="true">
      <div class="modal-drilldown-header">
        <h3>${escaparHtml(titulo)}</h3>
        <button class="modal-drilldown-fechar" aria-label="Fechar">✕</button>
      </div>
      <div class="modal-drilldown-body">
        ${linhas.length === 0
          ? '<p class="muted">Nenhum item encontrado.</p>'
          : `<table class="modal-drilldown-tabela">
               <thead>
                 <tr>
                   <th>Data</th>
                   <th>Descrição</th>
                   <th>Contraparte</th>
                   <th class="drill-valor">Valor</th>
                 </tr>
               </thead>
               <tbody>
                 ${linhas.map(l => `
                   <tr>
                     <td>${escaparHtml(l.data || '—')}</td>
                     <td>${escaparHtml(l.descricao || '—')}</td>
                     <td>${escaparHtml(l.contraparte || '—')}</td>
                     <td class="drill-valor">${l.valor !== undefined ? formatarMoeda(l.valor) : '—'}</td>
                   </tr>
                 `).join('')}
               </tbody>
             </table>`
        }
      </div>
    </div>
  `;

  // Fecha ao clicar no overlay (fora do modal) ou no X
  modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target.classList.contains('modal-drilldown-fechar')) {
      modal.remove();
    }
  });

  // Fecha com ESC
  const fecharEsc = (e) => {
    if (e.key === 'Escape') {
      modal.remove();
      document.removeEventListener('keydown', fecharEsc);
    }
  };
  document.addEventListener('keydown', fecharEsc);

  document.body.appendChild(modal);
}

// ============================================================
// DRILL-DOWN — linhas de exemplo por categoria
// Substituir por chamada ao backend no sistema real.
// ============================================================

function gerarLinhasExemplo(qtd, valorTotal, contrapartes) {
  const linhas = [];
  const valorPorLinha = qtd > 0 ? valorTotal / qtd : 0;
  for (let i = 0; i < qtd; i++) {
    linhas.push({
      data: `2026-10-${String(5 + i * 3).padStart(2, '0')}`,
      descricao: `Documento ${1000 + i}`,
      contraparte: contrapartes[i % contrapartes.length],
      valor: valorPorLinha
    });
  }
  return linhas;
}

// ============================================================
// Listener global de drill-down
// Cada elemento clicável deve ter:
//   data-drill="tipo"
//   data-titulo="Título do modal"
//   data-valor="1234.56"   (opcional)
//   data-qtd="3"           (opcional)
// ============================================================

document.addEventListener('click', (e) => {
  const el = e.target.closest('[data-drill]');
  if (!el) return;

  const tipo = el.dataset.drill;
  const titulo = el.dataset.titulo || 'Detalhamento';
  const valor = parseFloat(el.dataset.valor || '0');
  const qtd = parseInt(el.dataset.qtd || '3', 10);

  const contrapartesPorTipo = {
    conta: ['Fornecedor ABC', 'Cliente XYZ', 'Diversos'],
    faixa: ['Cliente A', 'Cliente B', 'Fornecedor C'],
    tipo_imposto: ['NF-e 1234', 'NF-e 5678', 'NFS-e 9012'],
    area: ['João Silva', 'Maria Souza'],
    ativo: ['Depreciação mensal', 'Ajuste contábil'],
    kpi: ['Lançamento 001', 'Lançamento 002', 'Lançamento 003']
  };
  const contrapartes = contrapartesPorTipo[tipo] || ['Diversos'];

  const linhas = gerarLinhasExemplo(qtd, valor, contrapartes);
  abrirModalDrillDown(titulo, linhas);
});

