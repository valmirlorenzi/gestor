# Plano de implementação — Sistema de Gestão Gerencial

> **Premissa:** a documentação funcional está completa (`00`–`14`), o wireframe valida a experiência (63 telas + Conselheiro), e o modelo de dados físico (DDL) está pronto. Falta **construir o sistema de verdade** (backend + banco + frontend de produção).
>
> **Objetivo deste plano:** sair do wireframe e chegar a um **MVP funcional em produção** (fase 1), com entregas incrementais por onda, critérios de aceite claros e riscos mapeados.

---

## 1. Visão geral

### 1.1. O que vamos construir

O **Sistema de Gestão Gerencial com Simulação** — fase 1 (MVP), cobrindo:

- **Configuração e cadastros** (empresa, filial, plano de contas, centros de custo, usuários, clientes, fornecedores, funcionários, ativos, produtos/serviços).
- **Entrada de dados** (importação de XML de NF-e, NFS-e, CT-e, RPA; digitação manual; folha).
- **Classificação automática** (motor D1 + revisão D3 + aprendizado D4 + gestão D5).
- **Cálculos** (impostos E1/E2, folha E3, depreciação E4, provisões E5).
- **Financeiro** (contas a pagar/receber, baixa, posição de caixa).
- **Relatórios** (DRE, DRE por centro, resumo por área, fluxo de caixa, análise de custos, margem, Balanço, Painel Executivo, Aging, Posição de Impostos, Posição de Pessoal, Posição de Ativos, Ponto de Equilíbrio, Resumo Executivo).
- **Conselheiro** (sugestões de melhoria).
- **Ordens** (caixa de entrada/saída/histórico).
- **Administração** (usuários, parâmetros, auditoria).

**Fora do escopo da fase 1** (vai para fase 2): simulação (H1–H5), indústria, integração bancária (CNAB/OFX), múltiplas empresas, tela de correção de dados, comparação com realizado, metas do Conselheiro, benchmarks, ML, notificações, permissões granulares por relatório, handoff por filial.

### 1.2. Princípios de implementação

1. **Documentação como fonte da verdade** — cada tela, regra e cálculo já está em `03_casos_de_uso.md`, `08_ordens.md`, `10_modelo_dados_fisico.md`, `13_relatorios_administrador.md`, `14_conselheiro.md`.
2. **Wireframe como referência visual** — o `index.html` + `assets/` serve de guia para o frontend de produção.
3. **Banco primeiro** — o DDL (`10_modelo_dados_fisico.md`) é a base. Nada de "ajustar depois".
4. **Entregas incrementais** — cada onda entrega valor ao usuário, mesmo que parcial.
5. **Testes desde o início** — cada caso de uso tem critérios de aceite.
6. **Auditoria desde o início** — toda ação relevante registrada em `auditorias`.

### 1.3. Stack sugerida

| Camada | Tecnologia | Justificativa |
| :--- | :--- | :--- |
| **Banco** | MariaDB 11+ | O DDL foi escrito para MariaDB. |
| **Backend** | PHP 8.3 + Laravel 11 (ou Slim 4) | Maturidade, comunidade, facilidade de deploy em hospedagem compartilhada. |
| **Frontend** | HTML + CSS + JS puro (mesmo padrão do wireframe) | Já validado no wireframe; sem framework pesado. |
| **Autenticação** | Laravel Breeze / sessão + hash | Simples e seguro. |
| **API** | REST (JSON) | Padrão para SPA leve. |
| **Filas** | Redis (ou banco) | Para importação de XML em lote e cálculos pesados. |
| **Deploy** | Docker + Nginx (ou hospedagem compartilhada) | Portabilidade. |
| **Versionamento** | Git + GitHub | Padrão. |
| **CI/CD** | GitHub Actions | Testes + deploy automático. |

> **Alternativa:** se preferir Node.js (Express) ou Python (FastAPI), o plano se adapta. A stack acima é a mais próxima do wireframe (JS puro no front, PHP no back).

---

## 2. Fases de implementação

### 2.1. Fase 0 — Preparação (1–2 semanas)

**Objetivo:** preparar o ambiente, o repositório e o banco.

