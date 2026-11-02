/* ============================================================
   NOTA DE ENTRADA — wizard de 4 etapas
   Etapa 1: Dados do documento
   Etapa 2: Itens
   Etapa 3: Impostos (digitados + validação) e contrapartida
   Etapa 4: Revisão e confirmação
   ============================================================ */

// Estado do wizard
let notaEntradaForm = null;

// ============================================================
// INICIALIZAÇÃO
// ============================================================

function novaNotaEntrada() {
  notaEntradaForm = {
    etapa: 1,
    id: null,
    tipo: 'NF-e',
    filial: 'Matriz',
    fornecedorId: null,
    fornecedorNome: '',
    numero: '',
    serie: '1',
    chave: '',
    dataEmissao: '',
    natureza: '',
    formaPagamento: 'A prazo',
    condicaoPagamento: '30 dias',
    observacoes: '',
    itens: [],
    impostos: [],
    contaDestino: '',
    contaContrapartida: '',
    centroCusto: '',
    pendencias: [],
  };
  document.getElementById('content').innerHTML = notaEntradaScreen();
}

function editarNotaEntrada(id) {
  const n = notasEntrada.find(x => x.id === id);
  if (!n) return;
  // No wireframe, carrega os dados básicos (sem os itens detalhados)
  notaEntradaForm = {
    etapa: 1,
    id: n.id,
    tipo: n.tipo,
    filial: n.filial,
    fornecedorId: null,
    fornecedorNome: n.fornecedor,
    numero: n.numero,
    serie: n.serie,
    chave: '',
    dataEmissao: n.dataEmissao,
    natureza: 'Compra de mercadoria para revenda',
    formaPagamento: 'A prazo',
    condicaoPagamento: '30 dias',
    observacoes: '',
    itens: [{
      descricao: 'Produto (editável)',
      cfop: '1102',
      ncm: '12345678',
      quantidade: 1,
      valorUnitario: n.valorTotal,
      valorTotal: n.valorTotal,
      cstIcms: '00',
      aliqIcms: 18,
      cstPis: '01',
      aliqPis: 0.65,
      cstCofins: '01',
      aliqCofins: 3,
      contaSugerida: '3.1.1',
    }],
    impostos: [],
    contaDestino: '3.1.1',
    contaContrapartida: '2.1.1',
    centroCusto: 'Comercial',
    pendencias: [],
  };
  inicializarImpostos();
  document.getElementById('content').innerHTML = notaEntradaScreen();
}

// Inicializa a lista de impostos já com os valores esperados (editáveis)
function inicializarImpostos() {
  const tipos = ['ICMS', 'IPI', 'PIS', 'COFINS', 'IBS', 'CBS'];
  const totalProdutos = notaEntradaForm.itens.reduce((s, i) => s + (i.valorTotal || 0), 0);

  notaEntradaForm.impostos = tipos.map(tipo => {
    const aliquotaEsperada = getAliquotaEsperada(tipo);
    const baseEsperada = totalProdutos;
    const valorEsperado = baseEsperada * (aliquotaEsperada / 100);

    return {
      tipo,
      // Valores pré-carregados (editáveis)
      base: baseEsperada,
      aliquota: aliquotaEsperada,
      valor: valorEsperado,
      natureza: 'Credito',
      status: 'ok',                  // já começa OK (bate com o esperado)
      // Valores esperados (para validação)
      valorEsperado,
      baseEsperada,
      aliquotaEsperada,
      confirmado: false,
      justificativa: '',
    };
  });
}

// ============================================================
// TELA PRINCIPAL (decide qual etapa renderizar)
// ============================================================

function notaEntradaScreen() {
  if (!notaEntradaForm) novaNotaEntrada();
  switch (notaEntradaForm.etapa) {
    case 1: return etapa1Dados();
    case 2: return etapa2Itens();
    case 3: return etapa3Impostos();
    case 4: return etapa4Revisao();
    default: return etapa1Dados();
  }
}

function wizardProgress(etapaAtual) {
  const etapas = [1, 2, 3, 4];
  return `
    <div class="wizard-progress">
      ${etapas.map(n => {
        let cls = 'step';
        if (n < etapaAtual) cls += ' done';
        else if (n === etapaAtual) cls += ' current';
        return `<div class="${cls}">${n < etapaAtual ? '✓' : n}</div>`;
      }).join('')}
    </div>
  `;
}

// ============================================================
// ETAPA 1 — DADOS DO DOCUMENTO
// ============================================================

