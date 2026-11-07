---
documento: casos_de_uso
versao: 2.6
data: 2026-11-06
proposito: Atores, fluxos, exceções e regras de negócio por caso de uso (completo) + referência às ordens, ao menu e à tela inicial
depende_de: [01_visao_geral, 02_regras_transversais, 04_modelo_de_dados, 05_apendices, 07_atores_fluxo, 08_ordens, 09_menu_numeracao, 12_tela_inicial, 13_relatorios_administrador, 14_conselheiro, 16_modulo_importacoes]
---

# Casos de Uso

Template fixo por caso: **Nome, Ator, Pré-condições, Fluxo principal, Fluxos alternativos, Exceções, Pós-condições, Regras de negócio, Telas envolvidas**. Regras transversais são referenciadas como `[T5]`, `[T6]`, `[T7]`.

## Atores

| Ator | Objetivo principal | Nível |
| :--- | :--- | :--- |
| **Administrador / Empresário** | Tomar decisão, simular cenários, ver resumo por área. | Não contábil. |
| **Operador / Auxiliar** | Alimentar o sistema (importar XMLs, digitar lançamentos, revisar). | Operacional. |
| **Controller / Contador interno** | Configurar plano de contas, regras, parâmetros; validar. | Contábil/gerencial. |
| **Sistema (ator automático)** | Classificar, calcular, provisionar, gerar alertas. | — |

---

## MÓDULO A — CONFIGURAÇÃO

### A1 — Cadastrar empresa

**Nome:** Cadastrar empresa (usuária do sistema).
**Objetivo:** Registrar a empresa que usará o sistema, definindo os parâmetros que ativam o comportamento global (regime fiscal, setor, plano de contas, parâmetros fiscais e trabalhistas).

**Ator principal:** Controller.
**Atores secundários:** Sistema (carrega planos e parâmetros).

**Pré-condições:**
- Nenhuma (é o primeiro caso de uso da implantação).
- Se já existir empresa cadastrada, o caso vira "editar empresa" (com restrições — ver RN6).

**Fluxo principal:**
1. Usuário acessa "Configuração > Empresa > Nova".
2. Sistema exibe formulário com campos obrigatórios e opcionais.
3. Usuário informa:
   - **Dados cadastrais:** CNPJ, Razão Social, Nome Fantasia, Inscrição Estadual, Inscrição Municipal, endereço.
   - **Regime fiscal:** Simples Nacional / Lucro Presumido / Lucro Real (escolha única).
   - **Setor:** Comércio / Serviços / Misto (escolha única).
   - **CNAE principal** (opcional, recomendado — usado para sugerir parâmetros e RAT).
   - **Data de início de operação no sistema** (mês/ano do primeiro período).
4. Usuário confirma.
5. Sistema valida campos obrigatórios e CNPJ (dígito verificador e unicidade).
6. Sistema apresenta a lista de **planos de contas sugeridos** (inicialmente um: "Plano Gerencial Padrão — Comércio e Serviços"). Usuário seleciona.
7. O plano já traz:
   - Estrutura de contas (Ativo, Passivo, Custos, Despesas, Receitas, Resultado Financeiro).
   - Sub-tipos (Fixo/Variável, Operacional/Não Operacional).
   - **Mapeamento embutido** para o plano referencial externo (ECD/ECF).
   - Contas de custo ativadas conforme o setor.
8. Sistema carrega as **tabelas universais** de parâmetros fiscais e trabalhistas.
9. Sistema permite ao usuário **adaptar as tabelas de tributos** (ICMS estadual, benefícios, PIS/COFINS). As tabelas trabalhistas **não são adaptáveis** (federais).
10. Sistema cria a **filial matriz** automaticamente, com os dados da empresa, e vincula `id_filial_matriz` na tabela `empresa`.
11. Sistema cria o **primeiro período** da filial matriz no estado **Aberto** `[T5]`.
12. Sistema exibe resumo do que foi configurado ("Plano X ativado, filial matriz criada, período mm/aaaa aberto").

**Fluxos alternativos:**
- **FA1 — Empresa já cadastrada (edição):** usuário acessa "Editar empresa". Pode alterar dados cadastrais e CNAE livremente. **Alteração de regime fiscal ou setor** exige confirmação explícita e só é permitida no início de um novo período (RN6). O sistema não apaga dados históricos; apenas ativa/desativa contas e recarrega parâmetros.
- **FA2 — Múltiplas empresas:** fase 2 (`06_pendencias.md`).

**Exceções:**
- **EX1 — CNPJ inválido:** sistema bloqueia e exibe mensagem.
- **EX2 — Regime fiscal não selecionado:** bloqueia.
- **EX3 — Setor não selecionado:** bloqueia (define o plano de contas).
- **EX4 — Data de início inválida** (futura demais, ou anterior a período existente): sistema alerta e pede confirmação.
- **EX5 — Alteração de regime em período já fechado:** sistema bloqueia a alteração retroativa; permite apenas a partir do próximo período aberto.

**Pós-condições:**
- Empresa cadastrada.
- Plano de contas ativado conforme setor.
- Parâmetros fiscais e trabalhistas carregados.
- Filial matriz criada e vinculada.
- Primeiro período criado no estado **Aberto**.
- Sistema pronto para receber cadastros básicos e o primeiro fechamento.

**Regras de negócio:**
- **RN1** Regime fiscal é obrigatório e determina o mapeamento referencial embutido no plano de contas escolhido.
- **RN2** Setor é obrigatório e determina quais contas de custo são ativadas no plano (3.1.x Comércio, 3.2.x Serviços, ambas Misto).
- **RN3** O usuário **seleciona** o plano de contas entre os sugeridos. Inicialmente há um; o sistema é expansível para novos planos.
- **RN4** O mapeamento para o plano referencial externo **já existe na criação do plano** — não há etapa separada de ativação.
- **RN5** Tabelas de parâmetros fiscais são **universais**, mas **adaptáveis por empresa** (tributos). Tabelas trabalhistas são universais e **não adaptáveis** (federais).
- **RN6** Alteração de regime fiscal **só no início de um novo período**. Bloqueada se houver período aberto com lançamentos; exige fechamento prévio.
- **RN7** A alteração de regime/setor **não apaga dados históricos**; ajusta o comportamento a partir do novo período.
- **RN8** O primeiro período é criado automaticamente no estado **Aberto** `[T5]`.
- **RN9** CNPJ é validado e único no sistema.
- **RN10** O plano de contas escolhido é **vinculado à empresa** e pode ser editado (criar/desativar contas) sem afetar o plano original sugerido.
- **RN11** Toda empresa tem pelo menos uma filial (a matriz), criada automaticamente.
- **RN12** O cadastro de filiais adicionais é feito em A8.

**Telas/relatórios envolvidos:**
- Tela "Cadastro de Empresa" (formulário em etapas: dados cadastrais → regime/setor → seleção de plano → confirmação).
- Tela "Resumo da Configuração".
- Tela "Editar Empresa" (com histórico de alterações).

---

### A2 — Selecionar/editar plano de contas

**Nome:** Selecionar e editar plano de contas.
**Objetivo:** Permitir ao Controller criar, editar ou desativar contas no plano de contas gerencial vinculado à empresa, sem afetar lançamentos já realizados em períodos fechados.

**Ator principal:** Controller.

**Pré-condições:**
- Empresa cadastrada (A1).
- Período aberto para edição `[T5]`.

**Fluxo principal:**
1. Controller acessa "Configuração > Plano de Contas".
2. Sistema exibe a árvore de contas (sintéticas e analíticas), com código, nome, tipo, sub-tipo e indicador "aceita lançamento".
3. Controller pode:
   - Criar nova conta (analítica ou sintética), informando: código, nome, tipo, sub-tipo, conta pai, mapeamento referencial.
   - Editar conta existente (nome, sub-tipo, mapeamento).
   - Desativar conta (soft delete).
4. Sistema valida:
   - Código único.
   - Conta pai existe (se aplicável).
   - Conta analítica tem mapeamento referencial.
   - Conta com lançamentos não pode ser excluída (apenas desativada).
5. Sistema registra a alteração em auditoria.

**Fluxos alternativos:**
- **FA1 — Criar conta a partir de modelo:** Controller pode duplicar uma conta existente e ajustar.
- **FA2 — Reativar conta:** Controller pode reativar conta desativada (se não houver conflito).

**Exceções:**
- **EX1 — Código duplicado:** bloqueia.
- **EX2 — Conta pai inexistente:** bloqueia.
- **EX3 — Excluir conta com lançamentos:** bloqueia; oferece desativar.
- **EX4 — Alteração em período fechado:** bloqueia `[T5]`.

**Pós-condições:**
- Conta criada/editada/desativada.
- Auditoria registrada.
- Lançamentos futuros usam o plano atualizado.

**Regras de negócio:**
- **RN1** Só contas **analíticas** recebem lançamentos; sintéticas apenas somam.
- **RN2** Contas com lançamentos não podem ser excluídas, apenas desativadas.
- **RN3** Alterações no plano **não afetam** lançamentos já classificados em períodos fechados `[T5]`.
- **RN4** O mapeamento referencial de contas novas pode ser informado pelo Controller (ou herdado do plano sugerido).

**Telas envolvidas:**
- Tela "Plano de Contas" (árvore + formulário de criação/edição).
- Tela de auditoria de alterações.

---

### A3 — Cadastrar centros de custo e áreas de negócio

**Nome:** Cadastrar centros de custo e áreas de negócio.
**Objetivo:** Permitir ao Controller cadastrar os centros de custo (departamentos, unidades) e agrupá-los em áreas de negócio, para análise gerencial.

**Ator principal:** Controller.

**Pré-condições:**
- Empresa cadastrada (A1).

**Fluxo principal:**
1. Controller acessa "Configuração > Centros de Custo".
2. Sistema exibe a lista de centros de custo ativos.
3. Controller cadastra novo centro: nome, responsável.
4. Controller acessa "Configuração > Áreas de Negócio".
5. Sistema exibe a lista de áreas.
6. Controller cadastra nova área: nome, centros vinculados (N:N).
7. Sistema valida e registra.

**Fluxos alternativos:**
- **FA1 — Editar centro/área:** Controller pode editar nome, responsável, vínculos.
- **FA2 — Desativar centro/área:** soft delete, se não houver lançamentos vinculados.

**Exceções:**
- **EX1 — Centro com lançamentos:** não pode ser excluído; pode ser desativado.
- **EX2 — Área sem centros:** permitida (área vazia), mas gera aviso.
- **EX3 — Centro em mais de uma área:** permitido (N:N).

**Pós-condições:**
- Centro/área criado/editado/desativado.
- Auditoria registrada.

**Regras de negócio:**
- **RN1** Obrigatório ao menos um centro de custo antes de lançar despesas fixas.
- **RN2** Um centro pode estar em mais de uma área (N:N).
- **RN3** Centro com lançamentos não pode ser excluído, apenas desativado.

**Telas envolvidas:**
- Tela "Centros de Custo".
- Tela "Áreas de Negócio".

---

### A4 — Carregar tabelas de parâmetros

**Nome:** Carregar tabelas de parâmetros fiscais e trabalhistas.
**Objetivo:** Carregar as tabelas universais (INSS, IRRF, encargos, alíquotas) no cadastro da empresa, com suporte a vigência por período.

**Ator principal:** Sistema (ator automático) + Controller (valida).

**Pré-condições:**
- Empresa cadastrada (A1).

**Fluxo principal:**
1. Sistema carrega as tabelas universais no cadastro da empresa (A1, passo 8).
2. Controller pode atualizar as tabelas via I2.
3. Sistema suporta vigência por período (data inicial e final de validade).

**Exceções:**
- **EX1 — Tabela não encontrada:** bloqueia o cálculo que dependa dela.

**Pós-condições:**
- Tabelas carregadas.
- Vigência configurada.

**Regras de negócio:**
- **RN1** Tabelas trabalhistas são universais e **não adaptáveis** (federais).
- **RN2** Tabelas fiscais são universais, mas **adaptáveis por empresa** (tributos estaduais/municipais, benefícios).
- **RN3** Suporte a vigência por período.

**Telas envolvidas:**
- Tela "Parâmetros Fiscais e Trabalhistas" (dentro de A1 e I2).

---

### A5 — Configurar mapeamento referencial

**Nome:** Configurar mapeamento referencial (ECD/ECF).
**Objetivo:** Garantir que cada conta analítica do plano gerencial interno esteja vinculada a uma conta do Plano de Contas Referencial da Receita Federal.

**Ator principal:** Sistema (ator automático).

**Pré-condições:**
- Plano de contas criado (A1/A2).

**Fluxo principal:**
1. O mapeamento já vem embutido no plano sugerido (A1, RN4).
2. Contas novas (A2) herdam o mapeamento do plano sugerido ou o Controller informa manualmente.
3. Sistema valida que toda conta analítica tem mapeamento.

**Exceções:**
- **EX1 — Conta analítica sem mapeamento:** alerta (não bloqueia a fase 1, mas impede exportação futura).

**Pós-condições:**
- Mapeamento completo.

**Regras de negócio:**
- **RN1** Toda conta analítica deve ter mapeamento referencial.
- **RN2** O mapeamento é único por conta.

**Telas envolvidas:**
- Tela "Mapeamento Referencial" (dentro de A2).

---

### A6 — Abrir/fechar período

**Nome:** Abrir e fechar período contábil.
**Objetivo:** Executar o fechamento mensal (ou por filial) com checklist de pendências, consolidando cálculos e congelando o período.

**Ator principal:** Controller.

**Pré-condições:**
- Período no estado **Aberto** `[T5]`.

**Fluxo principal (fechamento):**
1. Controller acessa "Configuração > Período > Fechar".
2. Sistema seleciona a filial (ou "todas as filiais").
3. Sistema executa o **checklist de pendências** `[T6]`:
   - Se houver **Erros** não resolvidos: **bloqueia** e lista os erros.
   - Se houver apenas **Avisos**: exibe e pede **confirmação explícita**.
4. Sistema consolida folha (E3), depreciação (E4) e provisões (E5) se não foram lançadas.
5. Sistema congela o período (`[T5.4]`): status = "Fechado".
6. Sistema registra auditoria (quem fechou, quando, pendências existentes, confirmações).
7. Sistema **abre automaticamente o próximo período** no estado **Aberto**.
8. Sistema exibe resumo do fechamento.

**Fluxos alternativos:**
- **FA1 — Fechar todas as filiais:** Controller pode selecionar "todas as filiais" e o sistema executa o fechamento de cada uma.
- **FA2 — Fechamento com Avisos:** Controller confirma e o fechamento prossegue, com registro em auditoria.

**Exceções:**
- **EX1 — Erros não resolvidos:** bloqueia.
- **EX2 — Falha na consolidação de E3/E4/E5:** bloqueia.
- **EX3 — Falha na abertura do próximo período:** sistema mantém o período atual como "Em fechamento" e alerta.

**Pós-condições:**
- Período fechado.
- Próximo período aberto.
- Auditoria registrada.

**Regras de negócio:**
- **RN1** O fechamento é **por filial**, com opção "fechar todas" `[T5]`.
- **RN2** Erros bloqueiam; Avisos exigem confirmação `[T6]`.
- **RN3** Consolida E3, E4 e E5 se não lançados.
- **RN4** Congela o período `[T5.4]`.
- **RN5** Abre automaticamente o próximo período `[T5]`.
- **RN6** Registra auditoria do fechamento `[T5.6]`.

**Telas envolvidas:**
- Tela "Fechamento de Período" (seleção de filial, checklist, confirmação).
- Tela "Resumo do Fechamento".

---

### A7 — Reabrir período

**Nome:** Reabrir período (removido do escopo).
**Status:** **Removido do escopo** `[T5.4]`.

**Justificativa:** se algo precisar ser incluído retroativamente, entra no **período aberto atual**; a data de emissão original fica registrada como atributo do documento. O período fechado permanece intocado.

---

### A8 — Cadastrar filial

**Nome:** Cadastrar filial.
**Objetivo:** Permitir ao Controller cadastrar filiais adicionais à empresa matriz, cada uma com seu próprio CNPJ, endereço e CNAE.

**Ator principal:** Controller.

**Pré-condições:**
- Empresa cadastrada (A1).
- Período aberto `[T5]`.

**Fluxo principal:**
1. Controller acessa "Configuração > Filiais > Nova".
2. Sistema exibe formulário com campos: CNPJ, Razão Social, Nome Fantasia, IE, IM, endereço, município, CNAE, data de início.
3. Usuário informa os dados.
4. Sistema valida CNPJ (dígito verificador e unicidade).
5. Sistema cria a filial.
6. Sistema cria o **primeiro período** da filial no estado **Aberto** `[T5]`.
7. Sistema exibe resumo.

**Fluxos alternativos:**
- **FA1 — Editar filial:** Controller pode editar dados cadastrais.
- **FA2 — Desativar filial:** soft delete, se não houver lançamentos.

**Exceções:**
- **EX1 — CNPJ inválido:** bloqueia.
- **EX2 — CNPJ duplicado:** bloqueia.
- **EX3 — Filial com lançamentos:** não pode ser excluída; pode ser desativada.
- **EX4 — Data de início inválida:** alerta + confirmação.

**Pós-condições:**
- Filial criada.
- Primeiro período da filial aberto.
- Auditoria registrada.

**Regras de negócio:**
- **RN1** CNPJ validado e único.
- **RN2** A filial herda o regime fiscal, o setor e o plano de contas da empresa (não podem ser diferentes).
- **RN3** A filial pode ter CNAE diferente da matriz (para RAT e Terceiros).
- **RN4** A filial pode ter endereço/município diferente.
- **RN5** A filial não pode ser excluída se tiver lançamentos; pode ser desativada (soft delete).
- **RN6** O primeiro período da filial é criado automaticamente no estado **Aberto** `[T5]`.

**Telas envolvidas:**
- Tela "Cadastro de Filial".
- Tela "Resumo da Configuração".

---

## MÓDULO B — CADASTROS BÁSICOS

### B1 — Clientes

**Nome:** Cadastrar clientes.
**Objetivo:** Registrar os clientes da empresa, com dados mínimos para vendas e contas a receber.

**Ator principal:** Operador (ou Controller).

**Pré-condições:**
- Empresa cadastrada (A1).

**Fluxo principal:**
1. Operador acessa "Cadastros > Clientes > Novo".
2. Sistema exibe formulário: nome, CNPJ/CPF, contato, prazo padrão de recebimento.
3. Operador informa os dados.
4. Sistema valida documento (dígito verificador, conforme tipo PF/PJ).
5. Sistema cria o cliente com a tag "Cliente".
6. Sistema registra em auditoria.

**Fluxos alternativos:**
- **FA1 — Cliente já cadastrado como fornecedor:** sistema permite adicionar a tag "Cliente" ao registro existente (pessoa unificada).
- **FA2 — Cliente não cadastrado em importação:** sistema cria automaticamente com status "Cadastro incompleto" (RN4).

**Exceções:**
- **EX1 — Documento inválido:** bloqueia.
- **EX2 — Documento duplicado:** bloqueia (por empresa).

**Pós-condições:**
- Cliente cadastrado.
- Tag "Cliente" atribuída.

**Regras de negócio:**
- **RN1** Pessoa unificada (PF/PJ), com tags.
- **RN2** Documento validado conforme tipo (PF → CPF; PJ → CNPJ).
- **RN3** Documento único por empresa.
- **RN4** Cliente não cadastrado, quando aparece em documento importado, é **criado automaticamente** com status "Cadastro incompleto" (mesma lógica da RN11 da folha/C8).

**Telas envolvidas:**
- Tela "Cadastro de Clientes".
- Tela "Detalhes do Cliente".

---

### B2 — Fornecedores

**Nome:** Cadastrar fornecedores.
**Objetivo:** Registrar os fornecedores da empresa, com categoria padrão que alimenta o motor de classificação.

**Ator principal:** Operador (ou Controller).

**Pré-condições:**
- Empresa cadastrada (A1).

**Fluxo principal:**
1. Operador acessa "Cadastros > Fornecedores > Novo".
2. Sistema exibe formulário: nome, CNPJ/CPF, contato, **categoria padrão**, prazo padrão de pagamento.
3. Operador informa os dados.
4. Sistema valida documento.
5. Sistema cria o fornecedor com a tag "Fornecedor".
6. Sistema registra em auditoria.

**Fluxos alternativos:**
- **FA1 — Fornecedor já cadastrado como cliente:** adiciona a tag "Fornecedor".
- **FA2 — Fornecedor não cadastrado em importação:** criado automaticamente com status "Cadastro incompleto" (RN4).

**Exceções:**
- **EX1 — Documento inválido:** bloqueia.
- **EX2 — Documento duplicado:** bloqueia.

**Pós-condições:**
- Fornecedor cadastrado.
- Categoria padrão definida.
- Tag "Fornecedor" atribuída.

**Regras de negócio:**
- **RN1** Pessoa unificada (PF/PJ), com tags.
- **RN2** Documento validado e único.
- **RN3** A **categoria padrão** alimenta o motor de classificação (D1, prioridade 3).
- **RN4** Fornecedor não cadastrado é **criado automaticamente** com status "Cadastro incompleto".

**Telas envolvidas:**
- Tela "Cadastro de Fornecedores".
- Tela "Detalhes do Fornecedor".

---

### B3 — Funcionários

**Nome:** Cadastrar funcionários.
**Objetivo:** Registrar os funcionários da empresa, com dados contratuais e natureza (custo/despesa fixa).

**Ator principal:** Controller (ou Operador).

**Pré-condições:**
- Empresa cadastrada (A1).
- Centros de custo cadastrados (A3).

**Fluxo principal:**
1. Operador acessa "Cadastros > Funcionários > Novo".
2. Sistema exibe formulário: nome, CPF, cargo, departamento (centro de custo), salário base, data de admissão, **natureza (custo/despesa fixa)**, rateio (se aplicável).
3. Operador informa os dados.
4. Sistema valida CPF.
5. Sistema cria a pessoa física + tag "Funcionário" + registro em `funcionario`.
6. Sistema registra em auditoria.

**Fluxos alternativos:**
- **FA1 — Funcionário com múltiplos centros de custo (rateio):** sistema permite distribuir o custo entre centros (N:N).
- **FA2 — Funcionário não cadastrado em importação de folha/RPA:** criado automaticamente com status "Cadastro incompleto" (RN11 de C6/C7/C8).

**Exceções:**
- **EX1 — CPF inválido:** bloqueia.
- **EX2 — CPF duplicado:** bloqueia.
- **EX3 — Salário base inválido:** bloqueia.

**Pós-condições:**
- Funcionário cadastrado.
- Natureza definida (custo/despesa fixa).
- Tag "Funcionário" atribuída.

**Regras de negócio:**
- **RN1** A natureza (custo/despesa fixa) define a alocação no DRE (E3).
- **RN2** Funcionário não cadastrado em importação de folha/RPA é **criado automaticamente** com status "Cadastro incompleto".
- **RN3** Rateio por centro de custo é permitido (N:N).

**Telas envolvidas:**
- Tela "Cadastro de Funcionários".
- Tela "Detalhes do Funcionário".

---

### B4 — Ativos (patrimônios)

**Nome:** Cadastrar ativos (patrimônios).
**Objetivo:** Registrar os bens da empresa, com dados para cálculo de depreciação e alocação no DRE.

**Ator principal:** Controller.

**Pré-condições:**
- Empresa cadastrada (A1).
- Centros de custo cadastrados (A3).

**Fluxo principal:**
1. Controller acessa "Cadastros > Ativos > Novo".
2. Sistema exibe formulário: nome, data de aquisição, valor original, valor residual, vida útil (anos/meses), método de depreciação (linear padrão), centro de custo, **destino (custo/despesa)**, **mês inicial da depreciação** (sugestão: mês seguinte à aquisição, editável).
3. Controller informa os dados.
4. Sistema valida (valor original > residual, vida útil > 0).
5. Sistema cria o ativo.
6. Sistema registra em auditoria.

**Fluxos alternativos:**
- **FA1 — Ativo com método não linear:** soma dos dígitos e unidades produzidas (fase 2).
- **FA2 — Ativo com mês inicial diferente do sugerido:** permitido, com auditoria.

**Exceções:**
- **EX1 — Valor original ≤ residual:** bloqueia.
- **EX2 — Vida útil ≤ 0:** bloqueia.
- **EX3 — Alteração do mês inicial após primeiro lançamento:** exige reprocessamento (com auditoria).

**Pós-condições:**
- Ativo cadastrado.
- Mês inicial da depreciação definido.
- Destino (custo/despesa) definido.

**Regras de negócio:**
- **RN1** Método linear é o padrão. Soma dos dígitos e unidades produzidas ficam para fase 2.
- **RN2** Mês inicial da depreciação: sugestão padrão do mês seguinte à aquisição, editável.
- **RN3** Destino (custo/despesa) define a alocação no DRE (E4).
- **RN4** Após o primeiro lançamento de depreciação, alteração do mês inicial exige reprocessamento (com auditoria).

**Telas envolvidas:**
- Tela "Cadastro de Ativos".
- Tela "Detalhes do Ativo".

---

## MÓDULO C — ENTRADA DE DADOS

### C1 — Importar XMLs de NF-e em lote

**Nome:** Importar XMLs de NF-e em lote a partir de pastas ano/mês.
**Objetivo:** Alimentar o sistema com os dados das notas fiscais de mercadoria (entrada e saída), extraindo informações fundamentais e submetendo-as ao motor de classificação.

**Ator principal:** Operador / Auxiliar.
**Atores secundários:** Sistema (extrai, classifica, valida período).

**Pré-condições:**
- Empresa cadastrada (A1).
- Existe um período no estado **Aberto** (A6) `[T5]`.
- XMLs armazenados em pastas locais organizadas por ano/mês.

**Fluxo principal:**
1. Operador acessa "Entrada de Dados > Importar > NF-e".
2. Sistema solicita a pasta raiz ou permite selecionar ano/mês específico.
3. Operador seleciona e confirma.
4. Sistema varre a pasta, identifica XMLs e lista com status "Pendente de validação".
5. Para cada XML:
   - **Valida estrutura** (schema mínimo) → "Rejeitado — XML inválido" se falhar.
   - **Verifica se é NF-e cancelada** → "Cancelada — apenas histórico" (não gera lançamento) `[T5.5]`.
   - **Verifica duplicidade** (chave) → "Rejeitado — duplicidade".
   - **Verifica se o CNPJ da empresa está no XML** → "Rejeitado — empresa não identificada".
   - **Identifica a filial pelo CNPJ** (emitente/destinatário). Se não corresponder a nenhuma filial → **aviso** + escolha manual pelo operador.
   - **Compara a data de emissão com o período aberto** `[T5.3]`: dentro → "Aceito"; fora → "Aceito com aviso" (usuário confirma).
6. Sistema exibe **relatório de pré-validação**: aceitos, aceitos com aviso, canceladas, rejeitados (com motivos).
7. Operador revisa e confirma a importação dos aceitos (e, se houver, confirma os "aceitos com aviso").
8. Para cada XML aceito, o sistema:
   - Extrai dados: chave, data de emissão, número, série, emitente (fornecedor/cliente), destinatário, CFOP, NCM, CST, valores (produtos, frete, impostos, total).
   - Identifica se é **entrada** (compra) ou **saída** (venda) pela posição do CNPJ da empresa no XML.
   - Cria o **Documento** e os **Lançamentos** vinculados.
   - Submete cada lançamento ao **motor de classificação** (D1).
   - Gera **crédito/débito no razão de impostos** `[T7]` — via E1 (compra) ou E2 (venda).
   - Gera **contas a pagar** (F1) ou **contas a receber** (F2).
   - Marca status: "Classificado automaticamente" ou "Não classificado — requer intervenção".
9. Sistema exibe **relatório de importação**.
10. Operador é direcionado para a revisão (D3).

**Fluxos alternativos:**
- **FA1 — Importação de pasta única (sem separação ano/mês):** aceita, valida cada XML individualmente contra o período aberto.
- **FA2 — Importação de XML individual:** mesmo fluxo, um arquivo.
- **FA3 — Reimportação de XML rejeitado por período:** quando um novo período é aberto, o operador pode reimportar XMLs que estavam fora do período anterior.
- **FA4 — XML de NFS-e na pasta de NF-e:** o sistema detecta o tipo pelo schema e redireciona para o fluxo de NFS-e (C2), ou rejeita com aviso claro.

**Exceções:**
- **EX1 — Nenhum período aberto:** bloqueia `[T5]`.
- **EX2 — Pasta vazia ou sem XMLs:** informa e encerra.
- **EX3 — XML corrompido ou ilegível:** rejeitado com motivo.
- **EX4 — NF-e cancelada:** registrada apenas para histórico, ignorada em cálculos `[T5.5]`.
- **EX5 — Empresa não identificada no XML:** rejeitado.
- **EX6 — Falha no motor de classificação:** "Não classificado — requer intervenção".
- **EX7 — Importação interrompida:** retoma do ponto (mantém os já criados, marca os demais como "Pendente de processamento").
- **EX8 — Data de emissão fora do período aberto:** aceito com aviso + confirmação `[T5.3]`.
- **EX9 — Confirmação de data divergente não dada:** XML fica "Aguardando confirmação" e não é processado.
- **EX10 — Dados faltantes críticos** (ex: valor total ausente): "Importado com erro — completar dados críticos" `[T6]` (Erro).
- **EX11 — Dados faltantes não críticos:** "Importado com aviso" `[T6]` (Aviso).

**Pós-condições:**
- Documentos criados no período aberto (ou cancelados registrados).
- Lançamentos gerados e classificados (ou pendentes de revisão).
- Razão de impostos atualizado `[T7]`.
- Contas a pagar/receber geradas (F1/F2).
- Pendências registradas `[T6]`, se houver.
- Log de auditoria (confirmação de data divergente, reimportação).
- Relatório de importação disponível.

**Regras de negócio:**
- **RN1** `[T5]` Data de emissão dentro do período aberto → aceito sem aviso.
- **RN2** `[T5]` Data de emissão fora do período aberto → aceito com aviso + confirmação; integra o período aberto para todos os efeitos.
- **RN3** `[T5]` NF-e cancelada é registrada apenas para histórico, ignorada em cálculos.
- **RN4** Chave da NF-e é única — duplicidade rejeitada.
- **RN5** Identificação entrada/saída pela posição do CNPJ da empresa no XML.
- **RN6** Cada XML gera um **Documento** e um ou mais **Lançamentos** vinculados.
- **RN7** O motor de classificação (D1) é acionado para cada lançamento.
- **RN8** Lançamentos sem classificação automática entram em fila de revisão antes do fechamento `[T5]`.
- **RN9** O sistema preserva o XML original para auditoria.
- **RN10** `[T5]` A confirmação de inclusão com data divergente gera log de auditoria.
- **RN11** `[T6]` Dados faltantes críticos → Erro; não críticos → Aviso.
- **RN12** Nenhuma entrada é aceita em período fechado ou futuro `[T5]`.
- **RN13** A filial é identificada pelo CNPJ (emitente ou destinatário). Se não corresponder, o operador escolhe manualmente (com auditoria).

**Telas envolvidas:**
- Tela "Importar NF-e" (seleção de pasta, pré-validação, confirmação).
- Modal de confirmação de data divergente.
- Modal de escolha de filial (quando CNPJ não corresponde).
- Relatório de pré-validação.
- Relatório de importação.
- Tela de revisão (D3).
- Tela de documentos importados (consulta, reimportação de rejeitados).
- Tela de pendências `[T6]`.

---

### C2 — Importar XMLs de NFS-e em lote

**Nome:** Importar XMLs de NFS-e em lote a partir de pastas ano/mês.
**Objetivo:** Alimentar o sistema com os dados das notas fiscais de serviço (tomadas e prestadas), extraindo informações fundamentais e submetendo-as ao motor de classificação.

**Ator principal:** Operador / Auxiliar.
**Atores secundários:** Sistema (extrai, classifica, valida período).

**Pré-condições:**
- Empresa cadastrada (A1).
- Existe um período no estado **Aberto** (A6) `[T5]`.
- XMLs armazenados em pastas locais organizadas por ano/mês.

**Particularidades da NFS-e:**
- **Não tem CFOP nem NCM.** Tem **código de serviço** (item da LC 116/2003, geralmente 4 dígitos: `01.01`, `07.02`, etc.) e **código municipal** (varia por município).
- **Não tem CST de ICMS/IPI.** Tem **ISS** (alíquota municipal), **retenções** (ISS, IR, INSS, PIS/COFINS/CSLL quando o tomador retém) e **CBS/IBS** (fase teste, conforme LC 214/2025).
- **Prestador e tomador** definem se é receita (empresa prestadora) ou despesa (empresa tomadora).
- **XML de NFS-e varia muito por município** (padrão nacional ABRASF ainda em adoção desigual). O parser precisa ser tolerante.
- **RPA não é NFS-e.** Se um XML de RPA for encontrado na pasta de NFS-e, o sistema detecta e redireciona para o fluxo de RPA (C8), ou rejeita com aviso claro.

**Fluxo principal:**
1. Operador acessa "Entrada de Dados > Importar > NFS-e".
2. Sistema solicita a pasta raiz ou ano/mês específico.
3. Operador seleciona e confirma.
4. Sistema varre a pasta, identifica XMLs de NFS-e e lista com status "Pendente de validação".
5. Para cada XML:
   - **Valida estrutura** (schema mínimo) → "Rejeitado — XML inválido" se falhar.
   - **Verifica se é RPA** → redireciona para C8 ou "Rejeitado — RPA na pasta de NFS-e" (com aviso).
   - **Identifica a empresa:** CNPJ como **prestador** (→ receita) ou **tomador** (→ despesa/custo). Se não aparece → "Rejeitado — empresa não identificada".
   - **Verifica cancelamento** → "Cancelada — apenas histórico" `[T5.5]`.
   - **Verifica duplicidade** (chave) → "Rejeitado — duplicidade".
   - **Identifica a filial pelo CNPJ** (prestador/tomador). Se não corresponder a nenhuma filial → **aviso** + escolha manual.
   - **Compara a data de emissão com o período aberto** `[T5.3]`: dentro → "Aceito"; fora → "Aceito com aviso" (usuário confirma).
6. Sistema exibe **relatório de pré-validação** (aceitos, aceitos com aviso, canceladas, rejeitados, com erro/aviso).
7. Operador confirma importação dos aceitos (e, se houver, confirma os "aceitos com aviso").
8. Para cada XML aceito, o sistema:
   - Extrai: chave, data, número, série, prestador, tomador, código de serviço (LC 116), código municipal, discriminação, valores (serviço, deduções, base de cálculo, ISS, retenções, CBS/IBS), alíquota de ISS.
   - Cria o **Documento** e os **Lançamentos** vinculados:
     - **Prestadora:** Receita de Serviços + impostos sobre vendas + contas a receber.
     - **Tomadora:** Despesa/Custo + retenções + contas a pagar.
   - Submete cada lançamento ao **motor de classificação** (D1).
   - Gera **crédito/débito no razão de impostos** `[T7]`.
   - Marca status: "Classificado automaticamente" ou "Não classificado — requer intervenção".
9. Sistema exibe **relatório de importação**.
10. Operador direcionado para revisão (D3).

**Fluxos alternativos:**
- **FA1 — Importação de XML individual:** mesmo fluxo.
- **FA2 — Padrão municipal não reconhecido:** tenta parser genérico; se falhar, marca "Rejeitado — padrão não suportado" e registra o XML para análise (suporte futuro).
- **FA3 — NFS-e com retenções:** o sistema extrai as retenções e cria lançamentos específicos (Impostos a Recolher ou a Recuperar, conforme o caso).
- **FA4 — Informações faltantes:** não rejeita; importa com pendência `[T6]` e o lançamento fica "Importado com pendência — completar dados".

**Exceções:**
- **EX1 — Nenhum período aberto:** bloqueia `[T5]`.
- **EX2 — Pasta vazia ou sem NFS-e:** informa e encerra.
- **EX3 — XML corrompido ou ilegível:** rejeitado com motivo.
- **EX4 — NFS-e cancelada:** registrada apenas para histórico, ignorada em cálculos `[T5.5]`.
- **EX5 — Empresa não identificada:** rejeitado.
- **EX6 — Falha no motor de classificação:** "Não classificado — requer intervenção".
- **EX7 — Importação interrompida:** retoma do ponto.
- **EX8 — Data de emissão fora do período aberto:** aviso + confirmação `[T5.3]`.
- **EX9 — Confirmação de data divergente não dada:** "Aguardando confirmação".
- **EX10 — Código de serviço desconhecido:** sugere conta genérica de "Receita de Serviços" ou "Despesa com Serviços", marca para revisão e oferece criar regra (D4).
- **EX11 — Dados faltantes críticos:** "Importado com erro — completar dados críticos" `[T6]` (Erro).
- **EX12 — Dados faltantes não críticos:** "Importado com aviso" `[T6]` (Aviso).

**Pós-condições:**
- Documentos criados no período aberto (ou cancelados registrados).
- Lançamentos gerados e classificados (ou pendentes).
- Razão de impostos atualizado `[T7]`.
- Contas a pagar/receber geradas (F1/F2).
- Pendências registradas `[T6]`.
- Auditoria (confirmação de data divergente).
- Relatório de importação disponível.