| # | Entrega | Critério de aceite |
| :--- | :--- | :--- |
| 0.1 | Repositório Git criado (backend + frontend) | Repo no GitHub com `README.md` e `.gitignore`. |
| 0.2 | Stack instalada (PHP, MariaDB, Composer, Node, etc.) | `php -v`, `mariadb --version`, `composer -V` funcionando. |
| 0.3 | Banco criado a partir do DDL (`10_modelo_dados_fisico.md`) | Todas as 63 tabelas criadas, FKs e índices OK. |
| 0.4 | Seed inicial (atores, tipos de documento, UFs) | `SELECT * FROM atores_funcionais;` retorna 10 linhas. |
| 0.5 | Estrutura de pastas do backend (Laravel/Slim) | `composer install` + `php artisan serve` funcionando. |
| 0.6 | Estrutura de pastas do frontend (espelho do wireframe) | `index.html` abre no navegador. |
| 0.7 | CI básico (lint + testes) | GitHub Actions rodando no push. |

**Riscos:**
- **Docker vs. hospedagem compartilhada** — decidir cedo. Se for compartilhada, o deploy é mais simples, mas o ambiente é limitado.
- **MariaDB 11+** — se a hospedagem tiver versão antiga, ajustar o DDL.

---

### 2.2. Fase 1 — Fundação (3–4 semanas)

**Objetivo:** ter o "esqueleto" funcionando (login, empresa, filial, usuários, plano de contas, período).

| # | Entrega | Caso de uso | Critério de aceite |
| :--- | :--- | :--- | :--- |
| 1.1 | Autenticação (login/logout, sessão, hash de senha) | I1 | Usuário loga, vê a Tela Inicial, desloga. |
| 1.2 | Cadastro de usuários com tags de ator por filial | I1, I4 | Admin cria usuário com múltiplas tags; menu é montado pelas tags. |
| 1.3 | Cadastro de empresa (A1) | A1 | Empresa criada, filial matriz e primeiro período criados automaticamente. |
| 1.4 | Cadastro de filial (A8) | A8 | Filial criada, primeiro período aberto. |
| 1.5 | Plano de contas (A2) | A2 | Árvore criada, contas analíticas/sintéticas, mapeamento referencial. |
| 1.6 | Centros de custo e áreas de negócio (A3) | A3 | Centros e áreas criados, vínculo N:N. |
| 1.7 | Período (A6 — abrir/fechar) | A6 | Fechamento com checklist de pendências (T6). |
| 1.8 | Tela Inicial (dashboard por ator) | F6 | Cada ator vê seu dashboard com KPIs e alertas. |
| 1.9 | Menu por ator + numeração (09) | — | Menu montado pelas tags; campo "Ir para" funciona. |
| 1.10 | Auditoria (I3) | I3 | Toda ação relevante registrada em `auditorias`. |

**Riscos:**
- **Plano de contas** — é a base de tudo. Se o mapeamento referencial estiver errado, os relatórios ficam errados.
- **Tela Inicial** — precisa de dados reais para os KPIs. Depende dos cadastros básicos.

---

### 2.3. Fase 2 — Cadastros básicos e entrada de dados (4–6 semanas)

**Objetivo:** permitir que o usuário **alimente o sistema** com dados reais (importação de XML + digitação).

