/* ============================================================
   DADOS-SIMULADOS.JS
   Dados fictícios para o wireframe. Na implementação PHP,
   este arquivo será substituído por chamadas fetch() à API.
   ============================================================ */

/* ============================================================
   DOMÍNIOS
   ============================================================ */

/* ---------- Atores funcionais ---------- */
const ATORES = [
  { codigo: 'configurador', nome: 'Configurador' },
  { codigo: 'administrador', nome: 'Administrador' },
  { codigo: 'contador', nome: 'Contador' },
  { codigo: 'comprador', nome: 'Comprador' },
  { codigo: 'faturista', nome: 'Faturista' },
  { codigo: 'financeiro1', nome: 'Financeiro1' },
  { codigo: 'financeiro2', nome: 'Financeiro2' },
  { codigo: 'gerente_financeiro', nome: 'Gerente Financeiro' },
  { codigo: 'rh', nome: 'RH' },
  { codigo: 'auditor', nome: 'Auditor' }
];

/* ---------- Filiais simuladas ---------- */
const FILIAIS_SIMULADAS = [
  { id: 1, nome: 'Matriz' },
  { id: 2, nome: 'Filial Campinas' }
];

/* ============================================================
   BLOCO 1 — CONFIGURAÇÃO
   ============================================================ */

/* ---------- Empresa (estado do formulário) ---------- */
const empresaData = {
  regime: '',
  setor: '',
  dataInicio: '',
  cnae: '',
  plano: 'padrao'
};

/* ---------- Filial (estado do formulário) ---------- */
const filialForm = {
  cnpj: '',
  razao: '',
  fantasia: '',
  cnae: '',
  dataInicio: ''
};

/* ============================================================
   BLOCO 2 — CADASTROS
   ============================================================ */

/* ---------- Usuários ---------- */
let usuarios = [
  { id: 1, nome: 'Carlos Silva', email: 'carlos@empresa.com', atores: ['configurador'], filiais: [1, 2], ativo: true },
  { id: 2, nome: 'Ana Souza', email: 'ana@empresa.com', atores: ['contador', 'auditor'], filiais: [1], ativo: true },
  { id: 3, nome: 'Bruno Lima', email: 'bruno@empresa.com', atores: ['comprador'], filiais: [1, 2], ativo: true }
];

let usuarioForm = {
  id: null, nome: '', email: '', atores: [], filiais: [], ativo: true
};

/* ---------- Clientes ---------- */
let clientes = [
  { id: 1, tipo: 'PJ', nome: 'Comércio ABC Ltda', documento: '12.345.678/0001-90', contato: '(11) 99999-1111', prazo: 30, ativo: true },
  { id: 2, tipo: 'PF', nome: 'Maria Oliveira', documento: '123.456.789-00', contato: '(11) 98888-2222', prazo: 15, ativo: true }
];

let clienteForm = {
  id: null, tipo: 'PJ', nome: '', documento: '', contato: '', prazo: 30, ativo: true
};

/* ---------- Fornecedores ---------- */
let fornecedores = [
  { id: 1, tipo: 'PJ', nome: 'Distribuidora XYZ S.A.', documento: '98.765.432/0001-10', contato: '(11) 97777-3333', categoria: 'Mercadoria para Revenda', prazo: 45, ativo: true },
  { id: 2, tipo: 'PJ', nome: 'Papelaria Central', documento: '11.222.333/0001-44', contato: '(11) 96666-4444', categoria: 'Material de Escritório', prazo: 30, ativo: true }
];

let fornecedorForm = {
  id: null, tipo: 'PJ', nome: '', documento: '', contato: '', categoria: '', prazo: 30, ativo: true
};

/* ---------- Produtos e serviços ---------- */
let produtosServicos = [
  { id: 1, tipo: 'P', descricao: 'Caneta esferográfica azul', codigoInterno: 'CAN-AZ-01', ncm: '9608.10.00', unidade: 'UN', ativo: true },
  { id: 2, tipo: 'P', descricao: 'Papel A4 500 folhas', codigoInterno: 'PAP-A4-500', ncm: '4802.56.10', unidade: 'RES', ativo: true },
  { id: 3, tipo: 'S', descricao: 'Manutenção de computadores', codigoInterno: 'SRV-MAN-01', lc116: '14.01', ativo: true }
];

let produtoForm = {
  id: null, tipo: 'P', descricao: '', codigoInterno: '', ncm: '', lc116: '', unidade: 'UN', ativo: true
};

/* ---------- Funcionários ---------- */
let funcionarios = [
  { id: 1, nome: 'João Silva', cpf: '111.222.333-44', cargo: 'Vendedor', centroCusto: 'Comercial', salario: 3500, admissao: '2024-01-15', natureza: 'Despesa Fixa', rateio: 100, ativo: true },
  { id: 2, nome: 'Maria Souza', cpf: '555.666.777-88', cargo: 'Analista', centroCusto: 'Administrativo', salario: 5200, admissao: '2023-06-01', natureza: 'Despesa Fixa', rateio: 100, ativo: true }
];

let funcionarioForm = {
  id: null, nome: '', cpf: '', cargo: '', centroCusto: '', salario: 0, admissao: '', natureza: 'Despesa Fixa', rateio: 100, ativo: true
};

/* ---------- Ativos ---------- */
let ativos = [
  { id: 1, nome: 'Computador Dell', aquisicao: '2024-03-01', valorOriginal: 4500, valorResidual: 500, vidaUtil: 60, metodo: 'Linear', centroCusto: 'Administrativo', destino: 'Despesa', mesInicial: '2024-04', ativo: true }
];

let ativoForm = {
  id: null, nome: '', aquisicao: '', valorOriginal: 0, valorResidual: 0, vidaUtil: 60, metodo: 'Linear', centroCusto: '', destino: 'Despesa', mesInicial: '', ativo: true
};

/* ============================================================
   BLOCO 3 — LANÇAMENTOS E FINANCEIRO
   ============================================================ */

/* ---------- Lançamentos ---------- */
let lancamentos = [
  { id: 1, data: '2026-10-05', descricao: 'Compra de mercadoria a prazo', valor: 2500, contaDebito: '3.1.1', contaCredito: '2.1.1', centroCusto: 'Comercial', tipo: 'Compra', status: 'Classificado automaticamente' },
  { id: 2, data: '2026-10-10', descricao: 'Tarifa bancária', valor: 45, contaDebito: '6.2', contaCredito: '1.1.2', centroCusto: 'Administrativo', tipo: 'Manual', status: 'Classificado manualmente' }
];

let lancamentoForm = {
  data: '',
  descricao: '',
  valor: 0,
  contaDebito: '',
  formaContrapartida: '',
  contraparte: '',
  centroCusto: '',
  observacoes: ''
};

/* ---------- Movimentos de caixa/banco (para F4) ---------- */
let movimentosCaixa = [
  { id: 1, data: '2026-10-01', descricao: 'Saldo inicial', tipo: 'Saldo', conta: '1.1.1 Caixa', valor: 5000 },
  { id: 2, data: '2026-10-05', descricao: 'Recebimento de cliente', tipo: 'Entrada', conta: '1.1.2 Bancos', valor: 1200 },
  { id: 3, data: '2026-10-08', descricao: 'Pagamento de fornecedor', tipo: 'Saída', conta: '1.1.2 Bancos', valor: 2500 }
];

/* ============================================================
   ADIÇÕES PARA NOTA DE ENTRADA
   ============================================================ */

// CFOPs (amostra — o ideal é carregar do 05_apendices.md)
const CFOPS = [
  { codigo: '1102', descricao: 'Compra para comercialização', natureza: 'E' },
  { codigo: '1556', descricao: 'Compra de material para uso ou consumo', natureza: 'E' },
  { codigo: '1551', descricao: 'Compra de bem para o ativo imobilizado', natureza: 'E' },
  { codigo: '2102', descricao: 'Compra para comercialização (interestadual)', natureza: 'E' },
  { codigo: '2556', descricao: 'Compra de material para uso ou consumo (interestadual)', natureza: 'E' },
  { codigo: '2551', descricao: 'Compra de bem para o ativo imobilizado (interestadual)', natureza: 'E' },
];

// CSTs de ICMS (amostra)
const CSTS_ICMS = [
  { codigo: '00', descricao: 'Tributada integralmente' },
  { codigo: '10', descricao: 'Tributada e com cobrança do ICMS por ST' },
  { codigo: '20', descricao: 'Com redução de base de cálculo' },
  { codigo: '40', descricao: 'Isenta' },
  { codigo: '41', descricao: 'Não tributada' },
  { codigo: '60', descricao: 'ICMS cobrado anteriormente por ST' },
];

// CSTs de PIS/COFINS (amostra)
const CSTS_PIS_COFINS = [
  { codigo: '01', descricao: 'Operação tributável com alíquota básica' },
  { codigo: '50', descricao: 'Operação com direito a crédito' },
  { codigo: '70', descricao: 'Operação sem direito a crédito' },
];

// Parâmetros fiscais (mock — viriam de parametros_fiscais)
const PARAMETROS_FISCAIS = {
  regime: 'Presumido',
  icms: 18.00,       // alíquota padrão (mock — viria por UF)
  ipi: 5.00,         // mock — viria da TIPI por NCM
  pis: 0.65,         // cumulativo
  cofins: 3.00,      // cumulativo
  ibs: 0.10,         // 2026 (fase teste)
  cbs: 0.90,         // 2026 (fase teste)
};

// Plano de contas (amostra — viria de planos_contas)
const PLANO_CONTAS = [
  { codigo: '1.1.1',   descricao: 'Caixa' },
  { codigo: '1.1.2',   descricao: 'Bancos' },
  { codigo: '1.1.5',   descricao: 'Impostos a Recuperar' },
  { codigo: '1.2.1',   descricao: 'Imobilizado' },
  { codigo: '2.1.1',   descricao: 'Fornecedores' },
  { codigo: '3.1.1',   descricao: 'CMV' },
  { codigo: '4.1.2',   descricao: 'Despesa com Material' },
  { codigo: '4.1.3',   descricao: 'Despesa com Combustível' },
];

// Notas de entrada já digitadas (para a lista)
const notasEntrada = [
  {
    id: 1,
    tipo: 'NF-e',
    filial: 'Matriz',
    fornecedor: 'Fornecedor XYZ Ltda',
    numero: '1234',
    serie: '1',
    dataEmissao: '2026-10-15',
    valorTotal: 1322.50,
    status: 'Classificado automaticamente',
    itens: 1,
    impostos: 'ICMS, IPI, PIS, COFINS, IBS, CBS',
  },
  {
    id: 2,
    tipo: 'NF-e',
    filial: 'Matriz',
    fornecedor: 'Posto Shell',
    numero: '5678',
    serie: '1',
    dataEmissao: '2026-10-10',
    valorTotal: 500.00,
    status: 'Classificado automaticamente',
    itens: 1,
    impostos: 'ICMS, PIS, COFINS, IBS, CBS',
  },
];

// Rascunhos
let notasEntradaRascunho = [];

/* ============================================================
   ADIÇÕES PARA NOTA DE SAÍDA
   ============================================================ */

// CFOPs de saída (amostra)
const CFOPS_SAIDA = [
  { codigo: '5102', descricao: 'Venda de mercadoria adquirida de terceiros', natureza: 'S' },
  { codigo: '6102', descricao: 'Venda de mercadoria adquirida de terceiros (interestadual)', natureza: 'S' },
  { codigo: '5101', descricao: 'Venda de produção do estabelecimento', natureza: 'S' },
  { codigo: '6101', descricao: 'Venda de produção do estabelecimento (interestadual)', natureza: 'S' },
  { codigo: '5933', descricao: 'Prestação de serviço tributado pelo ISSQN', natureza: 'S' },
  { codigo: '5405', descricao: 'Venda de mercadoria com ST (substituto)', natureza: 'S' },
];

// Notas de saída já digitadas
const notasSaida = [
  {
    id: 1,
    tipo: 'NF-e',
    filial: 'Matriz',
    cliente: 'Cliente ABC Ltda',
    numero: '9001',
    serie: '1',
    dataEmissao: '2026-10-18',
    valorTotal: 2500.00,
    status: 'Classificado automaticamente',
    itens: 1,
    impostos: 'ICMS, PIS, COFINS, IBS, CBS',
  },
];

// Rascunhos de saída
let notasSaidaRascunho = [];

/* ============================================================
   ADIÇÕES PARA CONTAS A PAGAR E RECEBER
   ============================================================ */

// Contas bancárias (mock — viria de contas_bancarias)
const CONTAS_BANCARIAS = [
  { id: 1, banco: 'Banco do Brasil', agencia: '1234-5', numero: '67890-1', tipo: 'Corrente', saldoInicial: 10000.00 },
  { id: 2, banco: 'Itaú',            agencia: '4321-0', numero: '12345-6', tipo: 'Corrente', saldoInicial: 5000.00 },
  { id: 3, banco: 'Caixa',           agencia: '0001',   numero: 'Caixa',     tipo: 'Caixa',   saldoInicial: 500.00 },
];

// Formas de pagamento (mock — viria de formas_pagamento)
const FORMAS_PAGAMENTO = [
  { id: 1, descricao: 'Boleto' },
  { id: 2, descricao: 'PIX' },
  { id: 3, descricao: 'Transferência' },
  { id: 4, descricao: 'Dinheiro' },
  { id: 5, descricao: 'Cartão de crédito' },
];

// Contas a pagar (mock — viria de contas_pagar)
const contasPagar = [
  {
    id: 1,
    fornecedor: 'Fornecedor XYZ Ltda',
    documento: 'NF-e 1234',
    numeroParcela: 1,
    totalParcelas: 3,
    valor: 500.00,
    dataEmissao: '2026-10-15',
    dataVencimento: '2026-11-15',
    dataPagamento: null,
    valorPago: 0,
    juros: 0,
    multa: 0,
    desconto: 0,
    status: 'Aberta',
    statusFluxo: 'Aguardando pagamento',
  },
  {
    id: 2,
    fornecedor: 'Fornecedor XYZ Ltda',
    documento: 'NF-e 1234',
    numeroParcela: 2,
    totalParcelas: 3,
    valor: 500.00,
    dataEmissao: '2026-10-15',
    dataVencimento: '2026-12-15',
    dataPagamento: null,
    valorPago: 0,
    juros: 0,
    multa: 0,
    desconto: 0,
    status: 'Aberta',
    statusFluxo: 'Aguardando pagamento',
  },
  {
    id: 3,
    fornecedor: 'Posto Shell',
    documento: 'NF-e 5678',
    numeroParcela: 1,
    totalParcelas: 1,
    valor: 500.00,
    dataEmissao: '2026-10-10',
    dataVencimento: '2026-10-10',
    dataPagamento: '2026-10-10',
    valorPago: 500.00,
    juros: 0,
    multa: 0,
    desconto: 0,
    status: 'Baixada',
    statusFluxo: 'Pago',
  },
  {
    id: 4,
    fornecedor: 'Papelaria Central',
    documento: 'NF-e 9012',
    numeroParcela: 1,
    totalParcelas: 1,
    valor: 300.00,
    dataEmissao: '2026-09-20',
    dataVencimento: '2026-10-20',
    dataPagamento: null,
    valorPago: 0,
    juros: 0,
    multa: 0,
    desconto: 0,
    status: 'Aberta',
    statusFluxo: 'Aguardando pagamento',
  },
];

// Contas a receber (mock — viria de contas_receber)
const contasReceber = [
  {
    id: 1,
    cliente: 'Cliente ABC Ltda',
    documento: 'NF-e 9001',
    numeroParcela: 1,
    totalParcelas: 2,
    valor: 1250.00,
    dataEmissao: '2026-10-18',
    dataVencimento: '2026-11-18',
    dataRecebimento: null,
    valorRecebido: 0,
    juros: 0,
    multa: 0,
    desconto: 0,
    status: 'Aberta',
    statusFluxo: 'Aguardando recebimento',
  },
  {
    id: 2,
    cliente: 'Cliente ABC Ltda',
    documento: 'NF-e 9001',
    numeroParcela: 2,
    totalParcelas: 2,
    valor: 1250.00,
    dataEmissao: '2026-10-18',
    dataVencimento: '2026-12-18',
    dataRecebimento: null,
    valorRecebido: 0,
    juros: 0,
    multa: 0,
    desconto: 0,
    status: 'Aberta',
    statusFluxo: 'Aguardando recebimento',
  },
  {
    id: 3,
    cliente: 'João da Silva',
    documento: 'NF-e 9002',
    numeroParcela: 1,
    totalParcelas: 1,
    valor: 800.00,
    dataEmissao: '2026-09-15',
    dataVencimento: '2026-10-15',
    dataRecebimento: null,
    valorRecebido: 0,
    juros: 0,
    multa: 0,
    desconto: 0,
    status: 'Aberta',
    statusFluxo: 'Aguardando recebimento',
  },
  {
    id: 4,
    cliente: 'Empresa Delta',
    documento: 'NF-e 9003',
    numeroParcela: 1,
    totalParcelas: 1,
    valor: 2000.00,
    dataEmissao: '2026-10-05',
    dataVencimento: '2026-10-05',
    dataRecebimento: '2026-10-05',
    valorRecebido: 2000.00,
    juros: 0,
    multa: 0,
    desconto: 0,
    status: 'Baixada',
    statusFluxo: 'Recebido',
  },
];

