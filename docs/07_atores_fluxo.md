---
documento: atores_fluxo
versao: 1.2
data: 2026-10-28
proposito: Atores funcionais, OSI, caixa de entrada/saída, auditoria e T8 + nota de multi-empresa (tenant)
depende_de: [01_visao_geral, 02_regras_transversais, 04_modelo_de_dados]
---

# Atores e Fluxo de Documentos

> **Princípio norteador do fluxo:** pensar o sistema como se não houvesse computador. Cada ator **assina** a sua ordem e **gera uma nova ordem** para o próximo setor. A ordem carrega: quem assinou, quando, o que fez, para quem vai. A **auditoria** é parte fundamental do fluxo, não uma camada separada.

---

> **Multi-empresa (tenant):** a regra R1–R3 (`01_visao_geral.md`, seção 8; `04_modelo_de_dados.md`, seção "Multi-empresa (tenant)") se aplica a este documento. O ator é vinculado a uma **filial** (`usuario_ator.id_filial`), que pertence a **exatamente uma** empresa (`filial.id_empresa`). O isolamento por empresa é garantido pelo contexto de autenticação + repositório (R2). A tabela `usuario_ator` é do **grupo F** (herda empresa via `filial`) e **não** tem `id_empresa` (R3). A tabela `ator_funcional` é **universal** (grupo U) — catálogo fixo do produto, sem `id_empresa`.

---

## 1. Atores funcionais

### 1.1 Lista consolidada

| Ator | O que faz | Fase 1? |
| :--- | :--- | :--- |
| **`configurador`** | Modo deus. Sem restrição de cadastro. Cadastros fundamentais e genéricos (empresa, filial, usuários, plano de contas base, centros de custo, áreas de negócio, bancos, formas/condições de pagamento, parâmetros genéricos, ativação/desativação de handoff, consulta de auditoria). **Não acumula outras tags** — se tem `configurador`, não precisa das demais. | ✅ |
| **`administrador`** | Vê o resultado final (relatórios, simulação, decisão). Não opera. | ✅ |
| **`contador`** | Configura a área contábil/fiscal (plano de contas, regras de classificação, parâmetros fiscais), reclassifica notas e impostos, processa ordens de lançamento contábil, valida cálculos. Acumula o papel de Controller na fase 1. | ✅ |
| **`comprador`** | Digita/importa NF-e de entrada, NFS-e tomada, CT-e tomado, RPA. Classifica a NF-e de entrada. Cadastra fornecedores e produtos (ou delega ao Configurador). Gera ordem de contas a pagar, ordem de lançamento contábil e ordem de registro de custo de produto. | ✅ |
| **`faturista`** | Digita/importa NF-e de saída, NFS-e prestada, CT-e emitido. Classifica a NF-e de saída. Cadastra clientes (ou delega ao Configurador). Gera ordem de contas a receber e ordem de lançamento contábil. | ✅ |
| **`financeiro1`** | Processa ordens de contas a pagar, processa pagamentos efetuados, gera ordem de saída de caixa/banco, baixa contas a pagar. | ✅ |
| **`financeiro2`** | Processa ordens de contas a receber, processa recebimentos efetuados, gera ordem de entrada de caixa/banco, baixa contas a receber, acompanha inadimplência. | ✅ |
| **`gerente_financeiro`** | Processa ordens de saída/entrada de caixa/banco (geradas pelo Financeiro1/2). Aprova pagamentos/recebimentos acima de limite (configurável pelo Configurador — fase 2). | ✅ |
| **`rh`** | Digita/importa folha de pagamento, simula cálculo de folha. Cadastra funcionários e proventos/descontos. | ✅ |
| **`auditor`** | **Não muda nada.** Aponta problemas e solicita mudanças ao ator competente. Valida a consolidação do fechamento de período. Consulta toda a auditoria. | ✅ |
| **`vendedor`** | **Não usa o sistema.** É uma tag em Pessoa (fase técnica), usada apenas para comissão. | ❌ (tag) |
| **`técnico`** | Apontamento de serviço. | ❌ (fase 2) |
| **`estoquista`** | **Não é ator de fluxo.** É papel de cadastro (responsável pelo cadastro de produtos). | ❌ (papel) |

### 1.2 Cadastro de usuários com tags

- O cadastro de usuários é **único**, com **tags** (atores funcionais).
- Um usuário pode ter **múltiplas tags** (ex: Comprador + Financeiro numa PME).
- **Exceção:** se o usuário tem a tag `configurador`, **não precisa ter outras tags** (o Configurador tem acesso total).
- O **ator é por filial**: o usuário pode ser Comprador na filial A e Financeiro na B (tabela `usuario_ator` com `id_filial`).
- No cadastro de usuários, deve-se **habilitar as filiais** que ele poderá acessar.

