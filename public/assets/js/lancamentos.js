/* ============================================================
   LANCAMENTOS.JS — Bloco 3: Lançamentos e Financeiro
   Telas: C4 (lançamento manual) e F1 (contas a pagar).
   F2, F3, F4 vêm na próxima mensagem.
   Depende de: geral.js (showScreen), dados-simulados.js (estado)
   ============================================================ */

/* ============================================================
   C4 — LANÇAMENTO MANUAL INDIVIDUAL
   ============================================================ */

screens['lancamento-manual'] = () => `
  <h1>Lançamento manual</h1>
  <p class="subtitle">O sistema monta as duas pernas (partidas dobradas) automaticamente</p>

  <div class="card">
    <h2>Operação</h2>
    <div class="form-grid">
      <div class="form-row">
        <label>Data de competência *</label>
        <input type="date" value="${lancamentoForm.data}" onchange="lancamentoForm.data=this.value">
      </div>
      <div class="form-row">
        <label>Valor *</label>
        <input type="number" min="0" step="0.01" value="${lancamentoForm.valor}" onchange="lancamentoForm.valor=parseFloat(this.value)||0">
      </div>
    </div>
    <div class="form-row">
      <label>Descrição da operação *</label>
      <input type="text" placeholder="Ex: Compra de computador a prazo" value="${lancamentoForm.descricao}" onchange="lancamentoForm.descricao=this.value">
    </div>
    <div class="form-grid">
      <div class="form-row">
        <label>Conta de destino (débito) *</label>
        <select onchange="lancamentoForm.contaDebito=this.value">
          <option value="">— Selecione —</option>
          <option value="1.2.1" ${lancamentoForm.contaDebito==='1.2.1'?'selected':''}>1.2.1 Imobilizado</option>
          <option value="3.1.1" ${lancamentoForm.contaDebito==='3.1.1'?'selected':''}>3.1.1 CMV</option>
          <option value="4.1.1" ${lancamentoForm.contaDebito==='4.1.1'?'selected':''}>4.1.1 Aluguel</option>
          <option value="6.2" ${lancamentoForm.contaDebito==='6.2'?'selected':''}>6.2 Despesas Financeiras</option>
        </select>
      </div>
      <div class="form-row">
        <label>Forma de contrapartida *</label>
        <select onchange="lancamentoForm.formaContrapartida=this.value">
          <option value="">— Selecione —</option>
          <option value="caixa" ${lancamentoForm.formaContrapartida==='caixa'?'selected':''}>À vista em caixa</option>
          <option value="banco" ${lancamentoForm.formaContrapartida==='banco'?'selected':''}>À vista em banco</option>
          <option value="aprazo" ${lancamentoForm.formaContrapartida==='aprazo'?'selected':''}>A prazo (contas a pagar)</option>
          <option value="cartao" ${lancamentoForm.formaContrapartida==='cartao'?'selected':''}>Cartão de crédito</option>
        </select>
      </div>
    </div>
    <div class="form-grid">
      <div class="form-row">
        <label>Contraparte (opcional)</label>
        <input type="text" value="${lancamentoForm.contraparte}" onchange="lancamentoForm.contraparte=this.value">
      </div>
      <div class="form-row">
        <label>Centro de custo</label>
        <select onchange="lancamentoForm.centroCusto=this.value">
          <option value="">— Selecione —</option>
          <option ${lancamentoForm.centroCusto==='Comercial'?'selected':''}>Comercial</option>
          <option ${lancamentoForm.centroCusto==='Administrativo'?'selected':''}>Administrativo</option>
          <option ${lancamentoForm.centroCusto==='Logística'?'selected':''}>Logística</option>
        </select>
      </div>
    </div>
    <div class="form-row">
      <label>Observações</label>
      <textarea rows="2" onchange="lancamentoForm.observacoes=this.value">${lancamentoForm.observacoes}</textarea>
    </div>
  </div>

  <div class="card">
    <h2>Prévia do lançamento completo</h2>
    <p class="muted" style="margin-bottom:10px;">O sistema monta as duas pernas automaticamente.</p>
    <table class="data">
      <tr><td><strong>Débito</strong></td><td>${lancamentoForm.contaDebito || '—'}</td><td>${formatarMoeda(lancamentoForm.valor)}</td></tr>
      <tr><td><strong>Crédito</strong></td><td>${contaContrapartida(lancamentoForm.formaContrapartida)}</td><td>${formatarMoeda(lancamentoForm.valor)}</td></tr>
    </table>
  </div>

  <div class="form-actions">
    <button class="btn btn-secondary" onclick="resetarLancamento()">Limpar</button>
    <button class="btn btn-primary" onclick="salvarLancamento()">Registrar lançamento</button>
  </div>
`;