**Regras de negócio:**
- **RN1** `[T5]` Período de competência = período de inclusão. Data fora → aviso + confirmação.
- **RN2** `[T5]` NFS-e cancelada é registrada apenas para histórico, ignorada em cálculos.
- **RN3** Identificação prestador/tomador pela posição do CNPJ da empresa no XML.
- **RN4** Chave da NFS-e é única — duplicidade rejeitada.
- **RN5** Cada XML gera um **Documento** e um ou mais **Lançamentos** vinculados.
- **RN6** O motor de classificação (D1) é acionado para cada lançamento.
- **RN7** Lançamentos sem classificação automática entram em fila de revisão antes do fechamento `[T5]`.
- **RN8** O sistema preserva o XML original para auditoria.
- **RN9** Retenções (ISS, IR, INSS, PIS/COFINS/CSLL) são extraídas e lançadas em contas específicas.
- **RN10** RPA não é NFS-e; XML de RPA na pasta é redirecionado (C8) ou rejeitado com aviso.
- **RN11** `[T6]` Informações faltantes críticas → Erro; não críticas → Aviso. Não rejeitam o XML.
- **RN12** `[T7]` Todo lançamento de imposto gera crédito ou débito no razão, conforme a natureza da operação.
- **RN13** A filial é identificada pelo CNPJ (prestador ou tomador). Se não corresponder, o operador escolhe manualmente (com auditoria).

**Telas envolvidas:**
- Tela "Importar NFS-e" (seleção de pasta, pré-validação, confirmação).
- Modal de confirmação de data divergente.
- Modal de escolha de filial.
- Relatório de pré-validação.
- Relatório de importação.
- Tela de revisão (D3).
- Tela de documentos importados.
- Tela de pendências `[T6]`.

---

### C3 — Importar XMLs de CT-e em lote

**Nome:** Importar XMLs de CT-e em lote a partir de pastas ano/mês.
**Objetivo:** Alimentar o sistema com os dados dos Conhecimentos de Transporte Eletrônicos (frete), extraindo informações fundamentais e submetendo-as ao motor de classificação.

**Ator principal:** Operador / Auxiliar.
**Atores secundários:** Sistema (extrai, classifica, valida período).

**Pré-condições:**
- Empresa cadastrada (A1).
- Existe um período no estado **Aberto** (A6) `[T5]`.
- XMLs armazenados em pastas locais organizadas por ano/mês.

**Particularidades do CT-e:**
- **É sempre serviço de transporte.** Para o **tomador**, é despesa (ou custo, se frete sobre compra de mercadoria). Para o **transportador**, é receita.
- **Tem ICMS sobre frete** (alíquota varia por estado; pode haver substituição tributária ou diferimento).
- **Pode estar vinculado a uma NF-e** (chave referenciada). Modalidade de frete:
  - **CIF (emitente paga):** para o vendedor, despesa variável (frete sobre venda); para o comprador, o frete já está no preço da mercadoria.
  - **FOB (destinatário paga):** para o comprador, custo de aquisição (compõe o custo da mercadoria) ou despesa, conforme o uso.
  - **Frete por conta de terceiros:** casos específicos.
- **Componentes de valor:** frete (peso, cubagem), valor da carga, pedágio, ICMS, etc.
- **Pode ter redespacho ou subcontratação** (CT-e vinculado a outro CT-e) — fase 2.

**Fluxo principal:**
1. Operador acessa "Entrada de Dados > Importar > CT-e".
2. Sistema solicita a pasta raiz ou ano/mês específico.
3. Operador seleciona e confirma.
4. Sistema varre a pasta, identifica XMLs de CT-e e lista com status "Pendente de validação".
5. Para cada XML:
   - **Valida estrutura** → "Rejeitado — XML inválido".
   - **Identifica a empresa:** CNPJ como **emitente (transportador)** → receita; **tomador** → despesa/custo. Se não aparece → "Rejeitado — empresa não identificada".
   - **Verifica cancelamento** → "Cancelado — apenas histórico" `[T5.5]`.
   - **Verifica duplicidade** (chave) → "Rejeitado — duplicidade".
   - **Identifica a filial pelo CNPJ** (emitente/tomador). Se não corresponder → **aviso** + escolha manual.
   - **Compara data de emissão com o período aberto** `[T5.3]`: dentro → "Aceito"; fora → "Aceito com aviso" (usuário confirma).
   - **Verifica dados faltantes:** críticos → "Importado com erro" `[T6]`; não críticos → "Importado com aviso" `[T6]`.
6. Sistema exibe **relatório de pré-validação** (aceitos, aceitos com aviso, cancelados, rejeitados, com erro/aviso).
7. Operador confirma importação dos aceitos (e, se houver, confirma os "aceitos com aviso").
8. Para cada XML aceito, o sistema:
   - Extrai: chave, data, número, série, emitente (transportador), tomador, remetente, destinatário, chave da NF-e vinculada, valores (frete, pedágio, ICMS, total), CFOP, natureza da operação, modalidade de frete (CIF/FOB).
   - Cria o **Documento** e os **Lançamentos** vinculados:
     - **Transportadora (emitente):** Receita de Serviços de Transporte + impostos sobre venda (ICMS sobre frete, CBS/IBS, PIS/COFINS) + contas a receber.
     - **Tomadora:** Despesa (frete sobre venda) ou Custo (frete sobre compra) + crédito de ICMS sobre frete (se aplicável ao regime) + contas a pagar.
   - Submete cada lançamento ao **motor de classificação** (D1).
   - Gera **crédito/débito no razão** `[T7]`.
   - Marca status.
9. Sistema exibe **relatório de importação**.
10. Operador direcionado para revisão (D3).

**Fluxos alternativos:**
- **FA1 — Importação de XML individual:** mesmo fluxo.
- **FA2 — CT-e sem NF-e vinculada** (frete avulso, carga própria): importa normalmente, sem vínculo.
- **FA3 — CT-e de frete CIF:** identifica pela modalidade e classifica como **despesa variável (frete sobre venda)** para o vendedor.
- **FA4 — CT-e de frete FOB:** identifica e classifica como **custo de aquisição** (compõe o custo da mercadoria) ou despesa, conforme o uso.
- **FA5 — NF-e vinculada não encontrada no sistema:** CT-e é importado com aviso ("NF-e vinculada não encontrada — vínculo pendente"). O vínculo pode ser feito depois manualmente.
- **FA6 — CT-e com ICMS-ST ou diferimento:** registra a informação e trata conforme parâmetros (a definir detalhamento na fase técnica).

**Exceções:**
- **EX1 — Nenhum período aberto:** bloqueia `[T5]`.
- **EX2 — Pasta vazia ou sem CT-e:** informa e encerra.
- **EX3 — XML corrompido ou ilegível:** rejeitado com motivo.
- **EX4 — CT-e cancelado:** registrado apenas para histórico, ignorado em cálculos `[T5.5]`.
- **EX5 — Empresa não identificada:** rejeitado.
- **EX6 — Falha no motor de classificação:** "Não classificado — requer intervenção".
- **EX7 — Importação interrompida:** retoma do ponto.
- **EX8 — Data de emissão fora do período aberto:** aviso + confirmação `[T5.3]`.
- **EX9 — Confirmação de data divergente não dada:** "Aguardando confirmação".
- **EX10 — Dados faltantes críticos:** "Importado com erro" `[T6]`.
- **EX11 — Dados faltantes não críticos:** "Importado com aviso" `[T6]`.

**Pós-condições:**
- Documentos criados no período aberto (ou cancelados registrados).
- Lançamentos gerados e classificados (ou pendentes).
- Vínculo com NF-e registrado (quando aplicável).
- Crédito/débito no razão `[T7]`.
- Pendências registradas `[T6]`.
- Auditoria (confirmação de data divergente).
- Relatório de importação disponível.

**Regras de negócio:**
- **RN1** `[T5]` Data fora → aviso + confirmação.
- **RN2** `[T5]` CT-e cancelado é registrado apenas para histórico, ignorado em cálculos.
- **RN3** Identificação transportador/tomador pela posição do CNPJ da empresa no XML.
- **RN4** Chave do CT-e é única — duplicidade rejeitada.
- **RN5** Cada XML gera um **Documento** e um ou mais **Lançamentos**.
- **RN6** O motor de classificação (D1) é acionado para cada lançamento.
- **RN7** Lançamentos sem classificação entram em fila de revisão antes do fechamento `[T5]`.
- **RN8** O sistema preserva o XML original para auditoria.
- **RN9** CT-e pode estar vinculado a uma NF-e; o sistema registra o vínculo.
- **RN10** A modalidade (CIF/FOB) determina a classificação gerencial:
  - **CIF:** despesa variável (frete sobre venda) para o vendedor.
  - **FOB:** custo de aquisição (compõe o custo da mercadoria) ou despesa, conforme o uso.
- **RN11** `[T7]` Todo lançamento de imposto (ICMS sobre frete, CBS/IBS, PIS/COFINS) gera crédito ou débito no razão.
- **RN12** `[T6]` Dados faltantes críticos → Erro; não críticos → Aviso.
- **RN13** Se a NF-e vinculada não existir no sistema, o CT-e é importado com aviso; vínculo pode ser feito depois.
- **RN14** CT-e com redespacho/subcontratação registra o vínculo entre CT-es (fase 2).
- **RN15** A filial é identificada pelo CNPJ (emitente ou tomador). Se não corresponder, o operador escolhe manualmente (com auditoria).

**Telas envolvidas:**
- Tela "Importar CT-e" (seleção de pasta, pré-validação, confirmação).
- Modal de confirmação de data divergente.
- Modal de escolha de filial.
- Relatório de pré-validação.
- Relatório de importação.
- Tela de revisão (D3).
- Tela de documentos importados (consulta, vínculos).
- Tela de pendências `[T6]`.

---

### C4 — Digitar lançamento manual individual

**Nome:** Digitar lançamento manual individual.
**Objetivo:** Permitir ao operador registrar um lançamento avulso (não vinculado a um documento fiscal importado), informando a operação, valor e forma de contrapartida, com sugestão do motor de classificação e montagem automática de partidas dobradas.

**Ator principal:** Operador / Auxiliar (ou Controller, em casos de ajuste).
**Atores secundários:** Sistema (sugere classificação, monta partidas, valida período, gera crédito/débito de impostos).

**Pré-condições:**
- Empresa cadastrada (A1).
- Existe um período no estado **Aberto** (A6) `[T5]`.
- Plano de contas ativo.
- Filial selecionada (a filial é obrigatória no lançamento manual).

**Quando usar:**
- Ajustes gerenciais (reclassificação, provisão manual).
- Lançamentos sem documento fiscal (tarifa bancária, rendimento de aplicação, depreciação manual, rateio).
- Correções de lançamentos importados (embora a correção tenha fluxo próprio em D3).

**Fluxo principal:**
1. Operador acessa "Entrada de Dados > Lançamento Manual".
2. Operador **seleciona a filial** (obrigatório).
3. Sistema exibe formulário simplificado:
   - **Data de competência** (padrão: hoje; editável) `[T5]`.
   - **Descrição da operação** (texto livre; obrigatório) — ex: "Compra de computador a prazo".
   - **Valor** (obrigatório).
   - **Conta de destino** (sugerida pelo motor de classificação com base na descrição e na contraparte).
   - **Forma de contrapartida** (à vista em caixa, à vista em banco X, a prazo, cartão, etc.).
   - **Contraparte** (cliente, fornecedor, funcionário — opcional; texto livre se não cadastrado).
   - **Centro de custo** (sugerido).
   - **Observações** (opcional).
4. Ao digitar a descrição e/ou selecionar a contraparte, o sistema **sugere a conta** (D1) e exibe o "porquê" (D2).
5. Operador pode **aceitar** ou **alterar** a conta. Ao alterar, o sistema oferece criar regra (D4).
6. Operador confirma.
7. Sistema valida:
   - Data dentro do período aberto? `[T5]`
   - Conta analítica (aceita lançamento)?
   - Valor > 0?
   - Campos obrigatórios preenchidos?
   - Contrapartida informada?
8. Sistema **monta as duas pernas automaticamente**:
   - **Débito** na conta de destino.
   - **Crédito** na conta de contrapartida (Contas a Pagar, Caixa, Banco, etc.), conforme a forma escolhida.
9. Sistema cria os dois lançamentos vinculados, ambos no período aberto, classificados.
10. Se o lançamento envolver imposto, gera **crédito/débito no razão** `[T7]`.
11. Sistema exibe confirmação e oferece "Novo lançamento" ou "Voltar".

**Fluxos alternativos:**
- **FA1 — Data fora do período aberto:** aviso + confirmação `[T5]`.
- **FA2 — Ver lançamento completo:** botão opcional que mostra as duas pernas (débito/crédito). Não é obrigatório.
- **FA3 — Lançamento vinculado a documento existente:** operador pode selecionar um documento (NF-e, NFS-e, CT-e) e o lançamento fica vinculado a ele.
- **FA4 — Rateio por centro de custo:** operador distribui o valor entre vários centros de custo; o sistema cria um par de lançamentos por centro. Fase 1.
- **FA5 — Lançamento recorrente:** fase 2.

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

**Exceções:**
- **EX1 — Nenhum período aberto:** bloqueia `[T5]`.
- **EX2 — Conta não analítica:** bloqueia.
- **EX3 — Valor inválido:** bloqueia.
- **EX4 — Campos obrigatórios ausentes:** bloqueia com indicação.
- **EX5 — Falha na sugestão de classificação:** permite seguir sem sugestão, mas marca "Não classificado — requer intervenção" `[T6]`.
- **EX6 — Data fora do período e usuário não confirma:** lançamento não é criado.
- **EX7 — Contrapartida não informada:** bloqueia (partidas dobradas exigem).
- **EX8 — Filial não selecionada:** bloqueia.

**Pós-condições:**
- Lançamento criado no período aberto (duas pernas).
- Classificado (ou pendente de revisão).
- Crédito/débito de imposto gerado, se aplicável `[T7]`.
- Pendências registradas `[T6]`, se houver.
- Auditoria (confirmação de data divergente, alteração de classificação).

**Regras de negócio:**
- **RN1** `[T5]` Período de competência = período de inclusão. Data fora → aviso + confirmação.
- **RN2** Conta deve ser analítica.
- **RN3** O motor de classificação (D1) é acionado ao digitar descrição/contraparte.
- **RN4** Alteração manual da sugestão oferece criação de regra (D4).
- **RN5** Lançamento sem classificação entra em fila de revisão `[T6]` antes do fechamento `[T5]`.
- **RN6** `[T7]` Lançamento em conta de imposto gera crédito/débito no razão.
- **RN7** Todo lançamento é em **partidas dobradas**; o sistema monta as duas pernas automaticamente a partir da operação e da forma de contrapartida.
- **RN8** Lançamento pode ser vinculado a documento existente.
- **RN9** Lançamento pode ter rateio por centro de custo (gera múltiplos pares).
- **RN10** O sistema só aceita se as duas pernas estiverem balanceadas (como o sistema monta, é automático).
- **RN11** A filial é obrigatória no lançamento manual.

**Telas envolvidas:**
- Tela "Lançamento Manual" (formulário simplificado).
- Modal "Ver lançamento completo" (opcional).
- Modal de confirmação de data divergente.
- Tela de revisão (D3) — se o lançamento ficar pendente.
- Tela de pendências `[T6]`.

---

### C5 — Digitar documento fiscal manualmente

**Nome:** Digitar documento fiscal manualmente (NF-e, NFS-e, CT-e ou RPA sem XML).
**Objetivo:** Permitir ao operador registrar um documento fiscal cujo XML não está disponível, informando os dados mínimos e submetendo-os ao motor de classificação e às partidas dobradas automáticas.

**Ator principal:** Operador / Auxiliar.
**Atores secundários:** Sistema (classifica, monta contrapartida, valida período, gera crédito/débito de impostos).

**Pré-condições:**
- Empresa cadastrada (A1).
- Existe um período no estado **Aberto** (A6) `[T5]`.
- Filial selecionada.

**Quando usar:**
- Documento fiscal sem XML disponível.
- Documento de sistema legado que não gera XML.
- RPA manual (o RPA importado é tratado no C8).
- Correção/complemento de documento importado (embora a correção tenha fluxo próprio em D3).

**Fluxo principal:**
1. Operador acessa "Entrada de Dados > Documento Manual".
2. Sistema solicita o **tipo de documento**: NF-e, NFS-e, CT-e ou RPA.
3. Sistema exibe formulário específico com campos mínimos:

   **NF-e (manual):** data, número, série, chave (opcional), fornecedor/cliente, CFOP, NCM (opcional), CST (opcional), valores (produtos, frete, impostos, total), natureza (entrada/saída).

   **NFS-e (manual):** data, número, série, chave (opcional), prestador/tomador, código de serviço (LC 116), código municipal (opcional), discriminação, valores (serviço, deduções, base, ISS, retenções, CBS/IBS, total), natureza (prestada/tomada).

   **CT-e (manual):** data, número, série, chave (opcional), transportador/tomador, chave da NF-e vinculada (opcional), modalidade (CIF/FOB), valores (frete, pedágio, ICMS, total), natureza (transportadora/tomadora).

   **RPA (manual):** data, número (opcional), beneficiário, valor bruto, retenções (INSS, IRRF, ISS, PIS/COFINS/CSLL, se aplicável), valor líquido, natureza (despesa/custo).

4. Operador preenche os campos. O sistema **sugere a conta** (D1) com base no tipo, CFOP/código de serviço, contraparte e histórico.
5. Operador pode aceitar ou alterar a conta. Ao alterar, oferece criar regra (D4).
6. Operador informa a **forma de contrapartida** (à vista, a prazo, banco X, etc.).
7. Operador confirma.
8. Sistema valida:
   - Data dentro do período aberto? `[T5]`
   - Campos obrigatórios preenchidos?
   - Valores consistentes?
   - Contrapartida informada?
9. Sistema cria o **Documento** e os **Lançamentos** em partidas dobradas (débito na conta de destino, crédito na contrapartida), além dos lançamentos de impostos e retenções.
10. Sistema gera **crédito/débito no razão** `[T7]`.
11. Sistema classifica e marca status.
12. Sistema exibe confirmação e oferece "Novo documento" ou "Voltar".

**Fluxos alternativos:**
- **FA1 — Data fora do período aberto:** aviso + confirmação `[T5]`.
- **FA2 — Documento vinculado a outro documento existente** (ex: CT-e → NF-e): operador informa a chave/vínculo.
- **FA3 — Documento com dados faltantes:** importa com pendência `[T6]` (Erro/Aviso) e o usuário completa depois.
- **FA4 — RPA com retenções:** o sistema calcula/extrai as retenções e lança nas contas específicas.

**Exceções:**
- **EX1 — Nenhum período aberto:** bloqueia `[T5]`.
- **EX2 — Tipo de documento não selecionado:** bloqueia.
- **EX3 — Campos obrigatórios ausentes:** bloqueia.
- **EX4 — Valores inconsistentes** (total ≠ soma das partes): aviso, com opção de confirmar.
- **EX5 — Contrapartida não informada:** bloqueia.
- **EX6 — Falha na sugestão de classificação:** permite seguir, marca "Não classificado — requer intervenção".
- **EX7 — Data fora do período e usuário não confirma:** documento não é criado.
- **EX8 — Filial não selecionada:** bloqueia.

**Pós-condições:**
- Documento criado no período aberto.
- Lançamentos em partidas dobradas gerados.
- Impostos e retenções lançados.
- Crédito/débito no razão `[T7]`.
- Pendências registradas `[T6]`.
- Auditoria (confirmação de data divergente).

**Regras de negócio:**
- **RN1** `[T5]` Data fora → aviso + confirmação.
- **RN2** Todo documento gera lançamentos em **partidas dobradas**.
- **RN3** O motor de classificação (D1) sugere a conta de destino; o operador pode aceitar ou alterar.
- **RN4** A contrapartida é obrigatória.
- **RN5** Lançamentos sem classificação entram em fila de revisão antes do fechamento `[T5]`.
- **RN6** `[T7]` Lançamentos de imposto geram crédito/débito no razão.
- **RN7** `[T6]` Dados faltantes críticos → Erro; não críticos → Aviso.
- **RN8** Documento pode ser vinculado a outro documento existente.
- **RN9** RPA é tratado como tipo de documento próprio, com retenções específicas.
- **RN10** A filial é obrigatória no documento manual.

**Telas envolvidas:**
- Tela "Documento Manual" (seleção de tipo, formulário específico).
- Modal de confirmação de data divergente.
- Tela de revisão (D3) — se pendente.
- Tela de pendências `[T6]`.

---

### C6 — Importar folha de pagamento

**Nome:** Importar folha de pagamento.
**Objetivo:** Alimentar o sistema com os dados da folha de pagamento (salários, encargos, retenções, provisões), calculando os valores reais de INSS, FGTS, IRRF e encargos quando necessário, e alocando o custo total por centro de custo.

**Ator principal:** Operador / Auxiliar (ou Controller).
**Atores secundários:** Sistema (calcula, classifica, valida período, gera crédito/débito de impostos).

**Pré-condições:**
- Empresa cadastrada (A1).
- Existe um período no estado **Aberto** (A6) `[T5]`.
- Funcionários cadastrados (B3) — ou serão criados automaticamente (RN11).
- Tabelas de INSS, IRRF e encargos vigentes carregadas.
- Cadastro de proventos/descontos configurado.
- Filial selecionada.

**Particularidades:**
- **Formato de importação a definir na fase técnica** (planilha, CSV, layout próprio).
- **Cálculo real** de INSS (patronal e empregado), FGTS, IRRF, RAT, Terceiros.
- **Provisões** de férias e 13º calculadas mensalmente (ou conforme configuração).
- **Alocação por centro de custo** (cada funcionário tem seu centro de custo padrão; rateio permitido).
- **Separação custo vs. despesa:** definida no cadastro do funcionário (B3).
- **Não emite holerite, recibo ou guia.** Apenas calcula e lança.

**Duas situações de cálculo (RN2):**
- **Folha real:** se o arquivo trouxer os valores calculados (INSS, FGTS, IRRF, encargos, provisões), o sistema **usa os valores reais**. Não recalcula.
- **Folha simulada/futura:** se o arquivo **não trouxer** os valores calculados, o sistema **calcula** com base nas tabelas vigentes.
- Se o arquivo trouxer **alguns** valores e outros não, o sistema usa os reais onde existirem e calcula os faltantes, com aviso.
- A tela de importação indica claramente qual modo está sendo usado.

**Fluxo principal:**
1. Operador acessa "Entrada de Dados > Importar > Folha de Pagamento".
2. Sistema solicita o **arquivo** (formato a definir) e o **período de referência**.
3. Operador seleciona e confirma.
4. Sistema lê o arquivo e lista os funcionários com status "Pendente de validação".
5. Para cada funcionário:
   - **Valida funcionário:** existe no cadastro? Se não → **cria automaticamente** com status "Cadastro incompleto" (RN11).
   - **Valida dados:** salário base, horas extras, adicionais, faltas, descontos. Dados faltantes críticos → "Importado com erro" `[T6]`; não críticos → "Importado com aviso" `[T6]`.
   - **Compara período de referência com o período aberto** `[T5.3]`: dentro → "Aceito"; fora → "Aceito com aviso" (usuário confirma).
6. Sistema exibe **relatório de pré-validação**.
7. Operador confirma a importação.
8. Para cada funcionário aceito, o sistema:
   - **Verifica se os valores vieram no arquivo:**
     - **Vieram:** usa os reais (RN2).
     - **Não vieram:** calcula INSS, IRRF, FGTS, RAT, Terceiros e provisões.
   - Calcula as **bases** respeitando as flags do cadastro de proventos/descontos.
   - Calcula o **valor líquido** a pagar.
9. Sistema cria o **Documento** (folha do período) e os **Lançamentos** em partidas dobradas:
   - **Débito:** Custo ou Despesa de Pessoal (conforme centro de custo e natureza do funcionário) — bruto + encargos patronais + provisões.
   - **Crédito:** Salários a Pagar (líquido), INSS a Recolher, FGTS a Recolher, IRRF a Recolher, Provisões a Pagar.
10. Sistema gera **crédito/débito no razão** `[T7]` para INSS, FGTS, IRRF.
11. Sistema classifica (D1) e marca status.
12. Sistema exibe **relatório de importação** (funcionários processados, valores calculados, encargos, provisões, pendências).
13. Operador direcionado para revisão (D3), se houver pendências.

**Fluxos alternativos:**
- **FA1 — Importação parcial** (apenas alguns funcionários): permitido, com aviso de folha incompleta.
- **FA2 — Reprocessamento:** se a folha já foi importada e o operador reimporta, o sistema **substitui** os lançamentos anteriores do período (com auditoria).
- **FA3 — Funcionário com múltiplos vínculos/centros de custo:** o sistema permite rateio do custo entre centros (fase 1).
- **FA4 — Funcionário admitido/demitido no mês:** cálculo proporcional aos dias trabalhados (fase 2).
- **FA5 — Férias e 13º:** calculados mensalmente (provisão) ou no mês de gozo/pagamento (a definir configuração).

**Exceções:**
- **EX1 — Nenhum período aberto:** bloqueia `[T5]`.
- **EX2 — Arquivo inválido ou ilegível:** rejeitado com motivo.
- **EX3 — Funcionário não cadastrado:** criado automaticamente com status "Cadastro incompleto" (RN11). Não rejeita.
- **EX4 — Dados faltantes críticos:** "Importado com erro" `[T6]`.
- **EX5 — Dados faltantes não críticos:** "Importado com aviso" `[T6]`.
- **EX6 — Período de referência fora do período aberto:** aviso + confirmação `[T5.3]`.
- **EX7 — Falha no cálculo** (tabela não carregada): bloqueia.
- **EX8 — Importação interrompida:** retoma do ponto.
- **EX9 — Filial não selecionada:** bloqueia.

**Pós-condições:**
- Documento de folha criado no período aberto.
- Lançamentos em partidas dobradas gerados.
- Crédito/débito no razão `[T7]`.
- Funcionários criados automaticamente, se aplicável.
- Pendências registradas `[T6]`.
- Relatório de importação disponível.
- Auditoria (confirmação de período divergente, reprocessamento).

**Regras de negócio:**
- **RN1** `[T5]` Período de competência = período de inclusão. Período de referência fora → aviso + confirmação.
- **RN2** O sistema usa **os valores reais do arquivo** quando existirem. Quando não existirem, **calcula** com base nas tabelas vigentes. O modo (real vs. calculado) é indicado na tela.
- **RN3** O custo total do funcionário é alocado no centro de custo, como custo ou despesa fixa, conforme cadastro (B3).
- **RN4** Todo lançamento é em **partidas dobradas**.
- **RN5** `[T7]` INSS, FGTS e IRRF geram crédito/débito no razão.
- **RN6** `[T6]` Dados faltantes críticos → Erro; não críticos → Aviso.
- **RN7** Reprocessamento substitui a consolidação anterior, com auditoria.
- **RN8** Rateio por centro de custo é permitido.
- **RN9** Provisões de férias e 13º são calculadas mensalmente (ou conforme configuração), **quando não vierem do arquivo**.
- **RN10** O sistema **não** emite holerite, recibo ou guia.
- **RN11** Funcionário não cadastrado é **criado automaticamente** com os dados do arquivo, com status "Cadastro incompleto — completar depois". Não é rejeitado.
- **RN12** As bases de cálculo (FGTS, INSS, IRRF) respeitam as **flags do cadastro de proventos/descontos**.
- **RN13** O detalhamento do cálculo (bruto, bases, encargos) é exibido ao operador para transparência.
- **RN14** A filial é obrigatória na importação de folha.

**Telas envolvidas:**
- Tela "Importar Folha" (seleção de arquivo, pré-validação, confirmação).
- Relatório de pré-validação.
- Relatório de importação (detalhamento por funcionário: bruto, bases, encargos, provisões, líquido).
- Tela de revisão (D3) — se pendente.
- Tela de pendências `[T6]`.

---

### C7 — Digitar folha de pagamento manualmente

**Nome:** Digitar folha de pagamento manualmente.
**Objetivo:** Permitir ao operador registrar a folha de pagamento de um período diretamente na tela, funcionário por funcionário, com cálculo automático ou uso de valores reais, e geração de lançamentos em partidas dobradas.

**Ator principal:** Operador / Auxiliar (ou Controller).
**Atores secundários:** Sistema (calcula, classifica, valida período, gera crédito/débito de impostos).

**Pré-condições:**
- Empresa cadastrada (A1).
- Existe um período no estado **Aberto** (A6) `[T5]`.
- Funcionários cadastrados (B3) — ou serão criados automaticamente (RN11).
- Tabelas de INSS, IRRF e encargos vigentes carregadas.
- Cadastro de proventos/descontos configurado.
- Filial selecionada.

**Quando usar:**
- Empresa pequena, com poucos funcionários, que prefere digitar em vez de importar.
- Correção/complemento da folha importada.
- Folha de um funcionário específico (ex: admissão no meio do mês).

**Fluxo principal:**
1. Operador acessa "Entrada de Dados > Folha de Pagamento > Digitar Manualmente".
2. Operador seleciona a **filial**.
3. Sistema solicita o **período de referência**.
4. Sistema exibe a **lista de funcionários** ativos no período, com campos por funcionário:
   - Salário base (pré-preenchido do cadastro).
   - **Proventos e descontos** (seleção do cadastro; não texto livre).
   - **Valores reais** (opcional): INSS empregado, IRRF, FGTS, encargos patronais, provisões — se o operador quiser informar valores reais.
   - Centro de custo (pré-preenchido do cadastro; editável).
5. Operador preenche os dados de cada funcionário (ou deixa em branco os que não quiser calcular agora).
6. Sistema **calcula** os valores faltantes (INSS, IRRF, FGTS, encargos, provisões), conforme RN2.
7. Operador pode **revisar** os valores calculados e, se quiser, **sobrescrever** com valores reais (override, com auditoria — RN12).
8. Operador confirma.
9. Sistema valida:
   - Período de referência dentro do período aberto? `[T5]`
   - Campos obrigatórios preenchidos?
10. Sistema cria o **Documento de Folha** e os **Lançamentos** em partidas dobradas:
    - Débito: Custo ou Despesa de Pessoal (por centro de custo).
    - Crédito: Salários a Pagar, INSS a Recolher, FGTS a Recolher, IRRF a Recolher, Provisões a Pagar.
11. Sistema gera **crédito/débito no razão** `[T7]`.
12. Sistema classifica (D1) e marca status.
13. Sistema exibe confirmação com resumo (total bruto, bases, encargos, provisões, líquido).

**Fluxos alternativos:**
- **FA1 — Período de referência fora do período aberto:** aviso + confirmação `[T5]`.
- **FA2 — Funcionário não cadastrado:** cadastro rápido na hora ou criação automática com status "Cadastro incompleto" (RN11).
- **FA3 — Funcionário admitido/demitido no mês:** cálculo proporcional (fase 2).
- **FA4 — Rateio por centro de custo:** operador distribui o custo do funcionário entre centros (fase 1).
- **FA5 — Reprocessamento:** se a folha já foi digitada, o operador pode **substituir** (com auditoria).
- **FA6 — Override de valores calculados:** o operador pode sobrescrever qualquer valor calculado pelo sistema (RN12).

**Exceções:**
- **EX1 — Nenhum período aberto:** bloqueia `[T5]`.
- **EX2 — Campos obrigatórios ausentes:** bloqueia.
- **EX3 — Falha no cálculo** (tabela não carregada): bloqueia.
- **EX4 — Período de referência fora do período e usuário não confirma:** folha não é criada.
- **EX5 — Valores inconsistentes** (ex: líquido negativo): aviso, com opção de confirmar.
- **EX6 — Filial não selecionada:** bloqueia.

**Pós-condições:**
- Documento de folha criado no período aberto.
- Lançamentos em partidas dobradas gerados.
- Crédito/débito no razão `[T7]`.
- Funcionários criados automaticamente, se aplicável (RN11).
- Pendências registradas `[T6]`.
- Auditoria (override, reprocessamento, confirmação de período divergente).

**Regras de negócio:**
- **RN1** `[T5]` Período de competência = período de inclusão. Período de referência fora → aviso + confirmação.
- **RN2** Valores reais informados são usados; valores ausentes são calculados pelo sistema. Modo indicado na tela.
- **RN3** Custo total alocado no centro de custo (custo ou despesa fixa).
- **RN4** Partidas dobradas.
- **RN5** `[T7]` INSS, FGTS e IRRF geram crédito/débito no razão.
- **RN6** `[T6]` Dados faltantes críticos → Erro; não críticos → Aviso.
- **RN7** Reprocessamento substitui a consolidação anterior, com auditoria.
- **RN8** Rateio por centro de custo permitido (fase 1).
- **RN9** Provisões calculadas mensalmente quando não informadas.
- **RN10** Não emite holerite, recibo ou guia.
- **RN11** Funcionário não cadastrado é criado automaticamente com status "Cadastro incompleto".
- **RN12** Override de valores calculados é permitido, com auditoria.
- **RN13** As bases de cálculo (FGTS, INSS, IRRF) respeitam as **flags do cadastro de proventos/descontos**.
- **RN14** O detalhamento do cálculo (bruto, bases, encargos) é exibido ao operador.
- **RN15** A filial é obrigatória na folha manual.

**Telas envolvidas:**
- Tela "Folha Manual" (lista de funcionários, campos por funcionário, cálculo automático, override).
- Modal de confirmação de período divergente.
- Modal de cadastro rápido de funcionário (FA2).
- Tela de revisão (D3) — se pendente.
- Tela de pendências `[T6]`.

---

### C8 — Importar RPA

**Nome:** Importar RPA (Recibo de Pagamento a Autônomo).
**Objetivo:** Alimentar o sistema com os dados dos RPAs (pagamentos a autônomos), calculando ou usando os valores reais de retenções (INSS, IRRF, ISS, PIS/COFINS/CSLL quando aplicável), e lançando como despesa ou custo.

**Ator principal:** Operador / Auxiliar.
**Atores secundários:** Sistema (calcula retenções quando necessário, classifica, valida período, gera crédito/débito de impostos).

**Pré-condições:**
- Empresa cadastrada (A1).
- Existe um período no estado **Aberto** (A6) `[T5]`.
- Tabelas de INSS, IRRF e ISS vigentes carregadas.
- Filial selecionada.

**Particularidades do RPA:**
- **É um documento próprio** (não é NFS-e, não é folha). Pagamento a **autônomo** (pessoa física sem vínculo empregatício).
- **Retenções típicas:** INSS (20% sobre o valor bruto, regra geral), IRRF (conforme tabela), ISS (conforme município e serviço), PIS/COFINS/CSLL (quando aplicável).
- **Pode ser despesa ou custo**, conforme o serviço prestado.
- **Não tem proventos/descontos como a folha** (é um valor bruto com retenções).
- **Formato de importação a definir na fase técnica.**

**Fluxo principal:**
1. Operador acessa "Entrada de Dados > Importar > RPA".
2. Operador seleciona a **filial**.
3. Sistema solicita o arquivo e o período de referência.
4. Operador seleciona e confirma.
5. Sistema lê o arquivo e lista os RPAs com status "Pendente de validação".
6. Para cada RPA:
   - **Valida beneficiário:** existe no cadastro? Se não → **cria automaticamente** com status "Cadastro incompleto" (RN11).
   - **Valida dados:** valor bruto, serviço prestado, retenções informadas. Dados faltantes críticos → "Importado com erro" `[T6]`; não críticos → "Importado com aviso" `[T6]`.
   - **Compara período de referência com o período aberto** `[T5.3]`: dentro → "Aceito"; fora → "Aceito com aviso" (usuário confirma).
7. Sistema exibe **relatório de pré-validação**.
8. Operador confirma a importação.
9. Para cada RPA aceito, o sistema:
   - **Verifica se as retenções vieram no arquivo:**
     - **Vieram:** usa os valores reais.
     - **Não vieram:** calcula INSS, IRRF, ISS e PIS/COFINS/CSLL conforme tabelas vigentes e natureza do serviço.
   - Calcula o **valor líquido** a pagar.
10. Sistema cria o **Documento** (RPA) e os **Lançamentos** em partidas dobradas:
    - **Débito:** Despesa ou Custo com Serviços de Autônomo.
    - **Crédito:** RPA a Pagar (líquido), INSS a Recolher, IRRF a Recolher, ISS a Recolher, PIS/COFINS/CSLL a Recolher (quando aplicável).
11. Sistema gera **crédito/débito no razão** `[T7]`.
12. Sistema classifica (D1) e marca status.
13. Sistema exibe **relatório de importação** (RPAs processados, retenções calculadas/informadas, líquido, pendências).
14. Operador direcionado para revisão (D3), se houver pendências.

**Fluxos alternativos:**
- **FA1 — RPA com data fora do período aberto:** aviso + confirmação `[T5]`.
- **FA2 — Beneficiário não cadastrado:** criado automaticamente com status "Cadastro incompleto" (RN11).
- **FA3 — RPA com retenções parciais** (algumas informadas, outras não): usa as reais e calcula as faltantes, com aviso.
- **FA4 — Reprocessamento:** substitui ou complementa, com auditoria.
- **FA5 — RPA de serviço com ISS retido pelo tomador:** o sistema registra o ISS como retido (crédito a recuperar ou débito a recolher, conforme o caso).

**Exceções:**
- **EX1 — Nenhum período aberto:** bloqueia `[T5]`.
- **EX2 — Arquivo inválido ou ilegível:** rejeitado.
- **EX3 — Beneficiário não cadastrado:** criado automaticamente (não rejeita).
- **EX4 — Dados faltantes críticos:** "Importado com erro" `[T6]`.
- **EX5 — Dados faltantes não críticos:** "Importado com aviso" `[T6]`.
- **EX6 — Período de referência fora do período e usuário não confirma:** RPA não é criado.
- **EX7 — Falha no cálculo de retenções:** bloqueia.
- **EX8 — Importação interrompida:** retoma do ponto.
- **EX9 — Filial não selecionada:** bloqueia.