### 1.3 Perfil de acesso — **removido**

- **Não existe mais "perfil de acesso" separado.** A tag do ator funcional é o que define o que o usuário pode fazer.
- O `configurador` tem acesso total. Os demais atores têm acesso ao escopo das suas competências.
- Se um usuário tem várias tags, ele acumula os escopos.
- O campo `usuario.perfil` e a tabela `usuario_filial` do modelo de dados **deixam de existir** — ver `04_modelo_de_dados.md`.

### 1.4 Acúmulo de funções

- **Não precisa impedir.** Um usuário pode ter várias tags.
- A segregação de funções fica como **recomendação do Auditor**, não como bloqueio do sistema.
- Numa PME, o **Configurador** pode acumular todos os atores (mas, se tem `configurador`, já tem acesso total).

### 1.5 Nomenclatura

- **`configurador`** substitui "admin" para não confundir com "administrador".
- **`administrador`** é quem vê o resultado final.
- **`contador`** acumula Controller na fase 1 (Controller separado fica para fase 2, se necessário).

---

## 2. Fluxo de documentos entre setores (handoff)

### 2.1 Princípio "papel assinado"

Cada ator:

1. **Assina** a sua ordem (autoria registrada).
2. **Gera uma nova ordem** para o próximo setor (documento encadeado).
3. A ordem carrega: quem assinou, quando, o que fez, para quem vai.

O sistema registra **toda transição de estado** do documento (quem, quando, estado anterior, estado novo). Isso é parte da **auditoria**.

### 2.2 Documentos e handoffs padrão

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

**Observação:** os documentos gerados pelo sistema (conta a pagar, conta a receber, razão de imposto, depreciação, provisão, pendência) têm como **ator de origem** quem gerou a NF (Comprador ou Faturista). O sistema é o **processador**, não o autor.

### 2.3 Handoff fixo

- O **fluxo padrão** é **fixo** (definido pelo sistema).
- O **Configurador** pode **ativar/desativar** o handoff **por empresa** (empresa pequena → desativa; empresa maior → ativa).
- **Não há ajuste do ator de destino** pelo Configurador. Handoff é fixo.
- **[PENDENTE]** A ativação/desativação é por empresa (não por filial). Se a empresa tem filiais, todas seguem a mesma configuração. Handoff por filial fica para fase 2.

### 2.4 Autorização automática

- Algumas ordens são processadas **automaticamente** pelo sistema, sem ator humano.
- Lista fechada de automáticas:
  - Custo de produto (a partir de NF-e de entrada).
  - Geração de contas a pagar (a partir de NF-e entrada, NFS-e tomada, CT-e tomado, RPA).
  - Geração de contas a receber (a partir de NF-e saída, NFS-e prestada, CT-e emitido).
  - Razão de impostos (crédito/débito a partir de NF).
- **Todo o restante exige ação humana.** Não há "automático por padrão". Reavaliar na fase 2.

### 2.5 Handoff em empresa pequena

- Se a empresa **não ativa o handoff**, o documento avança de estado automaticamente (sem tarefa para outro ator).
- A continuidade aparece na **mesma tela** do usuário que acumula os atores.
- Ex: o mesmo funcionário digita a NF-e de saída e já vê a conta a receber gerada para processar.

---

## 3. Caixa de entrada e caixa de saída

### 3.1 Caixa de entrada

- Mostra **tarefas pendentes** e **em andamento** (o ator começou, mas não terminou).
- **Urgentes** destacadas.
- Mostra: documento, ator de origem, o que fazer, data de recebimento.
- Ações: processar, marcar como urgente, consultar histórico.

### 3.2 Caixa de saída

- Mostra **só o que o ator enviou e ainda está pendente** (o outro ator não executou).
- Também mostra o que está **em andamento** (o outro ator começou, mas não terminou).
- **Concluída** sai da caixa de saída e vai para o histórico.
- Mostra: documento, ator de destino, o que foi feito, quando, status (pendente, em andamento).
- **Informação de execução:** o ator vê se a tarefa já foi executada pelo outro.

### 3.3 Histórico

- **Consulta separada**, com filtros (documento, ator, período, status).
- Mostra tudo: enviadas, recebidas, concluídas.
- Acessível pelo ator (vê o que enviou/recebeu) e pelo Auditor (vê tudo).

### 3.4 Status "urgente"

- **Por ordem/tarefa** (não pelo documento).
- O ator marca a ordem como urgente.
- Serve para priorização na caixa de entrada.
- Sem prazo obrigatório.

---

## 4. Fechamento de período e validação do Auditor

### 4.1 Fluxo

