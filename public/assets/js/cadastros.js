/* ============================================================
   CADASTROS.JS — Parte 1
   Usuários, Clientes, Fornecedores, Produtos/Serviços.
   ============================================================ */

/* ============================================================
   USUÁRIOS
   ============================================================ */

screens['usuarios'] = () => `
  <h1>Usuários</h1>
  <p class="subtitle">Cadastro com tags de ator e filiais habilitadas</p>

  <div class="card">
    <table class="data">
      <thead><tr><th>Nome</th><th>Email</th><th>Atores</th><th>Filiais</th><th>Status</th><th></th></tr></thead>
      <tbody>
        ${usuarios.map(u => `
          <tr>
            <td><strong>${u.nome}</strong></td>
            <td>${u.email}</td>
            <td>${u.atores.map(a => `<span class="badge badge-ok">${nomeAtor(a)}</span>`).join(' ')}</td>
            <td>${u.filiais.map(f => nomeFilial(f)).join(', ')}</td>
            <td>${u.ativo ? '<span class="badge badge-ok">Ativo</span>' : '<span class="badge badge-err">Inativo</span>'}</td>
            <td><a href="#" onclick="editarUsuario(${u.id}); return false;">Editar</a></td>
          </tr>
        `).join('')}
      </tbody>
    </table>
    <div class="form-actions" style="justify-content:flex-start; margin-top:14px;">
      <button class="btn btn-primary" onclick="novoUsuario()">+ Novo usuário</button>
    </div>
  </div>
`;

function nomeAtor(codigo) {
  const a = ATORES.find(x => x.codigo === codigo);
  return a ? a.nome : codigo;
}

function nomeFilial(id) {
  const f = FILIAIS_SIMULADAS.find(x => x.id === id);
  return f ? f.nome : '—';
}

function novoUsuario() {
  usuarioForm = { id: null, nome: '', email: '', atores: [], filiais: [], ativo: true };
  document.getElementById('content').innerHTML = usuarioFormScreen();
}

function editarUsuario(id) {
  const u = usuarios.find(x => x.id === id);
  usuarioForm = { ...u, atores: [...u.atores], filiais: [...u.filiais] };
  document.getElementById('content').innerHTML = usuarioFormScreen();
}

function usuarioFormScreen() {
  return `
    <h1>${usuarioForm.id ? 'Editar' : 'Novo'} usuário</h1>
    <p class="subtitle">Defina os dados, as tags de ator e as filiais</p>

    <div class="card">
      <h2>Dados</h2>
      <div class="form-grid">
        <div class="form-row">
          <label>Nome *</label>
          <input type="text" value="${usuarioForm.nome}" onchange="usuarioForm.nome=this.value">
        </div>
        <div class="form-row">
          <label>Email *</label>
          <input type="email" value="${usuarioForm.email}" onchange="usuarioForm.email=this.value">
        </div>
      </div>
      <div class="check-list" style="margin-top:6px;">
        <label>
          <input type="checkbox" ${usuarioForm.ativo?'checked':''} onchange="usuarioForm.ativo=this.checked">
          Usuário ativo
        </label>
      </div>
    </div>

    <div class="card">
      <h2>Tags de ator *</h2>
      <p class="muted" style="margin-bottom:10px;">Selecione uma ou mais tags. Se marcar <strong>Configurador</strong>, as demais não são necessárias (acesso total).</p>
      <div class="chips">
        ${ATORES.map(a => `
          <span class="chip ${usuarioForm.atores.includes(a.codigo)?'on':'off'}" onclick="toggleAtor('${a.codigo}')">
            ${a.nome}
          </span>
        `).join('')}
      </div>
    </div>

    <div class="card">
      <h2>Filiais habilitadas *</h2>
      <div class="check-list">
        ${FILIAIS_SIMULADAS.map(f => `
          <label>
            <input type="checkbox" ${usuarioForm.filiais.includes(f.id)?'checked':''} onchange="toggleFilial(${f.id})">
            ${f.nome}
          </label>
        `).join('')}
      </div>
    </div>

    <div class="form-actions">
      <button class="btn btn-secondary" onclick="showScreen('usuarios')">Cancelar</button>
      <button class="btn btn-primary" onclick="salvarUsuario()">Salvar</button>
    </div>
  `;
}