// Parâmetros de juros/multa (mock — viria de configuracoes)
const PARAMETROS_JUROS = {
  jurosAoDia: 0.033,   // 0,033% ao dia (~1% ao mês)
  multa: 2.00,         // 2% sobre o valor
};

/* ============================================================
   ADIÇÕES PARA CAIXA DE ENTRADA / SAÍDA / HISTÓRICO
   ============================================================ */

// Ordens (mock — viria de tarefas)
// Cada ordem tem: id, tipo_ordem (O1–O32), documento, ator_origem, ator_destino,
// status, urgente, data_criacao, data_conclusao, descricao_resumida
const ordens = [
  // ----- Caixa de entrada (pendentes / em andamento) -----
  {
    id: 1,
    tipoOrdem: 'O7',
    tipoOrdemNome: 'Revisar classificação',
    documento: 'NF-e 1234',
    documentoId: 1,
    atorOrigem: 'sistema',
    atorDestino: 'comprador',
    status: 'pendente',
    urgente: true,
    dataCriacao: '2026-10-23T09:15:00',
    dataConclusao: null,
    descricaoResumida: 'Revisar classificação de 1 item da NF-e 1234 (Fornecedor XYZ)',
    prioridade: 1,
  },
  {
    id: 2,
    tipoOrdem: 'O15',
    tipoOrdemNome: 'Gerar conta a pagar',
    documento: 'NF-e 1234',
    documentoId: 1,
    atorOrigem: 'comprador',
    atorDestino: 'financeiro1',
    status: 'pendente',
    urgente: false,
    dataCriacao: '2026-10-23T09:16:00',
    dataConclusao: null,
    descricaoResumida: 'Conferir conta a pagar gerada (NF-e 1234)',
    prioridade: 3,
  },
  {
    id: 3,
    tipoOrdem: 'O17',
    tipoOrdemNome: 'Pagar conta',
    documento: 'Conta a pagar #4',
    documentoId: 4,
    atorOrigem: 'sistema',
    atorDestino: 'financeiro1',
    status: 'em_andamento',
    urgente: true,
    dataCriacao: '2026-10-20T08:00:00',
    dataConclusao: null,
    descricaoResumida: 'Pagar conta vencida da Papelaria Central (R$ 300,00)',
    prioridade: 1,
  },
  {
    id: 4,
    tipoOrdem: 'O23',
    tipoOrdemNome: 'Validar fechamento',
    documento: 'Período 10/2026',
    documentoId: 12,
    atorOrigem: 'contador',
    atorDestino: 'auditor',
    status: 'pendente',
    urgente: false,
    dataCriacao: '2026-10-24T10:30:00',
    dataConclusao: null,
    descricaoResumida: 'Validar consolidação do fechamento 10/2026',
    prioridade: 2,
  },
  {
    id: 5,
    tipoOrdem: 'O9',
    tipoOrdemNome: 'Resolver pendência de dados',
    documento: 'NF-e 1234',
    documentoId: 1,
    atorOrigem: 'sistema',
    atorDestino: 'comprador',
    status: 'pendente',
    urgente: false,
    dataCriacao: '2026-10-23T09:15:00',
    dataConclusao: null,
    descricaoResumida: 'NCM ausente no item 2 da NF-e 1234',
    prioridade: 4,
  },
  {
    id: 6,
    tipoOrdem: 'O19',
    tipoOrdemNome: 'Validar saída de caixa/banco',
    documento: 'Baixa #3',
    documentoId: 3,
    atorOrigem: 'financeiro1',
    atorDestino: 'gerente_financeiro',
    status: 'pendente',
    urgente: false,
    dataCriacao: '2026-10-24T14:00:00',
    dataConclusao: null,
    descricaoResumida: 'Validar pagamento da conta #3 (R$ 500,00)',
    prioridade: 3,
  },

  // ----- Caixa de saída (emitidas e ainda pendentes/em andamento) -----
  {
    id: 7,
    tipoOrdem: 'O1',
    tipoOrdemNome: 'Conferir NF-e de entrada',
    documento: 'NF-e 1234',
    documentoId: 1,
    atorOrigem: 'comprador',
    atorDestino: 'contador',
    status: 'em_andamento',
    urgente: false,
    dataCriacao: '2026-10-23T09:00:00',
    dataConclusao: null,
    descricaoResumida: 'Conferir NF-e 1234 (Fornecedor XYZ)',
    prioridade: 3,
  },
  {
    id: 8,
    tipoOrdem: 'O10',
    tipoOrdemNome: 'Validar lançamento contábil',
    documento: 'NF-e 1234',
    documentoId: 1,
    atorOrigem: 'comprador',
    atorDestino: 'contador',
    status: 'pendente',
    urgente: false,
    dataCriacao: '2026-10-23T09:20:00',
    dataConclusao: null,
    descricaoResumida: 'Validar lançamento contábil da NF-e 1234',
    prioridade: 3,
  },
  {
    id: 9,
    tipoOrdem: 'O25',
    tipoOrdemNome: 'Apontar problema (auditoria)',
    documento: 'Lançamento #2',
    documentoId: 2,
    atorOrigem: 'auditor',
    atorDestino: 'contador',
    status: 'pendente',
    urgente: true,
    dataCriacao: '2026-10-22T16:00:00',
    dataConclusao: null,
    descricaoResumida: 'Auditor apontou classificação incorreta no lançamento #2',
    prioridade: 1,
  },

  // ----- Histórico (concluídas / canceladas) -----
  {
    id: 10,
    tipoOrdem: 'O1',
    tipoOrdemNome: 'Conferir NF-e de entrada',
    documento: 'NF-e 5678',
    documentoId: 2,
    atorOrigem: 'comprador',
    atorDestino: 'contador',
    status: 'concluida',
    urgente: false,
    dataCriacao: '2026-10-10T09:00:00',
    dataConclusao: '2026-10-10T11:30:00',
    descricaoResumida: 'Conferir NF-e 5678 (Posto Shell)',
    prioridade: 3,
  },
  {
    id: 11,
    tipoOrdem: 'O17',
    tipoOrdemNome: 'Pagar conta',
    documento: 'Conta a pagar #3',
    documentoId: 3,
    atorOrigem: 'sistema',
    atorDestino: 'financeiro1',
    status: 'concluida',
    urgente: false,
    dataCriacao: '2026-10-10T08:00:00',
    dataConclusao: '2026-10-10T09:15:00',
    descricaoResumida: 'Pagar conta da Posto Shell (R$ 500,00)',
    prioridade: 3,
  },
  {
    id: 12,
    tipoOrdem: 'O7',
    tipoOrdemNome: 'Revisar classificação',
    documento: 'NF-e 5678',
    documentoId: 2,
    atorOrigem: 'sistema',
    atorDestino: 'comprador',
    status: 'concluida',
    urgente: false,
    dataCriacao: '2026-10-10T09:15:00',
    dataConclusao: '2026-10-10T09:45:00',
    descricaoResumida: 'Revisar classificação de 1 item da NF-e 5678',
    prioridade: 3,
  },
  {
    id: 13,
    tipoOrdem: 'O9',
    tipoOrdemNome: 'Resolver pendência de dados',
    documento: 'NF-e 5678',
    documentoId: 2,
    atorOrigem: 'sistema',
    atorDestino: 'comprador',
    status: 'cancelada',
    urgente: false,
    dataCriacao: '2026-10-10T09:15:00',
    dataConclusao: '2026-10-10T10:00:00',
    descricaoResumida: 'Pendência de NCM resolvida manualmente',
    prioridade: 4,
  },
];

// Usuário logado (mock — para filtrar a caixa de entrada/saída)
const USUARIO_ORDENS = {
  nome: 'Carlos Silva',
  ator: 'comprador',        // ator principal (para a caixa de entrada)
  filial: 'Matriz',
};

// Filtros da caixa de entrada
let filtroCaixaEntrada = {
  tipo: 'todos',            // todos, O1..O32
  urgente: 'todos',         // todos, urgentes, normais
  documento: '',
};

// Filtros da caixa de saída
let filtroCaixaSaida = {
  tipo: 'todos',
  status: 'todos',          // todos, pendente, em_andamento
  documento: '',
};

// Filtros do histórico
let filtroHistorico = {
  tipo: 'todos',
  status: 'todos',          // todos, concluida, cancelada
  documento: '',
  periodo: 'todos',         // todos, 7dias, 30dias, 90dias
};

/* ============================================================
   ADIÇÕES PARA TELAS DO CONTADOR
   ============================================================ */

// Lançamentos pendentes de revisão (D3)
const lancamentosPendentes = [
  {
    id: 101,
    data: '2026-10-15',
    documento: 'NF-e 1234',
    contraparte: 'Fornecedor XYZ Ltda',
    valor: 1000.00,
    contaSugerida: '3.1.1',
    centroCustoSugerido: 'Comercial',
    contrapartidaSugerida: '2.1.1',
    status: 'Classificado automaticamente',
    confianca: 'alta',
    justificativa: 'Regra: Fornecedor XYZ + CFOP 1102 → Custo > CMV (prioridade 1)',
    contexto: { fornecedor: 'Fornecedor XYZ Ltda', cfop: '1102', ncm: '9608.10.00' },
  },
  {
    id: 102,
    data: '2026-10-15',
    documento: 'NF-e 1234',
    contraparte: 'Fornecedor XYZ Ltda',
    valor: 322.50,
    contaSugerida: '4.1.2',
    centroCustoSugerido: 'Administrativo',
    contrapartidaSugerida: '2.1.1',
    status: 'Conflito',
    confianca: 'baixa',
    justificativa: 'Conflito: "Fornecedor XYZ + CFOP 1556 → Despesa Material" (prioridade 1) vs. "NCM 9608 → Despesa Papelaria" (prioridade 4)',
    contexto: { fornecedor: 'Fornecedor XYZ Ltda', cfop: '1556', ncm: '9608.10.00' },
  },
  {
    id: 103,
    data: '2026-10-18',
    documento: 'NF-e 9001',
    contraparte: 'Cliente ABC Ltda',
    valor: 2500.00,
    contaSugerida: '5.1.1',
    centroCustoSugerido: 'Comercial',
    contrapartidaSugerida: '1.1.3',
    status: 'Classificado automaticamente',
    confianca: 'alta',
    justificativa: 'Regra: CFOP 5102 → Receita de Vendas (prioridade 2)',
    contexto: { cliente: 'Cliente ABC Ltda', cfop: '5102', ncm: '12345678' },
  },
  {
    id: 104,
    data: '2026-10-20',
    documento: 'NF-e 9012',
    contraparte: 'Papelaria Central',
    valor: 300.00,
    contaSugerida: null,
    centroCustoSugerido: null,
    contrapartidaSugerida: null,
    status: 'Nao classificado',
    confianca: 'baixa',
    justificativa: 'Nenhuma regra aplicável. Classifique manualmente.',
    contexto: { fornecedor: 'Papelaria Central', cfop: '1556', ncm: '' },
  },
];

// Regras de classificação (D5)
const regrasClassificacao = [
  { id: 1, descricao: 'Fornecedor XYZ + CFOP 1102 → CMV', prioridade: 1, contexto: 'Fornecedor XYZ, CFOP 1102', contaDestino: '3.1.1', centroCusto: 'Comercial', origem: 'Manual', ativo: true, usos: 12, ultimoUso: '2026-10-23' },
  { id: 2, descricao: 'Fornecedor XYZ + CFOP 1556 → Despesa Material', prioridade: 1, contexto: 'Fornecedor XYZ, CFOP 1556', contaDestino: '4.1.2', centroCusto: 'Administrativo', origem: 'Manual', ativo: true, usos: 5, ultimoUso: '2026-10-15' },
  { id: 3, descricao: 'CFOP 5102 → Receita de Vendas', prioridade: 2, contexto: 'CFOP 5102', contaDestino: '5.1.1', centroCusto: 'Comercial', origem: 'Manual', ativo: true, usos: 28, ultimoUso: '2026-10-18' },
  { id: 4, descricao: 'NCM 9608 → Despesa Papelaria', prioridade: 4, contexto: 'NCM 9608.10.00', contaDestino: '4.1.2', centroCusto: 'Administrativo', origem: 'Aprendida', ativo: true, usos: 3, ultimoUso: '2026-10-15' },
  { id: 5, descricao: 'Posto Shell → Combustível', prioridade: 1, contexto: 'Fornecedor Posto Shell', contaDestino: '4.1.3', centroCusto: 'Administrativo', origem: 'Manual', ativo: true, usos: 8, ultimoUso: '2026-10-10' },
  { id: 6, descricao: 'CFOP 1551 → Imobilizado', prioridade: 2, contexto: 'CFOP 1551', contaDestino: '1.2.1', centroCusto: 'Administrativo', origem: 'Manual', ativo: false, usos: 0, ultimoUso: null },
];

// Pendências (T6)
const pendencias = [
  { id: 1, categoria: 'Erro', tipo: 'Nao classificado', descricao: 'Lançamento 104 (NF-e 9012, Papelaria Central) não classificado', referencia: 'Lançamento #104', status: 'Aberta', dataCriacao: '2026-10-20' },
  { id: 2, categoria: 'Erro', tipo: 'Conflito de regras', descricao: 'Lançamento 102 (NF-e 1234) com conflito de regras', referencia: 'Lançamento #102', status: 'Aberta', dataCriacao: '2026-10-15' },
  { id: 3, categoria: 'Aviso', tipo: 'Conta vencida', descricao: 'Conta a pagar #4 (Papelaria Central) venceu em 20/10/2026', referencia: 'Conta a pagar #4', status: 'Aberta', dataCriacao: '2026-10-21' },
  { id: 4, categoria: 'Aviso', tipo: 'Dados faltantes', descricao: 'NCM ausente no item 2 da NF-e 1234', referencia: 'NF-e #1', status: 'Aberta', dataCriacao: '2026-10-15' },
];

// Fechamento (A6)
const fechamentoData = {
  periodo: '10/2026',
  filial: 'Matriz',
  status: 'Aberto',
  pendenciasErro: 2,
  pendenciasAviso: 2,
  consolidacoes: {
    folha: { status: 'ok', data: '2026-10-23' },
    depreciacao: { status: 'ok', data: '2026-10-23' },
    provisoes: { status: 'pendente', data: null },
  },
  auditoria: { validado: false, auditor: null, data: null, observacao: '' },
};

// Filtros das telas do Contador
let filtroRevisao = { status: 'todos', confianca: 'todas', busca: '' };
let filtroRegras = { prioridade: 'todas', origem: 'todas', ativo: 'todos', busca: '' };
let filtroPendencias = { categoria: 'todas', status: 'todas', busca: '' };

/* ============================================================
   ADIÇÕES PARA TELAS DO CONTADOR (parte 2)
   ============================================================ */

// Tabelas de parâmetros fiscais (I2 / 4.1)
const parametrosFiscais = [
  { id: 1, tipoImposto: 'ICMS', descricao: 'ICMS padrão SP', aliquota: 18.00, baseCalculo: 'Valor da operação', vigenciaInicio: '2026-01-01', vigenciaFim: '2026-12-31', universal: true, ativo: true },
  { id: 2, tipoImposto: 'ICMS', descricao: 'ICMS reduzido (cesta básica)', aliquota: 7.00, baseCalculo: 'Valor da operação', vigenciaInicio: '2026-01-01', vigenciaFim: '2026-12-31', universal: false, ativo: true },
  { id: 3, tipoImposto: 'IPI', descricao: 'IPI 5% (NCM 9608)', aliquota: 5.00, baseCalculo: 'Valor do produto', vigenciaInicio: '2026-01-01', vigenciaFim: null, universal: true, ativo: true },
  { id: 4, tipoImposto: 'PIS', descricao: 'PIS cumulativo', aliquota: 0.65, baseCalculo: 'Faturamento', vigenciaInicio: '2026-01-01', vigenciaFim: null, universal: true, ativo: true },
  { id: 5, tipoImposto: 'PIS', descricao: 'PIS não cumulativo', aliquota: 1.65, baseCalculo: 'Faturamento', vigenciaInicio: '2026-01-01', vigenciaFim: null, universal: false, ativo: true },
  { id: 6, tipoImposto: 'COFINS', descricao: 'COFINS cumulativo', aliquota: 3.00, baseCalculo: 'Faturamento', vigenciaInicio: '2026-01-01', vigenciaFim: null, universal: true, ativo: true },
  { id: 7, tipoImposto: 'COFINS', descricao: 'COFINS não cumulativo', aliquota: 7.60, baseCalculo: 'Faturamento', vigenciaInicio: '2026-01-01', vigenciaFim: null, universal: false, ativo: true },
  { id: 8, tipoImposto: 'IBS', descricao: 'IBS fase teste 2026', aliquota: 0.10, baseCalculo: 'Valor da operação', vigenciaInicio: '2026-01-01', vigenciaFim: '2026-12-31', universal: true, ativo: true },
  { id: 9, tipoImposto: 'CBS', descricao: 'CBS fase teste 2026', aliquota: 0.90, baseCalculo: 'Valor da operação', vigenciaInicio: '2026-01-01', vigenciaFim: '2026-12-31', universal: true, ativo: true },
  { id: 10, tipoImposto: 'ISS', descricao: 'ISS padrão São Paulo', aliquota: 5.00, baseCalculo: 'Valor do serviço', vigenciaInicio: '2026-01-01', vigenciaFim: null, universal: false, ativo: true },
];