function etapa1Dados() {
  return `
    <div class="nota-entrada-header">
      <h1>Digitar Nota de Entrada</h1>
      <span class="etapa-label">Etapa 1 de 4</span>
    </div>
    <p class="subtitle">Dados do documento</p>

    ${wizardProgress(1)}

    <div class="card">
      <h2>Tipo de documento *</h2>
      <div class="chips">
        ${['NF-e', 'NFS-e', 'CT-e', 'RPA'].map(t => `
          <span class="chip ${notaEntradaForm.tipo === t ? 'on' : 'off'}"
                onclick="notaEntradaSetTipo('${t}')">${t}</span>
        `).join('')}
      </div>
    </div>

    <div class="card">
      <h2>Dados</h2>
      <div class="form-grid">
        <div class="form-row">
          <label>Filial *</label>
          <select onchange="notaEntradaForm.filial=this.value">
            <option ${notaEntradaForm.filial === 'Matriz' ? 'selected' : ''}>Matriz</option>
            <option ${notaEntradaForm.filial === 'Filial 2' ? 'selected' : ''}>Filial 2</option>
          </select>
        </div>
        <div class="form-row">
          <label>Fornecedor *</label>
          <input type="text" placeholder="Nome do fornecedor"
                 value="${notaEntradaForm.fornecedorNome}"
                 onchange="notaEntradaForm.fornecedorNome=this.value">
        </div>
        <div class="form-row">
          <label>Número *</label>
          <input type="text" value="${notaEntradaForm.numero}"
                 onchange="notaEntradaForm.numero=this.value">
        </div>
        <div class="form-row">
          <label>Série</label>
          <input type="text" value="${notaEntradaForm.serie}"
                 onchange="notaEntradaForm.serie=this.value">
        </div>
        <div class="form-row">
          <label>Chave (opcional)</label>
          <input type="text" value="${notaEntradaForm.chave}"
                 onchange="notaEntradaForm.chave=this.value">
        </div>
        <div class="form-row">
          <label>Data de emissão *</label>
          <input type="date" value="${notaEntradaForm.dataEmissao}"
                 onchange="notaEntradaSetData(this.value)">
        </div>
      </div>
      ${notaEntradaAvisoData()}
    </div>

    <div class="card">
      <h2>Operação</h2>
      <div class="form-grid">
        <div class="form-row">
          <label>Natureza da operação</label>
          <input type="text" placeholder="Ex: Compra de mercadoria para revenda"
                 value="${notaEntradaForm.natureza}"
                 onchange="notaEntradaForm.natureza=this.value">
        </div>
        <div class="form-row">
          <label>Forma de pagamento *</label>
          <select onchange="notaEntradaForm.formaPagamento=this.value">
            <option ${notaEntradaForm.formaPagamento === 'A vista' ? 'selected' : ''}>À vista</option>
            <option ${notaEntradaForm.formaPagamento === 'A prazo' ? 'selected' : ''}>A prazo</option>
            <option ${notaEntradaForm.formaPagamento === 'Cartao' ? 'selected' : ''}>Cartão</option>
          </select>
        </div>
        <div class="form-row">
          <label>Condição de pagamento</label>
          <select onchange="notaEntradaForm.condicaoPagamento=this.value">
            <option ${notaEntradaForm.condicaoPagamento === '30 dias' ? 'selected' : ''}>30 dias</option>
            <option ${notaEntradaForm.condicaoPagamento === '30/60 dias' ? 'selected' : ''}>30/60 dias</option>
            <option ${notaEntradaForm.condicaoPagamento === '30/60/90 dias' ? 'selected' : ''}>30/60/90 dias</option>
          </select>
        </div>
      </div>
      <div class="form-row" style="margin-top:10px;">
        <label>Observações</label>
        <textarea rows="2" onchange="notaEntradaForm.observacoes=this.value">${notaEntradaForm.observacoes}</textarea>
      </div>
    </div>

    <div class="form-actions">
      <button class="btn btn-secondary" onclick="showScreen('nota-entrada-lista')">Cancelar</button>
      <button class="btn btn-primary" onclick="notaEntradaProximaEtapa()">Próximo →</button>
    </div>
  `;
}

function notaEntradaSetTipo(t) {
  notaEntradaForm.tipo = t;
  document.getElementById('content').innerHTML = notaEntradaScreen();
}

function notaEntradaSetData(v) {
  notaEntradaForm.dataEmissao = v;
  document.getElementById('content').innerHTML = notaEntradaScreen();
}