function toggleAtor(codigo) {
  const i = usuarioForm.atores.indexOf(codigo);
  if (i >= 0) usuarioForm.atores.splice(i, 1);
  else usuarioForm.atores.push(codigo);
  if (codigo === 'configurador' && usuarioForm.atores.includes('configurador')) {
    usuarioForm.atores = ['configurador'];
  }
  document.getElementById('content').innerHTML = usuarioFormScreen();
}

function toggleFilial(id) {
  const i = usuarioForm.filiais.indexOf(id);
  if (i >= 0) usuarioForm.filiais.splice(i, 1);
  else usuarioForm.filiais.push(id);
  document.getElementById('content').innerHTML = usuarioFormScreen();
}

function salvarUsuario() {
  if (!usuarioForm.nome || !usuarioForm.email) { alert('Preencha nome e email.'); return; }
  if (usuarioForm.atores.length === 0) { alert('Selecione ao menos uma tag de ator.'); return; }
  if (usuarioForm.filiais.length === 0) { alert('Selecione ao menos uma filial.'); return; }

  if (usuarioForm.id) {
    const idx = usuarios.findIndex(x => x.id === usuarioForm.id);
    usuarios[idx] = { ...usuarioForm };
  } else {
    usuarioForm.id = Math.max(0, ...usuarios.map(u => u.id)) + 1;
    usuarios.push({ ...usuarioForm });
  }
  showScreen('usuarios');
}

/* ============================================================
   CLIENTES
   ============================================================ */

screens['clientes'] = () => `
  <h1>Clientes</h1>
  <p class="subtitle">Pessoas físicas ou jurídicas com a tag "Cliente"</p>

  <div class="card">
    <table class="data">
      <thead><tr><th>Tipo</th><th>Nome / Razão Social</th><th>Documento</th><th>Contato</th><th>Prazo</th><th>Status</th><th></th></tr></thead>
      <tbody>
        ${clientes.map(c => `
          <tr>
            <td>${c.tipo}</td>
            <td><strong>${c.nome}</strong></td>
            <td>${c.documento}</td>
            <td>${c.contato}</td>
            <td>${c.prazo} dias</td>
            <td>${c.ativo ? '<span class="badge badge-ok">Ativo</span>' : '<span class="badge badge-err">Inativo</span>'}</td>
            <td><a href="#" onclick="editarCliente(${c.id}); return false;">Editar</a></td>
          </tr>
        `).join('')}
      </tbody>
    </table>
    <div class="form-actions" style="justify-content:flex-start; margin-top:14px;">
      <button class="btn btn-primary" onclick="novoCliente()">+ Novo cliente</button>
    </div>
  </div>
`;

function novoCliente() {
  clienteForm = { id: null, tipo: 'PJ', nome: '', documento: '', contato: '', prazo: 30, ativo: true };
  document.getElementById('content').innerHTML = clienteFormScreen();
}

function editarCliente(id) {
  clienteForm = { ...clientes.find(c => c.id === id) };
  document.getElementById('content').innerHTML = clienteFormScreen();
}

