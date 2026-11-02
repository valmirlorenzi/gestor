---
documento: manual_usuario
documento: manual_usuario
versao: 1.5
data: 2026-10-26
publico: usuário final (Administrador, Contador, Comprador, Faturista, Financeiro, RH, Auditor, Configurador)
baseado_em: [00_indice, 01_visao_geral, 02_regras_transversais, 03_casos_de_uso, 04_modelo_de_dados, 05_apendices, 06_pendencias, 07_atores_fluxo, 08_ordens, 09_menu_numeracao, 11_wireframe, 12_tela_inicial, 13_relatorios_administrador, 14_conselheiro]
---

# Manual do Usuário — Sistema de Gestão Gerencial com Simulação

> **Versão:** 1.5 — 26/10/2026
> **Público-alvo:** todos os usuários do sistema.
> **Como usar:** este manual está organizado por **telas e tarefas do dia a dia**. Use o índice para ir direto ao assunto. Cada seção indica **quem faz**, **quando fazer** e **o que o sistema faz sozinho**.
> **Novidade na v1.4:** 8 relatórios novos do Administrador (Balanço Patrimonial, Painel Executivo, Aging de Contas, Posição de Impostos, Posição de Pessoal, Posição de Ativos, Ponto de Equilíbrio, Resumo Executivo) — itens 3.10 a 3.17 do menu. Tela Inicial do Administrador ganhou resumo do Painel Executivo.
> **Novidade na v1.5:** **Conselheiro** (3.18) — agente que analisa os dados e sugere melhorias acionáveis ao gestor. Seção 11.9.
---

## Índice

