/* ============================================================
   MENU — montagem por ator, numeração, campo "Ir para",
           expandir/recolher blocos, badge, reset
   Depende de: menu-dados.js
   ============================================================ */

// ============================================================
// ESTADO DO USUÁRIO (mock — wireframe)
// ============================================================
const USUARIO_LOGADO = {
  nome: 'Configurador (Maria)',
  // No wireframe, o Configurador vê tudo. Por isso só tem a tag dele.
  atores_por_filial: {
    1: ['configurador'],   // filial 1 (Matriz)
  },
  filial_atual: 1,
};

// ============================================================
// ESTADO DAS ORDENS (mock — wireframe)
// ============================================================
const ORDENS_PENDENTES = {
  total: 3,
  urgentes: 1,
};

// ============================================================
// ESTADO DOS BLOCOS (expandido/recolhido)
// Persistido em localStorage.
// Na 1ª vez: apenas o bloco 1 (Meu Trabalho) aberto; os demais fechados.
// ============================================================
const STORAGE_KEY_BLOCOS = 'menu_blocos_recolhidos';

function getBlocosRecolhidos() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_BLOCOS);
    // Se nunca foi salvo, inicia com todos fechados EXCETO o bloco 1
    if (raw === null) {
      return Object.keys(MENU_BLOCOS)
        .map(Number)
        .filter(id => id !== 1);   // 1 = Meu Trabalho
    }
    return JSON.parse(raw);
  } catch {
    return Object.keys(MENU_BLOCOS)
      .map(Number)
      .filter(id => id !== 1);
  }
}

function setBlocosRecolhidos(ids) {
  try {
    localStorage.setItem(STORAGE_KEY_BLOCOS, JSON.stringify(ids));
  } catch {
    /* ignore */
  }
}

function blocoEstaRecolhido(blocoId) {
  return getBlocosRecolhidos().includes(Number(blocoId));
}

function toggleBloco(blocoId) {
  const recolhidos = getBlocosRecolhidos();
  const id = Number(blocoId);
  const idx = recolhidos.indexOf(id);
  if (idx >= 0) {
    recolhidos.splice(idx, 1);   // estava recolhido → expande
  } else {
    recolhidos.push(id);          // estava expandido → recolhe
  }
  setBlocosRecolhidos(recolhidos);
  montarMenu(); // re-renderiza
}

// ============================================================
// PERMISSÕES
// ============================================================
function getAtoresDoUsuario() {
  const filial = USUARIO_LOGADO.filial_atual;
  return USUARIO_LOGADO.atores_por_filial[filial] || [];
}

function usuarioTemAcesso(item) {
  const atores = getAtoresDoUsuario();
  if (atores.includes('configurador')) return true; // configurador vê tudo
  if (item.atores.includes('*')) return true;       // itens de "todos"
  return item.atores.some(a => atores.includes(a));
}

// ============================================================
// MONTAGEM DO MENU
// ============================================================
function montarMenu() {
  const nav = document.getElementById('menu');
  if (!nav) return;

  nav.innerHTML = '';

  // Agrupar itens por bloco (respeitando permissões)
  const porBloco = {};
  MENU_ITENS.forEach(item => {
    if (!usuarioTemAcesso(item)) return;
    if (!porBloco[item.bloco]) porBloco[item.bloco] = [];
    porBloco[item.bloco].push(item);
  });

  // Renderizar na ordem dos blocos
  Object.keys(porBloco)
    .map(Number)
    .sort((a, b) => a - b)
    .forEach(blocoId => {
      const bloco = MENU_BLOCOS[blocoId];
      if (!bloco) return;

      const recolhido = blocoEstaRecolhido(blocoId);

      // Wrapper do bloco
      const wrapper = document.createElement('div');
      wrapper.className = 'menu-bloco' + (recolhido ? ' recolhido' : '');
      wrapper.dataset.bloco = blocoId;

      // Cabeçalho do bloco (clicável para expandir/recolher)
      const section = document.createElement('div');
      section.className = 'menu-section';
      section.innerHTML = `
        <span class="section-toggle">${recolhido ? '▶' : '▼'}</span>
        <span class="section-icon">${bloco.icone}</span>
        <span class="section-name">${bloco.nome}</span>
      `;
      section.addEventListener('click', () => toggleBloco(blocoId));
      wrapper.appendChild(section);

      // Itens do bloco (escondidos se recolhido)
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
  const rotaAtual = window.__rotaAtual || null;
  if (rotaAtual) {
    const ativo = nav.querySelector(`.menu-item[data-rota="${rotaAtual}"]`);
    if (ativo) ativo.classList.add('active');
  }
}

// Rotas que já são Blade (backend real). As demais continuam mock (showScreen).
const ROTAS_BLADE = {
  'empresa': '/empresa',
  'filial':  '/filial',
};

function selecionarItemMenu(el, item) {
  document.querySelectorAll('.menu-item.active').forEach(x => x.classList.remove('active'));
  el.classList.add('active');
  window.__rotaAtual = item.rota;

  // Se a rota é Blade, navega de verdade (recarrega a página).
  if (ROTAS_BLADE[item.rota]) {
    window.location.href = ROTAS_BLADE[item.rota];
    return;
  }

  // Senão, mantém o comportamento SPA do wireframe — mas só se a tela existir.
  if (typeof showScreen === 'function' && typeof screens !== 'undefined' && screens[item.rota]) {
    showScreen(item.rota);
  } else {
    alert('Tela ainda não implementada. Disponível no Bloco 6/7.');
  }
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

    const matches = MENU_ITENS.filter(i =>
      i.codigo.startsWith(val) && usuarioTemAcesso(i)
    );

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

    const item = MENU_ITENS.find(i => i.codigo === val);
    if (!item) {
      feedback.textContent = 'Código não encontrado';
      feedback.classList.remove('ok');
      return;
    }

    if (!usuarioTemAcesso(item)) {
      feedback.textContent = 'Você não tem permissão para acessar esta tela.';
      feedback.classList.remove('ok');
      return;
    }

    if (item.fase === 2) {
      feedback.textContent = 'Este recurso estará disponível na fase 2.';
      feedback.classList.remove('ok');
      return;
    }

    // Se o bloco estiver recolhido, expandir
    if (blocoEstaRecolhido(item.bloco)) {
      toggleBloco(item.bloco);
    }

    // Aguardar o re-render e navegar
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
// AÇÕES GLOBAIS (expandir/recolher todos, reset)
// ============================================================
function expandirTodos() {
  setBlocosRecolhidos([]);
  montarMenu();
}

function recolherTodos() {
  const todos = Object.keys(MENU_BLOCOS).map(Number);
  setBlocosRecolhidos(todos);
  montarMenu();
}

function resetarPreferenciaMenu() {
  // Remove a preferência salva → volta ao estado inicial
  // (opção C: bloco 1 aberto, demais fechados)
  try {
    localStorage.removeItem(STORAGE_KEY_BLOCOS);
  } catch {
    /* ignore */
  }
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
    periodLabel.textContent = `Período: 10/2026 (Aberto) · Filial: Matriz`;
  }

  montarMenu();
  configurarGoto();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMenu);
} else {
  initMenu();
}