function contaContrapartida(forma) {
  if (forma === 'caixa') return '1.1.1 Caixa';
  if (forma === 'banco') return '1.1.2 Bancos';
  if (forma === 'aprazo') return '2.1.1 Contas a Pagar';
  if (forma === 'cartao') return '2.1.1 Contas a Pagar (cartão)';
  return '—';
}

function resetarLancamento() {
  lancamentoForm = {
    data: '', descricao: '', valor: 0, contaDebito: '',
    formaContrapartida: '', contraparte: '', centroCusto: '', observacoes: ''
  };
  showScreen('lancamento-manual');
}

function salvarLancamento() {
  if (!lancamentoForm.data || !lancamentoForm.descricao || !lancamentoForm.valor || !lancamentoForm.contaDebito || !lancamentoForm.formaContrapartida) {
    alert('Preencha data, descrição, valor, conta de destino e forma de contrapartida.');
    return;
  }
  lancamentos.push({
    id: Math.max(0, ...lancamentos.map(l => l.id)) + 1,
    data: lancamentoForm.data,
    descricao: lancamentoForm.descricao,
    valor: lancamentoForm.valor,
    contaDebito: lancamentoForm.contaDebito,
    contaCredito: contaContrapartida(lancamentoForm.formaContrapartida).split(' ')[0],
    centroCusto: lancamentoForm.centroCusto,
    tipo: 'Manual',
    status: 'Classificado manualmente'
  });
  alert('Lançamento registrado com sucesso.');
  resetarLancamento();
}

/* ============================================================
   F1 — CONTAS A PAGAR
   ============================================================ */

screens['contas-pagar'] = () => `
  <h1>Contas a pagar</h1>
  <p class="subtitle">Geradas a partir de compras ou lançadas manualmente</p>

  <div class="card">
    <table class="data">
      <thead><tr><th>Fornecedor</th><th>Documento</th><th>Valor</th><th>Vencimento</th><th>Parcela</th><th>Status</th><th></th></tr></thead>
      <tbody>
        ${contasPagar.map(c => `
          <tr>
            <td><strong>${c.fornecedor}</strong></td>
            <td>${c.documento}</td>
            <td>${formatarMoeda(c.valor)}</td>
            <td>${formatarData(c.vencimento)}</td>
            <td>${c.parcela}</td>
            <td>${statusContaBadge(c.status)}</td>
            <td><a href="#" onclick="baixarContaPagar(${c.id}); return false;">Baixar</a></td>
          </tr>
        `).join('')}
      </tbody>
    </table>
    <div class="form-actions" style="justify-content:flex-start; margin-top:14px;">
      <button class="btn btn-primary" onclick="novaContaPagar()">+ Nova conta a pagar</button>
    </div>
  </div>
`;

function statusContaBadge(status) {
  if (status === 'Aberta') return '<span class="badge badge-warn">Aberta</span>';
  if (status === 'Baixada') return '<span class="badge badge-ok">Baixada</span>';
  if (status === 'Parcialmente baixada') return '<span class="badge badge-warn">Parcial</span>';
  return `<span class="badge">${status}</span>`;
}

function novaContaPagar() {
  contaPagarForm = {
    fornecedor: '', documento: '', valor: 0, vencimento: '',
    formaPagamento: 'A prazo', parcelas: 1, intervaloDias: 30
  };
  document.getElementById('content').innerHTML = contaPagarFormScreen();
}