// Tabelas de INSS (I2)
const tabelasINSS = [
  { id: 1, faixa: 1, valorInicial: 0.00, valorFinal: 1518.00, aliquota: 7.50, vigenciaInicio: '2026-01-01', vigenciaFim: '2026-12-31' },
  { id: 2, faixa: 2, valorInicial: 1518.01, valorFinal: 2793.88, aliquota: 9.00, vigenciaInicio: '2026-01-01', vigenciaFim: '2026-12-31' },
  { id: 3, faixa: 3, valorInicial: 2793.89, valorFinal: 4190.83, aliquota: 12.00, vigenciaInicio: '2026-01-01', vigenciaFim: '2026-12-31' },
  { id: 4, faixa: 4, valorInicial: 4190.84, valorFinal: 8157.41, aliquota: 14.00, vigenciaInicio: '2026-01-01', vigenciaFim: '2026-12-31' },
];

// Tabelas de IRRF (I2)
const tabelasIRRF = [
  { id: 1, faixa: 1, valorInicial: 0.00, valorFinal: 2259.20, aliquota: 0.00, deducao: 0.00, redutor: 0.00, vigenciaInicio: '2026-01-01', vigenciaFim: '2026-12-31' },
  { id: 2, faixa: 2, valorInicial: 2259.21, valorFinal: 2826.65, aliquota: 7.50, deducao: 169.44, redutor: 0.00, vigenciaInicio: '2026-01-01', vigenciaFim: '2026-12-31' },
  { id: 3, faixa: 3, valorInicial: 2826.66, valorFinal: 3751.05, aliquota: 15.00, deducao: 381.44, redutor: 0.00, vigenciaInicio: '2026-01-01', vigenciaFim: '2026-12-31' },
  { id: 4, faixa: 4, valorInicial: 3751.06, valorFinal: 4664.68, aliquota: 22.50, deducao: 662.77, redutor: 0.00, vigenciaInicio: '2026-01-01', vigenciaFim: '2026-12-31' },
  { id: 5, faixa: 5, valorInicial: 4664.69, valorFinal: 999999.99, aliquota: 27.50, deducao: 896.00, redutor: 0.00, vigenciaInicio: '2026-01-01', vigenciaFim: '2026-12-31' },
];

// Tabelas de encargos (I2)
const tabelasEncargos = [
  { id: 1, descricao: 'INSS patronal', aliquota: 20.00, vigenciaInicio: '2026-01-01', vigenciaFim: null },
  { id: 2, descricao: 'FGTS', aliquota: 8.00, vigenciaInicio: '2026-01-01', vigenciaFim: null },
  { id: 3, descricao: 'RAT (risco leve)', aliquota: 1.00, vigenciaInicio: '2026-01-01', vigenciaFim: null },
  { id: 4, descricao: 'Terceiros (Sistema S)', aliquota: 5.80, vigenciaInicio: '2026-01-01', vigenciaFim: null },
];

// Plano de contas (árvore) — para 4.2
const planoContasArvore = [
  {
    id: 1, codigo: '1', descricao: 'ATIVO', tipo: 'Ativo', subtipo: null, natureza: 'Sintetica', aceitaLancamento: false, contaPai: null, mapeamento: '1', ativo: true,
    filhos: [
      {
        id: 2, codigo: '1.1', descricao: 'Circulante', tipo: 'Ativo', subtipo: null, natureza: 'Sintetica', aceitaLancamento: false, contaPai: 1, mapeamento: '1.1', ativo: true,
        filhos: [
          { id: 3, codigo: '1.1.1', descricao: 'Caixa', tipo: 'Ativo', subtipo: 'Operacional', natureza: 'Analitica', aceitaLancamento: true, contaPai: 2, mapeamento: '1.1.1', ativo: true },
          { id: 4, codigo: '1.1.2', descricao: 'Bancos', tipo: 'Ativo', subtipo: 'Operacional', natureza: 'Analitica', aceitaLancamento: true, contaPai: 2, mapeamento: '1.1.2', ativo: true },
          { id: 5, codigo: '1.1.3', descricao: 'Contas a Receber', tipo: 'Ativo', subtipo: 'Operacional', natureza: 'Analitica', aceitaLancamento: true, contaPai: 2, mapeamento: '1.1.3', ativo: true },
          { id: 6, codigo: '1.1.5', descricao: 'Impostos a Recuperar', tipo: 'Ativo', subtipo: 'Operacional', natureza: 'Analitica', aceitaLancamento: true, contaPai: 2, mapeamento: '1.1.5', ativo: true },
        ],
      },
      {
        id: 7, codigo: '1.2', descricao: 'Não Circulante', tipo: 'Ativo', subtipo: null, natureza: 'Sintetica', aceitaLancamento: false, contaPai: 1, mapeamento: '1.2', ativo: true,
        filhos: [
          { id: 8, codigo: '1.2.1', descricao: 'Imobilizado', tipo: 'Ativo', subtipo: 'Operacional', natureza: 'Analitica', aceitaLancamento: true, contaPai: 7, mapeamento: '1.2.1', ativo: true },
          { id: 9, codigo: '1.2.2', descricao: '(-) Depreciação Acumulada', tipo: 'Ativo', subtipo: 'Operacional', natureza: 'Analitica', aceitaLancamento: true, contaPai: 7, mapeamento: '1.2.2', ativo: true },
        ],
      },
    ],
  },
  {
    id: 10, codigo: '2', descricao: 'PASSIVO', tipo: 'Passivo', subtipo: null, natureza: 'Sintetica', aceitaLancamento: false, contaPai: null, mapeamento: '2', ativo: true,
    filhos: [
      {
        id: 11, codigo: '2.1', descricao: 'Circulante', tipo: 'Passivo', subtipo: null, natureza: 'Sintetica', aceitaLancamento: false, contaPai: 10, mapeamento: '2.1', ativo: true,
        filhos: [
          { id: 12, codigo: '2.1.1', descricao: 'Fornecedores', tipo: 'Passivo', subtipo: 'Operacional', natureza: 'Analitica', aceitaLancamento: true, contaPai: 11, mapeamento: '2.1.1', ativo: true },
          { id: 13, codigo: '2.1.2', descricao: 'Salários a Pagar', tipo: 'Passivo', subtipo: 'Operacional', natureza: 'Analitica', aceitaLancamento: true, contaPai: 11, mapeamento: '2.1.2', ativo: true },
          { id: 14, codigo: '2.1.5', descricao: 'Impostos a Recolher', tipo: 'Passivo', subtipo: 'Operacional', natureza: 'Analitica', aceitaLancamento: true, contaPai: 11, mapeamento: '2.1.5', ativo: true },
        ],
      },
    ],
  },
  {
    id: 15, codigo: '3', descricao: 'CUSTOS', tipo: 'Custo', subtipo: null, natureza: 'Sintetica', aceitaLancamento: false, contaPai: null, mapeamento: '3', ativo: true,
    filhos: [
      {
        id: 16, codigo: '3.1', descricao: 'Comércio', tipo: 'Custo', subtipo: null, natureza: 'Sintetica', aceitaLancamento: false, contaPai: 15, mapeamento: '3.1', ativo: true,
        filhos: [
          { id: 17, codigo: '3.1.1', descricao: 'CMV', tipo: 'Custo', subtipo: 'Variável', natureza: 'Analitica', aceitaLancamento: true, contaPai: 16, mapeamento: '3.1.1', ativo: true },
        ],
      },
    ],
  },
  {
    id: 18, codigo: '4', descricao: 'DESPESAS OPERACIONAIS', tipo: 'Despesa', subtipo: null, natureza: 'Sintetica', aceitaLancamento: false, contaPai: null, mapeamento: '4', ativo: true,
    filhos: [
      {
        id: 19, codigo: '4.1', descricao: 'Fixas', tipo: 'Despesa', subtipo: null, natureza: 'Sintetica', aceitaLancamento: false, contaPai: 18, mapeamento: '4.1', ativo: true,
        filhos: [
          { id: 20, codigo: '4.1.2', descricao: 'Despesa com Material', tipo: 'Despesa', subtipo: 'Fixo', natureza: 'Analitica', aceitaLancamento: true, contaPai: 19, mapeamento: '4.1.2', ativo: true },
          { id: 21, codigo: '4.1.3', descricao: 'Despesa com Combustível', tipo: 'Despesa', subtipo: 'Fixo', natureza: 'Analitica', aceitaLancamento: true, contaPai: 19, mapeamento: '4.1.3', ativo: true },
        ],
      },
    ],
  },
  {
    id: 22, codigo: '5', descricao: 'RECEITAS', tipo: 'Receita', subtipo: null, natureza: 'Sintetica', aceitaLancamento: false, contaPai: null, mapeamento: '5', ativo: true,
    filhos: [
      {
        id: 23, codigo: '5.1', descricao: 'Operacional', tipo: 'Receita', subtipo: null, natureza: 'Sintetica', aceitaLancamento: false, contaPai: 22, mapeamento: '5.1', ativo: true,
        filhos: [
          { id: 24, codigo: '5.1.1', descricao: 'Venda de Mercadorias', tipo: 'Receita', subtipo: 'Operacional', natureza: 'Analitica', aceitaLancamento: true, contaPai: 23, mapeamento: '5.1.1', ativo: true },
          { id: 25, codigo: '5.1.2', descricao: 'Prestação de Serviços', tipo: 'Receita', subtipo: 'Operacional', natureza: 'Analitica', aceitaLancamento: true, contaPai: 23, mapeamento: '5.1.2', ativo: true },
        ],
      },
    ],
  },
];

// Mapeamento referencial (ECD/ECF) — para 4.3
const mapeamentoReferencial = [
  { id: 1, contaInterna: '1.1.1', contaReferencial: '1.01.01', descricao: 'Caixa', status: 'ok' },
  { id: 2, contaInterna: '1.1.2', contaReferencial: '1.01.02', descricao: 'Bancos', status: 'ok' },
  { id: 3, contaInterna: '1.1.3', contaReferencial: '1.01.03', descricao: 'Contas a Receber', status: 'ok' },
  { id: 4, contaInterna: '1.1.5', contaReferencial: '1.01.05', descricao: 'Impostos a Recuperar', status: 'ok' },
  { id: 5, contaInterna: '1.2.1', contaReferencial: '1.02.01', descricao: 'Imobilizado', status: 'ok' },
  { id: 6, contaInterna: '2.1.1', contaReferencial: '2.01.01', descricao: 'Fornecedores', status: 'ok' },
  { id: 7, contaInterna: '2.1.2', contaReferencial: '2.01.02', descricao: 'Salários a Pagar', status: 'ok' },
  { id: 8, contaInterna: '2.1.5', contaReferencial: '2.01.05', descricao: 'Impostos a Recolher', status: 'ok' },
  { id: 9, contaInterna: '3.1.1', contaReferencial: '3.01.01', descricao: 'CMV', status: 'ok' },
  { id: 10, contaInterna: '4.1.2', contaReferencial: '4.01.02', descricao: 'Despesa com Material', status: 'ok' },
  { id: 11, contaInterna: '4.1.3', contaReferencial: '4.01.03', descricao: 'Despesa com Combustível', status: 'ok' },
  { id: 12, contaInterna: '5.1.1', contaReferencial: '5.01.01', descricao: 'Venda de Mercadorias', status: 'ok' },
  { id: 13, contaInterna: '5.1.2', contaReferencial: '5.01.02', descricao: 'Prestação de Serviços', status: 'pendente' },
];

// Cálculos pendentes de validação (4.8)
const calculosPendentes = [
  {
    id: 1, tipo: 'Impostos sobre compras', documento: 'NF-e 1234', contraparte: 'Fornecedor XYZ Ltda',
    valorCalculado: 322.50, valorXml: 310.00, divergencia: 12.50,
    detalhes: [
      { imposto: 'ICMS', calculado: 180.00, xml: 180.00, status: 'ok' },
      { imposto: 'IPI', calculado: 50.00, xml: 50.00, status: 'ok' },
      { imposto: 'PIS', calculado: 16.50, xml: 12.00, status: 'divergente' },
      { imposto: 'COFINS', calculado: 76.00, xml: 68.00, status: 'divergente' },
    ],
    status: 'pendente',
  },
  {
    id: 2, tipo: 'Impostos sobre vendas', documento: 'NF-e 9001', contraparte: 'Cliente ABC Ltda',
    valorCalculado: 522.50, valorXml: 522.50, divergencia: 0,
    detalhes: [
      { imposto: 'ICMS', calculado: 450.00, xml: 450.00, status: 'ok' },
      { imposto: 'PIS', calculado: 16.25, xml: 16.25, status: 'ok' },
      { imposto: 'COFINS', calculado: 75.00, xml: 75.00, status: 'ok' },
      { imposto: 'IBS', calculado: 2.50, xml: 2.50, status: 'ok' },
      { imposto: 'CBS', calculado: 22.50, xml: 22.50, status: 'ok' },
    ],
    status: 'ok',
  },
  {
    id: 3, tipo: 'Folha de pagamento', documento: 'Folha 10/2026', contraparte: '2 funcionários',
    valorCalculado: 11400.00, valorXml: 11400.00, divergencia: 0,
    detalhes: [
      { imposto: 'INSS empregado', calculado: 420.00, xml: 420.00, status: 'ok' },
      { imposto: 'INSS patronal', calculado: 1720.00, xml: 1720.00, status: 'ok' },
      { imposto: 'FGTS', calculado: 680.00, xml: 680.00, status: 'ok' },
      { imposto: 'IRRF', calculado: 250.00, xml: 250.00, status: 'ok' },
    ],
    status: 'ok',
  },
  {
    id: 4, tipo: 'Depreciação', documento: '10/2026', contraparte: 'Computador Dell',
    valorCalculado: 83.33, valorXml: 83.33, divergencia: 0,
    detalhes: [
      { imposto: 'Depreciação mensal', calculado: 83.33, xml: 83.33, status: 'ok' },
    ],
    status: 'ok',
  },
  {
    id: 5, tipo: 'Provisões', documento: '10/2026', contraparte: '2 funcionários',
    valorCalculado: 1250.00, valorXml: 1250.00, divergencia: 0,
    detalhes: [
      { imposto: 'Provisão de férias', calculado: 750.00, xml: 750.00, status: 'ok' },
      { imposto: 'Provisão de 13º', calculado: 500.00, xml: 500.00, status: 'ok' },
    ],
    status: 'ok',
  },
];

// Filtros das novas telas do Contador
let filtroParametros = { tipoImposto: 'todos', universal: 'todos', busca: '' };
let filtroPlanoContas = { tipo: 'todos', natureza: 'todos', busca: '' };
let filtroMapeamento = { status: 'todos', busca: '' };
let filtroValidacao = { tipo: 'todos', status: 'todos', busca: '' };

/* ============================================================
   ADIÇÕES PARA REVISÃO DE CLASSIFICAÇÕES (Comprador / Faturista)
   ============================================================ */

// Direção do lançamento (para filtrar por ator)
// Comprador vê 'entrada'; Faturista vê 'saida'; Contador vê 'ambas'
const DIRECAO_POR_ATOR = {
  comprador: 'entrada',
  faturista: 'saida',
  contador: 'ambas',
};

// Adiciona o campo 'direcao' aos lançamentos pendentes existentes
// (se já estiverem definidos em lancamentosPendentes, complementa)
if (typeof lancamentosPendentes !== 'undefined') {
  lancamentosPendentes.forEach(l => {
    // Se já tem direção, respeita; senão, infere pelo documento
    if (!l.direcao) {
      l.direcao = (l.documento && (l.documento.startsWith('NF-e 9') || l.documento.startsWith('NFS-e 9') || l.documento.startsWith('CT-e 9')))
        ? 'saida'
        : 'entrada';
    }
    // Adiciona o tipo de documento (para exibir)
    if (!l.tipoDocumento) {
      l.tipoDocumento = l.documento ? l.documento.split(' ')[0] : 'NF-e';
    }
  });
}

// Filtros da revisão por ator
let filtroRevisaoAtor = {
  status: 'todos',
  confianca: 'todas',
  busca: '',
};

/* ============================================================
   ADIÇÕES PARA TABELAS BASAIS (Financeiro1 e Financeiro2)
   ============================================================ */