function notaEntradaAvisoData() {
  if (!notaEntradaForm.dataEmissao) return '';
  // Período aberto mock: 10/2026
  const data = new Date(notaEntradaForm.dataEmissao);
  const mesAno = `${String(data.getMonth() + 1).padStart(2, '0')}/${data.getFullYear()}`;
  if (mesAno !== '10/2026') {
    return `
      <div class="alert alert-warn" style="margin-top:10px;">
        ⚠️ A nota tem data de emissão ${notaEntradaForm.dataEmissao} (${mesAno}),
        mas será incluída no período <strong>10/2026</strong>.
        <button class="btn-sm" onclick="notaEntradaForm.avisoDataConfirmado=true">Confirmar</button>
      </div>
    `;
  }
  return '';
}

// ============================================================
// ETAPA 2 — ITENS
// ============================================================

function etapa2Itens() {
  if (notaEntradaForm.itens.length === 0) {
    notaEntradaForm.itens.push(novoItem());
  }
  return `
    <div class="nota-entrada-header">
      <h1>Digitar Nota de Entrada</h1>
      <span class="etapa-label">Etapa 2 de 4</span>
    </div>
    <p class="subtitle">Itens da nota</p>

    ${wizardProgress(2)}

    <div class="card">
      <h2>Itens</h2>
      <table class="data data-editavel">
        <thead>
          <tr>
            <th style="width:36px;">#</th>
            <th>Descrição</th>
            <th style="width:90px;">CFOP</th>
            <th style="width:110px;">NCM</th>
            <th style="width:80px;">Qtd</th>
            <th style="width:110px;">Vlr unit.</th>
            <th style="width:110px;">Total</th>
            <th style="width:36px;"></th>
          </tr>
        </thead>
        <tbody>
          ${notaEntradaForm.itens.map((it, i) => itemRow(it, i)).join('')}
        </tbody>
      </table>
      <div class="form-actions" style="justify-content:flex-start; margin-top:10px;">
        <button class="btn btn-secondary" onclick="notaEntradaAdicionarItem()">+ Adicionar item</button>
      </div>
    </div>

    ${sugestaoD1()}

    ${totalizadores()}

    <div class="form-actions">
      <button class="btn btn-secondary" onclick="notaEntradaEtapaAnterior()">← Voltar</button>
      <button class="btn btn-primary" onclick="notaEntradaProximaEtapa()">Próximo →</button>
    </div>
  `;
}

function novoItem() {
  return {
    descricao: '',
    cfop: '1102',
    ncm: '',
    quantidade: 1,
    valorUnitario: 0,
    valorTotal: 0,
    cstIcms: '00',
    aliqIcms: 18,
    cstPis: '01',
    aliqPis: 0.65,
    cstCofins: '01',
    aliqCofins: 3,
    contaSugerida: '3.1.1',
    sugestaoAceita: true,
  };
}

function itemRow(it, i) {
  return `
    <tr>
      <td>${i + 1}</td>
      <td><input type="text" value="${it.descricao}"
                 onchange="notaEntradaSetItem(${i}, 'descricao', this.value)"></td>
      <td>
        <select onchange="notaEntradaSetItem(${i}, 'cfop', this.value)">
          ${CFOPS.map(c => `<option value="${c.codigo}" ${it.cfop === c.codigo ? 'selected' : ''}>${c.codigo}</option>`).join('')}
        </select>
      </td>
      <td><input type="text" value="${it.ncm}"
                 onchange="notaEntradaSetItem(${i}, 'ncm', this.value)"></td>
      <td><input type="number" step="0.01" value="${it.quantidade}"
                 onchange="notaEntradaSetItem(${i}, 'quantidade', parseFloat(this.value) || 0)"></td>
      <td><input type="number" step="0.01" value="${it.valorUnitario}"
                 onchange="notaEntradaSetItem(${i}, 'valorUnitario', parseFloat(this.value) || 0)"></td>
      <td><input type="number" step="0.01" value="${it.valorTotal}" readonly></td>
      <td>
        <button class="btn-sm" onclick="notaEntradaRemoverItem(${i})" title="Remover">×</button>
      </td>
    </tr>
  `;
}

function notaEntradaSetItem(i, campo, valor) {
  notaEntradaForm.itens[i][campo] = valor;
  if (campo === 'quantidade' || campo === 'valorUnitario') {
    const it = notaEntradaForm.itens[i];
    it.valorTotal = (it.quantidade || 0) * (it.valorUnitario || 0);
  }
  document.getElementById('content').innerHTML = notaEntradaScreen();
}

function notaEntradaAdicionarItem() {
  notaEntradaForm.itens.push(novoItem());
  document.getElementById('content').innerHTML = notaEntradaScreen();
}

function notaEntradaRemoverItem(i) {
  if (notaEntradaForm.itens.length === 1) {
    alert('A nota precisa ter pelo menos um item.');
    return;
  }
  notaEntradaForm.itens.splice(i, 1);
  document.getElementById('content').innerHTML = notaEntradaScreen();
}