function clienteFormScreen() {
  return `
    <h1>${clienteForm.id ? 'Editar' : 'Novo'} cliente</h1>
    <p class="subtitle">A tag "Cliente" é adicionada automaticamente</p>

    <div class="card">
      <h2>Dados</h2>
      <div class="form-grid">
        <div class="form-row">
          <label>Tipo *</label>
          <select onchange="clienteForm.tipo=this.value; document.getElementById('content').innerHTML = clienteFormScreen();">
            <option value="PJ" ${clienteForm.tipo==='PJ'?'selected':''}>Pessoa Jurídica</option>
            <option value="PF" ${clienteForm.tipo==='PF'?'selected':''}>Pessoa Física</option>
          </select>
        </div>
        <div class="form-row">
          <label>${clienteForm.tipo==='PJ'?'Razão Social':'Nome'} *</label>
          <input type="text" value="${clienteForm.nome}" onchange="clienteForm.nome=this.value">
        </div>
        <div class="form-row">
          <label>${clienteForm.tipo==='PJ'?'CNPJ':'CPF'} *</label>
          <input type="text" value="${clienteForm.documento}" onchange="clienteForm.documento=this.value">
        </div>
        <div class="form-row">
          <label>Contato</label>
          <input type="text" value="${clienteForm.contato}" onchange="clienteForm.contato=this.value">
        </div>
        <div class="form-row">
          <label>Prazo padrão de recebimento (dias)</label>
          <input type="number" min="0" value="${clienteForm.prazo}" onchange="clienteForm.prazo=parseInt(this.value)||0">
        </div>
        <div class="form-row" style="justify-content:flex-end;">
          <label style="display:flex; align-items:center; gap:8px; font-weight:400; margin-top:20px;">
            <input type="checkbox" ${clienteForm.ativo?'checked':''} onchange="clienteForm.ativo=this.checked"> Cliente ativo
          </label>
        </div>
      </div>
    </div>

    <div class="form-actions">
      <button class="btn btn-secondary" onclick="showScreen('clientes')">Cancelar</button>
      <button class="btn btn-primary" onclick="salvarCliente()">Salvar</button>
    </div>
  `;
}

function salvarCliente() {
  if (!clienteForm.nome || !clienteForm.documento) { alert('Preencha nome e documento.'); return; }
  if (clienteForm.id) {
    const idx = clientes.findIndex(c => c.id === clienteForm.id);
    clientes[idx] = { ...clienteForm };
  } else {
    clienteForm.id = Math.max(0, ...clientes.map(c => c.id)) + 1;
    clientes.push({ ...clienteForm });
  }
  showScreen('clientes');
}

/* ============================================================
   FORNECEDORES
   ============================================================ */

screens['fornecedores'] = () => `
  <h1>Fornecedores</h1>
  <p class="subtitle">Pessoas físicas ou jurídicas com a tag "Fornecedor" e categoria padrão</p>

  <div class="card">
    <table class="data">
      <thead><tr><th>Tipo</th><th>Nome / Razão Social</th><th>Documento</th><th>Categoria</th><th>Prazo</th><th>Status</th><th></th></tr></thead>
      <tbody>
        ${fornecedores.map(f => `
          <tr>
            <td>${f.tipo}</td>
            <td><strong>${f.nome}</strong></td>
            <td>${f.documento}</td>
            <td>${f.categoria ? `<span class="badge badge-ok">${f.categoria}</span>` : '<span class="badge badge-warn">Sem categoria</span>'}</td>
            <td>${f.prazo} dias</td>
            <td>${f.ativo ? '<span class="badge badge-ok">Ativo</span>' : '<span class="badge badge-err">Inativo</span>'}</td>
            <td><a href="#" onclick="editarFornecedor(${f.id}); return false;">Editar</a></td>
          </tr>
        `).join('')}
      </tbody>
    </table>
    <div class="form-actions" style="justify-content:flex-start; margin-top:14px;">
      <button class="btn btn-primary" onclick="novoFornecedor()">+ Novo fornecedor</button>
    </div>
  </div>
`;

function novoFornecedor() {
  fornecedorForm = { id: null, tipo: 'PJ', nome: '', documento: '', contato: '', categoria: '', prazo: 30, ativo: true };
  document.getElementById('content').innerHTML = fornecedorFormScreen();
}

function editarFornecedor(id) {
  fornecedorForm = { ...fornecedores.find(f => f.id === id) };
  document.getElementById('content').innerHTML = fornecedorFormScreen();
}