| # | Entrega | Caso de uso | Critério de aceite |
| :--- | :--- | :--- | :--- |
| 2.1 | Cadastro de clientes/fornecedores (B1, B2) | B1, B2 | Pessoa unificada com tags; validação de CPF/CNPJ. |
| 2.2 | Cadastro de funcionários (B3) | B3 | Natureza (custo/despesa), rateio por centro de custo. |
| 2.3 | Cadastro de ativos (B4) | B4 | Mês inicial da depreciação editável. |
| 2.4 | Cadastro de produtos/serviços | B (cadastro) | NCM (produto), LC 116 (serviço). |
| 2.5 | Importação de NF-e em lote (C1) | C1 | Pré-validação, confirmação, relatório; documento + lançamentos + contas. |
| 2.5 | Importação de NFS-e (C2) | C2 | Particularidades (LC 116, retenções). |
| 2.6 | Importação de CT-e (C3) | C3 | Modalidade CIF/FOB; vínculo com NF-e. |
| 2.7 | Importação de RPA (C8) | C8 | Retenções (INSS, IRRF, ISS, PIS/COFINS/CSLL). |
| 2.8 | Digitação de documento manual (C5) | C5 | Formulário específico por tipo. |
| 2.9 | Lançamento manual (C4) | C4 | Partidas dobradas automáticas. |
| 2.10 | Importação de folha (C6) e digitação (C7) | C6, C7 | Cálculo de INSS/IRRF/FGTS/encargos/provisões. |
| 2.11 | Motor de classificação (D1, D2, D3) | D1–D3 | Sugestão com "porquê"; tela de revisão. |
| 2.12 | Aprendizado e criação de regras (D4, D5) | D4, D5 | Regra criada a partir de correção; gestão de regras. |
| 2.13 | Cálculo de impostos (E1, E2) | E1, E2 | Cálculo por regime; override com justificativa. |
| 2.14 | Consolidação de folha (E3) | E3 | Separação custo/despesa; integração ao razão. |
| 2.15 | Depreciação (E4) e provisões (E5) | E4, E5 | Cálculo mensal; integração ao DRE. |
| 2.16 | Geração de contas a pagar/receber (F1, F2) | F1, F2 | Parcelamento; retenções. |

**Riscos:**
- **Parser de XML** — cada tipo de documento tem particularidades. NF-e é o mais complexo; NFS-e varia por município; CT-e tem modalidade; RPA tem retenções.
- **Motor de classificação** — a prioridade 1 a 8 precisa ser implementada com cuidado. Testar com dados reais.
- **Cálculo de impostos** — regime fiscal influencia tudo. Testar com Simples, Presumido e Real.

**Dependências:**
- **Fase 1** precisa estar concluída (plano de contas, período, usuários).
- **Tabelas de parâmetros fiscais e trabalhistas** (INSS, IRRF, encargos) precisam estar carregadas.

---

### 2.4. Fase 3 — Financeiro e relatórios (3–4 semanas)

**Objetivo:** fechar o ciclo operacional (baixa de contas + posição de caixa) e entregar os **relatórios principais**.

| # | Entrega | Caso de uso | Critério de aceite |
| :--- | :--- | :--- | :--- |
| 3.1 | Baixa de contas a pagar/receber (F3) | F3 | Total/parcial; juros/multa/desconto; estorno. |
| 3.2 | Posição de caixa (F4) | F4 | Saldo atual + fluxo projetado. |
| 3.3 | Caixa de entrada/saída/histórico (F5) | F5 | Ordens pendentes/emitidas/concluídas. |
| 3.4 | DRE Gerencial (G1) | G1 | Estrutura completa; drill-down; exportação. |
| 3.5 | DRE por Centro de Custo (G2) | G2 | Segmentado; "não alocado". |
| 3.6 | Resumo por Área (G3) | G3 | Cards por área; consolidado. |
| 3.7 | Fluxo de Caixa Projetado (G4) | G4 | Horizonte 12 meses; comparação com realizado. |
| 3.8 | Análise de Custos (G5) | G5 | Por fornecedor/categoria; top N. |
| 3.9 | Margem por Cliente/Produto (G6) | G6 | Contribuição + líquida (se rateio). |
| 3.10 | Exportação (G7) | G7 | Excel, PDF, CSV. |
| 3.11 | Tabelas basais (7.1, 8.1, 5.1, 6.1) | — | Formas/condições, contas bancárias, bancos. |
| 3.12 | Validação de Cálculos (4.8) | E1–E5 | Override com justificativa. |
| 3.13 | Relatório de Pendências (4.9) | T6 | Erros bloqueiam; Avisos confirmam. |

**Riscos:**
- **DRE** — depende de todos os cálculos (impostos, folha, depreciação, provisões). Se um cálculo estiver errado, o DRE fica errado.
- **Fluxo de caixa** — depende de contas a pagar/receber com vencimento definido.

---

### 2.5. Fase 4 — Fechamento e administração (2–3 semanas)

**Objetivo:** fechar o ciclo mensal (fechamento com validação do Auditor) e a administração (parâmetros, auditoria, OSI).