function sugestaoD1() {
  const it = notaEntradaForm.itens[0];
  if (!it) return '';
  const conta = PLANO_CONTAS.find(c => c.codigo === it.contaSugerida);
  if (!conta) return '';
  return `
    <div class="card">
      <h2>Sugestão de classificação (D1)</h2>
      <p class="muted">O motor sugere a conta com base no CFOP, NCM e fornecedor.</p>
      <div style="display:flex; align-items:center; gap:12px; margin-top:8px;">
        <span class="badge badge-info">${conta.codigo}</span>
        <span>${conta.descricao}</span>
        <button class="btn-sm" onclick="notaEntradaVerPorque()">Por que?</button>
        ${it.sugestaoAceita
          ? '<span class="badge badge-ok">Aceita</span>'
          : '<span class="badge badge-warn">Alterada</span>'}
      </div>
    </div>
  `;
}

function notaEntradaVerPorque() {
  alert(
    'Regra aplicada: Fornecedor + CFOP 1102 → Custo > CMV (prioridade 1 — específica).\n' +
    'Contexto considerado: CFOP 1102, NCM 12345678, fornecedor.\n' +
    'Confiança: alta (regra específica, sem conflito).'
  );
}

function totalizadores() {
  const totalProdutos = notaEntradaForm.itens.reduce((s, i) => s + (i.valorTotal || 0), 0);
  return `
    <div class="totalizadores">
      <div class="total-item">
        <span class="total-label">Produtos</span>
        <span class="total-valor">${formatarMoeda(totalProdutos)}</span>
      </div>
      <div class="total-item">
        <span class="total-label">Frete</span>
        <span class="total-valor">R$ 0,00</span>
      </div>
      <div class="total-item">
        <span class="total-label">Desconto</span>
        <span class="total-valor">R$ 0,00</span>
      </div>
      <div class="total-item">
        <span class="total-label">Total da nota</span>
        <span class="total-valor destaque">${formatarMoeda(totalProdutos)}</span>
      </div>
    </div>
  `;
}

// ============================================================
// ETAPA 3 — IMPOSTOS E CONTRAPARTIDA
// ============================================================

function etapa3Impostos() {
  if (notaEntradaForm.impostos.length === 0) inicializarImpostos();

  const temDivergencia = notaEntradaForm.impostos.some(i => i.status === 'divergente');
  return `
    <div class="nota-entrada-header">
      <h1>Digitar Nota de Entrada</h1>
      <span class="etapa-label">Etapa 3 de 4</span>
    </div>
    <p class="subtitle">Impostos (conforme o documento) e contrapartida</p>

    ${wizardProgress(3)}

    <div class="card">
      <h2>Impostos</h2>
      <p class="muted">
        Os impostos já vêm preenchidos com os valores esperados. Altere se o documento tiver valor diferente.
        O sistema valida e sinaliza divergências (sem bloquear).
      </p>
      <table class="data data-editavel">
        <thead>
          <tr>
            <th>Tipo</th>
            <th>Base de cálculo</th>
            <th>Alíquota (%)</th>
            <th>Valor</th>
            <th>Natureza</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          ${notaEntradaForm.impostos.map(imp => impostoRow(imp)).join('')}
        </tbody>
      </table>

      <div class="form-actions" style="justify-content:flex-start; margin-top:10px;">
        <button class="btn btn-secondary" onclick="notaEntradaRecalcularEsperado()">🔄 Recalcular esperado</button>
      </div>

      ${temDivergencia ? alertaDivergencias() : ''}
    </div>

    <div class="card">
      <h2>Contrapartida</h2>
      <div class="form-grid">
        <div class="form-row">
          <label>Conta de destino *</label>
          <select onchange="notaEntradaForm.contaDestino=this.value">
            <option value="">— Selecione —</option>
            ${PLANO_CONTAS.map(c => `<option value="${c.codigo}" ${notaEntradaForm.contaDestino === c.codigo ? 'selected' : ''}>${c.codigo} — ${c.descricao}</option>`).join('')}
          </select>
        </div>
        <div class="form-row">
          <label>Conta de contrapartida *</label>
          <select onchange="notaEntradaForm.contaContrapartida=this.value">
            <option value="">— Selecione —</option>
            ${PLANO_CONTAS.map(c => `<option value="${c.codigo}" ${notaEntradaForm.contaContrapartida === c.codigo ? 'selected' : ''}>${c.codigo} — ${c.descricao}</option>`).join('')}
          </select>
        </div>
        <div class="form-row">
          <label>Centro de custo *</label>
          <select onchange="notaEntradaForm.centroCusto=this.value">
            <option value="">— Selecione —</option>
            <option ${notaEntradaForm.centroCusto === 'Comercial' ? 'selected' : ''}>Comercial</option>
            <option ${notaEntradaForm.centroCusto === 'Administrativo' ? 'selected' : ''}>Administrativo</option>
            <option ${notaEntradaForm.centroCusto === 'Logística' ? 'selected' : ''}>Logística</option>
          </select>
        </div>
      </div>
    </div>

    <div class="card">
      <h2>Preview de partidas dobradas</h2>
      ${previewPartidas()}
    </div>

    <div class="form-actions">
      <button class="btn btn-secondary" onclick="notaEntradaRecalcularEsperado()" title="Volta aos valores esperados (descarta alterações)">
        🔄 Recalcular esperado
      </button>      
      <button class="btn btn-primary" onclick="notaEntradaProximaEtapa()">Revisar →</button>
    </div>
  `;
}