function fornecedorFormScreen() {
  return `
    <h1>${fornecedorForm.id ? 'Editar' : 'Novo'} fornecedor</h1>
    <p class="subtitle">A categoria padrão alimenta o motor de classificação (D1)</p>

    <div class="card">
      <h2>Dados</h2>
      <div class="form-grid">
        <div class="form-row">
          <label>Tipo *</label>
          <select onchange="fornecedorForm.tipo=this.value; document.getElementById('content').innerHTML = fornecedorFormScreen();">
            <option value="PJ" ${fornecedorForm.tipo==='PJ'?'selected':''}>Pessoa Jurídica</option>
            <option value="PF" ${fornecedorForm.tipo==='PF'?'selected':''}>Pessoa Física</option>
          </select>
        </div>
        <div class="form-row">
          <label>${fornecedorForm.tipo==='PJ'?'Razão Social':'Nome'} *</label>
          <input type="text" value="${fornecedorForm.nome}" onchange="fornecedorForm.nome=this.value">
        </div>
        <div class="form-row">
          <label>${fornecedorForm.tipo==='PJ'?'CNPJ':'CPF'} *</label>
          <input type="text" value="${fornecedorForm.documento}" onchange="fornecedorForm.documento=this.value">
        </div>
        <div class="form-row">
          <label>Contato</label>
          <input type="text" value="${fornecedorForm.contato}" onchange="fornecedorForm.contato=this.value">
        </div>
        <div class="form-row">
          <label>Categoria padrão *</label>
          <select onchange="fornecedorForm.categoria=this.value">
            <option value="">— Selecione —</option>
            <option ${fornecedorForm.categoria==='Mercadoria para Revenda'?'selected':''}>Mercadoria para Revenda</option>
            <option ${fornecedorForm.categoria==='Insumos de Serviço'?'selected':''}>Insumos de Serviço</option>
            <option ${fornecedorForm.categoria==='Combustível'?'selected':''}>Combustível</option>
            <option ${fornecedorForm.categoria==='Material de Escritório'?'selected':''}>Material de Escritório</option>
            <option ${fornecedorForm.categoria==='Despesas Administrativas'?'selected':''}>Despesas Administrativas</option>
          </select>
        </div>
        <div class="form-row">
          <label>Prazo padrão de pagamento (dias)</label>
          <input type="number" min="0" value="${fornecedorForm.prazo}" onchange="fornecedorForm.prazo=parseInt(this.value)||0">
        </div>
      </div>
      <div class="check-list" style="margin-top:6px;">
        <label>
          <input type="checkbox" ${fornecedorForm.ativo?'checked':''} onchange="fornecedorForm.ativo=this.checked"> Fornecedor ativo
        </label>
      </div>
    </div>

    <div class="form-actions">
      <button class="btn btn-secondary" onclick="showScreen('fornecedores')">Cancelar</button>
      <button class="btn btn-primary" onclick="salvarFornecedor()">Salvar</button>
    </div>
  `;
}

function salvarFornecedor() {
  if (!fornecedorForm.nome || !fornecedorForm.documento || !fornecedorForm.categoria) {
    alert('Preencha nome, documento e categoria padrão.');
    return;
  }
  if (fornecedorForm.id) {
    const idx = fornecedores.findIndex(f => f.id === fornecedorForm.id);
    fornecedores[idx] = { ...fornecedorForm };
  } else {
    fornecedorForm.id = Math.max(0, ...fornecedores.map(f => f.id)) + 1;
    fornecedores.push({ ...fornecedorForm });
  }
  showScreen('fornecedores');
}

/* ============================================================
   PRODUTOS E SERVIÇOS
   ============================================================ */

