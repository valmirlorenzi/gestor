(function () {
    'use strict';

    const state = { id: null };

    function getCsrfToken() {
        const m = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
        return m ? decodeURIComponent(m[1]) : '';
    }

    function alternarTipo() {
        const tipo = document.getElementById('tipo').value;
        document.getElementById('bloco-pf').style.display = (tipo === 'PF') ? '' : 'none';
        document.getElementById('bloco-pj').style.display = (tipo === 'PJ') ? '' : 'none';
    }

    function coletarDados() {
        const tipo = document.getElementById('tipo').value;

        const dados = {
            tipo,
            documento:  document.getElementById('documento').value.trim(),
            nome:       document.getElementById('nome').value.trim(),
            email:      document.getElementById('email').value.trim() || null,
            telefone:   document.getElementById('telefone').value.trim() || null,
            ativo:      document.getElementById('ativo').value === '1',
            categoria:  document.getElementById('categoria').value.trim() || null,
        };

        if (tipo === 'PF') {
            const dn = document.getElementById('data_nascimento').value;
            dados.data_nascimento = dn || null;
        } else {
            const nf = document.getElementById('nome_fantasia').value.trim();
            const im = document.getElementById('id_municipio').value.trim();
            const cp = document.getElementById('categoria_padrao').value.trim();
            const pp = document.getElementById('prazo_padrao_dias').value.trim();

            dados.nome_fantasia     = nf || null;
            dados.id_municipio      = im ? Number(im) : null;
            dados.categoria_padrao  = cp || null;
            dados.prazo_padrao_dias = pp ? Number(pp) : null;
        }

        return dados;
    }

    async function carregar() {
        if (!state.id) return;

        const resp = await fetch('/api/fornecedores/' + state.id, {
            headers: { 'Accept': 'application/json' },
            credentials: 'same-origin',
        });

        if (!resp.ok) {
            alert('Fornecedor não encontrado.');
            return;
        }

        const p = await resp.json();

        document.getElementById('tipo').value       = p.tipo;
        document.getElementById('documento').value  = p.documento;
        document.getElementById('nome').value       = p.nome;
        document.getElementById('email').value      = p.email || '';
        document.getElementById('telefone').value   = p.telefone || '';
        document.getElementById('ativo').value      = p.ativo ? '1' : '0';

        if (p.dados_extras && p.dados_extras.categoria) {
            document.getElementById('categoria').value = p.dados_extras.categoria;
        }

        if (p.tipo === 'PF') {
            if (p.fisica && p.fisica.data_nascimento) {
                document.getElementById('data_nascimento').value = String(p.fisica.data_nascimento).slice(0, 10);
            }
        } else if (p.juridica) {
            document.getElementById('nome_fantasia').value     = p.juridica.nome_fantasia || '';
            document.getElementById('id_municipio').value      = p.juridica.id_municipio || '';
            document.getElementById('categoria_padrao').value  = p.juridica.categoria_padrao || '';
            document.getElementById('prazo_padrao_dias').value = p.juridica.prazo_padrao_dias || '';
        }

        alternarTipo();
    }

    async function salvar() {
        const dados = coletarDados();

        if (!dados.documento) { alert('Informe o documento.'); return; }
        if (!dados.nome)      { alert('Informe o nome.'); return; }
        if (dados.tipo === 'PF' && !dados.data_nascimento) {
            alert('Informe a data de nascimento.');
            return;
        }

        const url = state.id
            ? '/api/fornecedores/' + state.id
            : '/api/fornecedores';
        const metodo = state.id ? 'PUT' : 'POST';

        try {
            const resp = await fetch(url, {
                method: metodo,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-XSRF-TOKEN': getCsrfToken(),
                },
                credentials: 'same-origin',
                body: JSON.stringify(dados),
            });

            if (!resp.ok) {
                const err = await resp.json().catch(() => ({}));
                alert('Erro: ' + JSON.stringify(err.errors || err.message || err));
                return;
            }

            window.location.href = '/comprador/fornecedores';
        } catch (err) {
            alert('Erro: ' + (err.message || err));
        }
    }

    function init() {
        const app = document.getElementById('fornecedores-form-app');
        state.id = app.dataset.id ? Number(app.dataset.id) : null;

        document.getElementById('tipo').addEventListener('change', alternarTipo);
        document.getElementById('btn-salvar').addEventListener('click', salvar);

        alternarTipo();

        if (state.id) {
            carregar();
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();