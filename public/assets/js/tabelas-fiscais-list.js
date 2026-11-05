(function () {
  'use strict';

  function formatarData(iso) {
    if (!iso) return '—';
    const d = iso.slice(0, 10);
    const [y, m, day] = d.split('-');
    return `${day}/${m}/${y}`;
  }

  async function carregarParametros() {
    const tbody = document.querySelector('#tabela-parametros tbody');
    const vazio = document.getElementById('parametros-vazio');
    if (!tbody || !vazio) return;

    const resp = await fetch('/api/parametros-fiscais', {
      headers: { 'Accept': 'application/json' },
      credentials: 'same-origin',
    });
    const params = await resp.json();

    if (params.length === 0) {
      tbody.innerHTML = '';
      vazio.style.display = '';
      return;
    }
    vazio.style.display = 'none';

    tbody.innerHTML = params.map(p => {
      const escopo = p.id_empresa === null
        ? '<span class="badge badge-info">Global</span>'
        : '<span class="badge badge-aviso">Empresa</span>';

      const vigencia = p.data_fim_validade
        ? `${formatarData(p.data_inicio_validade)} — ${formatarData(p.data_fim_validade)}`
        : `${formatarData(p.data_inicio_validade)} →`;

      return `
        <tr>
          <td><span class="badge badge-info">${p.tipo_imposto}</span></td>
          <td>${p.descricao}</td>
          <td><strong>${parseFloat(p.aliquota).toFixed(2)}%</strong></td>
          <td class="muted">${vigencia}</td>
          <td>${escopo}</td>
          <td>
            <a href="/contador/tabelas-fiscais/${p.id}/edit" class="btn btn-secondary">Editar</a>
          </td>
        </tr>
      `;
    }).join('');
  }

  function init() {
    carregarParametros();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();