screens['produtos'] = () => `
  <h1>Produtos e serviços</h1>
  <p class="subtitle">Produtos com NCM; serviços com código LC 116</p>

  <div class="card">
    <table class="data">
      <thead><tr><th>Tipo</th><th>Descrição</th><th>Código interno</th><th>NCM / LC 116</th><th>Unidade</th><th>Status</th><th></th></tr></thead>
      <tbody>
        ${produtosServicos.map(p => `
          <tr>
            <td>${p.tipo === 'P' ? '<span class="badge badge-ok">Produto</span>' : '<span class="badge badge-warn">Serviço</span>'}</td>
            <td><strong>${p.descricao}</strong></td>
            <td>${p.codigoInterno}</td>
            <td>${p.tipo === 'P' ? p.ncm : p.lc116}</td>
            <td>${p.tipo === 'P' ? p.unidade : '—'}</td>
            <td>${p.ativo ? '<span class="badge badge-ok">Ativo</span>' : '<span class="badge badge-err">Inativo</span>'}</td>
            <td><a href="#" onclick="editarProduto(${p.id}); return false;">Editar</a></td>
          </tr>
        `).join('')}
      </tbody>
    </table>
    <div class="form-actions" style="justify-content:flex-start; margin-top:14px;">
      <button class="btn btn-primary" onclick="novoProduto()">+ Novo produto/serviço</button>
    </div>
  </div>
`;

function novoProduto() {
  produtoForm = { id: null, tipo: 'P', descricao: '', codigoInterno: '', ncm: '', lc116: '', unidade: 'UN', ativo: true };
  document.getElementById('content').innerHTML = produtoFormScreen();
}

function editarProduto(id) {
  produtoForm = { ...produtosServicos.find(p => p.id === id) };
  document.getElementById('content').innerHTML = produtoFormScreen();
}

function produtoFormScreen() {
  return `
    <h1>${produtoForm.id ? 'Editar' : 'Novo'} produto/serviço</h1>
    <p class="subtitle">Produtos usam NCM; serviços usam LC 116</p>

    <div class="card">
      <h2>Dados</h2>
      <div class="form-grid">
        <div class="form-row">
          <label>Tipo *</label>
          <select onchange="produtoForm.tipo=this.value; document.getElementById('content').innerHTML = produtoFormScreen();">
            <option value="P" ${produtoForm.tipo==='P'?'selected':''}>Produto</option>
            <option value="S" ${produtoForm.tipo==='S'?'selected':''}>Serviço</option>
          </select>
        </div>
        <div class="form-row">
          <label>Descrição *</label>
          <input type="text" value="${produtoForm.descricao}" onchange="produtoForm.descricao=this.value">
        </div>
        <div class="form-row">
          <label>Código interno</label>
          <input type="text" value="${produtoForm.codigoInterno}" onchange="produtoForm.codigoInterno=this.value">
        </div>
        ${produtoForm.tipo === 'P' ? `
          <div class="form-row">
            <label>NCM *</label>
            <input type="text" placeholder="0000.00.00" value="${produtoForm.ncm}" onchange="produtoForm.ncm=this.value">
          </div>
          <div class="form-row">
            <label>Unidade</label>
            <select onchange="produtoForm.unidade=this.value">
              <option ${produtoForm.unidade==='UN'?'selected':''}>UN</option>
              <option ${produtoForm.unidade==='KG'?'selected':''}>KG</option>
              <option ${produtoForm.unidade==='LT'?'selected':''}>LT</option>
              <option ${produtoForm.unidade==='MT'?'selected':''}>MT</option>
              <option ${produtoForm.unidade==='CX'?'selected':''}>CX</option>
              <option ${produtoForm.unidade==='RES'?'selected':''}>RES</option>
            </select>
          </div>
        ` : `
          <div class="form-row">
            <label>Código LC 116 *</label>
            <input type="text" placeholder="00.00" value="${produtoForm.lc116}" onchange="produtoForm.lc116=this.value">
          </div>
        `}
      </div>
      <div class="check-list" style="margin-top:6px;">
        <label>
          <input type="checkbox" ${produtoForm.ativo?'checked':''} onchange="produtoForm.ativo=this.checked"> Ativo
        </label>
      </div>
    </div>

    <div class="form-actions">
      <button class="btn btn-secondary" onclick="showScreen('produtos')">Cancelar</button>
      <button class="btn btn-primary" onclick="salvarProduto()">Salvar</button>
    </div>
  `;
}