**Pós-condições:**
- Documento RPA criado no período aberto.
- Lançamentos em partidas dobradas gerados.
- Crédito/débito no razão `[T7]`.
- Beneficiário criado automaticamente, se aplicável.
- Pendências registradas `[T6]`.
- Relatório de importação disponível.
- Auditoria (reprocessamento, confirmação de período divergente).

**Regras de negócio:**
- **RN1** `[T5]` Período de competência = período de inclusão. Período de referência fora → aviso + confirmação.
- **RN2** O sistema usa os valores reais de retenção quando informados; calcula os faltantes conforme tabelas vigentes.
- **RN3** RPA é tratado como **despesa ou custo** (não como folha), conforme a natureza do serviço.
- **RN4** Partidas dobradas.
- **RN5** `[T7]` INSS, IRRF, ISS e PIS/COFINS/CSLL geram crédito/débito no razão.
- **RN6** `[T6]` Dados faltantes críticos → Erro; não críticos → Aviso.
- **RN7** Reprocessamento substitui ou complementa, com auditoria.
- **RN8** Beneficiário não cadastrado é criado automaticamente com status "Cadastro incompleto" (RN11).
- **RN9** O sistema não emite recibo de RPA (apenas registra e calcula).
- **RN10** RPA pode ter ISS retido pelo tomador; o sistema trata conforme o caso (crédito a recuperar ou débito a recolher).
- **RN11** O cálculo de INSS (20%) é a regra geral, com opção de override para "não houve retenção".
- **RN12** O cálculo de ISS usa o cadastro de alíquotas por município/serviço, com fallback para pergunta ao operador.
- **RN13** RPA de serviço sem retenção de INSS é registrado sem retenção, com aviso de que a regra geral não se aplica.
- **RN14** A filial é obrigatória na importação de RPA.

**Telas envolvidas:**
- Tela "Importar RPA" (seleção de arquivo, pré-validação, confirmação).
- Relatório de pré-validação.
- Relatório de importação (detalhamento por RPA: bruto, retenções, líquido).
- Tela de revisão (D3) — se pendente.
- Tela de pendências `[T6]`.


### C9 — Importar cadastros em massa (CSV)

**Nome:** Importar cadastros em massa (CSV).
**Objetivo:** Popular o sistema com registros de cadastro (centros de custo, pessoas, produtos, serviços, ativos, funcionários, etc.) a partir de um arquivo CSV, na fase de **carga inicial**, com pré-validação em memória e relatório linha a linha.

**Ator principal:** Configurador (ou quem tem permissão de importar o recurso).
**Atores secundários:** Sistema (valida, grava, relata).

**Pré-condições:**
- Empresa cadastrada (A1).
- O usuário tem permissão de importar o recurso (via `config/importacoes.php`).
- O arquivo CSV está no formato do template do recurso (colunas obrigatórias + opcionais).

**Quando usar:**
- Carga inicial (implantação).
- Reimportação pontual (correção de carga).
- Migração de dados de sistema legado (quando o dado é cadastro).

**Fluxo principal:**
1. Usuário acessa **12.6 Importações** e escolhe a aba **"Importar cadastros"**.
2. Sistema exibe a **lista de recursos** que o usuário pode importar.
3. Usuário seleciona o recurso (ex: `centros_custo`).
4. Sistema oferece **"Baixar template"** (CSV do recurso).
5. Usuário faz upload do CSV e escolhe o **modo**: `inserir` (default), `atualizar` ou `upsert`.
6. Sistema faz **pré-validação em memória**:
   - Detecta encoding e separador.
   - Confere cabeçalho contra `colunasObrigatorias` + `colunasOpcionais`.
   - Valida cada linha (obrigatórios, tipos, unique, FK, regras específicas do recurso).
7. Sistema exibe o **`RelatorioCarga`** (pré-validação): aceitas, avisos, rejeitadas, com motivo por linha.
8. Usuário revisa e clica em **"Confirmar importação"**.
9. Sistema grava em **transação por linha**:
   - `inserir` — cria; se já existe, rejeita.
   - `atualizar` — atualiza; se não existe, rejeita.
   - `upsert` — insere ou atualiza por chave natural.
10. Sistema exibe o **`RelatorioCarga` pós-carga** (IDs criados/atualizados; rejeitadas com motivo).
11. Sistema registra em `auditorias` (`acao = 'importacao'`, `tabela = 'importacoes'`, `dados_anteriores` = resumo, `dados_novos` = IDs, `justificativa = 'Carga inicial: <recurso> (<modo>)'`).

**Fluxos alternativos:**
- **FA1 — Recurso composto:** para `pessoas`, `funcionarios`, `produtos`, `servicos` (criam 2–3 tabelas por linha), o importador faz o encadeamento (Pessoa + filha + tag; ProdutoServico + Produto; etc.) em **transação por linha**.
- **FA2 — Resolução de FK por código:** para `contas_bancarias` (template usa `codigo_banco`) e `ativos` (template usa `cnpj_filial`), o importador resolve `codigo/cnpj → id` antes de gravar.
- **FA3 — `filiais` sem período:** importar filial **cria a filial, mas NÃO abre período** (decisão 10.4 do `16`). Se a filial já tem período, o importador **falha na linha** com aviso claro.
- **FA4 — Modo `upsert`:** para reimportação (correção de carga), usa chave natural para atualizar em vez de duplicar.

**Exceções:**
- **EX1 — Nenhum recurso disponível:** informa que o usuário não tem permissão para importar nenhum recurso.
- **EX2 — Cabeçalho inválido** (coluna faltando): **rejeita o arquivo inteiro** (antes de processar qualquer linha).
- **EX3 — Encoding não detectado:** tenta UTF-8; se falhar, avisa e pede para salvar como UTF-8.
- **EX4 — Linha com erro:** a linha é rejeitada; as demais continuam. O `RelatorioCarga` mostra o motivo.
- **EX5 — Falha na transação de uma linha:** rollback **só daquela linha**; as demais continuam.
- **EX6 — Arquivo vazio:** informa e encerra.
- **EX7 — Recurso não autorizado:** o recurso não aparece na lista.
- **EX8 — Template desatualizado:** se o template do recurso mudou, o importador avisa (colunas extras/ faltando).

**Pós-condições:**
- Registros criados/atualizados nas tabelas de cadastro.
- `RelatorioCarga` disponível (pré e pós-carga).
- `auditorias` registrada.
- Nenhum lançamento, ordem, pendência ou handoff gerado (motor A não passa por T5–T8).

**Regras de negócio:**
- **RN1** Importação de cadastro é **carga inicial** (T9.1); não substitui a operação normal.
- **RN2** Motor A **não** gera lançamento (T7), ordem (T8) ou pendência (T6) — T9.2.
- **RN3** Pré-validação em memória obrigatória (T9.5).
- **RN4** Transação por linha (T9.6).
- **RN5** Modos: `inserir` (default), `atualizar`, `upsert` (T9.7).
- **RN6** Cada recurso tem template CSV (T9.13).
- **RN7** `pessoas` é Pessoa unificada (decisão 10.5).
- **RN8** `funcionarios` reaproveita `pessoas` (PF) + tag `'Funcionário'` + `funcionarios` (decisão 10.5/10.11).
- **RN9** `filiais` não cria período (decisão 10.4).
- **RN10** `ativos` e `contas_bancarias` resolvem FK por código/cnpj (decisões 10.7/10.8).
- **RN11** Auditoria em `auditorias` (`acao = 'importacao'`); sem tabela nova (T9.8).
- **RN12** Síncrono (T9.9).

**Telas envolvidas:**
- Tela 12.6 — aba "Importar cadastros" (lista de recursos; template; upload; pré-validação; confirmação; relatório).

---

### C10 — Importar contas a pagar/receber do legado (CSV)

**Nome:** Importar contas a pagar/receber do legado (CSV).
**Objetivo:** Popular o sistema com contas a pagar/receber **sem nota fiscal de origem** (dados de sistema legado), na fase de **carga inicial**, com pré-validação em memória e relatório linha a linha.

**Ator principal:** Configurador (ou Contador/Financeiro1/Financeiro2, se autorizado).
**Atores secundários:** Sistema (valida, grava, relata, gera lançamento avulso).

**Pré-condições:**
- Empresa cadastrada (A1).
- Filial cadastrada (A8).
- Pessoa (fornecedor/cliente) cadastrada (B2/B1) — ou o importador **não** cria automaticamente (legado tem `id_pessoa` obrigatório).
- O usuário tem permissão de importar o recurso.

**Quando usar:**
- Carga inicial (implantação), quando o sistema legado tem contas em aberto.
- Migração de dados.

**Fluxo principal:**
1. Usuário acessa **12.6 Importações** → aba **"Importar cadastros"** (motor C fica dentro do A).
2. Sistema exibe os recursos `contas_pagar_legado` e `contas_receber_legado`.
3. Usuário seleciona o recurso, baixa o template e faz upload.
4. Sistema faz **pré-validação em memória** (igual ao C9):
   - Obrigatórios (`id_filial`/`cnpj_filial`, `id_pessoa`/`documento_pessoa`, `numero_parcela`, `total_parcelas`, `valor`, `data_emissao`, `data_vencimento`, `status`).
   - Tipos (data, decimal, int).
   - FK (`id_filial`, `id_pessoa`).
   - Regras específicas: `id_nota_fiscal = NULL`, `dados_extras.origem = 'legado'`.
5. Sistema exibe o **`RelatorioCarga`** (pré-validação).
6. Usuário confirma.
7. Sistema grava em **transação por linha**:
   - Cria `contas_pagar`/`contas_receber` com `id_nota_fiscal = NULL`, `dados_extras.origem = 'legado'`.
   - **`DocumentoService`** cria `lancamentos` avulsos (`id_nota_fiscal = NULL`, `id_nota_fiscal_item = NULL`) e, se aplicável, `razoes_impostos` (`id_nota_fiscal = NULL`).
   - **Ator de origem do handoff = quem importou** (o `id_usuario` da sessão).
8. Sistema exibe o **`RelatorioCarga` pós-carga**.
9. Sistema registra em `auditorias`.

**Fluxos alternativos:**
- **FA1 — Modo `upsert`:** reimportação (correção de carga) usa chave natural `(id_filial, id_pessoa, numero_parcela, total_parcelas, data_vencimento)` para atualizar em vez de duplicar.
- **FA2 — Pessoa não cadastrada:** o importador **não cria** a pessoa automaticamente (legado tem `id_pessoa` obrigatório); a linha é rejeitada com aviso.
- **FA3 — Sem nota fiscal:** sempre (`id_nota_fiscal = NULL`); a conta é legada por definição.

**Exceções:**
- **EX1 — Pessoa não existe:** rejeita a linha (legado tem `id_pessoa` obrigatório).
- **EX2 — Filial não existe:** rejeita a linha.
- **EX3 — Soma das parcelas ≠ valor total:** avisa (não bloqueia; carga inicial pode ter divergência).
- **EX4 — Data de vencimento retroativa ao período fechado:** avisa (T5).
- **EX5 — Lançamento avulso falha:** rollback **só daquela linha**.
- **EX6 — Recurso não autorizado:** não aparece na lista.
- **EX7 — Sem migration:** `contas_pagar`/`contas_receber` aceitam `id_nota_fiscal = NULL`; `lancamentos` aceitam `id_nota_fiscal`/`id_nota_fiscal_item = NULL` (confirmado no `SHOW COLUMNS`).

**Pós-condições:**
- Contas a pagar/receber criadas com `id_nota_fiscal = NULL` e `dados_extras.origem = 'legado'`.
- Lançamentos avulsos criados (`id_nota_fiscal = NULL`, `id_nota_fiscal_item = NULL`).
- `razoes_impostos` (se aplicável) com `id_nota_fiscal = NULL`.
- `RelatorioCarga` disponível.
- `auditorias` registrada.
- **Sem migration.**

**Regras de negócio:**
- **RN1** Conta legada tem `id_nota_fiscal = NULL` e `dados_extras.origem = 'legado'` (decisão 10.9).
- **RN2** Ator de origem do handoff = **quem importou** (decisão 10.9).
- **RN3** `id_pessoa` obrigatório; o importador **não** cria pessoa automaticamente (legado tem a FK).
- **RN4** Lançamento avulso (`id_nota_fiscal = NULL`, `id_nota_fiscal_item = NULL`) — sem migration (T9.11).
- **RN5** `razoes_impostos` com `id_nota_fiscal = NULL` (se aplicável).
- **RN6** Pré-validação em memória (T9.5).
- **RN7** Transação por linha (T9.6).
- **RN8** Modo `upsert` por chave natural (T9.7).
- **RN9** Auditoria em `auditorias` (T9.8).
- **RN10** Síncrono (T9.9).
- **RN11** Motor C é motor A com regra própria (T9.4).

**Telas envolvidas:**
- Tela 12.6 — aba "Importar cadastros" (lista de recursos; template; upload; pré-validação; confirmação; relatório).

---

### I6 — UI do módulo Importações (12.6)

**Nome:** Operar a UI do módulo Importações (12.6).
**Objetivo:** Oferecer ao usuário autorizado a **tela única** do módulo Importações, com as 2 abas (cadastro/documento), a lista de recursos que ele pode importar, download de template, upload, pré-validação, confirmação e relatório.

**Ator principal:** Qualquer usuário com permissão de importar (via `config/importacoes.php`).
**Atores secundários:** Sistema (filtra recursos por ator; valida; grava; relata).

**Pré-condições:**
- Usuário logado.
- Filial selecionada.
- Período aberto (para motor B; motor A não exige).

**Quando usar:**
- Carga inicial (C9, C10, C1–C8).
- Reimportação pontual.

**Fluxo principal:**
1. Usuário acessa **12.6 Importações**.
2. Sistema exibe **2 abas**: **"Importar cadastros"** (motor A/C) e **"Importar documentos"** (motor B).
3. Em cada aba, o sistema exibe a **lista de recursos** que o usuário pode importar (filtrada por `atores` no `config/importacoes.php`).
4. Usuário seleciona um recurso → sistema oferece:
   - **"Baixar template"** (CSV).
   - **Upload** do arquivo (CSV para cadastro; XML/CSV para documento).
   - **Modo** (só motor A: `inserir`/`atualizar`/`upsert`).
5. Sistema faz **pré-validação em memória** e exibe o **`RelatorioCarga`** (aceitas/avisos/rejeitadas, com motivo por linha/documento).
6. Usuário revisa e clica em **"Confirmar importação"**.
7. Sistema grava em **transação por linha/documento**.
8. Sistema exibe o **`RelatorioCarga` pós-carga** (IDs criados/atualizados; rejeitadas com motivo).
9. Sistema registra em `auditorias`.

**Fluxos alternativos:**
- **FA1 — Ator sem permissão:** a aba mostra "Nenhum recurso disponível para você" (ou a aba não aparece).
- **FA2 — Motor B com documento `aguardando_confirmacao`** (data fora do período): o `RelatorioCarga` mostra o status e o operador confirma (T5.3).
- **FA3 — Motor B com `aviso + escolha manual de filial`:** o `RelatorioCarga` mostra o aviso e o operador escolhe a filial (C1 FA3).
- **FA4 — Link para revisão (D3):** no `RelatorioCarga` pós-carga do motor B, cada documento aceito tem link para a revisão (D3) — o operador é direcionado.

**Exceções:**
- **EX1 — Nenhum recurso disponível:** informa.
- **EX2 — Upload falha:** informa.
- **EX3 — Arquivo vazio:** informa.
- **EX4 — Encoding não detectado:** avisa.
- **EX5 — Pré-validação falha:** mostra o erro.

**Pós-condições:**
- Arquivo processado (pré-validação).
- Gravação (se confirmado).
- `RelatorioCarga` exibido (pré e pós).
- `auditorias` registrada.
- Nada é alterado se o operador não confirmar.

**Regras de negócio:**
- **RN1** A UI é **transversal** (12.6), não por ator (T9.10).
- **RN2** Cada ator vê **só os recursos que pode importar**.
- **RN3** 2 abas: cadastro (motor A/C) e documento (motor B).
- **RN4** Template para download em cada recurso.
- **RN5** Pré-validação em memória obrigatória (T9.5).
- **RN6** Confirmação explícita (nada é gravado sem confirmar).
- **RN7** `RelatorioCarga` pré e pós.
- **RN8** Auditoria em `auditorias`.
- **RN9** Motor A não exige período aberto; motor B sim (T5).
- **RN10** Motor A não gera lançamento/ordem/pendência (T9.2).

**Telas envolvidas:**
- Tela 12.6 — Importações (2 abas).

---

## MÓDULO D — CLASSIFICAÇÃO AUTOMÁTICA

### D1 — Sugestão de classificação automática

**Nome:** Sugerir classificação automática de lançamento.
**Objetivo:** Dado um lançamento (importado ou digitado), sugerir a **conta de destino**, o **centro de custo** e a **contrapartida**, com base em regras, histórico e contexto, exibindo o "porquê" da sugestão e permitindo ao operador aceitar, alterar ou rejeitar.

**Ator principal:** Sistema (ator automático).
**Atores secundários:** Operador (aceita/altera/rejeita), Controller (gerencia regras — D5).

**Pré-condições:**
- Empresa cadastrada, plano de contas ativo (A1).
- Existe um lançamento a classificar (C1–C8, C4).
- Existem regras de classificação cadastradas (D5) — ou o sistema usa o fallback.

**Quando é acionado:**
- Durante a importação de documentos (C1, C2, C3, C6, C8).
- Durante a digitação manual (C4, C5, C7).
- Sob demanda, na tela de revisão (D3).

**Fontes de regra (ordem de prioridade):**

| Prioridade | Fonte | Exemplo |
| :--- | :--- | :--- |
| 1 | **Regra específica** | Fornecedor X + CFOP Y → Conta Z |
| 2 | **Regra por CFOP** | CFOP 1102 → Custo > CMV |
| 3 | **Regra por Categoria do Fornecedor** | Categoria "Mercadoria para Revenda" → Custo > CMV |
| 4 | **Regra por NCM** | NCM de combustível → Despesa > Combustível |
| 5 | **Regra por código de serviço (LC 116)** | Código 01.01 → Receita de Serviços |
| 6 | **Regra por histórico/descrição** | "Tarifa bancária" → Despesa Financeira > Tarifas |
| 7 | **Histórico de classificações** | Mesmo fornecedor + mesmo NCM já classificado antes → mesma conta |
| 8 | **Fallback** | Sistema não encontra regra → pergunta ao usuário (D2) |

**Fluxo principal:**
1. Sistema recebe um lançamento a classificar.
2. Sistema extrai o **contexto**: tipo de documento, CFOP, NCM, código de serviço, fornecedor/cliente, categoria do fornecedor, histórico/descrição, valor, natureza (entrada/saída).
3. Sistema percorre as **fontes de regra em ordem de prioridade**:
   - Se encontra regra aplicável → usa a conta de destino e o centro de custo da regra.
   - Se encontra mais de uma regra na mesma prioridade → aplica a **mais específica** (ex: fornecedor + CFOP é mais específica que só CFOP) ou, se ambíguo, registra como **conflito** (FA3).
   - Se não encontra nenhuma regra → **fallback** (passo 5).
4. Sistema monta a **sugestão completa**:
   - Conta de destino (débito ou crédito, conforme a natureza).
   - Contrapartida (conta a pagar/receber, caixa, banco — conforme a forma de pagamento informada ou padrão).
   - Centro de custo.
   - **Justificativa:** qual regra foi aplicada e por quê.
5. **Fallback (nenhuma regra encontrada):**
   - Sistema sugere uma conta **genérica** (ex: "Despesa a Classificar" ou "Custo a Classificar") e marca o lançamento como **"Não classificado — requer intervenção"**.
   - Registra pendência `[T6]` como **Erro** (bloqueia fechamento até ser classificado).
   - Na tela de revisão (D3), o operador pode classificar manualmente e, ao fazê-lo, o sistema oferece criar regra (D4).
6. Sistema exibe a sugestão ao operador (na tela de revisão, D3, ou durante a importação).
7. Operador **aceita, altera ou rejeita** a sugestão (D3).
8. Se o operador **altera**, o sistema pergunta se deseja **criar regra** para futuros lançamentos iguais (D4).
9. Sistema registra a classificação final e o status ("Classificado automaticamente", "Classificado manualmente", "Não classificado").

**Fluxos alternativos:**
- **FA1 — Sugestão com confiança alta:** se a regra aplicada é específica (prioridade 1 ou 2) e não há conflito, o sistema pode **classificar automaticamente** sem exigir revisão (configurável pelo Controller em D5). O lançamento fica "Classificado automaticamente — revisão opcional".
- **FA2 — Sugestão com confiança baixa:** se a regra aplicada é genérica (prioridade 5, 6 ou 7) ou veio do fallback, o lançamento fica "Classificado automaticamente — revisão recomendada" e entra na fila de revisão (D3).
- **FA3 — Conflito de regras:** se duas regras de mesma prioridade apontam para contas diferentes, o sistema **não escolhe sozinho**: marca como "Conflito de regras — requer intervenção" e exibe as duas opções ao operador, com o "porquê" de cada uma.
- **FA4 — Lançamento com rateio:** se a regra prevê rateio por centro de custo (ex: aluguel rateado entre departamentos), o sistema sugere o rateio conforme a regra (percentuais pré-definidos) e permite ajuste.
- **FA5 — Lançamento vinculado a documento:** se o lançamento é parte de um documento (ex: NF-e com vários itens), o sistema classifica **item a item**, podendo usar regras diferentes para cada item (ex: NCM diferentes).
- **FA6 — Reclassificação:** se o operador altera a classificação de um lançamento já classificado, o sistema registra a alteração (auditoria) e oferece criar regra (D4).

**Exceções:**
- **EX1 — Nenhuma regra e fallback não configurado:** sistema bloqueia a classificação e exige que o Controller configure o fallback (D5).
- **EX2 — Contexto insuficiente** (ex: XML sem CFOP nem NCM nem código de serviço): sistema vai direto para fallback.
- **EX3 — Regra aponta para conta inativa:** sistema ignora a regra e passa para a próxima prioridade; registra aviso.
- **EX4 — Erro no motor de classificação:** lançamento fica "Não classificado — requer intervenção"; pendência registrada `[T6]`.
- **EX5 — Operador rejeita a sugestão sem indicar nova conta:** lançamento fica "Não classificado — requer intervenção".

**Pós-condições:**
- Lançamento classificado (automática ou manualmente) **ou** marcado como "Não classificado — requer intervenção".
- Justificativa registrada (qual regra, por quê).
- Pendência registrada se não classificado `[T6]`.
- Se houve alteração manual, oferta de criação de regra (D4) registrada.
- Auditoria (alterações, reclassificações, conflitos resolvidos).

**Regras de negócio:**
- **RN1** A ordem de prioridade das fontes de regra é fixa (1 a 8), mas o Controller pode **ajustar a prioridade** de regras específicas (D5).
- **RN2** Toda sugestão deve exibir o **"porquê"** (qual regra, qual contexto).
- **RN3** Conflito de regras de mesma prioridade **não é resolvido automaticamente** — exige intervenção do operador.
- **RN4** Fallback sempre existe (conta genérica "a classificar") e registra pendência como **Erro** `[T6]`.
- **RN5** Classificação automática de confiança alta pode dispensar revisão (configurável); confiança baixa **sempre** entra na fila de revisão (D3).
- **RN6** Alteração manual de classificação oferece criação de regra (D4).
- **RN7** Classificação é feita **item a item** em documentos com múltiplos itens.
- **RN8** Regra que aponta para conta inativa é ignorada (aviso registrado).
- **RN9** `[T5]` O motor de classificação **nunca** altera dados de períodos fechados.

**Telas envolvidas:**
- Tela de revisão de lançamentos (D3) — onde a sugestão é exibida e o operador decide.
- Modal "Por que esta conta?" (D2).
- Modal "Criar regra para futuros lançamentos?" (D4).
- Tela de conflitos (lista de lançamentos com conflito de regras).
- Tela de pendências `[T6]`.

---

### D2 — Exibição do "porquê" da sugestão

**Nome:** Exibir justificativa da sugestão de classificação.
**Objetivo:** Comunicar ao operador, de forma clara e auditável, **por que** o sistema sugeriu aquela conta, aquele centro de custo e aquela contrapartida, permitindo que ele decida com confiança.

**Ator principal:** Sistema (ator automático).
**Atores secundários:** Operador (consulta e decide).

**Pré-condições:**
- Existe uma sugestão de classificação gerada pelo D1.
- O operador está na tela de revisão (D3) ou em qualquer tela onde a sugestão é exibida.

**Quando é exibido:**
- **Sempre** que uma sugestão é apresentada ao operador (resumo visível).
- **Sob demanda**, quando o operador clica em "Por que esta conta?" (detalhe).

**Princípios de comunicação:**
1. **Linguagem do usuário, não do contador.** Ex: "Sugerido como Custo > CMV porque o CFOP 1102 indica compra para revenda" (não "Débito em 3.1.1 conforme regra R-042").
2. **Mostrar a regra aplicada, não a implementação.** "Regra: Fornecedor X + CFOP 1102 → Custo > CMV".
3. **Mostrar o contexto usado.** CFOP, NCM, fornecedor, categoria, histórico, etc.
4. **Mostrar a prioridade.** Se a regra aplicada foi de prioridade 1 (específica) ou 5 (genérica), isso deve ficar claro — ajuda o operador a calibrar a confiança.
5. **Mostrar o que NÃO foi usado** (em "detalhes", opcional). Se havia uma regra de prioridade menor que também se aplicaria, mas foi sobreposta por uma de prioridade maior.
6. **Auditável.** A justificativa fica registrada no lançamento, para consulta futura.

**Fluxo principal:**
1. Operador visualiza o lançamento na tela de revisão.
2. Ao lado da conta sugerida, há um ícone/botão "Por que?".
3. Operador clica.
4. Sistema exibe um **painel de justificativa** com:
   - **Conta sugerida:** Custo > CMV.
   - **Regra aplicada:** "Fornecedor ABC + CFOP 1102 → Custo > CMV" (prioridade 1 — específica).
   - **Contexto considerado:** Fornecedor ABC (categoria: Mercadoria para Revenda), CFOP 1102, NCM 1234.56.78.
   - **Centro de custo sugerido:** "Comercial" (regra: centro de custo padrão do fornecedor).
   - **Contrapartida sugerida:** "Fornecedores" (forma de pagamento: a prazo).
   - **Confiança:** Alta (regra específica, sem conflito).
   - **Alternativas consideradas** (em "detalhes", opcional): "Regra por CFOP 1102 → Custo > CMV (prioridade 2, sobreposta pela regra específica)".
5. Operador lê e decide (aceitar, alterar, rejeitar).
6. A justificativa fica registrada no lançamento.

**Fluxos alternativos:**
- **FA1 — Justificativa em lote:** operador seleciona vários lançamentos e vê um **resumo das justificativas** (ex: "10 lançamentos classificados por regra específica, 3 por CFOP, 2 por fallback"). Fase 1.
- **FA2 — Justificativa de conflito:** exibe as **duas regras em conflito** e o "porquê" de cada uma, para o operador escolher.
- **FA3 — Justificativa de fallback:** exibe "Nenhuma regra aplicável. Classifique manualmente." e lista as fontes de contexto verificadas.
- **FA4 — Justificativa de classificação manual:** registra "Classificado manualmente pelo operador em [data/hora]. Regra sugerida originalmente: [X]. Conta escolhida: [Y]."

**Exceções:**
- **EX1 — Justificativa não disponível** (lançamento antigo, de antes da implementação do D2): sistema exibe "Justificativa não disponível para este lançamento".
- **EX2 — Regra foi alterada depois da classificação:** sistema exibe "A regra aplicada foi alterada posteriormente. Justificativa original: [X]. Regra atual: [Y]." (auditoria preservada).

**Pós-condições:**
- Operador informado sobre o "porquê" da sugestão.
- Justificativa registrada no lançamento (auditável).
- Decisão do operador registrada.

**Regras de negócio:**
- **RN1** Toda sugestão exibe justificativa em linguagem do usuário.
- **RN2** A justificativa mostra a regra aplicada, o contexto considerado, a prioridade e a confiança.
- **RN3** A justificativa fica **registrada** no lançamento, não apenas exibida.
- **RN4** Se a regra for alterada depois, a justificativa original é preservada (auditoria).
- **RN5** Conflitos exibem as duas (ou mais) regras em conflito.
- **RN6** Fallback exibe "nenhuma regra aplicável" e lista o que foi verificado.
- **RN7** Classificação manual exibe a sugestão original e a escolha do operador.
- **RN8** Justificativa é exibida em **português claro**, sem jargão desnecessário.

**Telas envolvidas:**
- Painel "Por que esta conta?" (modal ou lateral na tela de revisão).
- Tela de revisão (D3) — onde o botão "Por que?" aparece.
- Tela de detalhes do lançamento (consulta posterior da justificativa).
- Relatório de auditoria de classificações (para o Controller).

---

### D3 — Tela de revisão de lançamentos

**Nome:** Revisar lançamentos classificados automaticamente.
**Objetivo:** Permitir ao operador visualizar, aceitar, alterar ou rejeitar as sugestões de classificação geradas pelo motor (D1), garantindo que os lançamentos entrem nos relatórios e cálculos com a classificação correta.

**Ator principal:** Operador / Auxiliar (ou Controller).
**Atores secundários:** Sistema (exibe sugestões, registra decisões, oferece criação de regra).

**Pré-condições:**
- Existem lançamentos com status "Classificado automaticamente — revisão recomendada" ou "Não classificado — requer intervenção" ou "Conflito de regras — requer intervenção".
- Existe um período no estado **Aberto** (A6) `[T5]`.

**Quando é usada:**
- Após importação de documentos (C1, C2, C3, C6, C8).
- Após digitação manual (C4, C5, C7).
- A qualquer momento, para revisar lançamentos pendentes.
- **Antes do fechamento do período** (A6), para resolver pendências `[T6]`.

**Fluxo principal:**
1. Operador acessa "Revisão > Lançamentos Pendentes".
2. Sistema exibe a **lista de lançamentos** que precisam de revisão, com filtros:
   - Por status ("Revisão recomendada", "Não classificado", "Conflito").
   - Por tipo de documento (NF-e, NFS-e, CT-e, RPA, folha, manual).
   - Por período.
   - Por fornecedor/cliente.
   - Por valor.
3. Para cada lançamento, a lista mostra:
   - Data, documento de origem, contraparte, valor.
   - Conta sugerida (com resumo da justificativa).
   - Status da classificação (confiança alta/média/baixa, conflito, não classificado).
   - Centro de custo sugerido.
4. Operador seleciona um lançamento (ou vários, para ação em lote).
5. Sistema exibe o **painel de detalhes** do lançamento:
   - Dados completos (contexto).
   - Sugestão do motor (conta, centro de custo, contrapartida).
   - **Resumo da justificativa** + botão "Por que?" (D2).
   - Botões de ação: **Aceitar**, **Alterar**, **Rejeitar**.
6. Operador decide:
   - **Aceitar:** confirma a sugestão. Status vira "Classificado automaticamente — aceito".
   - **Alterar:** abre formulário para escolher outra conta/centro de custo/contrapartida. Ao confirmar, status vira "Classificado manualmente". O sistema pergunta se deseja **criar regra** (D4).
   - **Rejeitar:** marca como "Não classificado — requer intervenção" e volta para a fila (ou abre formulário para classificar manualmente).
7. Sistema registra a decisão (auditoria).
8. Sistema atualiza a lista (remove os já revisados, mantém os pendentes).
9. Operador pode usar **ações em lote**:
   - "Aceitar todos os de confiança alta".
   - "Aceitar selecionados".
   - "Ver justificativas em lote" (D2, FA1).
10. Ao final, sistema exibe resumo: quantos aceitos, alterados, rejeitados, pendentes.

**Fluxos alternativos:**
- **FA1 — Ação em lote (aceitar):** operador seleciona vários lançamentos com confiança alta e aceita todos de uma vez. Sistema registra em lote.
- **FA2 — Ação em lote (ver justificativas):** operador seleciona vários e vê um resumo das justificativas agrupadas.
- **FA3 — Filtro por conflito:** operador filtra apenas lançamentos com conflito de regras (D1, FA3) e resolve um a um.
- **FA4 — Filtro por fallback:** operador filtra apenas "Não classificado" e classifica manualmente, criando regras conforme aprende (D4).
- **FA5 — Revisão por documento:** operador agrupa os lançamentos por documento (ex: todos os itens de uma NF-e) e revisa em conjunto.
- **FA6 — Reclassificação:** operador pode reabrir um lançamento já classificado (aceito ou alterado) e mudar novamente, com auditoria. Permitida **apenas antes do fechamento do período**.
- **FA7 — Delegação:** operador pode marcar um lançamento como "Revisar depois" e ele volta para a fila (com prioridade menor). Fase 2.

**Exceções:**
- **EX1 — Nenhum período aberto:** bloqueia a revisão `[T5]`.
- **EX2 — Lista vazia:** sistema informa "Nenhum lançamento pendente de revisão".
- **EX3 — Lançamento de período fechado:** não aparece na lista `[T5]`.
- **EX4 — Falha ao registrar decisão:** sistema exibe erro e mantém o lançamento na fila.
- **EX5 — Operador tenta aceitar lançamento com conflito sem escolher:** sistema bloqueia e exige escolha entre as regras em conflito.
- **EX6 — Operador tenta fechar o período com lançamentos pendentes:** bloqueado por `[T6]` (Erro).

**Pós-condições:**
- Lançamentos revisados (aceitos, alterados ou rejeitados).
- Status atualizado.
- Auditoria registrada (quem revisou, quando, o que mudou).
- Se houve alteração manual, oferta de criação de regra (D4) registrada.
- Pendências `[T6]` atualizadas.
- Resumo da revisão disponível.

**Regras de negócio:**
- **RN1** `[T5]` Só é possível revisar lançamentos do período aberto.
- **RN2** Toda decisão (aceitar, alterar, rejeitar) é registrada em auditoria.
- **RN3** Alteração manual oferece criação de regra (D4).
- **RN4** Conflito de regras exige escolha explícita do operador.
- **RN5** Lançamentos não classificados são **Erro** no relatório de pendências `[T6]` e bloqueiam o fechamento `[T5]`.
- **RN6** Ações em lote são permitidas para aceitar (confiança alta) e para ver justificativas, mas **não** para alterar (alteração é individual).
- **RN7** Reclassificação de lançamento já aceito é permitida **apenas antes do fechamento do período**, com auditoria.
- **RN8** Lançamentos marcados como "Revisar depois" voltam para a fila com prioridade menor (fase 2).
- **RN9** A tela de revisão exibe o resumo da justificativa (D2) e o botão "Por que?" para detalhe.

**Telas envolvidas:**
- Tela "Revisão de Lançamentos Pendentes" (lista + filtros + ações).
- Painel de detalhes do lançamento.
- Modal "Por que esta conta?" (D2).
- Modal "Criar regra para futuros lançamentos?" (D4).
- Modal de confirmação de ação em lote.
- Tela de pendências `[T6]` — integrada.

---

### D4 — Aprendizado e criação de regras

**Nome:** Aprender com a correção do operador e criar regra de classificação.
**Objetivo:** Quando o operador altera uma sugestão de classificação (D3), o sistema oferece criar uma regra para que lançamentos futuros com o mesmo contexto sejam classificados automaticamente, reduzindo o esforço manual e tornando o motor mais preciso com o uso.

**Ator principal:** Operador (durante a revisão) ou Controller (gerenciando regras).
**Atores secundários:** Sistema (sugere a regra, valida, registra).

**Pré-condições:**
- Operador alterou a classificação de um lançamento na tela de revisão (D3) ou na digitação manual (C4, C5, C7).
- O sistema tem o **contexto** do lançamento (CFOP, NCM, fornecedor, categoria, histórico, código de serviço, etc.) e a **nova conta** escolhida pelo operador.

**Quando é acionado:**
- Após alteração manual de classificação (D3).
- Após reclassificação de lançamento já aceito (D3, FA6).
- Após classificação manual de lançamento não classificado (fallback).

**Princípio:** o sistema **não cria regras sozinho**. Ele **sugere** a regra ao operador e só a cria se o operador confirmar. Isso evita que uma correção pontual vire regra geral e contamine classificações futuras.

**Fluxo principal:**
1. Operador altera a classificação de um lançamento na tela de revisão (D3).
2. Ao confirmar a alteração, o sistema exibe um **modal de oferta de regra**:
   - "Deseja criar uma regra para classificar automaticamente lançamentos futuros com este mesmo contexto?"
   - **Contexto identificado:** Fornecedor ABC + CFOP 1102 (ou NCM, ou código de serviço, conforme o que estiver disponível).
   - **Conta escolhida:** Custo > CMV.
   - **Centro de custo escolhido:** Comercial.
   - **Prioridade sugerida:** 1 (regra específica, se o contexto for específico) ou 2 (se for por CFOP), etc.
3. Operador escolhe:
   - **Criar regra com este contexto** (o sistema cria a regra com o contexto identificado).
   - **Criar regra com contexto mais amplo** (o operador escolhe quais elementos do contexto usar — ex: só o fornecedor, só o CFOP, fornecedor + CFOP).
   - **Criar regra com contexto mais restrito** (o operador adiciona elementos — ex: fornecedor + CFOP + NCM).
   - **Não criar regra** (a alteração fica só para este lançamento).
4. Se o operador escolhe criar:
   - Sistema exibe o **formulário de regra** pré-preenchido com o contexto e a conta escolhida.
   - Operador pode ajustar: descrição da regra, prioridade, centro de custo padrão, contrapartida padrão, ativo/inativo.
   - Operador confirma.
