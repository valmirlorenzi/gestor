/* ============================================================
   NOTA DE SAÍDA — wizard de 4 etapas
   Etapa 1: Dados do documento
   Etapa 2: Itens
   Etapa 3: Impostos (digitados + validação) e contrapartida
   Etapa 4: Revisão e confirmação

   Espelho do nota-entrada.js, adaptado para vendas (Faturista).
   ============================================================ */

// Estado do wizard
let notaSaidaForm = null;

// ============================================================
// INICIALIZAÇÃO
// ============================================================

function novaNotaSaida() {
  notaSaidaForm = {
    etapa: 1,
    id: null,
    tipo: 'NF-e',
    filial: 'Matriz',
    clienteId: null,
    clienteNome: '',
    numero: '',
    serie: '1',
    chave: '',
    dataEmissao: '',
    natureza: '',
    formaRecebimento: 'A prazo',
    condicaoRecebimento: '30 dias',
    observacoes: '',
    itens: [],
    impostos: [],
    contaDestino: '5.1.1',         // Receita de Vendas
    contaContrapartida: '1.1.3',   // Contas a Receber
    centroCusto: 'Comercial',
    pendencias: [],
  };
  document.getElementById('content').innerHTML = notaSaidaScreen();
}

function editarNotaSaida(id) {
  const n = notasSaida.find(x => x.id === id);
  if (!n) return;
  notaSaidaForm = {
    etapa: 1,
    id: n.id,
    tipo: n.tipo,
    filial: n.filial,
    clienteId: null,
    clienteNome: n.cliente,
    numero: n.numero,
    serie: n.serie,
    chave: '',
    dataEmissao: n.dataEmissao,
    natureza: 'Venda de mercadoria',
    formaRecebimento: 'A prazo',
    condicaoRecebimento: '30 dias',
    observacoes: '',
    itens: [{
      descricao: 'Produto (editável)',
      cfop: '5102',
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
      contaSugerida: '5.1.1',
    }],
    impostos: [],
    contaDestino: '5.1.1',
    contaContrapartida: '1.1.3',
    centroCusto: 'Comercial',
    pendencias: [],
  };
  inicializarImpostosSaida();
  document.getElementById('content').innerHTML = notaSaidaScreen();
}

// Inicializa a lista de impostos de saída já com os valores esperados (editáveis)
function inicializarImpostosSaida() {
  const tipos = ['ICMS', 'IPI', 'PIS', 'COFINS', 'IBS', 'CBS'];
  const totalProdutos = notaSaidaForm.itens.reduce((s, i) => s + (i.valorTotal || 0), 0);

  notaSaidaForm.impostos = tipos.map(tipo => {
    const aliquotaEsperada = getAliquotaEsperadaSaida(tipo);
    const baseEsperada = totalProdutos;
    const valorEsperado = baseEsperada * (aliquotaEsperada / 100);

    return {
      tipo,
      base: baseEsperada,
      aliquota: aliquotaEsperada,
      valor: valorEsperado,
      natureza: 'Debito',            // venda → débito no razão
      status: 'ok',
      valorEsperado,
      baseEsperada,
      aliquotaEsperada,
      confirmado: false,
      justificativa: '',
    };
  });
}

// ============================================================
// TELA PRINCIPAL
// ============================================================

function notaSaidaScreen() {
  if (!notaSaidaForm) novaNotaSaida();
  switch (notaSaidaForm.etapa) {
    case 1: return etapa1DadosSaida();
    case 2: return etapa2ItensSaida();
    case 3: return etapa3ImpostosSaida();
    case 4: return etapa4RevisaoSaida();
    default: return etapa1DadosSaida();
  }
}