function impostoRow(imp) {
  return `
    <tr class="${imp.status === 'divergente' ? 'linha-divergente' : ''}">
      <td><strong>${imp.tipo}</strong></td>
      <td><input type="number" step="0.01" value="${imp.base}"
                 onchange="notaEntradaSetImposto('${imp.tipo}', 'base', parseFloat(this.value) || 0)"></td>
      <td><input type="number" step="0.01" value="${imp.aliquota}"
                 onchange="notaEntradaSetImposto('${imp.tipo}', 'aliquota', parseFloat(this.value) || 0)"></td>
      <td><input type="number" step="0.01" value="${imp.valor}"
                 onchange="notaEntradaSetImposto('${imp.tipo}', 'valor', parseFloat(this.value) || 0)"></td>
      <td>
        <select onchange="notaEntradaSetImposto('${imp.tipo}', 'natureza', this.value)">
          <option ${imp.natureza === 'Credito' ? 'selected' : ''} value="Credito">Crédito</option>
          <option ${imp.natureza === 'Debito' ? 'selected' : ''} value="Debito">Débito</option>
        </select>
      </td>
      <td>${statusImposto(imp)}</td>
      <td>${acoesImposto(imp)}</td>
    </tr>
  `;
}

function statusImposto(imp) {
  switch (imp.status) {
    case 'ok': return '<span class="badge badge-ok">✅ OK</span>';
    case 'divergente': return '<span class="badge badge-warn">⚠️ Div.</span>';
    case 'confirmado_divergente': return '<span class="badge badge-info">✔️ Confirmado</span>';
    default: return '<span class="badge">⏳</span>';
  }
}

function acoesImposto(imp) {
  if (imp.status === 'divergente') {
    return `
      <button class="btn-sm" onclick="notaEntradaConfirmarDivergencia('${imp.tipo}')" title="Manter o valor digitado">Confirmar</button>
      <button class="btn-sm" onclick="notaEntradaAjustarParaEsperado('${imp.tipo}')" title="Ajustar para o esperado">Ajustar</button>
    `;
  }
  return '';
}

function alertaDivergencias() {
  const divs = notaEntradaForm.impostos.filter(i => i.status === 'divergente');
  return `
    <div class="alert alert-warn" style="margin-top:14px;">
      <strong>⚠️ Divergências encontradas</strong>
      <p>Os valores digitados diferem do esperado. O sistema <strong>não altera</strong> os valores — você decide.</p>
      <ul>
        ${divs.map(i => `
          <li>
            <strong>${i.tipo}:</strong> digitado R$ ${i.valor.toFixed(2)} · esperado R$ ${i.valorEsperado.toFixed(2)}
            (${i.aliquotaEsperada}% × R$ ${i.baseEsperada.toFixed(2)})
          </li>
        `).join('')}
      </ul>
    </div>
  `;
}

function previewPartidas() {
  const totalImpostos = notaEntradaForm.impostos.reduce((s, i) => s + (i.valor || 0), 0);
  const totalProdutos = notaEntradaForm.itens.reduce((s, i) => s + (i.valorTotal || 0), 0);
  const totalNota = totalProdutos + totalImpostos;
  return `
    <table class="preview-partidas">
      <thead><tr><th>Débito</th><th>Crédito</th><th style="text-align:right;">Valor</th></tr></thead>
      <tbody>
        <tr>
          <td class="debito">${notaEntradaForm.contaDestino || '—'}</td>
          <td></td>
          <td class="valor">${formatarMoeda(totalProdutos)}</td>
        </tr>
        <tr>
          <td class="debito">1.1.5 Impostos a Recuperar</td>
          <td></td>
          <td class="valor">${formatarMoeda(totalImpostos)}</td>
        </tr>
        <tr>
          <td></td>
          <td class="credito">${notaEntradaForm.contaContrapartida || '—'}</td>
          <td class="valor">${formatarMoeda(totalNota)}</td>
        </tr>
      </tbody>
    </table>
  `;
}