// Bancos (referência — cadastrados pelo Configurador)
const bancos = [
  { id: 1, codigo: '001', nome: 'Banco do Brasil', ativo: true },
  { id: 2, codigo: '341', nome: 'Itaú Unibanco', ativo: true },
  { id: 3, codigo: '104', nome: 'Caixa Econômica Federal', ativo: true },
  { id: 4, codigo: '237', nome: 'Bradesco', ativo: true },
  { id: 5, codigo: '033', nome: 'Santander', ativo: true },
];

// Contas bancárias (compartilhadas — usadas na baixa)
const contasBancarias = [
  { id: 1, idBanco: 1, banco: 'Banco do Brasil', agencia: '1234-5', numero: '67890-1', tipo: 'Corrente', saldoInicial: 10000.00, ativo: true },
  { id: 2, idBanco: 2, banco: 'Itaú Unibanco', agencia: '4321-0', numero: '12345-6', tipo: 'Corrente', saldoInicial: 5000.00, ativo: true },
  { id: 3, idBanco: 3, banco: 'Caixa Econômica Federal', agencia: '0001', numero: 'Caixa', tipo: 'Caixa', saldoInicial: 500.00, ativo: true },
];

// Formas de pagamento (Financeiro1) — vocabulário de saída
const formasPagamento = [
  { id: 1, descricao: 'Boleto', ativo: true },
  { id: 2, descricao: 'PIX', ativo: true },
  { id: 3, descricao: 'Transferência bancária', ativo: true },
  { id: 4, descricao: 'Dinheiro', ativo: true },
  { id: 5, descricao: 'Cartão de crédito', ativo: true },
  { id: 6, descricao: 'Cheque', ativo: false },
];

// Formas de recebimento (Financeiro2) — vocabulário de entrada
const formasRecebimento = [
  { id: 1, descricao: 'Boleto', ativo: true },
  { id: 2, descricao: 'PIX', ativo: true },
  { id: 3, descricao: 'Transferência bancária', ativo: true },
  { id: 4, descricao: 'Dinheiro', ativo: true },
  { id: 5, descricao: 'Cartão de crédito', ativo: true },
  { id: 6, descricao: 'Cartão de débito', ativo: true },
  { id: 7, descricao: 'Cheque', ativo: false },
];

// Condições de pagamento (Financeiro1)
const condicoesPagamento = [
  { id: 1, descricao: 'À vista', numeroParcelas: 1, intervaloDias: 0, ativo: true },
  { id: 2, descricao: '30 dias', numeroParcelas: 1, intervaloDias: 30, ativo: true },
  { id: 3, descricao: '30/60 dias', numeroParcelas: 2, intervaloDias: 30, ativo: true },
  { id: 4, descricao: '30/60/90 dias', numeroParcelas: 3, intervaloDias: 30, ativo: true },
  { id: 5, descricao: '45 dias', numeroParcelas: 1, intervaloDias: 45, ativo: true },
];

// Condições de recebimento (Financeiro2)
const condicoesRecebimento = [
  { id: 1, descricao: 'À vista', numeroParcelas: 1, intervaloDias: 0, ativo: true },
  { id: 2, descricao: '30 dias', numeroParcelas: 1, intervaloDias: 30, ativo: true },
  { id: 3, descricao: '30/60 dias', numeroParcelas: 2, intervaloDias: 30, ativo: true },
  { id: 4, descricao: '30/60/90 dias', numeroParcelas: 3, intervaloDias: 30, ativo: true },
  { id: 5, descricao: '15 dias', numeroParcelas: 1, intervaloDias: 15, ativo: true },
  { id: 6, descricao: 'Entrada + 30 dias', numeroParcelas: 2, intervaloDias: 30, ativo: true },
];

// Abas ativas das tabelas basais (controla qual tabela está sendo vista)
let abaTabelaBasalFin1 = 'formas';   // formas | condicoes | contas | bancos
let abaTabelaBasalFin2 = 'formas';

// Filtros das tabelas basais
let filtroFormas = { busca: '', ativo: 'todos' };
let filtroCondicoes = { busca: '', ativo: 'todos' };
let filtroContasBancarias = { busca: '', ativo: 'todos' };
let filtroBancos = { busca: '', ativo: 'todos' };

/* ============================================================
   ADIÇÕES PARA GERENTE FINANCEIRO
   ============================================================ */

// Ordens de validação (mock — viriam de tarefas O19/O20)
const ordensValidacao = [
  // ----- Saídas (O19) — vindas do Financeiro1 -----
  {
    id: 101,
    tipo: 'saida',
    tipoOrdem: 'O19',
    tipoOrdemNome: 'Validar saída de caixa/banco',
    contaPagarId: 4,
    contraparte: 'Papelaria Central',
    documento: 'NF-e 9012',
    valor: 300.00,
    juros: 0.40,
    multa: 6.00,
    desconto: 0,
    total: 306.40,
    dataPagamento: '2026-10-24',
    contaBancaria: 'Banco do Brasil — 1234-5 / 67890-1',
    formaPagamento: 'Boleto',
    atorOrigem: 'financeiro1',
    atorDestino: 'gerente_financeiro',
    status: 'pendente',
    observacoes: '',
  },
  {
    id: 102,
    tipo: 'saida',
    tipoOrdem: 'O19',
    tipoOrdemNome: 'Validar saída de caixa/banco',
    contaPagarId: 3,
    contraparte: 'Posto Shell',
    documento: 'NF-e 5678',
    valor: 500.00,
    juros: 0,
    multa: 0,
    desconto: 0,
    total: 500.00,
    dataPagamento: '2026-10-10',
    contaBancaria: 'Itaú Unibanco — 4321-0 / 12345-6',
    formaPagamento: 'PIX',
    atorOrigem: 'financeiro1',
    atorDestino: 'gerente_financeiro',
    status: 'pendente',
    observacoes: '',
  },

  // ----- Entradas (O20) — vindas do Financeiro2 -----
  {
    id: 201,
    tipo: 'entrada',
    tipoOrdem: 'O20',
    tipoOrdemNome: 'Validar entrada de caixa/banco',
    contaReceberId: 3,
    contraparte: 'João da Silva',
    documento: 'NF-e 9002',
    valor: 800.00,
    juros: 2.38,
    multa: 16.00,
    desconto: 0,
    total: 818.38,
    dataRecebimento: '2026-10-24',
    contaBancaria: 'Banco do Brasil — 1234-5 / 67890-1',
    formaRecebimento: 'PIX',
    atorOrigem: 'financeiro2',
    atorDestino: 'gerente_financeiro',
    status: 'pendente',
    observacoes: '',
  },
  {
    id: 202,
    tipo: 'entrada',
    tipoOrdem: 'O20',
    tipoOrdemNome: 'Validar entrada de caixa/banco',
    contaReceberId: 4,
    contraparte: 'Empresa Delta',
    documento: 'NF-e 9003',
    valor: 2000.00,
    juros: 0,
    multa: 0,
    desconto: 0,
    total: 2000.00,
    dataRecebimento: '2026-10-05',
    contaBancaria: 'Itaú Unibanco — 4321-0 / 12345-6',
    formaRecebimento: 'Transferência',
    atorOrigem: 'financeiro2',
    atorDestino: 'gerente_financeiro',
    status: 'pendente',
    observacoes: '',
  },
];

// Filtros das validações
let filtroValidacaoSaidas = { status: 'pendente', busca: '', periodo: 'todos' };
let filtroValidacaoEntradas = { status: 'pendente', busca: '', periodo: 'todos' };

/* ============================================================
   ADIÇÕES PARA O RH
   ============================================================ */

// Aba ativa das tabelas trabalhistas
let abaTabelaTrabalhista = 'inss';   // inss | irrf | encargos

// Filtros
let filtroTabelaINSS = { busca: '', vigencia: 'atual' };
let filtroTabelaIRRF = { busca: '', vigencia: 'atual' };
let filtroTabelaEncargos = { busca: '', vigencia: 'atual' };

// Proventos e descontos (10.5)
const proventosDescontos = [
  { id: 1,  codigo: 'SAL',  descricao: 'Salário base',           tipo: 'Provento',  entraINSS: true,  entraFGTS: true,  entraIRRF: true,  ativo: true },
  { id: 2,  codigo: 'HE50', descricao: 'Hora extra 50%',         tipo: 'Provento',  entraINSS: true,  entraFGTS: true,  entraIRRF: true,  ativo: true },
  { id: 3,  codigo: 'HE100',descricao: 'Hora extra 100%',        tipo: 'Provento',  entraINSS: true,  entraFGTS: true,  entraIRRF: true,  ativo: true },
  { id: 4,  codigo: 'COM',  descricao: 'Comissão',               tipo: 'Provento',  entraINSS: true,  entraFGTS: true,  entraIRRF: true,  ativo: true },
  { id: 5,  codigo: 'ADN',  descricao: 'Adicional noturno',      tipo: 'Provento',  entraINSS: true,  entraFGTS: true,  entraIRRF: true,  ativo: true },
  { id: 6,  codigo: 'SALF', descricao: 'Salário família',        tipo: 'Provento',  entraINSS: false, entraFGTS: false, entraIRRF: false, ativo: true },
  { id: 7,  codigo: 'DIAR', descricao: 'Diárias',                tipo: 'Provento',  entraINSS: false, entraFGTS: false, entraIRRF: false, ativo: true },
  { id: 8,  codigo: 'INSS', descricao: 'INSS empregado',         tipo: 'Desconto',  entraINSS: false, entraFGTS: false, entraIRRF: false, ativo: true },
  { id: 9,  codigo: 'IRRF', descricao: 'IRRF',                   tipo: 'Desconto',  entraINSS: false, entraFGTS: false, entraIRRF: false, ativo: true },
  { id: 10, codigo: 'FALT', descricao: 'Faltas',                 tipo: 'Desconto',  entraINSS: true,  entraFGTS: true,  entraIRRF: true,  ativo: true },
  { id: 11, codigo: 'ADTO', descricao: 'Adiantamento',           tipo: 'Desconto',  entraINSS: false, entraFGTS: false, entraIRRF: false, ativo: true },
  { id: 12, codigo: 'PENS', descricao: 'Pensão alimentícia',     tipo: 'Desconto',  entraINSS: false, entraFGTS: false, entraIRRF: true,  ativo: true },
  { id: 13, codigo: 'VALE', descricao: 'Vale transporte',        tipo: 'Desconto',  entraINSS: false, entraFGTS: false, entraIRRF: false, ativo: true },
  { id: 14, codigo: 'PLAN', descricao: 'Plano de saúde',         tipo: 'Desconto',  entraINSS: false, entraFGTS: false, entraIRRF: false, ativo: true },
  { id: 15, codigo: 'SIND', descricao: 'Contribuição sindical',  tipo: 'Desconto',  entraINSS: false, entraFGTS: false, entraIRRF: false, ativo: false },
];

let filtroProventosDescontos = { tipo: 'todos', busca: '', ativo: 'todos' };

// Folha de pagamento (10.6)
const folhasPagamento = [
  {
    id: 1, mesAno: '10/2026', filial: 'Matriz', status: 'Calculada',
    totalBruto: 8700.00, totalLiquido: 7443.77, totalEncargos: 2952.40,
    totalProvisoes: 1149.00, funcionarios: 2, dataCalculo: '2026-10-23',
    lancamentoId: 1,
  },
  {
    id: 2, mesAno: '09/2026', filial: 'Matriz', status: 'Fechada',
    totalBruto: 8700.00, totalLiquido: 7443.77, totalEncargos: 2952.40,
    totalProvisoes: 1149.00, funcionarios: 2, dataCalculo: '2026-09-25',
    lancamentoId: 2,
  },
];

// Itens da folha 10/2026 (detalhamento por funcionário)
const itensFolhaAtual = [
  {
    id: 1, funcionario: 'João Silva', cargo: 'Vendedor', centroCusto: 'Comercial',
    salarioBase: 3500.00, totalProventos: 3500.00, totalDescontos: 402.70,
    baseINSS: 3500.00, baseFGTS: 3500.00, baseIRRF: 3500.00,
    inssEmpregado: 285.20, inssPatronal: 700.00, fgts: 280.00, irrf: 117.50,
    rat: 35.00, terceiros: 203.00, valorLiquido: 3097.30,
    proventos: [{ codigo: 'SAL', descricao: 'Salário base', valor: 3500.00 }],
    descontos: [
      { codigo: 'INSS', descricao: 'INSS empregado', valor: 285.20 },
      { codigo: 'IRRF', descricao: 'IRRF', valor: 117.50 },
    ],
  },
  {
    id: 2, funcionario: 'Maria Souza', cargo: 'Analista', centroCusto: 'Administrativo',
    salarioBase: 5200.00, totalProventos: 5200.00, totalDescontos: 853.53,
    baseINSS: 5200.00, baseFGTS: 5200.00, baseIRRF: 5200.00,
    inssEmpregado: 509.58, inssPatronal: 1040.00, fgts: 416.00, irrf: 343.95,
    rat: 52.00, terceiros: 301.60, valorLiquido: 4346.47,
    proventos: [{ codigo: 'SAL', descricao: 'Salário base', valor: 5200.00 }],
    descontos: [
      { codigo: 'INSS', descricao: 'INSS empregado', valor: 509.58 },
      { codigo: 'IRRF', descricao: 'IRRF', valor: 343.95 },
    ],
  },
];

// Estado do wizard de folha
let folhaForm = null;
let filtroFolhas = { status: 'todas', busca: '' };

// Helper: cálculos simulados da folha (mock — na implementação real, viria do backend)
function calcularINSS(base) {
  let inss = 0;
  let restante = base;
  for (const faixa of tabelasINSS) {
    if (restante <= 0) break;
    const limiteFaixa = faixa.valorFinal - faixa.valorInicial;
    const tributavel = Math.min(restante, limiteFaixa);
    inss += tributavel * (faixa.aliquota / 100);
    restante -= tributavel;
  }
  return Math.round(inss * 100) / 100;
}

function calcularIRRF(base, inss) {
  const baseCalculo = base - inss;
  for (const faixa of tabelasIRRF) {
    if (baseCalculo >= faixa.valorInicial && baseCalculo <= faixa.valorFinal) {
      const irrf = (baseCalculo * (faixa.aliquota / 100)) - faixa.deducao;
      return Math.max(0, Math.round(irrf * 100) / 100);
    }
  }
  return 0;
}

/* ============================================================
   ADIÇÕES PARA O AUDITOR
   ============================================================ */

// Eventos de auditoria (log)
const eventosAuditoria = [
  { id: 1, data: '2026-10-24T14:32:00', usuario: 'Carlos Silva', acao: 'Criação', tabela: 'lancamentos', registro: 'Lançamento #103', dadosAnteriores: null, dadosNovos: { conta: '5.1.1', valor: 2500.00 }, justificativa: null, ip: '192.168.1.10' },
  { id: 2, data: '2026-10-24T14:15:00', usuario: 'Ana Souza', acao: 'Edição', tabela: 'regras_classificacao', registro: 'Regra #4', dadosAnteriores: { conta: '4.1.2' }, dadosNovos: { conta: '4.1.3' }, justificativa: 'Ajuste de classificação', ip: '192.168.1.11' },
  { id: 3, data: '2026-10-24T13:45:00', usuario: 'Bruno Lima', acao: 'Override', tabela: 'notas_fiscais_impostos', registro: 'NF-e 1234 · ICMS', dadosAnteriores: { valor: 180.00 }, dadosNovos: { valor: 175.00 }, justificativa: 'Valor conforme documento físico', ip: '192.168.1.12' },
  { id: 4, data: '2026-10-24T11:00:00', usuario: 'Ana Souza', acao: 'Fechamento', tabela: 'periodos', registro: 'Período 09/2026', dadosAnteriores: { status: 'Aberto' }, dadosNovos: { status: 'Fechado' }, justificativa: null, ip: '192.168.1.11' },
  { id: 5, data: '2026-10-24T10:30:00', usuario: 'Carlos Silva', acao: 'Reclassificação', tabela: 'lancamentos', registro: 'Lançamento #102', dadosAnteriores: { conta: '4.1.2' }, dadosNovos: { conta: '4.1.3' }, justificativa: 'Reclassificação solicitada pelo Auditor', ip: '192.168.1.10' },
  { id: 6, data: '2026-10-23T16:20:00', usuario: 'Bruno Lima', acao: 'Importação', tabela: 'notas_fiscais', registro: 'NF-e 1234', dadosAnteriores: null, dadosNovos: { status: 'Importado', itens: 2 }, justificativa: null, ip: '192.168.1.12' },
  { id: 7, data: '2026-10-23T15:10:00', usuario: 'Ana Souza', acao: 'Desativação', tabela: 'regras_classificacao', registro: 'Regra #6', dadosAnteriores: { ativo: true }, dadosNovos: { ativo: false }, justificativa: 'Regra obsoleta', ip: '192.168.1.11' },
  { id: 8, data: '2026-10-23T09:00:00', usuario: 'Carlos Silva', acao: 'Aprovação', tabela: 'documentos_encadeados', registro: 'Ordem O1 → O10', dadosAnteriores: { status: 'pendente' }, dadosNovos: { status: 'concluida' }, justificativa: null, ip: '192.168.1.10' },
];