function wizardProgressSaida(etapaAtual) {
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

function etapa1DadosSaida() {
  return `
    <div class="nota-saida-header">
      <h1>Digitar Nota de Saída <span class="nota-saida-badge">VENDA</span></h1>
      <span class="etapa-label">Etapa 1 de 4</span>
    </div>
    <p class="subtitle">Dados do documento</p>

    ${wizardProgressSaida(1)}

    <div class="card">
      <h2>Tipo de documento *</h2>
      <div class="chips">
        ${['NF-e', 'NFS-e', 'CT-e'].map(t => `
          <span class="chip ${notaSaidaForm.tipo === t ? 'on' : 'off'}"
                onclick="notaSaidaSetTipo('${t}')">${t}</span>
        `).join('')}
      </div>
    </div>

    <div class="card">
      <h2>Dados</h2>
      <div class="form-grid">
        <div class="form-row">
          <label>Filial *</label>
          <select onchange="notaSaidaForm.filial=this.value">
            <option ${notaSaidaForm.filial === 'Matriz' ? 'selected' : ''}>Matriz</option>
            <option ${notaSaidaForm.filial === 'Filial 2' ? 'selected' : ''}>Filial 2</option>
          </select>
        </div>
        <div class="form-row">
          <label>Cliente *</label>
          <input type="text" placeholder="Nome do cliente"
                 value="${notaSaidaForm.clienteNome}"
                 onchange="notaSaidaForm.clienteNome=this.value">
        </div>
        <div class="form-row">
          <label>Número *</label>
          <input type="text" value="${notaSaidaForm.numero}"
                 onchange="notaSaidaForm.numero=this.value">
        </div>
        <div class="form-row">
          <label>Série</label>
          <input type="text" value="${notaSaidaForm.serie}"
                 onchange="notaSaidaForm.serie=this.value">
        </div>
        <div class="form-row">
          <label>Chave (opcional)</label>
          <input type="text" value="${notaSaidaForm.chave}"
                 onchange="notaSaidaForm.chave=this.value">
        </div>
        <div class="form-row">
          <label>Data de emissão *</label>
          <input type="date" value="${notaSaidaForm.dataEmissao}"
                 onchange="notaSaidaSetData(this.value)">
        </div>
      </div>
      ${notaSaidaAvisoData()}
    </div>

    <div class="card">
      <h2>Operação</h2>
      <div class="form-grid">
        <div class="form-row">
          <label>Natureza da operação</label>
          <input type="text" placeholder="Ex: Venda de mercadoria"
                 value="${notaSaidaForm.natureza}"
                 onchange="notaSaidaForm.natureza=this.value">
        </div>
        <div class="form-row">
          <label>Forma de recebimento *</label>
          <select onchange="notaSaidaForm.formaRecebimento=this.value">
            <option ${notaSaidaForm.formaRecebimento === 'A vista' ? 'selected' : ''}>À vista</option>
            <option ${notaSaidaForm.formaRecebimento === 'A prazo' ? 'selected' : ''}>A prazo</option>
            <option ${notaSaidaForm.formaRecebimento === 'Cartao' ? 'selected' : ''}>Cartão</option>
          </select>
        </div>
        <div class="form-row">
          <label>Condição de recebimento</label>
          <select onchange="notaSaidaForm.condicaoRecebimento=this.value">
            <option ${notaSaidaForm.condicaoRecebimento === '30 dias' ? 'selected' : ''}>30 dias</option>
            <option ${notaSaidaForm.condicaoRecebimento === '30/60 dias' ? 'selected' : ''}>30/60 dias</option>
            <option ${notaSaidaForm.condicaoRecebimento === '30/60/90 dias' ? 'selected' : ''}>30/60/90 dias</option>
          </select>
        </div>
      </div>
      <div class="form-row" style="margin-top:10px;">
        <label>Observações</label>
        <textarea rows="2" onchange="notaSaidaForm.observacoes=this.value">${notaSaidaForm.observacoes}</textarea>
      </div>
    </div>

    <div class="form-actions">
      <button class="btn btn-secondary" onclick="showScreen('nota-saida-lista')">Cancelar</button>
      <button class="btn btn-primary" onclick="notaSaidaProximaEtapa()">Próximo →</button>
    </div>
  `;
}

function notaSaidaSetTipo(t) {
  notaSaidaForm.tipo = t;
  document.getElementById('content').innerHTML = notaSaidaScreen();
}

function notaSaidaSetData(v) {
  notaSaidaForm.dataEmissao = v;
  document.getElementById('content').innerHTML = notaSaidaScreen();
}

function notaSaidaAvisoData() {
  if (!notaSaidaForm.dataEmissao) return '';
  const data = new Date(notaSaidaForm.dataEmissao);
  const mesAno = `${String(data.getMonth() + 1).padStart(2, '0')}/${data.getFullYear()}`;
  if (mesAno !== '10/2026') {
    return `
      <div class="alert alert-warn" style="margin-top:10px;">
        ⚠️ A nota tem data de emissão ${notaSaidaForm.dataEmissao} (${mesAno}),
        mas será incluída no período <strong>10/2026</strong>.
        <button class="btn-sm" onclick="notaSaidaForm.avisoDataConfirmado=true">Confirmar</button>
      </div>
    `;
  }
  return '';
}

// ============================================================
// ETAPA 2 — ITENS
// ============================================================

function etapa2ItensSaida() {
  if (notaSaidaForm.itens.length === 0) {
    notaSaidaForm.itens.push(novoItemSaida());
  }
  return `
    <div class="nota-saida-header">
      <h1>Digitar Nota de Saída <span class="nota-saida-badge">VENDA</span></h1>
      <span class="etapa-label">Etapa 2 de 4</span>
    </div>
    <p class="subtitle">Itens da nota</p>

    ${wizardProgressSaida(2)}

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
          ${notaSaidaForm.itens.map((it, i) => itemRowSaida(it, i)).join('')}
        </tbody>
      </table>
      <div class="form-actions" style="justify-content:flex-start; margin-top:10px;">
        <button class="btn btn-secondary" onclick="notaSaidaAdicionarItem()">+ Adicionar item</button>
      </div>
    </div>

    ${sugestaoD1Saida()}

    ${totalizadoresSaida()}

    <div class="form-actions">
      <button class="btn btn-secondary" onclick="notaSaidaEtapaAnterior()">← Voltar</button>
      <button class="btn btn-primary" onclick="notaSaidaProximaEtapa()">Próximo →</button>
    </div>
  `;
}

function novoItemSaida() {
  return {
    descricao: '',
    cfop: '5102',
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
    contaSugerida: '5.1.1',
    sugestaoAceita: true,
  };
}

function itemRowSaida(it, i) {
  return `
    <tr>
      <td>${i + 1}</td>
      <td><input type="text" value="${it.descricao}"
                 onchange="notaSaidaSetItem(${i}, 'descricao', this.value)"></td>
      <td>
        <select onchange="notaSaidaSetItem(${i}, 'cfop', this.value)">
          ${CFOPS_SAIDA.map(c => `<option value="${c.codigo}" ${it.cfop === c.codigo ? 'selected' : ''}>${c.codigo}</option>`).join('')}
        </select>
      </td>
      <td><input type="text" value="${it.ncm}"
                 onchange="notaSaidaSetItem(${i}, 'ncm', this.value)"></td>
      <td><input type="number" step="0.01" value="${it.quantidade}"
                 onchange="notaSaidaSetItem(${i}, 'quantidade', parseFloat(this.value) || 0)"></td>
      <td><input type="number" step="0.01" value="${it.valorUnitario}"
                 onchange="notaSaidaSetItem(${i}, 'valorUnitario', parseFloat(this.value) || 0)"></td>
      <td><input type="number" step="0.01" value="${it.valorTotal}" readonly></td>
      <td>
        <button class="btn-sm" onclick="notaSaidaRemoverItem(${i})" title="Remover">×</button>
      </td>
    </tr>
  `;
}

function notaSaidaSetItem(i, campo, valor) {
  notaSaidaForm.itens[i][campo] = valor;
  if (campo === 'quantidade' || campo === 'valorUnitario') {
    const it = notaSaidaForm.itens[i];
    it.valorTotal = (it.quantidade || 0) * (it.valorUnitario || 0);
  }
  document.getElementById('content').innerHTML = notaSaidaScreen();
}

function notaSaidaAdicionarItem() {
  notaSaidaForm.itens.push(novoItemSaida());
  document.getElementById('content').innerHTML = notaSaidaScreen();
}

function notaSaidaRemoverItem(i) {
  if (notaSaidaForm.itens.length === 1) {
    alert('A nota precisa ter pelo menos um item.');
    return;
  }
  notaSaidaForm.itens.splice(i, 1);
  document.getElementById('content').innerHTML = notaSaidaScreen();
}

function sugestaoD1Saida() {
  const it = notaSaidaForm.itens[0];
  if (!it) return '';
  const conta = PLANO_CONTAS.find(c => c.codigo === it.contaSugerida) || { codigo: it.contaSugerida, descricao: 'Receita de Vendas' };
  return `
    <div class="card">
      <h2>Sugestão de classificação (D1)</h2>
      <p class="muted">O motor sugere a conta com base no CFOP, NCM e cliente.</p>
      <div style="display:flex; align-items:center; gap:12px; margin-top:8px;">
        <span class="badge badge-info">${conta.codigo}</span>
        <span>${conta.descricao}</span>
        <button class="btn-sm" onclick="notaSaidaVerPorque()">Por que?</button>
        ${it.sugestaoAceita
          ? '<span class="badge badge-ok">Aceita</span>'
          : '<span class="badge badge-warn">Alterada</span>'}
      </div>
    </div>
  `;
}

function notaSaidaVerPorque() {
  alert(
    'Regra aplicada: CFOP 5102 → Receita de Vendas (prioridade 2 — por CFOP).\n' +
    'Contexto considerado: CFOP 5102, NCM 12345678.\n' +
    'Confiança: alta (regra por CFOP, sem conflito).'
  );
}

function totalizadoresSaida() {
  const totalProdutos = notaSaidaForm.itens.reduce((s, i) => s + (i.valorTotal || 0), 0);
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

function etapa3ImpostosSaida() {
  if (notaSaidaForm.impostos.length === 0) inicializarImpostosSaida();

  const temDivergencia = notaSaidaForm.impostos.some(i => i.status === 'divergente');
  return `
    <div class="nota-saida-header">
      <h1>Digitar Nota de Saída <span class="nota-saida-badge">VENDA</span></h1>
      <span class="etapa-label">Etapa 3 de 4</span>
    </div>
    <p class="subtitle">Impostos (conforme o documento) e contrapartida</p>

    ${wizardProgressSaida(3)}

    <div class="card">
      <h2>Impostos (venda)</h2>
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
          ${notaSaidaForm.impostos.map(imp => impostoRowSaida(imp)).join('')}
        </tbody>
      </table>

      <div class="form-actions" style="justify-content:flex-start; margin-top:10px;">
        <button class="btn btn-secondary" onclick="notaSaidaRecalcularEsperado()" title="Volta aos valores esperados (descarta alterações)">
          🔄 Recalcular esperado
        </button>
      </div>

      ${temDivergencia ? alertaDivergenciasSaida() : ''}
    </div>

    <div class="card">
      <h2>Contrapartida</h2>
      <div class="form-grid">
        <div class="form-row">
          <label>Conta de destino * (Receita)</label>
          <select onchange="notaSaidaForm.contaDestino=this.value">
            <option value="">— Selecione —</option>
            ${PLANO_CONTAS.map(c => `<option value="${c.codigo}" ${notaSaidaForm.contaDestino === c.codigo ? 'selected' : ''}>${c.codigo} — ${c.descricao}</option>`).join('')}
          </select>
        </div>
        <div class="form-row">
          <label>Conta de contrapartida * (Receber)</label>
          <select onchange="notaSaidaForm.contaContrapartida=this.value">
            <option value="">— Selecione —</option>
            ${PLANO_CONTAS.map(c => `<option value="${c.codigo}" ${notaSaidaForm.contaContrapartida === c.codigo ? 'selected' : ''}>${c.codigo} — ${c.descricao}</option>`).join('')}
          </select>
        </div>
        <div class="form-row">
          <label>Centro de custo *</label>
          <select onchange="notaSaidaForm.centroCusto=this.value">
            <option value="">— Selecione —</option>
            <option ${notaSaidaForm.centroCusto === 'Comercial' ? 'selected' : ''}>Comercial</option>
            <option ${notaSaidaForm.centroCusto === 'Administrativo' ? 'selected' : ''}>Administrativo</option>
            <option ${notaSaidaForm.centroCusto === 'Logística' ? 'selected' : ''}>Logística</option>
          </select>
        </div>
      </div>
    </div>

    <div class="card">
      <h2>Preview de partidas dobradas</h2>
      ${previewPartidasSaida()}
    </div>

    <div class="form-actions">
      <button class="btn btn-secondary" onclick="notaSaidaEtapaAnterior()">← Voltar</button>
      <button class="btn btn-primary" onclick="notaSaidaProximaEtapa()">Revisar →</button>
    </div>
  `;
}

function impostoRowSaida(imp) {
  return `
    <tr class="${imp.status === 'divergente' ? 'linha-divergente' : ''}">
      <td><strong>${imp.tipo}</strong></td>
      <td><input type="number" step="0.01" value="${imp.base}"
                 onchange="notaSaidaSetImposto('${imp.tipo}', 'base', parseFloat(this.value) || 0)"></td>
      <td><input type="number" step="0.01" value="${imp.aliquota}"
                 onchange="notaSaidaSetImposto('${imp.tipo}', 'aliquota', parseFloat(this.value) || 0)"></td>
      <td><input type="number" step="0.01" value="${imp.valor}"
                 onchange="notaSaidaSetImposto('${imp.tipo}', 'valor', parseFloat(this.value) || 0)"></td>
      <td>
        <select onchange="notaSaidaSetImposto('${imp.tipo}', 'natureza', this.value)">
          <option ${imp.natureza === 'Credito' ? 'selected' : ''} value="Credito">Crédito</option>
          <option ${imp.natureza === 'Debito' ? 'selected' : ''} value="Debito">Débito</option>
        </select>
      </td>
      <td>${statusImpostoSaida(imp)}</td>
      <td>${acoesImpostoSaida(imp)}</td>
    </tr>
  `;
}

function statusImpostoSaida(imp) {
  switch (imp.status) {
    case 'ok': return '<span class="badge badge-ok">✅ OK</span>';
    case 'divergente': return '<span class="badge badge-warn">⚠️ Div.</span>';
    case 'confirmado_divergente': return '<span class="badge badge-info">✔️ Confirmado</span>';
    default: return '<span class="badge">⏳</span>';
  }
}

function acoesImpostoSaida(imp) {
  if (imp.status === 'divergente') {
    return `
      <button class="btn-sm" onclick="notaSaidaConfirmarDivergencia('${imp.tipo}')" title="Manter o valor digitado">Confirmar</button>
      <button class="btn-sm" onclick="notaSaidaAjustarParaEsperado('${imp.tipo}')" title="Ajustar para o esperado">Ajustar</button>
    `;
  }
  return '';
}

function alertaDivergenciasSaida() {
  const divs = notaSaidaForm.impostos.filter(i => i.status === 'divergente');
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

function previewPartidasSaida() {
  const totalImpostos = notaSaidaForm.impostos.reduce((s, i) => s + (i.valor || 0), 0);
  const totalProdutos = notaSaidaForm.itens.reduce((s, i) => s + (i.valorTotal || 0), 0);
  const totalNota = totalProdutos;
  return `
    <table class="preview-partidas">
      <thead><tr><th>Débito</th><th>Crédito</th><th style="text-align:right;">Valor</th></tr></thead>
      <tbody>
        <tr>
          <td class="debito">${notaSaidaForm.contaContrapartida || '—'}</td>
          <td></td>
          <td class="valor">${formatarMoeda(totalNota)}</td>
        </tr>
        <tr>
          <td></td>
          <td class="receita">${notaSaidaForm.contaDestino || '—'}</td>
          <td class="valor">${formatarMoeda(totalProdutos)}</td>
        </tr>
        <tr>
          <td></td>
          <td class="credito">2.1.5 Impostos a Recolher</td>
          <td class="valor">${formatarMoeda(totalImpostos)}</td>
        </tr>
      </tbody>
    </table>
  `;
}

// Handlers
function notaSaidaSetImposto(tipo, campo, valor) {
  const imp = notaSaidaForm.impostos.find(i => i.tipo === tipo);
  if (!imp) return;
  imp[campo] = valor;
  if (campo === 'base' || campo === 'aliquota') {
    imp.valor = (imp.base || 0) * ((imp.aliquota || 0) / 100);
  }
  imp.status = validarImpostoSaida(imp);
  document.getElementById('content').innerHTML = notaSaidaScreen();
}

function validarImpostoSaida(imp) {
  if (imp.base === 0 && imp.valor === 0 && imp.aliquota === 0) return 'pendente';
  const tolValor = 0.05;
  const tolAliq = 0.01;
  const divValor = Math.abs((imp.valor || 0) - (imp.valorEsperado || 0));
  const divAliq = Math.abs((imp.aliquota || 0) - (imp.aliquotaEsperada || 0));
  if (divValor <= tolValor && divAliq <= tolAliq) return 'ok';
  if (imp.confirmado) return 'confirmado_divergente';
  return 'divergente';
}

function notaSaidaRecalcularEsperado() {
  const temAlteracao = notaSaidaForm.impostos.some(i =>
    i.base !== i.baseEsperada ||
    i.aliquota !== i.aliquotaEsperada ||
    i.valor !== i.valorEsperado
  );
  if (temAlteracao) {
    if (!confirm('Recalcular o esperado? As alterações nos impostos serão descartadas.')) return;
  }
  const totalProdutos = notaSaidaForm.itens.reduce((s, i) => s + (i.valorTotal || 0), 0);
  notaSaidaForm.impostos.forEach(imp => {
    imp.baseEsperada = totalProdutos;
    imp.aliquotaEsperada = getAliquotaEsperadaSaida(imp.tipo);
    imp.valorEsperado = imp.baseEsperada * (imp.aliquotaEsperada / 100);
    imp.base = imp.baseEsperada;
    imp.aliquota = imp.aliquotaEsperada;
    imp.valor = imp.valorEsperado;
    imp.status = 'ok';
    imp.confirmado = false;
    imp.justificativa = '';
  });
  document.getElementById('content').innerHTML = notaSaidaScreen();
}

function getAliquotaEsperadaSaida(tipo) {
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

function notaSaidaConfirmarDivergencia(tipo) {
  const imp = notaSaidaForm.impostos.find(i => i.tipo === tipo);
  if (!imp) return;
  const justificativa = prompt(
    `Justificativa para confirmar ${tipo} com divergência ` +
    `(digitado R$ ${imp.valor.toFixed(2)} vs esperado R$ ${imp.valorEsperado.toFixed(2)}):`
  );
  if (!justificativa) return;
  imp.confirmado = true;
  imp.justificativa = justificativa;
  imp.status = 'confirmado_divergente';
  document.getElementById('content').innerHTML = notaSaidaScreen();
}

function notaSaidaAjustarParaEsperado(tipo) {
  const imp = notaSaidaForm.impostos.find(i => i.tipo === tipo);
  if (!imp) return;
  imp.base = imp.baseEsperada;
  imp.aliquota = imp.aliquotaEsperada;
  imp.valor = imp.valorEsperado;
  imp.status = 'ok';
  document.getElementById('content').innerHTML = notaSaidaScreen();
}

// ============================================================
// ETAPA 4 — REVISÃO
// ============================================================

function etapa4RevisaoSaida() {
  const totalProdutos = notaSaidaForm.itens.reduce((s, i) => s + (i.valorTotal || 0), 0);
  const totalImpostos = notaSaidaForm.impostos.reduce((s, i) => s + (i.valor || 0), 0);
  const pendentes = notaSaidaForm.impostos.filter(i => i.status === 'divergente');

  return `
    <div class="nota-saida-header">
      <h1>Digitar Nota de Saída <span class="nota-saida-badge">VENDA</span></h1>
      <span class="etapa-label">Etapa 4 de 4 — Revisão</span>
    </div>
    <p class="subtitle">Confira os dados antes de gerar</p>

    ${wizardProgressSaida(4)}

    <div class="card">
      <h2>Dados do documento</h2>
      <p>
        <strong>${notaSaidaForm.tipo}</strong> · ${notaSaidaForm.filial} ·
        ${notaSaidaForm.clienteNome || '—'} · Nº ${notaSaidaForm.numero || '—'}
      </p>
      <p class="muted">
        Data: ${notaSaidaForm.dataEmissao || '—'} ·
        Forma: ${notaSaidaForm.formaRecebimento} ·
        Condição: ${notaSaidaForm.condicaoRecebimento}
      </p>
    </div>

    <div class="card">
      <h2>Itens (${notaSaidaForm.itens.length})</h2>
      <table class="data">
        <thead><tr><th>Descrição</th><th>CFOP</th><th>NCM</th><th>Qtd</th><th>Vlr unit.</th><th>Total</th></tr></thead>
        <tbody>
          ${notaSaidaForm.itens.map(it => `
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
      <h2>Impostos (venda)</h2>
      <table class="data">
        <thead><tr><th>Tipo</th><th>Base</th><th>Alíquota</th><th>Valor</th><th>Status</th></tr></thead>
        <tbody>
          ${notaSaidaForm.impostos.map(imp => `
            <tr>
              <td><strong>${imp.tipo}</strong></td>
              <td>${formatarMoeda(imp.base)}</td>
              <td>${imp.aliquota}%</td>
              <td>${formatarMoeda(imp.valor)}</td>
              <td>${statusImpostoSaida(imp)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      ${notaSaidaForm.impostos.filter(i => i.confirmado).length > 0 ? `
        <div class="alert alert-info" style="margin-top:10px;">
          <strong>Divergências confirmadas:</strong>
          <ul>
            ${notaSaidaForm.impostos.filter(i => i.confirmado).map(i => `
              <li>${i.tipo}: ${i.justificativa}</li>
            `).join('')}
          </ul>
        </div>
      ` : ''}
    </div>

    <div class="card">
      <h2>Contrapartida</h2>
      <p>
        Destino: <strong>${notaSaidaForm.contaDestino || '—'}</strong> ·
        Contrapartida: <strong>${notaSaidaForm.contaContrapartida || '—'}</strong> ·
        Centro de custo: <strong>${notaSaidaForm.centroCusto || '—'}</strong>
      </p>
    </div>

    <div class="card">
      <h2>Partidas dobradas</h2>
      ${previewPartidasSaida()}
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
      <button class="btn btn-secondary" onclick="notaSaidaEtapaAnterior()">← Voltar</button>
      <button class="btn btn-secondary" onclick="notaSaidaSalvarRascunho()">Salvar rascunho</button>
      <button class="btn btn-primary" onclick="notaSaidaConfirmar()" ${pendentes.length > 0 ? 'disabled' : ''}>
        Confirmar e gerar
      </button>
    </div>
  `;
}

// ============================================================
// NAVEGAÇÃO
// ============================================================

function notaSaidaProximaEtapa() {
  if (notaSaidaForm.etapa === 1) {
    if (!notaSaidaForm.clienteNome) { alert('Informe o cliente.'); return; }
    if (!notaSaidaForm.numero) { alert('Informe o número da nota.'); return; }
    if (!notaSaidaForm.dataEmissao) { alert('Informe a data de emissão.'); return; }
    notaSaidaForm.etapa = 2;
  } else if (notaSaidaForm.etapa === 2) {
    const it = notaSaidaForm.itens[0];
    if (!it || !it.descricao || !it.valorTotal) {
      alert('Preencha ao menos um item com descrição e valor.');
      return;
    }
    inicializarImpostosSaida();
    notaSaidaForm.etapa = 3;
  } else if (notaSaidaForm.etapa === 3) {
    if (!notaSaidaForm.contaDestino || !notaSaidaForm.contaContrapartida || !notaSaidaForm.centroCusto) {
      alert('Preencha a contrapartida (conta de destino, contrapartida e centro de custo).');
      return;
    }
    notaSaidaForm.etapa = 4;
  }
  document.getElementById('content').innerHTML = notaSaidaScreen();
}

function notaSaidaEtapaAnterior() {
  if (notaSaidaForm.etapa > 1) notaSaidaForm.etapa--;
  document.getElementById('content').innerHTML = notaSaidaScreen();
}

// ============================================================
// AÇÕES FINAIS
// ============================================================

function notaSaidaSalvarRascunho() {
  notasSaidaRascunho.push({ ...notaSaidaForm });
  alert('Rascunho salvo.');
}

function notaSaidaConfirmar() {
  const totalProdutos = notaSaidaForm.itens.reduce((s, i) => s + (i.valorTotal || 0), 0);
  const totalImpostos = notaSaidaForm.impostos.reduce((s, i) => s + (i.valor || 0), 0);

  const nova = {
    id: Math.max(0, ...notasSaida.map(n => n.id)) + 1,
    tipo: notaSaidaForm.tipo,
    filial: notaSaidaForm.filial,
    cliente: notaSaidaForm.clienteNome,
    numero: notaSaidaForm.numero,
    serie: notaSaidaForm.serie,
    dataEmissao: notaSaidaForm.dataEmissao,
    valorTotal: totalProdutos,
    status: 'Classificado automaticamente',
    itens: notaSaidaForm.itens.length,
    impostos: notaSaidaForm.impostos.map(i => i.tipo).join(', '),
  };
  notasSaida.push(nova);

  document.getElementById('content').innerHTML = `
    <h1>✅ Nota de saída gerada com sucesso!</h1>
    <p class="subtitle">${nova.tipo} ${nova.numero} · ${nova.cliente} · ${formatarMoeda(nova.valorTotal)}</p>

    <div class="card">
      <h2>O que foi gerado</h2>
      <ul>
        <li><strong>Documento:</strong> ${nova.tipo} ${nova.numero} (${nova.cliente})</li>
        <li><strong>Lançamentos:</strong> partidas dobradas</li>
        <li><strong>Contas a receber:</strong> ${notaSaidaForm.condicaoRecebimento}</li>
        <li><strong>Razão de impostos:</strong> ${nova.impostos}</li>
        ${notaSaidaForm.impostos.filter(i => i.confirmado).length > 0
          ? `<li><strong>Divergências confirmadas:</strong> ${notaSaidaForm.impostos.filter(i => i.confirmado).map(i => i.tipo).join(', ')}</li>`
          : ''}
      </ul>
    </div>

    <div class="form-actions">
      <button class="btn btn-secondary" onclick="showScreen('nota-saida-lista')">Ver lista</button>
      <button class="btn btn-secondary" onclick="showScreen('contas-receber')">Ver contas a receber</button>
      <button class="btn btn-primary" onclick="novaNotaSaida()">Nova nota</button>
    </div>
  `;
}

// ============================================================
// LISTA DE NOTAS DE SAÍDA
// ============================================================

screens['nota-saida-lista'] = () => `
  <h1>Notas de Saída</h1>
  <p class="subtitle">Documentos digitados manualmente (vendas)</p>

  <div class="card">
    <table class="data">
      <thead><tr><th>Tipo</th><th>Cliente</th><th>Nº / Série</th><th>Data</th><th>Valor</th><th>Status</th><th></th></tr></thead>
      <tbody>
        ${notasSaida.map(n => `
          <tr>
            <td><span class="badge badge-ok">${n.tipo}</span></td>
            <td><strong>${n.cliente}</strong></td>
            <td>${n.numero} / ${n.serie}</td>
            <td>${formatarData(n.dataEmissao)}</td>
            <td>${formatarMoeda(n.valorTotal)}</td>
            <td><span class="badge badge-ok">${n.status}</span></td>
            <td><a href="#" onclick="editarNotaSaida(${n.id}); return false;">Editar</a></td>
          </tr>
        `).join('')}
      </tbody>
    </table>
    <div class="form-actions" style="justify-content:flex-start; margin-top:14px;">
      <button class="btn btn-primary" onclick="novaNotaSaida()">+ Nova nota de saída</button>
    </div>
  </div>
`;

screens['nota-saida'] = () => screens['nota-saida-lista']();