| # | Entrega | Caso de uso | Critério de aceite |
| :--- | :--- | :--- | :--- |
| 4.1 | Preparar fechamento (4.10) | A6 | Consolidação + checklist de pendências. |
| 4.2 | Validar fechamento (11.8) | A6, T8.8 | Auditor aprova/reprova. |
| 4.3 | Fechar período (4.11) | A6 | Período congelado; próximo aberto. |
| 4.4 | Parâmetros fiscais/trabalhistas (I2) | I2 | Vigência por período. |
| 4.5 | Auditoria (I3) | I3 | Consulta + exportação. |
| 4.6 | Ativar/desativar OSI (I5) | I5 | Por empresa; auditoria. |
| 4.7 | Handoff (T8) | T8 | Transições de estado registradas. |
| 4.8 | Apontar problemas (11.6) / solicitar correções (11.7) | I3, T8.8 | O25, O26. |

**Riscos:**
- **Fechamento** — precisa de todos os cálculos corretos. Testar com dados reais.
- **Validação do Auditor** — o fluxo precisa ser claro (Contador prepara → Auditor valida → Contador fecha).

---

### 2.6. Fase 5 — Relatórios expandidos e Conselheiro (3–4 semanas)

**Objetivo:** entregar os **8 relatórios novos** do `13_relatorios_administrador.md` e o **Conselheiro** do `14_conselheiro.md`.

| # | Entrega | Caso de uso | Critério de aceite |
| :--- | :--- | :--- | :--- |
| 5.1 | Balanço Patrimonial (G8) | G8 | Ativo = Passivo + PL; análise vertical. |
| 5.2 | Painel Executivo (G9) | G9 | 12–15 KPIs com semáforo. |
| 5.3 | Aging de Contas (G10) | G10 | Faixas de atraso; inadimplência. |
| 5.4 | Posição de Impostos (G11) | G11 | Saldo devedor/credor por tipo. |
| 5.5 | Posição de Pessoal (G12) | G12 | Custo total + provisões. |
| 5.6 | Posição de Ativos (G13) | G13 | Valor contábil líquido + projeção. |
| 5.7 | Ponto de Equilíbrio (G14) | G14 | PE contábil e financeiro. |
| 5.8 | Resumo Executivo (G15) | G15 | 1 página com destaques/riscos/ações. |
| 5.9 | Conselheiro (F7) | F7 | 57 heurísticas; tela 3.18 + card no dashboard. |
| 5.10 | Importação de XML em lote real (upload) | C1–C3, C8 | Upload de pasta do sistema operacional. |

**Riscos:**
- **Balanço** — depende de todos os lançamentos estarem corretos.
- **Conselheiro** — as 57 heurísticas precisam ser implementadas com cuidado. Testar com dados reais.

---

### 2.7. Fase 6 — Testes, ajustes e go-live (2–3 semanas)

**Objetivo:** testar tudo, ajustar o que for necessário e colocar em produção.

| # | Entrega | Critério de aceite |
| :--- | :--- | :--- |
| 6.1 | Testes unitários (cálculos, motor, parsers) | Cobertura > 80% nos cálculos. |
| 6.2 | Testes de integração (importação → classificação → cálculos → DRE) | Fluxo completo funciona com dados reais. |
| 6.3 | Testes de aceite (casos de uso A–I) | Cada caso de uso tem um teste que passa. |
| 6.4 | Testes de performance (importação em lote, DRE) | Importação de 1.000 XMLs em < 5 min; DRE em < 2 s. |
| 6.5 | Testes de segurança (SQL injection, XSS, CSRF) | Nenhuma vulnerabilidade crítica. |
| 6.6 | Documentação de deploy | Passo a passo para subir em produção. |
| 6.7 | Treinamento do usuário | Manual + sessão de treinamento. |
| 6.8 | Go-live | Sistema em produção com dados reais. |

**Riscos:**
- **Dados reais** — a importação de XMLs reais pode revelar problemas que os dados mock não revelaram.
- **Usuários** — o treinamento precisa ser claro.

---

## 3. Cronograma estimado