5. Sistema **valida** a regra:
   - Não há conflito com regra existente de mesma prioridade e mesmo contexto? (Se houver, aviso: "Já existe regra para este contexto. Substituir, manter ambas com prioridades diferentes, ou cancelar?")
   - A conta de destino é analítica e está ativa?
6. Sistema cria a regra e registra em auditoria (quem criou, quando, a partir de qual lançamento).
7. Sistema informa: "Regra criada. Lançamentos futuros com este contexto serão classificados automaticamente."

**Fluxos alternativos:**
- **FA1 — Criação de regra em lote:** se o operador alterou vários lançamentos com o **mesmo contexto** (ex: 10 itens do mesmo fornecedor com mesmo CFOP), o sistema oferece criar **uma regra única** que cobre todos, em vez de perguntar 10 vezes. Fase 1.
- **FA2 — Criação de regra a partir da tela de regras (D5):** o Controller pode criar regras manualmente. O D4 é o caminho "aprendido"; o D5 é o caminho "explícito".
- **FA3 — Edição de regra existente:** se o operador tenta criar regra para contexto que já tem regra, o sistema oferece **editar a existente** em vez de criar duplicata.
- **FA4 — Desativação de regra:** **apenas o Controller** pode desativar uma regra (a regra deixa de ser aplicada, mas fica registrada para auditoria).
- **FA5 — Regra com rateio:** se o operador escolheu rateio por centro de custo na alteração, o sistema oferece criar regra com o mesmo rateio.

**Exceções:**
- **EX1 — Contexto insuficiente para criar regra** (ex: lançamento manual sem fornecedor nem CFOP): o sistema oferece criar regra **por histórico/descrição** (prioridade mais baixa, fase 1) ou não oferece criar regra.
- **EX2 — Conflito com regra existente de mesma prioridade:** sistema avisa e pede decisão (substituir, manter ambas, cancelar).
- **EX3 — Conta de destino inativa:** sistema bloqueia a criação da regra e pede que o operador escolha conta ativa.
- **EX4 — Operador cancela o modal:** regra não é criada; a alteração fica só para o lançamento.
- **EX5 — Falha ao criar regra:** sistema exibe erro e mantém a alteração do lançamento (a regra não é criada, mas a classificação manual permanece).

**Pós-condições:**
- Regra criada (ou não, conforme decisão do operador).
- Auditoria registrada (quem criou, quando, a partir de qual lançamento, qual contexto).
- Se regra criada, lançamentos futuros com o mesmo contexto serão classificados automaticamente.
- Se regra não criada, a alteração fica registrada apenas no lançamento.

**Regras de negócio:**
- **RN1** O sistema **sugere** a regra, mas **não cria** sem confirmação do operador.
- **RN2** O operador pode ajustar o contexto da regra (mais amplo ou mais restrito).
- **RN3** Toda regra criada é registrada em auditoria, com vínculo ao lançamento que a originou.
- **RN4** Conflito com regra existente de mesma prioridade exige decisão explícita (substituir, manter ambas, cancelar).
- **RN5** Regra só pode apontar para conta analítica ativa.
- **RN6** Criação de regra em lote é permitida para lançamentos com mesmo contexto (FA1).
- **RN7** Regra pode ser editada (FA3) ou desativada (FA4) — **desativação apenas pelo Controller**.
- **RN8** Contexto insuficiente leva à oferta de regra por histórico/descrição (prioridade mais baixa) ou à não oferta.
- **RN9** A criação de regra **nunca** altera lançamentos já classificados — vale só para futuros.
- **RN10** `[T5]` A criação de regra não altera dados de períodos fechados.

**Telas envolvidas:**
- Modal "Criar regra para futuros lançamentos?" (após alteração na D3).
- Formulário de regra pré-preenchido (com contexto ajustável).
- Modal de conflito de regra.
- Tela de regras (D5) — para gestão posterior.

---

### D5 — Gestão de regras pelo Controller

**Nome:** Gerenciar regras de classificação automática.
**Objetivo:** Permitir ao Controller visualizar, criar, editar, priorizar, ativar/desativar e auditar todas as regras de classificação do sistema, garantindo que o motor (D1) opere de forma consistente e transparente.

**Ator principal:** Controller / Contador interno.
**Atores secundários:** Sistema (valida, aplica, audita).

**Pré-condições:**
- Empresa cadastrada, plano de contas ativo (A1).
- O usuário tem permissão de Controller (I1).
- Existe um período no estado **Aberto** (A6) para criação/edição de regras `[T5]`.

**Quando é usada:**
- Configuração inicial (após A1, antes de importar documentos).
- Ajuste fino do motor após uso real.
- Resolução de conflitos recorrentes.
- Auditoria de regras criadas automaticamente pelo D4.

**Fluxo principal:**
1. Controller acessa "Configuração > Regras de Classificação".
2. Sistema exibe a **lista de regras** com:
   - Descrição da regra.
   - Contexto (fornecedor, CFOP, NCM, categoria, código de serviço, histórico — o que se aplica).
   - Conta de destino.
   - Centro de custo padrão (se houver).
   - Contrapartida padrão (se houver).
   - Prioridade (1 a 8, conforme D1).
   - Status (ativa/inativa).
   - Origem (criada manualmente pelo Controller / aprendida via D4).
   - Data de criação e último uso.
3. Filtros disponíveis:
   - Por prioridade.
   - Por status (ativa/inativa).
   - Por origem (manual/aprendida).
   - Por fornecedor, CFOP, NCM, categoria, código de serviço.
   - Por conta de destino.
   - Por "nunca usada".
4. Controller seleciona uma regra e vê os **detalhes**:
   - Contexto completo.
   - Conta de destino, centro de custo, contrapartida.
   - Justificativa/origem (se aprendida, qual lançamento a originou).
   - Estatísticas de uso: quantas vezes foi aplicada, quantas vezes foi sobreposta por regra de prioridade maior, quantas vezes gerou conflito.
   - Histórico de alterações (auditoria).
5. Controller pode **criar nova regra** (formulário em branco ou a partir de modelo).
6. Controller pode **editar** uma regra existente (contexto, conta, centro de custo, contrapartida, prioridade, status).
7. Controller pode **ativar/desativar** uma regra (desativação não apaga — fica registrada para auditoria).
8. Controller pode **ajustar a prioridade** de uma regra (dentro da faixa 1 a 8; **subprioridades ficam para a fase 2**).
9. Controller pode **testar** uma regra: simular um lançamento com determinado contexto e ver qual regra seria aplicada.
10. Sistema valida cada alteração (conflito de prioridade, conta ativa, contexto consistente).
11. Sistema registra toda alteração em auditoria (quem, quando, o que mudou, por quê — se o Controller informar justificativa).

**Fluxos alternativos:**
- **FA1 — Criação em lote:** Controller pode importar regras de uma planilha (formato a definir) para configuração inicial em massa. **Fase 2.**
- **FA2 — Duplicação de regra:** Controller pode duplicar uma regra e ajustar o contexto.
- **FA3 — Desativação em lote:** Controller pode desativar várias regras de uma vez.
- **FA4 — Simulação de impacto:** antes de alterar uma regra, Controller pode simular quantos lançamentos futuros seriam afetados. **Fase 2.**
- **FA5 — Regras por empresa:** se o sistema for multiempresa, cada empresa tem seu conjunto de regras; o Controller pode copiar regras entre empresas.
- **FA6 — Exportação de regras:** Controller pode exportar as regras para backup ou para replicar em outra instalação.

**Exceções:**
- **EX1 — Nenhum período aberto:** bloqueia criação/edição de regras (mas permite consulta) `[T5]`.
- **EX2 — Conflito de prioridade:** sistema avisa e pede decisão (ajustar prioridade, substituir, cancelar).
- **EX3 — Conta de destino inativa:** bloqueia.
- **EX4 — Contexto insuficiente:** bloqueia (regra sem nenhum elemento de contexto).
- **EX5 — Falha ao salvar:** sistema exibe erro e mantém a regra anterior.
- **EX6 — Tentativa de desativar regra que originou classificações em período fechado:** permitido (a desativação vale só para futuros), mas sistema avisa que classificações passadas não serão afetadas.

**Pós-condições:**
- Regra criada/editada/desativada.
- Auditoria registrada.
- Motor de classificação (D1) passa a usar a versão atualizada.
- Estatísticas de uso atualizadas.

**Regras de negócio:**
- **RN1** Toda regra tem contexto (pelo menos um elemento), conta de destino analítica ativa e prioridade (1 a 8).
- **RN2** Prioridade 1 é a mais específica; prioridade 8 é o fallback. O Controller pode ajustar prioridades, mas a ordem de prioridade geral é fixa (D1).
- **RN3** Desativação não apaga a regra; ela fica registrada para auditoria e pode ser reativada.
- **RN4** Toda alteração é registrada em auditoria (quem, quando, o que mudou).
- **RN5** `[T5]` Alteração de regra **não afeta** classificações já realizadas em períodos fechados.
- **RN6** Regras aprendidas (D4) aparecem na lista com origem "aprendida" e vínculo ao lançamento de origem.
- **RN7** Conflito de prioridade exige decisão explícita.
- **RN8** Criação em lote (FA1) e exportação (FA6) são permitidas ao Controller. **Criação em lote é fase 2.**
- **RN9** O Controller pode testar uma regra antes de ativá-la.
- **RN10** Apenas o Controller (perfil com permissão) pode criar, editar, desativar ou ajustar prioridade de regras.

**Telas envolvidas:**
- Tela "Regras de Classificação" (lista + filtros).
- Painel de detalhes da regra (contexto, estatísticas, histórico).
- Formulário de criação/edição de regra.
- Modal de conflito de prioridade.
- Tela de simulação de impacto (FA4, fase 2).
- Tela de importação de regras em lote (FA1, fase 2).
- Tela de auditoria de regras.

---

## MÓDULO E — CÁLCULOS AUTOMÁTICOS

### E1 — Cálculo de impostos sobre compras

**Nome:** Calcular impostos incidentes sobre compras.
**Objetivo:** Calcular os impostos incidentes sobre as operações de compra (PIS, COFINS, ICMS, IPI, IBS, CBS, e ISS quando aplicável a serviços tomados), gerando os lançamentos de crédito no razão de impostos `[T7]` e os valores a pagar/recolher, com base nos dados do documento e nos parâmetros fiscais da empresa.

**Ator principal:** Sistema (ator automático).
**Atores secundários:** Operador (pode revisar/override), Controller (configura parâmetros fiscais em A1/I2).

**Pré-condições:**
- Empresa cadastrada com regime fiscal e parâmetros fiscais carregados (A1).
- Existe um documento de compra no período aberto (C1, C3, C5, C8) `[T5]`.
- Parâmetros fiscais vigentes carregados.

**Quando é acionado:**
- Após a criação de um documento de compra (NF-e, CT-e tomado, NFS-e tomada, RPA).
- Sob demanda, na revisão (D3), se o operador quiser recalcular.
- No fechamento do período (A6), para consolidar os saldos `[T7]`.

**Particularidades:**
- **Regime fiscal influencia tudo:** Simples Nacional, Lucro Presumido e Lucro Real têm tratamentos diferentes.
- **Fase de transição IBS/CBS:** em 2026, IBS (0,1%) e CBS (0,9%) são informativos; em 2027+, alíquotas de referência gradualmente.
- **Base de cálculo varia por imposto:** ICMS "por dentro", IPI sobre o produto, PIS/COFINS sobre o valor da operação, ISS sobre o serviço.
- **Crédito depende do destino da compra:** compra para revenda gera crédito de ICMS/IPI/PIS/COFINS (conforme regime); compra para uso/consumo pode não gerar crédito; compra de serviço (NFS-e tomada) gera crédito de ISS/PIS/COFINS (conforme regime).
- **Retenções:** quando a empresa é tomadora e retém impostos (ISS, INSS, IRRF, PIS/COFINS/CSLL), o sistema registra o **débito a recolher** (em nome do prestador), não o crédito.
- **ICMS-ST:** usa o **valor informado no XML** (não recalcula). O valor da ST compõe o custo (não é recuperável). Cálculo detalhado fica pendente.

**Fluxo principal:**
1. Documento de compra é criado (ou está sendo revisado).
2. Sistema identifica o **tipo de documento** e a **natureza da operação** (compra de mercadoria, serviço tomado, frete tomado, RPA).
3. Sistema consulta os **parâmetros fiscais** da empresa (regime, alíquotas por tipo de imposto, vigência).
4. Sistema identifica os **dados fiscais** do documento (CFOP, NCM, CST, código de serviço, valores, base de cálculo, alíquotas informadas no XML ou digitadas).
5. Sistema calcula cada imposto aplicável:

   | Imposto | Base de cálculo | Alíquota | Efeito (comprador) |
   | :--- | :--- | :--- | :--- |
   | **ICMS** | Valor da mercadoria (cálculo "por dentro") | Alíquota do estado | **Crédito** (se regime permitir) |
   | **IPI** | Valor do produto | Tabela TIPI (NCM) | **Crédito** (se regime permitir e se for industrialização/revenda) |
   | **PIS** | Valor da operação | Cumulativo/não cumulativo conforme regime | **Crédito** (Lucro Real não cumulativo) |
   | **COFINS** | Valor da operação | Cumulativo/não cumulativo conforme regime | **Crédito** (Lucro Real não cumulativo) |
   | **ISS** | Valor do serviço | Alíquota do município | **Crédito** (se retido ou se regime permitir) |
   | **IBS (2026)** | Valor da operação | 0,1% | **Crédito informativo** (fase teste) |
   | **CBS (2026)** | Valor da operação | 0,9% | **Crédito informativo** (fase teste) |
   | **Retenções** | Valor do serviço | Conforme tabela | **Débito a recolher** (em nome do prestador) |

6. Sistema **valida** os cálculos:
   - A base de cálculo está correta?
   - A alíquota aplicável é a vigente?
   - O crédito é permitido pelo regime?
   - Há divergência entre o valor informado no XML e o calculado? (Se sim, **aviso**, com opção de override.)
7. Sistema **gera os lançamentos de impostos**:
   - **Crédito** de ICMS/IPI/PIS/COFINS/ISS/IBS/CBS → conta de "Impostos a Recuperar" (Ativo).
   - **Débito** de retenções → conta de "Impostos a Recolher" (Passivo).
8. Sistema **registra no razão de impostos** `[T7]` cada crédito/débito.
9. Sistema exibe ao operador, na tela de revisão (D3), o **detalhamento dos impostos calculados**.
10. Operador pode **aceitar** os cálculos ou **override** (informar valor diferente, com justificativa).
11. Se override, o sistema registra em auditoria e atualiza o razão.
12. O valor total do documento (custo/despesa) é ajustado para refletir os impostos recuperáveis.

**Fluxos alternativos:**
- **FA1 — Documento com impostos informados no XML:** sistema usa os valores informados, mas **valida** contra os parâmetros e **avisa** se houver divergência.
- **FA2 — Documento de compra para uso/consumo:** sistema **não gera crédito** de ICMS/IPI (ou gera conforme regime), mas pode gerar crédito de PIS/COFINS (conforme regime).
- **FA3 — Documento de compra de ativo imobilizado:** sistema gera crédito de ICMS/IPI conforme regras específicas. **Fase 2** (crédito proporcional à depreciação é complexo; na fase 1, tratar como não recuperável, com aviso).
- **FA4 — Documento com ICMS-ST:** sistema usa o **valor informado no XML** (não recalcula). O valor da ST compõe o custo. Cálculo detalhado fica pendente (RN13).
- **FA5 — Documento com benefício fiscal:** sistema aplica a alíquota reduzida/isenção conforme o CST do item (o benefício já vem refletido no XML). **Fase 2** para casos complexos.
- **FA6 — Reclassificação do documento:** se o operador altera a classificação (custo → despesa), o sistema **recalcula** os créditos permitidos e **ajusta** os lançamentos.
- **FA7 — Documento de período fechado:** não pode ser recalculado `[T5]`.

**Exceções:**
- **EX1 — Nenhum período aberto:** não aplicável (E1 é acionado dentro de um documento já criado no período aberto) `[T5]`.
- **EX2 — Parâmetros fiscais não carregados:** bloqueia o cálculo e exige configuração.
- **EX3 — Alíquota não encontrada para o NCM/CFOP/código de serviço:** sistema usa alíquota padrão ou pergunta ao operador, registrando pendência `[T6]`.
- **EX4 — Divergência entre valor do XML e calculado:** aviso, com opção de override.
- **EX5 — Base de cálculo inconsistente:** bloqueia.
- **EX6 — Regime fiscal incompatível com o crédito:** sistema **não gera** o crédito e registra aviso.
- **EX7 — Falha no cálculo:** documento fica com impostos "a calcular" e pendência `[T6]` como **Erro**.

**Pós-condições:**
- Impostos calculados (ou override registrado).
- Lançamentos de crédito/débito de impostos gerados.
- Razão de impostos `[T7]` atualizado.
- Custo/despesa do documento ajustado (líquido de créditos recuperáveis).
- Pendências registradas `[T6]`, se houver.
- Auditoria (override, divergências).

**Regras de negócio:**
- **RN1** O cálculo considera o **regime fiscal** da empresa e os **parâmetros fiscais vigentes**.
- **RN2** O sistema calcula cada imposto aplicável com sua base e alíquota corretas.
- **RN3** O crédito é gerado apenas quando o regime permite e quando o destino da compra justifica.
- **RN4** Retenções geram **débito a recolher** (em nome do prestador), não crédito.
- **RN5** `[T7]` Todo crédito/débito é registrado no razão de impostos.
- **RN6** Divergência entre valor do XML e calculado gera aviso, com opção de override (auditado).
- **RN7** Override exige justificativa e é registrado em auditoria.
- **RN8** Reclassificação do documento (custo → despesa) recalcula créditos e ajusta lançamentos.
- **RN9** `[T5]` Documentos de período fechado não são recalculados.
- **RN10** Impostos não calculáveis geram pendência **Erro** `[T6]` e bloqueiam fechamento.
- **RN11** O valor do documento no DRE é **líquido de créditos recuperáveis**.
- **RN12** Fase de transição IBS/CBS (2026) é tratada como informativa.
- **RN13** ICMS-ST usa o valor do XML (não recalcula).

**Telas envolvidas:**
- Painel "Impostos Calculados" (dentro da tela de revisão D3 ou da tela de detalhes do documento).
- Modal de override (com justificativa).
- Tela de parâmetros fiscais (A1/I2).
- Razão de impostos `[T7]`.
- Tela de pendências `[T6]`.

---

### E2 — Cálculo de impostos sobre vendas

**Nome:** Calcular impostos incidentes sobre vendas.
**Objetivo:** Calcular os impostos incidentes sobre as operações de venda (PIS, COFINS, ICMS, IPI, ISS, IBS, CBS), gerando os lançamentos de **débito** no razão de impostos `[T7]` e os valores a recolher, com base nos dados do documento e nos parâmetros fiscais da empresa.

**Ator principal:** Sistema (ator automático).
**Atores secundários:** Operador (pode revisar/override), Controller (configura parâmetros fiscais).

**Pré-condições:**
- Empresa cadastrada com regime fiscal e parâmetros fiscais carregados (A1).
- Existe um documento de venda no período aberto (C1, C2, C3, C5) `[T5]`.
- Parâmetros fiscais vigentes carregados.

**Quando é acionado:**
- Após a criação de um documento de venda (NF-e de saída, NFS-e prestada, CT-e emitido).
- Sob demanda, na revisão (D3).
- No fechamento do período (A6), para consolidar os saldos `[T7]`.

**Particularidades (espelho do E1, mas do lado da venda):**
- **Regime fiscal influencia tudo:** Simples Nacional (DAS unificado), Lucro Presumido (PIS/COFINS cumulativo, ICMS/ISS normais), Lucro Real (PIS/COFINS não cumulativo, ICMS/ISS normais).
- **Base de cálculo varia por imposto:** ICMS "por dentro" (sobre mercadoria), IPI (sobre produto, quando aplicável), PIS/COFINS (sobre faturamento), ISS (sobre serviço).
- **Débito gerado:** todo imposto sobre venda é **débito** no razão de impostos (a recolher), exceto quando há retenção sofrida (que gera **crédito a recuperar**).
- **Retenções sofridas:** quando o cliente retém impostos (ISS, IR, INSS, PIS/COFINS/CSLL), o sistema registra o **crédito a recuperar** (Ativo), não o débito.
- **Simples Nacional:** o cálculo é unificado (DAS), não por imposto. O sistema trata esse regime de forma específica (alíquota efetiva sobre a receita bruta, conforme anexo).

**Fluxo principal:**
1. Documento de venda é criado (ou está sendo revisado).
2. Sistema identifica o **tipo de documento** e a **natureza da operação** (venda de mercadoria, serviço prestado, frete emitido).
3. Sistema consulta os **parâmetros fiscais** da empresa.
4. Sistema identifica os **dados fiscais** do documento (CFOP, NCM, CST, código de serviço, valores, base de cálculo, alíquotas).
5. Sistema calcula cada imposto aplicável:

   | Imposto | Base de cálculo | Alíquota | Efeito (vendedor) |
   | :--- | :--- | :--- | :--- |
   | **ICMS** | Valor da mercadoria (cálculo "por dentro") | Alíquota do estado | **Débito** (a recolher) |
   | **IPI** | Valor do produto | Tabela TIPI (NCM) | **Débito** (a recolher, quando aplicável) |
   | **PIS** | Valor da operação | Cumulativo/não cumulativo conforme regime | **Débito** (a recolher) |
   | **COFINS** | Valor da operação | Cumulativo/não cumulativo conforme regime | **Débito** (a recolher) |
   | **ISS** | Valor do serviço | Alíquota do município | **Débito** (a recolher) |
   | **IBS (2026)** | Valor da operação | 0,1% | **Débito informativo** (fase teste) |
   | **CBS (2026)** | Valor da operação | 0,9% | **Débito informativo** (fase teste) |
   | **Retenções sofridas** | Valor do serviço | Conforme tabela | **Crédito a recuperar** |

6. **Simples Nacional (tratamento específico):**
   - Sistema identifica o **anexo** aplicável (comércio, serviço, ambos) e a **faixa de receita bruta**.
   - **A faixa é determinada pela receita acumulada de 12 meses** (regra da LC 123).
   - Calcula a alíquota efetiva sobre a receita do período.
   - Gera **um único débito** de DAS (não por imposto).
   - Registra no razão `[T7]` como "DAS a recolher".
7. Sistema **valida** os cálculos (base, alíquota, regime, divergências com o XML).
8. Sistema **gera os lançamentos de impostos**:
   - **Débito** de ICMS/IPI/PIS/COFINS/ISS/IBS/CBS → conta de "Impostos a Recolher" (Passivo).
   - **Crédito** de retenções sofridas → conta de "Impostos a Recuperar" (Ativo).
9. Sistema **registra no razão de impostos** `[T7]`.
10. Sistema exibe ao operador o **detalhamento dos impostos calculados**.
11. Operador pode **aceitar** ou **override** (com justificativa, auditado).
12. No DRE: os impostos sobre venda aparecem como **dedução da receita** (receita líquida já calculada).

**Fluxos alternativos:**
- **FA1 — Documento com impostos informados no XML:** sistema usa os valores informados, valida contra os parâmetros e avisa se houver divergência.
- **FA2 — Venda com benefício fiscal:** sistema aplica conforme o CST do item (o benefício já vem refletido no XML). **Fase 2** para casos complexos.
- **FA3 — Venda com substituição tributária (ICMS-ST):** **Fase 2**.
- **FA4 — Venda com retenção sofrida:** sistema registra o crédito a recuperar e o valor líquido a receber.
- **FA5 — Devolução de venda:** sistema gera **estorno** dos impostos (crédito no razão) e reduz a receita. **A baixa da receita é fase 1** (RN13); o estorno de impostos é **fase 2**.
- **FA6 — Reclassificação do documento:** se o operador altera a classificação da receita, o sistema recalcula os impostos e ajusta os lançamentos.
- **FA7 — Simples Nacional com múltiplas atividades:** sistema aplica o anexo correspondente a cada atividade, conforme parâmetros. **Fase 2**.

**Exceções:**
- **EX1 — Nenhum período aberto:** não aplicável `[T5]`.
- **EX2 — Parâmetros fiscais não carregados:** bloqueia e exige configuração.
- **EX3 — Alíquota não encontrada:** usa alíquota padrão ou pergunta ao operador, registrando pendência `[T6]`.
- **EX4 — Divergência entre valor do XML e calculado:** aviso, com opção de override.
- **EX5 — Base de cálculo inconsistente:** bloqueia.
- **EX6 — Regime incompatível** (ex: Simples Nacional não gera débito separado de ICMS/PIS/COFINS): sistema trata conforme o regime (DAS unificado).
- **EX7 — Falha no cálculo:** documento fica com impostos "a calcular" e pendência `[T6]` como **Erro**.

**Pós-condições:**
- Impostos calculados (ou override registrado).
- Lançamentos de débito/crédito de impostos gerados.
- Razão de impostos `[T7]` atualizado.
- Receita líquida de impostos calculada.
- Pendências registradas `[T6]`, se houver.
- Auditoria (override, divergências).

**Regras de negócio:**
- **RN1** O cálculo considera o **regime fiscal** da empresa e os **parâmetros fiscais vigentes**.
- **RN2** O sistema calcula cada imposto aplicável com sua base e alíquota corretas.
- **RN3** Todo imposto sobre venda é **débito** no razão (a recolher), exceto retenção sofrida (que é **crédito a recuperar**).
- **RN4** `[T7]` Todo débito/crédito é registrado no razão de impostos.
- **RN5** Simples Nacional tem tratamento específico (DAS unificado, alíquota efetiva, faixa pela receita acumulada de 12 meses).
- **RN6** Divergência entre valor do XML e calculado gera aviso, com opção de override (auditado).
- **RN7** Override exige justificativa e é registrado em auditoria.
- **RN8** Reclassificação da receita recalcula impostos e ajusta lançamentos.
- **RN9** `[T5]` Documentos de período fechado não são recalculados.
- **RN10** Impostos não calculáveis geram pendência **Erro** `[T6]` e bloqueiam fechamento.
- **RN11** No DRE, os impostos sobre venda aparecem como **dedução da receita**.
- **RN12** Fase de transição IBS/CBS (2026) é tratada como informativa.
- **RN13** Devolução de venda **reduz a receita** na fase 1 (não fica pendente). O estorno de impostos fica pendente.

**Telas envolvidas:**
- Painel "Impostos Calculados" (dentro da tela de revisão D3 ou da tela de detalhes do documento).
- Modal de override (com justificativa).
- Tela de parâmetros fiscais (A1/I2).
- Razão de impostos `[T7]`.
- Tela de pendências `[T6]`.

---

### E3 — Consolidação do cálculo de folha

**Nome:** Consolidar cálculo de folha e encargos.
**Objetivo:** Consolidar, para o período, todos os cálculos de folha de pagamento (salários, INSS, FGTS, IRRF, encargos patronais, provisões), integrar ao razão de impostos `[T7]` e ao DRE gerencial, e garantir que o custo de pessoal esteja corretamente alocado (custo vs. despesa fixa) por centro de custo.

**Ator principal:** Sistema (ator automático).
**Atores secundários:** Operador (pode revisar/override), Controller (configura parâmetros trabalhistas em A1/I2).

**Pré-condições:**
- Empresa cadastrada com parâmetros trabalhistas carregados (A1).
- Existe uma folha de pagamento no período aberto (C6, C7) `[T5]`.
- Tabelas de INSS, IRRF e encargos vigentes carregadas.

**Quando é acionado:**
- Após a importação (C6) ou digitação (C7) da folha.
- Sob demanda, na revisão (D3).
- No fechamento do período (A6), para consolidar os saldos `[T7]`.

**Particularidades:**
- **A folha já foi calculada em C6/C7.** O E3 **consolida** os resultados e integra aos relatórios. Não é um novo cálculo.
- **Separação custo vs. despesa:** definida no cadastro do funcionário (B3) e respeitada no E3.
- **Provisões:** férias e 13º provisionadas **mensalmente**, com os encargos incidentes.
- **Razão de impostos `[T7]`:** INSS, FGTS e IRRF geram **débito a recolher** (Passivo).
- **DRE:** o custo total de pessoal (bruto + encargos patronais + provisões) entra no DRE, alocado conforme o centro de custo (custo ou despesa fixa).

**Fluxo principal:**
1. Folha do período é importada (C6) ou digitada (C7).
2. Sistema **consolida** os resultados:
   - Total de salários brutos.
   - Total de INSS empregado (retido).
   - Total de INSS patronal.
   - Total de FGTS.
   - Total de IRRF (retido).
   - Total de RAT e Terceiros.
   - Total de provisões (férias + 13º + encargos sobre provisões).
   - Total líquido a pagar aos funcionários.
3. Sistema **separa por centro de custo** e por **natureza** (custo vs. despesa fixa).
4. Sistema **integra ao razão de impostos** `[T7]`:
   - INSS (empregado + patronal) → débito a recolher.
   - FGTS → débito a recolher.
   - IRRF → débito a recolher.
5. Sistema **integra ao DRE**:
   - Custo de pessoal (operacional) → grupo 3 (Custos).
   - Despesa de pessoal (administrativo) → grupo 4.1 (Despesas Fixas).
   - Provisões → mesma alocação (custo ou despesa).
6. Sistema **valida** a consolidação:
   - A soma dos lançamentos individuais bate com o total?
   - Os encargos estão calculados sobre as bases corretas?
   - As provisões estão provisionadas?
7. Sistema exibe ao operador o **resumo consolidado da folha**:
   - Por centro de custo.
   - Por natureza (custo/despesa).
   - Por tipo de encargo.
   - Totais.
8. Operador pode **revisar** e, se necessário, **override** (com justificativa, auditado). **Permitido sempre.**
9. Sistema registra a consolidação e atualiza os relatórios.

**Fluxos alternativos:**
- **FA1 — Folha com múltiplos centros de custo para o mesmo funcionário (rateio):** sistema consolida o rateio e aloca em cada centro de custo proporcionalmente. **Fase 1.**
- **FA2 — Folha com funcionário admitido/demitido no mês:** sistema consolida proporcionalmente (fase 2).
- **FA3 — Reprocessamento da folha:** se a folha for reimportada/redigitada, o sistema **substitui** a consolidação anterior (com auditoria).
- **FA4 — Provisões calculadas no fechamento:** se a configuração for provisionar no fechamento, o E3 executa o cálculo e lança antes de fechar. **Padrão: mensal.**
- **FA5 — Folha de período fechado:** não pode ser reconsolidada `[T5]`.

**Exceções:**
- **EX1 — Nenhuma folha no período:** sistema informa e não consolida (não é erro).
- **EX2 — Parâmetros trabalhistas não carregados:** bloqueia a consolidação e exige configuração.
- **EX3 — Divergência entre soma dos lançamentos e total:** aviso, com opção de investigar/override.
- **EX4 — Provisões não calculadas** (quando deveriam): pendência **Erro** `[T6]`, bloqueia fechamento.
- **EX5 — Falha na consolidação:** pendência **Erro** `[T6]`.
- **EX6 — Folha de período fechado:** não pode ser reconsolidada `[T5]`.

**Pós-condições:**
- Folha consolidada.
- Razão de impostos `[T7]` atualizado (INSS, FGTS, IRRF).
- DRE atualizado (custo/despesa de pessoal, provisões).
- Resumo consolidado disponível.
- Pendências registradas `[T6]`, se houver.
- Auditoria (override, reprocessamento).

**Regras de negócio:**
- **RN1** O E3 **consolida** o que foi calculado em C6/C7; não recalcula (exceto provisões no fechamento, se configurado).
- **RN2** A separação custo vs. despesa fixa respeita o cadastro do funcionário (B3).
- **RN3** A alocação por centro de custo respeita o rateio, quando houver.
- **RN4** `[T7]` INSS, FGTS e IRRF geram débito a recolher no razão de impostos.
- **RN5** Provisões de férias e 13º (com encargos) são provisionadas **mensalmente** (padrão) ou no fechamento (conforme configuração).
- **RN6** A soma dos lançamentos individuais deve bater com o total consolidado (validação).
- **RN7** Override exige justificativa e é registrado em auditoria.
- **RN8** Reprocessamento substitui a consolidação anterior, com auditoria.
- **RN9** `[T5]` Folha de período fechado não é reconsolidada.
- **RN10** Ausência de folha no período não é erro.
- **RN11** Provisões não calculadas quando deveriam geram **Erro** `[T6]` e bloqueiam fechamento.

**Telas envolvidas:**
- Painel "Resumo Consolidado da Folha" (por centro de custo, natureza, encargo).
- Modal de override (com justificativa).
- Razão de impostos `[T7]`.
- DRE gerencial (G1).
- Tela de pendências `[T6]`.

---

### E4 — Cálculo de depreciação

**Nome:** Calcular e lançar a depreciação mensal dos ativos.
**Objetivo:** Calcular a depreciação mensal dos ativos (patrimônios) cadastrados, lançá-la em partidas dobradas (despesa/custo + depreciação acumulada), alocar conforme o destino do bem (custo ou despesa) e integrar ao DRE gerencial.

**Ator principal:** Sistema (ator automático).
**Atores secundários:** Operador (pode revisar/override), Controller (configura ativos em B4).

**Pré-condições:**
- Empresa cadastrada (A1).
- Existem ativos cadastrados (B4) com data de aquisição, valor original, valor residual, vida útil, método, centro de custo, destino (custo/despesa) e **mês inicial da depreciação**.
- Existe um período no estado **Aberto** (A6) `[T5]`.

**Quando é acionado:**
- Mensalmente (ou no fechamento do período, conforme configuração).
- Sob demanda, na revisão (D3).
- No fechamento do período (A6), para consolidar (se não foi lançado antes).

**Particularidades:**
- **Método linear é o padrão.** Soma dos dígitos e unidades produzidas ficam para fase 2.
- **Mês inicial da depreciação:** definido no cadastro do ativo (B4), com sugestão padrão do **mês seguinte à aquisição**, editável.
- **Destino do bem define a alocação:**
  - Ativo de produção/operação → **Custo** (grupo 3).
  - Ativo administrativo → **Despesa Fixa** (grupo 4.1).
- **Valor residual** não deprecia.
- **Depreciação acumulada** é conta redutora do Ativo (1.2.2).
- **Baixa do ativo** (alienação, descarte) gera ganho/perda — **fase 2**.

**Fluxo principal:**
1. No período aberto, o sistema identifica os **ativos** cujo **mês inicial da depreciação** é igual ou anterior ao período aberto e que ainda têm valor depreciável a lançar.
2. Para cada ativo, o sistema calcula:
   - **Depreciação mensal** = (Valor Original − Valor Residual) ÷ (Vida Útil em meses).
   - **Depreciação acumulada** até o período.
   - **Valor contábil líquido** = Valor Original − Depreciação Acumulada.
3. Sistema verifica se o ativo já teve depreciação lançada no período (evita duplicidade).
4. Sistema **gera os lançamentos** em partidas dobradas:
   - **Débito:** Despesa de Depreciação (4.1.3) ou Custo de Depreciação (3.x), conforme destino.
   - **Crédito:** (-) Depreciação Acumulada (1.2.2).
5. Sistema **aloca por centro de custo** (conforme cadastro do ativo — B4).
6. Sistema **integra ao DRE** (despesa ou custo).
7. Sistema **valida**:
   - A depreciação acumulada não ultrapassa o valor depreciável.
   - O ativo não está totalmente depreciado (se estiver, não lança).
8. Sistema exibe ao operador o **resumo da depreciação**:
   - Por ativo: valor original, depreciação do mês, acumulada, valor líquido.
   - Por centro de custo.
   - Por natureza (custo/despesa).
9. Operador pode **revisar** e, se necessário, **override** (com justificativa, auditado).
10. Sistema registra a depreciação e atualiza os relatórios.

**Fluxos alternativos:**
- **FA1 — Ativo adquirido no mês:** sistema aplica o **mês inicial da depreciação** definido no cadastro (padrão: mês seguinte).
- **FA2 — Ativo totalmente depreciado:** sistema não lança depreciação (valor contábil líquido = valor residual).
- **FA3 — Ativo alienado/descartado no mês:** sistema lança a depreciação até a data da baixa e calcula ganho/perda na alienação. **Fase 2.**
- **FA4 — Ativo com depreciação acelerada (simulação fiscal):** sistema permite calcular a depreciação acelerada **em paralelo** à linear, para comparação na simulação (H). Não afeta o DRE real. **Fase 2.**
- **FA5 — Reprocessamento da depreciação:** se o operador reconfigurar, o sistema **substitui** a depreciação anterior do período (com auditoria).
- **FA6 — Ativo de período fechado:** não pode ser recalculado `[T5]`.

**Exceções:**
- **EX1 — Nenhum período aberto:** bloqueia `[T5]`.
- **EX2 — Nenhum ativo cadastrado:** sistema informa e não lança (não é erro).
- **EX3 — Ativo com dados incompletos:** pendência **Erro** `[T6]`, bloqueia cálculo daquele ativo.
- **EX4 — Depreciação acumulada ultrapassa o valor depreciável:** sistema bloqueia e registra pendência **Erro** `[T6]`.
- **EX5 — Falha no cálculo:** pendência **Erro** `[T6]`.
- **EX6 — Ativo de período fechado:** não pode ser recalculado `[T5]`.

**Pós-condições:**
- Depreciação calculada e lançada (ou override registrado).
- Lançamentos em partidas dobradas gerados.
- DRE atualizado (custo/despesa de depreciação).
- Depreciação acumulada atualizada no Ativo.
- Pendências registradas `[T6]`, se houver.
- Auditoria (override, reprocessamento).