1. [Primeiros passos](#1-primeiros-passos)
   - [1.5. Tela Inicial (dashboard)](#15-tela-inicial-dashboard)
2. [Conceitos que você precisa conhecer](#2-conceitos-que-você-precisa-conhecer)
3. [Configuração inicial (Configurador / Contador)](#3-configuração-inicial)
4. [Cadastros básicos](#4-cadastros-básicos)
5. [Entrada de dados — importação de XMLs](#5-entrada-de-dados--importação-de-xmls)
6. [Entrada de dados — digitação manual](#6-entrada-de-dados--digitação-manual)
7. [Classificação automática e revisão](#7-classificação-automática-e-revisão)
8. [Cálculos automáticos (impostos, folha, depreciação, provisões)](#8-cálculos-automáticos)
9. [Financeiro — contas a pagar e a receber](#9-financeiro--contas-a-pagar-e-a-receber)
10. [Fechamento de período](#10-fechamento-de-período)
11. [Relatórios gerenciais](#11-relatórios-gerenciais)
    - [11.1 a 11.7 — DRE, DRE por Centro, Resumo por Área, Fluxo de Caixa, Análise de Custos, Margem, Exportação](#111-dre-gerencial-por-período-g1)
    - [11.8 a 11.15 — Balanço, Painel Executivo, Aging, Impostos, Pessoal, Ativos, Ponto de Equilíbrio, Resumo Executivo](#118-balanço-patrimonial-g8)
    - [11.16 — Conselheiro (3.18)](#1116-conselheiro-318)
12. [Simulação de cenários (fase 2)](#12-simulação-de-cenários-fase-2)
13. [Administração](#13-administração)
    - [13.5. Ordens — a fila única de trabalho](#135-ordens--a-fila-única-de-trabalho)
14. [Fluxo de documentos entre setores (handoff)](#14-fluxo-de-documentos-entre-setores-handoff)
15. [Formato de publicação do manual](#15-formato-de-publicação-do-manual)
16. [Mensagens e pendências — o que fazer](#16-mensagens-e-pendências--o-que-fazer)
17. [Perguntas frequentes](#17-perguntas-frequentes)
18. [Glossário rápido](#18-glossário-rápido)
    - [Glossário de ordens](#glossário-de-ordens)
19. [Sobre o wireframe (versão de demonstração)](#19-sobre-o-wireframe-versão-de-demonstração)

---

## 1. Primeiros passos

### 1.1 O que é o sistema

O **Sistema de Gestão Gerencial com Simulação** registra o mínimo necessário para que você entenda a estrutura de **custos, despesas e investimentos** da empresa e possa **simular cenários** para tomar decisões.

**O que ele faz:**
- Importa notas fiscais (NF-e, NFS-e, CT-e, RPA) e classifica automaticamente.
- Calcula impostos sobre compras e vendas (para fins gerenciais).
- Calcula folha de pagamento, depreciação e provisões.
- Controla contas a pagar/receber e posição de caixa.
- Gera DRE, resumo por área, fluxo de caixa, análise de custos e margem por cliente/produto.
- (Fase 2) Simula cenários "e se...?".

**O que ele NÃO faz:**
- ❌ Não emite nota fiscal (NF-e, NFS-e, CT-e, RPA).
- ❌ Não faz escrituração contábil oficial (Diário, Razão).
- ❌ Não gera obrigações acessórias (SPED, DCTF) nem guias (DARF, GRF).
- ❌ Não emite holerite, recibo ou aviso ao funcionário.
- ❌ Não controla estoque físico (quantidades).
- ❌ Não calcula obrigações fiscais reais — o cálculo fiscal é **gerencial e para simulação**.

> ⚠️ **Aviso obrigatório:** "O cálculo fiscal deste sistema é apenas para referência gerencial e simulação de decisões, não constituindo base para declaração fiscal. Consulte um contador para obrigações fiscais reais."

### 1.2 Princípio norteador: "Não me faça pensar"

O sistema **sugere ativamente** classificações e parâmetros, **exibe o porquê** de cada sugestão e **aprende com as suas correções**. Você nunca fica sem saber por que uma conta foi sugerida — basta clicar em **"Por que?"**.

### 1.3 Atores (tags de usuário)

Cada usuário tem uma ou mais **tags de ator**. A tag define o que ele pode fazer. **Não existe "perfil de acesso" separado.**

| Ator | O que faz |
| :--- | :--- |
| **Configurador** | Cadastros fundamentais e genéricos; ativa/desativa handoff; consulta auditoria. Tem acesso total. |
| **Administrador / Empresário** | Consulta relatórios e simula cenários. Não opera. |
| **Contador** | Configura plano de contas, regras e parâmetros fiscais; valida lançamentos e cálculos; prepara o fechamento. |
| **Comprador** | Importa/digita NF-e de entrada, NFS-e tomada, CT-e tomado e RPA; classifica; gera contas a pagar. |
| **Faturista** | Importa/digita NF-e de saída, NFS-e prestada e CT-e emitido; classifica; gera contas a receber. |
| **Financeiro1** | Processa contas a pagar e pagamentos. |
| **Financeiro2** | Processa contas a receber e recebimentos. |
| **Gerente Financeiro** | Valida saídas e entradas de caixa/banco. |
| **RH** | Importa/digita folha de pagamento; cadastra funcionários e proventos/descontos. |
| **Auditor** | Consulta auditoria, aponta problemas, solicita mudanças e valida o fechamento. Não altera nada. |

> 💡 **Dica:** numa empresa pequena, uma mesma pessoa pode acumular vários papéis (ex: Comprador + Financeiro). Se o usuário tiver a tag **Configurador**, já tem acesso a tudo e não precisa das demais.

### 1.4 Como navegar

O sistema está organizado em **blocos por ator**, acessíveis pelo menu lateral. Cada item tem um **número de acesso rápido** (ex: `4.7`), que pode ser digitado no campo **"Ir para"** no topo do menu (atalho `Ctrl+K`).

| Bloco | Itens | Números |
| :--- | :--- | :--- |
| **📥 Meu Trabalho** (igual para todos) | Caixa de Entrada, Caixa de Saída, Histórico | 1.1, 1.2, 1.3 |
| **⚙️ Configurador** | Empresa, Filiais, Centros de Custo, Usuários, Produtos, Serviços, Ativos, Handoff | 2.1 a 2.8 |
| **👔 Administrador** | DRE, DRE por Centro, Resumo por Área, Fluxo de Caixa, Análise de Custos, Margem, Exportação, Posição de Caixa, Simulações, **Balanço Patrimonial, Painel Executivo, Aging de Contas, Posição de Impostos, Posição de Pessoal, Posição de Ativos, Ponto de Equilíbrio, Resumo Executivo, Conselheiro** | 3.1 a 3.18 |
| **🧮 Contador** | Tabelas Fiscais, Plano de Contas, Config. Contábeis, Config. Fiscais, Regras, Lançamento Manual, Revisão, Validação, Pendências, Preparar/Fechar | 4.1 a 4.11 |
| **🛒 Comprador** | Tabelas Basais, Fornecedores, Digitar Notas, Importar XML, Revisar Classificações | 5.1 a 5.5 |
| **🧾 Faturista** | Tabelas Basais, Clientes, Digitar Notas, Importar XML, Revisar Classificações | 6.1 a 6.5 |
| **💸 Financeiro1** | Tabelas Basais, Contas a Pagar, Pagamentos | 7.1 a 7.3 |
| **💰 Financeiro2** | Tabelas Basais, Contas a Receber, Recebimentos | 8.1 a 8.3 |
| **🏦 Gerente Financeiro** | Validar Saídas, Validar Entradas | 9.1, 9.2 |
| **👥 RH** | INSS, IRRF, Gerais, Funcionários, Tabelas Auxiliares, Folha | 10.1 a 10.6 |
| **🔍 Auditor** | Auditoria (log), Documentos, Lançamentos, Handoff, Pendências, Apontar, Solicitar, Validar Fechamento | 11.1 a 11.8 |

> 💡 **Dica:** o menu é montado pelas suas **tags de ator**. Se você tem `configurador`, vê tudo. Se tem múltiplas tags, vê a união dos blocos. O bloco **"Administração"** (transversal) só aparece se você tiver permissão em pelo menos um item.

> 💡 **Acesso rápido:** digite o número no campo **"Ir para"** (ex: `4.10`) e pressione Enter. O bloco é expandido automaticamente e a tela é aberta.

### 1.5 Tela Inicial (dashboard)

Ao entrar no sistema (ou ao trocar de ator), você vê a **Tela Inicial** — um dashboard com o que importa para o seu dia a dia.

**O que tem na Tela Inicial:**

- **Saudação** — seu nome, a data, o período aberto e a filial.
- **Alertas** — o que precisa de atenção (contas vencidas, pendências, ordens urgentes). Clique em um alerta para ir direto à tela correspondente.
- **KPIs** — 4 números que resumem a situação (ex: "lançamentos pendentes: 4", "inadimplência: R$ 800").
- **Ações rápidas** — 4 botões para as tarefas mais frequentes (ex: "Pagar conta", "Revisar lançamentos").
- **Minhas ordens** — as 3 primeiras ordens pendentes ou em andamento. O link "Ver todas" leva à Caixa de Entrada (1.1).
- **Resumo** — um bloco com o conteúdo mais útil para o seu perfil (mini-DRE, próximos vencimentos, timeline do fechamento, etc.).

**O que a Tela Inicial NÃO é:**

- Não é a tela completa de cada módulo. Ela **aponta** para as telas; se você quiser o detalhe, clique no alerta, na ação ou na ordem.
- Não é customizável na fase 1. Na fase 2, você poderá escolher quais blocos ver.

**Onde encontrar:** menu **Meu Trabalho → 1.0 Tela Inicial**.

---

## 2. Conceitos que você precisa conhecer

### 2.1 Período de competência (regra T5)

**Regra de ouro:** todo documento ou lançamento pertence ao **período aberto no momento da inclusão**, independentemente da data de emissão.

- Só existe **um período aberto por filial**.
- **Não existe** reabrir período fechado, lançamento de exceção ou agendamento por data de emissão.
- Se a nota tem data de emissão fora do período aberto, o sistema **avisa** ("A nota tem data de emissão 31/03/2026, mas será incluída no período 04/2026. Confirmar?"). Se você confirmar, ela integra o período aberto normalmente.
- Documento **cancelado** é registrado apenas para histórico e ignorado em todos os cálculos.

### 2.2 Pendências: Erro × Aviso (regra T6)

Antes de fechar o período, o sistema gera um **relatório de pendências**:

| Categoria | O que significa | Efeito no fechamento |
| :--- | :--- | :--- |
| **Erro** | Impede o fechamento (ex: lançamento não classificado, provisão não calculada). | **Bloqueia**. |
| **Aviso** | Não impede, mas merece atenção (ex: conta vencida não baixada, data divergente já confirmada). | **Não bloqueia**. Exige confirmação explícita. |

Cada pendência tem uma **ação de resolução**. Você pode acessar o relatório a qualquer momento, com filtros.

### 2.3 Razão de créditos e débitos de impostos (regra T7)

O sistema mantém um **razão de impostos** por tipo (PIS, COFINS, ICMS, IPI, ISS, IBS, CBS, IR, CSLL, INSS, FGTS, etc.):

- **Compra** → gera **crédito**.
- **Venda** → gera **débito**.
- **Retenção sofrida** → crédito a recuperar.
- **Retenção efetuada** → débito a recolher.
- **Folha** → débito (INSS, FGTS, IRRF).
- **Apuração:** saldo (débitos − créditos) por tipo, por período.

É **gerencial** — não gera guias e não substitui a apuração fiscal oficial.

### 2.4 Cadeia de documentos e handoff (regra T8)

Pense no sistema como se **não houvesse computador**: cada ator **assina** a sua ordem e **gera uma nova ordem** para o próximo setor. A ordem carrega quem assinou, quando, o que fez e para quem vai.

- **Handoff fixo:** o fluxo padrão é definido pelo sistema. O Configurador pode **ativar/desativar** o handoff **por empresa** (empresa pequena desativa; empresa maior ativa). Não há ajuste do ator de destino.
- **Autorização automática:** apenas algumas ordens são processadas pelo sistema (custo de produto, geração de contas a pagar/receber, razão de impostos). **Todo o restante exige ação humana.**
- **Caixa de entrada:** tarefas pendentes e em andamento, com urgentes destacadas.
- **Caixa de saída:** o que você enviou e ainda está pendente ou em andamento. Concluída vai para o histórico.
- **Status "urgente":** você pode marcar uma ordem como urgente (por ordem, não por documento). Não há prazo obrigatório.
- **Auditor não muda nada:** consulta, aponta problemas, solicita mudanças ao ator competente e **valida a consolidação do fechamento** antes de o Contador fechar.

### 2.5 Partidas dobradas

Todo lançamento tem **débito e crédito**. Na maioria das telas você **não digita as duas pernas** — o sistema monta automaticamente a partir da operação e da forma de contrapartida (ex: "Compra de computador a prazo" → Débito em Imobilizado, Crédito em Contas a Pagar).

### 2.6 Método de custo

O CMV (Custo da Mercadoria Vendida) pode usar três métodos, definidos no cadastro da empresa:

| Método | Como funciona |
| :--- | :--- |
| **XML** (padrão) | Usa o custo unitário informado no XML da nota. |
| **Médio** | Usa o custo médio calculado a partir das entradas (`produto_custo`). |
| **Manual** | O operador informa o custo unitário no item. |

---

## 3. Configuração inicial

> **Quem faz:** Configurador (com apoio do Contador nos ajustes contábeis/fiscais).

### 3.1 Cadastrar a empresa (A1)

Este é o **primeiro passo da implantação**. Se já existir empresa cadastrada, o caso vira "editar empresa".

1. Acesse **Configuração > Empresa > Nova**.
2. Preencha:
   - **Dados cadastrais:** CNPJ, Razão Social, Nome Fantasia, Inscrição Estadual, Inscrição Municipal, endereço.
   - **Regime fiscal:** Simples Nacional / Lucro Presumido / Lucro Real (escolha única).
   - **Setor:** Comércio / Serviços / Misto (escolha única — define quais contas de custo são ativadas).
   - **CNAE principal** (opcional, recomendado).
   - **Data de início de operação** (mês/ano do primeiro período).
3. Selecione o **plano de contas sugerido** (inicialmente "Plano Gerencial Padrão — Comércio e Serviços").
4. Confirme.

**O que o sistema faz sozinho:**
- Valida o CNPJ (dígito verificador e unicidade).
- Carrega as tabelas universais de parâmetros fiscais e trabalhistas.
- Cria a **filial matriz** automaticamente.
- Cria o **primeiro período** no estado **Aberto**.
- Exibe um resumo do que foi configurado.

> ⚠️ **Atenção:** alteração de **regime fiscal ou setor** exige confirmação explícita e só é permitida no início de um novo período. O sistema não apaga dados históricos — apenas ajusta o comportamento a partir do novo período.

### 3.2 Plano de contas (A2)

1. Acesse **Configuração > Plano de Contas**.
2. Você vê a árvore de contas (sintéticas e analíticas), com código, nome, tipo, sub-tipo e indicador "aceita lançamento".
3. Você pode:
   - **Criar** conta (analítica ou sintética): código, nome, tipo, sub-tipo, conta pai, mapeamento referencial.
   - **Editar** conta (nome, sub-tipo, mapeamento).
   - **Desativar** conta (soft delete).

**Regras:**
- Só contas **analíticas** recebem lançamentos; sintéticas apenas somam.
- Conta com lançamentos **não pode ser excluída** — apenas desativada.
- Alterações no plano **não afetam** lançamentos já classificados em períodos fechados.

### 3.3 Centros de custo e áreas de negócio (A3)

- **Centros de custo:** departamentos/unidades (nome, responsável). Um centro pode estar em mais de uma área (N:N).
- **Áreas de negócio:** agrupamentos de centros (ex: Comercial, Operações, Administrativo).

**Regras:**
- Obrigatório ao menos um centro de custo antes de lançar despesas fixas.
- Centro com lançamentos não pode ser excluído — apenas desativado.

### 3.4 Parâmetros fiscais e trabalhistas (A4 / I2)

- As tabelas são carregadas automaticamente no cadastro da empresa.
- **Tabelas trabalhistas** (INSS, IRRF, encargos) são universais e **não adaptáveis** (federais).
- **Tabelas fiscais** (tributos estaduais/municipais, benefícios) são universais, mas **adaptáveis por empresa**.
- Suporte a **vigência por período** (data inicial e final de validade).

Para atualizar: **Administração > Parâmetros** (seção 13.2).

### 3.5 Cadastrar filial (A8)

1. Acesse **Configuração > Filiais > Nova**.
2. Informe CNPJ, Razão Social, IE, IM, endereço, município, CNAE, data de início.
3. Confirme.

**O que o sistema faz sozinho:**
- Valida o CNPJ.
- Cria a filial.
- Cria o **primeiro período** da filial no estado **Aberto**.

**Regras:**
- A filial **herda** o regime fiscal, o setor e o plano de contas da empresa (não podem ser diferentes).
- A filial pode ter **CNAE diferente** da matriz (para RAT e Terceiros).
- A filial pode ter **endereço/município diferente**.
- Filial com lançamentos não pode ser excluída — apenas desativada.

### 3.6 Abrir/fechar período (A6)

O fechamento mensal é a **âncora do ciclo**. Veja a seção 10 para o passo a passo completo.

---

## 4. Cadastros básicos

### 4.1 Clientes (B1) e Fornecedores (B2)

> **Quem faz:** Faturista (clientes) e Comprador (fornecedores), ou automaticamente na importação.

- **Pessoa unificada (PF/PJ), com tags.** Um mesmo registro pode ser Cliente e Fornecedor ao mesmo tempo.
- **Documento validado** conforme o tipo (CPF para PF, CNPJ para PJ) e **único por empresa**.
- **Fornecedor** tem **categoria padrão** (alimenta o motor de classificação) e prazo padrão de pagamento.
- **Cliente** tem prazo padrão de recebimento.

> 💡 **Cadastro incompleto:** se um cliente ou fornecedor aparecer numa nota importada e não estiver cadastrado, o sistema **cria automaticamente** com status **"Cadastro incompleto"**. Você completa depois.

### 4.2 Funcionários (B3)

> **Quem faz:** RH.

Informe: nome, CPF, cargo, departamento (centro de custo), salário base, data de admissão, **natureza (custo/despesa fixa)**, rateio (se aplicável).

- A **natureza** define a alocação no DRE (custo ou despesa fixa).
- **Rateio por centro de custo** é permitido (N:N).
- Funcionário não cadastrado em importação de folha/RPA é **criado automaticamente** com status "Cadastro incompleto".

### 4.3 Ativos / patrimônios (B4)

> **Quem faz:** Configurador (base) + Contador (ajustes).

Informe: nome, data de aquisição, valor original, valor residual, vida útil (meses), método de depreciação (linear padrão), centro de custo, **destino (custo/despesa)**, **mês inicial da depreciação**.

- O **mês inicial da depreciação** tem sugestão padrão do mês seguinte à aquisição, mas é editável.
- Após o primeiro lançamento de depreciação, alteração do mês inicial exige reprocessamento (com auditoria).

### 4.4 Produtos e serviços

- **Produtos** têm NCM; **serviços** têm código LC 116.
- Usados na análise de margem por produto/serviço (G6).

---

## 5. Entrada de dados — importação de XMLs

> **Quem faz:** Comprador (entrada), Faturista (saída).

### 5.1 Antes de importar

✅ Existe um **período aberto** na filial.
✅ Os XMLs estão em pastas organizadas por **ano/mês** (recomendado, mas não obrigatório).
✅ Você sabe qual filial será usada (o sistema identifica pelo CNPJ no XML).

### 5.2 Importar NF-e em lote (C1)

1. Acesse **Entrada de Dados > Importar > NF-e**.
2. Selecione a **pasta raiz** ou o **ano/mês** específico.
3. O sistema varre a pasta e lista os XMLs com status **"Pendente de validação"**.
4. Para cada XML, o sistema:
   - Valida a estrutura (XML inválido → rejeitado).
   - Verifica se é NF-e cancelada → **"Cancelada — apenas histórico"** (não gera lançamento).
   - Verifica duplicidade (chave) → rejeitado.
   - Verifica se o CNPJ da empresa está no XML → se não, rejeitado.
   - **Identifica a filial** pelo CNPJ. Se não corresponder a nenhuma filial, você escolhe manualmente.
   - Compara a **data de emissão com o período aberto**: dentro → aceito; fora → **aceito com aviso** (você confirma).
5. O sistema exibe o **relatório de pré-validação** (aceitos, aceitos com aviso, canceladas, rejeitados com motivos).
6. Você revisa e **confirma a importação** dos aceitos (e dos "aceitos com aviso").
7. Para cada XML aceito, o sistema:
   - Extrai os dados (chave, data, número, série, emitente, destinatário, CFOP, NCM, CST, valores, impostos).
   - Identifica se é **entrada** (compra) ou **saída** (venda) pela posição do CNPJ da empresa.
   - Cria o **Documento** e os **Lançamentos** vinculados.
   - Submete cada lançamento ao **motor de classificação**.
   - Gera **crédito/débito no razão de impostos**.
   - Gera **contas a pagar** (compra) ou **a receber** (venda).
   - Marca o status: "Classificado automaticamente" ou "Não classificado — requer intervenção".
8. O sistema exibe o **relatório de importação**.
9. Você é direcionado para a **revisão** (seção 7).

### 5.3 Importar NFS-e (C2), CT-e (C3) e RPA (C8)

O fluxo é o mesmo, com particularidades:

**NFS-e:**
- Não tem CFOP nem NCM — tem **código de serviço (LC 116)** e **código municipal**.
- **Prestador** → receita; **tomador** → despesa/custo.
- **Retenções** (ISS, IR, INSS, PIS/COFINS/CSLL) são extraídas e lançadas em contas específicas.
- Se um XML de **RPA** for encontrado na pasta, o sistema redireciona para o fluxo de RPA ou rejeita com aviso claro.

**CT-e:**
- É sempre serviço de transporte.
- **Modalidade de frete** define a classificação:
  - **CIF** (emitente paga): para o vendedor, **despesa variável** (frete sobre venda).
  - **FOB** (destinatário paga): para o comprador, **custo de aquisição** (compõe o custo da mercadoria) ou despesa, conforme o uso.
- Pode estar vinculado a uma NF-e (chave referenciada). Se a NF-e não existir no sistema, o CT-e é importado com aviso e o vínculo pode ser feito depois.

**RPA:**
- É documento próprio (não é NFS-e, não é folha) — pagamento a **autônomo**.
- **Retenções típicas:** INSS (20% regra geral), IRRF, ISS, PIS/COFINS/CSLL.
- Tratado como **despesa ou custo**, conforme a natureza do serviço.

### 5.4 O que pode dar errado (e o que fazer)

| Situação | O que acontece | O que fazer |
| :--- | :--- | :--- |
| Nenhum período aberto | Bloqueia | Abra/fechar período (seção 10). |
| Pasta vazia ou sem XMLs | Informa e encerra | Verifique a pasta. |
| XML corrompido ou ilegível | Rejeitado com motivo | Verifique o arquivo. |
| NF-e cancelada | Registrada apenas para histórico | Nada — é ignorada nos cálculos. |
| Empresa não identificada no XML | Rejeitado | Verifique o CNPJ da empresa/filial. |
| Data de emissão fora do período | Aceito com aviso + confirmação | Confirme se for o caso. |
| Confirmação de data não dada | Fica "Aguardando confirmação" | Confirme na tela de importação. |
| Dados faltantes críticos | "Importado com erro — completar dados críticos" | Resolva a pendência (Erro). |
| Dados faltantes não críticos | "Importado com aviso" | Resolva quando puder (Aviso). |
| Importação interrompida | Retoma do ponto | Reexecute a importação. |

---

## 6. Entrada de dados — digitação manual

### 6.1 Lançamento manual individual (C4)

> **Quem faz:** Contador (ou Operador).

Use quando **não há documento fiscal** (tarifa bancária, rendimento de aplicação, depreciação manual, rateio) ou para **ajustes gerenciais**.

1. Acesse **Entrada de Dados > Lançamento Manual**.
2. **Selecione a filial** (obrigatório).
3. Preencha:
   - **Data de competência** (padrão: hoje; editável).
   - **Descrição da operação** (obrigatório) — ex: "Compra de computador a prazo".
   - **Valor** (obrigatório).
   - **Conta de destino** (sugerida pelo motor com base na descrição e na contraparte).
   - **Forma de contrapartida** (à vista em caixa, à vista em banco X, a prazo, cartão, etc.).
   - **Contraparte** (cliente, fornecedor, funcionário — opcional).
   - **Centro de custo** (sugerido).
   - **Observações** (opcional).
4. Ao digitar a descrição e/ou selecionar a contraparte, o sistema **sugere a conta** e exibe o **"porquê"**.
5. Aceite ou altere a conta. Se alterar, o sistema oferece **criar regra** para futuros lançamentos iguais.
6. Confirme.

**O que o sistema faz sozinho:**
- Valida a data no período aberto.
- Valida a conta analítica, o valor e os campos obrigatórios.
- **Monta as duas pernas automaticamente** (débito na conta de destino, crédito na contrapartida).
- Gera crédito/débito de imposto, se aplicável.
- Registra em auditoria.

**Exemplos de montagem automática:**

| Operação | Conta de destino (débito) | Contrapartida (crédito) |
| :--- | :--- | :--- |
| Compra de computador a prazo | Imobilizado | Contas a Pagar |
| Compra de mercadoria à vista | Estoque / CMV | Caixa |
| Venda de mercadoria a prazo | Contas a Receber | Receita de Vendas |
| Pagamento de fornecedor | Contas a Pagar | Banco |
| Recebimento de cliente | Banco | Contas a Receber |
| Depreciação mensal | Despesa de Depreciação | (-) Depreciação Acumulada |
| Provisão de férias | Despesa de Férias | Provisão de Férias |
| Tarifa bancária | Despesa Financeira | Banco |

### 6.2 Documento fiscal manual (C5)

> **Quem faz:** Comprador (entrada) ou Faturista (saída).

Use quando o **XML não está disponível** (documento de sistema legado, RPA manual, etc.).

1. Acesse **Entrada de Dados > Documento Manual**.
2. Selecione o **tipo**: NF-e, NFS-e, CT-e ou RPA.
3. Preencha o formulário específico com os campos mínimos (data, número, série, chave opcional, contraparte, CFOP/código de serviço, valores, impostos, natureza).
4. O sistema **sugere a conta** com base no tipo, CFOP/código de serviço, contraparte e histórico.
5. Aceite ou altere a conta (se alterar, oferece criar regra).
6. Informe a **forma de contrapartida**.
7. Confirme.

**O que o sistema faz sozinho:**
- Valida a data, os campos obrigatórios, os valores e a contrapartida.
- Cria o **Documento** e os **Lançamentos** em partidas dobradas.
- Gera os lançamentos de impostos e retenções.
- Gera crédito/débito no razão.
- Classifica e marca o status.

### 6.3 Importar folha de pagamento (C6) e digitar folha (C7)

> **Quem faz:** RH.

**Duas situações de cálculo:**
- **Folha real:** se o arquivo trouxer os valores calculados (INSS, FGTS, IRRF, encargos, provisões), o sistema **usa os valores reais**. Não recalcula.
- **Folha simulada/futura:** se o arquivo **não trouxer** os valores calculados, o sistema **calcula** com base nas tabelas vigentes.
- Se o arquivo trouxer **alguns** valores e outros não, o sistema usa os reais onde existirem e calcula os faltantes, com aviso.
- A tela de importação indica claramente qual modo está sendo usado.

**Importar (C6):**
1. Acesse **Entrada de Dados > Importar > Folha de Pagamento**.
2. Selecione o **arquivo** (formato a definir) e o **período de referência**.
3. O sistema lista os funcionários com status "Pendente de validação".
4. Para cada funcionário:
   - Valida se existe no cadastro (se não, **cria automaticamente** com status "Cadastro incompleto").
   - Valida os dados (dados faltantes críticos → Erro; não críticos → Aviso).
   - Compara o período de referência com o período aberto (fora → aviso + confirmação).
5. Confirme a importação.
6. O sistema calcula (ou usa os valores reais) e cria o **Documento de Folha** e os **Lançamentos** em partidas dobradas:
   - **Débito:** Custo ou Despesa de Pessoal (por centro de custo).
   - **Crédito:** Salários a Pagar, INSS a Recolher, FGTS a Recolher, IRRF a Recolher, Provisões a Pagar.
7. Gera crédito/débito no razão (INSS, FGTS, IRRF).

**Digitar manualmente (C7):**
1. Acesse **Entrada de Dados > Folha de Pagamento > Digitar Manualmente**.
2. Selecione a **filial** e o **período de referência**.
3. O sistema exibe a **lista de funcionários ativos** com campos por funcionário (salário base, proventos/descontos, valores reais opcionais, centro de custo).
4. Preencha os dados (ou deixe em branco os que não quiser calcular agora).
5. O sistema **calcula** os valores faltantes.
6. Você pode **revisar** e **sobrescrever** com valores reais (override, com auditoria).
7. Confirme.

> 💡 **Dica:** o **override** de valores calculados é permitido, com justificativa e registro em auditoria.

---

## 7. Classificação automática e revisão

### 7.1 Como o sistema sugere a classificação (D1)

O motor percorre as **fontes de regra em ordem de prioridade**:

| Prioridade | Fonte | Exemplo |
| :--- | :--- | :--- |
| 1 | **Regra específica** | Fornecedor X + CFOP Y → Conta Z |
| 2 | **Regra por CFOP** | CFOP 1102 → Custo > CMV |
| 3 | **Regra por Categoria do Fornecedor** | Categoria "Mercadoria para Revenda" → Custo > CMV |
| 4 | **Regra por NCM** | NCM de combustível → Despesa > Combustível |
| 5 | **Regra por código de serviço (LC 116)** | Código 01.01 → Receita de Serviços |
| 6 | **Regra por histórico/descrição** | "Tarifa bancária" → Despesa Financeira > Tarifas |
| 7 | **Histórico de classificações** | Mesmo fornecedor + mesmo NCM já classificado antes → mesma conta |
| 8 | **Fallback** | Sistema não encontra regra → pergunta a você |

**Conflito de regras:** se duas regras de mesma prioridade apontam para contas diferentes, o sistema **não escolhe sozinho** — marca como **"Conflito de regras — requer intervenção"** e exibe as opções com o "porquê" de cada uma.

**Fallback:** se nenhuma regra se aplica, o sistema sugere uma conta genérica ("Despesa a Classificar") e marca o lançamento como **"Não classificado — requer intervenção"**, registrando uma pendência **Erro** (bloqueia o fechamento até ser classificado).

### 7.2 O "porquê" da sugestão (D2)

Sempre que uma sugestão é apresentada, há um botão **"Por que?"**. Ao clicar, você vê:

- **Conta sugerida.**
- **Regra aplicada** (ex: "Fornecedor ABC + CFOP 1102 → Custo > CMV", prioridade 1 — específica).
- **Contexto considerado** (fornecedor, categoria, CFOP, NCM, etc.).
- **Centro de custo sugerido** e **contrapartida sugerida**.
- **Confiança** (alta/média/baixa).
- **Alternativas consideradas** (opcional).

A justificativa fica **registrada no lançamento** para consulta futura.

### 7.3 Tela de revisão (D3)

> **Quem faz:** Operador / Comprador / Faturista / Contador.

Use após importação, após digitação manual e **antes do fechamento**.

1. Acesse **Revisão > Lançamentos Pendentes**.
2. O sistema exibe a lista de lançamentos que precisam de revisão, com filtros (por status, tipo de documento, período, fornecedor/cliente, valor).
3. Para cada lançamento, a lista mostra: data, documento de origem, contraparte, valor, conta sugerida (com resumo da justificativa), status da classificação, centro de custo sugerido.
4. Selecione um lançamento (ou vários, para ação em lote).
5. O painel de detalhes exibe: dados completos, sugestão do motor, resumo da justificativa + botão "Por que?", e os botões **Aceitar**, **Alterar**, **Rejeitar**.
6. Decida:
   - **Aceitar:** confirma a sugestão. Status vira "Classificado automaticamente — aceito".
   - **Alterar:** abre formulário para escolher outra conta/centro de custo/contrapartida. Ao confirmar, o status vira "Classificado manualmente" e o sistema **pergunta se deseja criar regra** (D4).
   - **Rejeitar:** marca como "Não classificado — requer intervenção" e volta para a fila.
7. O sistema registra a decisão em auditoria.

**Ações em lote:**
- **"Aceitar todos os de confiança alta"**.
- **"Aceitar selecionados"**.
- **"Ver justificativas em lote"**.

**Reclassificação:** você pode reabrir um lançamento já classificado e mudar novamente, com auditoria. Permitida **apenas antes do fechamento do período**.

### 7.4 Aprendizado e criação de regras (D4)

Quando você **altera** uma sugestão, o sistema exibe um modal:

> "Deseja criar uma regra para classificar automaticamente lançamentos futuros com este mesmo contexto?"

Ele mostra o **contexto identificado** (ex: Fornecedor ABC + CFOP 1102), a **conta escolhida** e a **prioridade sugerida**. Você pode:

- **Criar regra com este contexto.**
- **Criar regra com contexto mais amplo** (ex: só o fornecedor, só o CFOP).
- **Criar regra com contexto mais restrito** (ex: fornecedor + CFOP + NCM).
- **Não criar regra** (a alteração fica só para este lançamento).

**O sistema não cria regras sozinho** — ele sugere e só cria se você confirmar. Isso evita que uma correção pontual vire regra geral e contamine classificações futuras.

> 💡 **Regra em lote:** se você alterou vários lançamentos com o **mesmo contexto** (ex: 10 itens do mesmo fornecedor com mesmo CFOP), o sistema oferece criar **uma regra única** que cobre todos.

### 7.5 Gestão de regras pelo Contador (D5)

> **Quem faz:** Contador.

Acesse **Configuração > Regras de Classificação**. Você vê a lista de regras com descrição, contexto, conta de destino, prioridade (1 a 8), status (ativa/inativa), origem (manual/aprendida), data de criação e último uso.

Filtros: por prioridade, status, origem, fornecedor, CFOP, NCM, categoria, código de serviço, conta de destino, "nunca usada".

Você pode:
- **Criar** nova regra.
- **Editar** regra existente.
- **Ativar/desativar** regra (desativação não apaga — fica para auditoria).
- **Ajustar a prioridade** (dentro da faixa 1 a 8; subprioridades ficam para a fase 2).
- **Testar** uma regra: simular um lançamento e ver qual regra seria aplicada.

Toda alteração é registrada em auditoria (quem, quando, o que mudou).

> ⚠️ **Atenção:** apenas o **Contador** (com permissão) pode criar, editar, desativar ou ajustar prioridade de regras.

---

## 8. Cálculos automáticos

### 8.1 Impostos sobre compras (E1) e vendas (E2)

> **Quem faz:** o sistema calcula automaticamente ao criar o documento. O Contador pode revisar/override.

**O que o sistema calcula:**

| Imposto | Compra (comprador) | Venda (vendedor) |
| :--- | :--- | :--- |
| **ICMS** | Crédito (se o regime permitir) | Débito (a recolher) |
| **IPI** | Crédito (se o regime permitir) | Débito (a recolher, quando aplicável) |
| **PIS** | Crédito (Lucro Real não cumulativo) | Débito (a recolher) |
| **COFINS** | Crédito (Lucro Real não cumulativo) | Débito (a recolher) |
| **ISS** | Crédito (se retido ou se o regime permitir) | Débito (a recolher) |
| **IBS (2026)** | Crédito informativo (0,1%) | Débito informativo (0,1%) |
| **CBS (2026)** | Crédito informativo (0,9%) | Débito informativo (0,9%) |
| **Retenções** | Débito a recolher (em nome do prestador) | Crédito a recuperar |

**Particularidades:**
- **Regime fiscal** influencia tudo (Simples, Presumido, Real).
- **Simples Nacional** tem tratamento específico: **DAS unificado**, alíquota efetiva sobre a receita, faixa pela **receita acumulada de 12 meses** (LC 123).
- **ICMS-ST** usa o **valor informado no XML** (não recalcula). O valor da ST **compõe o custo** (não é recuperável).
- **Divergência** entre o valor do XML e o calculado gera **aviso**, com opção de **override** (com justificativa e auditoria).

**No DRE:**
- Impostos sobre venda aparecem como **dedução da receita** (receita líquida já calculada).
- O valor do documento de compra no DRE é **líquido de créditos recuperáveis**.

### 8.2 Consolidação do cálculo de folha (E3)

> **Quem faz:** o sistema consolida; o Contador valida.

A folha já foi calculada em C6/C7. O E3 **consolida** os resultados e integra aos relatórios. Ele:

- Separa por **centro de custo** e por **natureza** (custo vs. despesa fixa).
- Integra ao **razão de impostos**: INSS, FGTS e IRRF → débito a recolher.
- Integra ao **DRE**: custo de pessoal (operacional) → grupo 3 (Custos); despesa de pessoal (administrativo) → grupo 4.1 (Despesas Fixas); provisões → mesma alocação.
- **Valida** se a soma dos lançamentos individuais bate com o total.
- Exibe o **resumo consolidado** (por centro de custo, natureza, tipo de encargo).

> 💡 **Override** é permitido, com justificativa e auditoria.

### 8.3 Cálculo de depreciação (E4)

> **Quem faz:** o sistema calcula; o Contador pode revisar/override.

Mensalmente (ou no fechamento), o sistema:

- Identifica os ativos cujo **mês inicial da depreciação** é igual ou anterior ao período aberto e que ainda têm valor depreciável.
- Calcula a **depreciação mensal** = (Valor Original − Valor Residual) ÷ (Vida Útil em meses).
- Calcula a **depreciação acumulada** e o **valor contábil líquido**.
- Gera os lançamentos:
  - **Débito:** Despesa de Depreciação ou Custo de Depreciação (conforme destino).
  - **Crédito:** (-) Depreciação Acumulada.
- Aloca por **centro de custo** (conforme cadastro do ativo).
- Integra ao DRE (custo ou despesa).

**Regras:**
- **Método linear** é o padrão.
- A depreciação **não ultrapassa** o valor depreciável.
- Ativo totalmente depreciado **não gera novos lançamentos**.
- **Depreciação acelerada** (simulação fiscal) é calculada em paralelo, sem afetar o DRE real. **Fase 2.**

### 8.4 Consolidação de provisões de férias e 13º (E5)

> **Quem faz:** o sistema calcula; o Contador pode revisar/override.

Mensalmente (padrão) ou no fechamento, o sistema:

- Calcula a **provisão de férias** = (salário base + proventos com flag "entra férias") ÷ 12 × (1 + 1/3).
- Calcula a **provisão de 13º** = (salário base + proventos com flag "entra 13º") ÷ 12.
- Calcula os **encargos sobre provisões** (INSS patronal + FGTS).
- Gera os lançamentos:
  - **Débito:** Custo ou Despesa de Provisões (conforme centro de custo do funcionário).
  - **Crédito:** Provisões a Pagar (separando férias, 13º e encargos).
- Integra ao **razão de impostos** os encargos sobre provisões (débito a recolher **no momento da provisão**, regime de competência).
- Exibe o **resumo das provisões** (por funcionário, centro de custo, natureza).

**Regras:**
- A base de cálculo considera as **flags de incidência** do cadastro de proventos/descontos.
- **Reversão** de provisões (férias gozadas, 13º pago) é tratada na **fase 2**.

---

## 9. Financeiro — contas a pagar e a receber

### 9.1 Gerar contas a pagar a partir de compras (F1)

> **Quem faz:** o sistema gera automaticamente ao criar o documento de compra. O Financeiro1 processa.

**O que o sistema faz sozinho:**
- Identifica o valor total, as retenções (se houver) e o valor líquido a pagar ao fornecedor.
- Identifica a forma de pagamento (à vista, a prazo, cartão) e o prazo padrão do fornecedor.
- Gera as contas:
  - **À vista:** lançamento em Caixa/Banco (não gera conta a pagar).
  - **A prazo (parcela única):** uma conta com vencimento calculado.
  - **A prazo (parcelado):** N contas com vencimentos calculados.
  - **Cartão:** uma conta com vencimento na data da fatura (configurável).
- Gera também as **contas a recolher** (retenções), se houver.
- Valida se a soma das contas + retenções = valor bruto do documento.
- Exibe o **resumo das contas geradas**.

**Regras:**
- O valor líquido a pagar = valor bruto − retenções.
- Retenções geram **contas a recolher** (Passivo), não contas a pagar ao fornecedor.
- Vencimentos **não podem ser retroativos** ao período fechado.
- O operador pode **ajustar** vencimentos e parcelas antes de confirmar.

### 9.2 Gerar contas a receber a partir de vendas (F2)

> **Quem faz:** o sistema gera automaticamente ao criar o documento de venda. O Financeiro2 processa.

O fluxo é o **espelho** do F1, mas do lado da venda:

- **À vista:** lançamento em Caixa/Banco (não gera conta a receber).
- **A prazo:** contas a receber com vencimentos.
- **Cartão:** conta a receber com vencimento na **data do repasse da operadora** (configurável — fase 2 para prazos específicos).
- **Retenções sofridas:** o valor líquido a receber é menor que o bruto; as retenções geram **contas a recuperar** (Ativo), integradas ao razão.

### 9.3 Registrar baixa de contas a pagar/receber (F3)

> **Quem faz:** Financeiro1 (pagar) ou Financeiro2 (receber). O Gerente Financeiro valida a saída/entrada de caixa/banco.

1. Acesse **Financeiro > Contas a Pagar** (ou **Contas a Receber**).
2. O sistema exibe a lista de contas em aberto, com filtros.
3. Selecione uma conta (ou várias, para baixa em lote).
4. O formulário de baixa exibe:
   - Valor da conta.
   - Data de vencimento.
   - **Data do pagamento/recebimento** (padrão: hoje).
   - **Valor pago/recebido** (padrão: valor da conta; editável para baixa parcial).
   - **Juros e multa** (calculados automaticamente se a data for após o vencimento; editáveis).
   - **Desconto** (opcional; editável).
   - **Forma de pagamento/recebimento**.
   - Observações.
5. Confirme.

**O que o sistema faz sozinho:**
- Valida a data no período aberto e a consistência dos valores.
- Registra a baixa:
  - **Contas a pagar:** débito em Contas a Pagar, crédito em Caixa/Banco. Juros/multa → despesa financeira. Desconto → receita financeira.
  - **Contas a receber:** débito em Caixa/Banco, crédito em Contas a Receber. Juros/multa → receita financeira. Desconto → despesa financeira.
- Atualiza o status da conta (Baixada ou Parcialmente baixada).
- Integra ao **fluxo de caixa** e ao **razão de impostos** (retenções pagas/recebidas).
- Registra em auditoria.

**Recursos:**
- **Baixa em lote:** várias contas do mesmo fornecedor/cliente (fase 1).
- **Baixa parcial:** o saldo restante permanece em aberto.
- **Estorno de baixa:** permitido, com auditoria; a conta volta ao status anterior.

### 9.4 Consultar posição de caixa e bancos (F4)

> **Quem faz:** Administrador (consulta) e Financeiro1/2 (consulta).

1. Acesse **Financeiro > Posição de Caixa**.
2. O sistema exibe a **posição atual**:
   - Saldo de Caixa + saldo de Bancos + Aplicações − Contas a pagar em aberto + Contas a receber em aberto.
3. O sistema exibe o **fluxo de caixa projetado**:
   - Por dia (próximos 30 dias) ou por semana/mês (próximos 12 meses).
   - Entradas previstas, saídas previstas, saldo acumulado.
   - Gráfico de linha ou barras.
4. Filtros: por período, conta, fornecedor/cliente, tipo, centro de custo, filial.
5. Clique em um item para ver os detalhes (quais contas compõem aquele valor).
6. O sistema exibe **alertas**: contas vencidas, saldo negativo projetado, concentração de vencimentos.

> 💡 **Estimativas:** contas sem valor ou sem vencimento podem receber "valor aproximado" e/ou "vencimento aproximado", marcados como **estimativas**. Esses valores são usados **apenas nas simulações (H)** e em projeções gerenciais, **nunca** nos relatórios reais.

---

## 10. Fechamento de período

> **Quem faz:** Contador prepara; Auditor valida; Contador fecha.

1. Acesse **Configuração > Período > Fechar**.
2. Selecione a filial (ou "todas as filiais").
3. O sistema executa o **checklist de pendências**:
   - Se houver **Erros** não resolvidos: **bloqueia** e lista os erros.
   - Se houver apenas **Avisos**: exibe e pede **confirmação explícita**.
4. O sistema consolida folha (E3), depreciação (E4) e provisões (E5) se não foram lançadas.
5. **O sistema envia a consolidação para o Auditor validar.**
6. Se o Auditor **aprovar**, o Contador confirma o fechamento:
   - O período é **congelado** (status = "Fechado").
   - O sistema **abre automaticamente o próximo período** no estado **Aberto**.
   - O sistema registra auditoria (quem fechou, quando, pendências existentes, confirmações).
   - O sistema exibe o resumo do fechamento.
7. Se o Auditor **reprovar**, o Contador corrige e o Auditor revalida.

> ⚠️ **Atenção:** depois de fechado, o período **não pode ser reaberto**. Se algo precisar ser incluído retroativamente, entra no **período aberto atual**; a data de emissão original fica registrada como atributo do documento.

---

## 11. Relatórios gerenciais

> **Quem faz:** Administrador (principal), Contador, Auditor (conforme permissões).
>
> **Os relatórios 11.1 a 11.7 são os originais (G1–G7).** Os relatórios **11.8 a 11.15** foram adicionados na v1.4 (G8–G15) e cobrem a **visão geral da empresa**: posição patrimonial, diagnóstico, risco de caixa, passivos, ponto de equilíbrio e resumo executivo.
>
> **Onde encontrar:** menu **Administrador**, itens **3.1 a 3.17**.

### 11.1 DRE gerencial por período (G1)

Acesse **Relatórios > DRE Gerencial**. Selecione o período (mês/ano ou intervalo). O sistema consolida os lançamentos e exibe o DRE com a estrutura:

```text
1. RECEITA BRUTA
   1.1 Venda de Mercadorias
   1.2 Prestação de Serviços
   1.3 Outras Receitas Operacionais
2. (-) DEDUÇÕES DA RECEITA
   2.1 Impostos sobre Vendas (PIS, COFINS, ICMS, ISS, IBS, CBS)
   2.2 Devoluções e Abatimentos
3. = RECEITA LÍQUIDA
4. (-) CUSTOS
   4.1 CMV (Comércio)
   4.2 Custo de Serviços (Serviços)
5. = LUCRO BRUTO
6. (-) DESPESAS OPERACIONAIS
   6.1 Despesas Fixas
   6.2 Despesas Variáveis
   6.3 Despesas Não Operacionais
7. = LUCRO OPERACIONAL
8. (+/-) RESULTADO FINANCEIRO
   8.1 Receitas Financeiras
   8.2 (-) Despesas Financeiras
9. = LUCRO ANTES DO IR/CSLL
10. (-) IR/CSLL (estimativa gerencial)
11. = LUCRO LÍQUIDO
```

**Recursos:**
- Valores por linha e percentual sobre a receita líquida (análise vertical).
- Comparação com o período anterior e com o mesmo período do ano anterior.
- **Drill-down:** clique em uma linha para ver os lançamentos que a compõem.
- Filtros: por filial, centro de custo, unidade de negócio, tipo de receita/despesa.
- **Exportação** (Excel/PDF).

> ⚠️ **Avisos:** se houver lançamentos não classificados no período, o DRE pode estar incompleto — o sistema avisa. DRE parcial (período aberto) é permitido, com aviso.

### 11.2 DRE por centro de custo (G2)

Mesma estrutura do DRE total, **segmentada por centro de custo**.

- Lançamentos sem centro de custo aparecem em **"Não alocado"** (ou são rateados conforme regra).
- A soma dos DREs por centro + "Não alocado" = DRE total (G1).
- **Rateio de despesas indiretas:** fase 1 com percentual fixo; fase 2 com critérios avançados.
- **Agrupamento por área de negócio:** fase 1.

### 11.3 Resumo por área (G3)

Visão **executiva** consolidada por **área de negócio** (Comercial, Operações, Administrativo, etc.).

- **Cards por área:** receita, custos, despesas (fixas + variáveis), resultado, margem, % sobre a receita total, comparação com o período anterior.
- **Consolidado da empresa**.
- **Drill-down** para G2.
- Filtros por período e por área.
- **Exportação**.
- É o **dashboard inicial** do Administrador (configurável).

### 11.4 Fluxo de caixa projetado — visão gerencial (G4)

Diferente do F4 (operacional, curto prazo), o G4 é **gerencial** (médio/longo prazo):

- **Horizonte:** até 12 meses (configurável).
- **Granularidade:** diária, semanal ou mensal (fase 1).
- **Inclusão de estimativas:** contas com valor/vencimento aproximado (F4, RN11) podem ser incluídas, com ressalva.
- **Comparação com realizado** (períodos passados) — fase 1.
- **Cenários** (otimista, realista, pessimista) — fase 2 (integra com H).
- Filtros por conta, centro de custo, categoria, tipo.
- **Drill-down** por categoria, área e conta.
- **Exportação**.

### 11.5 Análise de custos por fornecedor/categoria (G5)

Duas visões principais:

- **Por fornecedor:** fornecedor, valor gasto, % do total, nº de documentos, variação vs. período anterior.
- **Por categoria:** categoria, valor gasto, % do total, variação vs. período anterior.

**Recursos:**
- Top N (10 padrão, configurável).
- Análise de concentração (gráfico de pizza) — fase 1.
- Evolução temporal (gráfico de linha) — fase 1.
- Comparação entre períodos.
- **Drill-down** por documento.
- **Exportação**.

> 💡 Fornecedor sem categoria aparece como **"Sem categoria"** (Aviso).

### 11.6 Margem por cliente/produto (G6)

Duas visões:

- **Por cliente:** receita, custos diretos, despesas variáveis, margem de contribuição, margem líquida (se rateio configurado), % sobre o total.
- **Por produto/serviço:** receita, custo direto, margem de contribuição, % sobre o total.

**Recursos:**
- Top N (os 10 mais e os 10 menos rentáveis).
- Análise de concentração (pizza).
- Evolução temporal (linha).
- Comparação entre períodos.
- **Drill-down** por documento.
- **Clientes/produtos com prejuízo** são destacados.
- **Exportação**.

**Regras:**
- Custos diretos atribuídos ao produto/serviço (CMV ou custo de serviço).
- Despesas variáveis atribuídas ao cliente/produto quando houver vínculo.
- **Despesas fixas** podem ser rateadas — **fase 2**.
- Se o documento não tiver itens, a margem por produto não é calculada (apenas por cliente) — o sistema avisa.
- Produto/serviço sem custo atribuído aparece como **"sem custo"** (Aviso).
- O CMV usa o método de custo definido em `empresa.metodo_custo` (XML, Médio ou Manual).

### 11.7 Exportação de relatórios (G7)

Em qualquer relatório (G1–G15), clique em **"Exportar"** e escolha:

- **Formato:** Excel (.xlsx), PDF (.pdf), CSV (.csv).
- **Incluir drill-down** ou apenas o resumo.
- **Nome do arquivo** (sugestão automática).

A exportação respeita os **filtros aplicados** e é registrada em auditoria.

> 💡 **Exportação em lote, agendamento e formato específico para contador** são fase 2.

### 11.8 Balanço Patrimonial (G8)

> **Quem faz:** Administrador (principal), Controller (valida), Operador (consulta).
> **Menu:** 3.10

Apresenta a **posição patrimonial** da empresa em uma data: **Ativo** (Circulante + Não Circulante), **Passivo** (Circulante + Não Circulante) e **Patrimônio Líquido**.

1. Acesse **Relatórios > Balanço Patrimonial**.
2. Selecione a **data de corte** (padrão: último dia do período fechado mais recente; ou período aberto, com aviso).
3. O sistema consolida os saldos e exibe o Balanço com **análise vertical** (% de cada conta sobre o Ativo total).
4. O sistema **valida a equação patrimonial** (Ativo = Passivo + PL). Se não fechar, mostra a diferença em R$ — mas **não bloqueia** (é gerencial).
5. Você pode **filtrar** por filial e **exportar**.

**Recursos:**
- Balanço comparativo (duas datas lado a lado).
- Balanço consolidado (multi-filial).
- **Drill-down** por conta (clique e veja os lançamentos).
- Balanço do período aberto (dados parciais, com aviso).

> ⚠️ **Atenção:** se houver lançamentos não classificados, o Balanço pode estar distorcido — o sistema avisa.

### 11.9 Painel Executivo (G9)

> **Quem faz:** Administrador.
> **Menu:** 3.11

**Tela única** com **15 KPIs** em 4 blocos (Resultado, Liquidez, Endividamento, Rentabilidade e Eficiência), cada um com **valor**, **variação vs. período anterior**, **semáforo** (verde/amarelo/vermelho) e **drill-down** para o relatório detalhado.

1. Acesse **Relatórios > Painel Executivo** (ou é o **dashboard inicial** do Administrador, no lugar da Tela Inicial).
2. Selecione o **período** (padrão: mês corrente).
3. O sistema consolida e exibe os KPIs em cards.
4. **Alertas** no topo (ex: "Inadimplência > 10%", "Caixa projetado negativo em 15 dias").
5. Você pode **filtrar** por filial e **exportar**.

**KPIs por bloco:**
- **Resultado:** receita líquida, lucro líquido, margem líquida, margem bruta.
- **Liquidez:** saldo de caixa, liquidez corrente, capital de giro líquido, ciclo de caixa.
- **Endividamento:** endividamento geral, composição do endividamento, grau de alavancagem.
- **Rentabilidade:** ROE, ROA, ponto de equilíbrio, margem de segurança.

**Recursos:**
- Comparação com período anterior e mesmo período do ano anterior.
- Ordenar por criticidade (pior primeiro).
- Ocultar KPIs irrelevantes (fase 2).
- **Drill-down** por card.

> 💡 **Faixas do semáforo** são padrão na fase 1; configuráveis na fase 2.

### 11.10 Aging de Contas (G10)

> **Quem faz:** Administrador (principal), Financeiro1/2 (consulta), Controller (valida).
> **Menu:** 3.12

Mostra o **envelhecimento** (aging) das contas a receber e a pagar, por faixa de atraso/vencimento.

**Contas a receber (por faixa de atraso):**
- A vencer.
- 1–30 dias.
- 31–60 dias.
- 61–90 dias.
- > 90 dias.

**Contas a pagar (por faixa de vencimento):**
- A vencer (próximos 30 dias).
- Vencidas 1–30 dias.
- Vencidas 31–60 dias.
- Vencidas > 60 dias.

**Indicadores:**
- **Inadimplência %** (contas vencidas / total a receber).
- **Prazo médio de recebimento (PMR).**
- **Prazo médio de pagamento (PMP).**
- **Concentração** (top 5 clientes/fornecedores).

**Recursos:**
- Aging por cliente / por fornecedor.
- **Drill-down** por faixa (clique e veja as contas).
- Comparação entre períodos.
- **Exportação**.

> 💡 **Faixas de aging** são padrão na fase 1; configuráveis na fase 2.

### 11.11 Posição de Impostos (G11)

> **Quem faz:** Administrador (principal), Controller (valida), Contador (consulta).
> **Menu:** 3.13

Mostra, por tipo de imposto, o **saldo devedor** (o que a empresa deve) e o **saldo credor** (o que tem a recuperar).

**Por tipo:** ICMS, PIS, COFINS, ISS, IPI, INSS, FGTS, IRRF, IBS, CBS, etc.
- Total de débitos.
- Total de créditos.
- **Saldo** (devedor ou credor).

**Indicadores:**
- **Carga tributária efetiva** (impostos sobre vendas / receita bruta).
- **Saldo devedor total.**
- **Saldo credor total.**
- **Evolução mensal** (gráfico de linha por tipo).

**Recursos:**
- **Drill-down** por documento (clique no tipo e veja as notas).
- Comparação entre filiais.
- **Exportação**.

> ⚠️ **Aviso obrigatório:** "Este relatório é **gerencial**. Não substitui apuração fiscal oficial."

### 11.12 Posição de Pessoal (G12)

> **Quem faz:** Administrador (principal), RH (consulta), Controller (valida).
> **Menu:** 3.14

Mostra o **custo total de pessoal** e o **passivo oculto** (provisões).

**Indicadores:**
- **Custo total de pessoal** (bruto + INSS patronal + FGTS + RAT + Terceiros + provisões).
- **Peso sobre a receita** (%).
- **Provisões acumuladas** (férias + 13º + encargos) — o passivo oculto.
- **Headcount** (funcionários ativos) e **custo médio por funcionário**.
- **Custo de pessoal por área** (centro de custo / área de negócio).

**Recursos:**
- Evolução mensal (gráfico).
- **Drill-down** por área (clique e veja os funcionários).
- Comparação entre filiais.
- **Exportação**.

> 💡 **Provisões acumuladas** são o dinheiro que já é dos funcionários mas ainda não saiu — parte do passivo que não aparece no DRE.

### 11.13 Posição de Ativos (G13)

> **Quem faz:** Administrador (principal), Controller (valida), Contador (consulta).
> **Menu:** 3.15

Mostra o **valor contábil líquido** dos ativos, a **depreciação acumulada** e a **projeção de depreciação futura**.

**Por ativo:**
- Valor original.
- Depreciação acumulada.
- **Valor contábil líquido** (valor original − depreciação acumulada).
- Depreciação do período.
- Vida útil remanescente.
- Status (em uso, ocioso, alienado).
- Centro de custo.

**Indicadores:**
- Total do imobilizado (valor contábil líquido).
- Depreciação acumulada total.
- Depreciação do período.
- **Projeção de depreciação** dos próximos 12 meses.

**Recursos:**
- **Drill-down** por ativo (clique e veja o histórico de depreciação).
- Ativos por status.
- Comparação entre filiais.
- **Exportação**.

> 💡 **Projeção de depreciação** ajuda a planejar o fluxo de caixa dos próximos meses.

### 11.14 Ponto de Equilíbrio (G14)

> **Quem faz:** Administrador (principal), Controller (valida).
> **Menu:** 3.16

Mostra **quanto a empresa precisa faturar para não ter prejuízo**.

**Cálculos:**
- **Custos fixos** (contas com subtipo Fixo).
- **Custos variáveis** (contas com subtipo Variável).
- **Margem de contribuição** (receita − custos variáveis) e %.
- **Ponto de equilíbrio contábil** = custos fixos / margem de contribuição %.
- **Ponto de equilíbrio financeiro** = (custos fixos − depreciação) / margem de contribuição %.
- **Margem de segurança** = (receita atual − PE) / receita atual.

**Recursos:**
- Gráfico **receita × custos**, com o ponto de equilíbrio destacado.
- Comparação entre períodos.
- **Exportação**.

> 💡 **Margem de segurança** é o quanto a receita pode cair sem prejuízo. Se estiver abaixo de 10%, é sinal de atenção.

> ⚠️ **Atenção:** se a margem de contribuição for **negativa**, o sistema **bloqueia** o cálculo (a receita não cobre nem os custos variáveis). Reveja preços ou custos.

### 11.15 Resumo Executivo (G15)

> **Quem faz:** Administrador.
> **Menu:** 3.17

**Uma página** que o administrador lê em 2 minutos e entende "como está a empresa".

**Estrutura:**
- **Destaques do período:** receita, lucro, margem (com variação); caixa, liquidez; endividamento; ciclo de caixa.
- **Top 3 riscos** (com severidade: alto/médio/baixo).
- **Top 3 oportunidades.**
- **Ações sugeridas** (indicações — não são executadas pelo sistema).

**Recursos:**
- **Drill-down** para o relatório detalhado de cada destaque/risco.
- **Exportação** em PDF (o formato natural para 1 página).
- Regras de risco/oportunidade configuráveis (fase 2).

> 💡 **O Resumo Executivo não substitui os relatórios detalhados** — é um resumo, não uma análise.

> ⚠️ **Ações sugeridas** são **indicações** do sistema. A decisão é sempre do administrador.

### 11.16 Conselheiro (3.18)

> **Quem faz:** Administrador (principal), Contador (sugestões fiscais).
> **Menu:** 3.18

O **Conselheiro** é um agente que analisa os dados do sistema e sugere **melhorias acionáveis** ao gestor. Cada sugestão tem:

- **Dado que fundamenta** (números, comparações).
- **Ação concreta** (o que fazer).
- **Impacto estimado** (R$, % ou alto/médio/baixo).

**O que ele analisa:**

- **Rentabilidade:** margem por cliente/produto, receita, área.
- **Custos:** custo por fornecedor/categoria, variação.
- **Caixa:** fluxo projetado, inadimplência, concentração.
- **Impostos:** peso dos impostos, créditos, regime.
- **Eficiência:** despesas fixas vs. variáveis, custo por funcionário, ativos.
- **Risco:** concentração de clientes/fornecedores, dependência de produto, saldo negativo.

**Como usar:**

1. Acesse **Administrador > Conselheiro** (3.18) ou clique em "Ver todas" no card do dashboard.
2. Veja as sugestões agrupadas por prioridade (Alta / Média / Baixa).
3. Para cada sugestão:
   - **Ver dados:** abre um modal com os dados que fundamentam a sugestão.
   - **Ir para [tela]:** navega para a tela onde você pode agir.
   - **Marcar como lida:** move a sugestão para "Sugestões lidas".
4. Use os filtros (período, filial, área, prioridade).
5. Clique em "Analisar novamente" para recalcular com os dados mais recentes.

**Card no dashboard (Tela Inicial do Administrador):**

No dashboard do Administrador, há um card "Sugestões do Conselheiro" com as **3 primeiras sugestões de alta prioridade** + "Ver todas".

**O que o Conselheiro NÃO é:**

- Não opera (não altera dados, não paga contas).
- Não decide (sugere, o gestor decide).
- Não substitui o Contador, o Auditor ou o Administrador.
- Não promete resultado (impacto é estimativa).
- Não notifica (fase 1).
- Não tem metas configuráveis (fase 2).

**Limitações (fase 2):**

- Metas configuráveis (ex: margem mínima 20%).
- Benchmarks (comparação com o setor).
- Machine learning (aprender com as decisões do gestor).
- Notificações (e-mail, sino).
- Permissões por área (gestor de área vê só a sua área).

---

## 12. Simulação de cenários (fase 2)

> ⚠️ **Este módulo é fase 2.** A estrutura está prevista, mas a lógica completa será implementada depois. O que segue é uma visão geral do que está planejado.

### 12.1 Criar cenário (H1)

- Escolha o **período base**, o **escopo** (padrão: tudo) e a **filial** (ou consolidado).
- O sistema cria um **snapshot isolado** dos dados reais.
- O cenário é **imutável** após criado — para atualizar, crie um novo.
- Alterações no cenário **não afetam** os dados reais.

### 12.2 Ajustar variáveis (H2)

Variáveis agrupadas por categoria:

- **Receita:** variação de preço (%), variação de volume (%), ajuste por produto/cliente.
- **Custos:** variação de custo de compra (%), ajuste por fornecedor/produto.
- **Pessoal:** variação salarial (%), contratação/demissão, ajuste por funcionário.
- **Impostos:** alteração de alíquota (%), mudança de regime fiscal.
- **Ativos:** inclusão/exclusão, alteração de vida útil.
- **Financeiro:** alteração de taxa de juros, prazo.
- **Outros.**

Ajuste por percentual ou valor absoluto, global ou por item. Recálculo **sob demanda** (botão "Recalcular") na fase 1.

### 12.3 Recalcular e comparar (H3)

O sistema recalcula o cenário e exibe o **resultado comparativo** (cenário ajustado vs. cenário base), com:

- Comparação lado a lado do DRE.
- **Destaque das maiores diferenças.**
- **Ranking de impacto das variáveis** (quais mais contribuíram para a diferença).
- Indicadores-chave: lucro líquido, margem bruta, margem líquida, ponto de equilíbrio, fluxo de caixa final.
- Gráficos comparativos.

### 12.4 Salvar cenário (H4) e comparar cenários salvos (H5)

- **Salvar:** nome, descrição, observações. O cenário salvo é **imutável** e mantém os resultados calculados no momento do salvamento.
- **Comparar dois cenários salvos:** metadados, variáveis ajustadas, DRE comparativo, fluxo de caixa, indicadores-chave. As maiores diferenças são destacadas.
- **Exportação** do comparativo.

> ⚠️ **Aviso:** a simulação trabalha sobre **snapshot isolado** dos dados reais; **nunca altera dados reais**. Nenhuma pendência bloqueia a fase 1.

---

## 13. Administração

### 13.1 Usuários e permissões (I1 / I4)

> **Quem faz:** Configurador.

1. Acesse **Administração > Usuários**.
2. O sistema exibe a lista de usuários ativos.
3. Cadastre novo usuário: nome, email, senha inicial, **tags de ator** (por filial).
4. Você pode atribuir **tags por filial** (na tabela `usuario_ator`): o usuário pode ser Comprador na filial A e Financeiro na B.
5. O sistema valida (email único, senha forte, tags válidas).
6. O sistema cria o usuário e registra em auditoria.

**Regras:**
- **Não existe "perfil de acesso" separado.** A tag do ator funcional define o que o usuário pode fazer.
- Se o usuário tem a tag **`configurador`**, **não precisa** de outras tags (acesso total).
- **Administrador:** acesso global (todas as filiais).
- **Operador/Controller:** acesso conforme `usuario_ator`.
- Email é único no sistema.
- Senha é armazenada como hash (nunca em texto puro).
- Desativação não apaga o usuário — apenas impede o acesso.
- Toda alteração é registrada em auditoria.

**Recursos:**
- **Editar** usuário (nome, email, tags, filiais).
- **Desativar** usuário (soft delete).
- **Resetar senha** (gera nova senha temporária).

### 13.2 Atualização de parâmetros (I2)

> **Quem faz:** Configurador (base) + Contador (fiscais) + RH (trabalhistas).

1. Acesse **Administração > Parâmetros**.
2. Selecione a tabela (INSS, IRRF, encargos, alíquotas de tributos) e o **período de vigência**.
3. Edite os valores (faixas, alíquotas, deduções) ou importe de arquivo.
4. O sistema valida (faixas contínuas, alíquotas dentro do intervalo, vigência sem sobreposição).
5. Salve.

**Regras:**
- Tabelas **trabalhistas** são universais e **não adaptáveis** (federais).
- Tabelas **fiscais** são universais, mas **adaptáveis por empresa** (tributos estaduais/municipais, benefícios).
- **Vigência por período** (data inicial e final de validade).
- Faixas contínuas (sem lacunas).
- Alíquotas dentro do intervalo válido.
- Vigência sem sobreposição.
- Toda alteração é registrada em auditoria.
- Alteração de parâmetros **não afeta** cálculos já realizados em períodos fechados.

### 13.3 Auditoria (I3)

> **Quem faz:** Configurador e Auditor.

1. Acesse **Administração > Auditoria**.
2. O sistema exibe a lista de eventos, com filtros:
   - Por usuário.
   - Por período (data inicial/final).
   - Por tipo de ação (criação, edição, exclusão, fechamento, override, etc.).
   - Por tabela (lançamento, nota_fiscal, regra_classificacao, etc.).
   - Por filial.
3. Selecione um evento e veja os detalhes:
   - Quem fez, quando, o quê, justificativa.
   - Dados anteriores e novos (quando aplicável).
   - IP.
4. Você pode **exportar** o log (Excel/PDF).

**Regras:**
- O log registra: usuário, data/hora, ação, tabela, ID do registro, dados anteriores, dados novos, justificativa (quando exigida), IP.
- O log é **imutável** (não pode ser editado ou excluído).
- Apenas usuários com permissão de administração podem consultar o log.

### 13.4 Ativar/desativar handoff (I5)

> **Quem faz:** Configurador.

1. Acesse **Configuração > Handoff** (ou dentro de **Administração > Parâmetros**).
2. Ative ou desative o handoff **por empresa**.
3. O sistema registra a mudança em auditoria.

> 💡 **Handoff por filial** é fase 2. Na fase 1, a configuração é única para todas as filiais da empresa.

### 13.5 Ordens — a fila única de trabalho

> **Quem usa:** todos os atores.
> **Onde fica:** menu **Meu Trabalho** (Caixa de Entrada, Caixa de Saída, Histórico) — números **1.1, 1.2, 1.3**.
> **Regra de ouro:** não há tarefa fora da caixa de entrada. Tudo que precisa ser feito chega até você como uma **ordem**.

#### 13.5.1 O que é uma ordem

Uma **ordem** é o documento que materializa uma tarefa no sistema. Ela carrega:

- **Quem a emitiu** (ator de origem).
- **Quando** (data de criação).
- **O que fazer** (tipo de ordem — ver 13.5.3).
- **Para quem vai** (ator de destino).
- **O documento de origem** (NF-e, conta, folha, período, parâmetro).

Pense no sistema como se não houvesse computador: cada ator **assina** a sua ordem e **gera uma nova ordem** para o próximo setor. A ordem é o "papel assinado" do fluxo (handoff).

#### 13.5.2 Onde encontrar suas ordens

| Onde | O que mostra |
| :--- | :--- |
| **Caixa de Entrada** | Ordens pendentes e em andamento (o que você precisa fazer). Urgentes destacadas. |
| **Caixa de Saída** | Ordens que você emitiu e ainda estão pendentes/em andamento (acompanhamento). |
| **Histórico** | Ordens concluídas e canceladas (consulta). |

**Filtros disponíveis na caixa de entrada:** tipo de ordem, urgente, ator de origem, período, status (pendente/em andamento), **pendências (T6)**.

**Filtro "Pendências":** mostra as ordens de resolução de pendência (O9, O11) atribuídas a você. É o elo entre a caixa de entrada e o relatório de pendências do Contador/Auditor.

#### 13.5.3 Tipos de ordem

O sistema tem 32 tipos de ordem (O1–O32), organizados por momento do fluxo:

**Entrada de documentos**
- **O1** — Conferir NF-e de entrada (Comprador).
- **O2** — Conferir NF-e de saída (Faturista).
- **O3** — Conferir NFS-e/CT-e/RPA tomado (Comprador).
- **O4** — Conferir NFS-e/CT-e prestado (Faturista).
- **O5** — Conferir documento manual (Comprador/Faturista).
- **O6** — Conferir folha (RH).

**Classificação e revisão**
- **O7** — Revisar classificação (Comprador/Faturista/Contador).
- **O8** — Resolver conflito de regras (Contador).
- **O9** — Resolver pendência de dados (Comprador/Faturista/RH).

**Validação contábil/fiscal**
- **O10** — Validar lançamento contábil (Contador).
- **O11** — Validar impostos / override (Contador).
- **O12** — Validar folha (Contador).
- **O13** — Validar depreciação (Contador).
- **O14** — Validar provisões (Contador).

**Financeiro**
- **O15** — Gerar conta a pagar (Financeiro1).
- **O16** — Gerar conta a receber (Financeiro2).
- **O17** — Pagar conta (Financeiro1).
- **O18** — Receber conta (Financeiro2).
- **O19** — Validar saída de caixa/banco (Gerente Financeiro).
- **O20** — Validar entrada de caixa/banco (Gerente Financeiro).
- **O21** — Pagar folha (Financeiro1).

**Fechamento**
- **O22** — Preparar fechamento (Contador).
- **O23** — Validar fechamento (Auditor).
- **O24** — Fechar período (Contador).

**Auditoria e correção**
- **O25** — Apontar problema (Auditor → ator competente).
- **O26** — Solicitar correção (Auditor → ator competente).
- **O27** — Reclassificar lançamento (Contador).
- **O28** — Ajustar parâmetros (Contador/RH).

**Automáticas (sem ação humana)**
- **O29** — Registrar custo de produto.
- **O30** — Registrar razão de imposto.
- **O31** — Gerar pendência.
- **O32** — Consolidar depreciação e provisões.

#### 13.5.4 O que fazer com uma ordem

Ao abrir uma ordem, você vê: o documento de origem, o que precisa ser feito e as ações disponíveis. As ações variam por tipo:

| Ação | O que faz |
| :--- | :--- |
| **Abrir** | Muda o status para "em andamento". |
| **Concluir** | Finaliza a ordem e dispara a próxima. |
| **Cancelar** | Cancela a ordem (com justificativa). |
| **Marcar urgente** | Destaca a ordem na sua caixa de entrada. |
| **Ver documento** | Abre o documento de origem. |
| **Ver histórico** | Abre o histórico da ordem. |
| **Aceitar / Alterar / Rejeitar** | Para O7 (revisar classificação). |
| **Override** | Para O10, O11, O12, O13, O14 (sobrescrever valor calculado com justificativa). |
| **Aprovar / Reprovar** | Para O23 (validar fechamento). |
| **Confirmar** | Para O19, O20 (validar movimentação). |
| **Ajustar** | Para O15, O16 (vencimentos/parcelas). |
| **Resolver** | Para O9, O11 (pendências). |

#### 13.5.5 Fluxo de estados

```text
pendente → em_andamento → concluida
       ↘              ↘
        cancelada      cancelada
```

- **Pendente:** a ordem foi criada e aguarda você.
- **Em andamento:** você abriu, mas não terminou.
- **Concluída:** você terminou; a próxima ordem é emitida.
- **Cancelada:** o documento de origem foi cancelado ou a ordem perdeu o objeto.

Ordens **concluídas** e **canceladas** vão para o **histórico**.

#### 13.5.6 Ordens em lote

Algumas ordens podem ser concluídas **em lote** (ex: O7 — vários lançamentos do mesmo documento). Você escolhe se conclui individualmente ou em lote.

#### 13.5.7 Reabertura

Uma ordem concluída pode gerar uma **nova ordem** (ex: O27 — reclassificar), vinculada à anterior. O histórico preserva as duas.

#### 13.5.8 Urgente

Você pode marcar uma ordem como **urgente** (por ordem, não por documento). Ela aparece destacada na sua caixa de entrada. Não há prazo obrigatório — o "urgente" é uma priorização visual.

#### 13.5.9 Pendências × ordens

Uma **pendência** (T6) não é uma ordem. É um **registro de problema** (Erro/Aviso) que:

- Aparece no **relatório de pendências** (Contador, Auditor).
- Gera uma **ordem de resolução** (O9, O11, etc.) para o ator competente.
- É resolvida quando a ordem correspondente é concluída.

O elo entre os dois é o **filtro "Pendências"** na sua caixa de entrada.

#### 13.5.10 O que o Auditor faz

O Auditor **não muda nada**. Ele:

- Consulta a auditoria (I3).
- Aponta problemas (O25).
- Solicita correções (O26).
- Valida a consolidação do fechamento (O23) antes de o Contador fechar (O24).

#### 13.5.11 Resumo

- **Caixa de entrada** = fila única de trabalho.
- **Caixa de saída** = acompanhamento do que você enviou.
- **Histórico** = consulta das ordens concluídas/canceladas.
- **Tudo** que precisa ser feito chega como ordem.
- **Nada** fica fora da caixa de entrada.

---

## 14. Fluxo de documentos entre setores (handoff)

### 14.1 Tabela de handoffs padrão

| Documento de saída | Setor de origem | Setor de destino | O que o destino faz | Processamento |
| :--- | :--- | :--- | :--- | :--- |
| NF-e de entrada (classificada) | Comprador | Financeiro1 | Gera conta a pagar | Automático (sistema cria a conta) |
| NF-e de entrada (classificada) | Comprador | Contador | Valida lançamento contábil | Com ator (Contador valida) |
| NF-e de entrada (classificada) | Comprador | Sistema | Registra custo de produto | Automático (sistema) |
| NFS-e tomada | Comprador | Financeiro1 | Gera conta a pagar | Automático |
| CT-e tomado | Comprador | Financeiro1 | Gera conta a pagar | Automático |
| RPA | Comprador | Financeiro1 | Gera conta a pagar | Automático |
| NF-e de saída (emitida) | Faturista | Financeiro2 | Gera conta a receber | Automático |
| NF-e de saída (emitida) | Faturista | Contador | Valida lançamento contábil | Com ator |
| NFS-e prestada | Faturista | Financeiro2 | Gera conta a receber | Automático |
| CT-e emitido | Faturista | Financeiro2 | Gera conta a receber | Automático |
| Conta a pagar | Sistema | Financeiro1 | Baixa (pagamento) | Com ator |
| Conta a receber | Sistema | Financeiro2 | Baixa (recebimento) | Com ator |
| Baixa de conta a pagar | Financeiro1 | Gerente Financeiro | Valida saída de caixa/banco | Com ator |
| Baixa de conta a receber | Financeiro2 | Gerente Financeiro | Valida entrada de caixa/banco | Com ator |
| Folha consolidada | RH | Financeiro1 | Agenda pagamento de salários e encargos | Com ator |
| Baixa de conta | Financeiro1/2 | Contador | Conciliação e fechamento | Com ator |
| Consolidação do fechamento | Contador | Auditor | Valida consolidação | Com ator |
| Fechamento validado | Auditor | Contador | Fecha o período | Com ator |

> 💡 **Documentos gerados pelo sistema** (conta a pagar, conta a receber, razão de imposto, depreciação, provisão, pendência) têm como **ator de origem** quem gerou a NF (Comprador ou Faturista). O sistema é o **processador**, não o autor.

### 14.2 Handoff em empresa pequena

Se a empresa **não ativa o handoff**, o documento avança de estado automaticamente (sem tarefa para outro ator). A continuidade aparece na **mesma tela** do usuário que acumula os atores. Ex: o mesmo funcionário digita a NF-e de saída e já vê a conta a receber gerada para processar.

### 14.3 O que o Auditor faz

- **Não muda nada.**
- **Aponta problemas** e **solicita mudanças** ao ator competente.
- **Valida a consolidação** do fechamento de período.
- **Consulta toda a auditoria** (não só a do seu setor).
- **Verifica conformidade** (handoff cumprido, segregação de funções).
- **Gera relatórios de auditoria.**
- **Pode solicitar reclassificação** ao Contador (mas não reclassifica diretamente).

---

## 15. Formato de publicação do manual

O manual do usuário será publicado em **três formatos complementares**, com o mesmo conteúdo:

### 15.1 Ajuda embutida na aplicação (HTML)

- **Onde:** botão "Ajuda" (?) em cada tela, abrindo um painel lateral.
- **Como:** o manual em Markdown é convertido para HTML e indexado por tela. Cada tela tem um link direto para a seção correspondente.
- **Vantagem:** o usuário não sai da aplicação; o conteúdo está sempre atualizado.
- **Desvantagem:** não é pesquisável globalmente (só por tela).

### 15.2 Manual completo (PDF)

- **Onde:** download a partir da Ajuda ou do site da empresa.
- **Como:** o manual em Markdown é convertido para PDF com sumário navegável.
- **Vantagem:** portátil, pode ser impresso, compartilhado com sócios/contadores.
- **Desvantagem:** desatualiza a cada versão; precisa ser regerado.

### 15.3 Manual online (site de ajuda)

- **Onde:** site estático (ex: GitBook, Docusaurus, MkDocs) com busca global.
- **Como:** o manual em Markdown é publicado como site, com índice, busca e navegação.
- **Vantagem:** pesquisável, versionado, atualizado em tempo real.
- **Desvantagem:** exige hospedagem e manutenção.

### 15.4 Estrutura do manual

O manual segue a estrutura dos documentos funcionais:

```text
1. Primeiros passos
2. Conceitos que você precisa conhecer
3. Configuração inicial
4. Cadastros básicos
5. Entrada de dados — importação de XMLs
6. Entrada de dados — digitação manual
7. Classificação automática e revisão
8. Cálculos automáticos
9. Financeiro — contas a pagar e a receber
10. Fechamento de período
11. Relatórios gerenciais
12. Simulação de cenários (fase 2)
13. Administração
    13.5. Ordens — a fila única de trabalho
14. Fluxo de documentos entre setores (handoff)
15. Formato de publicação do manual
16. Mensagens e pendências — o que fazer
17. Perguntas frequentes
18. Glossário rápido (inclui glossário de ordens)
19. Sobre o wireframe (versão de demonstração)
```

### 15.5 Versionamento

- **Versão do manual** = versão do `00_indice.md` (atualmente 1.3).
- **Histórico** no final do manual (mesmo formato do índice).
- **A cada nova versão de documento funcional**, o manual é atualizado e a versão é incrementada.

### 15.6 Responsáveis

- **Conteúdo:** quem escreve os documentos funcionais.
- **Revisão:** Contador (regras e cálculos), Auditor (conformidade), Configurador (cadastros e permissões).
- **Publicação:** equipe técnica (HTML, PDF, site).
- **Atualização:** a cada release do sistema.

### 15.7 Recomendação

Para a **fase 1**, publicar em **HTML embutido** (Ajuda) + **PDF** (download). O **site online** fica para a **fase 2**, quando o volume de conteúdo justificar.

---

## 16. Mensagens e pendências — o que fazer

### 16.1 Relatório de pendências (T6)

Acesse **Revisão > Pendências** (ou o link no fechamento). O relatório agrupa tudo que precisa ser resolvido antes do fechamento:

| Categoria | Exemplos | Efeito |
| :--- | :--- | :--- |
| **Erro** | Lançamentos não classificados; provisões não calculadas; depreciação não lançada; dados críticos faltantes; contas com divergência; regras ambíguas. | **Bloqueia** o fechamento. |
| **Aviso** | Dados não críticos faltantes; contas vencidas não baixadas; data divergente já confirmada; saldos de impostos sem movimentação. | **Não bloqueia**; exige confirmação. |

Cada pendência tem uma **ação de resolução**. O fechamento registra as pendências existentes e como foram tratadas.

### 16.2 Mensagens comuns e o que fazer

| Mensagem | O que significa | O que fazer |
| :--- | :--- | :--- |
| "Nenhum período aberto." | Não há período disponível para receber lançamentos. | Abra/fechar período (seção 10). |
| "A nota tem data de emissão 31/03/2026, mas será incluída no período 04/2026. Confirmar?" | A data de emissão está fora do período aberto. | Confirme se for o caso — a nota integra o período aberto. |
| "Não classificado — requer intervenção." | O motor não encontrou regra e o fallback foi acionado. | Classifique manualmente na revisão (seção 7.3) e crie uma regra (seção 7.4). |
| "Conflito de regras — requer intervenção." | Duas regras de mesma prioridade apontam para contas diferentes. | Escolha a regra correta na revisão (seção 7.3). |
| "Importado com erro — completar dados críticos." | Faltam dados críticos no documento. | Resolva a pendência (Erro) antes do fechamento. |
| "Importado com aviso." | Faltam dados não críticos. | Resolva quando puder (Aviso). |
| "A soma das parcelas + retenções não confere com o valor bruto." | Inconsistência na geração de contas. | Ajuste as parcelas/retenções na tela de contas. |
| "Saldo pode estar desatualizado — verifique baixas pendentes." | Há contas em aberto que podem afetar a posição. | Verifique as baixas pendentes. |
| "Há lançamentos não classificados — o DRE pode estar incompleto." | O relatório pode não refletir todos os lançamentos. | Classifique os lançamentos pendentes. |

---

## 17. Perguntas frequentes

**1. Posso reabrir um período fechado?**
Não. Se algo precisar ser incluído retroativamente, entra no **período aberto atual**; a data de emissão original fica registrada como atributo do documento.

**2. O que acontece se eu importar uma nota com data de emissão de outro mês?**
O sistema avisa e pede confirmação. Se você confirmar, a nota integra o **período aberto** para todos os efeitos.

**3. O sistema cria regras de classificação sozinho?**
Não. Ele **sugere** a regra quando você altera uma classificação, mas só cria se você confirmar.

**4. Posso ter mais de uma tag de ator?**
Sim. Numa PME, é comum acumular funções (ex: Comprador + Financeiro). Se você tiver a tag **`configurador`**, já tem acesso a tudo e não precisa das demais.

**5. O que é o "porquê" da sugestão?**
É a justificativa que o sistema exibe ao sugerir uma conta: qual regra foi aplicada, qual contexto foi considerado, a prioridade e a confiança. Fica registrada no lançamento para consulta futura.

**6. O que é o handoff?**
É o fluxo de documentos entre setores, como se não houvesse computador: cada ator assina a sua ordem e gera uma nova ordem para o próximo setor. O fluxo é fixo, mas o Configurador pode ativá-lo/desativá-lo por empresa.

**7. O cálculo fiscal do sistema serve para declarar?**
Não. O cálculo é **gerencial e para simulação**. Não constitui base para declaração fiscal. Consulte um contador para obrigações fiscais reais.

**8. O que é o "Cadastro incompleto"?**
É o status de um cliente, fornecedor ou funcionário criado automaticamente durante uma importação, porque não estava cadastrado. Você completa os dados depois.

**9. O que é o "Não alocado" no DRE por centro de custo?**
São lançamentos que não têm centro de custo atribuído. A soma dos DREs por centro + "Não alocado" = DRE total.

**10. Posso exportar os relatórios?**
Sim. Em qualquer relatório (G1–G6), clique em "Exportar" e escolha Excel, PDF ou CSV. A exportação respeita os filtros aplicados.

**11. O que é o "método de custo"?**
É a forma como o CMV é calculado: **XML** (usa o custo do XML), **Médio** (custo médio das entradas) ou **Manual** (informado no item). É definido no cadastro da empresa.

**12. O que é a "estimativa" no fluxo de caixa?**
Contas sem valor ou sem vencimento podem receber "valor aproximado" e/ou "vencimento aproximado", marcados como estimativas. São usados **apenas nas simulações** e projeções gerenciais, nunca nos relatórios reais.

**13. O que é o "override"?**
É a sobrescrita de um valor calculado pelo sistema (ex: imposto, depreciação, provisão) por um valor informado por você. Exige justificativa e é registrado em auditoria.

**14. O que é o "snapshot" na simulação?**
É uma cópia instantânea dos dados reais, usada como base para o cenário. Alterações no cenário não afetam os dados reais.

**15. O que é a "cadeia de documentos"?**
É o vínculo entre um documento e outro (ex: CT-e → NF-e). O elo é registrado em `documento_encadeado`.

**16. O que é o "status_fluxo"?**
É o estado gerencial do documento (ex: "Aguardando conferência", "Aguardando pagamento", "Pago"), além do status de importação.

**17. O que é o "período de competência"?**
É o período em que o documento é incluído (o período aberto no momento da inclusão), independentemente da data de emissão.

**18. O que é a "segregação de funções"?**
É a recomendação de que o mesmo usuário não execute etapas incompatíveis (ex: quem digita a NF não deveria ser quem paga). Na fase 1, é **recomendação do Auditor**, não bloqueio.

**19. O que é o "handoff por filial"?**
É a possibilidade de ativar/desativar o handoff em filiais diferentes. Na fase 1, a configuração é única para a empresa; handoff por filial é fase 2.

**20. O que é o "limite de aprovação do Gerente Financeiro"?**
É o valor acima do qual o Gerente Financeiro precisa aprovar pagamentos/recebimentos. Na fase 1, ele valida tudo; o limite configurável é fase 2.

---

## 18. Glossário rápido

| Termo | Definição |
| :--- | :--- |
| **Ativo** | Bens e direitos da empresa. |
| **CBS** | Contribuição sobre Bens e Serviços (LC 214/2025). Substitui PIS/COFINS em transição. |
| **CFOP** | Código Fiscal de Operações e Prestações. |
| **CIF** | Cost, Insurance and Freight. Emitente paga o frete. |
| **CMV** | Custo da Mercadoria Vendida. |
| **COFINS** | Contribuição para o Financiamento da Seguridade Social. |
| **CPV** | Custo do Produto Vendido (indústria). |
| **CSLL** | Contribuição Social sobre o Lucro Líquido. |
| **CST** | Código de Situação Tributária. |
| **CT-e** | Conhecimento de Transporte Eletrônico. |
| **DAS** | Documento de Arrecadação do Simples Nacional. |
| **DRE** | Demonstração do Resultado do Exercício. |
| **ECD/ECF** | Escrituração Contábil Digital / Fiscal. |
| **FGTS** | Fundo de Garantia do Tempo de Serviço. |
| **FOB** | Free on Board. Destinatário paga o frete. |
| **Handoff** | Fluxo de documentos entre setores, com assinatura e encadeamento. |
| **IBS** | Imposto sobre Bens e Serviços (LC 214/2025). Substitui ICMS/ISS em transição. |
| **ICMS** | Imposto sobre Circulação de Mercadorias e Serviços. |
| **INSS** | Instituto Nacional do Seguro Social. |
| **IPI** | Imposto sobre Produtos Industrializados. |
| **IRRF** | Imposto de Renda Retido na Fonte. |
| **ISS** | Imposto Sobre Serviços. |
| **LC 116** | Lei Complementar 116/2003 (serviços sujeitos ao ISS). |
| **LC 123** | Lei Complementar 123/2006 (Simples Nacional). |
| **LC 214** | Lei Complementar 214/2025 (reforma tributária). |
| **NCM** | Nomenclatura Comum do Mercosul. |
| **NF-e** | Nota Fiscal Eletrônica (mercadorias). |
| **NFS-e** | Nota Fiscal de Serviço Eletrônica. |
| **Override** | Sobrescrita de um valor calculado pelo sistema, com justificativa e auditoria. |
| **Passivo** | Obrigações da empresa. |
| **PIS** | Programa de Integração Social. |
| **RAT** | Risco Ambiental do Trabalho. |
| **RPA** | Recibo de Pagamento a Autônomo. |
| **Snapshot** | Cópia instantânea dos dados para simulação. |
| **ST** | Substituição Tributária. |
| **Conselheiro** | Agente que analisa os dados e sugere melhorias acionáveis ao gestor. |
| **Heurística** | Regra de análise que o Conselheiro usa para identificar anomalias, tendências ou oportunidades. |
| **Impacto estimado** | Estimativa de quanto uma sugestão pode afetar o resultado (R$, % ou alto/médio/baixo). |
| **Confiança (da sugestão)** | Grau de certeza da sugestão (Alta / Média / Baixa), baseado na qualidade dos dados. |

### Glossário de ordens

| Termo | Definição |
| :--- | :--- |
| **Ordem** | Documento que materializa uma tarefa. Chega à caixa de entrada do ator. Carrega: ator de origem, data, tipo, ator de destino, documento de origem. |
| **O1** | Conferir NF-e de entrada. |
| **O2** | Conferir NF-e de saída. |
| **O3** | Conferir NFS-e/CT-e/RPA tomado. |
| **O4** | Conferir NFS-e/CT-e prestado. |
| **O5** | Conferir documento manual. |
| **O6** | Conferir folha de pagamento. |
| **O7** | Revisar classificação (D3). |
| **O8** | Resolver conflito de regras. |
| **O9** | Resolver pendência de dados. |
| **O10** | Validar lançamento contábil. |
| **O11** | Validar impostos (override). |
| **O12** | Validar folha. |
| **O13** | Validar depreciação. |
| **O14** | Validar provisões. |
| **O15** | Gerar conta a pagar. |
| **O16** | Gerar conta a receber. |
| **O17** | Pagar conta. |
| **O18** | Receber conta. |
| **O19** | Validar saída de caixa/banco. |
| **O20** | Validar entrada de caixa/banco. |
| **O21** | Pagar folha. |
| **O22** | Preparar fechamento. |
| **O23** | Validar fechamento. |
| **O24** | Fechar período. |
| **O25** | Apontar problema (auditoria). |
| **O26** | Solicitar correção (auditoria). |
| **O27** | Reclassificar lançamento. |
| **O28** | Ajustar parâmetros. |
| **O29** | Registrar custo de produto (automática). |
| **O30** | Registrar razão de imposto (automática). |
| **O31** | Gerar pendência (automática). |
| **O32** | Consolidar depreciação e provisões (automática). |
| **Caixa de entrada** | Fila única de trabalho do ator. Mostra ordens pendentes e em andamento. |
| **Caixa de saída** | Mostra as ordens que o ator emitiu e ainda estão pendentes/em andamento. |
| **Histórico** | Consulta das ordens concluídas e canceladas. |
| **Handoff** | Fluxo de documentos entre setores. Fixo, com ativação/desativação por empresa. |
| **Status de ordem** | pendente, em_andamento, concluida, cancelada. |
| **Ordem automática** | Processada pelo sistema (O29–O32), sem ação humana. |
| **Ordem com ator** | Exige ação humana (conferir, classificar, validar, pagar, receber, fechar). |
| **Filtro "Pendências"** | Filtro da caixa de entrada que mostra as ordens de resolução de pendência (T6). |
| **Urgente** | Marcação do ator na ordem. Destaca na caixa de entrada. Sem prazo obrigatório. |
| **Lote** | Conclusão de várias ordens do mesmo tipo de uma vez. |
| **Reabertura** | Uma ordem concluída pode gerar uma nova ordem vinculada (ex: O27). |

---

## 19. Sobre o wireframe (versão de demonstração)

> **O que é:** uma versão de demonstração do sistema, construída em HTML/CSS/JavaScript puro, com **dados simulados** (mock). Serve para **validar a experiência do usuário** antes da implementação real.
>
> **O que não é:** não é a versão de produção. Não tem backend, não persiste dados entre recarregamentos (exceto o `localStorage` do menu), não faz autenticação real.

### 19.1 O que está implementado

| Item | Status |
| :--- | :--- |
| **Menu por ator** (blocos 1–12) | ✅ |
| **Numeração de menu** (1.1 a 12.5) + campo "Ir para" | ✅ |
| **Expandir/recolher blocos** do menu (com persistência) | ✅ |
| **Troca de tema** (Moderno, Clássico, Desktop) | ✅ |
| **Tamanho de fonte customizável** (A-, A, A+, A++) | ✅ |
| **Todas as 63 telas** dos 11 blocos de atores | ✅ |
| **Caixa de entrada/saída/histórico** (ordens O1–O32) | ✅ |
| **Importar XML** (Comprador 5.4, Faturista 6.4) | ✅ |
| **Contas a pagar/receber** (com juros/multa/desconto) | ✅ |
| **Validação de cálculos** (com override) | ✅ |
| **DRE** (3.1, 3.2, 3.3) + **fluxo de caixa** (3.4) + **análise** (3.5, 3.6) | ✅ |
| **Posição de caixa** (3.8) | ✅ |
| **Simulações** (3.9 — placeholder fase 2) | ✅ |
| **Balanço Patrimonial** (3.10 — G8) | ✅ |
| **Painel Executivo** (3.11 — G9) | ✅ |
| **Aging de Contas** (3.12 — G10) | ✅ |
| **Posição de Impostos** (3.13 — G11) | ✅ |
| **Posição de Pessoal** (3.14 — G12) | ✅ |
| **Posição de Ativos** (3.15 — G13) | ✅ |
| **Ponto de Equilíbrio** (3.16 — G14) | ✅ |
| **Resumo Executivo** (3.17 — G15) | ✅ |
| **Conselheiro** (3.18 — F7) | ✅ |
| **Auditoria** (11.1–11.4) + **apontar/solicitar** (11.6, 11.7) + **validar fechamento** (11.8) | ✅ |

A tabela atual (na v1.4) tem **8 relatórios** (3.10–3.17) + **Auditoria**. **Adicionar** o Conselheiro (3.18) — já incluído no item 5.1 acima.

### 19.2 O que é mock (não persiste / não é real)

| Item | O que é mock |
| :--- | :--- |
| **Dados** | Todos os dados (empresas, filiais, lançamentos, notas, contas) são **arrays em memória**. Recarregar a página reseta. |
| **Autenticação** | Não há login real. O usuário logado é fixo em `USUARIO_ORDENS` (no `dados-simulados.js`). |
| **Backend** | Não há. Toda a lógica (cálculos, classificações, validações) é simulada no front. |
| **Importação de XML** | Simula a varredura da pasta. Os XMLs são gerados a partir de `xmlsSimulados`. |
| **Upload de arquivos** | Não faz upload real. A "pasta" e o "arquivo" são simulados. |
| **Exportação** | Mostra um alerta simulando o download. Não gera arquivo real. |
| **Persistência** | Só o `localStorage` do menu (blocos recolhidos) e o tema/fonte persistem. O resto não. |
| **Cálculos** | Os cálculos (juros, multa, INSS, IRRF, impostos) são simplificados, apenas para demonstração. Na produção, virão do backend. |

### 19.3 Como usar o wireframe

#### 19.3.1 Login (mock)

Não há login. O sistema já inicia com um usuário logado (`Carlos Silva`, ator `comprador`). Para testar com outros atores, **edite o `dados-simulados.js`**:

```javascript
const USUARIO_ORDENS = {
  nome: 'Carlos Silva',
  ator: 'comprador',   // ← mude para 'contador', 'auditor', 'faturista', etc.
  filial: 'Matriz',
};
```

E recarregue a página.

#### 19.3.2 Troca de tema

No topbar, use os botões **Moderno / Clássico / Desktop**. A escolha é salva no `localStorage`.

#### 19.3.3 Tamanho de fonte

No topbar, use **A- / A / A+ / A++**. A escolha é salva no `localStorage`.

#### 19.3.4 Navegação

- **Menu lateral:** clique no cabeçalho de cada bloco para expandir/recolher. Os botões **"Expandir"**, **"Recolher"** e **"↺"** fazem ação em lote (ou reset).
- **Campo "Ir para":** digite o número (ex: `4.7`) e pressione Enter.
- **Atalho `Ctrl+K`:** foca o campo "Ir para".

#### 19.3.5 O que testar

Recomendamos testar os fluxos principais:

1. **Importar XML** (5.4) — selecionar pasta, pré-validar, confirmar, ver resultado.
2. **Revisar classificações** (5.5) — aceitar/alterar/rejeitar.
3. **Contas a pagar** (7.2) — pagar uma conta vencida (com juros/multa), estornar.
4. **Contas a receber** (8.2) — receber uma conta inadimplente.
5. **DRE** (3.1) — ver a estrutura completa.
6. **Validação de cálculos** (4.8) — override com justificativa.
7. **Caixa de entrada** (1.1) — iniciar/concluir/marcar urgente.
8. **Validar fechamento** (11.8) — aprovar/reprovar (como Auditor).

### 19.4 O que **não** está implementado (fase 2)

- **Simulação de cenários** (H1–H5) — placeholder com roadmap.
- **Importação de XML em lote real** (upload de pasta do sistema operacional).
- **CNAB / OFX** (integração bancária).
- **Rateio de despesas fixas** (margem líquida).
- **Comparação com realizado** (fluxo de caixa).
- **Menu com permissões granulares por relatório**.
- **Indústria** (subcontas de custo).
- **Múltiplas empresas**.
- **Tela de correção de dados**.
- **Drill-downs avançados** dos 8 relatórios novos (drill-down básico já existe).
- **Semáforo configurável** no Painel Executivo.
- **Alertas proativos configuráveis** no Painel Executivo.
- **Faixas de aging configuráveis**.
- **Customização do Resumo Executivo**.
- **Envio do Resumo Executivo por e-mail / agendamento**.
- **Metas configuráveis para o Conselheiro** (fase 2).
- **Benchmarks do Conselheiro** (fase 2).
- **Machine learning do Conselheiro** (fase 2).
- **Notificações do Conselheiro** (fase 2).
- **Permissões por área no Conselheiro** (fase 2).

### 19.5 Estrutura do wireframe

```text
exemplos/
├── assets/
│   ├── css/
│   │   ├── geral.css            ← base
│   │   ├── menu.css              ← menu (blocos, numeração, "Ir para")
│   │   ├── tema-moderno.css      ← tema
│   │   ├── tema-classico.css     ← tema
│   │   ├── tema-retro.css        ← tema (desktop)
│   │   ├── acessibilidade.css    ← tamanho de fonte
│   │   ├── nota-entrada.css      ← wizard de nota de entrada
│   │   ├── nota-saida.css        ← wizard de nota de saída
│   │   ├── contas.css            ← contas a pagar/receber
│   │   ├── ordens.css            ← caixa de entrada/saída
│   │   ├── contador.css          ← telas do Contador
│   │   ├── tabelas-basais.css    ← abas das tabelas
│   │   ├── auditor.css           ← telas do Auditor
│   │   ├── administrador.css     ← DRE, posição, análise
│   │   ├── importacao.css        ← upload de XML
│   │   ├── relatorios-administrador.css ← relatórios G8–G15
│   │   ├── tela-inicial-painel.css      ← resumo do Painel na Tela Inicial
│   │   └── conselheiro.css       ← Conselheiro (3.18)
│   └── js/
│       ├── dados-simulados.js    ← todos os dados mock
│       ├── geral.js              ← showScreen, formatarMoeda, etc.
│       ├── menu-dados.js         ← itens do menu (1.1–12.5)
│       ├── menu.js               ← montagem do menu, "Ir para", badge
│       ├── acessibilidade.js     ← tamanho de fonte
│       ├── configuracao.js       ← empresa, filial, centros
│       ├── cadastros.js          ← usuários, clientes, fornecedores, produtos
│       ├── lancamentos.js        ← lançamentos
│       ├── nota-entrada.js       ← wizard de nota de entrada
│       ├── nota-saida.js         ← wizard de nota de saída
│       ├── contas-pagar.js       ← contas a pagar
│       ├── contas-receber.js     ← contas a receber
│       ├── caixa-entrada.js      ← ordens pendentes
│       ├── caixa-saida.js        ← ordens emitidas
│       ├── historico.js          ← ordens concluídas/canceladas
│       ├── revisao-lancamentos.js ← D3 (Contador)
│       ├── revisao-classificacoes.js ← D3 (Comprador/Faturista)
│       ├── regras-classificacao.js ← D5
│       ├── pendencias.js         ← T6
│       ├── fechamento.js         ← A6 (Contador)
│       ├── validar-fechamento.js ← A6 (Auditor)
│       ├── tabelas-trabalhistas.js ← INSS, IRRF, encargos
│       ├── proventos-descontos.js ← 10.5
│       ├── folha-pagamento.js    ← 10.6
│       ├── tabelas-basais.js     ← 7.1 e 8.1
│       ├── validar-financeiro.js ← 9.1 e 9.2
│       ├── parametros-fiscais.js ← 4.1
│       ├── plano-contas.js       ← 4.2
│       ├── mapeamento-referencial.js ← 4.3
│       ├── configuracoes-fiscais.js ← 4.4
│       ├── validacao-calculos.js ← 4.8
│       ├── auditoria.js          ← 11.1–11.4
│       ├── apontar-solicitar.js  ← 11.6 e 11.7
│       ├── relatorios.js         ← 3.1, 3.2, 3.3
│       ├── relatorios-avancados.js ← 3.4, 3.5, 3.6
│       ├── posicao-caixa.js      ← 3.8
│       ├── painel-executivo.js  ← 3.11 (G9)
│       ├── balanco.js           ← 3.10 (G8)
│       ├── aging.js             ← 3.12 (G10)
│       ├── posicao-impostos.js  ← 3.13 (G11)
│       ├── posicao-pessoal.js   ← 3.14 (G12)
│       ├── posicao-ativos.js    ← 3.15 (G13)
│       ├── ponto-equilibrio.js  ← 3.16 (G14)
│       ├── resumo-executivo.js  ← 3.17 (G15)
│       ├── conselheiro.js        ← 3.18 (F7)
│       ├── simulacoes.js         ← 3.9 (placeholder)
│       └── importar-xml.js       ← 5.4 e 6.4
├── index.html                    ← página principal
└── README.md                     ← (a criar — Bloco 5)
```

### 19.6 Observações finais

- **O wireframe é uma ferramenta de validação.** Não é a versão final. A implementação real (PHP + MariaDB) será construída a partir da documentação funcional (`00`–`10`) e do wireframe (`11`).
- **Os dados são fictícios.** Nenhum dado real é usado.
- **A lógica é simplificada.** Cálculos, classificações e validações são aproximações. A implementação real seguirá as regras dos documentos funcionais.
- **O foco é a experiência do usuário.** O wireframe serve para validar fluxos, telas, mensagens e interações antes de investir no backend.

---

> **Suporte:** em caso de dúvidas não cobertas por este manual, consulte o **Contador** (regras e cálculos), o **Auditor** (conformidade e auditoria) ou o **Configurador** (cadastros e permissões).

> **Aviso final:** "O cálculo fiscal deste sistema é apenas para referência gerencial e simulação de decisões, não constituindo base para declaração fiscal. Consulte um contador para obrigações fiscais reais."

---

## Histórico de versões deste manual

| Versão | Data | Mudança |
| :--- | :--- | :--- |
| 1.0 | 2026-10-23 | Criação do manual. Conteúdo: primeiros passos, conceitos, configuração, cadastros, entrada de dados, classificação, cálculos, financeiro, fechamento, relatórios, simulação, administração, handoff, mensagens, perguntas frequentes, glossário. |
| 1.1 | 2026-10-23 | Inclusão da seção 13.5 (ordens — a fila única de trabalho), da seção 15 (formato de publicação) e do glossário de ordens. Renumeração das seções 15–17 para 16–18. Ajuste da seção 1.3 (perfis → atores/tags) e 1.4 (navegação por ator). Frontmatter adicionado. |
| 1.2 | 2026-10-24 | Números de menu em todas as seções (ex: `4.7`). Atualização da seção 1.4 (navegação por ator com tabela de números). Atualização da seção 13.5 (ordens com números e referência ao wireframe). Nova seção 19 (Sobre o wireframe). Frontmatter atualizado. |
| 1.3 | 2026-10-24 | Inclusão da seção 1.5 (Tela Inicial — dashboard); frontmatter atualizado; referência ao `12_tela_inicial.md`. |
| 1.4 | 2026-10-25 | Merge do `13` (v1.1). Inclusão das subseções 11.8 a 11.15 (Balanço, Painel Executivo, Aging, Posição de Impostos, Posição de Pessoal, Posição de Ativos, Ponto de Equilíbrio, Resumo Executivo). Atualização da tabela do bloco Administrador (3.1–3.17) na seção 1.4. Atualização das tabelas do wireframe (seções 19.1 e 19.4) e da estrutura de arquivos (19.5). Frontmatter com `13` em `baseado_em`. Nova "Novidade na v1.4". |
| 1.5 | 2026-10-26 | Merge do `14` (v1.0 — Conselheiro). Inclusão da seção 11.16 (Conselheiro — 3.18). Atualização da tabela do bloco Administrador (3.1–3.18) na seção 1.4. Inclusão do Conselheiro na seção 19 (tabela do que está implementado, estrutura de arquivos, limitações). Frontmatter com `14` em `baseado_em`. Nova "Novidade na v1.5". |