// Eventos específicos de documentos (auditoria de documentos)
const eventosDocumentos = eventosAuditoria.filter(e => ['notas_fiscais', 'documentos_encadeados'].includes(e.tabela));

// Eventos específicos de lançamentos (auditoria de lançamentos)
const eventosLancamentos = eventosAuditoria.filter(e => ['lancamentos', 'notas_fiscais_impostos', 'regras_classificacao'].includes(e.tabela));

// Transições de handoff (auditoria de transições)
const transicoesHandoff = [
  { id: 1, data: '2026-10-24T14:32:00', ordem: 'O10', documento: 'NF-e 1234', de: 'comprador', para: 'contador', estadoAnterior: 'pendente', estadoNovo: 'em_andamento' },
  { id: 2, data: '2026-10-24T14:15:00', ordem: 'O7', documento: 'NF-e 1234', de: 'sistema', para: 'comprador', estadoAnterior: 'pendente', estadoNovo: 'concluida' },
  { id: 3, data: '2026-10-24T13:45:00', ordem: 'O1', documento: 'NF-e 1234', de: 'comprador', para: 'contador', estadoAnterior: 'em_andamento', estadoNovo: 'concluida' },
  { id: 4, data: '2026-10-24T11:00:00', ordem: 'O17', documento: 'Conta #4', de: 'sistema', para: 'financeiro1', estadoAnterior: 'pendente', estadoNovo: 'concluida' },
  { id: 5, data: '2026-10-23T16:20:00', ordem: 'O9', documento: 'NF-e 1234', de: 'sistema', para: 'comprador', estadoAnterior: 'pendente', estadoNovo: 'concluida' },
];

// Apontamentos de problemas (O25)
const apontamentosAuditor = [
  { id: 1, data: '2026-10-22T16:00:00', tipoProblema: 'Classificação incorreta', descricao: 'Lançamento #102 classificado como Despesa Material, mas deveria ser Despesa Combustível', referencia: 'Lançamento #102', atorCompetente: 'contador', status: 'pendente', prazo: '2026-10-30' },
  { id: 2, data: '2026-10-20T10:30:00', tipoProblema: 'Dados faltantes', descricao: 'NCM ausente no item 2 da NF-e 1234', referencia: 'NF-e 1234', atorCompetente: 'comprador', status: 'resolvida', prazo: '2026-10-25' },
];

// Solicitações de correção (O26)
const solicitacoesCorrecao = [
  { id: 1, data: '2026-10-23T09:00:00', tipoCorrecao: 'Reclassificação', descricao: 'Reclassificar Lançamento #102 de 4.1.2 para 4.1.3', referencia: 'Lançamento #102', atorCompetente: 'contador', status: 'pendente', prazo: '2026-10-28' },
  { id: 2, data: '2026-10-21T14:00:00', tipoCorrecao: 'Ajuste de imposto', descricao: 'Ajustar ICMS da NF-e 1234 de R$ 180,00 para R$ 175,00', referencia: 'NF-e 1234', atorCompetente: 'contador', status: 'resolvida', prazo: '2026-10-25' },
];

// Fechamento (visão do Auditor — 11.8)
// Reusa o fechamentoData do 4.10, mas com status de validação
const fechamentoAuditor = {
  periodo: '10/2026',
  filial: 'Matriz',
  status: 'Aguardando validação',
  pendenciasErro: 2,
  pendenciasAviso: 2,
  consolidacoes: {
    folha: { status: 'ok', data: '2026-10-23' },
    depreciacao: { status: 'ok', data: '2026-10-23' },
    provisoes: { status: 'ok', data: '2026-10-24' },
  },
  historico: [
    { data: '2026-10-24T10:30:00', acao: 'Contador enviou consolidação', usuario: 'Ana Souza' },
  ],
};

// Filtros do Auditor
let filtroAuditoria = { usuario: 'todos', acao: 'todas', tabela: 'todas', periodo: 'todos', busca: '' };
let filtroAuditoriaDocumentos = { usuario: 'todos', acao: 'todas', periodo: 'todos', busca: '' };
let filtroAuditoriaLancamentos = { usuario: 'todos', acao: 'todas', periodo: 'todos', busca: '' };
let filtroHandoff = { ordem: 'todas', periodo: 'todos', busca: '' };
let filtroApontamentos = { status: 'todos', ator: 'todos', busca: '' };
let filtroSolicitacoes = { status: 'todos', ator: 'todos', busca: '' };
let abaAuditoria = 'log';   // log | documentos | lancamentos | handoff

/* ============================================================
   ADIÇÕES PARA O ADMINISTRADOR
   ============================================================ */

// DRE (mock — viria de lançamentos agregados)
const dreData = {
  periodo: '10/2026',
  filial: 'Matriz',
  receitaBruta: 125000.00,
  receitaMercadorias: 85000.00,
  receitaServicos: 35000.00,
  outrasReceitas: 5000.00,
  deducoes: 22500.00,
  impostosVendas: 18500.00,
  devolucoes: 4000.00,
  receitaLiquida: 102500.00,
  custos: 65000.00,
  cmv: 55000.00,
  custoServicos: 10000.00,
  lucroBruto: 37500.00,
  despesasOperacionais: 22000.00,
  despesasFixas: 15000.00,
  despesasVariaveis: 6000.00,
  despesasNaoOperacionais: 1000.00,
  lucroOperacional: 15500.00,
  receitasFinanceiras: 800.00,
  despesasFinanceiras: 1200.00,
  resultadoFinanceiro: -400.00,
  lucroAntesIR: 15100.00,
  irCsll: 2265.00,
  lucroLiquido: 12835.00,
  // Comparação com período anterior
  anterior: {
    receitaLiquida: 98000.00,
    lucroBruto: 34000.00,
    lucroLiquido: 11200.00,
  },
};

// DRE por centro de custo (mock)
const dreCentrosCusto = [
  {
    centroCusto: 'Comercial',
    receita: 85000.00,
    custos: 55000.00,
    despesas: 12000.00,
    resultado: 18000.00,
    margem: 21.18,
    percentualReceita: 68.00,
  },
  {
    centroCusto: 'Serviços',
    receita: 35000.00,
    custos: 10000.00,
    despesas: 5000.00,
    resultado: 20000.00,
    margem: 57.14,
    percentualReceita: 28.00,
  },
  {
    centroCusto: 'Administrativo',
    receita: 5000.00,
    custos: 0,
    despesas: 5000.00,
    resultado: 0,
    margem: 0,
    percentualReceita: 4.00,
  },
  {
    centroCusto: 'Não alocado',
    receita: 0,
    custos: 0,
    despesas: 0,
    resultado: -25165.00,
    margem: 0,
    percentualReceita: 0,
  },
];

// Resumo por área (mock)
const resumoAreas = [
  {
    area: 'Comercial',
    icone: '🛒',
    receita: 85000.00,
    custos: 55000.00,
    despesasFixas: 8000.00,
    despesasVariaveis: 4000.00,
    resultado: 18000.00,
    margem: 21.18,
    variacao: 8.5,
  },
  {
    area: 'Operações',
    icone: '⚙️',
    receita: 35000.00,
    custos: 10000.00,
    despesasFixas: 3500.00,
    despesasVariaveis: 1500.00,
    resultado: 20000.00,
    margem: 57.14,
    variacao: 12.3,
  },
  {
    area: 'Administrativo',
    icone: '🏢',
    receita: 5000.00,
    custos: 0,
    despesasFixas: 3500.00,
    despesasVariaveis: 1500.00,
    resultado: 0,
    margem: 0,
    variacao: -2.1,
  },
];

// Fluxo de caixa projetado (mock)
const fluxoCaixaProjetado = [
  { data: '2026-10-25', entradas: 5000.00, saidas: 3200.00, saldoDia: 1800.00, saldoAcumulado: 16800.00 },
  { data: '2026-10-28', entradas: 2500.00, saidas: 1800.00, saldoDia: 700.00, saldoAcumulado: 17500.00 },
  { data: '2026-10-30', entradas: 8000.00, saidas: 5000.00, saldoDia: 3000.00, saldoAcumulado: 20500.00 },
  { data: '2026-11-05', entradas: 12500.00, saidas: 9500.00, saldoDia: 3000.00, saldoAcumulado: 23500.00 },
  { data: '2026-11-10', entradas: 3000.00, saidas: 6500.00, saldoDia: -3500.00, saldoAcumulado: 20000.00 },
  { data: '2026-11-15', entradas: 4500.00, saidas: 4200.00, saldoDia: 300.00, saldoAcumulado: 20300.00 },
  { data: '2026-11-20', entradas: 15000.00, saidas: 8000.00, saldoDia: 7000.00, saldoAcumulado: 27300.00 },
  { data: '2026-11-30', entradas: 6000.00, saidas: 7500.00, saldoDia: -1500.00, saldoAcumulado: 25800.00 },
];

// Análise de custos por fornecedor (mock)
const custosPorFornecedor = [
  { fornecedor: 'Distribuidora XYZ S.A.', categoria: 'Mercadoria para Revenda', valor: 55000.00, documentos: 8, percentual: 65.48, variacao: 5.2 },
  { fornecedor: 'Papelaria Central', categoria: 'Material de Escritório', valor: 3000.00, documentos: 4, percentual: 3.57, variacao: -2.1 },
  { fornecedor: 'Posto Shell', categoria: 'Combustível', valor: 5000.00, documentos: 12, percentual: 5.95, variacao: 8.7 },
  { fornecedor: 'Fornecedor ABC Ltda', categoria: 'Mercadoria para Revenda', valor: 21000.00, documentos: 5, percentual: 25.00, variacao: 3.4 },
];

// Análise de custos por categoria (mock)
const custosPorCategoria = [
  { categoria: 'Mercadoria para Revenda', valor: 76000.00, documentos: 13, percentual: 90.48, variacao: 4.8 },
  { categoria: 'Combustível', valor: 5000.00, documentos: 12, percentual: 5.95, variacao: 8.7 },
  { categoria: 'Material de Escritório', valor: 3000.00, documentos: 4, percentual: 3.57, variacao: -2.1 },
];

// Margem por cliente (mock)
const margemPorCliente = [
  { cliente: 'Comércio ABC Ltda', receita: 45000.00, custos: 28000.00, despesasVariaveis: 2500.00, margemContribuicao: 14500.00, percentual: 32.22, variacao: 5.1 },
  { cliente: 'Maria Oliveira', receita: 12000.00, custos: 7500.00, despesasVariaveis: 800.00, margemContribuicao: 3700.00, percentual: 30.83, variacao: -1.2 },
  { cliente: 'Empresa Delta', receita: 28000.00, custos: 19500.00, despesasVariaveis: 1800.00, margemContribuicao: 6700.00, percentual: 23.93, variacao: 2.3 },
  { cliente: 'João da Silva', receita: 5000.00, custos: 4200.00, despesasVariaveis: 400.00, margemContribuicao: 400.00, percentual: 8.00, variacao: -8.5 },
];

// Margem por produto/serviço (mock)
const margemPorProduto = [
  { produto: 'Caneta esferográfica azul', receita: 8500.00, custo: 4200.00, margemContribuicao: 4300.00, percentual: 50.59, variacao: 4.2 },
  { produto: 'Papel A4 500 folhas', receita: 12000.00, custo: 7500.00, margemContribuicao: 4500.00, percentual: 37.50, variacao: 2.1 },
  { produto: 'Manutenção de computadores', receita: 25000.00, custo: 10000.00, margemContribuicao: 15000.00, percentual: 60.00, variacao: 6.5 },
];

// Posição de caixa (mock)
const posicaoCaixa = {
  data: '2026-10-24',
  saldoCaixa: 500.00,
  saldoBancos: 15000.00,
  saldoAplicacoes: 5000.00,
  totalDisponivel: 20500.00,
  contasPagarAbertas: 1300.00,
  contasReceberAbertas: 3300.00,
  saldoProjetado: 22500.00,
  contasBancarias: [
    { banco: 'Banco do Brasil', agencia: '1234-5', numero: '67890-1', saldo: 10000.00 },
    { banco: 'Itaú Unibanco', agencia: '4321-0', numero: '12345-6', saldo: 5000.00 },
    { banco: 'Caixa', agencia: '0001', numero: 'Caixa', saldo: 500.00 },
  ],
};

// Cenários de simulação (fase 2 — mock)
const cenariosSimulacao = [
  { id: 1, nome: 'Otimista 2026', descricao: 'Aumento de 10% nas vendas e redução de 5% nos custos', periodoBase: '10/2026', criadoEm: '2026-10-20', status: 'Salvo' },
  { id: 2, nome: 'Pessimista 2026', descricao: 'Queda de 15% nas vendas', periodoBase: '10/2026', criadoEm: '2026-10-21', status: 'Salvo' },
];

// Filtros do Administrador
let filtroDRE = { periodo: '10/2026', filial: 'Matriz', comparacao: 'anterior' };
let filtroDRECentro = { periodo: '10/2026', filial: 'Matriz' };
let filtroResumoArea = { periodo: '10/2026', filial: 'Matriz' };
let filtroFluxoCaixa = { horizonte: '3meses', granularidade: 'semana', incluirEstimativas: false };
let filtroAnaliseCustos = { visao: 'fornecedor', periodo: '10/2026', tipo: 'todos' };
let filtroMargem = { visao: 'cliente', periodo: '10/2026' };
let filtroPosicaoCaixa = { filial: 'Matriz', dataReferencia: '2026-10-24' };

/* ============================================================
   ADIÇÕES PARA IMPORTAÇÃO DE XML
   ============================================================ */

// Estado do wizard de importação
let importacaoForm = null;

// Simulação de XMLs "encontrados" na pasta (mock)
// Cada item representa um XML com os metadados que o sistema extrairia
const xmlsSimulados = {
  entrada: [
    { arquivo: '2026_10_NFe_1234.xml', chave: '35261012345678901234550010000123451234567890', tipo: 'NF-e', numero: '1234', serie: '1', dataEmissao: '2026-10-15', contraparte: 'Fornecedor XYZ Ltda', valorTotal: 1322.50, status: 'aceito', motivo: null },
    { arquivo: '2026_10_NFe_5678.xml', chave: '35261012345678901234550010000567851234567891', tipo: 'NF-e', numero: '5678', serie: '1', dataEmissao: '2026-10-10', contraparte: 'Posto Shell', valorTotal: 500.00, status: 'aceito', motivo: null },
    { arquivo: '2026_10_NFe_9012.xml', chave: '35261012345678901234550010000901251234567892', tipo: 'NF-e', numero: '9012', serie: '1', dataEmissao: '2026-10-20', contraparte: 'Papelaria Central', valorTotal: 300.00, status: 'aceito_com_aviso', motivo: 'Data de emissão fora do período aberto (10/2026)' },
    { arquivo: '2026_10_NFe_3456.xml', chave: '35261012345678901234550010000345651234567893', tipo: 'NF-e', numero: '3456', serie: '1', dataEmissao: '2026-10-18', contraparte: 'Fornecedor ABC Ltda', valorTotal: 800.00, status: 'cancelado', motivo: 'NF-e cancelada' },
    { arquivo: '2026_10_NFe_7890.xml', chave: '35261012345678901234550010000789051234567894', tipo: 'NF-e', numero: '7890', serie: '1', dataEmissao: '2026-10-22', contraparte: 'Fornecedor Incompleto', valorTotal: 0, status: 'rejeitado', motivo: 'Dados faltantes críticos (valor total ausente)' },
    { arquivo: '2026_10_NFe_corrompido.xml', chave: null, tipo: 'NF-e', numero: null, serie: null, dataEmissao: null, contraparte: null, valorTotal: 0, status: 'rejeitado', motivo: 'XML corrompido ou ilegível' },
  ],
  saida: [
    { arquivo: '2026_10_NFe_9001.xml', chave: '35261012345678901234550010000900151234567895', tipo: 'NF-e', numero: '9001', serie: '1', dataEmissao: '2026-10-18', contraparte: 'Cliente ABC Ltda', valorTotal: 2500.00, status: 'aceito', motivo: null },
    { arquivo: '2026_10_NFe_9002.xml', chave: '35261012345678901234550010000900251234567896', tipo: 'NF-e', numero: '9002', serie: '1', dataEmissao: '2026-10-15', contraparte: 'João da Silva', valorTotal: 800.00, status: 'aceito', motivo: null },
    { arquivo: '2026_10_NFe_9003.xml', chave: '35261012345678901234550010000900351234567897', tipo: 'NF-e', numero: '9003', serie: '1', dataEmissao: '2026-10-05', contraparte: 'Empresa Delta', valorTotal: 2000.00, status: 'aceito', motivo: null },
    { arquivo: '2026_10_NFe_9004.xml', chave: null, tipo: 'NF-e', numero: '9004', serie: '1', dataEmissao: '2026-10-22', contraparte: 'Cliente Sem XML Completo', valorTotal: 500.00, status: 'aceito_com_aviso', motivo: 'Chave ausente no XML' },
    { arquivo: '2026_10_NFe_9005.xml', chave: '35261012345678901234550010000900551234567898', tipo: 'NF-e', numero: '9005', serie: '1', dataEmissao: '2026-10-12', contraparte: 'Cliente ABC Ltda', valorTotal: 2500.00, status: 'rejeitado', motivo: 'Chave duplicada (já importada)' },
  ],
};

