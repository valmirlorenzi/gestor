/* ============================================================
   MENU — montagem por ator, numeração, campo "Ir para",
           expandir/recolher blocos, badge, reset
   Depende de: menu-dados.js (fallback) OU window.__MENU__ (server)
   ============================================================ */

// ============================================================
// FONTE DE DADOS — servidor (window.__MENU__) com fallback mock
// ============================================================
const USUARIO_LOGADO = (typeof window !== 'undefined' && window.__USUARIO__) || {
  nome: 'Visitante',
  ator: null,
  filial: null,
};

const ITENS_MENU = (typeof window !== 'undefined' && window.__MENU__)
  ? window.__MENU__
  : (typeof MENU_ITENS_MOCK !== 'undefined' ? MENU_ITENS_MOCK : []);

const MAPA_BLOCOS = (typeof window !== 'undefined' && window.__BLOCOS__)
  ? window.__BLOCOS__
  : (typeof MENU_BLOCOS !== 'undefined' ? MENU_BLOCOS : {});

// ============================================================
// ESTADO DAS ORDENS (mock — wireframe, P50 → Bloco 8)
// ============================================================
const ORDENS_PENDENTES = {
  total: 3,
  urgentes: 1,
};

// ============================================================
// ESTADO DOS BLOCOS (expandido/recolhido)
// ============================================================
const STORAGE_KEY_BLOCOS = 'menu_blocos_recolhidos';

function getBlocosRecolhidos() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_BLOCOS);
    if (raw === null) {
      return Object.keys(MAPA_BLOCOS)
        .map(Number)
        .filter(id => id !== 1);   // 1 = Meu Trabalho
    }
    return JSON.parse(raw);
  } catch {
    return Object.keys(MAPA_BLOCOS)
      .map(Number)
      .filter(id => id !== 1);
  }
}

function setBlocosRecolhidos(ids) {
  try {
    localStorage.setItem(STORAGE_KEY_BLOCOS, JSON.stringify(ids));
  } catch { /* ignore */ }
}

function blocoEstaRecolhido(blocoId) {
  return getBlocosRecolhidos().includes(Number(blocoId));
}

function toggleBloco(blocoId) {
  const recolhidos = getBlocosRecolhidos();
  const id = Number(blocoId);
  const idx = recolhidos.indexOf(id);
  if (idx >= 0) recolhidos.splice(idx, 1);
  else recolhidos.push(id);
  setBlocosRecolhidos(recolhidos);
  montarMenu();
}

// ============================================================
// PERMISSÕES
// Já vêm resolvidas do servidor (MenuService). Não há mais filtro
// client-side — o servidor devolve SÓ o que o ator pode ver (P86/P92).
// ============================================================
function usuarioTemAcesso(_item) {
  return true;
}

// ============================================================
// MONTAGEM DO MENU
// ============================================================
function montarMenu() {
  const nav = document.getElementById('menu');
  if (!nav) return;

  nav.innerHTML = '';

  const porBloco = {};
  ITENS_MENU.forEach(item => {
    if (!porBloco[item.bloco]) porBloco[item.bloco] = [];
    porBloco[item.bloco].push(item);
  });

  Object.keys(porBloco)
    .map(Number)
    .sort((a, b) => a - b)
    .forEach(blocoId => {
      const bloco = MAPA_BLOCOS[blocoId];
      if (!bloco) return;

      const recolhido = blocoEstaRecolhido(blocoId);

      const wrapper = document.createElement('div');
      wrapper.className = 'menu-bloco' + (recolhido ? ' recolhido' : '');
      wrapper.dataset.bloco = blocoId;

      const section = document.createElement('div');
      section.className = 'menu-section';
      section.innerHTML = `
        <span class="section-toggle">${recolhido ? '▶' : '▼'}</span>
        <span class="section-icon">${bloco.icone}</span>
        <span class="section-name">${bloco.nome}</span>
      `;
      section.addEventListener('click', () => toggleBloco(blocoId));
      wrapper.appendChild(section);

      const itensWrap = document.createElement('div');
      itensWrap.className = 'menu-itens';

      porBloco[blocoId].forEach(item => {
        const el = document.createElement('div');
        el.className = 'menu-item';
        el.dataset.codigo = item.codigo;
        el.dataset.rota = item.rota;

        if (item.fase === 2) {
          el.classList.add('fase2');
          el.title = 'Disponível na fase 2';
        }

        let badgeHtml = '';
        if (item.badge && ORDENS_PENDENTES.total > 0) {
          const cls = ORDENS_PENDENTES.urgentes > 0 ? 'badge urgent' : 'badge';
          badgeHtml = `<span class="${cls}">${ORDENS_PENDENTES.total}</span>`;
        }

        const fase2Label = item.fase === 2 ? '<span class="fase2-label">(fase 2)</span>' : '';

        el.innerHTML = `
          <span class="menu-code">${item.codigo}</span>
          <span class="icon">${item.icone}</span>
          <span class="label">${item.nome}${fase2Label}</span>
          ${badgeHtml}
        `;

        el.addEventListener('click', (e) => {
          e.stopPropagation();
          if (item.fase === 2) {
            alert('Este recurso estará disponível na fase 2.');
            return;
          }
          selecionarItemMenu(el, item);
        });

        itensWrap.appendChild(el);
      });

      wrapper.appendChild(itensWrap);
      nav.appendChild(wrapper);
    });

  // Restaurar item ativo
  const rotaAtual = window.__rotaAtual || window.location.pathname;
  if (rotaAtual) {
    const ativo = nav.querySelector(`.menu-item[data-rota="${rotaAtual}"]`);
    if (ativo) ativo.classList.add('active');
  }
}