function salvarProduto() {
  if (!produtoForm.descricao) { alert('Preencha a descrição.'); return; }
  if (produtoForm.tipo === 'P' && !produtoForm.ncm) { alert('Preencha o NCM do produto.'); return; }
  if (produtoForm.tipo === 'S' && !produtoForm.lc116) { alert('Preencha o código LC 116 do serviço.'); return; }
  if (produtoForm.id) {
    const idx = produtosServicos.findIndex(p => p.id === produtoForm.id);
    produtosServicos[idx] = { ...produtoForm };
  } else {
    produtoForm.id = Math.max(0, ...produtosServicos.map(p => p.id)) + 1;
    produtosServicos.push({ ...produtoForm });
  }
  showScreen('produtos');
}

/* ============================================================
   CADASTROS.JS — Parte 2
   Funcionários e Ativos.
   ============================================================ */

/* ============================================================
   FUNCIONÁRIOS
   ============================================================ */

screens['funcionarios'] = () => `
  <h1>Funcionários</h1>
  <p class="subtitle">Dados contratuais mínimos para cálculo de folha</p>

  <div class="card">
    <table class="data">
      <thead><tr><th>Nome</th><th>CPF</th><th>Cargo</th><th>Centro de custo</th><th>Salário base</th><th>Natureza</th><th>Status</th><th></th></tr></thead>
      <tbody>
        ${funcionarios.map(f => `
          <tr>
            <td><strong>${f.nome}</strong></td>
            <td>${f.cpf}</td>
            <td>${f.cargo}</td>
            <td>${f.centroCusto}</td>
            <td>${formatarMoeda(f.salario)}</td>
            <td>${f.natureza === 'Custo' ? '<span class="badge badge-warn">Custo</span>' : '<span class="badge badge-ok">Despesa Fixa</span>'}</td>
            <td>${f.ativo ? '<span class="badge badge-ok">Ativo</span>' : '<span class="badge badge-err">Inativo</span>'}</td>
            <td><a href="#" onclick="editarFuncionario(${f.id}); return false;">Editar</a></td>
          </tr>
        `).join('')}
      </tbody>
    </table>
    <div class="form-actions" style="justify-content:flex-start; margin-top:14px;">
      <button class="btn btn-primary" onclick="novoFuncionario()">+ Novo funcionário</button>
    </div>
  </div>
`;

function novoFuncionario() {
  funcionarioForm = { id: null, nome: '', cpf: '', cargo: '', centroCusto: '', salario: 0, admissao: '', natureza: 'Despesa Fixa', rateio: 100, ativo: true };
  document.getElementById('content').innerHTML = funcionarioFormScreen();
}

function editarFuncionario(id) {
  funcionarioForm = { ...funcionarios.find(f => f.id === id) };
  document.getElementById('content').innerHTML = funcionarioFormScreen();
}