**Regras de negócio:**
- **RN1** O método padrão é **linear**.
- **RN2** A depreciação começa no **mês inicial da depreciação** definido no cadastro do ativo (B4), com sugestão padrão do mês seguinte à aquisição. O usuário pode alterar antes de iniciar a depreciação; após o primeiro lançamento, alterações exigem reprocessamento (com auditoria).
- **RN3** O destino do bem (custo vs. despesa) define a alocação no DRE, conforme cadastro (B4).
- **RN4** A depreciação acumulada é conta redutora do Ativo (1.2.2).
- **RN5** A depreciação não ultrapassa o valor depreciável (valor original − valor residual).
- **RN6** Ativo totalmente depreciado não gera novos lançamentos.
- **RN7** Override exige justificativa e é registrado em auditoria.
- **RN8** Reprocessamento substitui a depreciação anterior do período, com auditoria.
- **RN9** `[T5]` Depreciação de período fechado não é recalculada.
- **RN10** Ativo com dados incompletos gera **Erro** `[T6]` e bloqueia o cálculo daquele ativo.
- **RN11** Depreciação acelerada (simulação) é calculada em paralelo, sem afetar o DRE real. **Fase 2.**
- **RN12** Ausência de ativos no período não é erro.

**Telas envolvidas:**
- Painel "Resumo da Depreciação" (por ativo, centro de custo, natureza).
- Modal de override (com justificativa).
- Cadastro de ativos (B4).
- DRE gerencial (G1).
- Tela de pendências `[T6]`.

---

### E5 — Consolidação de provisões de férias e 13º

**Nome:** Consolidar provisões de férias e 13º salário.
**Objetivo:** Consolidar, para o período, as provisões de férias e 13º salário (com os encargos incidentes), integrá-las ao DRE gerencial (custo ou despesa, conforme o funcionário) e garantir que estejam corretamente provisionadas antes do fechamento.

**Ator principal:** Sistema (ator automático).
**Atores secundários:** Operador (pode revisar/override), Controller (configura parâmetros em A1/I2).

**Pré-condições:**
- Empresa cadastrada com parâmetros trabalhistas carregados (A1).
- Existem funcionários ativos no período (B3).
- Existe folha no período aberto (C6, C7) — ou configuração para provisionar sem folha `[T5]`.
- Tabelas de INSS, FGTS e encargos vigentes carregadas.

**Quando é acionado:**
- **Mensalmente**, junto com a folha (C6/C7) ou no fechamento (A6), conforme configuração.
- Sob demanda, na revisão (D3).
- No fechamento do período (A6), para garantir que as provisões estão lançadas.

**Particularidades:**
- **Provisão de férias:** 1/12 do salário + 1/3 constitucional, acrescido dos encargos incidentes (INSS patronal, FGTS).
- **Provisão de 13º:** 1/12 do salário, acrescido dos encargos incidentes.
- **Base de cálculo:** salário base do funcionário (e proventos que incidem sobre férias/13º, conforme flags do cadastro de proventos/descontos).
- **Alocação:** custo ou despesa fixa, conforme o centro de custo do funcionário (B3).
- **Contrapartida:** Provisões a Pagar (Passivo — 2.1.x).
- **Reversão:** quando o funcionário goza férias ou recebe 13º, a provisão é revertida e o valor é lançado como salário normal. **Fase 2.**

**Fluxo principal:**
1. No período aberto, o sistema identifica os **funcionários ativos** com provisões a calcular.
2. Para cada funcionário, o sistema calcula:
   - **Provisão de férias** = (salário base + proventos com flag "entra férias") ÷ 12 × (1 + 1/3).
   - **Provisão de 13º** = (salário base + proventos com flag "entra 13º") ÷ 12.
   - **Encargos sobre provisões** = INSS patronal + FGTS incidentes sobre as provisões.
3. Sistema verifica se o funcionário já teve provisão lançada no período (evita duplicidade).
4. Sistema **gera os lançamentos** em partidas dobradas:
   - **Débito:** Custo ou Despesa de Provisões (conforme centro de custo do funcionário).
   - **Crédito:** Provisões a Pagar (Passivo) — separando férias, 13º e encargos.
5. Sistema **integra ao DRE** (custo ou despesa fixa, conforme B3).
6. Sistema **integra ao razão de impostos** `[T7]` os encargos sobre provisões (INSS, FGTS) — como débito a recolher **no momento da provisão** (regime de competência).
7. Sistema **valida**:
   - As provisões foram calculadas sobre as bases corretas?
   - Os encargos estão incidentes?
   - Não há duplicidade?
8. Sistema exibe ao operador o **resumo das provisões**:
   - Por funcionário: férias, 13º, encargos.
   - Por centro de custo.
   - Por natureza (custo/despesa).
   - Totais.
9. Operador pode **revisar** e, se necessário, **override** (com justificativa, auditado).
10. Sistema registra as provisões e atualiza os relatórios.

**Fluxos alternativos:**
- **FA1 — Funcionário admitido no mês:** provisão proporcional aos meses trabalhados no ano (fase 2).
- **FA2 — Funcionário demitido no mês:** provisão calculada até a data da demissão, com reversão conforme o caso. **Fase 2.**
- **FA3 — Férias gozadas no mês:** reversão parcial da provisão e lançamento do valor efetivo. **Fase 2.**
- **FA4 — 13º pago no mês:** reversão parcial da provisão e lançamento do valor efetivo. **Fase 2.**
- **FA5 — Reprocessamento das provisões:** se o operador reconfigurar, o sistema **substitui** as provisões anteriores do período (com auditoria).
- **FA6 — Funcionário de período fechado:** não pode ser reconsolidado `[T5]`.

**Exceções:**
- **EX1 — Nenhum período aberto:** bloqueia `[T5]`.
- **EX2 — Nenhum funcionário ativo:** sistema informa e não lança (não é erro).
- **EX3 — Parâmetros trabalhistas não carregados:** bloqueia e exige configuração.
- **EX4 — Funcionário com dados incompletos** (sem salário base): pendência **Erro** `[T6]`.
- **EX5 — Divergência entre cálculo e configuração:** aviso, com opção de override.
- **EX6 — Falha no cálculo:** pendência **Erro** `[T6]`.
- **EX7 — Funcionário de período fechado:** não pode ser reconsolidado `[T5]`.

**Pós-condições:**
- Provisões calculadas e lançadas (ou override registrado).
- Lançamentos em partidas dobradas gerados.
- DRE atualizado (custo/despesa de provisões).
- Provisões a Pagar atualizadas no Passivo.
- Razão de impostos `[T7]` atualizado (encargos sobre provisões).
- Pendências registradas `[T6]`, se houver.
- Auditoria (override, reprocessamento).

**Regras de negócio:**
- **RN1** A provisão de férias é 1/12 do salário + 1/3, acrescido dos encargos incidentes.
- **RN2** A provisão de 13º é 1/12 do salário, acrescido dos encargos incidentes.
- **RN3** A base de cálculo considera as **flags de incidência** do cadastro de proventos/descontos.
- **RN4** A alocação respeita o centro de custo e a natureza (custo/despesa fixa) do funcionário (B3).
- **RN5** As provisões são calculadas **mensalmente** (padrão) ou no fechamento, conforme configuração.
- **RN6** `[T7]` Os encargos sobre provisões geram débito no razão de impostos **no momento da provisão** (regime de competência).
- **RN7** Override exige justificativa e é registrado em auditoria.
- **RN8** Reprocessamento substitui as provisões anteriores do período, com auditoria.
- **RN9** `[T5]` Provisões de período fechado não são recalculadas.
- **RN10** Funcionário com dados incompletos gera **Erro** `[T6]`.
- **RN11** Ausência de funcionários no período não é erro.
- **RN12** Reversão de provisões (férias gozadas, 13º pago) é tratada na fase 2.

**Telas envolvidas:**
- Painel "Resumo das Provisões" (por funcionário, centro de custo, natureza).
- Modal de override (com justificativa).
- Cadastro de funcionários (B3).
- DRE gerencial (G1).
- Razão de impostos `[T7]`.
- Tela de pendências `[T6]`.

---

## MÓDULO F — FINANCEIRO

### F1 — Gerar contas a pagar a partir de compras

**Nome:** Gerar contas a pagar a partir de documentos de compra.
**Objetivo:** A partir de um documento de compra (NF-e, NFS-e tomada, CT-e tomado, RPA), gerar automaticamente as **contas a pagar** correspondentes, com vencimento, valor, contraparte e forma de pagamento, alimentando o fluxo de caixa gerencial.

**Ator principal:** Sistema (ator automático).
**Atores secundários:** Operador (pode ajustar), Controller (configura prazos padrão).

**Pré-condições:**
- Empresa cadastrada (A1).
- Existe um documento de compra no período aberto (C1, C2, C3, C5, C8) `[T5]`.
- Fornecedor cadastrado (B2) ou criado automaticamente.

**Quando é acionado:**
- Automaticamente, ao criar um documento de compra.
- Sob demanda, na revisão (D3), se o operador quiser regenerar.

**Particularidades:**
- **Uma compra pode gerar várias contas a pagar** (ex: parcelada em 3x).
- **Forma de pagamento define a geração:**
  - **À vista:** não gera conta a pagar; gera lançamento direto em Caixa/Banco.
  - **A prazo:** gera contas a pagar com vencimentos.
  - **Cartão de crédito:** gera conta a pagar com vencimento na data da fatura (configurável).
- **Retenções:** quando a empresa retém impostos (ISS, INSS, IRRF, PIS/COFINS/CSLL), o valor líquido a pagar ao fornecedor é **menor** que o valor bruto. As retenções geram **contas a recolher** (Passivo), não contas a pagar ao fornecedor.
- **Parcelamento:** o operador informa o número de parcelas e o intervalo (**configurável, padrão mensal**); o sistema gera as contas com vencimentos calculados.
- **Data de vencimento:** pode vir do XML (quando informada), do cadastro do fornecedor (prazo padrão), ou ser informada manualmente.

**Fluxo principal:**
1. Documento de compra é criado (ou está sendo revisado).
2. Sistema identifica:
   - Valor total do documento.
   - Retenções (se houver) → valor líquido a pagar ao fornecedor.
   - Forma de pagamento (à vista, a prazo, cartão).
   - Prazo padrão do fornecedor (B2) ou do documento.
3. Sistema gera as **contas a pagar**:
   - **À vista:** lançamento em Caixa/Banco (não gera conta a pagar).
   - **A prazo (parcela única):** uma conta a pagar com vencimento na data calculada.
   - **A prazo (parcelado):** N contas a pagar com vencimentos calculados.
   - **Cartão:** uma conta a pagar com vencimento na data da fatura (configurável).
4. Sistema gera também as **contas a recolher** (retenções) — se houver.
5. Sistema **valida**:
   - A soma das contas a pagar + retenções = valor bruto do documento?
   - Os vencimentos são válidos (não retroativos ao período fechado)? `[T5]`
6. Sistema exibe ao operador o **resumo das contas geradas**.
7. Operador pode **ajustar** (vencimentos, parcelas) antes de confirmar.
8. Sistema registra as contas a pagar e integra ao fluxo de caixa (F4).

**Fluxos alternativos:**
- **FA1 — Documento com vencimento informado no XML:** sistema usa o vencimento do XML, se disponível.
- **FA2 — Fornecedor com prazo padrão cadastrado (B2):** sistema usa o prazo padrão para calcular o vencimento.
- **FA3 — Documento sem forma de pagamento informada:** sistema pergunta ao operador ou usa o padrão do fornecedor.
- **FA4 — Pagamento à vista:** sistema não gera conta a pagar; gera lançamento direto em Caixa/Banco.
- **FA5 — Pagamento com cartão de crédito:** sistema gera conta a pagar com vencimento na data da fatura (configurável). Prazo de repasse por operadora fica para **fase 2**.
- **FA6 — Reprocessamento:** se o documento for alterado, o sistema **substitui** as contas a pagar anteriores (com auditoria).
- **FA7 — Documento de período fechado:** não pode gerar contas a pagar `[T5]`.

**Exceções:**
- **EX1 — Nenhum período aberto:** não aplicável (F1 é acionado dentro de um documento já criado) `[T5]`.
- **EX2 — Forma de pagamento não informada:** sistema pergunta ou usa padrão; se não houver padrão, pendência **Erro** `[T6]`.
- **EX3 — Vencimento retroativo ao período fechado:** sistema bloqueia e pede ajuste `[T5]`.
- **EX4 — Soma das parcelas ≠ valor bruto:** sistema bloqueia e pede ajuste.
- **EX5 — Fornecedor sem cadastro:** criado automaticamente (RN11 de C6/C7/C8) ou pendência.
- **EX6 — Falha na geração:** pendência **Erro** `[T6]`.

**Pós-condições:**
- Contas a pagar geradas (ou lançamento à vista).
- Contas a recolher (retenções) geradas, se houver.
- Fluxo de caixa (F4) atualizado.
- Pendências registradas `[T6]`, se houver.
- Auditoria (ajustes, reprocessamento).

**Regras de negócio:**
- **RN1** Uma compra pode gerar uma ou várias contas a pagar (parcelamento).
- **RN2** O valor líquido a pagar ao fornecedor = valor bruto − retenções.
- **RN3** Retenções geram contas a recolher (Passivo), não contas a pagar ao fornecedor.
- **RN4** À vista não gera conta a pagar; gera lançamento direto em Caixa/Banco.
- **RN5** `[T5]` Vencimentos não podem ser retroativos ao período fechado.
- **RN6** A soma das contas a pagar + retenções deve igualar o valor bruto do documento.
- **RN7** O operador pode ajustar vencimentos e parcelas antes de confirmar.
- **RN8** Reprocessamento substitui as contas anteriores, com auditoria.
- **RN9** Forma de pagamento pode vir do XML, do cadastro do fornecedor ou ser informada manualmente.
- **RN10** `[T5]` Documento de período fechado não gera contas a pagar.
- **RN11** Parcelamento tem intervalo configurável, com padrão mensal.

**Telas envolvidas:**
- Painel "Contas a Pagar Geradas" (dentro da tela de revisão D3 ou da tela de detalhes do documento).
- Modal de ajuste de parcelas/vencimentos.
- Cadastro de fornecedores (B2).
- Fluxo de caixa (F4).
- Tela de pendências `[T6]`.

---

### F2 — Gerar contas a receber a partir de vendas

**Nome:** Gerar contas a receber a partir de documentos de venda.
**Objetivo:** A partir de um documento de venda (NF-e de saída, NFS-e prestada, CT-e emitido), gerar automaticamente as **contas a receber** correspondentes, com vencimento, valor, contraparte e forma de recebimento, alimentando o fluxo de caixa gerencial.

**Ator principal:** Sistema (ator automático).
**Atores secundários:** Operador (pode ajustar), Controller (configura prazos padrão).

**Pré-condições:**
- Empresa cadastrada (A1).
- Existe um documento de venda no período aberto (C1, C2, C3, C5) `[T5]`.
- Cliente cadastrado (B1) ou criado automaticamente.

**Quando é acionado:**
- Automaticamente, ao criar um documento de venda.
- Sob demanda, na revisão (D3), se o operador quiser regenerar.

**Particularidades:**
- **Uma venda pode gerar várias contas a receber** (ex: parcelada em 3x).
- **Forma de recebimento define a geração:**
  - **À vista:** não gera conta a receber; gera lançamento direto em Caixa/Banco.
  - **A prazo:** gera contas a receber com vencimentos.
  - **Cartão de crédito/débito:** gera conta a receber com vencimento na **data do repasse da operadora** (configurável por operadora — fase 2 para prazos específicos).
- **Retenções sofridas:** quando o cliente retém impostos (ISS, IR, INSS, PIS/COFINS/CSLL), o valor líquido a receber é **menor** que o valor bruto. As retenções geram **contas a recuperar** (Ativo), integradas ao razão de impostos `[T7]`.
- **Parcelamento:** o operador informa o número de parcelas e o intervalo (**configurável, padrão mensal**).
- **Data de vencimento:** pode vir do XML, do cadastro do cliente (prazo padrão), ou ser informada manualmente.

**Fluxo principal:**
1. Documento de venda é criado (ou está sendo revisado).
2. Sistema identifica:
   - Valor total do documento.
   - Retenções sofridas (se houver) → valor líquido a receber.
   - Forma de recebimento (à vista, a prazo, cartão).
   - Prazo padrão do cliente (B1) ou do documento.
3. Sistema gera as **contas a receber**:
   - **À vista:** lançamento em Caixa/Banco (não gera conta a receber).
   - **A prazo (parcela única):** uma conta a receber com vencimento na data calculada.
   - **A prazo (parcelado):** N contas a receber com vencimentos calculados.
   - **Cartão:** uma conta a receber com vencimento na data do repasse.
4. Sistema gera também as **contas a recuperar** (retenções sofridas) — se houver.
5. Sistema **valida**:
   - A soma das contas a receber + retenções = valor bruto do documento?
   - Os vencimentos são válidos? `[T5]`
6. Sistema exibe ao operador o **resumo das contas geradas**.
7. Operador pode **ajustar** (vencimentos, parcelas) antes de confirmar.
8. Sistema registra as contas a receber e integra ao fluxo de caixa (F4).

**Fluxos alternativos:**
- **FA1 — Documento com vencimento informado no XML:** sistema usa o vencimento do XML.
- **FA2 — Cliente com prazo padrão cadastrado (B1):** sistema usa o prazo padrão.
- **FA3 — Documento sem forma de recebimento informada:** sistema pergunta ou usa o padrão do cliente.
- **FA4 — Recebimento à vista:** lançamento direto em Caixa/Banco.
- **FA5 — Recebimento com cartão:** conta a receber com vencimento na data do repasse (configurável por operadora).
- **FA6 — Reprocessamento:** substitui as contas anteriores, com auditoria.
- **FA7 — Documento de período fechado:** não pode gerar contas a receber `[T5]`.

**Exceções:**
- **EX1 — Nenhum período aberto:** não aplicável `[T5]`.
- **EX2 — Forma de recebimento não informada:** pergunta ou usa padrão; se não houver, pendência **Erro** `[T6]`.
- **EX3 — Vencimento retroativo ao período fechado:** bloqueia e pede ajuste `[T5]`.
- **EX4 — Soma das parcelas ≠ valor bruto:** bloqueia e pede ajuste.
- **EX5 — Cliente sem cadastro:** criado automaticamente ou pendência.
- **EX6 — Falha na geração:** pendência **Erro** `[T6]`.

**Pós-condições:**
- Contas a receber geradas (ou lançamento à vista).
- Contas a recuperar (retenções) geradas, se houver.
- Fluxo de caixa (F4) atualizado.
- Pendências registradas `[T6]`, se houver.
- Auditoria (ajustes, reprocessamento).

**Regras de negócio:**
- **RN1** Uma venda pode gerar uma ou várias contas a receber (parcelamento).
- **RN2** O valor líquido a receber = valor bruto − retenções sofridas.
- **RN3** `[T7]` Retenções sofridas geram contas a recuperar (Ativo), integradas ao razão de impostos.
- **RN4** À vista não gera conta a receber; gera lançamento direto em Caixa/Banco.
- **RN5** `[T5]` Vencimentos não podem ser retroativos ao período fechado.
- **RN6** A soma das contas a receber + retenções deve igualar o valor bruto do documento.
- **RN7** O operador pode ajustar vencimentos e parcelas antes de confirmar.
- **RN8** Reprocessamento substitui as contas anteriores, com auditoria.
- **RN9** Forma de recebimento pode vir do XML, do cadastro do cliente ou ser informada manualmente.
- **RN10** `[T5]` Documento de período fechado não gera contas a receber.
- **RN11** Parcelamento tem intervalo configurável, com padrão mensal.

**Telas envolvidas:**
- Painel "Contas a Receber Geradas" (dentro de D3 ou do detalhe do documento).
- Modal de ajuste de parcelas/vencimentos.
- Cadastro de clientes (B1).
- Fluxo de caixa (F4).
- Tela de pendências `[T6]`.

---

### F3 — Registrar baixa de contas a pagar/receber

**Nome:** Registrar baixa (pagamento/recebimento) de contas a pagar e a receber.
**Objetivo:** Permitir ao operador registrar o pagamento (contas a pagar) ou o recebimento (contas a receber) de uma conta, total ou parcialmente, com juros, multa, descontos, e integração ao fluxo de caixa e ao razão de impostos `[T7]`.

**Ator principal:** Operador / Auxiliar.
**Atores secundários:** Sistema (valida, calcula juros/multa/desconto, integra ao caixa e ao `[T7]`).

**Pré-condições:**
- Existe uma conta a pagar ou a receber no período aberto (F1, F2) `[T5]`.
- A conta está com status "Aberta" ou "Parcialmente baixada".

**Quando é usada:**
- No dia do pagamento/recebimento.
- Em lote (várias contas do mesmo fornecedor/cliente).
- Parcialmente (baixa parcial).

**Particularidades:**
- **Baixa total:** o valor pago/recebido é igual ao valor da conta.
- **Baixa parcial:** o valor pago/recebido é menor que o valor da conta; o saldo restante permanece em aberto.
- **Juros e multa:** quando o pagamento/recebimento ocorre após o vencimento, o sistema **calcula automaticamente** conforme parâmetros configurados, **com opção de override** pelo operador.
- **Desconto:** quando o pagamento/recebimento ocorre antes do vencimento ou por negociação, o operador pode informar desconto.
- **Forma de pagamento/recebimento:** Caixa, Banco X, cartão, transferência, etc.
- **Integração com o razão de impostos** `[T7]`: retenções pagas/recebidas atualizam o razão; juros/multa não afetam impostos.
- **Integração com o fluxo de caixa (F4):** toda baixa atualiza a posição de caixa/banco.

**Fluxo principal:**
1. Operador acessa "Financeiro > Contas a Pagar" (ou "Contas a Receber").
2. Sistema exibe a lista de contas em aberto, com filtros.
3. Operador seleciona uma conta (ou várias, para baixa em lote).
4. Sistema exibe o **formulário de baixa**:
   - Valor da conta.
   - Data de vencimento.
   - Data do pagamento/recebimento (padrão: hoje).
   - Valor pago/recebido (padrão: valor da conta; editável para baixa parcial).
   - Juros e multa (calculados automaticamente se a data for após o vencimento; editáveis).
   - Desconto (opcional; editável).
   - Forma de pagamento/recebimento.
   - Observações.
5. Operador confirma.
6. Sistema **valida**:
   - A data está no período aberto? `[T5]`
   - O valor pago/recebido + juros + multa − desconto é consistente?
   - A forma de pagamento/recebimento é válida?
7. Sistema **registra a baixa**:
   - **Contas a pagar:** débito em Contas a Pagar, crédito em Caixa/Banco. Juros/multa → despesa financeira. Desconto → receita financeira.
   - **Contas a receber:** débito em Caixa/Banco, crédito em Contas a Receber. Juros/multa → receita financeira. Desconto → despesa financeira.
8. Sistema **atualiza o status** da conta:
   - Baixa total → "Baixada".
   - Baixa parcial → "Parcialmente baixada" (saldo restante em aberto).
9. Sistema **integra ao fluxo de caixa (F4)** e ao **razão de impostos** `[T7]`, quando aplicável.
10. Sistema exibe confirmação e atualiza a lista.

**Fluxos alternativos:**
- **FA1 — Baixa em lote:** operador seleciona várias contas do mesmo fornecedor/cliente e registra a baixa de todas de uma vez. **Fase 1.** (Futuramente, terá importação de arquivo de remessa do banco — CNAB —, fase 2.)
- **FA2 — Baixa parcial:** operador informa valor menor que o da conta; o saldo restante permanece em aberto.
- **FA3 — Pagamento/recebimento com juros e multa:** sistema calcula automaticamente conforme parâmetros, **com opção de override** pelo operador.
- **FA4 — Pagamento/recebimento com desconto:** operador informa o desconto; o sistema registra como receita/despesa financeira.
- **FA5 — Estorno de baixa:** operador pode estornar uma baixa registrada por engano (com auditoria); a conta volta ao status anterior. **Permitido sempre.**
- **FA6 — Baixa de conta de período fechado:** não pode ser baixada `[T5]`.

**Exceções:**
- **EX1 — Nenhum período aberto:** bloqueia a baixa `[T5]`.
- **EX2 — Conta já baixada:** sistema bloqueia e informa.
- **EX3 — Valor pago/recebido maior que o saldo devedor/credor:** avisa e pede confirmação (pode ser adiantamento).
- **EX4 — Data de pagamento/recebimento fora do período aberto:** aviso + confirmação `[T5]`.
- **EX5 — Forma de pagamento/recebimento não informada:** bloqueia.
- **EX6 — Falha no registro:** pendência **Erro** `[T6]`.

**Pós-condições:**
- Baixa registrada (total ou parcial).
- Status da conta atualizado.
- Fluxo de caixa (F4) atualizado.
- Razão de impostos `[T7]` atualizado, se aplicável.
- Auditoria registrada (baixa, estorno).
- Pendências registradas `[T6]`, se houver.

**Regras de negócio:**
- **RN1** `[T5]` A baixa só é permitida no período aberto. Data fora → aviso + confirmação.
- **RN2** Baixa total ou parcial é permitida.
- **RN3** Juros e multa são calculados automaticamente (se após o vencimento), com opção de override.
- **RN4** Desconto é informado pelo operador e registrado como receita/despesa financeira.
- **RN5** Baixa em lote é permitida (mesmo fornecedor/cliente, mesmos parâmetros). Fase 1.
- **RN6** Estorno de baixa é permitido, com auditoria.
- **RN7** Toda baixa integra o fluxo de caixa (F4).
- **RN8** `[T7]` Retenções pagas/recebidas atualizam o razão de impostos.
- **RN9** Conta já baixada não pode ser baixada novamente.
- **RN10** `[T5]` Conta de período fechado não pode ser baixada.

**Telas envolvidas:**
- Tela "Contas a Pagar" / "Contas a Receber" (lista + filtros).
- Formulário de baixa (total/parcial, juros, multa, desconto).
- Modal de confirmação de data divergente.
- Tela de estorno de baixa.
- Fluxo de caixa (F4).
- Razão de impostos `[T7]`.
- Tela de pendências `[T6]`.

---

### F4 — Consultar posição de caixa e bancos

**Nome:** Consultar posição de caixa e bancos.
**Objetivo:** Oferecer ao administrador e ao operador uma visão consolidada das disponibilidades (caixa, bancos, aplicações) e do **fluxo de caixa projetado** (a partir das contas a pagar/receber em aberto), apoiando a decisão de curto prazo.

**Ator principal:** Administrador / Empresário (consulta) e Operador (consulta).
**Atores secundários:** Sistema (consolida saldos, projeta fluxo).

**Pré-condições:**
- Empresa cadastrada (A1).
- Existem lançamentos financeiros (C4, C5, F1, F2, F3).

**Quando é usada:**
- Diariamente (consulta de saldo).
- Semanalmente/mensalmente (projeção de fluxo).
- Antes de decisões de pagamento/recebimento.
- Na simulação (H) — como referência de caixa.

**Particularidades:**
- **Posição atual:** saldo de Caixa + saldo de Bancos + Aplicações financeiras − Contas a pagar em aberto + Contas a receber em aberto.
- **Fluxo projetado:** para cada dia/semana/mês futuro, entradas previstas (contas a receber) − saídas previstas (contas a pagar), partindo do saldo atual.
- **Visão por conta:** saldo individual de cada banco/aplicação.
- **Visão consolidada:** total da empresa (ou por filial).
- **Alertas:** contas vencidas, saldo negativo projetado, concentração de vencimentos.
- **Estimativas (RN11):** contas sem valor/vencimento podem receber "valor/vencimento aproximado", usados **apenas em simulações** (fase 2).

**Fluxo principal:**
1. Usuário acessa "Financeiro > Posição de Caixa".
2. Sistema exibe a **posição atual** (saldos, contas em aberto, saldo projetado).
3. Sistema exibe o **fluxo de caixa projetado**:
   - Por dia (próximos 30 dias) ou por semana/mês (próximos 12 meses).
   - Entradas previstas, saídas previstas, saldo acumulado.
   - Gráfico de linha ou barras.
4. Usuário pode **filtrar**:
   - Por período (data inicial/final).
   - Por conta (banco específico).
   - Por fornecedor/cliente.
   - Por tipo (contas a pagar/receber).
   - Por centro de custo (**fase 1**).
   - Por filial (todas ou específica).
5. Usuário pode **clicar** em um item para ver os detalhes (quais contas compõem aquele valor).
6. Sistema exibe **alertas**:
   - Contas vencidas (a pagar/receber).
   - Saldo negativo projetado em algum dia/semana/mês.
   - Concentração de vencimentos.

**Fluxos alternativos:**
- **FA1 — Visão por centro de custo:** filtro do fluxo por centro de custo. Fase 1.
- **FA2 — Visão por tipo de despesa/receita:** filtrar por categoria (ex: só folha, só impostos).
- **FA3 — Exportação:** exportar a posição e o fluxo para Excel/PDF.
- **FA4 — Comparação com o realizado:** comparar o fluxo projetado do período anterior com o que efetivamente ocorreu. **Fase 2.**
- **FA5 — Simulação de fluxo:** simular o impacto de decisões (antecipar recebimentos, postergar pagamentos) — integra com H.

**Exceções:**
- **EX1 — Nenhum lançamento financeiro:** sistema informa que não há dados suficientes para projeção.
- **EX2 — Contas a pagar/receber sem vencimento:** sistema não projeta (pendência **Aviso** `[T6]`).
- **EX3 — Saldo de banco desatualizado:** sistema exibe aviso "Saldo pode estar desatualizado — verifique baixas pendentes".
- **EX4 — Falha na consolidação:** sistema exibe erro e mantém a última posição válida.

**Pós-condições:**
- Posição atual e fluxo projetado exibidos.
- Alertas gerados.
- Nenhum dado é alterado (consulta apenas).

**Regras de negócio:**
- **RN1** A posição atual considera Caixa + Bancos + Aplicações − Contas a pagar em aberto + Contas a receber em aberto.
- **RN2** O fluxo projetado considera apenas contas com vencimento definido.
- **RN3** Contas vencidas aparecem destacadas (alertas).
- **RN4** O usuário pode filtrar por período, conta, fornecedor/cliente, tipo e centro de custo.
- **RN5** O sistema exibe alertas de saldo negativo projetado e concentração de vencimentos.
- **RN6** A consulta não altera dados.
- **RN7** A posição pode ser exportada.
- **RN8** `[T6]` Contas sem vencimento geram **Aviso** e não entram na projeção.
- **RN9** A visão por centro de custo é permitida (útil para gestores de área). Fase 1.
- **RN10** A simulação de fluxo (FA5) integra com H.
- **RN11** Contas sem valor ou sem vencimento definido podem receber **"valor aproximado"** e/ou **"vencimento aproximado"**, marcados como **estimativas**. Esses valores são usados **apenas nas simulações (H)** e em projeções gerenciais, **nunca** nos relatórios reais (DRE, fluxo de caixa realizado, contas a pagar/receber oficiais). Ao exibir a projeção, o sistema pode incluir as estimativas (com ressalva "inclui estimativas"), e no detalhamento elas aparecem com ícone/aviso.
- **RN12** A posição e o fluxo podem ser visualizados por filial ou consolidados.

**Telas envolvidas:**
- Tela "Posição de Caixa" (saldo atual + contas em aberto + saldo projetado).
- Tela "Fluxo de Caixa Projetado" (gráfico + tabela por período).
- Painel de alertas.
- Detalhamento por item (drill-down).
- Exportação (Excel/PDF).
- (Futura) Tela de comparação com realizado (fase 2).

---

### F5 — Caixa de entrada e caixa de saída (ordens)

**Nome:** Consultar caixa de entrada, caixa de saída e histórico (ordens).
**Objetivo:** Dar ao ator uma **fila única de trabalho** (caixa de entrada), o **acompanhamento do que ele enviou** (caixa de saída) e o **histórico** das ordens concluídas/canceladas, sem precisar navegar por várias telas.

**Ator principal:** todos os atores.
**Atores secundários:** Sistema (consolida ordens, aplica filtros, atualiza status).

**Pré-condições:**
- Usuário logado (com tag de ator).
- Período aberto `[T5]`.
- Filial selecionada.

**Quando é usada:**
- Diariamente (verificar o que precisa ser feito).
- Após receber uma notificação (ordem nova).
- Antes do fechamento (resolver pendências).
- Para acompanhar o que foi enviado a outro ator.

**Particularidades:**
- **Caixa de entrada:** fila única de trabalho — ordens pendentes e em andamento, urgentes destacadas. Mostra: documento, ator de origem, o que fazer, data de recebimento. Ações: processar, marcar como urgente, consultar histórico.
- **Caixa de saída:** ordens que o ator emitiu e ainda estão **pendentes** (o outro ator não executou) ou **em andamento** (o outro ator começou, mas não terminou). Concluída vai para o histórico.
- **Histórico:** consulta separada, com filtros (documento, ator, período, status). Mostra tudo: enviadas, recebidas, concluídas. Acessível pelo ator (vê o que enviou/recebeu) e pelo Auditor (vê tudo).
- **Tudo é ordem:** documento, pendência, conta, folha, fechamento — tudo chega como ordem na caixa de entrada.
- **Filtro "Pendências" (T6):** mostra as ordens de resolução de pendência (O9, O11) atribuídas ao ator.
- **Sem outras tarefas:** não há agenda, calendário, lista de afazeres ou notificação separada. A caixa de entrada é a fila única.
- **Status "urgente":** marcação na ordem, por decisão do ator (T8.6). Sem prazo obrigatório.

**Fluxo principal:**
1. Ator acessa "Meu Trabalho > Caixa de Entrada" (1.1), "Caixa de Saída" (1.2) ou "Histórico" (1.3).
2. Sistema identifica o ator e carrega as ordens correspondentes:
   - **Caixa de entrada:** `atorDestino = ator` e `status` pendente/em_andamento.
   - **Caixa de saída:** `atorOrigem = ator` e `status` pendente/em_andamento.
   - **Histórico:** `atorOrigem = ator` OU `atorDestino = ator` e `status` concluída/cancelada.
3. Sistema aplica os filtros disponíveis (tipo de ordem, urgente, ator de origem, período, status, pendências T6).
4. Sistema exibe a lista de ordens (com descrição resumida, documento, ator de origem/destino, data, status, urgente).
5. Ator pode:
   - **Abrir** uma ordem (muda status para `em_andamento`).
   - **Concluir** uma ordem (muda status para `concluida` e dispara a próxima).
   - **Cancelar** uma ordem (com justificativa).
   - **Marcar como urgente** (alterna `urgente`).
   - **Ver o documento** de origem.
   - **Ver o histórico** da ordem.
6. Sistema registra a ação em auditoria (T8.7).
7. Sistema re-renderiza a lista (remove os já concluídos/cancelados da caixa de entrada; move para o histórico).
8. Ator pode acessar o **histórico** a qualquer momento (consulta separada).

**Fluxos alternativos:**
- **FA1 — Ação em lote:** o ator seleciona várias ordens e conclui/cancela de uma vez (quando o tipo permite).
- **FA2 — Filtro por "Pendências":** o ator filtra apenas as ordens de resolução de pendência (O9, O11) atribuídas a ele.
- **FA3 — Drill-down por ordem:** o ator clica em uma ordem e vê os detalhes (documento de origem, histórico de transições, justificativa).
- **FA4 — Ordem urgente:** o ator marca uma ordem como urgente; ela sobe na lista e aparece destacada.
- **FA5 — Reabertura:** uma ordem concluída pode gerar uma **nova ordem** (ex: O27 — reclassificar), vinculada à anterior via `id_ordem_anterior`.
- **FA6 — Ordem automática:** ordens automáticas (O29–O32) **não aparecem** na caixa de entrada (são processadas pelo sistema). Aparecem apenas no histórico, se o ator quiser consultar.

**Exceções:**
- **EX1 — Nenhum período aberto:** a caixa de entrada mostra um aviso "Nenhum período aberto" e desabilita as ações que dependem de período (T5).
- **EX2 — Lista vazia:** a caixa de entrada mostra "Nenhuma ordem pendente ou em andamento"; a caixa de saída mostra "Nenhuma ordem emitida pendente"; o histórico mostra "Nenhuma ordem no histórico".
- **EX3 — Falha ao carregar:** sistema exibe erro e mantém a última lista válida.
- **EX4 — Ator tenta concluir ordem de outro ator:** bloqueia (a ordem não pertence a ele).
- **EX5 — Ator tenta cancelar ordem já concluída:** bloqueia.

**Pós-condições:**
- Ordens processadas (abertas, concluídas ou canceladas).
- Status atualizado.
- Auditoria registrada (quem, quando, o que mudou).
- Caixa de entrada/saída/histórico atualizados.

**Regras de negócio:**
- **RN1** A caixa de entrada é a **fila única de trabalho** do ator (T8.5).
- **RN2** Toda ordem tem um **ator de origem** e um **ator de destino** (T8.11).
- **RN3** A caixa de entrada mostra apenas ordens com `atorDestino = ator` e status pendente/em_andamento.
- **RN4** A caixa de saída mostra apenas ordens com `atorOrigem = ator` e status pendente/em_andamento.
- **RN5** O histórico mostra ordens concluídas/canceladas (do ator como origem ou destino).
- **RN6** Toda transição de estado é registrada em auditoria (T8.7).
- **RN7** Ordens automáticas (O29–O32) não aparecem na caixa de entrada.
- **RN8** O status "urgente" é marcação do ator, por ordem (não por documento) (T8.6).
- **RN9** O filtro "Pendências" mostra as ordens O9/O11 atribuídas ao ator.
- **RN10** A ação em lote é permitida quando o tipo de ordem permite.
- **RN11** Reabertura gera nova ordem vinculada à anterior via `id_ordem_anterior`.