| Fase | Duração | Entregável |
| :--- | :--- | :--- |
| **Fase 0** | 1–2 semanas | Ambiente + banco + repositório. |
| **Fase 1** | 3–4 semanas | Login, empresa, filial, plano de contas, período, Tela Inicial, menu, auditoria. |
| **Fase 2** | 4–6 semanas | Cadastros, importação de XML, digitação, motor de classificação, cálculos, contas a pagar/receber. |
| **Fase 3** | 3–4 semanas | Baixa, posição de caixa, ordens, relatórios G1–G7. |
| **Fase 4** | 2–3 semanas | Fechamento, parâmetros, auditoria, OSI, handoff. |
| **Fase 5** | 3–4 semanas | Relatórios G8–G15, Conselheiro, importação em lote real. |
| **Fase 6** | 2–3 semanas | Testes, ajustes, go-live. |
| **Total** | **18–26 semanas** | **MVP em produção.** |

> **Observação:** o cronograma assume **1 desenvolvedor full-time**. Com 2 desenvolvedores, pode cair para 12–16 semanas. Com 3, 10–12 semanas.

---

## 4. Estrutura de equipe sugerida

| Papel | Responsabilidade | Fase |
| :--- | :--- | :--- |
| **Tech Lead** | Arquitetura, code review, decisões técnicas. | Todas |
| **Backend (PHP/Laravel)** | API, banco, cálculos, parsers, motor de classificação. | 1–6 |
| **Frontend (HTML/CSS/JS)** | Telas, integração com a API, UX. | 1–6 |
| **DBA** | Otimização de queries, índices, backup. | 1, 3, 6 |
| **QA** | Testes, casos de aceite, automação. | 2–6 |
| **Product Owner** | Priorização, validação com o usuário, aceite. | Todas |
| **UX/UI** | Ajustes visuais, acessibilidade. | 1, 5 |
| **DevOps** | CI/CD, deploy, monitoramento. | 0, 6 |

> **Para uma PME:** o Tech Lead pode acumular Backend; o Frontend pode acumular UX; o QA pode acumular testes manuais. **Mínimo viável:** 1 Tech Lead + 1 Full-stack + 1 PO (parcial).

---

## 5. Riscos e mitigações

| Risco | Probabilidade | Impacto | Mitigação |
| :--- | :--- | :--- | :--- |
| **Parser de XML complexo** | Alta | Alto | Começar por NF-e (mais comum); testar com XMLs reais desde o início. |
| **Motor de classificação** | Média | Alto | Implementar D1 com testes unitários; validar com o Contador. |
| **Cálculo de impostos** | Alta | Alto | Testar com Simples, Presumido e Real; validar com o Contador. |
| **DRE errado** | Média | Alto | DRE depende de todos os cálculos. Testar com dados reais antes do go-live. |
| **Performance na importação em lote** | Média | Médio | Usar filas (Redis); processar em background; testar com 1.000+ XMLs. |
| **Segurança** | Média | Alto | Testes de segurança; usar framework maduro (Laravel); hash de senha; CSRF. |
| **Usuários resistentes à mudança** | Média | Médio | Treinamento; manual; suporte nos primeiros meses. |
| **Escopo crescendo** | Alta | Alto | Fase 1 bem definida; fase 2 documentada; dizer "não" ao que não está no escopo. |
| **Dados reais diferentes do mock** | Alta | Médio | Testar com XMLs reais desde a fase 2. |
| **Hospedagem compartilhada limitada** | Média | Médio | Decidir cedo (Docker vs. compartilhada); se compartilhada, ajustar o DDL. |

---

## 6. Critérios de aceite do MVP

O MVP está pronto quando:

1. **Login e permissões** funcionam (usuário vê o menu do seu ator).
2. **Empresa, filial, plano de contas, período** são criados.
3. **Importação de NF-e** em lote funciona (pré-validação, confirmação, relatório).
4. **Motor de classificação** sugere conta com "porquê"; revisão funciona.
5. **Cálculo de impostos** funciona para Simples, Presumido e Real.
6. **Folha** é importada/digitada; encargos e provisões calculados.
7. **Contas a pagar/receber** são geradas; baixa funciona.
8. **DRE** está correto (validado pelo Contador).
9. **Fechamento** funciona (Contador prepara → Auditor valida → Contador fecha).
10. **Relatórios G1–G7** funcionam.
11. **Auditoria** registra tudo.
12. **Tela Inicial** mostra KPIs e alertas.
13. **Menu** funciona (por ator + numeração).
14. **Testes** passam (unitários + integração + aceite).
15. **Deploy** em produção com dados reais.

---

## 7. Próximos passos imediatos

### 7.1. Curto prazo (esta semana)