function funcionarioFormScreen() {
  return `
    <h1>${funcionarioForm.id ? 'Editar' : 'Novo'} funcionário</h1>
    <p class="subtitle">A natureza define a alocação no DRE (custo ou despesa fixa)</p>

    <div class="card">
      <h2>Dados</h2>
      <div class="form-grid">
        <div class="form-row">
          <label>Nome *</label>
          <input type="text" value="${funcionarioForm.nome}" onchange="funcionarioForm.nome=this.value">
        </div>
        <div class="form-row">
          <label>CPF *</label>
          <input type="text" value="${funcionarioForm.cpf}" onchange="funcionarioForm.cpf=this.value">
        </div>
        <div class="form-row">
          <label>Cargo</label>
          <input type="text" value="${funcionarioForm.cargo}" onchange="funcionarioForm.cargo=this.value">
        </div>
        <div class="form-row">
          <label>Centro de custo *</label>
          <select onchange="funcionarioForm.centroCusto=this.value">
            <option value="">— Selecione —</option>
            <option ${funcionarioForm.centroCusto==='Comercial'?'selected':''}>Comercial</option>
            <option ${funcionarioForm.centroCusto==='Administrativo'?'selected':''}>Administrativo</option>
            <option ${funcionarioForm.centroCusto==='Logística'?'selected':''}>Logística</option>
          </select>
        </div>
        <div class="form-row">
          <label>Salário base *</label>
          <input type="number" min="0" step="0.01" value="${funcionarioForm.salario}" onchange="funcionarioForm.salario=parseFloat(this.value)||0">
        </div>
        <div class="form-row">
          <label>Data de admissão</label>
          <input type="date" value="${funcionarioForm.admissao}" onchange="funcionarioForm.admissao=this.value">
        </div>
        <div class="form-row">
          <label>Natureza *</label>
          <select onchange="funcionarioForm.natureza=this.value">
            <option ${funcionarioForm.natureza==='Custo'?'selected':''}>Custo</option>
            <option ${funcionarioForm.natureza==='Despesa Fixa'?'selected':''}>Despesa Fixa</option>
          </select>
        </div>
        <div class="form-row">
          <label>Rateio (%)</label>
          <input type="number" min="0" max="100" value="${funcionarioForm.rateio}" onchange="funcionarioForm.rateio=parseInt(this.value)||0">
        </div>
      </div>
      <div class="check-list" style="margin-top:6px;">
        <label>
          <input type="checkbox" ${funcionarioForm.ativo?'checked':''} onchange="funcionarioForm.ativo=this.checked"> Funcionário ativo
        </label>
      </div>
    </div>

    <div class="form-actions">
      <button class="btn btn-secondary" onclick="showScreen('funcionarios')">Cancelar</button>
      <button class="btn btn-primary" onclick="salvarFuncionario()">Salvar</button>
    </div>
  `;
}

function salvarFuncionario() {
  if (!funcionarioForm.nome || !funcionarioForm.cpf || !funcionarioForm.centroCusto || !funcionarioForm.salario) {
    alert('Preencha nome, CPF, centro de custo e salário.');
    return;
  }
  if (funcionarioForm.id) {
    const idx = funcionarios.findIndex(f => f.id === funcionarioForm.id);
    funcionarios[idx] = { ...funcionarioForm };
  } else {
    funcionarioForm.id = Math.max(0, ...funcionarios.map(f => f.id)) + 1;
    funcionarios.push({ ...funcionarioForm });
  }
  showScreen('funcionarios');
}

/* ============================================================
   ATIVOS
   ============================================================ */

screens['ativos'] = () => `
  <h1>Ativos (patrimônios)</h1>
  <p class="subtitle">Bens com depreciação calculada automaticamente</p>

  <div class="card">
    <table class="data">
      <thead><tr><th>Nome</th><th>Aquisição</th><th>Valor original</th><th>Vida útil (meses)</th><th>Destino</th><th>Status</th><th></th></tr></thead>
      <tbody>
        ${ativos.map(a => `
          <tr>
            <td><strong>${a.nome}</strong></td>
            <td>${formatarData(a.aquisicao)}</td>
            <td>${formatarMoeda(a.valorOriginal)}</td>
            <td>${a.vidaUtil}</td>
            <td>${a.destino === 'Custo' ? '<span class="badge badge-warn">Custo</span>' : '<span class="badge badge-ok">Despesa</span>'}</td>
            <td>${a.ativo ? '<span class="badge badge-ok">Ativo</span>' : '<span class="badge badge-err">Inativo</span>'}</td>
            <td><a href="#" onclick="editarAtivo(${a.id}); return false;">Editar</a></td>
          </tr>
        `).join('')}
      </tbody>
    </table>
    <div class="form-actions" style="justify-content:flex-start; margin-top:14px;">
      <button class="btn btn-primary" onclick="novoAtivo()">+ Novo ativo</button>
    </div>
  </div>
`;

function novoAtivo() {
  ativoForm = { id: null, nome: '', aquisicao: '', valorOriginal: 0, valorResidual: 0, vidaUtil: 60, metodo: 'Linear', centroCusto: '', destino: 'Despesa', mesInicial: '', ativo: true };
  document.getElementById('content').innerHTML = ativoFormScreen();
}