1. **Contador** prepara o fechamento (consolida folha, depreciação, provisões, verifica pendências `[T6]`).
2. **Auditor** valida a consolidação (verifica cálculos, pendências críticas, conformidade).
3. Se o Auditor **aprovar**: **Contador** fecha o período.
4. Se o Auditor **reprovar**: Contador corrige e o Auditor revalida.
5. **Só depois do fechamento** o período é congelado `[T5.4]` e o próximo é aberto.
6. **Só depois da validação do Auditor** o período aceita novos lançamentos.

### 4.2 Regra

- **Só o Contador (com perfil Controller) ou o Administrador** fecha.
- **O Auditor valida a consolidação antes** do fechamento. Sem validação, o fechamento não é concluído.

---

## 5. Auditoria e rastreabilidade

### 5.1 O que o Auditor faz

- **Não muda nada.**
- **Aponta problemas** e **solicita mudanças** ao ator competente.
- **Valida a consolidação** do fechamento de período.
- **Consulta toda a auditoria** (não só a do seu setor).
- **Verifica conformidade** (handoff cumprido, segregação de funções).
- **Gera relatórios de auditoria**.
- **Pode solicitar reclassificação** ao Contador (mas não reclassifica diretamente).

### 5.2 O que a auditoria registra

- Quem fez, quando, o quê, em qual documento, qual estado anterior, qual estado novo.
- Justificativa (quando exigida).
- Toda transição de estado do documento (handoff).
- Configuração de handoff (quem ativou/desativou, quando).
- Overrides de cálculo (impostos, classificação).

### 5.3 Poderes do Auditor

- **Consulta:** total.
- **Intervenção:** apenas **solicitar mudança** (não bloqueia diretamente).

---

## 6. Cadastros: quem faz o quê

| Cadastro | Quem cadastra |
| :--- | :--- |
| Empresa | Configurador |
| Filial | Configurador |
| Usuários | Configurador |
| Plano de contas | Configurador (base) + Contador (ajustes) |
| Centros de custo | Configurador (base) + Contador (ajustes) |
| Áreas de negócio | Configurador (base) + Contador (ajustes) |
| Parâmetros fiscais | Configurador (base) + Contador (ajustes) |
| Parâmetros trabalhistas | Configurador (base) + RH (ajustes) |
| Fornecedores | Comprador (ou automático) |
| Clientes | Faturista (ou automático) |
| Produtos | Comprador (ou automático) |
| Serviços | Comprador / Faturista (ou automático) |
| Funcionários | RH |
| Ativos | Configurador (base) + Contador (ajustes) |
| Bancos | Configurador |
| Contas bancárias | Configurador / Financeiro1 / Financeiro2 |
| Formas de pagamento | Configurador |
| Condições de pagamento | Configurador |
| Proventos/descontos | RH |
| Regras de classificação | Contador |
| Ativação/desativação de handoff | Configurador (por empresa) |

**Nota:** o Configurador **não tem restrição** de cadastro. Os demais atores fazem os cadastros da sua área. O sistema **cadastra automaticamente** clientes, fornecedores e produtos vindos de importações (status "Cadastro incompleto").

---

## 7. Regra transversal T8 — Cadeia de documentos e handoff

> **T8.1 — Documento encadeado.** Todo documento pode gerar um **documento encadeado** (saída → entrada). O elo é registrado em `documento_encadeado`.
>
> **T8.2 — Estado do documento.** Todo documento tem `status_fluxo` (além de `status_importacao`). O `status_fluxo` reflete a etapa gerencial (ex: "Aguardando conferência", "Aguardando pagamento", "Pago").
>
> **T8.3 — Handoff fixo.** O fluxo padrão é **fixo** (definido pelo sistema). O Configurador pode **ativar/desativar** o handoff **por empresa**. Não há ajuste do ator de destino.
>
> **T8.4 — Autorização automática.** Apenas ordens definidas como automáticas são processadas pelo sistema (custo de produto, geração de contas a pagar/receber, razão de impostos). **Todo o restante exige ação humana.**
>
> **T8.5 — Caixa de entrada e saída.** Cada ator tem caixa de entrada (tarefas pendentes e em andamento, urgentes destacadas) e caixa de saída (o que enviou e ainda está pendente ou em andamento). Concluída vai para o histórico (consulta separada).
>
> **T8.6 — Status "urgente".** O ator pode marcar uma ordem como urgente (por ordem, não por documento). Sem prazo obrigatório.
>
> **T8.7 — Auditoria do handoff.** Toda transição de estado é registrada em auditoria (quem, quando, documento, estado anterior, estado novo). A ativação/desativação de handoff também é auditada.
>
> **T8.8 — Auditor não muda nada.** O Auditor consulta, aponta problemas e solicita mudanças ao ator competente. Valida a consolidação do fechamento antes de o Contador fechar.
>
> **T8.9 — Acúmulo de funções.** Um usuário pode ter várias tags. Se tem `configurador`, não precisa de outras. A segregação de funções é recomendação do Auditor, não bloqueio.
>
> **T8.10 — Ator por filial.** O ator é por filial. O usuário pode ter atores diferentes em filiais diferentes. O cadastro de usuário habilita as filiais que ele pode acessar.
>
> **T8.11 — Documentos gerados pelo sistema.** Os documentos gerados automaticamente (conta a pagar, conta a receber, razão de imposto, depreciação, provisão, pendência) têm como **ator de origem** quem gerou a NF (Comprador ou Faturista). O sistema é processador, não autor.
>
> **T8.12 — Sem perfil de acesso.** Não existe "perfil de acesso" separado. A tag do ator funcional define o que o usuário pode fazer. O `configurador` tem acesso total.