**Telas envolvidas:**
- Caixa de Entrada (1.1).
- Caixa de Saída (1.2).
- Histórico (1.3).
- Detalhes da ordem (drill-down).
- Filtros (tipo, urgente, ator de origem, período, status, pendências T6).

---

### F6 — Visualizar a Tela Inicial (dashboard)

**Nome:** Visualizar a Tela Inicial (dashboard por ator).
**Objetivo:** Dar ao ator uma visão geral do que importa para ele (alertas, KPIs, ações rápidas, ordens pendentes, resumo), sem precisar navegar pelo menu.

**Ator principal:** todos os atores.
**Atores secundários:** Sistema (consolida dados, monta a tela).

**Pré-condições:**
- Usuário logado (com tag de ator).
- Período aberto `[T5]`.
- Filial selecionada.

**Fluxo principal:**
1. Ao carregar a página (ou ao trocar de ator), o sistema abre a Tela Inicial.
2. O sistema identifica o ator e monta a tela com:
   - **Saudação:** nome, data, período, filial.
   - **Alertas:** o que precisa de atenção (contas vencidas, pendências, ordens urgentes).
   - **KPIs:** 4 indicadores-chave (específicos do ator).
   - **Ações rápidas:** 4 botões para as tarefas mais frequentes.
   - **Minhas ordens:** 3 primeiras ordens pendentes/em andamento + "Ver todas".
   - **Resumo:** bloco livre (lista, mini-DRE, tabela, timeline).
3. O ator pode clicar em qualquer alerta, ação ou ordem para ir à tela correspondente.
4. O ator pode clicar em "Ver todas" para ir à Caixa de Entrada (1.1).

**Fluxos alternativos:**
- **FA1 — Ator sem ordens:** a seção "Minhas ordens" mostra "Nenhuma ordem pendente ou em andamento".
- **FA2 — Ator sem alertas:** a seção de alertas não aparece.
- **FA3 — Ator sem resumo:** a seção de resumo não aparece (ex: Configurador pode ter resumo vazio).

**Exceções:**
- **EX1 — Nenhum período aberto:** a Tela Inicial mostra um aviso "Nenhum período aberto" e desabilita as ações que dependem de período.
- **EX2 — Falha ao carregar os dados:** a Tela Inicial mostra um erro e mantém o menu lateral funcional.

**Pós-condições:**
- Tela Inicial exibida.
- Nenhum dado é alterado (consulta apenas).

**Regras de negócio:**
- **RN1** A Tela Inicial é **fixa** por ator na fase 1.
- **RN2** É o **primeiro item do menu** (1.0).
- **RN3** Ao carregar a página ou trocar de ator, a Tela Inicial é aberta.
- **RN4** Os alertas, ações e ordens são clicáveis e levam à tela correspondente.
- **RN5** A Tela Inicial **não substitui** as telas; ela **aponta** para elas.
- **RN6** O conteúdo varia por ator (ver `12_tela_inicial.md`, seção 3).

**Telas envolvidas:**
- Tela Inicial (dashboard).

### F7 — Consultar o Conselheiro (sugestões de melhoria)

**Nome:** Consultar o Conselheiro (sugestões de melhoria).
**Objetivo:** Analisar os dados do sistema e sugerir **melhorias acionáveis** ao gestor, com **dado que fundamenta**, **ação concreta** e **impacto estimado**.

**Ator principal:** Administrador / Empresário (principal), Contador (sugestões fiscais).
**Atores secundários:** Sistema (aplica as heurísticas, prioriza, exibe).

**Pré-condições:**
- Empresa cadastrada (A1).
- Dados suficientes no período (DRE, custos, margem, caixa, impostos, folha, ativos).
- Período aberto ou fechado (o Conselheiro lê ambos).

**Fluxo principal:**
1. Ator acessa "Administrador > Conselheiro" (3.10) ou clica em "Ver todas" no card do dashboard.
2. Sistema identifica o período e a filial (ou consolidado).
3. Sistema carrega os dados das 6 áreas (rentabilidade, custos, caixa, impostos, eficiência, risco).
4. Sistema aplica as 57 heurísticas (cada uma verifica seu gatilho).
5. Sistema calcula a prioridade de cada sugestão (impacto × esforço × confiança).
6. Sistema filtra as sugestões já marcadas como lidas (se o gestor não pediu para mostrá-las).
7. Sistema agrupa por prioridade (Alta / Média / Baixa) e exibe os cards.
8. Ator pode:
   - **Ver dados:** abrir modal com os dados que fundamentam a sugestão.
   - **Ir para [tela]:** navegar para a tela indicada (ex: margem, análise de custos, fluxo de caixa).
   - **Marcar como lida:** mover a sugestão para "Sugestões lidas".
   - **Desmarcar como lida:** voltar a sugestão para as prioridades.
   - **Analisar novamente:** recalcular com os dados mais recentes.
   - **Exportar:** exportar as sugestões para Excel/PDF.
9. Sistema registra a ação (marcar/desmarcar como lida) em auditoria (se aplicável).

**Fluxos alternativos:**
- **FA1 — Card no dashboard:** o Administrador vê as 3 primeiras sugestões de alta prioridade na Tela Inicial (1.0) + "Ver todas".
- **FA2 — Filtros:** o gestor filtra por área, prioridade, período, filial.
- **FA3 — Sugestões fiscais:** as sugestões I1–I7 são encaminhadas ao Contador para validação (o gestor vê, mas o Contador valida).
- **FA4 — Analisar novamente:** o gestor pode recalcular sob demanda.
- **FA5 — Marcar todas como lidas:** o gestor pode marcar todas as sugestões visíveis de uma vez.
- **FA6 — Exportar:** o gestor pode exportar as sugestões.

**Exceções:**
- **EX1 — Nenhum dado suficiente:** o Conselheiro mostra "Nenhuma sugestão no momento" (não é erro).
- **EX2 — Dados incompletos:** a confiança da sugestão cai (Média/Baixa).
- **EX3 — Falha ao carregar os dados:** sistema exibe erro e mantém a última lista válida.
- **EX4 — Ator sem permissão de Administrador:** bloqueia (exceto Contador para sugestões fiscais).

**Pós-condições:**
- Lista de sugestões exibida.
- Nenhum dado é alterado (consulta apenas).

**Regras de negócio:**
- **RN1** Só emite sugestão com **dado + ação + impacto**.
- **RN2** Toda sugestão cita a **fonte**.
- **RN3** Toda sugestão tem **confiança** (Alta/Média/Baixa).
- **RN4** O Conselheiro **não altera dados**.
- **RN5** O Conselheiro **não substitui** o Contador, o Auditor ou o Administrador.
- **RN6** O Conselheiro **não promete resultado** (usa "impacto estimado").
- **RN7** Sugestões fiscais (I1–I7) são **encaminhadas ao Contador**.
- **RN8** O gestor pode **marcar/desmarcar como lida**.
- **RN9** **Automático** ao abrir; **sob demanda** para recalcular.
- **RN10** Heurísticas **fixas** na fase 1.
- **RN11** Por filial ou consolidado.
- **RN12** **Não notifica** na fase 1.

**Telas envolvidas:**
- Tela do Conselheiro (3.18).
- Card "Sugestões do Conselheiro" na Tela Inicial do Administrador (1.0).
- Modal "Ver dados" (por sugestão).
- Tela de destino (ex: margem, análise de custos, fluxo de caixa).

---

## MÓDULO G — RELATÓRIOS

### G1 — DRE gerencial por período

**Nome:** Visualizar DRE gerencial por período.
**Objetivo:** Apresentar a Demonstração do Resultado do Exercício (DRE) gerencial do período, consolidando receitas, custos, despesas, resultado financeiro e resultado líquido, com filtros e drill-down.

**Ator principal:** Administrador / Empresário.
**Atores secundários:** Controller (valida), Operador (consulta).

**Pré-condições:**
- Empresa cadastrada (A1).
- Existem lançamentos no período (aberto ou fechado) `[T5]`.

**Quando é usada:**
- Mensalmente (após o fechamento).
- A qualquer momento (DRE parcial do período aberto).
- Na simulação (H) — como referência.

**Estrutura do DRE:**

