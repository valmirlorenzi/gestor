/* ============================================================
   ACESSIBILIDADE — tamanho de fonte
   ============================================================ */

const STORAGE_KEY_FONTE = 'acessibilidade_fonte';
const FONTES_VALIDAS = ['pequena', 'media', 'grande', 'extra'];
const FONTE_PADRAO = 'media';

function getFonteAtual() {
  try {
    const f = localStorage.getItem(STORAGE_KEY_FONTE);
    return FONTES_VALIDAS.includes(f) ? f : FONTE_PADRAO;
  } catch {
    return FONTE_PADRAO;
  }
}

function setFonte(tamanho) {
  if (!FONTES_VALIDAS.includes(tamanho)) tamanho = FONTE_PADRAO;
  try {
    localStorage.setItem(STORAGE_KEY_FONTE, tamanho);
  } catch {
    /* ignore */
  }
  aplicarFonte(tamanho);
  atualizarBotoesFonte(tamanho);
}

function aplicarFonte(tamanho) {
  document.body.classList.remove(
    'fonte-pequena', 'fonte-media', 'fonte-grande', 'fonte-extra'
  );
  document.body.classList.add('fonte-' + tamanho);
}

function atualizarBotoesFonte(tamanho) {
  document.querySelectorAll('.font-switcher button').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.fonte === tamanho);
  });
}

function initFonte() {
  const f = getFonteAtual();
  aplicarFonte(f);
  atualizarBotoesFonte(f);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initFonte);
} else {
  initFonte();
}