function contaPagarFormScreen() {
  return `
    <h1>Nova conta a pagar</h1>
    <p class="subtitle">Informe os dados básicos. O sistema gera as parcelas.</p>

    <div class="card">
      <h2>Dados</h2>
      <div class="form-grid">
        <div class="form-row">
          <label>Fornecedor *</label>
          <input type="text" value="${contaPagarForm.fornecedor}" onchange="contaPagarForm.fornecedor=this.value">
        </div>
        <div class="form-row">
          <label>Documento (NF-e, boleto, etc.)</label>
          <input type="text" value="${contaPagarForm.documento}" onchange="contaPagarForm.documento=this.value">
        </div>
        <div class="form-row">
          <label>Valor *</label>
          <input type="number" min="0" step="0.01" value="${contaPagarForm.valor}" onchange="contaPagarForm.valor=parseFloat(this.value)||0">
        </div>
        <div class="form-row">
          <label>Vencimento *</label>
          <input type="date" value="${contaPagarForm.vencimento}" onchange="contaPagarForm.vencimento=this.value">
        </div>
        <div class="form-row">
          <label>Forma de pagamento</label>
          <select onchange="contaPagarForm.formaPagamento=this.value">
            <option ${contaPagarForm.formaPagamento==='À vista'?'selected':''}>À vista</option>
            <option ${contaPagarForm.formaPagamento==='A prazo'?'selected':''}>A prazo</option>
            <option ${contaPagarForm.formaPagamento==='Cartão'?'selected':''}>Cartão</option>
          </select>
        </div>
        <div class="form-row">
          <label>Parcelas</label>
          <input type="number" min="1" value="${contaPagarForm.parcelas}" onchange="contaPagarForm.parcelas=parseInt(this.value)||1">
        </div>
        <div class="form-row">
          <label>Intervalo entre parcelas (dias)</label>
          <input type="number" min="1" value="${contaPagarForm.intervaloDias}" onchange="contaPagarForm.intervaloDias=parseInt(this.value)||30">
        </div>
      </div>
    </div>

    <div class="form-actions">
      <button class="btn btn-secondary" onclick="showScreen('contas-pagar')">Cancelar</button>
      <button class="btn btn-primary" onclick="salvarContaPagar()">Salvar conta a pagar</button>
    </div>
  `;
}

function salvarContaPagar() {
  if (!contaPagarForm.fornecedor || !contaPagarForm.valor || !contaPagarForm.vencimento) {
    alert('Preencha fornecedor, valor e vencimento.');
    return;
  }
  contasPagar.push({
    id: Math.max(0, ...contasPagar.map(c => c.id)) + 1,
    fornecedor: contaPagarForm.fornecedor,
    documento: contaPagarForm.documento || '—',
    valor: contaPagarForm.valor,
    vencimento: contaPagarForm.vencimento,
    parcela: contaPagarForm.parcelas > 1 ? `1/${contaPagarForm.parcelas}` : '1/1',
    status: 'Aberta'
  });
  showScreen('contas-pagar');
}

function baixarContaPagar(id) {
  const c = contasPagar.find(x => x.id === id);
  if (!c) return;
  if (c.status === 'Baixada') { alert('Conta já baixada.'); return; }
  const confirma = confirm(`Registrar baixa de ${formatarMoeda(c.valor)} para ${c.fornecedor}?`);
  if (!confirma) return;
  c.status = 'Baixada';
  showScreen('contas-pagar');
}

/* ============================================================
   F2 — CONTAS A RECEBER
   ============================================================ */

screens['contas-receber'] = () => `
  <h1>Contas a receber</h1>
  <p class="subtitle">Geradas a partir de vendas ou lançadas manualmente</p>

  <div class="card">
    <table class="data">
      <thead><tr><th>Cliente</th><th>Documento</th><th>Valor</th><th>Vencimento</th><th>Parcela</th><th>Status</th><th></th></tr></thead>
      <tbody>
        ${contasReceber.map(c => `
          <tr>
            <td><strong>${c.cliente}</strong></td>
            <td>${c.documento}</td>
            <td>${formatarMoeda(c.valor)}</td>
            <td>${formatarData(c.vencimento)}</td>
            <td>${c.parcela}</td>
            <td>${statusContaBadge(c.status)}</td>
            <td><a href="#" onclick="baixarContaReceber(${c.id}); return false;">Baixar</a></td>
          </tr>
        `).join('')}
      </tbody>
    </table>
    <div class="form-actions" style="justify-content:flex-start; margin-top:14px;">
      <button class="btn btn-primary" onclick="novaContaReceber()">+ Nova conta a receber</button>
    </div>
  </div>
`;

