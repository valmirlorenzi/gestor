/* ============================================================
   DADOS DO MENU — fallback (quando window.__MENU__ não existe)
   Fonte: 09_menu_numeracao.md
   Em produção, o MenuService envia window.__MENU__ na sidebar.
   ============================================================ */

const MENU_ITENS_MOCK = [
  // Bloco 1 — Meu Trabalho (todos)
  { codigo: '1.0', nome: 'Tela Inicial',     rota: 'tela-inicial',   icone: '🏠', bloco: 1, atores: ['*'] },  
  { codigo: '1.1', nome: 'Caixa de Entrada',  rota: 'caixa-entrada', icone: '📥', bloco: 1, atores: ['*'], badge: true },
  { codigo: '1.2', nome: 'Caixa de Saída',    rota: 'caixa-saida',   icone: '📤', bloco: 1, atores: ['*'] },
  { codigo: '1.3', nome: 'Histórico',         rota: 'historico',     icone: '🕘', bloco: 1, atores: ['*'] },

  // Bloco 2 — Configurador
  { codigo: '2.1', nome: 'Empresa',                       rota: 'empresa',        icone: '🏢', bloco: 2, atores: ['configurador'] },
  { codigo: '2.2', nome: 'Filiais',                       rota: 'filial',         icone: '🏬', bloco: 2, atores: ['configurador'] },
  { codigo: '2.3', nome: 'Centros de Custo e Áreas',      rota: 'centros',        icone: '🗂️', bloco: 2, atores: ['configurador'] },
  { codigo: '2.4', nome: 'Usuários e Atores',             rota: 'usuarios',       icone: '👥', bloco: 2, atores: ['configurador'] },
  { codigo: '2.5', nome: 'Produtos',                      rota: 'produtos',       icone: '📦', bloco: 2, atores: ['configurador'] },
  { codigo: '2.6', nome: 'Serviços',                      rota: 'produtos',       icone: '🛠️', bloco: 2, atores: ['configurador'] },
  { codigo: '2.7', nome: 'Ativos',                        rota: 'ativos',         icone: '🏗️', bloco: 2, atores: ['configurador'] },
  { codigo: '2.8', nome: 'Handoff',                       rota: 'handoff',        icone: '🔄', bloco: 2, atores: ['configurador'] },

  // Bloco 3 — Administrador
  { codigo: '3.11', nome: 'Painel Executivo',      rota: 'painel-executivo',  icone: '📊', bloco: 3, atores: ['administrador'], fase: 1 },
  { codigo: '3.1',  nome: 'DRE Gerencial',         rota: 'dre',     icone: '📈', bloco: 3, atores: ['administrador'], fase: 1 },
  { codigo: '3.10', nome: 'Balanço Patrimonial',   rota: 'balanco',           icone: '⚖️', bloco: 3, atores: ['administrador'], fase: 1 },
  { codigo: '3.4',  nome: 'Fluxo de Caixa Projetado', rota: 'fluxo-caixa',    icone: '💵', bloco: 3, atores: ['administrador'], fase: 1 },
  { codigo: '3.12', nome: 'Aging de Contas',       rota: 'aging-contas',      icone: '⏳', bloco: 3, atores: ['administrador'], fase: 1 },
  { codigo: '3.13', nome: 'Posição de Impostos',   rota: 'posicao-impostos',  icone: '🧾', bloco: 3, atores: ['administrador'], fase: 1 },
  { codigo: '3.14', nome: 'Posição de Pessoal',    rota: 'posicao-pessoal',   icone: '👥', bloco: 3, atores: ['administrador'], fase: 1 },
  { codigo: '3.15', nome: 'Posição de Ativos',     rota: 'posicao-ativos',    icone: '🏢', bloco: 3, atores: ['administrador'], fase: 1 },
  { codigo: '3.8',  nome: 'Posição de Caixa',      rota: 'posicao-caixa',     icone: '💰', bloco: 3, atores: ['administrador'], fase: 1 },
  { codigo: '3.2',  nome: 'DRE por Centro de Custo', rota: 'dre-centro',      icone: '📊', bloco: 3, atores: ['administrador'], fase: 1 },
  { codigo: '3.3',  nome: 'Resumo por Área',       rota: 'resumo-area',       icone: '🗂️', bloco: 3, atores: ['administrador'], fase: 1 },
  { codigo: '3.5',  nome: 'Análise de Custos',     rota: 'analise-custos',    icone: '🔍', bloco: 3, atores: ['administrador'], fase: 1 },
  { codigo: '3.6',  nome: 'Margem por Cliente/Produto', rota: 'margem',       icone: '📐', bloco: 3, atores: ['administrador'], fase: 1 },
  { codigo: '3.16', nome: 'Ponto de Equilíbrio',   rota: 'ponto-equilibrio',  icone: '⚖️', bloco: 3, atores: ['administrador'], fase: 1 },
  { codigo: '3.17', nome: 'Resumo Executivo',      rota: 'resumo-executivo',  icone: '📄', bloco: 3, atores: ['administrador'], fase: 1 },
  { codigo: '3.7',  nome: 'Exportação',            rota: 'exportacao',        icone: '📤', bloco: 3, atores: ['administrador'], fase: 1 },
  { codigo: '3.9',  nome: 'Simulações',            rota: 'simulacoes',        icone: '🔮', bloco: 3, atores: ['administrador'], fase: 2 },
  { codigo: '3.18', nome: 'Conselheiro', rota: 'conselheiro', icone: '💡', bloco: 3, atores: ['administrador'] },

  // Bloco 4 — Contador
  { codigo: '4.1',  nome: 'Tabelas basais (fiscais)',     rota: 'tabelas-fiscais', icone: '📋', bloco: 4, atores: ['contador'] },
  { codigo: '4.2',  nome: 'Plano de Contas',              rota: 'plano-contas',    icone: '🌳', bloco: 4, atores: ['contador'] },
  { codigo: '4.3',  nome: 'Configurações contábeis',      rota: 'config-contabeis', icone: '⚙️', bloco: 4, atores: ['contador'] },
  { codigo: '4.4',  nome: 'Configurações fiscais',        rota: 'config-fiscais',  icone: '🏛️', bloco: 4, atores: ['contador'] },
  { codigo: '4.5',  nome: 'Regras de Classificação',      rota: 'regras',          icone: '🧠', bloco: 4, atores: ['contador'] },
  { codigo: '4.6',  nome: 'Lançamento Manual',            rota: 'lancamento-manual', icone: '✍️', bloco: 4, atores: ['contador'] },
  { codigo: '4.7',  nome: 'Revisão de Lançamentos',       rota: 'revisao-lancamentos', icone: '🔍', bloco: 4, atores: ['contador'] },
  { codigo: '4.8',  nome: 'Validação de Cálculos',        rota: 'validacao',       icone: '✔️', bloco: 4, atores: ['contador'] },
  { codigo: '4.9',  nome: 'Relatório de Pendências',      rota: 'pendencias',      icone: '⚠️', bloco: 4, atores: ['contador'] },
  { codigo: '4.10', nome: 'Preparar Fechamento',          rota: 'preparar-fechamento', icone: '📦', bloco: 4, atores: ['contador'] },
  { codigo: '4.11', nome: 'Fechar Período',               rota: 'fechar-periodo',  icone: '🔒', bloco: 4, atores: ['contador'] },

  // Bloco 5 — Comprador
  { codigo: '5.1', nome: 'Tabelas basais',                rota: 'tabelas-basais-comprador', icone: '📋', bloco: 5, atores: ['comprador'] },
  { codigo: '5.2', nome: 'Cadastro de Fornecedores',      rota: 'fornecedores',    icone: '🏭', bloco: 5, atores: ['comprador'] },
  { codigo: '5.3', nome: 'Digitar Notas de Entrada',      rota: 'nota-entrada', icone: '⌨️', bloco: 5, atores: ['comprador'] },
  { codigo: '5.4', nome: 'Importar Notas de Entrada',     rota: 'importar-xml',    icone: '📥', bloco: 5, atores: ['comprador'] },
  { codigo: '5.5', nome: 'Revisar Classificações',        rota: 'revisao-classificacoes', icone: '🔍', bloco: 5, atores: ['comprador'] },

  // Bloco 6 — Faturista
  { codigo: '6.1', nome: 'Tabelas basais',                rota: 'tabelas-basais-faturista', icone: '📋', bloco: 6, atores: ['faturista'] },
  { codigo: '6.2', nome: 'Cadastro de Clientes',          rota: 'clientes',        icone: '🧑‍💼', bloco: 6, atores: ['faturista'] },
  { codigo: '6.3', nome: 'Digitar Notas de Saída',        rota: 'nota-saida', icone: '⌨️', bloco: 6, atores: ['faturista'] },
  { codigo: '6.4', nome: 'Importar Notas de Saída',       rota: 'importar-xml',    icone: '📤', bloco: 6, atores: ['faturista'] },
  { codigo: '6.5', nome: 'Revisar Classificações',        rota: 'revisao-classificacoes', icone: '🔍', bloco: 6, atores: ['faturista'] },

  // Bloco 7 — Financeiro1
  { codigo: '7.1', nome: 'Tabelas basais',                rota: 'tabelas-basais-fin1', icone: '📋', bloco: 7, atores: ['financeiro1'] },
  { codigo: '7.2', nome: 'Contas a Pagar',                rota: 'contas-pagar',    icone: '📄', bloco: 7, atores: ['financeiro1'] },
  { codigo: '7.3', nome: 'Pagamentos',                    rota: 'contas-pagar',      icone: '💳', bloco: 7, atores: ['financeiro1'] },

  // Bloco 8 — Financeiro2
  { codigo: '8.1', nome: 'Tabelas basais',                rota: 'tabelas-basais-fin2', icone: '📋', bloco: 8, atores: ['financeiro2'] },
  { codigo: '8.2', nome: 'Contas a Receber',              rota: 'contas-receber',  icone: '📄', bloco: 8, atores: ['financeiro2'] },
  { codigo: '8.3', nome: 'Recebimentos',                  rota: 'contas-receber',    icone: '💵', bloco: 8, atores: ['financeiro2'] },

  // Bloco 9 — Gerente Financeiro
  { codigo: '9.1', nome: 'Validar Saídas de Caixa/Banco', rota: 'validar-saidas',  icone: '🔒', bloco: 9, atores: ['gerente_financeiro'] },
  { codigo: '9.2', nome: 'Validar Entradas de Caixa/Banco', rota: 'validar-entradas', icone: '🔓', bloco: 9, atores: ['gerente_financeiro'] },

  // Bloco 10 — RH
  { codigo: '10.1', nome: 'Tabelas basais — INSS',        rota: 'tabelas-inss',    icone: '📋', bloco: 10, atores: ['rh'] },
  { codigo: '10.2', nome: 'Tabelas basais — IRRF',        rota: 'tabelas-irrf',    icone: '📋', bloco: 10, atores: ['rh'] },
  { codigo: '10.3', nome: 'Tabelas basais — Gerais',      rota: 'tabelas-gerais',  icone: '📋', bloco: 10, atores: ['rh'] },
  { codigo: '10.4', nome: 'Cadastro de Funcionários',     rota: 'funcionarios',    icone: '👷', bloco: 10, atores: ['rh'] },
  { codigo: '10.5', nome: 'Tabelas Auxiliares de Folha',  rota: 'tabelas-auxiliares', icone: '📋', bloco: 10, atores: ['rh'] },
  { codigo: '10.6', nome: 'Folha de Pagamento',           rota: 'folha',           icone: '💼', bloco: 10, atores: ['rh'] },

  // Bloco 11 — Auditor
  { codigo: '11.1', nome: 'Auditoria (log)',              rota: 'auditoria',       icone: '📜', bloco: 11, atores: ['auditor', 'configurador'] },
  { codigo: '11.2', nome: 'Auditoria de Documentos',      rota: 'auditoria-documentos', icone: '📄', bloco: 11, atores: ['auditor'] },
  { codigo: '11.3', nome: 'Auditoria de Lançamentos',     rota: 'auditoria-lancamentos', icone: '📝', bloco: 11, atores: ['auditor'] },
  { codigo: '11.4', nome: 'Handoff (transições)',         rota: 'handoff-transicoes', icone: '🔄', bloco: 11, atores: ['auditor'] },
  { codigo: '11.5', nome: 'Relatório de Pendências',      rota: 'pendencias',      icone: '⚠️', bloco: 11, atores: ['auditor'] },
  { codigo: '11.6', nome: 'Apontar Problemas',            rota: 'apontar',         icone: '🚩', bloco: 11, atores: ['auditor'] },
  { codigo: '11.7', nome: 'Solicitar Correções',          rota: 'solicitar',       icone: '✉️', bloco: 11, atores: ['auditor'] },
  { codigo: '11.8', nome: 'Validar Fechamento',           rota: 'validar-fechamento', icone: '✔️', bloco: 11, atores: ['auditor'] },

  // Bloco 12 — Administração (transversal)
  { codigo: '12.1', nome: 'Período — Abertura e Fechamento', rota: 'periodo',      icone: '📅', bloco: 12, atores: ['contador', 'auditor'] },
  { codigo: '12.2', nome: 'Parâmetros — Tabelas',         rota: 'parametros',      icone: '📋', bloco: 12, atores: ['configurador', 'contador', 'rh'] },
  { codigo: '12.3', nome: 'Handoff — Ativar/Desativar',   rota: 'handoff',         icone: '🔄', bloco: 12, atores: ['configurador'] },
  { codigo: '12.4', nome: 'Auditoria (I3)',               rota: 'auditoria',       icone: '📜', bloco: 12, atores: ['configurador', 'auditor'] },
  { codigo: '12.5', nome: 'Usuários e Atores',            rota: 'usuarios',        icone: '👥', bloco: 12, atores: ['configurador'] },
];

// Nome dos blocos (para exibir no menu)
const MENU_BLOCOS = {
  1:  { nome: 'Meu Trabalho',        icone: '📥' },
  2:  { nome: 'Configurador',        icone: '⚙️' },
  3:  { nome: 'Administrador',       icone: '👔' },
  4:  { nome: 'Contador',            icone: '🧮' },
  5:  { nome: 'Comprador',           icone: '🛒' },
  6:  { nome: 'Faturista',           icone: '🧾' },
  7:  { nome: 'Financeiro1 — Contas a Pagar', icone: '💸' },
  8:  { nome: 'Financeiro2 — Contas a Receber', icone: '💰' },
  9:  { nome: 'Gerente Financeiro',  icone: '🏦' },
  10: { nome: 'RH',                  icone: '👥' },
  11: { nome: 'Auditor',             icone: '🔍' },
  12: { nome: 'Administração',       icone: '🛠️' },
};