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
        <a href="/usuarios/${u.id}/edit" class="btn btn-secondary">Editar</a>
        <a href="/usuarios/${u.id}/atores" class="btn btn-secondary">Atores</a>
        <button type="button" class="btn btn-danger" data-id="${u.id}" data-acao="excluir">Excluir</button>
      </td>
    </tr>
  `).join('');

  tbody.querySelectorAll('button[data-acao="excluir"]').forEach(btn => {
    btn.addEventListener('click', () => excluir(parseInt(btn.dataset.id, 10)));
  });
}

async function excluir(id) {
  if (!confirm('Excluir este usuário? Ele sairá da lista e não poderá ser recuperado pela interface.')) return;

  try {
    const resp = await fetch('/api/usuarios/' + id, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'X-XSRF-TOKEN': getCsrfToken(),
      },
      credentials: 'same-origin',
    });

    if (resp.status === 204) {
      carregarUsuarios();
      return;
    }

    const err = await resp.json();
    alert('Erro ao excluir: ' + JSON.stringify(err.errors || err.message || err));
  } catch (e) {
    alert('Erro ao excluir: ' + e.message);
  }
}

function getCsrfToken() {
  const m = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
  return m ? decodeURIComponent(m[1]) : '';
}