/* ============================================================
   CONFIGURACAO.JS — Telas de configuração inicial
   Bloco 1: A1 (empresa), A8 (filial), A3 (centros), A6 (período)
   Depende de: geral.js (showScreen), dados-simulados.js (estado)
   ============================================================ */

/* ============================================================
   A1 — CADASTRAR EMPRESA (2 passos)
   ============================================================ */

let empresaStep = 1;

function empresaStep1() {
  return `
    <h1>Cadastrar empresa</h1>
    <p class="subtitle">Passo 1 de 2 — Dados da empresa</p>

    <div class="steps">
      <div class="step active">1. Dados da empresa</div>
      <div class="step">2. Plano de contas</div>
    </div>

    <div class="card">
      <h2>Regime fiscal *</h2>
      <div class="form-row">
        <label style="display:flex; align-items:center; gap:8px; font-weight:400;">
          <input type="radio" name="regime" value="simples" ${empresaData.regime==='simples'?'checked':''} onchange="empresaData.regime='simples'"> Simples Nacional
        </label>
        <label style="display:flex; align-items:center; gap:8px; font-weight:400;">
          <input type="radio" name="regime" value="presumido" ${empresaData.regime==='presumido'?'checked':''} onchange="empresaData.regime='presumido'"> Lucro Presumido
        </label>
        <label style="display:flex; align-items:center; gap:8px; font-weight:400;">
          <input type="radio" name="regime" value="real" ${empresaData.regime==='real'?'checked':''} onchange="empresaData.regime='real'"> Lucro Real
        </label>
      </div>
    </div>

    <div class="card">
      <h2>Setor *</h2>
      <div class="form-row">
        <label style="display:flex; align-items:center; gap:8px; font-weight:400;">
          <input type="radio" name="setor" value="comercio" ${empresaData.setor==='comercio'?'checked':''} onchange="empresaData.setor='comercio'"> Comércio
        </label>
        <label style="display:flex; align-items:center; gap:8px; font-weight:400;">
          <input type="radio" name="setor" value="servicos" ${empresaData.setor==='servicos'?'checked':''} onchange="empresaData.setor='servicos'"> Serviços
        </label>
        <label style="display:flex; align-items:center; gap:8px; font-weight:400;">
          <input type="radio" name="setor" value="misto" ${empresaData.setor==='misto'?'checked':''} onchange="empresaData.setor='misto'"> Misto
        </label>
      </div>
    </div>

    <div class="card">
      <h2>Dados gerais</h2>
      <div class="form-grid">
        <div class="form-row">
          <label>CNAE principal (opcional, recomendado)</label>
          <input type="text" placeholder="0000-0/00" value="${empresaData.cnae}" onchange="empresaData.cnae=this.value">
        </div>
        <div class="form-row">
          <label>Data de início de operação no sistema *</label>
          <input type="month" value="${empresaData.dataInicio}" onchange="empresaData.dataInicio=this.value">
        </div>
      </div>
    </div>

    <div class="form-actions">
      <button class="btn btn-primary" onclick="avancarEmpresa(2)">Próximo →</button>
    </div>
  `;
}

function empresaStep2() {
  return `
    <h1>Cadastrar empresa</h1>
    <p class="subtitle">Passo 2 de 2 — Plano de contas</p>

    <div class="steps">
      <div class="step done">1. Dados da empresa</div>
      <div class="step active">2. Plano de contas</div>
    </div>

    <div class="card">
      <h2>Plano de contas sugerido</h2>
      <p class="muted" style="margin-bottom:12px;">O plano já vem com estrutura, sub-tipos e mapeamento referencial (ECD/ECF) embutido.</p>
      <label style="display:flex; align-items:flex-start; gap:8px; padding:12px; border:1px solid var(--cor-borda); border-radius:8px; font-weight:400;">
        <input type="radio" name="plano" value="padrao" checked>
        <span>
          <strong>Plano Gerencial Padrão — Comércio e Serviços</strong><br>
          <span class="muted">Ativo, Passivo, Custos, Despesas, Receitas, Resultado Financeiro.</span>
        </span>
      </label>
    </div>

    <div class="card">
      <h2>Resumo</h2>
      <table class="data">
        <tr><td><strong>Regime fiscal</strong></td><td>${empresaData.regime || '—'}</td></tr>
        <tr><td><strong>Setor</strong></td><td>${empresaData.setor || '—'}</td></tr>
        <tr><td><strong>CNAE principal</strong></td><td>${empresaData.cnae || '—'}</td></tr>
        <tr><td><strong>Data de início</strong></td><td>${empresaData.dataInicio || '—'}</td></tr>
        <tr><td><strong>Plano de contas</strong></td><td>Gerencial Padrão</td></tr>
      </table>
    </div>

    <div class="form-actions">
      <button class="btn btn-secondary" onclick="avancarEmpresa(1)">← Voltar</button>
      <button class="btn btn-primary" onclick="concluirEmpresa()">Concluir cadastro</button>
    </div>
  `;
}