// Handlers dos impostos
function notaEntradaSetImposto(tipo, campo, valor) {
  const imp = notaEntradaForm.impostos.find(i => i.tipo === tipo);
  if (!imp) return;
  imp[campo] = valor;
  if (campo === 'base' || campo === 'aliquota') {
    imp.valor = (imp.base || 0) * ((imp.aliquota || 0) / 100);
  }
  imp.status = validarImposto(imp);
  document.getElementById('content').innerHTML = notaEntradaScreen();
}

function validarImposto(imp) {
  if (imp.base === 0 && imp.valor === 0 && imp.aliquota === 0) return 'pendente';
  const tolValor = 0.05;
  const tolAliq = 0.01;
  const divValor = Math.abs((imp.valor || 0) - (imp.valorEsperado || 0));
  const divAliq = Math.abs((imp.aliquota || 0) - (imp.aliquotaEsperada || 0));
  if (divValor <= tolValor && divAliq <= tolAliq) return 'ok';
  if (imp.confirmado) return 'confirmado_divergente';
  return 'divergente';
}

function notaEntradaRecalcularEsperado() {
  const temAlteracao = notaEntradaForm.impostos.some(i =>
    i.base !== i.baseEsperada ||
    i.aliquota !== i.aliquotaEsperada ||
    i.valor !== i.valorEsperado
  );
  if (temAlteracao) {
    if (!confirm('Recalcular o esperado? As alterações nos impostos serão descartadas.')) return;
  }
  const totalProdutos = notaEntradaForm.itens.reduce((s, i) => s + (i.valorTotal || 0), 0);
  notaEntradaForm.impostos.forEach(imp => {
    imp.baseEsperada = totalProdutos;
    imp.aliquotaEsperada = getAliquotaEsperada(imp.tipo);
    imp.valorEsperado = imp.baseEsperada * (imp.aliquotaEsperada / 100);
    imp.status = validarImposto(imp);
  });
  document.getElementById('content').innerHTML = notaEntradaScreen();
}

function getAliquotaEsperada(tipo) {
  switch (tipo) {
    case 'ICMS': return PARAMETROS_FISCAIS.icms;
    case 'IPI': return PARAMETROS_FISCAIS.ipi;
    case 'PIS': return PARAMETROS_FISCAIS.pis;
    case 'COFINS': return PARAMETROS_FISCAIS.cofins;
    case 'IBS': return PARAMETROS_FISCAIS.ibs;
    case 'CBS': return PARAMETROS_FISCAIS.cbs;
    default: return 0;
  }
}

function notaEntradaConfirmarDivergencia(tipo) {
  const imp = notaEntradaForm.impostos.find(i => i.tipo === tipo);
  if (!imp) return;
  const justificativa = prompt(
    `Justificativa para confirmar ${tipo} com divergência ` +
    `(digitado R$ ${imp.valor.toFixed(2)} vs esperado R$ ${imp.valorEsperado.toFixed(2)}):`
  );
  if (!justificativa) return;
  imp.confirmado = true;
  imp.justificativa = justificativa;
  imp.status = 'confirmado_divergente';
  document.getElementById('content').innerHTML = notaEntradaScreen();
}

function notaEntradaAjustarParaEsperado(tipo) {
  const imp = notaEntradaForm.impostos.find(i => i.tipo === tipo);
  if (!imp) return;
  imp.base = imp.baseEsperada;
  imp.aliquota = imp.aliquotaEsperada;
  imp.valor = imp.valorEsperado;
  imp.status = 'ok';
  document.getElementById('content').innerHTML = notaEntradaScreen();
}

// ============================================================
// ETAPA 4 — REVISÃO
// ============================================================

