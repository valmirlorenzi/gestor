(function () {
  'use strict';

  function getCsrfToken() {
    const m = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
    return m ? decodeURIComponent(m[1]) : '';
  }

  function bindTabs() {
    document.querySelectorAll('.tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.style.display = 'none');
        tab.classList.add('active');
        document.querySelector('#tab-' + tab.dataset.tab).style.display = '';
      });
    });
  }

  async function carregarTipos() {
    const tbody = document.querySelector('#tabela-tipos-cliente tbody');
    const vazio = document.getElementById('tipos-vazio');
    if (!tbody || !vazio) return;

    const resp = await fetch('/api/tipos-cliente', {
      headers: { 'Accept': 'application/json' },
      credentials: 'same-origin',
    });
    const tipos = await resp.json();

    if (tipos.length === 0) {
      tbody.innerHTML = '';
      vazio.style.display = '';
      return;
    }
    vazio.style.display = 'none';

    tbody.innerHTML = tipos.map(t => `
      <tr>
        <td>${t.descricao}</td>
        <td>${t.ativo ? 'Sim' : 'Não'}</td>
        <td>
          <button type="button" class="btn btn-danger" data-id="${t.id}" data-acao="excluir">Excluir</button>
        </td>
      </tr>
    `).join('');

    tbody.querySelectorAll('button[data-acao="excluir"]').forEach(btn => {
      btn.addEventListener('click', () => excluirTipo(parseInt(btn.dataset.id, 10)));
    });
  }

  async function excluirTipo(id) {
    if (!confirm('Excluir este tipo?')) return;

    const resp = await fetch('/api/tipos-cliente/' + id, {
      method: 'DELETE',
      headers: { 'Accept': 'application/json', 'X-XSRF-TOKEN': getCsrfToken() },
      credentials: 'same-origin',
    });

    if (resp.status === 204) { carregarTipos(); return; }
    alert('Erro ao excluir.');
  }

  async function carregarPrazos() {
    const tbody = document.querySelector('#tabela-prazos-venda tbody');
    const vazio = document.getElementById('prazos-vazio');
    if (!tbody || !vazio) return;

    const resp = await fetch('/api/prazos-padrao?tipo=venda', {
      headers: { 'Accept': 'application/json' },
      credentials: 'same-origin',
    });
    const prazos = await resp.json();

    if (prazos.length === 0) {
      tbody.innerHTML = '';
      vazio.style.display = '';
      return;
    }
    vazio.style.display = 'none';

    tbody.innerHTML = prazos.map(p => `
      <tr>
        <td>${p.descricao}</td>
        <td>${p.dias}</td>
        <td>${p.parcelas}</td>
        <td>${p.ativo ? 'Sim' : 'Não'}</td>
        <td>
          <button type="button" class="btn btn-danger" data-id="${p.id}" data-acao="excluir">Excluir</button>
        </td>
      </tr>
    `).join('');

    tbody.querySelectorAll('button[data-acao="excluir"]').forEach(btn => {
      btn.addEventListener('click', () => excluirPrazo(parseInt(btn.dataset.id, 10)));
    });
  }

  async function excluirPrazo(id) {
    if (!confirm('Excluir este prazo?')) return;

    const resp = await fetch('/api/prazos-padrao/' + id, {
      method: 'DELETE',
      headers: { 'Accept': 'application/json', 'X-XSRF-TOKEN': getCsrfToken() },
      credentials: 'same-origin',
    });

    if (resp.status === 204) { carregarPrazos(); return; }
    alert('Erro ao excluir.');
  }

  async function criarTipo() {
    const descricao = prompt('Descrição do novo tipo de cliente:');
    if (!descricao) return;

    const resp = await fetch('/api/tipos-cliente', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-XSRF-TOKEN': getCsrfToken(),
      },
      credentials: 'same-origin',
      body: JSON.stringify({ descricao: descricao, ativo: true }),
    });

    if (resp.status === 201) { carregarTipos(); return; }
    alert('Erro ao criar tipo.');
  }

  async function criarPrazo() {
    const descricao = prompt('Descrição do novo prazo:');
    if (!descricao) return;
    const dias = parseInt(prompt('Dias (0 para à vista):') || '0', 10);
    const parcelas = parseInt(prompt('Parcelas:') || '1', 10);

    const resp = await fetch('/api/prazos-padrao', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-XSRF-TOKEN': getCsrfToken(),
      },
      credentials: 'same-origin',
      body: JSON.stringify({ descricao, dias, parcelas, tipo: 'venda', ativo: true }),
    });

    if (resp.status === 201) { carregarPrazos(); return; }
    alert('Erro ao criar prazo.');
  }

  function init() {
    bindTabs();
    carregarTipos();
    carregarPrazos();
    document.getElementById('novo-tipo').addEventListener('click', criarTipo);
    document.getElementById('novo-prazo').addEventListener('click', criarPrazo);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();