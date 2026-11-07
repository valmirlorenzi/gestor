/* ============================================================
   IMPORTACOES.JS — UI 12.6 (motor A cadastro + motor B documento)
   ============================================================ */

(function () {
  'use strict';

  function getCsrfToken() {
    const m = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
    return m ? decodeURIComponent(m[1]) : '';
  }

  function lerArquivo(input) {
    return new Promise((resolve, reject) => {
      const file = input.files && input.files[0];
      if (!file) { reject(new Error('Nenhum arquivo selecionado.')); return; }
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ''));
      reader.onerror = () => reject(new Error('Falha ao ler o arquivo.'));
      reader.readAsText(file, 'UTF-8');
    });
  }

  function htmlRelatorio(data) {
    if (!data || !data.linhas || data.linhas.length === 0) return '';
    return data.linhas.map((l) => `
      <tr>
        <td>${l.numero_linha}</td>
        <td>${l.status}</td>
        <td>${l.motivo || '—'}</td>
        <td>${(l.avisos && l.avisos.length) ? l.avisos.join(' • ') : '—'}</td>
        <td>${l.id_registro ?? '—'}</td>
      </tr>
    `).join('');
  }

  async function chamarJson(url, payload) {
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-XSRF-TOKEN': getCsrfToken(),
      },
      credentials: 'same-origin',
      body: JSON.stringify(payload),
    });
    const data = await resp.json().catch(() => ({}));
    if (!resp.ok) {
      throw new Error(data.message || ('HTTP ' + resp.status));
    }
    return data;
  }

  async function preValidar(tipo) {
    const recurso = document.getElementById(tipo + '-recurso').value;
    const modoEl = document.getElementById(tipo + '-modo');
    const modo = modoEl ? modoEl.value : undefined;
    const input = document.getElementById(tipo + '-arquivo');
    const relTbody = document.querySelector('#' + tipo + '-relatorio tbody');
    const vazio = document.getElementById(tipo + '-vazio');
    const btnConfirmar = document.getElementById(tipo + '-confirmar');

    let conteudo;
    try { conteudo = await lerArquivo(input); }
    catch (e) { alert(e.message); return; }

    const payload = { recurso, conteudo };
    if (modo) payload.modo = modo;

    try {
      const data = await chamarJson('/api/importacoes/pre-validar', payload);
      relTbody.innerHTML = htmlRelatorio(data);
      vazio.style.display = data.linhas.length ? 'none' : '';
      btnConfirmar.disabled = data.aceitas + data.avisos === 0;
    } catch (e) {
      alert('Erro na pré-validação: ' + e.message);
    }
  }

  async function confirmar(tipo) {
    const recurso = document.getElementById(tipo + '-recurso').value;
    const modoEl = document.getElementById(tipo + '-modo');
    const modo = modoEl ? modoEl.value : undefined;
    const input = document.getElementById(tipo + '-arquivo');
    const relTbody = document.querySelector('#' + tipo + '-relatorio tbody');
    const btnConfirmar = document.getElementById(tipo + '-confirmar');

    let conteudo;
    try { conteudo = await lerArquivo(input); }
    catch (e) { alert(e.message); return; }

    const payload = { recurso, conteudo };
    if (modo) payload.modo = modo;

    try {
      const data = await chamarJson('/api/importacoes/confirmar', payload);
      relTbody.innerHTML = htmlRelatorio(data);
      btnConfirmar.disabled = true;
      alert(`Importação concluída: ${data.aceitas} aceitas, ${data.avisos} avisos, ${data.rejeitadas} rejeitadas.`);
    } catch (e) {
      alert('Erro ao confirmar: ' + e.message);
    }
  }

  function baixarTemplate(tipo) {
    const recurso = document.getElementById(tipo + '-recurso').value;
    window.location.href = '/api/importacoes/template/' + encodeURIComponent(recurso);
  }

  function bind(tipo) {
    const btnPre = document.getElementById(tipo + '-pre-validar');
    const btnConf = document.getElementById(tipo + '-confirmar');
    const btnTpl = document.getElementById(tipo + '-baixar-template');
    if (btnPre) btnPre.addEventListener('click', () => preValidar(tipo));
    if (btnConf) btnConf.addEventListener('click', () => confirmar(tipo));
    if (btnTpl) btnTpl.addEventListener('click', () => baixarTemplate(tipo));

    const selRec = document.getElementById(tipo + '-recurso');
    if (selRec) {
      selRec.addEventListener('change', () => {
        btnConf.disabled = true;
        document.querySelector('#' + tipo + '-relatorio tbody').innerHTML = '';
      });
    }
  }

  function init() {
    if (!document.getElementById('importacoes-app')) return;
    bind('cadastro');
    bind('documento');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();