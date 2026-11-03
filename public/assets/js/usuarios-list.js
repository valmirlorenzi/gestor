(function () {
  'use strict';

  async function carregarUsuarios() {
    const tbody = document.querySelector('#tabela-usuarios tbody');
    const vazio = document.getElementById('usuario-vazio');
    if (!tbody || !vazio) return;

    const resp = await fetch('/api/usuarios', {
      headers: { 'Accept': 'application/json' },
      credentials: 'same-origin',
    });
    const usuarios = await resp.json();

    if (usuarios.length === 0) {
      tbody.innerHTML = '';
      vazio.style.display = '';
      return;
    }
    vazio.style.display = 'none';

    tbody.innerHTML = usuarios.map(u => `
      <tr>
        <td>${u.nome}</td>
        <td>${u.email}</td>
        <td>${u.ativo ? 'Sim' : 'Não'}</td>
        <td>
          <a href="/usuarios/${u.id}/edit" class="btn btn-sm btn-secondary">Editar</a>
          <a href="/usuarios/${u.id}/atores" class="btn btn-sm btn-secondary">Atores</a>
        </td>
      </tr>
    `).join('');
  }

  function init() {
    carregarUsuarios();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();