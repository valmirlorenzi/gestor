/* ============================================================
   SELETOR DE ATOR — modo demonstração do wireframe
   Troca o ator logado, re-monta o menu, redireciona para a
   tela inicial do ator e persiste no localStorage.
   ============================================================ */

const STORAGE_KEY_ATOR = 'wireframe_ator_atual';

// Lista de atores disponíveis no wireframe (com nome, ícone e tela inicial)
const ATORES_WIREFRAME = [
  { codigo: 'configurador',        nome: 'Configurador',        icone: '⚙️', telaInicial: 'empresa' },
  { codigo: 'administrador',       nome: 'Administrador',       icone: '👔', telaInicial: 'dre' },
  { codigo: 'contador',            nome: 'Contador',            icone: '🧮', telaInicial: 'revisao-lancamentos' },
  { codigo: 'comprador',           nome: 'Comprador',           icone: '🛒', telaInicial: 'fornecedores' },
  { codigo: 'faturista',           nome: 'Faturista',           icone: '🧾', telaInicial: 'clientes' },
  { codigo: 'financeiro1',         nome: 'Financeiro1 (Pagar)', icone: '💸', telaInicial: 'contas-pagar' },
  { codigo: 'financeiro2',         nome: 'Financeiro2 (Receber)', icone: '💰', telaInicial: 'contas-receber' },
  { codigo: 'gerente_financeiro',  nome: 'Gerente Financeiro',  icone: '🏦', telaInicial: 'validar-saidas' },
  { codigo: 'rh',                  nome: 'RH',                  icone: '👥', telaInicial: 'funcionarios' },
  { codigo: 'auditor',             nome: 'Auditor',             icone: '🔍', telaInicial: 'auditoria' },
];

// Nomes de exibição (para o seletor)
const NOMES_ATOR = {
  configurador: 'Carlos (Configurador)',
  administrador: 'Roberto (Administrador)',
  contador: 'Ana Souza (Contador)',
  comprador: 'Bruno Lima (Comprador)',
  faturista: 'Mariana (Faturista)',
  financeiro1: 'Paulo (Financeiro1)',
  financeiro2: 'Fernanda (Financeiro2)',
  gerente_financeiro: 'Ricardo (Gerente Financeiro)',
  rh: 'Juliana (RH)',
  auditor: 'Eduardo (Auditor)',
};

// ============================================================
// INICIALIZAÇÃO
// ============================================================

function getAtorAtual() {
  try {
    const a = localStorage.getItem(STORAGE_KEY_ATOR);
    return ATORES_WIREFRAME.some(x => x.codigo === a) ? a : 'configurador';
  } catch {
    return 'configurador';
  }
}

function setAtorAtual(codigo) {
  try {
    localStorage.setItem(STORAGE_KEY_ATOR, codigo);
  } catch {
    /* ignore */
  }
}

function getInfoAtor(codigo) {
  return ATORES_WIREFRAME.find(a => a.codigo === codigo) || ATORES_WIREFRAME[0];
}

// ============================================================
// SINCRONIZAÇÃO DOS DOIS OBJETOS
// ============================================================

/**
 * Sincroniza USUARIO_LOGADO (menu.js) e USUARIO_ORDENS (dados-simulados.js)
 * com o ator selecionado.
 *
 * O configurador vê todos os blocos; os demais veem o seu bloco + Meu Trabalho.
 */
function sincronizarUsuario(codigo) {
  const info = getInfoAtor(codigo);

  // Sincroniza USUARIO_ORDENS (dados-simulados.js)
  if (typeof USUARIO_ORDENS !== 'undefined') {
    USUARIO_ORDENS.nome = NOMES_ATOR[codigo] || info.nome;
    USUARIO_ORDENS.ator = codigo;
    USUARIO_ORDENS.filial = 'Matriz';
  }

  // Sincroniza USUARIO_LOGADO (menu.js)
  if (typeof USUARIO_LOGADO !== 'undefined') {
    USUARIO_LOGADO.nome = NOMES_ATOR[codigo] || info.nome;
    USUARIO_LOGADO.atores_por_filial = {
      1: [codigo],   // filial 1
    };
    USUARIO_LOGADO.filial_atual = 1;
  }
}

// ============================================================
// SELEÇÃO DE ATOR
// ============================================================