function avancarEmpresa(step) {
  if (step === 2) {
    if (!empresaData.regime || !empresaData.setor || !empresaData.dataInicio) {
      alert('Preencha regime fiscal, setor e data de início.');
      return;
    }
  }
  empresaStep = step;
  document.getElementById('content').innerHTML = step === 1 ? empresaStep1() : empresaStep2();
}

function concluirEmpresa() {
  document.getElementById('content').innerHTML = `
    <h1>Empresa configurada com sucesso</h1>
    <p class="subtitle">Próximo passo obrigatório: cadastrar a filial matriz</p>

    <div class="card">
      <h2>O que foi configurado</h2>
      <table class="data">
        <tr><td>✅</td><td>Regime fiscal <strong>${empresaData.regime}</strong> e setor <strong>${empresaData.setor}</strong></td></tr>
        <tr><td>✅</td><td>Plano de contas <strong>Gerencial Padrão</strong> ativado</td></tr>
        <tr><td>✅</td><td>Mapeamento referencial (ECD/ECF) embutido</td></tr>
        <tr><td>✅</td><td>Parâmetros fiscais e trabalhistas carregados</td></tr>
        <tr><td>⚠️</td><td><strong>Filial matriz pendente</strong> — obrigatória para começar a operar</td></tr>
      </table>
    </div>

    <div class="form-actions">
      <button class="btn btn-primary" onclick="showScreen('filial')">Cadastrar filial matriz →</button>
    </div>
  `;
}

screens['empresa'] = () => empresaStep === 1 ? empresaStep1() : empresaStep2();

/* ============================================================
   A8 — CADASTRAR FILIAL (simplificada)
   ============================================================ */

screens['filial'] = () => `
  <h1>Cadastrar filial</h1>
  <p class="subtitle">${empresaData.dataInicio ? 'Filial matriz (obrigatória)' : 'Filial adicional'}</p>

  <div class="card">
    <h2>Dados da filial</h2>
    <div class="form-grid">
      <div class="form-row">
        <label>CNPJ *</label>
        <input type="text" placeholder="00.000.000/0000-00" value="${filialForm.cnpj}" onchange="filialForm.cnpj=this.value">
      </div>
      <div class="form-row">
        <label>Razão Social *</label>
        <input type="text" value="${filialForm.razao}" onchange="filialForm.razao=this.value">
      </div>
      <div class="form-row">
        <label>Nome Fantasia</label>
        <input type="text" value="${filialForm.fantasia}" onchange="filialForm.fantasia=this.value">
      </div>
      <div class="form-row">
        <label>CNAE</label>
        <input type="text" placeholder="0000-0/00" value="${filialForm.cnae}" onchange="filialForm.cnae=this.value">
      </div>
      <div class="form-row">
        <label>Data de início *</label>
        <input type="month" value="${filialForm.dataInicio}" onchange="filialForm.dataInicio=this.value">
      </div>
    </div>
  </div>

  <div class="form-actions">
    <button class="btn btn-secondary" onclick="showScreen('empresa')">Cancelar</button>
    <button class="btn btn-primary" onclick="salvarFilial()">Cadastrar filial</button>
  </div>
`;

function salvarFilial() {
  if (!filialForm.cnpj || !filialForm.razao || !filialForm.dataInicio) {
    alert('Preencha CNPJ, Razão Social e Data de início.');
    return;
  }
  document.getElementById('content').innerHTML = `
    <h1>Filial cadastrada com sucesso</h1>
    <p class="subtitle">${empresaData.dataInicio ? 'Filial matriz criada' : 'Filial adicional criada'}</p>

    <div class="card">
      <h2>O que foi configurado</h2>
      <table class="data">
        <tr><td>✅</td><td>Filial <strong>${filialForm.razao}</strong> cadastrada (CNPJ ${filialForm.cnpj})</td></tr>
        <tr><td>✅</td><td>CNAE ${filialForm.cnae || '—'}</td></tr>
        <tr><td>✅</td><td>Período <strong>${filialForm.dataInicio}</strong> aberto</td></tr>
      </table>
    </div>

    <div class="form-actions">
      <button class="btn btn-secondary" onclick="resetarFilial(); showScreen('filial')">Cadastrar outra filial</button>
      <button class="btn btn-primary" onclick="showScreen('centros')">Continuar → Centros de custo</button>
    </div>
  `;
}