function novaContaReceber() {
  contaReceberForm = {
    cliente: '', documento: '', valor: 0, vencimento: '',
    formaRecebimento: 'A prazo', parcelas: 1, intervaloDias: 30
  };
  document.getElementById('content').innerHTML = contaReceberFormScreen();
}

function contaReceberFormScreen() {
  return `
    <h1>Nova conta a receber</h1>
    <p class="subtitle">Informe os dados básicos. O sistema gera as parcelas.</p>

    <div class="card">
      <h2>Dados</h2>
      <div class="form-grid">
        <div class="form-row">
          <label>Cliente *</label>
          <input type="text" value="${contaReceberForm.cliente}" onchange="contaReceberForm.cliente=this.value">
        </div>
        <div class="form-row">
          <label>Documento (NF-e, NFS-e, etc.)</label>
          <input type="text" value="${contaReceberForm.documento}" onchange="contaReceberForm.documento=this.value">
        </div>
        <div class="form-row">
          <label>Valor *</label>
          <input type="number" min="0" step="0.01" value="${contaReceberForm.valor}" onchange="contaReceberForm.valor=parseFloat(this.value)||0">
        </div>
        <div class="form-row">
          <label>Vencimento *</label>
          <input type="date" value="${contaReceberForm.vencimento}" onchange="contaReceberForm.vencimento=this.value">
        </div>
        <div class="form-row">
          <label>Forma de recebimento</label>
          <select onchange="contaReceberForm.formaRecebimento=this.value">
            <option ${contaReceberForm.formaRecebimento==='À vista'?'selected':''}>À vista</option>
            <option ${contaReceberForm.formaRecebimento==='A prazo'?'selected':''}>A prazo</option>
            <option ${contaReceberForm.formaRecebimento==='Cartão'?'selected':''}>Cartão</option>
          </select>
        </div>
        <div class="form-row">
          <label>Parcelas</label>
          <input type="number" min="1" value="${contaReceberForm.parcelas}" onchange="contaReceberForm.parcelas=parseInt(this.value)||1">
        </div>
        <div class="form-row">
          <label>Intervalo entre parcelas (dias)</label>
          <input type="number" min="1" value="${contaReceberForm.intervaloDias}" onchange="contaReceberForm.intervaloDias=parseInt(this.value)||30">
        </div>
      </div>
    </div>

    <div class="form-actions">
      <button class="btn btn-secondary" onclick="showScreen('contas-receber')">Cancelar</button>
      <button class="btn btn-primary" onclick="salvarContaReceber()">Salvar conta a receber</button>
    </div>
  `;
}

function salvarContaReceber() {
  if (!contaReceberForm.cliente || !contaReceberForm.valor || !contaReceberForm.vencimento) {
    alert('Preencha cliente, valor e vencimento.');
    return;
  }
  contasReceber.push({
    id: Math.max(0, ...contasReceber.map(c => c.id)) + 1,
    cliente: contaReceberForm.cliente,
    documento: contaReceberForm.documento || '—',
    valor: contaReceberForm.valor,
    vencimento: contaReceberForm.vencimento,
    parcela: contaReceberForm.parcelas > 1 ? `1/${contaReceberForm.parcelas}` : '1/1',
    status: 'Aberta'
  });
  showScreen('contas-receber');
}

function baixarContaReceber(id) {
  const c = contasReceber.find(x => x.id === id);
  if (!c) return;
  if (c.status === 'Baixada') { alert('Conta já baixada.'); return; }
  abrirBaixaConta('receber', c);
}

/* ============================================================
   F3 — BAIXA COMPLETA (juros, multa, desconto)
   ============================================================ */

let baixaForm = {
  tipo: 'pagar',
  conta: null,
  valorPago: 0,
  dataPagamento: '',
  juros: 0,
  multa: 0,
  desconto: 0,
  formaPagamento: 'Banco',
  observacoes: ''
};