function editarAtivo(id) {
  ativoForm = { ...ativos.find(a => a.id === id) };
  document.getElementById('content').innerHTML = ativoFormScreen();
}

function ativoFormScreen() {
  return `
    <h1>${ativoForm.id ? 'Editar' : 'Novo'} ativo</h1>
    <p class="subtitle">O mês inicial da depreciação é sugerido como o mês seguinte à aquisição</p>

    <div class="card">
      <h2>Dados</h2>
      <div class="form-grid">
        <div class="form-row">
          <label>Nome *</label>
          <input type="text" value="${ativoForm.nome}" onchange="ativoForm.nome=this.value">
        </div>
        <div class="form-row">
          <label>Data de aquisição *</label>
          <input type="date" value="${ativoForm.aquisicao}" onchange="ativoForm.aquisicao=this.value">
        </div>
        <div class="form-row">
          <label>Valor original *</label>
          <input type="number" min="0" step="0.01" value="${ativoForm.valorOriginal}" onchange="ativoForm.valorOriginal=parseFloat(this.value)||0">
        </div>
        <div class="form-row">
          <label>Valor residual</label>
          <input type="number" min="0" step="0.01" value="${ativoForm.valorResidual}" onchange="ativoForm.valorResidual=parseFloat(this.value)||0">
        </div>
        <div class="form-row">
          <label>Vida útil (meses) *</label>
          <input type="number" min="1" value="${ativoForm.vidaUtil}" onchange="ativoForm.vidaUtil=parseInt(this.value)||0">
        </div>
        <div class="form-row">
          <label>Método</label>
          <select onchange="ativoForm.metodo=this.value">
            <option ${ativoForm.metodo==='Linear'?'selected':''}>Linear</option>
          </select>
        </div>
        <div class="form-row">
          <label>Centro de custo *</label>
          <select onchange="ativoForm.centroCusto=this.value">
            <option value="">— Selecione —</option>
            <option ${ativoForm.centroCusto==='Comercial'?'selected':''}>Comercial</option>
            <option ${ativoForm.centroCusto==='Administrativo'?'selected':''}>Administrativo</option>
            <option ${ativoForm.centroCusto==='Logística'?'selected':''}>Logística</option>
          </select>
        </div>
        <div class="form-row">
          <label>Destino *</label>
          <select onchange="ativoForm.destino=this.value">
            <option ${ativoForm.destino==='Custo'?'selected':''}>Custo</option>
            <option ${ativoForm.destino==='Despesa'?'selected':''}>Despesa</option>
          </select>
        </div>
        <div class="form-row">
          <label>Mês inicial da depreciação *</label>
          <input type="month" value="${ativoForm.mesInicial}" onchange="ativoForm.mesInicial=this.value">
        </div>
      </div>
      <div class="check-list" style="margin-top:6px;">
        <label>
          <input type="checkbox" ${ativoForm.ativo?'checked':''} onchange="ativoForm.ativo=this.checked"> Ativo em uso
        </label>
      </div>
    </div>

    <div class="form-actions">
      <button class="btn btn-secondary" onclick="showScreen('ativos')">Cancelar</button>
      <button class="btn btn-primary" onclick="salvarAtivo()">Salvar</button>
    </div>
  `;
}

function salvarAtivo() {
  if (!ativoForm.nome || !ativoForm.aquisicao || !ativoForm.valorOriginal || !ativoForm.vidaUtil || !ativoForm.centroCusto || !ativoForm.mesInicial) {
    alert('Preencha nome, aquisição, valor original, vida útil, centro de custo e mês inicial.');
    return;
  }
  if (ativoForm.id) {
    const idx = ativos.findIndex(a => a.id === ativoForm.id);
    ativos[idx] = { ...ativoForm };
  } else {
    ativoForm.id = Math.max(0, ...ativos.map(a => a.id)) + 1;
    ativos.push({ ...ativoForm });
  }
  showScreen('ativos');
}