function resetarFilial() {
  filialForm.cnpj = '';
  filialForm.razao = '';
  filialForm.fantasia = '';
  filialForm.cnae = '';
  filialForm.dataInicio = '';
}

/* ============================================================
   A3 — CENTROS DE CUSTO E ÁREAS DE NEGÓCIO
   ============================================================ */

screens['centros'] = () => `
  <h1>Centros de custo e áreas de negócio</h1>
  <p class="subtitle">Agrupe centros em áreas para análise gerencial</p>

  <div class="card">
    <h2>Centros de custo</h2>
    <table class="data">
      <thead><tr><th>Nome</th><th>Responsável</th><th>Status</th><th></th></tr></thead>
      <tbody>
        <tr><td>Comercial</td><td>João Silva</td><td><span class="badge badge-ok">Ativo</span></td><td>Editar</td></tr>
        <tr><td>Administrativo</td><td>Maria Souza</td><td><span class="badge badge-ok">Ativo</span></td><td>Editar</td></tr>
        <tr><td>Logística</td><td>Pedro Lima</td><td><span class="badge badge-ok">Ativo</span></td><td>Editar</td></tr>
      </tbody>
    </table>
    <div class="form-actions" style="justify-content:flex-start; margin-top:14px;">
      <button class="btn btn-primary">+ Novo centro de custo</button>
    </div>
  </div>

  <div class="card">
    <h2>Áreas de negócio</h2>
    <table class="data">
      <thead><tr><th>Nome</th><th>Centros vinculados</th><th>Status</th><th></th></tr></thead>
      <tbody>
        <tr><td>Comercial</td><td>Vendas SP, Vendas RJ, Marketing</td><td><span class="badge badge-ok">Ativo</span></td><td>Editar</td></tr>
        <tr><td>Operações</td><td>Logística, Produção</td><td><span class="badge badge-ok">Ativo</span></td><td>Editar</td></tr>
        <tr><td>Administrativo</td><td>Financeiro, RH, Diretoria</td><td><span class="badge badge-ok">Ativo</span></td><td>Editar</td></tr>
      </tbody>
    </table>
    <div class="form-actions" style="justify-content:flex-start; margin-top:14px;">
      <button class="btn btn-primary">+ Nova área de negócio</button>
    </div>
  </div>
`;

/* ============================================================
   A6 — PERÍODO (abrir/fechar)
   ============================================================ */

screens['periodo'] = () => `
  <h1>Período</h1>
  <p class="subtitle">Abrir, fechar e consultar períodos por filial</p>

  <div class="card">
    <h2>Período atual</h2>
    <table class="data">
      <tr><td><strong>Filial</strong></td><td>Matriz</td></tr>
      <tr><td><strong>Mês/Ano</strong></td><td>10/2026</td></tr>
      <tr><td><strong>Status</strong></td><td><span class="badge badge-ok">Aberto</span></td></tr>
      <tr><td><strong>Pendências</strong></td><td>3 avisos, 0 erros</td></tr>
    </table>
  </div>

  <div class="card">
    <h2>Fechamento</h2>
    <p class="muted" style="margin-bottom:12px;">
      O fechamento executa o checklist de pendências (T6), consolida folha, depreciação e provisões,
      congela o período e abre automaticamente o próximo.
    </p>
    <table class="data">
      <tr><td><span class="badge badge-warn">Aviso</span></td><td>3 contas a pagar vencidas e não baixadas</td></tr>
      <tr><td><span class="badge badge-ok">OK</span></td><td>Folha consolidada</td></tr>
      <tr><td><span class="badge badge-ok">OK</span></td><td>Depreciação lançada</td></tr>
      <tr><td><span class="badge badge-ok">OK</span></td><td>Provisões calculadas</td></tr>
    </table>
    <div class="form-actions">
      <button class="btn btn-secondary">Ver pendências</button>
      <button class="btn btn-primary" onclick="fecharPeriodo()">Fechar período</button>
    </div>
  </div>
`;

function fecharPeriodo() {
  alert('Período 10/2026 fechado. 11/2026 aberto.');
}