function abrirBaixaConta(tipo, conta) {
  baixaForm = {
    tipo: tipo,
    conta: conta,
    valorPago: conta.valor,
    dataPagamento: new Date().toISOString().split('T')[0],
    juros: 0,
    multa: 0,
    desconto: 0,
    formaPagamento: 'Banco',
    observacoes: ''
  };
  document.getElementById('content').innerHTML = baixaFormScreen();
}

function baixaFormScreen() {
  const c = baixaForm.conta;
  if (!c) return '<p class="empty-state">Conta não encontrada.</p>';

  const nome = baixaForm.tipo === 'pagar' ? c.fornecedor : c.cliente;
  const titulo = baixaForm.tipo === 'pagar' ? 'Baixa de conta a pagar' : 'Baixa de conta a receber';
  const labelForma = baixaForm.tipo === 'pagar' ? 'Forma de pagamento' : 'Forma de recebimento';

  return `
    <h1>${titulo}</h1>
    <p class="subtitle">${nome} · ${c.documento} · vencimento ${formatarData(c.vencimento)}</p>

    <div class="card">
      <h2>Dados da conta</h2>
      <table class="data">
        <tr><td><strong>Valor original</strong></td><td>${formatarMoeda(c.valor)}</td></tr>
        <tr><td><strong>Parcela</strong></td><td>${c.parcela}</td></tr>
        <tr><td><strong>Status</strong></td><td>${statusContaBadge(c.status)}</td></tr>
      </table>
    </div>

    <div class="card">
      <h2>Dados da baixa</h2>
      <div class="form-grid">
        <div class="form-row">
          <label>Data do ${baixaForm.tipo === 'pagar' ? 'pagamento' : 'recebimento'} *</label>
          <input type="date" value="${baixaForm.dataPagamento}" onchange="baixaForm.dataPagamento=this.value">
        </div>
        <div class="form-row">
          <label>Valor ${baixaForm.tipo === 'pagar' ? 'pago' : 'recebido'} *</label>
          <input type="number" min="0" step="0.01" value="${baixaForm.valorPago}" onchange="baixaForm.valorPago=parseFloat(this.value)||0">
        </div>
        <div class="form-row">
          <label>Juros</label>
          <input type="number" min="0" step="0.01" value="${baixaForm.juros}" onchange="baixaForm.juros=parseFloat(this.value)||0">
        </div>
        <div class="form-row">
          <label>Multa</label>
          <input type="number" min="0" step="0.01" value="${baixaForm.multa}" onchange="baixaForm.multa=parseFloat(this.value)||0">
        </div>
        <div class="form-row">
          <label>Desconto</label>
          <input type="number" min="0" step="0.01" value="${baixaForm.desconto}" onchange="baixaForm.desconto=parseFloat(this.value)||0">
        </div>
        <div class="form-row">
          <label>${labelForma}</label>
          <select onchange="baixaForm.formaPagamento=this.value">
            <option ${baixaForm.formaPagamento==='Caixa'?'selected':''}>Caixa</option>
            <option ${baixaForm.formaPagamento==='Banco'?'selected':''}>Banco</option>
            <option ${baixaForm.formaPagamento==='Cartão'?'selected':''}>Cartão</option>
          </select>
        </div>
      </div>
      <div class="form-row">
        <label>Observações</label>
        <textarea rows="2" onchange="baixaForm.observacoes=this.value">${baixaForm.observacoes}</textarea>
      </div>
    </div>

    <div class="card">
      <h2>Resumo</h2>
      <div class="resumo-totais">
        <div>Valor original: <strong>${formatarMoeda(c.valor)}</strong></div>
        <div>Juros + multa: <strong>${formatarMoeda(baixaForm.juros + baixaForm.multa)}</strong></div>
        <div>Desconto: <strong>${formatarMoeda(baixaForm.desconto)}</strong></div>
        <div>Total a ${baixaForm.tipo === 'pagar' ? 'pagar' : 'receber'}: <span class="destaque-valor">${formatarMoeda(c.valor + baixaForm.juros + baixaForm.multa - baixaForm.desconto)}</span></div>
      </div>
    </div>

    <div class="form-actions">
      <button class="btn btn-secondary" onclick="cancelarBaixa()">Cancelar</button>
      <button class="btn btn-primary" onclick="confirmarBaixa()">Confirmar baixa</button>
    </div>
  `;
}