// Filtros da importação
let filtroImportacao = { status: 'todos', busca: '' };

// Histórico de importações (log)
const historicoImportacoes = [
  { id: 1, data: '2026-10-23T09:00:00', tipo: 'NF-e', direcao: 'entrada', pasta: '2026/10', total: 6, aceitos: 2, aceitosComAviso: 1, cancelados: 1, rejeitados: 2, usuario: 'Bruno Lima' },
  { id: 2, data: '2026-10-20T14:30:00', tipo: 'NF-e', direcao: 'saida', pasta: '2026/10', total: 5, aceitos: 3, aceitosComAviso: 1, cancelados: 0, rejeitados: 1, usuario: 'Ana Souza' },
];

/* ============================================================
   ADIÇÕES PARA HANDOFF (2.8)
   ============================================================ */

let handoffData = {
  ativo: true,
  ultimaAlteracao: {
    data: '2026-10-15T10:30:00',
    usuario: 'Carlos Silva',
    acao: 'Ativado',
  },
  historico: [
    { data: '2026-10-15T10:30:00', usuario: 'Carlos Silva', acao: 'Ativado', observacao: 'Handoff ativado para a empresa' },
    { data: '2026-10-01T09:00:00', usuario: 'Carlos Silva', acao: 'Desativado', observacao: 'Desativado durante a implantação' },
  ],
};

/* ============================================================
   ADIÇÕES PARA TABELAS BASAIS DO COMPRADOR E FATURISTA (5.1 e 6.1)
   ============================================================ */

// Aba ativa das tabelas basais (Comprador)
let abaTabelaBasalCompras = 'categorias';   // categorias | tiposFornecedor | prazos

// Aba ativa das tabelas basais (Faturista)
let abaTabelaBasalVendas = 'tiposCliente';  // tiposCliente | prazos

// Filtros
let filtroTabelasCompras = { busca: '', ativo: 'todos' };
let filtroTabelasVendas = { busca: '', ativo: 'todos' };

// Categorias de fornecedor (Comprador) — alimentam o motor D1
const categoriasFornecedor = [
  { id: 1, descricao: 'Mercadoria para Revenda', ativo: true, usos: 15 },
  { id: 2, descricao: 'Insumos de Serviço', ativo: true, usos: 6 },
  { id: 3, descricao: 'Combustível', ativo: true, usos: 12 },
  { id: 4, descricao: 'Material de Escritório', ativo: true, usos: 4 },
  { id: 5, descricao: 'Despesas Administrativas', ativo: true, usos: 3 },
  { id: 6, descricao: 'Imobilizado', ativo: true, usos: 2 },
  { id: 7, descricao: 'Uso e Consumo', ativo: false, usos: 0 },
];

// Tipos de fornecedor (Comprador)
const tiposFornecedor = [
  { id: 1, descricao: 'Fabricante', ativo: true },
  { id: 2, descricao: 'Distribuidor', ativo: true },
  { id: 3, descricao: 'Atacadista', ativo: true },
  { id: 4, descricao: 'Varejista', ativo: true },
  { id: 5, descricao: 'Prestador de Serviço', ativo: true },
  { id: 6, descricao: 'Autônomo', ativo: true },
];

// Prazos padrão de pagamento (Comprador)
const prazosCompras = [
  { id: 1, descricao: 'À vista', dias: 0, ativo: true },
  { id: 2, descricao: '30 dias', dias: 30, ativo: true },
  { id: 3, descricao: '45 dias', dias: 45, ativo: true },
  { id: 4, descricao: '30/60 dias', dias: 30, parcelas: 2, ativo: true },
  { id: 5, descricao: '30/60/90 dias', dias: 30, parcelas: 3, ativo: true },
  { id: 6, descricao: '60 dias', dias: 60, ativo: false },
];

// Tipos de cliente (Faturista)
const tiposCliente = [
  { id: 1, descricao: 'Pessoa Física', ativo: true, usos: 8 },
  { id: 2, descricao: 'Pessoa Jurídica', ativo: true, usos: 12 },
  { id: 3, descricao: 'Consumidor Final', ativo: true, usos: 5 },
  { id: 4, descricao: 'Revendedor', ativo: true, usos: 3 },
  { id: 5, descricao: 'Órgão Público', ativo: false, usos: 0 },
];

// Prazos padrão de recebimento (Faturista)
const prazosVendas = [
  { id: 1, descricao: 'À vista', dias: 0, ativo: true },
  { id: 2, descricao: '30 dias', dias: 30, ativo: true },
  { id: 3, descricao: '15 dias', dias: 15, ativo: true },
  { id: 4, descricao: '30/60 dias', dias: 30, parcelas: 2, ativo: true },
  { id: 5, descricao: '30/60/90 dias', dias: 30, parcelas: 3, ativo: true },
  { id: 6, descricao: 'Entrada + 30 dias', dias: 30, parcelas: 2, ativo: true },
];

/* ============================================================
   ADIÇÕES PARA A TELA INICIAL (DASHBOARD)
   ============================================================ */

// Alertas por ator (mock)
const alertasTelaInicial = {
  configurador: [],
  administrador: [
    { tipo: 'warn', icone: '⚠️', texto: '2 lançamentos não classificados — o DRE pode estar incompleto', rota: 'revisao-lancamentos' },
    { tipo: 'warn', icone: '📅', texto: '1 conta vencida no período', rota: 'contas-pagar' },
  ],
  contador: [
    { tipo: 'err',  icone: '❌', texto: '2 lançamentos não classificados', rota: 'revisao-lancamentos' },
    { tipo: 'warn', icone: '⚖️', texto: '1 conflito de regras pendente', rota: 'revisao-lancamentos' },
    { tipo: 'err',  icone: '🔒', texto: '2 erros bloqueiam o fechamento 10/2026', rota: 'pendencias' },
  ],
  comprador: [
    { tipo: 'urg',  icone: '🔥', texto: '1 ordem urgente na caixa de entrada', rota: 'caixa-entrada' },
    { tipo: 'warn', icone: '⚠️', texto: '1 nota com dados faltantes (NCM)', rota: 'pendencias' },
  ],
  faturista: [
    { tipo: 'warn', icone: '⚠️', texto: '1 nota com aviso (chave ausente)', rota: 'pendencias' },
  ],
  financeiro1: [
    { tipo: 'err',  icone: '🔴', texto: '1 conta vencida: Papelaria Central (R$ 300,00)', rota: 'contas-pagar' },
    { tipo: 'warn', icone: '📅', texto: '1 conta a pagar hoje', rota: 'contas-pagar' },
  ],
  financeiro2: [
    { tipo: 'err',  icone: '🔴', texto: '1 cliente inadimplente: João da Silva (R$ 800,00)', rota: 'contas-receber' },
    { tipo: 'warn', icone: '📅', texto: '1 conta a receber hoje', rota: 'contas-receber' },
  ],
  gerente_financeiro: [
    { tipo: 'warn', icone: '🔒', texto: '2 saídas + 2 entradas pendentes de validação', rota: 'validar-saidas' },
  ],
  rh: [
    { tipo: 'warn', icone: '💼', texto: 'Folha 10/2026 calculada — aguardando consolidação', rota: 'folha' },
  ],
  auditor: [
    { tipo: 'warn', icone: '🔍', texto: 'Fechamento 10/2026 aguardando validação', rota: 'validar-fechamento' },
    { tipo: 'warn', icone: '🚩', texto: '1 apontamento pendente', rota: 'apontar' },
  ],
};

// KPIs por ator (mock)
const kpisTelaInicial = {
  configurador: [
    { label: 'Empresas', valor: '1', cor: 'info' },
    { label: 'Filiais', valor: '2', cor: 'info' },
    { label: 'Usuários ativos', valor: '3', cor: 'ok' },
    { label: 'Handoff', valor: 'Ativado', cor: 'ok', texto: true },
  ],
  administrador: [
    { label: 'Receita líquida', valor: 'R$ 102.500', cor: 'info' },
    { label: 'Lucro líquido', valor: 'R$ 12.835', cor: 'ok' },
    { label: 'Saldo de caixa', valor: 'R$ 22.500', cor: 'ok' },
    { label: 'Margem líquida', valor: '12,5%', cor: 'ok', texto: true },
  ],
  contador: [
    { label: 'Lançamentos pendentes', valor: '4', cor: 'aviso' },
    { label: 'Conflitos', valor: '1', cor: 'aviso' },
    { label: 'Pendências (Erro)', valor: '2', cor: 'erro' },
    { label: 'Fechamento', valor: 'Aguardando', cor: 'info', texto: true },
  ],
  comprador: [
    { label: 'Notas de entrada (mês)', valor: '8', cor: 'info' },
    { label: 'Pendentes de classificação', valor: '2', cor: 'aviso' },
    { label: 'Contas a pagar geradas', valor: 'R$ 1.300', cor: 'erro' },
    { label: 'Ordens pendentes', valor: '3', cor: 'aviso' },
  ],
  faturista: [
    { label: 'Notas de saída (mês)', valor: '5', cor: 'info' },
    { label: 'Pendentes de classificação', valor: '1', cor: 'aviso' },
    { label: 'Contas a receber geradas', valor: 'R$ 3.300', cor: 'ok' },
    { label: 'Ordens pendentes', valor: '2', cor: 'aviso' },
  ],
  financeiro1: [
    { label: 'Em aberto', valor: 'R$ 1.300', cor: 'erro' },
    { label: 'Vencidas', valor: 'R$ 300', cor: 'erro' },
    { label: 'Pagas no mês', valor: 'R$ 500', cor: 'ok' },
    { label: 'Contas abertas', valor: '3', cor: 'info' },
  ],
  financeiro2: [
    { label: 'Em aberto', valor: 'R$ 3.300', cor: 'ok' },
    { label: 'Inadimplência', valor: 'R$ 800', cor: 'erro' },
    { label: 'Recebido no mês', valor: 'R$ 2.000', cor: 'ok' },
    { label: 'Contas abertas', valor: '3', cor: 'info' },
  ],
  gerente_financeiro: [
    { label: 'Saídas pendentes', valor: 'R$ 806', cor: 'aviso' },
    { label: 'Entradas pendentes', valor: 'R$ 2.818', cor: 'aviso' },
    { label: 'Confirmadas hoje', valor: '0', cor: 'info' },
    { label: 'Rejeitadas', valor: '0', cor: 'erro' },
  ],
  rh: [
    { label: 'Funcionários ativos', valor: '2', cor: 'info' },
    { label: 'Folha do mês', valor: 'R$ 8.700', cor: 'aviso' },
    { label: 'Encargos', valor: 'R$ 2.952', cor: 'erro' },
    { label: 'Provisões', valor: 'R$ 1.149', cor: 'aviso' },
  ],
  auditor: [
    { label: 'Eventos hoje', valor: '8', cor: 'info' },
    { label: 'Apontamentos abertos', valor: '1', cor: 'aviso' },
    { label: 'Solicitações abertas', valor: '1', cor: 'aviso' },
    { label: 'Fechamento', valor: 'Aguardando', cor: 'info', texto: true },
  ],
};

// Ações rápidas por ator (mock)
const acoesTelaInicial = {
  configurador: [
    { icone: '🏢', label: 'Cadastrar empresa', rota: 'empresa' },
    { icone: '🏬', label: 'Cadastrar filial', rota: 'filial' },
    { icone: '👥', label: 'Gerenciar usuários', rota: 'usuarios' },
    { icone: '🔄', label: 'Handoff', rota: 'handoff' },
  ],
  administrador: [
    { icone: '📊', label: 'Ver DRE', rota: 'dre' },
    { icone: '💰', label: 'Posição de caixa', rota: 'posicao-caixa' },
    { icone: '📈', label: 'Fluxo de caixa', rota: 'fluxo-caixa' },
    { icone: '⬇️', label: 'Exportar relatório', rota: 'dre' },
  ],
  contador: [
    { icone: '🔍', label: 'Revisar lançamentos', rota: 'revisao-lancamentos' },
    { icone: '✔️', label: 'Validar cálculos', rota: 'validacao' },
    { icone: '⚠️', label: 'Ver pendências', rota: 'pendencias' },
    { icone: '📦', label: 'Preparar fechamento', rota: 'preparar-fechamento' },
  ],
  comprador: [
    { icone: '📥', label: 'Importar XML', rota: 'importar-xml' },
    { icone: '⌨️', label: 'Digitar nota', rota: 'nota-entrada' },
    { icone: '🔍', label: 'Revisar classificações', rota: 'revisao-classificacoes' },
    { icone: '🏭', label: 'Cadastrar fornecedor', rota: 'fornecedores' },
  ],
  faturista: [
    { icone: '📥', label: 'Importar XML', rota: 'importar-xml' },
    { icone: '⌨️', label: 'Digitar nota', rota: 'nota-saida' },
    { icone: '🔍', label: 'Revisar classificações', rota: 'revisao-classificacoes' },
    { icone: '🧑‍💼', label: 'Cadastrar cliente', rota: 'clientes' },
  ],
  financeiro1: [
    { icone: '💳', label: 'Pagar conta', rota: 'contas-pagar' },
    { icone: '📄', label: 'Contas a pagar', rota: 'contas-pagar' },
    { icone: '💰', label: 'Posição de caixa', rota: 'posicao-caixa' },
    { icone: '📋', label: 'Tabelas basais', rota: 'tabelas-basais-fin1' },
  ],
  financeiro2: [
    { icone: '💵', label: 'Receber conta', rota: 'contas-receber' },
    { icone: '📄', label: 'Contas a receber', rota: 'contas-receber' },
    { icone: '🚨', label: 'Inadimplência', rota: 'contas-receber' },
    { icone: '📋', label: 'Tabelas basais', rota: 'tabelas-basais-fin2' },
  ],
  gerente_financeiro: [
    { icone: '🔒', label: 'Validar saídas', rota: 'validar-saidas' },
    { icone: '🔓', label: 'Validar entradas', rota: 'validar-entradas' },
    { icone: '💰', label: 'Posição de caixa', rota: 'posicao-caixa' },
  ],
  rh: [
    { icone: '📥', label: 'Importar folha', rota: 'folha' },
    { icone: '⌨️', label: 'Digitar folha', rota: 'folha' },
    { icone: '✅', label: 'Consolidar folha', rota: 'folha' },
    { icone: '👷', label: 'Cadastrar funcionário', rota: 'funcionarios' },
  ],
  auditor: [
    { icone: '📜', label: 'Consultar auditoria', rota: 'auditoria' },
    { icone: '🚩', label: 'Apontar problema', rota: 'apontar' },
    { icone: '✉️', label: 'Solicitar correção', rota: 'solicitar' },
    { icone: '✔️', label: 'Validar fechamento', rota: 'validar-fechamento' },
  ],
};