```
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

**Fluxo principal:**
1. Usuário acessa "Relatórios > DRE Gerencial".
2. Sistema solicita o **período** (mês/ano) ou intervalo.
3. Sistema consolida os lançamentos do período, agrupando por conta do plano de contas.
4. Sistema exibe o **DRE** com:
   - Valores por linha.
   - Percentual sobre a receita líquida (análise vertical).
   - Comparação com o período anterior e com o mesmo período do ano anterior (**fase 1**).
5. Usuário pode **clicar** em uma linha para ver os lançamentos que a compõem (drill-down).
6. Usuário pode **filtrar**:
   - Por filial (todas ou específica).
   - Por centro de custo.
   - Por unidade de negócio.
   - Por tipo de receita/despesa.
7. Usuário pode **exportar** (Excel/PDF).

**Fluxos alternativos:**
- **FA1 — DRE por centro de custo:** visão segmentada (integra com G2).
- **FA2 — DRE comparativo:** comparar dois períodos lado a lado.
- **FA3 — DRE orçado vs. realizado:** **fase 2** (orçamento é módulo adicional).
- **FA4 — DRE parcial do período aberto:** dados parciais, com aviso de que podem mudar.
- **FA5 — DRE consolidado multiempresa:** **fase 2**.
- **FA6 — Drill-down:** clicar em uma linha e ver os lançamentos que a compõem.
- **FA7 — Análise horizontal:** variação percentual entre períodos.

**Exceções:**
- **EX1 — Nenhum lançamento no período:** sistema informa que não há dados.
- **EX2 — Período sem fechamento:** DRE parcial com aviso ("dados parciais — período não fechado").
- **EX3 — Lançamentos não classificados no período:** DRE com aviso ("há lançamentos não classificados — o DRE pode estar incompleto"); pendência **Erro** `[T6]` se o período for fechar.
- **EX4 — Falha na consolidação:** erro e mantém o último DRE válido.

**Pós-condições:**
- DRE exibido.
- Nenhum dado é alterado (consulta apenas).

**Regras de negócio:**
- **RN1** O DRE segue a estrutura do plano de contas.
- **RN2** Impostos sobre vendas aparecem como **dedução da receita** (receita líquida já calculada).
- **RN3** Custos (CMV, custo de serviços) separados das despesas operacionais.
- **RN4** Despesas fixas, variáveis e não operacionais em subgrupos distintos.
- **RN5** Resultado financeiro separado do resultado operacional.
- **RN6** IR/CSLL é **estimativa gerencial** (não é cálculo fiscal real).
- **RN7** DRE pode ser visualizado por período, por centro de custo, comparativo e com drill-down.
- **RN8** `[T6]` Lançamentos não classificados geram aviso e podem tornar o DRE incompleto.
- **RN9** DRE parcial (período aberto) é permitido, com aviso.
- **RN10** O DRE pode ser exportado.
- **RN11** O DRE pode ser visualizado por filial ou consolidado.

**Telas envolvidas:**
- Tela "DRE Gerencial".
- Painel de comparação.
- Tela de drill-down.
- Exportação (Excel/PDF).

---

### G2 — DRE por centro de custo

**Nome:** Visualizar DRE segmentado por centro de custo.
**Objetivo:** Apresentar o resultado (receitas, custos, despesas, resultado) de cada **centro de custo** (área, departamento, unidade de negócio), permitindo ao gestor avaliar o desempenho de cada área separadamente e ao administrador ver o "resumo por área".

**Ator principal:** Administrador / Empresário.
**Atores secundários:** Gestores de área (consulta), Controller (valida).

**Pré-condições:**
- Empresa cadastrada (A1).
- Centros de custo cadastrados (A3).
- Lançamentos no período (aberto ou fechado) `[T5]`.
- Os lançamentos têm centro de custo atribuído (direta ou indiretamente, via rateio).

**Quando é usada:**
- Mensalmente (após o fechamento).
- A qualquer momento (DRE parcial).
- Em reuniões de gestão por área.
- Na simulação (H) — para avaliar o impacto de decisões por área.

**Particularidades:**
- **Mesma estrutura do DRE (G1)**, segmentada por centro de custo.
- **Lançamentos sem centro de custo** aparecem em "Não alocado" ou são **rateados** conforme regra configurada.
- **Rateio de despesas indiretas:** **fase 1** com critério simples (percentual fixo); **fase 2** com critérios avançados (área, nº de funcionários, receita, etc.).
- **Receita por área:** se houver vínculo no lançamento, é alocada; se não, aparece como "Não alocada" ou é rateada.
- **Visão consolidada:** a soma dos DREs por centro de custo + "Não alocado" = DRE total (G1).
- **Agrupamento por área de negócio:** **fase 1** (agrupa centros em grandes blocos — Comercial, Operações, Administrativo).

**Fluxo principal:**
1. Usuário acessa "Relatórios > DRE por Centro de Custo".
2. Sistema solicita o **período** ou intervalo.
3. Sistema exibe a **lista de centros de custo** ativos.
4. Usuário seleciona um ou mais centros (ou "Todos").
5. Sistema consolida os lançamentos do período por centro de custo.
6. Sistema exibe o **DRE segmentado**:
   - Para cada centro: receitas, custos, despesas, resultado.
   - Linha "Não alocado" (se houver).
   - Total consolidado.
7. Usuário pode **clicar** em uma linha para ver os lançamentos (drill-down).
8. Usuário pode **filtrar** por tipo de conta e período.
9. Usuário pode **exportar** (Excel/PDF).

**Fluxos alternativos:**
- **FA1 — Comparação entre centros de custo:** visão lado a lado.
- **FA2 — Comparação temporal por centro de custo:** evolução ao longo dos meses.
- **FA3 — Rateio configurável:** o usuário pode configurar critérios de rateio. **Fase 1 com percentual fixo; fase 2 com critérios avançados.**
- **FA4 — DRE por centro de custo com drill-down.**
- **FA5 — DRE consolidado por área de negócio:** agrupar centros em áreas maiores. **Fase 1.**
- **FA6 — DRE parcial do período aberto:** com aviso.

**Exceções:**
- **EX1 — Nenhum centro de custo cadastrado:** sugere cadastrar (A3).
- **EX2 — Nenhum lançamento no período:** informa.
- **EX3 — Lançamentos sem centro de custo:** aparecem em "Não alocado", com aviso; alocação manual fica para **fase 2**.
- **EX4 — Período sem fechamento:** DRE parcial com aviso.
- **EX5 — Falha na consolidação:** erro e mantém o último DRE válido.

**Pós-condições:**
- DRE por centro de custo exibido.
- Nenhum dado é alterado.

**Regras de negócio:**
- **RN1** Mesma estrutura do DRE total, segmentada.
- **RN2** Lançamentos sem centro de custo aparecem em "Não alocado" (ou são rateados conforme regra).
- **RN3** A soma dos DREs por centro + "Não alocado" = DRE total (G1).
- **RN4** Despesas indiretas podem ser rateadas (fase 1: percentual fixo; fase 2: critérios avançados).
- **RN5** Receita pode ser vinculada a centro de custo ou rateada.
- **RN6** O usuário pode comparar centros e ver evolução temporal.
- **RN7** O DRE por centro pode ser exportado.
- **RN8** DRE parcial (período aberto) é permitido, com aviso.
- **RN9** `[T6]` Lançamentos não classificados geram aviso.
- **RN10** O DRE por centro pode ser agrupado por área de negócio (fase 1).
- **RN11** O DRE por centro pode ser visualizado por filial ou consolidado.

**Telas envolvidas:**
- Tela "DRE por Centro de Custo".
- Painel de comparação.
- Tela de drill-down.
- Tela de configuração de rateio (fase 2).
- Exportação (Excel/PDF).
- Cadastro de centros de custo (A3).

---

### G3 — Resumo por área

**Nome:** Visualizar resumo executivo por área.
**Objetivo:** Apresentar ao administrador uma visão executiva consolidada por **área de negócio** (Comercial, Operações, Administrativo, etc.), agrupando os centros de custo em grandes blocos, com os principais indicadores de cada área e o resultado consolidado da empresa.

**Ator principal:** Administrador / Empresário.
**Atores secundários:** Gestores de área (consulta).

**Pré-condições:**
- Empresa cadastrada (A1).
- Centros de custo cadastrados (A3) e vinculados a áreas de negócio.
- Lançamentos no período `[T5]`.

**Quando é usada:**
- Mensalmente (após o fechamento).
- Em reuniões de diretoria.
- Como **painel inicial** do Administrador (dashboard).
- Na simulação (H).

**Particularidades:**
- **Área de negócio** é um agrupamento de centros de custo.
- **Visão executiva:** o administrador vê o **resumo**; o detalhe fica no drill-down (G2).
- **Indicadores por área:** receita, custos, despesas (fixas + variáveis), resultado, margem, % sobre a receita total, comparação com o período anterior.
- **Visão consolidada:** soma das áreas + "Não alocado" = resultado da empresa.

**Fluxo principal:**
1. Usuário acessa "Relatórios > Resumo por Área" (ou é o **dashboard inicial**).
2. Sistema solicita o **período** ou usa o corrente por padrão.
3. Sistema exibe os **cards por área** (nome, receita, custos, despesas, resultado, margem, variação vs. período anterior).
4. Sistema exibe o **consolidado da empresa**.
5. Usuário pode **clicar** em uma área para ver o detalhe (drill-down para G2).
6. Usuário pode **filtrar** por período e por área.
7. Usuário pode **exportar**.

**Fluxos alternativos:**
- **FA1 — Gráfico comparativo entre áreas:** barras ou pizza. **Fase 1.**
- **FA2 — Evolução temporal por área:** linha ao longo dos meses.
- **FA3 — Comparação com período anterior:** incluída nos cards.
- **FA4 — Drill-down:** clicar em uma área e ver o DRE por centro de custo (G2).
- **FA5 — Visão por indicador:** ordenar as áreas por receita, custo, despesa ou resultado.
- **FA6 — Exportação.**
- **FA7 — Simulação por área:** integra com H.

**Exceções:**
- **EX1 — Nenhuma área cadastrada:** sugere configurar (A3).
- **EX2 — Nenhum lançamento no período:** informa.
- **EX3 — Área sem lançamentos:** aparece **zerada** (com opção de ocultar configurável).
- **EX4 — Período sem fechamento:** resumo parcial com aviso.
- **EX5 — Falha na consolidação:** erro e mantém o último resumo válido.

**Pós-condições:**
- Resumo por área exibido.
- Nenhum dado é alterado.

**Regras de negócio:**
- **RN1** Agrupa centros de custo em áreas de negócio (configurável em A3).
- **RN2** A soma das áreas + "Não alocado" = resultado da empresa.
- **RN3** Cada card mostra receita, custos, despesas, resultado, margem e variação vs. período anterior.
- **RN4** Drill-down para G2.
- **RN5** Filtros por período e por área.
- **RN6** Exportação.
- **RN7** Período sem fechamento gera resumo parcial com aviso.
- **RN8** Áreas sem lançamentos aparecem zeradas (com opção de ocultar configurável).
- **RN9** O resumo por área é o **dashboard inicial** do Administrador (configurável).
- **RN10** A simulação por área (FA7) integra com H.
- **RN11** O resumo pode ser visualizado por filial ou consolidado.

**Telas envolvidas:**
- Tela "Resumo por Área" (cards + consolidado).
- Gráfico comparativo entre áreas.
- Gráfico de evolução temporal.
- Drill-down para G2.
- Exportação (Excel/PDF).
- Cadastro de áreas de negócio (vinculado a A3).

---

### G4 — Fluxo de caixa projetado (visão gerencial)

**Nome:** Visualizar fluxo de caixa projetado (visão gerencial).
**Objetivo:** Apresentar o fluxo de caixa projetado da empresa com filtros, comparações, drill-down e análise de cenários, complementando o F4 (que é a consulta operacional) com uma visão gerencial e analítica, voltada para decisões de médio prazo.

**Ator principal:** Administrador / Empresário.
**Atores secundários:** Controller (valida), Operador (consulta).

**Pré-condições:**
- Empresa cadastrada (A1).
- Lançamentos financeiros e contas a pagar/receber (F1, F2, F3).
- Dados históricos de caixa (F4).

**Diferença em relação ao F4:**
- **F4 (operacional):** consulta diária, saldo atual, projeção de curto prazo (30 dias), alertas.
- **G4 (gerencial):** análise de médio/longo prazo (até 12 meses), comparação com realizado, análise de cenários, drill-down, exportação para diretoria.

**Particularidades:**
- **Horizonte:** até 12 meses (configurável).
- **Granularidade:** **diária, semanal ou mensal — fase 1.**
- **Inclusão de estimativas:** contas com valor/vencimento aproximado (F4, RN11) podem ser incluídas, com ressalva.
- **Comparação com realizado:** para períodos passados, comparar projetado vs. realizado (**fase 1**).
- **Cenários:** otimista, realista, pessimista (**fase 2** — a simulação H cobre).

**Fluxo principal:**
1. Usuário acessa "Relatórios > Fluxo de Caixa Projetado".
2. Sistema solicita **horizonte** (3, 6, 12 meses) e **granularidade** (diária, semanal, mensal).
3. Sistema consolida saldo atual, entradas previstas, saídas previstas, estimativas (se marcadas).
4. Sistema exibe o **fluxo projetado** (tabela + gráfico + saldo final + alertas).
5. Usuário pode **filtrar** por conta, centro de custo, categoria, tipo.
6. Usuário pode **clicar** em um período para ver detalhes.
7. Usuário pode **comparar com o realizado** (períodos passados).
8. Usuário pode **exportar**.

**Fluxos alternativos:**
- **FA1 — Comparação com realizado:** **fase 1.**
- **FA2 — Cenários:** **fase 2** (integra com H).
- **FA3 — Drill-down por categoria.**
- **FA4 — Drill-down por área.**
- **FA5 — Visão por conta bancária.**
- **FA6 — Inclusão de estimativas:** marcar "incluir contas com valor/vencimento aproximado" (F4, RN11), com ressalva.
- **FA7 — Análise de sensibilidade:** **fase 2** (integra com H).

**Exceções:**
- **EX1 — Nenhum dado financeiro:** informa.
- **EX2 — Contas sem vencimento:** aparecem como "sem data" e não entram na projeção (ou entram como estimativa, se o usuário marcar).
- **EX3 — Saldo negativo projetado:** alerta destacado.
- **EX4 — Falha na consolidação:** erro e mantém a última projeção válida.

**Pós-condições:**
- Fluxo projetado exibido.
- Nenhum dado é alterado.

**Regras de negócio:**
- **RN1** Horizonte configurável (até 12 meses) e granularidade diária, semanal ou mensal. **Fase 1.**
- **RN2** Contas sem vencimento não entram na projeção, exceto se marcadas como estimativa (F4, RN11).
- **RN3** Filtros por conta, centro de custo, categoria e tipo.
- **RN4** Comparação com realizado para períodos passados. **Fase 1.**
- **RN5** Cenários (integra com H). **Fase 2.**
- **RN6** Drill-down por categoria, área e conta.
- **RN7** Alertas de saldo negativo e concentração de vencimentos.
- **RN8** Exportação.
- **RN9** Inclusão de estimativas é opcional e sinalizada.
- **RN10** Nenhum dado é alterado.
- **RN11** A visão pode ser por filial ou consolidada.

**Telas envolvidas:**
- Tela "Fluxo de Caixa Projetado" (tabela + gráfico + filtros).
- Painel de comparação com realizado.
- Painel de cenários (fase 2, integra com H).
- Drill-down por categoria/área/conta.
- Exportação (Excel/PDF).

---

### G5 — Análise de custos por fornecedor/categoria

**Nome:** Analisar custos e despesas por fornecedor e categoria.
**Objetivo:** Permitir ao gestor visualizar a composição dos custos e despesas da empresa, agrupados por **fornecedor** e por **categoria**, identificando onde o dinheiro está sendo gasto, tendências e oportunidades de negociação/redução.

**Ator principal:** Administrador / Empresário.
**Atores secundários:** Controller (valida), Operador (consulta).

**Pré-condições:**
- Empresa cadastrada (A1).
- Documentos de compra (C1, C2, C3, C5, C8) e/ou lançamentos de despesa no período `[T5]`.
- Fornecedores cadastrados (B2) com categoria padrão.

**Quando é usada:**
- Mensalmente (análise de gastos).
- Em negociações com fornecedores.
- Em decisões de compra.
- Na simulação (H) — para simular redução de custos.

**Particularidades:**
- **Agrupamento por fornecedor:** quanto foi gasto com cada fornecedor.
- **Agrupamento por categoria:** quanto foi gasto em cada categoria.
- **Agrupamento por centro de custo:** quanto cada área gastou.
- **Comparação temporal:** evolução ao longo dos meses.
- **Análise de concentração:** % do gasto total em cada fornecedor/categoria.
- **Top N:** os maiores fornecedores/categorias (**10 padrão, configurável**).
- **Drill-down:** clicar em um fornecedor e ver os documentos que compõem o gasto.

**Fluxo principal:**
1. Usuário acessa "Relatórios > Análise de Custos".
2. Sistema solicita o **período** ou intervalo.
3. Sistema exibe **duas visões principais**:
   - **Por fornecedor:** fornecedor, valor gasto, % do total, nº de documentos, variação vs. período anterior.
   - **Por categoria:** categoria, valor gasto, % do total, variação vs. período anterior.
4. Usuário pode **alternar** entre as visões ou ver as duas lado a lado.
5. Usuário pode **filtrar** por centro de custo, tipo (custo/despesa/investimento), categoria, fornecedor.
6. Usuário pode **clicar** em um fornecedor/categoria para ver os documentos (drill-down).
7. Usuário pode **exportar**.

**Fluxos alternativos:**
- **FA1 — Top N fornecedores/categorias:** mostrar os 10 maiores, com opção de ver todos.
- **FA2 — Análise de concentração:** gráfico de pizza. **Fase 1.**
- **FA3 — Evolução temporal:** gráfico de linha. **Fase 1.**
- **FA4 — Comparação entre períodos:** dois períodos lado a lado.
- **FA5 — Análise por centro de custo:** quanto cada área gastou com cada fornecedor/categoria.
- **FA6 — Drill-down por documento.**
- **FA7 — Exportação.**

**Exceções:**
- **EX1 — Nenhum documento no período:** informa.
- **EX2 — Fornecedor sem categoria:** aparece como "Sem categoria" (pendência **Aviso** `[T6]`).
- **EX3 — Período sem fechamento:** análise parcial com aviso.
- **EX4 — Falha na consolidação:** erro e mantém a última análise válida.

**Pós-condições:**
- Análise exibida.
- Nenhum dado é alterado.

**Regras de negócio:**
- **RN1** Agrupa custos e despesas por fornecedor e por categoria.
- **RN2** Filtros por centro de custo, tipo, categoria e fornecedor.
- **RN3** Top N (10 padrão, configurável).
- **RN4** Análise de concentração (% do total) — fase 1.
- **RN5** Evolução temporal — fase 1.
- **RN6** Comparação entre períodos.
- **RN7** Drill-down por documento.
- **RN8** `[T6]` Fornecedor sem categoria aparece como "Sem categoria" (Aviso).
- **RN9** Exportação.
- **RN10** Período sem fechamento gera análise parcial com aviso.
- **RN11** A análise pode ser por filial ou consolidada.

**Telas envolvidas:**
- Tela "Análise de Custos" (duas visões).
- Gráfico de pizza (concentração).
- Gráfico de linha (evolução temporal).
- Tela de drill-down (documentos).
- Exportação (Excel/PDF).
- Cadastro de fornecedores (B2).

---

### G6 — Margem por cliente/produto

**Nome:** Analisar margem por cliente e por produto/serviço.
**Objetivo:** Permitir ao gestor visualizar a **rentabilidade** de cada cliente e de cada produto/serviço, identificando quais clientes e produtos mais contribuem para o resultado, quais dão prejuízo e onde focar esforços comerciais ou ajustar preços.

**Ator principal:** Administrador / Empresário.
**Atores secundários:** Controller (valida), Operador (consulta).

**Pré-condições:**
- Empresa cadastrada (A1).
- Documentos de venda (C1, C2, C3, C5) no período `[T5]`.
- Clientes cadastrados (B1).
- Produtos/serviços identificados nos documentos (idealmente com **cadastro de produtos/serviços — fase 1**).
- Custos atribuíveis aos produtos/serviços.

**Quando é usada:**
- Mensalmente (análise de rentabilidade).
- Em decisões de precificação.
- Em decisões de foco comercial.
- Em negociações com clientes.
- Na simulação (H) — para simular mudanças de preço ou mix.

**Particularidades:**
- **Margem por cliente:** receita gerada pelo cliente − custos/despesas atribuíveis.
- **Margem por produto/serviço:** receita do produto − custo do produto.
- **Atribuição de custos:**
  - **Custo direto:** CMV ou custo de serviço, atribuído ao produto/serviço.
  - **Despesas variáveis:** comissões, frete sobre vendas — atribuíveis ao cliente/produto, quando houver vínculo.
  - **Despesas fixas:** **fase 2** (rateio opcional).
- **Margem de contribuição:** receita − custos variáveis (diretos + despesas variáveis).
- **Margem líquida:** receita − todos os custos e despesas (incluindo rateio de fixas, se configurado — **fase 2**).
- **Produtos/serviços:** se o documento tiver apenas valor total (sem itens), a margem por produto não é calculável — apenas por cliente.
- **Método de custo:** o CMV usa o método definido em `empresa.metodo_custo` (XML, Médio ou Manual).

**Fluxo principal:**
1. Usuário acessa "Relatórios > Margem por Cliente/Produto".
2. Sistema solicita o **período** e a **visão** (por cliente ou por produto/serviço).
3. Sistema consolida:
   - **Por cliente:** receita, custos diretos, despesas variáveis, margem de contribuição, margem líquida (se rateio configurado), % sobre o total.
   - **Por produto/serviço:** receita, custo direto, margem de contribuição, % sobre o total.
4. Sistema exibe a **tabela** ordenada por margem (ou por receita, configurável).
5. Usuário pode **filtrar** por período, cliente/produto, centro de custo, tipo.
6. Usuário pode **clicar** em um cliente/produto para ver os documentos (drill-down).
7. Usuário pode **exportar**.

**Fluxos alternativos:**
- **FA1 — Top N clientes/produtos:** os 10 mais e os 10 menos rentáveis.
- **FA2 — Análise de concentração:** pizza mostrando participação na receita e na margem.
- **FA3 — Evolução temporal:** linha ao longo dos meses.
- **FA4 — Comparação entre períodos.**
- **FA5 — Margem por centro de custo:** integra com G2.
- **FA6 — Drill-down por documento.**
- **FA7 — Simulação de preço:** **fase 2** (integra com H).
- **FA8 — Clientes/produtos com prejuízo:** destacar os que têm margem negativa.

**Exceções:**
- **EX1 — Nenhuma venda no período:** informa.
- **EX2 — Documento sem itens:** margem por produto não calculável; margem por cliente sim. Aviso ao usuário.
- **EX3 — Produto/serviço sem custo atribuído:** margem não calculável; produto aparece como "sem custo" (Aviso `[T6]`).
- **EX4 — Período sem fechamento:** análise parcial com aviso.
- **EX5 — Falha na consolidação:** erro e mantém a última análise válida.

**Pós-condições:**
- Análise exibida.
- Nenhum dado é alterado.

**Regras de negócio:**
- **RN1** Calcula margem de contribuição (receita − custos variáveis) e margem líquida (se rateio configurado).
- **RN2** Custos diretos atribuídos ao produto/serviço (CMV ou custo de serviço).
- **RN3** Despesas variáveis atribuídas ao cliente/produto quando houver vínculo.
- **RN4** Despesas fixas podem ser rateadas. **Fase 2.**
- **RN5** Se o documento não tiver itens, margem por produto não é calculada (apenas por cliente).
- **RN6** `[T6]` Produto/serviço sem custo atribuído gera Aviso.
- **RN7** Filtros por período, cliente/produto, centro de custo e tipo.
- **RN8** Top N (mais e menos rentáveis).
- **RN9** Análise de concentração e evolução temporal.
- **RN10** Drill-down por documento.
- **RN11** Simulação de preço (fase 2, integra com H).
- **RN12** Clientes/produtos com margem negativa são destacados.
- **RN13** Exportação.
- **RN14** Período sem fechamento gera análise parcial com aviso.
- **RN15** Cadastro de produtos/serviços é **fase 1**.
- **RN16** O CMV usa o método de custo definido em `empresa.metodo_custo` (XML, Médio ou Manual).
- **RN17** A análise pode ser por filial ou consolidada.

**Telas envolvidas:**
- Tela "Margem por Cliente/Produto".
- Gráfico de pizza (concentração).
- Gráfico de linha (evolução temporal).
- Tela de drill-down (documentos).
- Exportação (Excel/PDF).

---

### G7 — Exportação de relatórios

**Nome:** Exportar relatórios gerenciais.
**Objetivo:** Permitir ao usuário exportar os relatórios gerenciais (G1–G6) para formatos externos (Excel, PDF, CSV), com os filtros aplicados, para compartilhamento, arquivamento ou análise externa.

**Ator principal:** Administrador / Empresário, Controller, Operador (conforme permissão).
**Atores secundários:** Sistema (gera o arquivo, aplica filtros).

**Pré-condições:**
- O usuário está em um dos relatórios (G1 a G6) e aplicou filtros.
- O relatório tem dados para exportar.

**Quando é usada:**
- Ao final de uma análise.
- Para compartilhar com sócios, diretoria, contador, consultores.
- Para arquivamento histórico.
- Para análise externa.

**Particularidades:**
- **Formatos suportados:** Excel (.xlsx), PDF (.pdf), CSV (.csv).
- **Filtros aplicados:** a exportação respeita os filtros ativos.
- **Layout:** mantém a estrutura visual do relatório (cabeçalhos, agrupamentos, totais).
- **Drill-down:** pode incluir o detalhamento ou apenas o resumo (configurável).
- **Agendamento:** **fase 2.**
- **Segurança:** exportação registrada em auditoria (quem, quando, qual relatório, filtros).

**Fluxo principal:**
1. Usuário está em um relatório com filtros aplicados.
2. Usuário clica em "Exportar".
3. Sistema exibe **opções de exportação**:
   - Formato: Excel, PDF, CSV.
   - Incluir drill-down ou apenas resumo.
   - Nome do arquivo (sugestão automática).
4. Usuário escolhe e confirma.
5. Sistema gera o arquivo com os filtros aplicados.
6. Sistema disponibiliza o download.
7. Sistema registra a exportação em auditoria.

**Fluxos alternativos:**
- **FA1 — Exportação em lote:** **fase 2.**
- **FA2 — Agendamento:** **fase 2.**
- **FA3 — Exportação com drill-down:** incluir o detalhamento.
- **FA4 — Exportação para contador:** formato específico. **Fase 2** (a definir).
- **FA5 — Exportação de dados brutos:** exportar os lançamentos (não o relatório formatado) para análise externa.

**Exceções:**
- **EX1 — Nenhum dado para exportar:** informa e não gera o arquivo.
- **EX2 — Falha na geração:** erro e sugere tentar novamente.
- **EX3 — Arquivo muito grande:** avisa e sugere filtros mais restritos ou exportação em partes.
- **EX4 — Usuário sem permissão:** bloqueia.

**Pós-condições:**
- Arquivo gerado e disponibilizado para download.
- Auditoria registrada.

**Regras de negócio:**
- **RN1** A exportação respeita os filtros aplicados.
- **RN2** Formatos: Excel, PDF, CSV.
- **RN3** O usuário pode escolher incluir ou não o drill-down.
- **RN4** Nome do arquivo sugerido automaticamente (relatório + período).
- **RN5** Exportação registrada em auditoria.
- **RN6** Exportação em lote — **fase 2.**
- **RN7** Agendamento — **fase 2.**
- **RN8** Exportação para contador — **fase 2.**
- **RN9** Exportação de dados brutos é permitida.
- **RN10** Usuário sem permissão não pode exportar.

**Telas envolvidas:**
- Botão "Exportar" em cada relatório (G1 a G6).
- Modal de opções de exportação.
- Tela de agendamento (fase 2).
- Tela de auditoria de exportações.

### G8 — Balanço Patrimonial

**Nome:** Visualizar Balanço Patrimonial gerencial.
**Objetivo:** Apresentar a **posição patrimonial** da empresa em uma data (Ativo, Passivo e Patrimônio Líquido), consolidando os saldos das contas patrimoniais do plano de contas.

**Ator principal:** Administrador / Empresário.
**Atores secundários:** Controller (valida), Operador (consulta).

**Pré-condições:**
- Empresa cadastrada (A1).
- Existem lançamentos no período `[T5]`.
- Plano de contas com contas patrimoniais (1 Ativo, 2 Passivo, 2.3 PL) configuradas.

**Fluxo principal:**
1. Usuário acessa "Relatórios > Balanço Patrimonial".
2. Sistema solicita a **data de corte** (padrão: último dia do período fechado mais recente; ou período aberto, com aviso).
3. Sistema consolida os saldos das contas patrimoniais (Ativo, Passivo, PL) a partir dos lançamentos.
4. Sistema exibe o Balanço:
   - **Ativo Circulante** (Caixa, Bancos, Contas a Receber, Estoques, Adiantamentos, Impostos a Recuperar).
   - **Ativo Não Circulante** (Imobilizado, (-) Depreciação Acumulada, Intangível).
   - **Passivo Circulante** (Fornecedores, Contas a Pagar, Salários a Pagar, Encargos a Recolher, Impostos a Recolher, Empréstimos CP).
   - **Passivo Não Circulante** (Empréstimos LP).
   - **Patrimônio Líquido** (Capital Social, Lucros/Prejuízos, Resultado do Exercício).
5. Sistema valida: **Ativo = Passivo + PL** (equação patrimonial).
6. Sistema exibe a **análise vertical** (% de cada conta sobre o Ativo total, e do Passivo+PL sobre o total).
7. Usuário pode **filtrar** por filial (todas ou específica) e **exportar**.

**Fluxos alternativos:**
- **FA1 — Balanço comparativo:** comparar duas datas lado a lado (evolução).
- **FA2 — Balanço consolidado (multi-filial):** soma das filiais.
- **FA3 — Drill-down:** clicar em uma conta e ver os lançamentos que a compõem.
- **FA4 — Balanço do período aberto:** dados parciais, com aviso.

**Exceções:**
- **EX1 — Nenhum lançamento no período:** informa.
- **EX2 — Equação patrimonial não fecha:** sistema **alerta** e mostra a diferença (pode indicar lançamento incompleto ou classificação errada). **Não bloqueia** (é gerencial).
- **EX3 — Plano de contas sem contas patrimoniais:** bloqueia e pede configuração.
- **EX4 — Período sem fechamento:** Balanço parcial com aviso.
- **EX5 — Falha na consolidação:** erro e mantém o último Balanço válido.

**Pós-condições:**
- Balanço exibido.
- Nenhum dado é alterado.

**Regras de negócio:**
- **RN1** O Balanço segue a estrutura do plano de contas (1 Ativo, 2 Passivo, 2.3 PL).
- **RN2** A equação patrimonial (Ativo = Passivo + PL) é validada, mas **não bloqueia** (é gerencial).
- **RN3** Análise vertical é calculada (% sobre o total).
- **RN4** O Balanço pode ser comparativo (duas datas) e por filial ou consolidado.
- **RN5** Drill-down por conta é permitido.
- **RN6** Balanço do período aberto é permitido, com aviso.
- **RN7** `[T6]` Lançamentos não classificados geram aviso (podem distorcer o Balanço).
- **RN8** O Balanço pode ser exportado.

**Telas envolvidas:**
- Tela "Balanço Patrimonial" (estrutura + análise vertical).
- Painel de comparação (FA1).
- Tela de drill-down (FA3).
- Exportação (Excel/PDF).

---

### G9 — Painel Executivo

**Nome:** Visualizar Painel Executivo com indicadores-chave.
**Objetivo:** Dar ao Administrador uma **tela única** com os 12–15 KPIs que resumem a empresa, com **semáforo** (verde/amarelo/vermelho), **comparação** (período anterior, mesmo período do ano anterior) e **drill-down** para o relatório detalhado.

**Ator principal:** Administrador / Empresário.
**Atores secundários:** Sistema (consolida, calcula).

**Pré-condições:**
- Empresa cadastrada (A1).
- Existem lançamentos e contas no período `[T5]`.

**Fluxo principal:**
1. Usuário acessa "Relatórios > Painel Executivo" (ou é o **dashboard inicial** do Administrador, no lugar da Tela Inicial — ver `12_tela_inicial.md` v1.1).
2. Sistema solicita o **período** (padrão: mês corrente).
3. Sistema consolida e exibe os KPIs em **cards**, agrupados em 4 blocos:

   **Bloco 1 — Resultado:** receita líquida, lucro líquido, margem líquida, margem bruta.
   **Bloco 2 — Liquidez:** saldo de caixa, liquidez corrente (AC/PC), capital de giro líquido (AC − PC), ciclo de caixa (dias).
   **Bloco 3 — Endividamento:** endividamento geral (Passivo/Ativo), composição do endividamento (PC/Passivo), grau de alavancagem (Passivo/PL).
   **Bloco 4 — Rentabilidade e Eficiência:** ROE (LL/PL), ROA (LL/Ativo), ponto de equilíbrio (R$), margem de segurança (%).

4. Cada card mostra:
   - **Valor atual**.
   - **Variação vs. período anterior** (Δ e %).
   - **Semáforo** (verde/amarelo/vermelho) com base em faixas configuráveis.
   - **Drill-down** (clique leva ao relatório detalhado — G8, G10, G14, etc.).
5. Sistema exibe **alertas** no topo (ex: "Inadimplência > 10%", "Caixa projetado negativo em 15 dias", "Margem líquida < 5%").
6. Usuário pode **filtrar** por filial e **exportar**.

**Fluxos alternativos:**
- **FA1 — Comparação com período anterior:** lado a lado.
- **FA2 — Comparação com o mesmo período do ano anterior:** lado a lado.
- **FA3 — Ordenar por criticidade:** pior primeiro.
- **FA4 — Ocultar KPIs irrelevantes:** configurável.
- **FA5 — Drill-down por card.**

**Exceções:**
- **EX1 — Nenhum dado:** informa.
- **EX2 — KPI não calculável** (ex: sem PL, ROE não calcula): exibe "N/A" com nota.
- **EX3 — Falha na consolidação:** erro e mantém o último painel válido.

**Pós-condições:**
- Painel exibido.
- Nenhum dado é alterado.

**Regras de negócio:**
- **RN1** O painel é **fixo** na fase 1 (customizável é fase 2).
- **RN2** Cada KPI tem **semáforo** com faixas configuráveis (fase 2; fase 1 tem faixas padrão).
- **RN3** Cada card tem **drill-down** para o relatório detalhado.
- **RN4** Comparação com período anterior e mesmo período do ano anterior.
- **RN5** Alertas no topo (configuráveis — fase 2).
- **RN6** O Painel Executivo é **específico do Administrador** (item 3.11). A Tela Inicial (1.0) continua existindo para **todos** os atores, mas o Administrador vê um **resumo** do Painel (ver `12_tela_inicial.md` v1.1).
- **RN7** Nenhum dado é alterado.
- **RN8** Exportação.

**Telas envolvidas:**
- Tela "Painel Executivo" (cards + semáforo + alertas).
- Tela de drill-down (por card).
- Exportação (Excel/PDF).

---

### G10 — Aging de Contas

**Nome:** Analisar envelhecimento de contas a receber e a pagar.
**Objetivo:** Mostrar o **aging** (envelhecimento) das contas a receber e a pagar, por faixa de atraso/vencimento, identificando inadimplência, concentração e pressão de caixa.

**Ator principal:** Administrador / Empresário.
**Atores secundários:** Financeiro1/2 (consulta), Controller (valida).

**Pré-condições:**
- Empresa cadastrada (A1).
- Existem contas a receber e/ou a pagar no período `[T5]`.

**Fluxo principal:**
1. Usuário acessa "Relatórios > Aging de Contas".
2. Sistema solicita o **período** e a **visão** (a receber, a pagar, ou ambas).
3. Sistema consolida as contas em aberto por faixa:

   **Contas a receber (por faixa de atraso):** a vencer, 1–30, 31–60, 61–90, > 90 dias.
   **Contas a pagar (por faixa de vencimento):** a vencer (próximos 30 dias), vencidas 1–30, 31–60, > 60 dias.

4. Sistema exibe a **tabela** com valores e percentuais.
5. Sistema exibe **indicadores**:
   - Inadimplência % (contas vencidas / total a receber).
   - Prazo médio de recebimento (PMR).
   - Prazo médio de pagamento (PMP).
   - Concentração (top 5 clientes/fornecedores).
6. Usuário pode **filtrar** por cliente/fornecedor e **exportar**.

**Fluxos alternativos:**
- **FA1 — Aging por cliente:** detalhamento por cliente.
- **FA2 — Aging por fornecedor:** detalhamento por fornecedor.
- **FA3 — Drill-down:** clicar em uma faixa e ver as contas que a compõem.
- **FA4 — Comparação entre períodos:** evolução da inadimplência.

**Exceções:**
- **EX1 — Nenhuma conta no período:** informa.
- **EX2 — Contas sem vencimento:** aparecem em "Sem data" (Aviso `[T6]`).
- **EX3 — Falha na consolidação:** erro e mantém a última análise válida.

**Pós-condições:**
- Aging exibido.
- Nenhum dado é alterado.

**Regras de negócio:**
- **RN1** As faixas de aging são configuráveis (fase 2; fase 1 tem padrão).
- **RN2** Contas sem vencimento aparecem em "Sem data" (Aviso `[T6]`).
- **RN3** Inadimplência % = contas vencidas / total a receber.
- **RN4** PMR e PMP são calculados a partir das contas.
- **RN5** Concentração (top N) é mostrada.
- **RN6** Drill-down por faixa.
- **RN7** Comparação entre períodos.
- **RN8** Exportação.

**Telas envolvidas:**
- Tela "Aging de Contas" (tabela + indicadores).
- Tela de drill-down.
- Exportação (Excel/PDF).

---

### G11 — Posição de Impostos

**Nome:** Visualizar posição de impostos (saldo devedor/credor por tipo).
**Objetivo:** Mostrar, por tipo de imposto, o **saldo devedor** (o que a empresa deve) e o **saldo credor** (o que tem a recuperar), com evolução mensal e peso sobre a receita.

**Ator principal:** Administrador / Empresário.
**Atores secundários:** Controller (valida), Contador (consulta).

**Pré-condições:**
- Empresa cadastrada (A1).
- Existem lançamentos de imposto no período `[T5]`.
- O razão de impostos (T7) está alimentado (E1/E2/E3/E5).

**Fluxo principal:**
1. Usuário acessa "Relatórios > Posição de Impostos".
2. Sistema solicita o **período**.
3. Sistema consolida o razão de impostos por tipo (ICMS, PIS, COFINS, ISS, IPI, INSS, FGTS, IRRF, IBS, CBS, etc.): total de débitos, total de créditos, **saldo**.
4. Sistema exibe a **tabela** por tipo de imposto.
5. Sistema exibe **indicadores**:
   - **Carga tributária efetiva** (total de impostos sobre vendas / receita bruta).
   - **Saldo devedor total** (o que a empresa deve).
   - **Saldo credor total** (o que tem a recuperar).
   - **Evolução mensal** (gráfico de linha por tipo).
6. Usuário pode **filtrar** por filial e **exportar**.

**Fluxos alternativos:**
- **FA1 — Evolução mensal:** gráfico por tipo de imposto.
- **FA2 — Detalhamento por documento:** clicar em um tipo e ver as notas que o compõem.
- **FA3 — Comparação entre filiais.**
- **FA4 — Projeção de curto prazo.**

**Exceções:**
- **EX1 — Nenhum lançamento de imposto:** informa.
- **EX2 — Tipo de imposto sem movimentação:** aparece zerado, com aviso.
- **EX3 — Falha na consolidação:** erro e mantém a última posição válida.

**Pós-condições:**
- Posição exibida.
- Nenhum dado é alterado.

**Regras de negócio:**
- **RN1** O saldo é calculado por tipo de imposto (débitos − créditos).
- **RN2** A carga tributária efetiva é calculada sobre a receita bruta.
- **RN3** Evolução mensal por tipo.
- **RN4** Drill-down por documento.
- **RN5** `[T7]` A posição é **gerencial** — não substitui apuração fiscal oficial.
- **RN6** Aviso: "Este relatório é gerencial; não substitui apuração fiscal."
- **RN7** Exportação.

**Telas envolvidas:**
- Tela "Posição de Impostos" (tabela + indicadores + evolução).
- Tela de drill-down.
- Exportação (Excel/PDF).

---

### G12 — Posição de Pessoal

**Nome:** Visualizar posição de pessoal (custo, encargos, provisões).
**Objetivo:** Mostrar o **custo total de pessoal** (bruto + encargos + provisões), o **peso sobre a receita**, as **provisões acumuladas** (passivo oculto) e a **evolução** do headcount e do custo médio.

**Ator principal:** Administrador / Empresário.
**Atores secundários:** RH (consulta), Controller (valida).

**Pré-condições:**
- Empresa cadastrada (A1).
- Existem folhas de pagamento no período `[T5]`.
- Tabelas de INSS, IRRF e encargos vigentes carregadas.

**Fluxo principal:**
1. Usuário acessa "Relatórios > Posição de Pessoal".
2. Sistema solicita o **período**.
3. Sistema consolida:
   - **Custo total de pessoal** (bruto + INSS patronal + FGTS + RAT + Terceiros + provisões).
   - **Peso sobre a receita** (%).
   - **Provisões acumuladas** (férias + 13º + encargos) — o passivo oculto.
   - **Headcount** (funcionários ativos) e **custo médio por funcionário**.
   - **Custo de pessoal por área** (centro de custo / área de negócio).
4. Sistema exibe a **tabela** e os **indicadores**.
5. Sistema exibe a **evolução mensal** (gráfico).
6. Usuário pode **filtrar** por filial, centro de custo, área e **exportar**.

**Fluxos alternativos:**
- **FA1 — Evolução do headcount:** gráfico de linha.
- **FA2 — Custo por área.**
- **FA3 — Provisões detalhadas:** férias vs. 13º vs. encargos.
- **FA4 — Comparação entre filiais.**

**Exceções:**
- **EX1 — Nenhuma folha no período:** informa.
- **EX2 — Funcionário sem centro de custo:** aparece em "Não alocado" (Aviso `[T6]`).
- **EX3 — Falha na consolidação:** erro e mantém a última posição válida.

**Pós-condições:**
- Posição exibida.
- Nenhum dado é alterado.

**Regras de negócio:**
- **RN1** Custo total de pessoal = bruto + encargos patronais + provisões.
- **RN2** Peso sobre a receita = custo total / receita bruta.
- **RN3** Provisões acumuladas = férias + 13º + encargos (passivo oculto).
- **RN4** Headcount = funcionários ativos no período.
- **RN5** Custo médio por funcionário.
- **RN6** Custo por área (centro de custo / área de negócio).
- **RN7** Evolução mensal.
- **RN8** Funcionário sem centro de custo aparece em "Não alocado".
- **RN9** Exportação.

**Telas envolvidas:**
- Tela "Posição de Pessoal" (tabela + indicadores + evolução).
- Painel de evolução.
- Exportação (Excel/PDF).

---

### G13 — Posição de Ativos e Depreciação

**Nome:** Visualizar posição de ativos e depreciação.
**Objetivo:** Mostrar o **valor contábil líquido** dos ativos, a **depreciação acumulada**, a **depreciação do período**, a **vida útil remanescente** e a **projeção de depreciação futura**.

**Ator principal:** Administrador / Empresário.
**Atores secundários:** Controller (valida), Contador (consulta).

**Pré-condições:**
- Empresa cadastrada (A1).
- Existem ativos cadastrados (B4).
- Existe depreciação lançada no período (E4).

**Fluxo principal:**
1. Usuário acessa "Relatórios > Posição de Ativos".
2. Sistema solicita o **período**.
3. Sistema consolida, por ativo: valor original, depreciação acumulada, **valor contábil líquido**, depreciação do período, vida útil remanescente, status (em uso, ocioso, alienado).
4. Sistema exibe a **tabela** por ativo e por centro de custo.
5. Sistema exibe **indicadores**:
   - Total do imobilizado (valor contábil líquido).
   - Depreciação acumulada total.
   - Depreciação do período.
   - **Projeção de depreciação** dos próximos 12 meses.
6. Usuário pode **filtrar** por filial, centro de custo, status e **exportar**.

**Fluxos alternativos:**
- **FA1 — Projeção de depreciação futura:** gráfico dos próximos 12 meses.
- **FA2 — Ativos por status.**
- **FA3 — Comparação entre filiais.**

**Exceções:**
- **EX1 — Nenhum ativo cadastrado:** informa.
- **EX2 — Ativo sem depreciação lançada:** aparece com "—" e Aviso `[T6]`.
- **EX3 — Falha na consolidação:** erro e mantém a última posição válida.

**Pós-condições:**
- Posição exibida.
- Nenhum dado é alterado.

**Regras de negócio:**
- **RN1** Valor contábil líquido = valor original − depreciação acumulada.
- **RN2** A depreciação do período é a lançada em E4.
- **RN3** A vida útil remanescente é calculada a partir da data de corte.
- **RN4** Projeção de depreciação futura (12 meses) é calculada com base na vida útil.
- **RN5** Ativos por status (em uso, ocioso, alienado).
- **RN6** `[T6]` Ativo sem depreciação lançada gera Aviso.
- **RN7** Exportação.

**Telas envolvidas:**
- Tela "Posição de Ativos" (tabela + indicadores + projeção).
- Painel de projeção.
- Exportação (Excel/PDF).

---

### G14 — Ponto de Equilíbrio

**Nome:** Calcular e visualizar ponto de equilíbrio.
**Objetivo:** Mostrar **quanto a empresa precisa faturar para não ter prejuízo** (ponto de equilíbrio contábil), o **ponto de equilíbrio financeiro** (exclui depreciação) e a **margem de segurança** (%).

**Ator principal:** Administrador / Empresário.
**Atores secundários:** Controller (valida).

**Pré-condições:**
- Empresa cadastrada (A1).
- Existem lançamentos no período `[T5]`.
- O plano de contas tem classificação **fixo/variável** (`plano_contas.subtipo`).

**Fluxo principal:**
1. Usuário acessa "Relatórios > Ponto de Equilíbrio".
2. Sistema solicita o **período**.
3. Sistema calcula:
   - **Custos fixos totais** (contas com subtipo Fixo).
   - **Custos variáveis totais** (contas com subtipo Variável).
   - **Margem de contribuição** (receita − custos variáveis) e **%**.
   - **Ponto de equilíbrio contábil** = custos fixos / margem de contribuição %.
   - **Ponto de equilíbrio financeiro** = (custos fixos − depreciação) / margem de contribuição %.
   - **Margem de segurança** = (receita atual − PE) / receita atual.
4. Sistema exibe a **tabela** e um **gráfico** (receita × custos, com o ponto de equilíbrio destacado).
5. Usuário pode **filtrar** por filial e **exportar**.

**Fluxos alternativos:**
- **FA1 — Ponto de equilíbrio por produto/serviço.**
- **FA2 — Simulação de cenário:** "e se o custo fixo aumentar 10%?" (integra com H — fase 2).
- **FA3 — Comparação entre períodos.**

**Exceções:**
- **EX1 — Nenhum lançamento:** informa.
- **EX2 — Margem de contribuição negativa:** sistema alerta (não é possível calcular PE).
- **EX3 — Plano de contas sem classificação fixo/variável:** bloqueia e pede configuração.
- **EX4 — Falha no cálculo:** erro e mantém o último PE válido.

**Pós-condições:**
- PE exibido.
- Nenhum dado é alterado.

**Regras de negócio:**
- **RN1** Custos fixos e variáveis são classificados no plano de contas (`subtipo`).
- **RN2** Margem de contribuição = receita − custos variáveis.
- **RN3** PE contábil = custos fixos / margem de contribuição %.
- **RN4** PE financeiro = (custos fixos − depreciação) / margem de contribuição %.
- **RN5** Margem de segurança = (receita atual − PE) / receita atual.
- **RN6** Margem de contribuição negativa bloqueia o cálculo (com alerta).
- **RN7** Plano de contas sem classificação fixo/variável bloqueia o cálculo.
- **RN8** Exportação.

**Telas envolvidas:**
- Tela "Ponto de Equilíbrio" (tabela + gráfico).
- Exportação (Excel/PDF).

---

### G15 — Resumo Executivo

**Nome:** Visualizar Resumo Executivo (1 página).
**Objetivo:** Apresentar, em **uma página**, o que o administrador precisa saber para entender "como está a empresa": destaques, riscos, oportunidades e ações sugeridas.

**Ator principal:** Administrador / Empresário.
**Atores secundários:** Sistema (consolida, destaca).

**Pré-condições:**
- Empresa cadastrada (A1).
- Existem dados no período `[T5]`.

**Fluxo principal:**
1. Usuário acessa "Relatórios > Resumo Executivo".
2. Sistema solicita o **período**.
3. Sistema consolida e exibe **em uma página**:

   **Destaques do período:** receita, lucro, margem (com variação vs. período anterior); saldo de caixa, liquidez; endividamento; ciclo de caixa.

   **Top 3 riscos:** inadimplência crescendo; custo de pessoal acima de X% da receita; caixa projetado negativo em Y dias (regras configuráveis — fase 2; fase 1 padrão).

   **Top 3 oportunidades:** margem de produto X subindo; fornecedor Y com custo caindo; cliente Z com margem alta (regras configuráveis — fase 2; fase 1 padrão).

   **Ações sugeridas:** renegociar fornecedor X; antecipar recebíveis de Y; reduzir custo de pessoal em Z%.

4. Sistema permite **drill-down** para o relatório detalhado de cada destaque/risco.
5. Usuário pode **exportar** (PDF é o formato natural para 1 página).

**Fluxos alternativos:**
- **FA1 — Enviar por e-mail:** fase 2.
- **FA2 — Agendar envio semanal:** fase 2.
- **FA3 — Customizar destaques/riscos:** fase 2.

**Exceções:**
- **EX1 — Nenhum dado:** informa.
- **EX2 — Regras de risco não configuradas:** usa padrão.
- **EX3 — Falha na consolidação:** erro e mantém o último resumo válido.

**Pós-condições:**
- Resumo exibido.
- Nenhum dado é alterado.

**Regras de negócio:**
- **RN1** O resumo é **1 página** (impressão/PDF).
- **RN2** Destaques, riscos e oportunidades são derivados dos outros relatórios.
- **RN3** Ações sugeridas são **indicações** — não são executadas pelo sistema.
- **RN4** Drill-down para o relatório detalhado.
- **RN5** Regras de risco/oportunidade configuráveis (fase 2; fase 1 padrão).
- **RN6** Exportação em PDF é o formato natural.
- **RN7** O resumo **não substitui** os relatórios detalhados.

**Telas envolvidas:**
- Tela "Resumo Executivo" (1 página).
- Drill-down.
- Exportação (PDF).

---

## MÓDULO H — SIMULAÇÃO (FASE 2)

**Princípio geral:** a simulação é uma **versão 1** sujeita a revisão posterior. A arquitetura deve prever flexibilidade para adicionar variáveis, comparações e visualizações sem quebrar cenários já criados. A simulação trabalha sobre **snapshot isolado** dos dados reais; **nunca altera dados reais**.

---

### H1 — Criar cenário de simulação

**Nome:** Criar cenário de simulação (snapshot dos dados).
**Objetivo:** Permitir ao usuário criar um **cenário de simulação** a partir de um snapshot dos dados reais, que servirá de base para ajustes de variáveis e recálculo, sem alterar os dados reais.

**Ator principal:** Administrador / Empresário.
**Atores secundários:** Controller (pode criar cenários), Sistema (cria snapshot, valida, isola dados).

**Pré-condições:**
- Empresa cadastrada (A1).
- Existem dados reais no período base `[T5]`.
- O usuário tem permissão de simulação (I1).

**Quando é usada:**
- Para testar cenários ("e se...?").
- Para comparar alternativas antes de decidir.
- Para planejamento (orçamento, metas).
- Para avaliar impacto de mudanças (preço, custo, salário, alíquota, regime).

**Particularidades:**
- **Snapshot isolado:** o cenário é uma cópia dos dados reais. Alterações no cenário **não afetam** os dados reais.
- **Base do snapshot:** o usuário escolhe o **período base** (ex: último mês fechado, últimos 3 meses, últimos 12 meses).
- **Escopo do snapshot:** padrão **tudo** (lançamentos, cadastros, parâmetros, regras, plano de contas), com opção de reduzir.
- **Identificação:** nome, descrição, período base, data de criação, autor.
- **Persistência:** o cenário fica salvo para consulta e comparação posterior (H4, H5).
- **Imutabilidade:** após criado, o cenário é imutável; para atualizar, cria-se novo cenário.
- **Isolamento** `[T5]`: não altera dados de períodos fechados, nem é afetado por alterações posteriores nos dados reais.
- **Por filial ou consolidado:** o usuário escolhe se o snapshot é de uma filial específica ou de todas as filiais.

**Fluxo principal:**
1. Usuário acessa "Simulação > Criar Cenário".
2. Sistema solicita:
   - **Nome** (obrigatório).
   - **Descrição** (opcional).
   - **Período base** (mês/ano ou intervalo).
   - **Escopo** (padrão: tudo, com opção de reduzir).
   - **Filial** (uma específica ou consolidada).
3. Usuário confirma.
4. Sistema **cria o snapshot** (copia os dados do período base para uma área isolada; mantém os dados reais intactos; registra data/hora e autor).
5. Sistema **valida**:
   - Há dados suficientes no período base? (Se não, aviso.)
   - O período base está fechado ou em andamento? (Se em andamento, aviso: "Dados podem mudar — o cenário reflete o momento da criação".)
6. Sistema **exibe o cenário criado**:
   - Resumo: período base, escopo, data de criação.
   - Indicadores do cenário (DRE, fluxo de caixa, margem — calculados sobre o snapshot).
   - Botão "Ajustar variáveis" (vai para H2).
7. Usuário pode **ajustar variáveis** (H2) ou **sair** (o cenário fica salvo).

**Fluxos alternativos:**
- **FA1 — Cenário a partir de período fechado:** snapshot usa apenas dados do período fechado (imutável).
- **FA2 — Cenário a partir de período em andamento:** snapshot usa dados parciais, com aviso.
- **FA3 — Cenário com escopo reduzido:** incluir apenas parte dos dados (ex: só folha, só compras).
- **FA4 — Duplicar cenário:** duplicar um cenário existente e ajustar variáveis.
- **FA5 — Cenário multiperíodo:** snapshot pode incluir vários períodos (ex: últimos 12 meses).

**Exceções:**
- **EX1 — Nenhum dado no período base:** informa e não cria o cenário (ou cria vazio, conforme configuração).
- **EX2 — Nome do cenário já existe:** pede confirmação para substituir ou escolher outro nome.
- **EX3 — Falha na criação do snapshot:** erro e não cria o cenário.
- **EX4 — Período base inválido:** bloqueia.
- **EX5 — Usuário sem permissão:** bloqueia.

**Pós-condições:**
- Cenário criado e salvo (snapshot isolado).
- Dados reais intactos.
- Auditoria registrada (quem criou, quando, período base, escopo, filial).
- Cenário disponível para ajuste (H2), comparação (H4) e salvamento (H4).

**Regras de negócio:**
- **RN1** O cenário é um **snapshot isolado**; não afeta nem é afetado por alterações posteriores.
- **RN2** O usuário escolhe o **período base**, o **escopo** e a **filial** (ou consolidado).
- **RN3** O cenário tem nome, descrição, período base, data de criação e autor.
- **RN4** O cenário é **imutável** após criado.
- **RN5** `[T5]` O cenário não altera dados de períodos fechados, nem é afetado por alterações posteriores.
- **RN6** O cenário pode ser duplicado (FA4).
- **RN7** O cenário pode incluir vários períodos (FA5).
- **RN8** Período base em andamento gera aviso.
- **RN9** A criação do cenário é registrada em auditoria.
- **RN10** Apenas usuários com permissão de simulação podem criar cenários.

**Telas envolvidas:**
- Tela "Criar Cenário".
- Tela "Cenário Criado" (resumo + indicadores + botão "Ajustar variáveis").
- Tela "Lista de Cenários".
- Tela de duplicação de cenário (FA4).

---

### H2 — Ajustar variáveis do cenário

**Nome:** Ajustar variáveis do cenário de simulação.
**Objetivo:** Permitir ao usuário modificar variáveis do cenário (preços, custos, salários, alíquotas, regime fiscal, ativos, volumes, prazos) e **recalcular** os resultados, vendo o impacto no DRE, no fluxo de caixa, na margem e nos indicadores, sem alterar os dados reais.

**Ator principal:** Administrador / Empresário.
**Atores secundários:** Controller (pode ajustar), Sistema (recalcula, isola dados).

**Pré-condições:**
- Existe um cenário criado (H1).
- O usuário está na tela do cenário (H1, passo 6).
- O usuário tem permissão de simulação (I1).

**Quando é usada:**
- Para testar cenários ("e se eu aumentar o preço em 10%?").
- Para avaliar impacto de mudanças (custo, salário, alíquota, regime).
- Para planejamento e orçamento.

**Particularidades:**
- **Variáveis agrupadas por categoria:** receita, custos, pessoal, impostos, ativos, financeiro, outros.
- **Ajuste por percentual ou valor absoluto:** aumentar/diminuir em % ou definir valor.
- **Ajuste por item específico** (fase 1): um produto, fornecedor, funcionário, ativo.
- **Ajuste global:** aplicar o mesmo ajuste a todos os itens de uma categoria.
- **Recálculo:** **sob demanda na fase 1** (botão "Recalcular"); **tempo real na fase 2**, se a performance permitir.
- **Comparação imediata:** o resultado do cenário ajustado é exibido **lado a lado** com o cenário base (snapshot original).
- **Isolamento** `[T5]`: os ajustes afetam apenas o cenário; os dados reais permanecem intactos.

**Fluxo principal:**
1. Usuário está na tela do cenário (H1, passo 6) e clica em "Ajustar variáveis".
2. Sistema exibe as **variáveis disponíveis**, agrupadas por categoria:
   - **Receita:** variação de preço (%), variação de volume (%), ajuste por produto/cliente.
   - **Custos:** variação de custo de compra (%), ajuste por fornecedor/produto.
   - **Pessoal:** variação salarial (%), contratação/demissão, ajuste por funcionário.
   - **Impostos:** alteração de alíquota (%), mudança de regime fiscal, ajuste por tipo de imposto.
   - **Ativos:** inclusão/exclusão de ativo, alteração de vida útil, alteração de método.
   - **Financeiro:** alteração de taxa de juros, prazo de pagamento/recebimento.
   - **Outros:** ajustes específicos.
3. Usuário ajusta uma ou mais variáveis (percentual ou valor absoluto; global ou por item).
4. Usuário clica em **"Recalcular"** (ou o sistema recalcula automaticamente, conforme configuração — fase 1: sob demanda).
5. Sistema **recalcula** o cenário.
6. Sistema exibe o **resultado comparativo** (DRE, fluxo de caixa, margem, indicadores-chave).
7. Usuário pode **ajustar mais variáveis**, **salvar o cenário** (H4) ou **sair** (o cenário fica salvo com os ajustes).

**Fluxos alternativos:**
- **FA1 — Ajuste por item específico:** um produto, fornecedor, funcionário ou ativo específico. **Fase 1.**
- **FA2 — Ajuste em lote:** selecionar vários itens e aplicar o mesmo ajuste.
- **FA3 — Múltiplos cenários simultâneos:** **fase 2** (a comparação é H5).
- **FA4 — Reset de variável:** reverter uma variável ao valor original do snapshot.
- **FA5 — Reset total:** reverter todas as variáveis ao snapshot original.
- **FA6 — Salvar como novo cenário:** sem alterar o original.
- **FA7 — Simulação de regime fiscal:** simular a mudança de regime (Simples → Presumido, etc.).
- **FA8 — Simulação de cenário com estimativas:** incluir contas com valor/vencimento aproximado (F4, RN11).

**Exceções:**
- **EX1 — Variável inválida:** bloqueia.
- **EX2 — Recálculo muito pesado:** indicador de progresso.
- **EX3 — Falha no recálculo:** erro e mantém o último resultado válido.
- **EX4 — Usuário sem permissão:** bloqueia.
- **EX5 — Cenário com dados insuficientes:** avisa que alguns indicadores podem não ser calculáveis.

**Pós-condições:**
- Cenário ajustado (variáveis modificadas).
- Resultado comparativo exibido.
- Nenhum dado real é alterado `[T5]`.
- Auditoria registrada (quem ajustou, quando, quais variáveis).

**Regras de negócio:**
- **RN1** Ajuste por percentual ou valor absoluto, global ou por item.
- **RN2** Recálculo **sob demanda na fase 1**; tempo real na fase 2.
- **RN3** Resultado exibido em **comparação** com o cenário base.
- **RN4** `[T5]` Os ajustes afetam apenas o cenário; os dados reais permanecem intactos.
- **RN5** Reset de variável ou total.
- **RN6** Salvar como novo cenário.
- **RN7** Simulação de mudança de regime fiscal.
- **RN8** Inclusão de estimativas (F4, RN11) no fluxo de caixa do cenário.
- **RN9** Ajustes inválidos são bloqueados.
- **RN10** Apenas usuários com permissão de simulação podem ajustar variáveis.
- **RN11** Os ajustes são registrados em auditoria.

**Telas envolvidas:**
- Tela "Ajustar Variáveis".
- Painel de resultado comparativo.
- Tela "Salvar como novo cenário" (FA6).
- Tela de reset (FA4, FA5).
- Tela de simulação de regime fiscal (FA7).
- Lista de cenários (H1).

---

### H3 — Recalcular e comparar

**Nome:** Recalcular o cenário e comparar com a base.
**Objetivo:** Recalcular o cenário após ajuste de variáveis (H2) e exibir o **resultado comparativo** (cenário ajustado vs. cenário base), destacando as diferenças nos principais indicadores e identificando **quais variáveis mais impactaram** o resultado.

**Ator principal:** Administrador / Empresário.
**Atores secundários:** Sistema (recalcula, compara, destaca).

**Pré-condições:**
- Existe um cenário com variáveis ajustadas (H2).
- O usuário solicitou recálculo.

**Quando é usada:**
- Após ajustar variáveis (H2).
- Ao comparar cenários (H5).
- Ao tomar decisão sobre qual cenário seguir.

**Particularidades:**
- **Comparação lado a lado:** cenário ajustado vs. cenário base, com variação (absoluta e percentual).
- **Destaque de diferenças:** linhas do DRE que mais variaram são destacadas visualmente.
- **Atribuição de impacto (ranking):** o sistema identifica **quais variáveis mais contribuíram** para a diferença no resultado. **Fase 1.**
- **Indicadores-chave:** lucro líquido, margem bruta, margem líquida, ponto de equilíbrio, fluxo de caixa final.
- **Visual:** gráficos comparativos (barras, linha) e tabelas.

**Fluxo principal:**
1. Usuário ajusta variáveis (H2) e clica em "Recalcular".
2. Sistema **recalcula** o cenário (reprocessa lançamentos, impostos, folha, depreciação, provisões; recalcula DRE, fluxo de caixa e indicadores).
3. Sistema **compara** o cenário ajustado com o cenário base (linha a linha do DRE; indicadores; fluxo de caixa).
4. Sistema **destaca** as maiores diferenças.
5. Sistema **atribui impacto** às variáveis (ranking). **Fase 1.**
6. Sistema exibe o **resultado comparativo** (tabela + gráficos + ranking).
7. Usuário pode: ajustar mais variáveis (H2), salvar o cenário (H4), comparar com outro cenário (H5), exportar o comparativo.

**Fluxos alternativos:**
- **FA1 — Comparação com múltiplos cenários:** **fase 2** (integra com H5).
- **FA2 — Análise de sensibilidade detalhada:** para uma variável específica, mostrar o impacto de diferentes valores. **Fase 2.**
- **FA3 — Drill-down por linha do DRE:** clicar em uma linha e ver os lançamentos (no cenário ajustado). **Fase 1.**
- **FA4 — Exportação do comparativo.**
- **FA5 — Visualização gráfica:** barras (base vs. ajustado) e linha (evolução).

**Exceções:**
- **EX1 — Nenhuma variável ajustada:** exibe o cenário base (sem comparação) e informa que não há ajustes.
- **EX2 — Recálculo muito pesado:** indicador de progresso.
- **EX3 — Falha no recálculo:** erro e mantém o último resultado válido.
- **EX4 — Cenário com dados insuficientes:** avisa que alguns indicadores podem não ser calculáveis.

**Pós-condições:**
- Cenário recalculado.
- Resultado comparativo exibido.
- Nenhum dado real é alterado `[T5]`.
- Auditoria registrada (recálculo, variáveis ajustadas).

**Regras de negócio:**
- **RN1** O sistema recalcula o cenário com as variáveis ajustadas.
- **RN2** Resultado exibido em **comparação** com o cenário base (variação absoluta e percentual).
- **RN3** As maiores diferenças são destacadas visualmente.
- **RN4** O sistema identifica **quais variáveis mais impactaram** (ranking). **Fase 1.**
- **RN5** `[T5]` Nenhum dado real é alterado.
- **RN6** O usuário pode ajustar mais variáveis, salvar o cenário, comparar com outro ou exportar.
- **RN7** A comparação com múltiplos cenários (FA1) integra com H5. **Fase 2.**
- **RN8** Análise de sensibilidade detalhada (FA2) é fase 2.
- **RN9** Drill-down por linha do DRE é permitido. **Fase 1.**
- **RN10** O comparativo pode ser exportado.
- **RN11** O recálculo é registrado em auditoria.

**Telas envolvidas:**
- Painel "Resultado Comparativo" (tabela lado a lado + variação).
- Gráficos comparativos (barras, linha).
- Ranking de impacto das variáveis.
- Drill-down por linha do DRE.
- Exportação (Excel/PDF).
- (Futura) Tela de análise de sensibilidade detalhada (FA2).

---

### H4 — Salvar cenário para referência

**Nome:** Salvar cenário de simulação para referência.
**Objetivo:** Permitir ao usuário salvar o cenário ajustado (com as variáveis modificadas e os resultados calculados) com nome, descrição e metadados, mantendo-o disponível para consulta, comparação e reutilização posterior, sem alterar os dados reais.

**Ator principal:** Administrador / Empresário.
**Atores secundários:** Controller (pode salvar), Sistema (persiste, isola, audita).

**Pré-condições:**
- Existe um cenário ajustado (H2, H3).
- O usuário tem permissão de simulação (I1).

**Quando é usada:**
- Ao final de uma simulação, para guardar o resultado.
- Para criar variações (otimista, realista, pessimista).
- Para comparar cenários posteriormente (H5).
- Para documentar decisões.

**Particularidades:**
- **Cenário salvo é imutável:** após salvo, não pode ser alterado (para alterar, duplica e ajusta).
- **Metadados:** nome, descrição, período base, data de criação, autor, variáveis ajustadas, resultados persistidos.
- **Status (rascunho/finalizado/aprovado):** **fase 2** (fase 1 apenas "salvo").
- **Arquivamento:** **fase 2.**
- **Resultados persistidos:** o cenário salvo mantém os resultados calculados no momento do salvamento.
- **Isolamento** `[T5]`: o cenário salvo não afeta nem é afetado pelos dados reais.

**Fluxo principal:**
1. Usuário está no cenário ajustado (H2, H3) e clica em "Salvar cenário".
2. Sistema exibe o **formulário de salvamento**: nome (obrigatório; sugerido automaticamente), descrição (opcional), observações (opcional).
3. Usuário confirma.
4. Sistema **valida** (nome não vazio; nome não duplicado ou pede confirmação para substituir).
5. Sistema **persiste o cenário** (variáveis, resultados, metadados).
6. Sistema **exibe confirmação** e o cenário na **lista de cenários** (H1).
7. Usuário pode: comparar com outro cenário (H5), exportar (FA3), duplicar (FA2), voltar.

**Fluxos alternativos:**
- **FA1 — Salvar como novo cenário:** se já tinha um salvo e ajustou mais variáveis, salva como **novo cenário** (mantendo o anterior intacto).
- **FA2 — Duplicar cenário:** duplicar um cenário salvo para criar variação.
- **FA3 — Exportar cenário:** exportar variáveis + resultados para Excel/PDF. **Fase 1.**
- **FA4 — Arquivar cenário:** **fase 2.**
- **FA5 — Comparar com cenário salvo:** após salvar, comparar com outro (H5).

**Exceções:**
- **EX1 — Nome vazio:** bloqueia.
- **EX2 — Nome duplicado:** pede confirmação para substituir ou escolher outro nome.
- **EX3 — Falha na persistência:** erro e mantém o cenário na tela (não perde os ajustes).
- **EX4 — Cenário sem ajustes:** permite salvar (é um snapshot do cenário base), mas avisa que não houve ajustes.
- **EX5 — Usuário sem permissão:** bloqueia.

**Pós-condições:**
- Cenário salvo e disponível na lista (H1).
- Resultados persistidos.
- Nenhum dado real é alterado `[T5]`.
- Auditoria registrada (quem salvou, quando, nome, variáveis ajustadas).

**Regras de negócio:**
- **RN1** O cenário salvo é **imutável**.
- **RN2** O cenário tem nome, descrição, período base, data, autor, variáveis ajustadas e resultados persistidos.
- **RN3** `[T5]` O cenário salvo não afeta nem é afetado pelos dados reais.
- **RN4** Salvar como novo cenário (FA1) ou duplicar (FA2).
- **RN5** Nome duplicado exige confirmação.
- **RN6** O cenário pode ser exportado (FA3, fase 1).
- **RN7** O cenário pode ser arquivado (FA4, fase 2).
- **RN8** Cenário sem ajustes pode ser salvo, com aviso.
- **RN9** O salvamento é registrado em auditoria.
- **RN10** Apenas usuários com permissão de simulação podem salvar cenários.
- **RN11** Status do cenário (rascunho/finalizado/aprovado) — **fase 2**.

**Telas envolvidas:**
- Formulário de salvamento.
- Lista de cenários (H1) — atualizada.
- Tela de confirmação de salvamento.
- Tela de exportação de cenário (FA3).
- Tela de arquivamento (FA4, fase 2).

---

### H5 — Comparar dois cenários salvos

**Nome:** Comparar dois cenários de simulação salvos.
**Objetivo:** Permitir ao usuário selecionar **dois cenários salvos** (H4) e compará-los lado a lado, com destaque para as diferenças nos principais indicadores, nas variáveis ajustadas e nos resultados, apoiando a decisão sobre qual cenário seguir.

**Ator principal:** Administrador / Empresário.
**Atores secundários:** Controller (pode comparar), Sistema (consolida, compara, destaca).

**Pré-condições:**
- Existem **pelo menos dois cenários salvos** (H4).
- O usuário tem permissão de simulação (I1).

**Quando é usada:**
- Ao decidir entre alternativas (otimista vs. pessimista).
- Ao apresentar cenários para diretoria/sócios.
- Ao documentar a decisão.

**Particularidades:**
- **Comparação de dois cenários** (fase 1; múltiplos na fase 2).
- **Resultados persistidos:** a comparação usa os valores do momento do salvamento (não recalcula).
- **Variáveis ajustadas:** a comparação mostra quais variáveis foram ajustadas em cada cenário.
- **Diferenças destacadas:** linhas do DRE e indicadores que mais diferem são destacados visualmente.
- **Análise de sensibilidade comparativa:** o sistema lista **quais variáveis** explicam a maior parte da diferença entre os cenários. **Fase 1.**
- **Visual:** tabela lado a lado, gráficos comparativos.

**Fluxo principal:**
1. Usuário acessa "Simulação > Comparar Cenários".
2. Sistema exibe a **lista de cenários salvos** (H1).
3. Usuário seleciona **dois cenários** para comparar.
4. Sistema exibe a **comparação lado a lado**:
   - **Metadados:** nome, descrição, período base, data de criação, autor.
   - **Variáveis ajustadas:** lista das variáveis de cada cenário.
   - **DRE comparativo:** linha a linha, valor A, valor B, diferença (absoluta e percentual).
   - **Fluxo de caixa comparativo:** saldo final, evolução.
   - **Indicadores-chave:** lucro líquido, margem bruta, margem líquida, ponto de equilíbrio — lado a lado, com diferença.
5. Sistema **destaca** as maiores diferenças.
6. Usuário pode: exportar (Excel/PDF), voltar, duplicar um dos cenários (H4, FA2).
7. Sistema registra a comparação em auditoria.

**Fluxos alternativos:**
- **FA1 — Comparação com o cenário base:** comparar um cenário salvo com o snapshot base.
- **FA2 — Comparação de três ou mais cenários:** **fase 2.**
- **FA3 — Drill-down por linha do DRE:** ver os lançamentos que compõem cada linha em cada cenário.
- **FA4 — Exportação da comparação.**
- **FA5 — Visualização gráfica:** barras (A vs. B) e linha (evolução).
- **FA6 — Análise de diferenças:** o sistema lista **quais variáveis** explicam a maior parte da diferença entre os cenários. **Fase 1.**

**Exceções:**
- **EX1 — Menos de dois cenários salvos:** informa que é necessário pelo menos dois.
- **EX2 — Cenários com períodos base diferentes:** avisa que a comparação pode não ser direta.
- **EX3 — Cenários com escopos diferentes:** avisa que a comparação pode não ser direta.
- **EX4 — Falha na comparação:** erro e mantém a última comparação válida.
- **EX5 — Usuário sem permissão:** bloqueia.

**Pós-condições:**
- Comparação exibida.
- Nenhum dado é alterado.
- Auditoria registrada.

**Regras de negócio:**
- **RN1** A comparação usa os **resultados persistidos** de cada cenário (não recalcula).
- **RN2** Exibe metadados, variáveis ajustadas, DRE, fluxo de caixa e indicadores.
- **RN3** As maiores diferenças são destacadas.
- **RN4** O sistema identifica quais variáveis explicam a maior parte da diferença (análise de sensibilidade comparativa). **Fase 1.**
- **RN5** Cenários com períodos base ou escopos diferentes geram aviso.
- **RN6** Exportação.
- **RN7** Drill-down por linha do DRE.
- **RN8** A comparação é registrada em auditoria.
- **RN9** Apenas usuários com permissão de simulação podem comparar cenários.
- **RN10** Comparação de três ou mais cenários é **fase 2**.

**Telas envolvidas:**
- Tela "Comparar Cenários".
- Painel de comparação lado a lado.
- Gráficos comparativos.
- Drill-down por linha do DRE.
- Exportação (Excel/PDF).

---

## MÓDULO I — ADMINISTRAÇÃO

> **Nota (v2.6):** o módulo Importações (12.6) tem casos de uso no **Módulo C** (C9, C10) e no **Módulo I** (I6). O motor B (documento) reaproveita C1–C8; o motor A (cadastro) e o motor C (legado) são C9/C10.

### I1 — Usuários e permissões

**Nome:** Gerenciar usuários e permissões.
**Objetivo:** Permitir ao Controller (ou Administrador, se acumular papéis) cadastrar usuários, definir perfis e permissões, e restringir o acesso por filial.

**Ator principal:** Controller (ou Administrador).
**Atores secundários:** Sistema (valida, autentica, audita).

**Pré-condições:**
- Empresa cadastrada (A1).
- O usuário tem permissão de administração.

**Fluxo principal:**
1. Controller acessa "Administração > Usuários".
2. Sistema exibe a lista de usuários ativos.
3. Controller cadastra novo usuário: nome, email, senha inicial, **perfil global** (Administrador, Operador, Controller).
4. Controller pode atribuir **perfis por filial** (na tabela `usuario_filial`), se o sistema for multi-filial.
5. Sistema valida (email único, senha forte, perfil válido).
6. Sistema cria o usuário.
7. Sistema registra em auditoria.

**Fluxos alternativos:**
- **FA1 — Editar usuário:** Controller pode alterar nome, email, perfil global, perfis por filial.
- **FA2 — Desativar usuário:** soft delete; o usuário não pode mais acessar, mas o histórico é preservado.
- **FA3 — Resetar senha:** Controller pode gerar nova senha temporária.

**Exceções:**
- **EX1 — Email duplicado:** bloqueia.
- **EX2 — Senha fraca:** bloqueia.
- **EX3 — Perfil inválido:** bloqueia.
- **EX4 — Usuário sem permissão de administração:** bloqueia.

**Pós-condições:**
- Usuário criado/editado/desativado.
- Auditoria registrada.

**Regras de negócio:**
- **RN1** Perfis mínimos: Administrador, Operador, Controller.
- **RN2** O perfil global pode ser sobrescrito por perfil por filial (na tabela `usuario_filial`).
- **RN3** Se não houver registro em `usuario_filial`, vale o perfil global.
- **RN4** **Administrador:** acesso global (todas as filiais).
- **RN5** **Operador/Controller:** acesso conforme `usuario_filial`.
- **RN6** Email é único no sistema.
- **RN7** Senha é armazenada como hash (nunca em texto puro).
- **RN8** Desativação não apaga o usuário; apenas impede o acesso.
- **RN9** Toda alteração é registrada em auditoria.

**Telas envolvidas:**
- Tela "Usuários" (lista + filtros).
- Formulário de criação/edição de usuário.
- Tela de permissões por filial.
- Tela de auditoria de usuários.

---

### I2 — Atualização de parâmetros

**Nome:** Atualizar parâmetros fiscais e trabalhistas.
**Objetivo:** Permitir ao Controller atualizar as tabelas de parâmetros (INSS, IRRF, encargos, alíquotas de tributos) com vigência por período, garantindo que os cálculos usem as regras corretas em cada período.

**Ator principal:** Controller.
**Atores secundários:** Sistema (valida, aplica, audita).

**Pré-condições:**
- Empresa cadastrada (A1).
- O usuário tem permissão de administração.

**Fluxo principal:**
1. Controller acessa "Administração > Parâmetros".
2. Sistema exibe as tabelas disponíveis: INSS, IRRF, encargos, alíquotas de tributos.
3. Controller seleciona a tabela e o período de vigência.
4. Controller edita os valores (faixas, alíquotas, deduções) ou importa de arquivo.
5. Sistema valida (faixas contínuas, alíquotas dentro do intervalo, vigência sem sobreposição).
6. Sistema salva a nova versão da tabela.
7. Sistema registra em auditoria.

**Fluxos alternativos:**
- **FA1 — Importação de parâmetros:** Controller importa tabela de arquivo (formato a definir).
- **FA2 — Exportação de parâmetros:** Controller exporta tabela atual para backup.
- **FA3 — Consulta histórica:** Controller vê as versões anteriores da tabela.

**Exceções:**
- **EX1 — Faixas descontínuas:** bloqueia.
- **EX2 — Alíquota fora do intervalo:** bloqueia.
- **EX3 — Vigência sobreposta:** bloqueia.
- **EX4 — Usuário sem permissão:** bloqueia.

**Pós-condições:**
- Tabela atualizada.
- Auditoria registrada.
- Cálculos futuros usam a nova versão.

**Regras de negócio:**
- **RN1** Tabelas trabalhistas são universais e **não adaptáveis** (federais).
- **RN2** Tabelas fiscais são universais, mas **adaptáveis por empresa** (tributos estaduais/municipais, benefícios).
- **RN3** Suporte a vigência por período (data inicial e final de validade).
- **RN4** Faixas contínuas (sem lacunas).
- **RN5** Alíquotas dentro do intervalo válido.
- **RN6** Vigência sem sobreposição.
- **RN7** Toda alteração é registrada em auditoria.
- **RN8** Alteração de parâmetros **não afeta** cálculos já realizados em períodos fechados `[T5]`.

**Telas envolvidas:**
- Tela "Parâmetros Fiscais e Trabalhistas" (lista de tabelas).
- Formulário de edição de tabela.
- Tela de importação/exportação.
- Tela de consulta histórica.
- Tela de auditoria.

---

### I3 — Auditoria

**Nome:** Consultar log de auditoria.
**Objetivo:** Permitir ao Controller consultar o log de todas as ações relevantes do sistema (quem, quando, o quê, justificativa), garantindo rastreabilidade e conformidade.

**Ator principal:** Controller.
**Atores secundários:** Sistema (registra, armazena, exibe).

**Pré-condições:**
- Empresa cadastrada (A1).
- O usuário tem permissão de administração.

**Fluxo principal:**
1. Controller acessa "Administração > Auditoria".
2. Sistema exibe a lista de eventos, com filtros:
   - Por usuário.
   - Por período (data inicial/final).
   - Por tipo de ação (criação, edição, exclusão, fechamento, override, etc.).
   - Por tabela (lançamento, nota_fiscal, regra_classificacao, etc.).
   - Por filial.
3. Controller seleciona um evento e vê os detalhes:
   - Quem fez, quando, o quê, justificativa.
   - Dados anteriores e novos (quando aplicável).
   - IP.
4. Controller pode **exportar** o log (Excel/PDF).

**Fluxos alternativos:**
- **FA1 — Consulta por registro:** Controller informa o ID de um registro e vê todo o histórico de alterações.
- **FA2 — Consulta por justificativa:** Controller filtra eventos que têm justificativa (ex: overrides, fechamentos com aviso).
- **FA3 — Exportação de log:** Controller exporta o log filtrado.

**Exceções:**
- **EX1 — Nenhum evento no período:** informa.
- **EX2 — Usuário sem permissão:** bloqueia.

**Pós-condições:**
- Log exibido.
- Nenhum dado é alterado (consulta apenas).

**Regras de negócio:**
- **RN1** O log registra: usuário, data/hora, ação, tabela, ID do registro, dados anteriores, dados novos, justificativa (quando exigida), IP.
- **RN2** O log é **imutável** (não pode ser editado ou excluído).
- **RN3** Consulta por usuário, período, tipo de ação, tabela e filial.
- **RN4** Exportação permitida.
- **RN5** Apenas usuários com permissão de administração podem consultar o log.
- **RN6** O log de importação (`log_importacao`) é complementar à auditoria geral.

**Telas envolvidas:**
- Tela "Auditoria" (lista + filtros).
- Painel de detalhes do evento.
- Tela de consulta por registro.
- Exportação (Excel/PDF).

---

### I4 — Gerenciar atores e usuários

**Nome:** Gerenciar atores funcionais e usuários (tags por filial).
**Objetivo:** Permitir ao Configurador cadastrar usuários com **tags de ator** (por filial), habilitar as filiais que cada usuário pode acessar, e garantir que o menu seja montado corretamente para cada usuário.

**Ator principal:** Configurador.
**Atores secundários:** Sistema (valida, monta o menu, autentica, audita).

**Pré-condições:**
- Empresa cadastrada (A1).
- Filiais cadastradas (A2/A8).
- O usuário tem permissão de Configurador (tag `configurador`).

**Fluxo principal:**
1. Configurador acessa "Configuração > Usuários e Atores" (2.4).
2. Sistema exibe a lista de usuários ativos (nome, email, tags, filiais habilitadas, status).
3. Configurador cadastra novo usuário:
   - Nome, email, senha inicial.
   - **Tags de ator** (uma ou mais) — por filial.
   - **Filiais habilitadas** (quais filiais o usuário pode acessar).
4. Sistema valida:
   - Email único no sistema.
   - Senha forte (mínimo de caracteres, complexidade).
   - Tags válidas (devem existir em `atores_funcionais`).
   - Filiais válidas.
   - Se o usuário tem a tag `configurador`, não precisa de outras tags (acesso total).
5. Sistema cria o usuário em `usuarios` e as tags em `usuarios_atores` (com `id_filial`).
6. Sistema registra em auditoria.
7. Configurador pode **editar** um usuário (nome, email, tags por filial, filiais habilitadas).
8. Configurador pode **desativar** um usuário (soft delete — não apaga, apenas impede o acesso).
9. Configurador pode **resetar a senha** (gera nova senha temporária).

**Fluxos alternativos:**
- **FA1 — Usuário com múltiplas tags:** o usuário pode ter várias tags (ex: Comprador na filial A + Financeiro1 na filial B). O menu é montado pela união dos blocos das tags da filial selecionada.
- **FA2 — Usuário com `configurador`:** o sistema não exige outras tags (acesso total). Se o Configurador adicionar outras tags, elas são ignoradas (o `configurador` já vê tudo).
- **FA3 — Habilitar filial:** o Configurador habilita as filiais que o usuário pode acessar. O usuário só vê as filiais habilitadas no seletor de filial.
- **FA4 — Trocar de filial:** ao trocar de filial, o menu é re-montado com as tags daquela filial (T8.10).

**Exceções:**
- **EX1 — Email duplicado:** bloqueia.
- **EX2 — Senha fraca:** bloqueia.
- **EX3 — Tag inválida:** bloqueia (a tag deve existir em `atores_funcionais`).
- **EX4 — Filial inválida:** bloqueia.
- **EX5 — Usuário sem permissão de Configurador:** bloqueia.
- **EX6 — Desativar o último Configurador:** bloqueia (o sistema precisa de pelo menos um `configurador` ativo).

**Pós-condições:**
- Usuário criado/editado/desativado.
- Tags e filiais habilitadas registradas.
- Auditoria registrada.

**Regras de negócio:**
- **RN1** O cadastro de usuários é **único**, com **tags** (atores funcionais) — não existe "perfil de acesso" separado (T8.12).
- **RN2** Se o usuário tem a tag `configurador`, **não precisa** de outras tags (acesso total).
- **RN3** Um usuário pode ter **múltiplas tags** (ex: Comprador + Financeiro).
- **RN4** O **ator é por filial** — o usuário pode ter tags diferentes em filiais diferentes (T8.10).
- **RN5** O cadastro de usuário **habilita as filiais** que ele pode acessar.
- **RN6** O menu é montado pelas **tags do usuário para a filial selecionada**.
- **RN7** Email é único no sistema.
- **RN8** Senha é armazenada como hash (nunca em texto puro).
- **RN9** Desativação não apaga o usuário; apenas impede o acesso.
- **RN10** Toda alteração é registrada em auditoria.
- **RN11** O sistema precisa de **pelo menos um Configurador ativo** (não é possível desativar o último).

**Telas envolvidas:**
- Tela "Usuários e Atores" (2.4) — lista + filtros.
- Formulário de criação/edição de usuário (nome, email, tags por filial, filiais habilitadas).
- Tela de reset de senha.
- Tela de auditoria de usuários.

---

### I5 — Ativar/desativar Ordem de Serviço Interna (OSI)

**Nome:** Ativar/desativar a Ordem de Serviço Interna (OSI) por empresa.
**Objetivo:** Permitir ao Configurador ativar ou desativar o fluxo de **Ordens de Serviço Internas** (o antigo "handoff") para a empresa, definindo se os documentos geram ordens para o próximo setor ou se avançam de estado automaticamente.

**Ator principal:** Configurador.
**Atores secundários:** Sistema (valida, aplica, audita).

**Pré-condições:**
- Empresa cadastrada (A1).
- O usuário tem permissão de Configurador (tag `configurador`).

**Fluxo principal:**
1. Configurador acessa "Configuração > Ordem de Serviço Interna" (2.8).
2. Sistema exibe o status atual (ativado/desativado), a última alteração (quem, quando) e o histórico de alterações.
3. Configurador clica em "Ativar" ou "Desativar".
4. Sistema pede **justificativa** (obrigatória, registrada em auditoria).
5. Configurador confirma.
6. Sistema altera o status em `configuracoes_handoff` (por empresa).
7. Sistema registra em auditoria (quem, quando, o que mudou, justificativa).
8. Sistema exibe confirmação e atualiza o histórico.

**Fluxos alternativos:**
- **FA1 — Consultar o histórico:** o Configurador pode ver todas as alterações (quem, quando, ação, justificativa).
- **FA2 — Ver o impacto:** o sistema exibe uma tabela explicando o que muda ao ativar/desativar (fluxo de documentos, caixa de entrada, auditoria, indicação para empresas com múltiplos setores vs. empresas pequenas).

**Exceções:**
- **EX1 — Justificativa não informada:** bloqueia.
- **EX2 — Usuário sem permissão de Configurador:** bloqueia.
- **EX3 — Falha ao salvar:** sistema exibe erro e mantém o status anterior.

**Pós-condições:**
- Status da OSI alterado (ativado/desativado).
- Auditoria registrada (quem, quando, o que mudou, justificativa).
- Histórico atualizado.
- A alteração **não afeta** documentos já processados (vale apenas para novos documentos).

**Regras de negócio:**
- **RN1** A ativação/desativação é **por empresa** (fase 1). **Por filial** é fase 2 (pendência 18).
- **RN2** O fluxo padrão é **fixo** (definido pelo sistema) — não há ajuste do ator de destino (T8.3).
- **RN3** A alteração **não afeta** documentos já processados (vale apenas para novos).
- **RN4** Toda alteração é registrada em auditoria (quem, quando, o que mudou, justificativa) (T8.7).
- **RN5** Apenas o Configurador (tag `configurador`) pode ativar/desativar a OSI.
- **RN6** O status é consultado em `configuracoes_handoff` (`handoff_ativo`).
- **RN7** Quando **ativado**: os documentos geram ordens para o próximo setor; cada ator vê suas tarefas na caixa de entrada.
- **RN8** Quando **desativado**: os documentos avançam de estado automaticamente (sem tarefa para outro ator); a continuidade aparece na mesma tela do usuário que acumula os atores.

**Telas envolvidas:**
- Tela "Ordem de Serviço Interna" (2.8) — status atual + botão ativar/desativar + histórico.
- Modal de confirmação (com justificativa).
- Tela de auditoria de alterações da OSI.

---

### 2.1 Atores (atualização da tabela)

| Ator | Objetivo principal |
| :--- | :--- |
| **Configurador** | Cadastros fundamentais e genéricos; ativa/desativa handoff; consulta auditoria. |
| **Administrador / Empresário** | Ver resultado final (relatórios, simulação, decisão). |
| **Contador** | Configurar área contábil/fiscal; reclassificar notas e impostos; processar lançamentos; validar cálculos. |
| **Comprador** | NF-e de entrada, NFS-e tomada, CT-e tomado, RPA; ordens de contas a pagar, lançamento contábil e custo de produto. |
| **Faturista** | NF-e de saída, NFS-e prestada, CT-e emitido; ordens de contas a receber e lançamento contábil. |
| **Financeiro1** | Contas a pagar, pagamentos, saída de caixa/banco. |
| **Financeiro2** | Contas a receber, recebimentos, entrada de caixa/banco. |
| **Gerente Financeiro** | Validar/processar saída/entrada de caixa/banco. |
| **RH** | Folha de pagamento, simulação de folha. |
| **Auditor** | Consultar auditoria, apontar problemas, validar fechamento. |
| **Sistema** | Classificar, calcular, provisionar, gerar pendências, processar ordens automáticas. |

### 2.2 Ajustes por caso (atores funcionais + handoff)

**A1 (Cadastrar empresa):** ator principal = **Configurador**. Handoff: nenhum.

**A2–A5 (plano de contas, centros, parâmetros, mapeamento):** ator = **Configurador** (base) + **Contador** (ajustes). Handoff: nenhum.

**A6 (abrir/fechar período):** ator = **Contador** (prepara e fecha) + **Auditor** (valida antes do fechamento). Handoff: Contador → Auditor (validação) → Contador (fechamento).

**A8 (cadastrar filial):** ator = **Configurador**. Handoff: nenhum.

**B1 (clientes):** ator = **Faturista** (ou automático). Handoff: nenhum.

**B2 (fornecedores):** ator = **Comprador** (ou automático). Handoff: nenhum.

**B3 (funcionários):** ator = **RH**. Handoff: nenhum.

**B4 (ativos):** ator = **Configurador** (base) + **Contador** (ajustes). Handoff: nenhum.

**C1 (NF-e entrada):** ator = **Comprador**. Handoff:
- NF-e entrada → Contador (valida lançamento contábil).
- NF-e entrada → Financeiro1 (gera conta a pagar — automático).
- NF-e entrada → Sistema (registra custo de produto — automático).

**C2 (NFS-e):** ator = **Comprador** (tomada) ou **Faturista** (prestada). Handoff:
- Tomada → Financeiro1 (conta a pagar — automático) + Contador (lançamento).
- Prestada → Financeiro2 (conta a receber — automático) + Contador (lançamento).

**C3 (CT-e):** ator = **Comprador** (tomado) ou **Faturista** (emitido). Handoff: análogo ao C2.

**C4 (lançamento manual):** ator = **Contador**. Handoff: nenhum (ou revisão D3).

**C5 (documento manual):** ator = **Comprador** (entrada) ou **Faturista** (saída). Handoff: análogo ao C1/C2.

**C6 (importar folha):** ator = **RH**. Handoff: folha consolidada → Financeiro1 (agenda pagamento).

**C7 (digitar folha):** ator = **RH**. Handoff: análogo ao C6.

**C8 (RPA):** ator = **Comprador**. Handoff: RPA → Financeiro1 (conta a pagar — automático) + Contador (lançamento).

**D1–D5 (classificação):** ator = **Sistema** (D1, D2) + **Operador/Comprador/Faturista** (D3) + **Contador** (D5). Handoff: classificação gera lançamento para o Contador validar.

**E1–E2 (impostos):** ator = **Sistema**. Handoff: razão de imposto → Contador (validação no fechamento).

**E3–E5 (folha, depreciação, provisões):** ator = **Sistema** + **Contador** (validação). Handoff: consolidação → Auditor (valida no fechamento).

**F1 (contas a pagar):** ator = **Sistema** (gera) + **Financeiro1** (processa). Handoff: conta a pagar → Financeiro1 (baixa).

**F2 (contas a receber):** ator = **Sistema** (gera) + **Financeiro2** (processa). Handoff: conta a receber → Financeiro2 (baixa).

**F3 (baixa):** ator = **Financeiro1** (pagar) ou **Financeiro2** (receber). Handoff: baixa → **Gerente Financeiro** (valida saída/entrada de caixa/banco).

**F4 (posição de caixa):** ator = **Administrador** (consulta) + **Financeiro1/2** (consulta). Handoff: nenhum.

**G1–G7 (relatórios):** ator = **Administrador** (principal) + **Contador** + **Auditor** (conforme permissões — fase 2). Handoff: nenhum.

**H1–H5 (simulação, fase 2):** ator = **Administrador** (principal). Handoff: nenhum.

**I1 (usuários):** ator = **Configurador**. Handoff: nenhum.

**I2 (parâmetros):** ator = **Configurador** (base) + **Contador** (fiscais) + **RH** (trabalhistas). Handoff: nenhum.

**I3 (auditoria):** ator = **Configurador** + **Auditor**. Handoff: nenhum.

### 2.3 Novos casos de uso

**I4 — Gerenciar atores e usuários** (dentro de I1):
- Cadastrar usuário com tags (atores) por filial.
- Habilitar filiais que o usuário pode acessar.
- Se tem `configurador`, não precisa de outras tags.
- Sem perfil de acesso separado.

**I5 — Ativar/desativar handoff** (dentro de I2 ou separado):
- Configurador ativa/desativa handoff por empresa.
- Auditoria registra a mudança.

**F5 — Caixa de entrada e caixa de saída** (dentro de F4 ou separado):
- Caixa de entrada: tarefas pendentes e em andamento, urgentes destacadas.
- Caixa de saída: o que o ator enviou e ainda está pendente ou em andamento.
- Histórico: consulta separada.

### 2.4 Regras transversais referenciadas

Todos os casos de uso passam a referenciar `[T8]` quando envolverem handoff, caixa de entrada/saída, auditoria ou atores funcionais. As ordens específicas de cada caso de uso estão na seção 2.5 e no `08_ordens.md`.

### 2.5 Referência às ordens por caso de uso

Cada caso de uso gera e/ou recebe ordens (ver `08_ordens.md`). A tabela abaixo mapeia os casos de uso às ordens correspondentes. O mapeamento completo (com número de menu) está na seção 2.6.

| Caso de uso | Ordens emitidas | Ordens recebidas |
| :--- | :--- | :--- |
| A1 (Cadastrar empresa) | — | — |
| A2 (Plano de contas) | — | — |
| A3 (Centros de custo) | — | — |
| A4 (Parâmetros) | O28 | — |
| A5 (Mapeamento referencial) | — | — |
| A6 (Abrir/fechar período) | O22, O23, O24 | O23, O24 |
| A8 (Cadastrar filial) | — | — |
| B1 (Clientes) | — | — |
| B2 (Fornecedores) | — | — |
| B3 (Funcionários) | — | — |
| B4 (Ativos) | — | — |
| C1 (Importar NF-e) | O1 (entrada), O2 (saída) | — |
| C2 (Importar NFS-e) | O3 (tomada), O4 (prestada) | — |
| C3 (Importar CT-e) | O3 (tomado), O4 (emitido) | — |
| C4 (Lançamento manual) | O7 (se fallback) | — |
| C5 (Documento manual) | O5 | — |
| C6/C7 (Folha) | O6 | — |
| C8 (Importar RPA) | O3 | — |
| D1 (Sugestão) | O7, O8 | — |
| D2 (Porquê) | — | — |
| D3 (Revisão) | O7, O27 | O7, O10 |
| D4 (Aprendizado) | — | — |
| D5 (Gestão de regras) | — | O8 |
| E1/E2 (Impostos) | O11, O30 | — |
| E3 (Folha consolidada) | O12, O30 | — |
| E4 (Depreciação) | O13 | O32 |
| E5 (Provisões) | O14, O30 | O32 |
| F1 (Contas a pagar) | O15 | — |
| F2 (Contas a receber) | O16 | — |
| F3 (Baixa) | O17, O18, O19, O20 | — |
| F4 (Posição de caixa) | — | — |
| F5 (Caixa de entrada/saída) | O1–O28 | O1–O28 |
| G1–G7 (Relatórios) | — | — |
| H1–H5 (Simulação) | — | — |
| I1 (Usuários) | — | — |
| I2 (Parâmetros) | O28 | O28 |
| I3 (Auditoria) | O25, O26 | — |
| I4 (Atores) | — | — |
| I5 (Handoff) | — | — |
| T5 (Período) | — | — |
| T6 (Pendências) | O9, O31 | O9 |
| T7 (Razão) | O30 | — |
| T8 (Handoff) | Todas | Todas |

---

### 2.6 Referência ao menu e às ordens por caso de uso

Cada caso de uso tem um **número de menu** (para acesso rápido) e gera/recebe **ordens** (O1–O32). A tabela abaixo mapeia os casos de uso ao número de menu e às ordens.

| Caso de uso | Número de menu | Ordens emitidas | Ordens recebidas |
| :--- | :--- | :--- | :--- |
| A1 (Cadastrar empresa) | 2.1 | — | — |
| A2 (Plano de contas) | 4.2 | — | — |
| A3 (Centros de custo) | 2.3 | — | — |
| A4 (Parâmetros) | 4.4 | O28 | — |
| A5 (Mapeamento referencial) | 4.3 | — | — |
| A6 (Abrir/fechar período) | 4.10, 4.11 | O22, O23, O24 | O23, O24 |
| A7 (Reabrir período) | — | — | — |
| A8 (Cadastrar filial) | 2.2 | — | — |
| B1 (Clientes) | 6.2 | — | — |
| B2 (Fornecedores) | 5.2 | — | — |
| B3 (Funcionários) | 10.4 | — | — |
| B4 (Ativos) | 2.7 | — | — |
| C1 (Importar NF-e) | 5.4, 6.4 | O1 (entrada), O2 (saída) | — |
| C2 (Importar NFS-e) | 5.4, 6.4 | O3 (tomada), O4 (prestada) | — |
| C3 (Importar CT-e) | 5.4, 6.4 | O3 (tomado), O4 (emitido) | — |
| C4 (Lançamento manual) | 4.6 | O7 (se fallback) | — |
| C5 (Documento manual) | 5.3, 6.3 | O5 | — |
| C6 (Importar folha) | 10.6 | O6 | — |
| C7 (Digitar folha) | 10.6 | O6 | — |
| C8 (Importar RPA) | 5.4 | O3 | — |
| **C9** (Importar cadastros em massa) | 12.6 | — | — |
| **C10** (Importar contas legadas) | 12.6 | — | — |
| **I6** (UI do módulo Importações) | 12.6 | — | — |
| D1 (Sugestão) | — | O7, O8 | — |
| D2 (Porquê) | — | — | — |
| D3 (Revisão) | 4.7, 5.5, 6.5 | O7, O27 | O7, O10 |
| D4 (Aprendizado) | — | — | — |
| D5 (Gestão de regras) | 4.5 | — | O8 |
| E1 (Impostos compras) | 4.8 | O11, O30 | — |
| E2 (Impostos vendas) | 4.8 | O11, O30 | — |
| E3 (Folha consolidada) | 10.6 | O12, O30 | — |
| E4 (Depreciação) | 4.8 | O13 | O32 |
| E5 (Provisões) | 4.8 | O14, O30 | O32 |
| F1 (Contas a pagar) | 7.2 | O15 | — |
| F2 (Contas a receber) | 8.2 | O16 | — |
| F3 (Baixa) | 7.2, 8.2 | O17, O18, O19, O20 | — |
| F4 (Posição de caixa) | 3.8 | — | — |
| F5 (Caixa de entrada/saída) | 1.1, 1.2, 1.3 | Todas | Todas |
| F6 (Tela Inicial) | 1.0 | — | — |
| F7 (Conselheiro) | 3.18 | — | — |
| G1 (DRE) | 3.1 | — | — |
| G2 (DRE por centro) | 3.2 | — | — |
| G3 (Resumo por área) | 3.3 | — | — |
| G4 (Fluxo de caixa) | 3.4 | — | — |
| G5 (Análise de custos) | 3.5 | — | — |
| G6 (Margem) | 3.6 | — | — |
| G7 (Exportação) | 3.7 | — | — |
| G8 (Balanço Patrimonial)** | 3.10 | — | — |
| G9 (Painel Executivo)** | 3.11 | — | — |
| G10 (Aging de Contas)** | 3.12 | — | — |
| G11 (Posição de Impostos)** | 3.13 | — | — |
| G12 (Posição de Pessoal)** | 3.14 | — | — |
| G13 (Posição de Ativos)** | 3.15 | — | — |
| G14 (Ponto de Equilíbrio)** | 3.16 | — | — |
| G15 (Resumo Executivo)** | **3.17 | — | — |
| H1–H5 (Simulação) | 3.9 | — | — |
| I1 (Usuários) | 2.4 | — | — |
| I2 (Parâmetros) | 10.1, 10.2, 10.3, 4.4 | O28 | O28 |
| I3 (Auditoria) | 11.1 | O25, O26 | — |
| I4 (Atores) | 2.4 | — | — |
| I5 (Ordem de Serviço Interna) | 2.8 | — | — |
| T5 (Período) | — | — | — |
| T6 (Pendências) | 4.9, 11.5 | O9, O31 | O9 |
| T7 (Razão) | — | O30 | — |
| T8 (Handoff) | 11.4 | Todas | Todas |

## Histórico de versões
| Versão | Data | Mudança |
| :--- | :--- | :--- |
| 2.3 | 2026-10-24 | Versão anterior (referência). |
| 2.4 | 2026-10-25 | **Merge do `13` (v1.1).** Inclusão de G8–G15 (Balanço, Painel Executivo, Aging, Posição de Impostos, Posição de Pessoal, Posição de Ativos, Ponto de Equilíbrio, Resumo Executivo). Atualização da tabela 2.6 (menu × ordens) com os novos números 3.10–3.17. |
| 2.5 | 2026-10-26 | Adição do caso de uso F7 (Conselheiro); inclusão de G8–G15 e F7 na tabela 2.6. |
| 2.6 | 2026-11-06 | Adoção do módulo **Importações (12.6)**: **C9** (importar cadastros em massa), **C10** (importar contas a pagar/receber do legado), **I6** (UI 12.6). Referência ao `16_modulo_importacoes.md`. Tabela 2.6 atualizada (C9/C10/I6 sem ordens). |