function trocarAtor(codigo) {
  const info = getInfoAtor(codigo);
  setAtorAtual(codigo);
  sincronizarUsuario(codigo);

  // Re-monta o menu (com o novo ator)
  if (typeof montarMenu === 'function') {
    montarMenu();
  }

  // Atualiza o rótulo do usuário no topo da sidebar
  const userLabel = document.getElementById('user-label');
  if (userLabel) userLabel.textContent = NOMES_ATOR[codigo] || info.nome;

  // Redireciona para a tela inicial do ator
  if (typeof showScreen === 'function') {
    showScreen('tela-inicial');
  }

  // Atualiza o seletor (marca a opção ativa)
  atualizarSeletorAtor(codigo);
}

// ============================================================
// RENDERIZAÇÃO DO SELETOR
// ============================================================

function renderSeletorAtor() {
  const atorAtual = getAtorAtual();
  const info = getInfoAtor(atorAtual);

  return `
    <div class="seletor-ator" id="seletor-ator">
      <button class="seletor-ator-btn" onclick="toggleDropdownAtor(event)" title="Alternar ator (Ctrl+Shift+A)">
        <span class="seletor-ator-icone">${info.icone}</span>
        <span class="seletor-ator-nome">${NOMES_ATOR[atorAtual] || info.nome}</span>
        <span class="seletor-ator-seta">▼</span>
      </button>
      <div class="seletor-ator-dropdown" id="seletor-ator-dropdown">
        <div class="seletor-ator-titulo">Alternar ator (demonstração)</div>
        ${ATORES_WIREFRAME.map(a => `
          <div class="seletor-ator-item ${a.codigo === atorAtual ? 'ativo' : ''}"
               onclick="trocarAtor('${a.codigo}')">
            <span class="seletor-ator-icone">${a.icone}</span>
            <span class="seletor-ator-item-nome">${a.nome}</span>
            ${a.codigo === atorAtual ? '<span class="seletor-ator-check">✓</span>' : ''}
          </div>
        `).join('')}
        <div class="seletor-ator-rodape">
          <small>O ator define o menu e as ordens visíveis.<br>No sistema real, vem do login.</small>
        </div>
      </div>
    </div>
  `;
}

function toggleDropdownAtor(event) {
  if (event) event.stopPropagation();
  const dd = document.getElementById('seletor-ator-dropdown');
  if (!dd) return;
  dd.classList.toggle('aberto');
}

function atualizarSeletorAtor(codigo) {
  const info = getInfoAtor(codigo);
  const btn = document.querySelector('.seletor-ator-btn');
  if (btn) {
    btn.innerHTML = `
      <span class="seletor-ator-icone">${info.icone}</span>
      <span class="seletor-ator-nome">${NOMES_ATOR[codigo] || info.nome}</span>
      <span class="seletor-ator-seta">▼</span>
    `;
  }
  // Fecha o dropdown
  const dd = document.getElementById('seletor-ator-dropdown');
  if (dd) dd.classList.remove('aberto');
}

// ============================================================
// FECHAR DROPDOWN AO CLICAR FORA
// ============================================================

function initSeletorAtor() {
  // Renderiza o seletor
  const container = document.getElementById('seletor-ator-container');
  if (container) {
    container.innerHTML = renderSeletorAtor();
  }    
  // Sincroniza o usuário com o ator atual (do localStorage ou 'configurador')
  const atorAtual = getAtorAtual();
  sincronizarUsuario(atorAtual);

  // Fecha o dropdown ao clicar fora
  document.addEventListener('click', (e) => {
    const seletor = document.getElementById('seletor-ator');
    if (seletor && !seletor.contains(e.target)) {
      const dd = document.getElementById('seletor-ator-dropdown');
      if (dd) dd.classList.remove('aberto');
    }
  });

  // Atalho Ctrl+Shift+A
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'A') {
      e.preventDefault();
      const dd = document.getElementById('seletor-ator-dropdown');
      if (dd) dd.classList.toggle('aberto');
    }
  });

  // Atualiza o label do usuário
  const userLabel = document.getElementById('user-label');
  if (userLabel) {
    userLabel.textContent = NOMES_ATOR[atorAtual] || getInfoAtor(atorAtual).nome;
  }

  // Abre a Tela Inicial ao carregar a página
  if (typeof showScreen === 'function') {
    showScreen('tela-inicial');
  }  
}

// ============================================================
// EXECUÇÃO
// ============================================================

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSeletorAtor);
} else {
  initSeletorAtor();
}

// Renderiza o seletor no container
const container = document.getElementById('seletor-ator-container');
if (container) {
  container.innerHTML = renderSeletorAtor();
}