// Resumo por ator (mock — conteúdo livre por ator)
const resumoTelaInicial = {
  configurador: {
    tipo: 'lista',
    titulo: 'Últimas alterações',
    itens: [
      { texto: 'Usuário "Bruno Lima" cadastrado', data: '2026-10-23' },
      { texto: 'Filial "Campinas" criada', data: '2026-10-20' },
      { texto: 'Handoff ativado para a empresa', data: '2026-10-15' },
    ],
  },
  administrador: {
    tipo: 'mini-dre',
    titulo: 'Resumo do DRE — 10/2026',
    linhas: [
      { label: 'Receita líquida', valor: 'R$ 102.500', cor: 'info' },
      { label: 'Lucro bruto', valor: 'R$ 37.500', cor: 'ok' },
      { label: 'Lucro operacional', valor: 'R$ 15.500', cor: 'ok' },
      { label: 'Lucro líquido', valor: 'R$ 12.835', cor: 'ok', destaque: true },
    ],
  },
  contador: {
    tipo: 'timeline',
    titulo: 'Próximos passos do fechamento',
    itens: [
      { titulo: 'Resolver 2 erros de classificação', status: 'pendente' },
      { titulo: 'Validar cálculos (E1–E5)', status: 'pendente' },
      { titulo: 'Enviar consolidação ao Auditor', status: 'pendente' },
      { titulo: 'Aguardar validação do Auditor', status: 'futuro' },
      { titulo: 'Fechar período 10/2026', status: 'futuro' },
    ],
  },
  comprador: {
    tipo: 'tabela',
    titulo: 'Últimas notas importadas',
    colunas: ['Nº', 'Fornecedor', 'Data', 'Valor'],
    linhas: [
      ['1234', 'Fornecedor XYZ', '15/10', 'R$ 1.322,50'],
      ['5678', 'Posto Shell', '10/10', 'R$ 500,00'],
      ['9012', 'Papelaria Central', '20/10', 'R$ 300,00'],
    ],
  },
  faturista: {
    tipo: 'tabela',
    titulo: 'Últimas notas emitidas',
    colunas: ['Nº', 'Cliente', 'Data', 'Valor'],
    linhas: [
      ['9001', 'Cliente ABC', '18/10', 'R$ 2.500,00'],
      ['9002', 'João da Silva', '15/10', 'R$ 800,00'],
      ['9003', 'Empresa Delta', '05/10', 'R$ 2.000,00'],
    ],
  },
  financeiro1: {
    tipo: 'tabela',
    titulo: 'Próximos vencimentos (7 dias)',
    colunas: ['Fornecedor', 'Vencimento', 'Valor'],
    linhas: [
      ['Papelaria Central', '20/10 (vencida)', 'R$ 300,00'],
      ['Distribuidora XYZ', '05/11', 'R$ 2.500,00'],
    ],
  },
  financeiro2: {
    tipo: 'tabela',
    titulo: 'Próximos vencimentos + inadimplência',
    colunas: ['Cliente', 'Vencimento', 'Valor', 'Status'],
    linhas: [
      ['João da Silva', '15/10 (vencida)', 'R$ 800,00', 'Inadimplente'],
      ['Cliente ABC', '18/11', 'R$ 1.250,00', 'A receber'],
    ],
  },
  gerente_financeiro: {
    tipo: 'lista',
    titulo: 'Últimas movimentações validadas',
    itens: [
      { texto: 'Saída: Posto Shell — R$ 500,00 (PIX)', data: '10/10' },
      { texto: 'Entrada: Empresa Delta — R$ 2.000,00 (Transferência)', data: '05/10' },
    ],
  },
  rh: {
    tipo: 'tabela',
    titulo: 'Folha 10/2026 (resumo)',
    colunas: ['Funcionário', 'Bruto', 'Líquido'],
    linhas: [
      ['João Silva', 'R$ 3.500,00', 'R$ 3.097,30'],
      ['Maria Souza', 'R$ 5.200,00', 'R$ 4.346,47'],
    ],
  },
  auditor: {
    tipo: 'lista',
    titulo: 'Últimos eventos',
    itens: [
      { texto: 'Override de ICMS na NF-e 1234 (Bruno Lima)', data: '24/10 13:45' },
      { texto: 'Fechamento 09/2026 concluído (Ana Souza)', data: '24/10 11:00' },
      { texto: 'Reclassificação do lançamento #102 (Carlos Silva)', data: '24/10 10:30' },
    ],
  },
};

// G8 — Balanço Patrimonial
const BALANCO_SIMULADO = {
  dataCorte: '2026-10-31',
  ativo: {
    circulante: [
      { conta: '1.1.1', descricao: 'Caixa', valor: 8500.00 },
      { conta: '1.1.2', descricao: 'Bancos', valor: 22500.00 },
      { conta: '1.1.3', descricao: 'Contas a Receber', valor: 3300.00 },
      { conta: '1.1.4', descricao: 'Estoques', valor: 12000.00 },
      { conta: '1.1.5', descricao: 'Impostos a Recuperar', valor: 4800.00 }
    ],
    naoCirculante: [
      { conta: '1.2.1', descricao: 'Imobilizado', valor: 85000.00 },
      { conta: '1.2.2', descricao: '(-) Depreciação Acumulada', valor: -15000.00 },
      { conta: '1.2.3', descricao: 'Intangível', valor: 5000.00 }
    ]
  },
  passivo: {
    circulante: [
      { conta: '2.1.1', descricao: 'Fornecedores', valor: 1500.00 },
      { conta: '2.1.2', descricao: 'Contas a Pagar', valor: 1300.00 },
      { conta: '2.1.3', descricao: 'Salários a Pagar', valor: 8700.00 },
      { conta: '2.1.4', descricao: 'Encargos a Recolher', valor: 2952.00 },
      { conta: '2.1.5', descricao: 'Impostos a Recolher', valor: 2200.00 }
    ],
    naoCirculante: [
      { conta: '2.2.1', descricao: 'Empréstimos LP', valor: 20000.00 }
    ]
  },
  patrimonioLiquido: [
    { conta: '2.3.1', descricao: 'Capital Social', valor: 50000.00 },
    { conta: '2.3.2', descricao: 'Lucros/Prejuízos Acumulados', valor: 35948.00 },
    { conta: '2.3.3', descricao: 'Resultado do Exercício', valor: 15000.00 }
  ]
};

// G9 — Painel Executivo
const PAINEL_EXECUTIVO_SIMULADO = {
  periodo: '10/2026',
  kpis: [
    // Bloco 1 — Resultado
    { bloco: 'Resultado', nome: 'Receita Líquida', valor: 102500.00, formato: 'moeda', variacao: +8.5, semaforo: 'verde', rota: 'dre-gerencial' },
    { bloco: 'Resultado', nome: 'Lucro Líquido', valor: 15000.00, formato: 'moeda', variacao: +12.0, semaforo: 'verde', rota: 'dre-gerencial' },
    { bloco: 'Resultado', nome: 'Margem Líquida', valor: 14.6, formato: 'percentual', variacao: +1.2, semaforo: 'verde', rota: 'dre-gerencial' },
    { bloco: 'Resultado', nome: 'Margem Bruta', valor: 38.2, formato: 'percentual', variacao: +0.8, semaforo: 'verde', rota: 'dre-gerencial' },

    // Bloco 2 — Liquidez
    { bloco: 'Liquidez', nome: 'Saldo de Caixa', valor: 31000.00, formato: 'moeda', variacao: -3.2, semaforo: 'amarelo', rota: 'posicao-caixa' },
    { bloco: 'Liquidez', nome: 'Liquidez Corrente', valor: 1.85, formato: 'indice', variacao: +0.10, semaforo: 'verde', rota: 'balanco' },
    { bloco: 'Liquidez', nome: 'Capital de Giro Líquido', valor: 25148.00, formato: 'moeda', variacao: +5.0, semaforo: 'verde', rota: 'balanco' },
    { bloco: 'Liquidez', nome: 'Ciclo de Caixa', valor: 32, formato: 'dias', variacao: -4, semaforo: 'verde', rota: 'aging-contas' },

    // Bloco 3 — Endividamento
    { bloco: 'Endividamento', nome: 'Endividamento Geral', valor: 32.5, formato: 'percentual', variacao: -1.5, semaforo: 'verde', rota: 'balanco' },
    { bloco: 'Endividamento', nome: 'Composição do Endividamento', valor: 44.3, formato: 'percentual', variacao: +2.1, semaforo: 'amarelo', rota: 'balanco' },
    { bloco: 'Endividamento', nome: 'Grau de Alavancagem', valor: 0.48, formato: 'indice', variacao: -0.03, semaforo: 'verde', rota: 'balanco' },

    // Bloco 4 — Rentabilidade e Eficiência
    { bloco: 'Rentabilidade', nome: 'ROE', valor: 16.5, formato: 'percentual', variacao: +1.8, semaforo: 'verde', rota: 'balanco' },
    { bloco: 'Rentabilidade', nome: 'ROA', valor: 11.1, formato: 'percentual', variacao: +1.2, semaforo: 'verde', rota: 'balanco' },
    { bloco: 'Rentabilidade', nome: 'Ponto de Equilíbrio', valor: 85000.00, formato: 'moeda', variacao: +2.0, semaforo: 'amarelo', rota: 'ponto-equilibrio' },
    { bloco: 'Rentabilidade', nome: 'Margem de Segurança', valor: 17.1, formato: 'percentual', variacao: -0.5, semaforo: 'amarelo', rota: 'ponto-equilibrio' }
  ],
  alertas: [
    { severidade: 'amarelo', texto: 'Inadimplência em 8,2% (limite: 10%)', rota: 'aging-contas' },
    { severidade: 'verde', texto: 'Caixa projetado positivo nos próximos 30 dias', rota: 'fluxo-caixa' }
  ]
};

// G10 — Aging de Contas
const AGING_SIMULADO = {
  periodo: '10/2026',
  aReceber: {
    total: 3300.00,
    faixas: [
      { faixa: 'A vencer', valor: 2000.00, qtd: 2 },
      { faixa: '1–30 dias', valor: 500.00, qtd: 1 },
      { faixa: '31–60 dias', valor: 300.00, qtd: 1 },
      { faixa: '61–90 dias', valor: 200.00, qtd: 1 },
      { faixa: '> 90 dias', valor: 300.00, qtd: 1 }
    ],
    indicadores: {
      inadimplencia: 39.4,
      pmr: 38,
      concentracaoTop5: 78.5
    }
  },
  aPagar: {
    total: 2800.00,
    faixas: [
      { faixa: 'A vencer (30d)', valor: 1500.00, qtd: 2 },
      { faixa: 'Vencidas 1–30d', valor: 800.00, qtd: 1 },
      { faixa: 'Vencidas 31–60d', valor: 300.00, qtd: 1 },
      { faixa: 'Vencidas > 60d', valor: 200.00, qtd: 1 }
    ],
    indicadores: {
      pmp: 28,
      concentracaoTop5: 65.0
    }
  }
};

// G11 — Posição de Impostos
const POSICAO_IMPOSTOS_SIMULADO = {
  periodo: '10/2026',
  impostos: [
    { tipo: 'ICMS', debitos: 8500.00, creditos: 6200.00, saldo: 2300.00 },
    { tipo: 'PIS', debitos: 1680.00, creditos: 1200.00, saldo: 480.00 },
    { tipo: 'COFINS', debitos: 7700.00, creditos: 5500.00, saldo: 2200.00 },
    { tipo: 'ISS', debitos: 1200.00, creditos: 0.00, saldo: 1200.00 },
    { tipo: 'INSS', debitos: 2952.00, creditos: 0.00, saldo: 2952.00 },
    { tipo: 'FGTS', debitos: 1180.00, creditos: 0.00, saldo: 1180.00 },
    { tipo: 'IRRF', debitos: 450.00, creditos: 0.00, saldo: 450.00 }
  ],
  indicadores: {
    cargaTributaria: 18.5,
    saldoDevedorTotal: 10762.00,
    saldoCredorTotal: 0.00
  },
  evolucaoMensal: [
    { mes: '07/2026', saldo: 9800.00 },
    { mes: '08/2026', saldo: 10200.00 },
    { mes: '09/2026', saldo: 10500.00 },
    { mes: '10/2026', saldo: 10762.00 }
  ]
};

// G12 — Posição de Pessoal
const POSICAO_PESSOAL_SIMULADO = {
  periodo: '10/2026',
  custoTotal: 8700.00,
  pesoReceita: 8.5,
  provisoesAcumuladas: 1149.00,
  headcount: 2,
  custoMedio: 4350.00,
  porArea: [
    { area: 'Comercial', valor: 5500.00 },
    { area: 'Administrativo', valor: 3200.00 }
  ],
  evolucaoMensal: [
    { mes: '07/2026', custo: 8200.00, headcount: 2 },
    { mes: '08/2026', custo: 8400.00, headcount: 2 },
    { mes: '09/2026', custo: 8600.00, headcount: 2 },
    { mes: '10/2026', custo: 8700.00, headcount: 2 }
  ]
};

// G13 — Posição de Ativos
const POSICAO_ATIVOS_SIMULADO = {
  periodo: '10/2026',
  ativos: [
    { descricao: 'Computador Dell', valorOriginal: 5000.00, depreciacaoAcumulada: 750.00, valorContabilLiquido: 4250.00, depreciacaoPeriodo: 75.00, vidaUtilRestante: 57, status: 'Em uso', centroCusto: 'Administrativo' },
    { descricao: 'Veículo Utilitário', valorOriginal: 80000.00, depreciacaoAcumulada: 14250.00, valorContabilLiquido: 65750.00, depreciacaoPeriodo: 1000.00, vidaUtilRestante: 66, status: 'Em uso', centroCusto: 'Comercial' }
  ],
  indicadores: {
    totalImobilizado: 70000.00,
    depreciacaoAcumuladaTotal: 15000.00,
    depreciacaoPeriodoTotal: 1075.00,
    projecao12Meses: 12900.00
  }
};

// G14 — Ponto de Equilíbrio
const PONTO_EQUILIBRIO_SIMULADO = {
  periodo: '10/2026',
  receita: 102500.00,
  custosFixos: 38000.00,
  custosVariaveis: 63500.00,
  margemContribuicao: 39000.00,
  margemContribuicaoPct: 38.05,
  pontoEquilibrioContabil: 99868.00,
  pontoEquilibrioFinanceiro: 97043.00,
  margemSeguranca: 2.57
};

// G15 — Resumo Executivo
const RESUMO_EXECUTIVO_SIMULADO = {
  periodo: '10/2026',
  destaques: [
    { icone: '📈', texto: 'Receita líquida cresceu 8,5% vs. mês anterior', variacao: +8.5 },
    { icone: '💰', texto: 'Lucro líquido cresceu 12,0% vs. mês anterior', variacao: +12.0 },
    { icone: '📊', texto: 'Margem líquida em 14,6% (meta: 12,0%)', variacao: +2.6 }
  ],
  riscos: [
    { severidade: 'alto', texto: 'Inadimplência em 39,4% do a receber (> 90 dias: R$ 300,00)' },
    { severidade: 'medio', texto: 'Custo de pessoal em 8,5% da receita (limite: 10%)' },
    { severidade: 'baixo', texto: 'Composição do endividamento em 44,3% de curto prazo' }
  ],
  oportunidades: [
    { texto: 'Margem de "Desenvolvimento de software" subiu 3,2 p.p.' },
    { texto: 'Fornecedor "ABC Ltda" reduziu custo em 5,0% no mês' },
    { texto: 'Cliente "XYZ Ltda" tem margem de 42,0% (top 3)' }
  ],
  acoesSugeridas: [
    { texto: 'Renegociar prazo com fornecedor "ABC Ltda" (PMP atual: 28 dias)' },
    { texto: 'Antecipar recebíveis de "Cliente XYZ" (R$ 950,00 vencendo em 30 dias)' },
    { texto: 'Revisar política de crédito para reduzir inadimplência' }
  ]
};

/* ============================================================
   ADIÇÕES PARA O CONSELHEIRO (3.18)
   ============================================================ */