// ============================================================
// NAVEGAÇÃO — sempre window.location.href (rotas reais do banco)
// ============================================================
function selecionarItemMenu(el, item) {
  document.querySelectorAll('.menu-item.active').forEach(x => x.classList.remove('active'));
  el.classList.add('active');
  window.__rotaAtual = item.rota;

  // Rotas reais do banco (MenuService → seeder). O web.php tem
  // /tela/{codigo} como fallback 404 — mas para telas ainda não
  // implementadas, mostramos alerta (P15 melhorado).
  if (item.rota && item.rota.startsWith('/')) {
    window.location.href = item.rota;
    return;
  }

  alert('Tela ainda não implementada. Disponível em blocos futuros.');
}

// ============================================================
// CAMPO "IR PARA"
// ============================================================
function configurarGoto() {
  const input = document.getElementById('goto-input');
  const feedback = document.getElementById('goto-feedback');
  if (!input) return;

  input.addEventListener('input', (e) => {
    const val = e.target.value.trim();
    if (!val) {
      feedback.textContent = '';
      feedback.classList.remove('ok');
      return;
    }

    const matches = ITENS_MENU.filter(i => i.codigo.startsWith(val));

    if (matches.length === 0) {
      feedback.textContent = 'Código não encontrado';
      feedback.classList.remove('ok');
    } else if (matches.length === 1) {
      feedback.textContent = `→ ${matches[0].codigo} ${matches[0].nome}`;
      feedback.classList.add('ok');
    } else {
      feedback.textContent = `${matches.length} itens: ${matches.slice(0, 3).map(m => m.codigo).join(', ')}...`;
      feedback.classList.remove('ok');
    }
  });

  input.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter') return;
    const val = input.value.trim();
    if (!val) return;

    const item = ITENS_MENU.find(i => i.codigo === val);
    if (!item) {
      feedback.textContent = 'Código não encontrado';
      feedback.classList.remove('ok');
      return;
    }

    if (item.fase === 2) {
      feedback.textContent = 'Este recurso estará disponível na fase 2.';
      feedback.classList.remove('ok');
      return;
    }

    if (blocoEstaRecolhido(item.bloco)) {
      toggleBloco(item.bloco);
    }

    setTimeout(() => {
      const el = document.querySelector(`.menu-item[data-codigo="${item.codigo}"]`);
      if (el) {
        selecionarItemMenu(el, item);
        input.value = '';
        feedback.textContent = '';
        feedback.classList.remove('ok');
      }
    }, 50);
  });

  // Atalho Ctrl+K
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      input.focus();
      input.select();
    }
  });
}

// ============================================================
// AÇÕES GLOBAIS
// ============================================================
function expandirTodos() {
  setBlocosRecolhidos([]);
  montarMenu();
}

function recolherTodos() {
  setBlocosRecolhidos(Object.keys(MAPA_BLOCOS).map(Number));
  montarMenu();
}

function resetarPreferenciaMenu() {
  try { localStorage.removeItem(STORAGE_KEY_BLOCOS); } catch { /* ignore */ }
  montarMenu();
}

// ============================================================
// INICIALIZAÇÃO
// ============================================================
function initMenu() {
  const userLabel = document.getElementById('user-label');
  if (userLabel) userLabel.textContent = USUARIO_LOGADO.nome;

  const periodLabel = document.getElementById('period-label');
  if (periodLabel) {
    const filial = USUARIO_LOGADO.filial || '—';
    periodLabel.textContent = `Filial: ${filial}`;
  }

  montarMenu();
  configurarGoto();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMenu);
} else {
  initMenu();
}