function etapa4Revisao() {
  const totalProdutos = notaEntradaForm.itens.reduce((s, i) => s + (i.valorTotal || 0), 0);
  const totalImpostos = notaEntradaForm.impostos.reduce((s, i) => s + (i.valor || 0), 0);
  const totalNota = totalProdutos + totalImpostos;
  const pendentes = notaEntradaForm.impostos.filter(i => i.status === 'divergente');

  return `
    <div class="nota-entrada-header">
      <h1>Digitar Nota de Entrada</h1>
      <span class="etapa-label">Etapa 4 de 4 — Revisão</span>
    </div>
    <p class="subtitle">Confira os dados antes de gerar</p>

    ${wizardProgress(4)}

    <div class="card">
      <h2>Dados do documento</h2>
      <p>
        <strong>${notaEntradaForm.tipo}</strong> · ${notaEntradaForm.filial} ·
        ${notaEntradaForm.fornecedorNome || '—'} · Nº ${notaEntradaForm.numero || '—'}
      </p>
      <p class="muted">
        Data: ${notaEntradaForm.dataEmissao || '—'} ·
        Forma: ${notaEntradaForm.formaPagamento} ·
        Condição: ${notaEntradaForm.condicaoPagamento}
      </p>
    </div>

    <div class="card">
      <h2>Itens (${notaEntradaForm.itens.length})</h2>
      <table class="data">
        <thead><tr><th>Descrição</th><th>CFOP</th><th>NCM</th><th>Qtd</th><th>Vlr unit.</th><th>Total</th></tr></thead>
        <tbody>
          ${notaEntradaForm.itens.map(it => `
            <tr>
              <td>${it.descricao || '—'}</td>
              <td>${it.cfop}</td>
              <td>${it.ncm || '—'}</td>
              <td>${it.quantidade}</td>
              <td>${formatarMoeda(it.valorUnitario)}</td>
              <td>${formatarMoeda(it.valorTotal)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <div class="card">
      <h2>Impostos</h2>
      <table class="data">
        <thead><tr><th>Tipo</th><th>Base</th><th>Alíquota</th><th>Valor</th><th>Status</th></tr></thead>
        <tbody>
          ${notaEntradaForm.impostos.map(imp => `
            <tr>
              <td><strong>${imp.tipo}</strong></td>
              <td>${formatarMoeda(imp.base)}</td>
              <td>${imp.aliquota}%</td>
              <td>${formatarMoeda(imp.valor)}</td>
              <td>${statusImposto(imp)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      ${notaEntradaForm.impostos.filter(i => i.confirmado).length > 0 ? `
        <div class="alert alert-info" style="margin-top:10px;">
          <strong>Divergências confirmadas:</strong>
          <ul>
            ${notaEntradaForm.impostos.filter(i => i.confirmado).map(i => `
              <li>${i.tipo}: ${i.justificativa}</li>
            `).join('')}
          </ul>
        </div>
      ` : ''}
    </div>

    <div class="card">
      <h2>Contrapartida</h2>
      <p>
        Destino: <strong>${notaEntradaForm.contaDestino || '—'}</strong> ·
        Contrapartida: <strong>${notaEntradaForm.contaContrapartida || '—'}</strong> ·
        Centro de custo: <strong>${notaEntradaForm.centroCusto || '—'}</strong>
      </p>
    </div>

    <div class="card">
      <h2>Partidas dobradas</h2>
      ${previewPartidas()}
    </div>

    ${pendentes.length > 0 ? `
      <div class="alert alert-warn">
        <strong>⚠️ Impostos divergentes não confirmados</strong>
        <p>Confirme ou ajuste os impostos divergentes antes de gerar a nota.</p>
        <ul>
          ${pendentes.map(i => `<li>${i.tipo}: R$ ${i.valor.toFixed(2)} (esperado R$ ${i.valorEsperado.toFixed(2)})</li>`).join('')}
        </ul>
      </div>
    ` : ''}

    <div class="form-actions">
      <button class="btn btn-secondary" onclick="notaEntradaEtapaAnterior()">← Voltar</button>
      <button class="btn btn-secondary" onclick="notaEntradaSalvarRascunho()">Salvar rascunho</button>
      <button class="btn btn-primary" onclick="notaEntradaConfirmar()" ${pendentes.length > 0 ? 'disabled' : ''}>
        Confirmar e gerar
      </button>
    </div>
  `;
}

// ============================================================
// NAVEGAÇÃO
// ============================================================

function notaEntradaProximaEtapa() {
  if (notaEntradaForm.etapa === 1) {
    if (!notaEntradaForm.fornecedorNome) { alert('Informe o fornecedor.'); return; }
    if (!notaEntradaForm.numero) { alert('Informe o número da nota.'); return; }
    if (!notaEntradaForm.dataEmissao) { alert('Informe a data de emissão.'); return; }
    notaEntradaForm.etapa = 2;
  } else if (notaEntradaForm.etapa === 2) {
    const it = notaEntradaForm.itens[0];
    if (!it || !it.descricao || !it.valorTotal) {
      alert('Preencha ao menos um item com descrição e valor.');
      return;
    }
    // Pré-carrega os impostos com os valores esperados (editáveis)
    inicializarImpostos();
    notaEntradaForm.etapa = 3;
  } else if (notaEntradaForm.etapa === 3) {
    if (!notaEntradaForm.contaDestino || !notaEntradaForm.contaContrapartida || !notaEntradaForm.centroCusto) {
      alert('Preencha a contrapartida (conta de destino, contrapartida e centro de custo).');
      return;
    }
    notaEntradaForm.etapa = 4;
  }
  document.getElementById('content').innerHTML = notaEntradaScreen();
}

function notaEntradaEtapaAnterior() {
  if (notaEntradaForm.etapa > 1) notaEntradaForm.etapa--;
  document.getElementById('content').innerHTML = notaEntradaScreen();
}

// ============================================================
// AÇÕES FINAIS
// ============================================================

function notaEntradaSalvarRascunho() {
  notasEntradaRascunho.push({ ...notaEntradaForm });
  alert('Rascunho salvo.');
}

function notaEntradaConfirmar() {
  const totalProdutos = notaEntradaForm.itens.reduce((s, i) => s + (i.valorTotal || 0), 0);
  const totalImpostos = notaEntradaForm.impostos.reduce((s, i) => s + (i.valor || 0), 0);
  const totalNota = totalProdutos + totalImpostos;

  const nova = {
    id: Math.max(0, ...notasEntrada.map(n => n.id)) + 1,
    tipo: notaEntradaForm.tipo,
    filial: notaEntradaForm.filial,
    fornecedor: notaEntradaForm.fornecedorNome,
    numero: notaEntradaForm.numero,
    serie: notaEntradaForm.serie,
    dataEmissao: notaEntradaForm.dataEmissao,
    valorTotal: totalNota,
    status: 'Classificado automaticamente',
    itens: notaEntradaForm.itens.length,
    impostos: notaEntradaForm.impostos.map(i => i.tipo).join(', '),
  };
  notasEntrada.push(nova);

  document.getElementById('content').innerHTML = `
    <h1>✅ Nota de entrada gerada com sucesso!</h1>
    <p class="subtitle">${nova.tipo} ${nova.numero} · ${nova.fornecedor} · ${formatarMoeda(nova.valorTotal)}</p>

    <div class="card">
      <h2>O que foi gerado</h2>
      <ul>
        <li><strong>Documento:</strong> ${nova.tipo} ${nova.numero} (${nova.fornecedor})</li>
        <li><strong>Lançamentos:</strong> partidas dobradas</li>
        <li><strong>Contas a pagar:</strong> ${notaEntradaForm.condicaoPagamento}</li>
        <li><strong>Razão de impostos:</strong> ${nova.impostos}</li>
        ${notaEntradaForm.impostos.filter(i => i.confirmado).length > 0
          ? `<li><strong>Divergências confirmadas:</strong> ${notaEntradaForm.impostos.filter(i => i.confirmado).map(i => i.tipo).join(', ')}</li>`
          : ''}
      </ul>
    </div>

    <div class="form-actions">
      <button class="btn btn-secondary" onclick="showScreen('nota-entrada-lista')">Ver lista</button>
      <button class="btn btn-secondary" onclick="showScreen('contas-pagar')">Ver contas a pagar</button>
      <button class="btn btn-primary" onclick="novaNotaEntrada()">Nova nota</button>
    </div>
  `;
}

// ============================================================
// LISTA DE NOTAS DE ENTRADA
// ============================================================

screens['nota-entrada-lista'] = () => `
  <h1>Notas de Entrada</h1>
  <p class="subtitle">Documentos digitados manualmente</p>

  <div class="card">
    <table class="data">
      <thead><tr><th>Tipo</th><th>Fornecedor</th><th>Nº / Série</th><th>Data</th><th>Valor</th><th>Status</th><th></th></tr></thead>
      <tbody>
        ${notasEntrada.map(n => `
          <tr>
            <td><span class="badge badge-ok">${n.tipo}</span></td>
            <td><strong>${n.fornecedor}</strong></td>
            <td>${n.numero} / ${n.serie}</td>
            <td>${formatarData(n.dataEmissao)}</td>
            <td>${formatarMoeda(n.valorTotal)}</td>
            <td><span class="badge badge-ok">${n.status}</span></td>
            <td><a href="#" onclick="editarNotaEntrada(${n.id}); return false;">Editar</a></td>
          </tr>
        `).join('')}
      </tbody>
    </table>
    <div class="form-actions" style="justify-content:flex-start; margin-top:14px;">
      <button class="btn btn-primary" onclick="novaNotaEntrada()">+ Nova nota de entrada</button>
    </div>
  </div>
`;

// Também registra a rota 'nota-entrada' como a lista (ponto de entrada)
screens['nota-entrada'] = () => screens['nota-entrada-lista']();