// Sugestões do Conselheiro (mock — viriam do motor de heurísticas)
const sugestoesConselheiro = [
  // ----- ALTA PRIORIDADE -----
  {
    id: 'R1',
    area: 'Rentabilidade',
    icone: '💹',
    titulo: 'Revisar preço do cliente João da Silva',
    descricao: 'O cliente João da Silva tem margem de contribuição de 8% nos últimos 3 meses, abaixo da meta de 20%. Se ajustar o preço em 15%, a margem sobe para ~21%.',
    fundamento: {
      metrica: 'Margem de contribuição',
      valorAtual: '8,00%',
      valorReferencia: '20,00%',
      periodo: '08/2026 a 10/2026',
      comparacao: 'meta 20%',
    },
    impacto: 'Alto',
    impactoEstimado: '+R$ 12.000/ano',
    esforco: 'Médio',
    prioridade: 'Alta',
    confianca: 'Alta',
    rota: 'margem',
    fonte: 'Margem por cliente — 08/2026 a 10/2026',
    acaoSugerida: 'Renegociar preço com o cliente ou revisar o custo de atendimento.',
    lida: false,
    dataGeracao: '2026-10-26T15:30:00',
  },
  {
    id: 'K1',
    area: 'Caixa',
    icone: '💧',
    titulo: 'Saldo negativo projetado em 10/11/2026',
    descricao: 'A projeção de caixa indica saldo negativo de R$ 3.500 em 10/11/2026. Considere antecipar recebimentos ou postergar pagamentos.',
    fundamento: {
      metrica: 'Saldo projetado',
      valorAtual: '-R$ 3.500',
      valorReferencia: 'R$ 20.500 (hoje)',
      periodo: 'Próximos 30 dias',
      comparacao: 'saldo atual',
    },
    impacto: 'Alto',
    impactoEstimado: 'R$ 3.500 de caixa',
    esforco: 'Médio',
    prioridade: 'Alta',
    confianca: 'Alta',
    rota: 'fluxo-caixa',
    fonte: 'Fluxo de caixa projetado — 10/2026',
    acaoSugerida: 'Antecipar recebíveis ou renegociar prazos de pagamento.',
    lida: false,
    dataGeracao: '2026-10-26T15:30:00',
  },
  {
    id: 'C1',
    area: 'Custos',
    icone: '🏭',
    titulo: 'Concentração de fornecedor (45% dos custos)',
    descricao: 'O Fornecedor XYZ representa 45% do custo total. Considere diversificar a base de fornecedores para reduzir o risco.',
    fundamento: {
      metrica: 'Participação no custo',
      valorAtual: '45%',
      valorReferencia: '40% (limite)',
      periodo: '10/2026',
      comparacao: 'limite de concentração',
    },
    impacto: 'Alto',
    impactoEstimado: 'Risco de dependência',
    esforco: 'Alto',
    prioridade: 'Alta',
    confianca: 'Alta',
    rota: 'analise-custos',
    fonte: 'Análise de custos — 10/2026',
    acaoSugerida: 'Buscar fornecedores alternativos para a mesma categoria.',
    lida: false,
    dataGeracao: '2026-10-26T15:30:00',
  },
  {
    id: 'X5',
    area: 'Risco',
    icone: '📉',
    titulo: 'Receita caiu 18% vs. mês anterior',
    descricao: 'A receita caiu de R$ 125.000 (09/2026) para R$ 102.500 (10/2026). Considere investigar as causas da queda.',
    fundamento: {
      metrica: 'Receita bruta',
      valorAtual: 'R$ 102.500',
      valorReferencia: 'R$ 125.000',
      periodo: '10/2026 vs. 09/2026',
      comparacao: 'variação -18%',
    },
    impacto: 'Alto',
    impactoEstimado: '-R$ 22.500 de receita',
    esforco: 'Médio',
    prioridade: 'Alta',
    confianca: 'Alta',
    rota: 'dre',
    fonte: 'DRE Gerencial — 10/2026 vs. 09/2026',
    acaoSugerida: 'Investigar as causas da queda (sazonalidade, perda de cliente, etc.).',
    lida: false,
    dataGeracao: '2026-10-26T15:30:00',
  },
  {
    id: 'R7',
    area: 'Rentabilidade',
    icone: '🔻',
    titulo: 'Produto com margem negativa (Papel A4)',
    descricao: 'O produto "Papel A4 500 folhas" tem margem de contribuição negativa de -5%. Considere descontinuar ou reajustar o preço.',
    fundamento: {
      metrica: 'Margem de contribuição',
      valorAtual: '-5,00%',
      valorReferencia: '>= 0%',
      periodo: '10/2026',
      comparacao: 'prejuízo',
    },
    impacto: 'Alto',
    impactoEstimado: 'R$ 2.500/mês de prejuízo',
    esforco: 'Baixo',
    prioridade: 'Alta',
    confianca: 'Alta',
    rota: 'margem',
    fonte: 'Margem por produto — 10/2026',
    acaoSugerida: 'Reajustar o preço ou descontinuar o produto.',
    lida: false,
    dataGeracao: '2026-10-26T15:30:00',
  },
  {
    id: 'K2',
    area: 'Caixa',
    icone: '🚨',
    titulo: 'Inadimplência de 8% do contas a receber',
    descricao: 'A inadimplência está em 8% (R$ 800 em R$ 10.000). Considere intensificar a cobrança ou revisar o crédito.',
    fundamento: {
      metrica: 'Inadimplência',
      valorAtual: '8,00%',
      valorReferencia: '5,00% (limite)',
      periodo: '10/2026',
      comparacao: 'acima do limite',
    },
    impacto: 'Alto',
    impactoEstimado: 'R$ 800 em risco',
    esforco: 'Médio',
    prioridade: 'Alta',
    confianca: 'Alta',
    rota: 'contas-receber',
    fonte: 'Contas a Receber — 10/2026',
    acaoSugerida: 'Intensificar a cobrança dos clientes inadimplentes.',
    lida: false,
    dataGeracao: '2026-10-26T15:30:00',
  },
  {
    id: 'X6',
    area: 'Risco',
    icone: '⚖️',
    titulo: 'Margem líquida abaixo de 5%',
    descricao: 'A margem líquida da empresa está em 4,2%, abaixo do limite de 5%. Considere revisar custos e despesas.',
    fundamento: {
      metrica: 'Margem líquida',
      valorAtual: '4,20%',
      valorReferencia: '5,00% (limite)',
      periodo: '10/2026',
      comparacao: 'abaixo do limite',
    },
    impacto: 'Alto',
    impactoEstimado: 'Risco de prejuízo',
    esforco: 'Médio',
    prioridade: 'Alta',
    confianca: 'Alta',
    rota: 'dre',
    fonte: 'DRE Gerencial — 10/2026',
    acaoSugerida: 'Revisar custos e despesas para recuperar a margem.',
    lida: false,
    dataGeracao: '2026-10-26T15:30:00',
  },
  {
    id: 'E1',
    area: 'Eficiência',
    icone: '📊',
    titulo: 'Despesas fixas cresceram 12% sem crescimento de receita',
    descricao: 'As despesas fixas cresceram 12% vs. mês anterior, mas a receita caiu 18%. Considere revisar as despesas fixas.',
    fundamento: {
      metrica: 'Despesas fixas',
      valorAtual: 'R$ 15.000',
      valorReferencia: 'R$ 13.400',
      periodo: '10/2026 vs. 09/2026',
      comparacao: 'crescimento +12%',
    },
    impacto: 'Alto',
    impactoEstimado: 'R$ 1.600/mês',
    esforco: 'Médio',
    prioridade: 'Alta',
    confianca: 'Alta',
    rota: 'dre',
    fonte: 'DRE Gerencial — 10/2026 vs. 09/2026',
    acaoSugerida: 'Revisar contratos e despesas fixas recorrentes.',
    lida: false,
    dataGeracao: '2026-10-26T15:30:00',
  },

  // ----- MÉDIA PRIORIDADE -----
  {
    id: 'R2',
    area: 'Rentabilidade',
    icone: '💹',
    titulo: 'Produto com margem abaixo de 10% (Caneta azul)',
    descricao: 'O produto "Caneta esferográfica azul" tem margem de 8,5%. Considere reajustar o preço ou renegociar o custo.',
    fundamento: {
      metrica: 'Margem de contribuição',
      valorAtual: '8,50%',
      valorReferencia: '10,00% (limite)',
      periodo: '10/2026',
      comparacao: 'abaixo do limite',
    },
    impacto: 'Médio',
    impactoEstimado: '+R$ 1.200/ano',
    esforco: 'Baixo',
    prioridade: 'Média',
    confianca: 'Alta',
    rota: 'margem',
    fonte: 'Margem por produto — 10/2026',
    acaoSugerida: 'Reajustar o preço em 2% ou renegociar o custo.',
    lida: false,
    dataGeracao: '2026-10-26T15:30:00',
  },
  {
    id: 'C2',
    area: 'Custos',
    icone: '⛽',
    titulo: 'Custo com combustível subiu 18%',
    descricao: 'O custo com combustível subiu de R$ 4.200 para R$ 5.000 (18%). Considere renegociar ou buscar alternativas.',
    fundamento: {
      metrica: 'Custo com combustível',
      valorAtual: 'R$ 5.000',
      valorReferencia: 'R$ 4.200',
      periodo: '10/2026 vs. 09/2026',
      comparacao: 'variação +18%',
    },
    impacto: 'Médio',
    impactoEstimado: 'R$ 800/mês',
    esforco: 'Médio',
    prioridade: 'Média',
    confianca: 'Alta',
    rota: 'analise-custos',
    fonte: 'Análise de custos — 10/2026 vs. 09/2026',
    acaoSugerida: 'Renegociar com o fornecedor ou buscar alternativas.',
    lida: false,
    dataGeracao: '2026-10-26T15:30:00',
  },
  {
    id: 'K3',
    area: 'Caixa',
    icone: '📅',
    titulo: 'Concentração de vencimentos em uma única semana',
    descricao: '70% dos pagamentos vencem na mesma semana (R$ 9.000). Considere renegociar prazos.',
    fundamento: {
      metrica: 'Concentração de vencimentos',
      valorAtual: '70%',
      valorReferencia: '30% (limite)',
      periodo: 'Próximos 30 dias',
      comparacao: 'acima do limite',
    },
    impacto: 'Médio',
    impactoEstimado: 'R$ 9.000 concentrados',
    esforco: 'Baixo',
    prioridade: 'Média',
    confianca: 'Alta',
    rota: 'contas-pagar',
    fonte: 'Contas a Pagar — próximos 30 dias',
    acaoSugerida: 'Renegociar prazos para distribuir os vencimentos.',
    lida: false,
    dataGeracao: '2026-10-26T15:30:00',
  },
  {
    id: 'R3',
    area: 'Rentabilidade',
    icone: '👤',
    titulo: 'Cliente representa 35% da receita',
    descricao: 'O cliente Comércio ABC representa 35% da receita. Considere diversificar a carteira.',
    fundamento: {
      metrica: 'Participação na receita',
      valorAtual: '35%',
      valorReferencia: '30% (limite)',
      periodo: '10/2026',
      comparacao: 'acima do limite',
    },
    impacto: 'Alto',
    impactoEstimado: 'Risco de dependência',
    esforco: 'Alto',
    prioridade: 'Média',
    confianca: 'Alta',
    rota: 'margem',
    fonte: 'Margem por cliente — 10/2026',
    acaoSugerida: 'Buscar novos clientes para reduzir a concentração.',
    lida: false,
    dataGeracao: '2026-10-26T15:30:00',
  },
  {
    id: 'I1',
    area: 'Impostos',
    icone: '🏛️',
    titulo: 'Peso dos impostos na receita acima de 20%',
    descricao: 'Os impostos representam 22% da receita. Considere revisar o regime fiscal ou benefícios.',
    fundamento: {
      metrica: 'Peso dos impostos',
      valorAtual: '22%',
      valorReferencia: '20% (limite)',
      periodo: '10/2026',
      comparacao: 'acima do limite',
    },
    impacto: 'Alto',
    impactoEstimado: 'R$ 2.500/mês',
    esforco: 'Alto',
    prioridade: 'Média',
    confianca: 'Média',
    rota: 'posicao-impostos',
    fonte: 'Posição de Impostos — 10/2026',
    acaoSugerida: 'Consultar o Contador sobre regime fiscal e benefícios.',
    lida: false,
    dataGeracao: '2026-10-26T15:30:00',
  },
  {
    id: 'E5',
    area: 'Eficiência',
    icone: '⏰',
    titulo: 'Horas extras representam 12% da folha',
    descricao: 'As horas extras representam 12% da folha (R$ 1.044 em R$ 8.700). Considere revisar a alocação de pessoal.',
    fundamento: {
      metrica: 'Horas extras',
      valorAtual: '12,00%',
      valorReferencia: '10,00% (limite)',
      periodo: '10/2026',
      comparacao: 'acima do limite',
    },
    impacto: 'Médio',
    impactoEstimado: 'R$ 1.044/mês',
    esforco: 'Médio',
    prioridade: 'Média',
    confianca: 'Alta',
    rota: 'folha',
    fonte: 'Folha de Pagamento — 10/2026',
    acaoSugerida: 'Revisar a alocação de pessoal ou contratar mais um funcionário.',
    lida: false,
    dataGeracao: '2026-10-26T15:30:00',
  },
  {
    id: 'X8',
    area: 'Risco',
    icone: '💸',
    titulo: 'Contas a pagar > contas a receber',
    descricao: 'As contas a pagar (R$ 12.000) superam as contas a receber (R$ 10.000) em R$ 2.000. Considere antecipar recebimentos.',
    fundamento: {
      metrica: 'Saldo de contas',
      valorAtual: 'R$ 12.000 a pagar',
      valorReferencia: 'R$ 10.000 a receber',
      periodo: '10/2026',
      comparacao: 'saldo negativo',
    },
    impacto: 'Alto',
    impactoEstimado: '-R$ 2.000 de caixa',
    esforco: 'Médio',
    prioridade: 'Média',
    confianca: 'Alta',
    rota: 'fluxo-caixa',
    fonte: 'Contas a Pagar/Receber — 10/2026',
    acaoSugerida: 'Antecipar recebimentos ou postergar pagamentos.',
    lida: false,
    dataGeracao: '2026-10-26T15:30:00',
  },
  {
    id: 'C6',
    area: 'Custos',
    icone: '📈',
    titulo: 'Custos cresceram 10% sem crescimento de receita',
    descricao: 'Os custos cresceram 10% vs. mês anterior, mas a receita caiu 18%. Considere revisar os custos.',
    fundamento: {
      metrica: 'Custo total',
      valorAtual: 'R$ 65.000',
      valorReferencia: 'R$ 59.000',
      periodo: '10/2026 vs. 09/2026',
      comparacao: 'crescimento +10%',
    },
    impacto: 'Alto',
    impactoEstimado: 'R$ 6.000/mês',
    esforco: 'Médio',
    prioridade: 'Média',
    confianca: 'Alta',
    rota: 'analise-custos',
    fonte: 'Análise de custos — 10/2026 vs. 09/2026',
    acaoSugerida: 'Revisar os principais custos (fornecedores, combustível, etc.).',
    lida: false,
    dataGeracao: '2026-10-26T15:30:00',
  },
  {
    id: 'K5',
    area: 'Caixa',
    icone: '🏦',
    titulo: 'Saldo de caixa cobre 0,8 mês de despesas fixas',
    descricao: 'O saldo de caixa (R$ 20.500) cobre apenas 0,8 mês de despesas fixas (R$ 25.000). Considere reforçar a reserva.',
    fundamento: {
      metrica: 'Cobertura de despesas fixas',
      valorAtual: '0,8 mês',
      valorReferencia: '>= 1 mês',
      periodo: '10/2026',
      comparacao: 'abaixo do limite',
    },
    impacto: 'Alto',
    impactoEstimado: 'Risco de caixa',
    esforco: 'Alto',
    prioridade: 'Média',
    confianca: 'Alta',
    rota: 'posicao-caixa',
    fonte: 'Posição de Caixa — 10/2026',
    acaoSugerida: 'Reforçar a reserva de caixa (recebíveis, empréstimo, etc.).',
    lida: false,
    dataGeracao: '2026-10-26T15:30:00',
  },
  {
    id: 'E6',
    area: 'Eficiência',
    icone: '💼',
    titulo: 'Despesas variáveis representam 32% da receita',
    descricao: 'As despesas variáveis (comissões, frete) representam 32% da receita. Considere revisar comissões e frete.',
    fundamento: {
      metrica: 'Despesas variáveis',
      valorAtual: '32%',
      valorReferencia: '30% (limite)',
      periodo: '10/2026',
      comparacao: 'acima do limite',
    },
    impacto: 'Médio',
    impactoEstimado: 'R$ 2.050/mês',
    esforco: 'Médio',
    prioridade: 'Média',
    confianca: 'Alta',
    rota: 'dre',
    fonte: 'DRE Gerencial — 10/2026',
    acaoSugerida: 'Revisar a política de comissões e os contratos de frete.',
    lida: false,
    dataGeracao: '2026-10-26T15:30:00',
  },

  // ----- BAIXA PRIORIDADE -----
  {
    id: 'C5',
    area: 'Custos',
    icone: '📦',
    titulo: 'Categoria sem movimentação há 3 meses',
    descricao: 'A categoria "Material de Escritório" não tem movimentação há 3 meses. Considere desativar ou revisar.',
    fundamento: {
      metrica: 'Movimentação',
      valorAtual: '0',
      valorReferencia: '>= 1',
      periodo: '08/2026 a 10/2026',
      comparacao: 'sem movimentação',
    },
    impacto: 'Baixo',
    impactoEstimado: '—',
    esforco: 'Baixo',
    prioridade: 'Baixa',
    confianca: 'Alta',
    rota: 'analise-custos',
    fonte: 'Análise de custos — 08/2026 a 10/2026',
    acaoSugerida: 'Desativar a categoria ou revisar seu uso.',
    lida: false,
    dataGeracao: '2026-10-26T15:30:00',
  },
  {
    id: 'C10',
    area: 'Custos',
    icone: '🏷️',
    titulo: 'Fornecedor sem categoria definida',
    descricao: 'O fornecedor "Fornecedor ABC Ltda" está sem categoria. Considere cadastrar para melhorar a análise.',
    fundamento: {
      metrica: 'Categoria do fornecedor',
      valorAtual: '—',
      valorReferencia: 'Categoria definida',
      periodo: '10/2026',
      comparacao: 'pendente',
    },
    impacto: 'Baixo',
    impactoEstimado: 'Melhora a análise',
    esforco: 'Baixo',
    prioridade: 'Baixa',
    confianca: 'Alta',
    rota: 'fornecedores',
    fonte: 'Cadastro de Fornecedores — 10/2026',
    acaoSugerida: 'Cadastrar a categoria do fornecedor.',
    lida: false,
    dataGeracao: '2026-10-26T15:30:00',
  },
  {
    id: 'E4',
    area: 'Eficiência',
    icone: '🖥️',
    titulo: 'Ativo ocioso há 6 meses',
    descricao: 'O ativo "Notebook Dell (antigo)" está ocioso há 6 meses. Considere alienar ou dar uso.',
    fundamento: {
      metrica: 'Status do ativo',
      valorAtual: 'Ocioso',
      valorReferencia: 'Em uso',
      periodo: '04/2026 a 10/2026',
      comparacao: '6 meses ocioso',
    },
    impacto: 'Baixo',
    impactoEstimado: 'R$ 2.000 (alienação)',
    esforco: 'Baixo',
    prioridade: 'Baixa',
    confianca: 'Alta',
    rota: 'ativos',
    fonte: 'Posição de Ativos — 10/2026',
    acaoSugerida: 'Alienar o ativo ou colocá-lo em uso.',
    lida: false,
    dataGeracao: '2026-10-26T15:30:00',
  },
];

// Filtros do Conselheiro
let filtroConselheiro = {
  area: 'todas',
  prioridade: 'todas',
  mostrarLidas: false,
  periodo: '10/2026',
  filial: 'Matriz',
};