1. **Decidir a stack** (PHP/Laravel vs. Node/Express vs. Python/FastAPI).
2. **Decidir o ambiente** (Docker vs. hospedagem compartilhada).
3. **Criar o repositório** (backend + frontend).
4. **Rodar o DDL** (`10_modelo_dados_fisico.md`) no MariaDB.
5. **Carregar os seeds** (atores, tipos de documento, UFs).
6. **Configurar o CI** (GitHub Actions: lint + testes).

### 7.2. Médio prazo (próximas 2 semanas)

1. **Implementar a Fase 0** (preparação).
2. **Começar a Fase 1** (autenticação + cadastro de empresa).
3. **Validar com o Product Owner** (tela de login + cadastro de empresa).

### 7.3. Longo prazo (próximos 2 meses)

1. **Fase 1 + Fase 2** concluídas.
2. **Primeiros XMLs reais** importados.
3. **Primeiros relatórios** gerados.
4. **Validação com o Contador** (DRE, impostos, folha).

---

## 8. Perguntas para decidir antes de começar

### 8.1. Stack

- **PHP/Laravel** (recomendado: próximo do wireframe, comunidade grande, deploy simples).
- **Node/Express** (bom para JS puro, mas menos maduro para ERP).
- **Python/FastAPI** (bom para cálculos, mas menos comum em ERP).
- **Outro:** ______.

### 8.2. Ambiente

- **Docker** (recomendado: portabilidade, mas exige mais conhecimento).
- **Hospedagem compartilhada** (mais simples, mas limitada).
- **VPS** (meio-termo: controle + simplicidade).
- **Cloud** (AWS, GCP, Azure: escalável, mas mais caro).

### 8.3. Banco

- **MariaDB** (recomendado: o DDL foi escrito para ele).
- **MySQL** (compatível com MariaDB, mas com diferenças).
- **PostgreSQL** (mais robusto, mas exige ajustar o DDL).
- **Outro:** ______.

### 8.4. Frontend

- **HTML/CSS/JS puro** (recomendado: mesmo padrão do wireframe, sem framework pesado).
- **Vue.js** (reativo, mas exige build).
- **React** (idem).
- **HTMX** (leve, mas menos comum).

### 8.5. Escopo do MVP

- **Tudo da fase 1** (recomendado: 18–26 semanas).
- **Só o núcleo** (importação + classificação + DRE: 10–12 semanas).
- **Fase 1 + Fase 5** (com relatórios expandidos e Conselheiro: 21–30 semanas).

### 8.6. Equipe

- **1 dev full-time** (18–26 semanas).
- **2 devs** (12–16 semanas).
- **3 devs** (10–12 semanas).
- **Equipe maior** (8–10 semanas).

---

## 9. Resumo

| Item | Descrição |
| :--- | :--- |
| **O que vamos construir** | MVP da fase 1 do Sistema de Gestão Gerencial. |
| **Duração estimada** | 18–26 semanas (1 dev) / 10–16 semanas (2–3 devs). |
| **Fases** | 0 (preparação), 1 (fundação), 2 (dados), 3 (financeiro/relatórios), 4 (fechamento/administração), 5 (relatórios expandidos + Conselheiro), 6 (testes/go-live). |
| **Stack sugerida** | PHP/Laravel + MariaDB + HTML/CSS/JS puro + Docker. |
| **Equipe mínima** | 1 Tech Lead + 1 Full-stack + 1 PO (parcial). |
| **Critérios de aceite** | 15 critérios (login, empresa, importação, classificação, cálculos, DRE, fechamento, relatórios, auditoria, testes, deploy). |
| **Riscos principais** | Parser de XML, motor de classificação, cálculo de impostos, DRE, performance, segurança. |

---

## 10. Próximo passo

Depois de decidir as **6 perguntas** da seção 8, o próximo passo é:

1. **Criar o repositório** e a **estrutura de pastas** (Fase 0).
2. **Rodar o DDL** no MariaDB (Fase 0).
3. **Implementar a Fase 1** (autenticação + cadastro de empresa).

Quer que eu detalhe **alguma fase específica** (ex: a Fase 1, com as telas e endpoints), **algum risco** (ex: o parser de XML) ou **alguma decisão técnica** (ex: Laravel vs. Slim)?