---

## 8. Modelo de dados (adições)

### 8.1 Novas tabelas

**`ator_funcional` (R)** — domínio:
| Campo | Tipo |
| :--- | :--- |
| id | int |
| codigo | varchar(30) |
| descricao | varchar(100) |
| ativo | boolean |

Pré-carregado: configurador, administrador, contador, comprador, faturista, financeiro1, financeiro2, gerente_financeiro, rh, auditor. (vendedor é tag em Pessoa, não ator.)

**`usuario_ator`** — N:N usuário × ator × filial:
| Campo | Tipo |
| :--- | :--- |
| id | int |
| id_usuario | int |
| id_filial | int |
| id_ator_funcional | int |
| ativo | boolean |

**`configuracao_handoff`** — por empresa:
| Campo | Tipo |
| :--- | :--- |
| id | int |
| id_empresa | int |
| handoff_ativo | boolean |
| dados_extras | json |

**`documento_encadeado`** — cadeia de documentos:
| Campo | Tipo |
| :--- | :--- |
| id | int |
| id_documento_origem | int |
| id_documento_destino | int |
| tipo_relacao | varchar(30) |
| dados_extras | json |

**`tarefa`** — caixa de entrada/saída:
| Campo | Tipo |
| :--- | :--- |
| id | int |
| id_filial | int |
| id_documento | int |
| tipo_documento | varchar(20) |
| id_ator_origem | int |
| id_ator_destino | int |
| status | varchar(20) (pendente, em andamento, concluída, cancelada) |
| urgente | boolean |
| data_criacao | timestamp |
| data_conclusao | timestamp |
| dados_extras | json |

### 8.2 Campos novos em tabelas existentes

- `nota_fiscal.status_fluxo`.
- `conta_pagar.status_fluxo` / `conta_receber.status_fluxo`.

### 8.3 Regras de dados

- Toda transição de estado gera registro em `auditoria` e em `documento_encadeado` (quando aplicável).
- A ativação/desativação de handoff é auditada.
- O ator é por filial (`usuario_ator.id_filial`).
- Se o usuário tem `configurador`, não precisa de outras tags.
- O campo `usuario.perfil` e a tabela `usuario_filial` são **legado** (ver `04_modelo_de_dados.md`).

---

## 9. Fase 1 vs. fase 2

### 9.1 Fase 1

- Atores: `configurador`, `administrador`, `contador`, `comprador`, `faturista`, `financeiro1`, `financeiro2`, `gerente_financeiro`, `rh`, `auditor`.
- Handoff fixo, com ativação/desativação por empresa.
- Autorização automática apenas para: custo de produto, geração de contas a pagar/receber, razão de impostos.
- Caixa de entrada (pendentes + em andamento, urgentes destacadas) e caixa de saída (pendentes + em andamento).
- Status "urgente" por ordem.
- Auditoria de handoff.
- Fechamento com validação do Auditor.
- Ator por filial.
- Sem perfil de acesso separado.
- Documentos gerados pelo sistema têm ator de origem = quem gerou a NF.

### 9.2 Fase 2

- Handoff por filial.
- Prazos e escalonamento no handoff.
- Segregação de funções como bloqueio.
- Visão de gargalos por ator.
- Permissões de relatórios/simulação por ator.
- `técnico` (apontamento de serviço).
- Controller separado (se necessário).
- Limite de aprovação do `gerente_financeiro` configurável.

### Versões

| 1.2 | 2026-10-28 | Adoção da regra empresa = tenant (R1–R3). Nota de multi-empresa: `usuario_ator` é grupo F (herda empresa via `filial`); `ator_funcional` é universal. Nenhuma alteração estrutural. |