function cancelarBaixa() {
  showScreen(baixaForm.tipo === 'pagar' ? 'contas-pagar' : 'contas-receber');
}

function confirmarBaixa() {
  if (!baixaForm.dataPagamento || !baixaForm.valorPago) {
    alert('Preencha data e valor.');
    return;
  }
  const c = baixaForm.conta;
  c.status = 'Baixada';
  alert(`Baixa registrada: ${formatarMoeda(c.valor + baixaForm.juros + baixaForm.multa - baixaForm.desconto)}`);
  showScreen(baixaForm.tipo === 'pagar' ? 'contas-pagar' : 'contas-receber');
}

/* ============================================================
   F4 — POSIÇÃO DE CAIXA E BANCOS
   ============================================================ */

screens['caixa'] = () => {
  const totalCaixa = movimentosCaixa
    .filter(m => m.conta === '1.1.1 Caixa')
    .reduce((s, m) => s + (m.tipo === 'Saída' ? -m.valor : m.valor), 0);

  const totalBanco = movimentosCaixa
    .filter(m => m.conta === '1.1.2 Bancos')
    .reduce((s, m) => s + (m.tipo === 'Saída' ? -m.valor : m.valor), 0);

  const contasPagarAbertas = contasPagar.filter(c => c.status === 'Aberta').reduce((s, c) => s + c.valor, 0);
  const contasReceberAbertas = contasReceber.filter(c => c.status === 'Aberta').reduce((s, c) => s + c.valor, 0);

  const totalDisponivel = totalCaixa + totalBanco;
  const saldoProjetado = totalDisponivel - contasPagarAbertas + contasReceberAbertas;

  return `
    <h1>Posição de caixa e bancos</h1>
    <p class="subtitle">Visão consolidada das disponibilidades e do fluxo projetado</p>

    <div class="form-grid">
      <div class="card">
        <h2>Posição atual</h2>
        <table class="data">
          <tr><td>Caixa</td><td>${formatarMoeda(totalCaixa)}</td></tr>
          <tr><td>Bancos</td><td>${formatarMoeda(totalBanco)}</td></tr>
          <tr><td><strong>Total disponível</strong></td><td><strong>${formatarMoeda(totalDisponivel)}</strong></td></tr>
        </table>
      </div>

      <div class="card">
        <h2>Projeção (curto prazo)</h2>
        <table class="data">
          <tr><td>Contas a pagar em aberto</td><td>- ${formatarMoeda(contasPagarAbertas)}</td></tr>
          <tr><td>Contas a receber em aberto</td><td>+ ${formatarMoeda(contasReceberAbertas)}</td></tr>
          <tr><td><strong>Saldo projetado</strong></td><td><span class="destaque-valor">${formatarMoeda(saldoProjetado)}</span></td></tr>
        </table>
      </div>
    </div>

    <div class="card">
      <h2>Alertas</h2>
      <table class="data">
        ${contasPagar.filter(c => c.status === 'Aberta' && new Date(c.vencimento) < new Date()).length > 0
          ? `<tr><td><span class="badge badge-warn">Aviso</span></td><td>${contasPagar.filter(c => c.status === 'Aberta' && new Date(c.vencimento) < new Date()).length} conta(s) a pagar vencida(s)</td></tr>`
          : '<tr><td><span class="badge badge-ok">OK</span></td><td>Nenhuma conta a pagar vencida</td></tr>'}
        ${saldoProjetado < 0
          ? '<tr><td><span class="badge badge-err">Erro</span></td><td>Saldo projetado negativo</td></tr>'
          : '<tr><td><span class="badge badge-ok">OK</span></td><td>Saldo projetado positivo</td></tr>'}
      </table>
    </div>

    <div class="card">
      <h2>Movimentos recentes</h2>
      <table class="data">
        <thead><tr><th>Data</th><th>Descrição</th><th>Tipo</th><th>Conta</th><th>Valor</th></tr></thead>
        <tbody>
          ${movimentosCaixa.map(m => `
            <tr>
              <td>${formatarData(m.data)}</td>
              <td>${m.descricao}</td>
              <td>${m.tipo}</td>
              <td>${m.conta}</td>
              <td>${formatarMoeda(m.valor)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
};

