---
documento: pendencias
versao: 1.7
data: 2026-10-28
data_referencia: 2026-10-28
proposito: Lista consolidada de itens pendentes de avaliação (fase 2 ou decisão futura) + multi-empresa (tenant)
depende_de: [01_visao_geral, 03_casos_de_uso, 05_apendices, 07_atores_fluxo, 08_ordens, 09_menu_numeracao, 13_relatorios_administrador, 14_conselheiro]
---

# Pendências — Itens a Avaliar

> **Data de referência:** 2026-10-28
>
> **O que é este documento:** lista consolidada de tudo que ficou **pendente** (fase 2 ou decisão futura). Para cada item: o que é, por que está pendente, o que já está resolvido na fase 1, e quando será avaliado.
>
> **Como usar:** ao retomar o projeto, percorrer esta lista e decidir, item a item, se entra na fase 1, na fase 2, ou se é descartado. Atualizar este documento a cada decisão.

---

## 1. ICMS-ST — cálculo detalhado

**O que é:** cálculo da Substituição Tributária com base na MVA, alíquota interna, redução de base, etc.

**Por que está pendente:** depende de regras estaduais complexas e muda com frequência.

**O que já está resolvido na fase 1:**
- O CST do item (10, 30, 60, 70) indica se há ST.
- O valor da ST **informado no XML** é usado (não recalculado).
- O valor da ST **compõe o custo** da mercadoria (não é recuperável).
- Regra: `E1 — RN13`.

**O que falta:**
- Cálculo detalhado (MVA, alíquota interna, redução de base).
- Tratamento da empresa como **substituta** (recolhe ST em nome do cliente).
- Devolução de compra com ST (restituição).

**Quando avaliar:** fase 2, após uso real com notas que tragam ST.

**Impacto se não fizer:** o sistema usa o valor do XML (geralmente correto), mas não valida nem calcula ST quando o XML não trouxer.

---

## 2. Devolução de venda — estorno de impostos

**O que é:** estorno dos impostos sobre vendas quando o cliente devolve mercadoria.

**Por que está pendente:** a devolução já **reduz a receita** na fase 1; o estorno de impostos exige tratamento adicional no razão (T7) e no DRE.

**O que já está resolvido na fase 1:**
- Devolução de venda **reduz a receita** (regra `E2 — RN13`).
- CFOP de devolução é o mesmo dos dois lados (Apêndice A.9).
- Classificação: reduz a receita (matriz de classificação, G6).

**O que falta:**
- Estorno dos impostos (ICMS, PIS, COFINS, ISS) no razão (T7).
- Ajuste no DRE (dedução da receita bruta vs. redutor de impostos).

**Quando avaliar:** fase 2, quando houver volume de devoluções.

**Impacto se não fizer:** a receita é reduzida, mas os impostos ficam calculados sobre a receita original (superestimados).

---

## 3. Devolução ao fornecedor

**O que é:** devolução de compra ao fornecedor, com redução de custo/despesa e estorno de créditos.

**Por que está pendente:** a devolução ao fornecedor é uma operação de saída (CFOP 5201/5202/6201/6202) que exige tratamento específico no razão (T7) e no DRE.

**O que já está resolvido na fase 1:**
- CFOP de devolução é o mesmo dos dois lados (Apêndice A.9).
- A matriz de classificação (G7) indica "reduz a conta original" — mas o tratamento não foi detalhado.

**O que falta:**
- Redução do custo/despesa na conta original.
- Estorno de créditos de impostos (ICMS, IPI, PIS, COFINS) no razão (T7).
- Tratamento do estoque (se houver controle).

**Quando avaliar:** fase 2, quando houver volume de devoluções.

**Impacto se não fizer:** o custo/despesa fica superestimado (não reduz com a devolução).

---

## 4. Retornos (serviço agregado, consignação, perda)

**O que é:** retorno de mercadoria que já pertence à empresa (conserto, consignação, industrialização, venda).

**Por que está pendente:** a fase 1 registra retorno como **movimentação** (sem impacto no DRE). Casos específicos exigem tratamento adicional.

**O que já está resolvido na fase 1:**
- CFOP de retorno é convertido (Apêndice A.10).
- Não gera receita/despesa (matriz de classificação, G6).
- Não gera crédito/débito de impostos (a não ser que haja serviço agregado).

**O que falta:**
- **Serviço agregado** (ex: conserto): separar o valor da mercadoria (movimentação) do valor do serviço (despesa/custo).
- **Consignação:** controle de mercadoria que está com terceiros.
- **Perda:** mercadoria que retorna danificada.

**Quando avaliar:** fase 2, quando houver esses casos.

**Impacto se não fizer:** o serviço agregado não é lançado como despesa/custo; a consignação e a perda não são controladas.

---

## 5. Benefícios fiscais — tabela e cálculo

**O que é:** regimes especiais que reduzem ou isentam impostos (isenção, redução de base, alíquota zero, crédito presumido, Zona Franca, etc.).

**Por que está pendente:** depende de regras estaduais e federais complexas.

**O que já está resolvido na fase 1:**
- O CST do item indica o benefício (40, 41, 51, etc.).
- O sistema usa o **valor do XML** — o benefício já vem refletido no CST e no valor do imposto.
- O sistema **não calcula** benefícios.

**O que falta:**
- Tabela de benefícios fiscais por empresa/produto.
- Cálculo da alíquota correta quando o XML não trouxer.
- Crédito presumido (CST 60–69 de PIS/COFINS).

**Quando avaliar:** fase 2, quando houver benefícios que o XML não reflita corretamente.

**Impacto se não fizer:** o sistema usa o valor do XML (geralmente correto), mas não valida nem calcula benefícios.

---

## 6. Simples Nacional com múltiplas atividades

**O que é:** empresas do Simples com atividades diferentes (comércio + serviços) têm anexos diferentes por atividade.

**Por que está pendente:** a fase 1 trata o Simples Nacional de forma unificada (DAS), sem separar por atividade.

**O que já está resolvido na fase 1:**
- DAS unificado.
- Faixa pela receita acumulada de 12 meses (LC 123).
- Alíquota efetiva sobre a receita do período.

**O que falta:**
- Separação por anexo (comércio, serviço, ambos).
- Cálculo da alíquota efetiva por atividade.

**Quando avaliar:** fase 2, quando houver empresa do Simples com múltiplas atividades.

**Impacto se não fizer:** o DAS fica calculado com um único anexo (pode superestimar ou subestimar).

---

## 7. Cálculo proporcional (admitidos/demitidos no mês)

**O que é:** cálculo proporcional de férias, 13º e encargos para funcionários admitidos ou demitidos no meio do mês.

**Por que está pendente:** a fase 1 calcula sobre o mês cheio.

**O que já está resolvido na fase 1:**
- Folha calculada com base no salário base e nos proventos/descontos.
- Provisões calculadas mensalmente.

**O que falta:**
- Cálculo proporcional aos dias trabalhados no mês.
- Ajuste nas provisões de férias e 13º.

**Quando avaliar:** fase 2, quando houver admissões/demissões frequentes.

**Impacto se não fizer:** o custo de pessoal fica superestimado no mês de admissão/demissão.

---

## 8. Reversão de provisões (férias gozadas, 13º pago)

**O que é:** quando o funcionário goza férias ou recebe 13º, a provisão é revertida e o valor é lançado como salário normal.

**Por que está pendente:** a fase 1 provisiona mensalmente, mas não reverte.

**O que já está resolvido na fase 1:**
- Provisões calculadas mensalmente (E5).
- Encargos sobre provisões geram débito no razão (T7).

**O que falta:**
- Reversão da provisão quando o funcionário goza férias ou recebe 13º.
- Lançamento do valor efetivo como salário normal.

**Quando avaliar:** fase 2, quando houver gozo de férias ou pagamento de 13º.

**Impacto se não fizer:** a provisão acumula indefinidamente; o custo real não é refletido.

---

## 9. Baixa de ativo (alienação/descarte) e depreciação acelerada

**O que é:** baixa de ativo com cálculo de ganho/perda; depreciação acelerada calculada em paralelo à linear.

**Por que está pendente:** a fase 1 calcula depreciação linear e não trata baixa.

**O que já está resolvido na fase 1:**
- Depreciação linear (E4).
- Mês inicial da depreciação configurável.
- Depreciação acumulada como conta redutora do Ativo.

**O que falta:**
- Baixa de ativo (alienação/descarte) com ganho/perda.
- Depreciação acelerada (simulação fiscal) em paralelo à linear.
- Cálculo do valor contábil líquido na data da baixa.

**Quando avaliar:** fase 2, quando houver alienação/descarte.

**Impacto se não fizer:** o ativo fica no Ativo mesmo após a baixa; a depreciação continua sendo lançada.

---

## 10. OFX / CNAB (integração bancária)

**O que é:** importação de extratos bancários (OFX) e arquivos de remessa (CNAB) para conciliação automática.

**Por que está pendente:** a fase 1 faz baixa manual.

**O que já está resolvido na fase 1:**
- Baixa manual (F3), individual ou em lote.
- Posição de caixa (F4).
- Fluxo de caixa projetado (G4).

**O que falta:**
- Importação de extrato bancário (OFX).
- Importação de arquivo de remessa (CNAB).
- Conciliação automática.

**Quando avaliar:** fase 2, quando houver volume de transações.

**Impacto se não fizer:** a baixa é manual (trabalhosa, sujeita a erro).

---

## 11. Tela de correção de dados

**O que é:** tela dedicada para corrigir lançamentos, impostos calculados, classificações e valores, com justificativa obrigatória e log de auditoria.

**Por que está pendente:** a fase 1 permite correção via D3 (revisão) e E1/E2 (override), mas não há tela dedicada.

**O que já está resolvido na fase 1:**
- Revisão de lançamentos (D3).
- Override de impostos calculados (E1/E2).
- Auditoria das alterações.

**O que falta:**
- Tela dedicada, com visão consolidada das correções.
- Justificativa obrigatória e log centralizado.

**Quando avaliar:** fase 2, quando o volume de correções justificar.

**Impacto se não fizer:** as correções são feitas em telas diferentes, sem visão consolidada.

---

## 12. Comparação com realizado (fluxo de caixa)

**O que é:** comparar o fluxo de caixa projetado com o que efetivamente ocorreu.

**Por que está pendente:** a fase 1 projeta o fluxo, mas não compara com o realizado.

**O que já está resolvido na fase 1:**
- Fluxo de caixa projetado (F4, G4).
- Posição de caixa (F4).

**O que falta:**
- Comparação projetado vs. realizado.
- Análise das diferenças.

**Quando avaliar:** fase 2, quando houver histórico suficiente.

**Impacto se não fizer:** o gestor não vê se a projeção está acertada.

---

## 13. Simulação (H1–H5)

**O que é:** módulo de simulação de cenários ("e se...?") sobre snapshot dos dados.

**Por que está pendente:** é o diferencial do sistema, mas depende de maturidade dos dados e do motor de classificação.

**O que já está resolvido na fase 1:**
- Nada diretamente. A estrutura de dados (`cenario_simulacao`) está no modelo, mas sem lógica.

**O que falta:**
- H1 — Criar cenário (snapshot).
- H2 — Ajustar variáveis.
- H3 — Recalcular e comparar.
- H4 — Salvar cenário.
- H5 — Comparar dois cenários salvos.

**Quando avaliar:** fase 2, após uso real do sistema.

**Impacto se não fizer:** o sistema entrega visão histórica, mas não permite simular.

---

## 14. Indústria

**O que é:** subcontas de custo para indústria (Matéria-Prima, MOD, CIF, Variação de Estoque, CPV).

**Por que está pendente:** o foco inicial é Comércio e Serviços.

**O que já está resolvido na fase 1:**
- Estrutura do plano de contas preparada para receber `3.3 Indústria`.
- Motor de classificação com regras para Comércio e Serviços.

**O que falta:**
- Subcontas de custo da indústria.
- Regras de classificação específicas (matéria-prima, produção em andamento, produto acabado).
- Controle de estoque físico (fora do escopo do sistema).

**Quando avaliar:** fase 2, quando houver demanda de indústria.

**Impacto se não fizer:** o sistema não atende indústria.

---

## 15. Multi-empresa no mesmo usuário (contador externo)

**O que é:** permitir que um mesmo usuário acesse **mais de uma empresa** (tenant) com um único login, trocando de contexto. Cenário típico: contador externo que atende N empresas.

**Por que está pendente:** a regra R1 (`01_visao_geral.md`, seção 8) define que `empresa` é o tenant — cada empresa é isolada e única. Um usuário pertence a **uma** empresa (`usuario.id_empresa`). Para atender N empresas, hoje são necessários N logins.

**O que já está resolvido na fase 1:**
- Uma empresa por instalação, com N filiais.
- Usuário vinculado a uma empresa (`usuario.id_empresa`).
- Permissões por filial (`usuario_ator.id_filial`).
- Isolamento por empresa (R1–R3).

**O que falta:**
- Mecanismo de troca de contexto (N:N `usuario_empresa`, que **não existe** hoje).
- Contexto de autenticação com `id_empresa` ativo, trocável.
- Revisor/UI para o usuário alternar entre empresas.
- Impacto no repositório (R2): o `id_empresa` do contexto muda, e o filtro acompanha.

**Quando avaliar:** fase 2, quando houver demanda de contador externo.

**Impacto se não fizer:** o contador externo precisa de N logins (um por empresa).

---

## 16. Créditos não aproveitados

**O que é:** identificar créditos de impostos que a empresa tem direito mas não está usando (ex: crédito de ICMS sobre ativo imobilizado, crédito de PIS/COFINS sobre insumos).

**Por que está pendente:** depende de regras de crédito por regime e por tipo de compra.

**O que já está resolvido na fase 1:**
- Razão de impostos (T7) com créditos e débitos.
- Cálculo de créditos sobre compras (E1).

**O que falta:**
- Identificação de créditos não aproveitados.
- Potencial de recuperação.
- Regras específicas (ex: crédito de ICMS sobre ativo imobilizado proporcional à depreciação).

**Quando avaliar:** fase 2, quando houver volume de créditos.

**Impacto se não fizer:** o gestor não vê créditos que poderia aproveitar.

---

## 17. Rateio de despesas fixas (margem por cliente/produto)

**O que é:** ratear despesas fixas entre clientes/produtos para calcular a margem líquida (além da margem de contribuição).

**Por que está pendente:** a fase 1 calcula margem de contribuição, mas não margem líquida.

**O que já está resolvido na fase 1:**
- Margem de contribuição (receita − custos variáveis).
- Custos diretos por produto.
- Despesas variáveis por cliente/produto.

**O que falta:**
- Rateio de despesas fixas (critério a definir).
- Margem líquida por cliente/produto.

**Quando avaliar:** fase 2, quando houver demanda de análise mais precisa.

**Impacto se não fizer:** o gestor vê margem de contribuição, mas não margem líquida.

---

## 18. Handoff por filial

**O que é:** permitir que a ativação/desativação do handoff seja **por filial** (não só por empresa).

**Por que está pendente:** a fase 1 trata o handoff por empresa. Uma empresa com filiais de tamanhos diferentes pode querer handoff em uma e não em outra.

**O que já está resolvido na fase 1:**
- Handoff ativado/desativado por empresa (`configuracao_handoff`).
- Fluxo fixo.

**O que falta:**
- Handoff por filial.
- Configuração granular.

**Quando avaliar:** fase 2, quando houver empresa com filiais de portes diferentes.

**Impacto se não fizer:** a empresa precisa escolher uma configuração única para todas as filiais.

---

## 19. Prazos e escalonamento no handoff

**O que é:** definir prazos para cada etapa do handoff e escalonar automaticamente se o prazo estourar (ex: notificar o gestor).

**Por que está pendente:** a fase 1 não tem prazo obrigatório; o status "urgente" é indicativo.

**O que já está resolvido na fase 1:**
- Status "urgente" por ordem.
- Caixa de entrada com urgentes destacadas.

**O que falta:**
- Prazo por etapa.
- Escalonamento automático.
- Notificações.

**Quando avaliar:** fase 2, quando houver volume de tarefas e necessidade de controle de SLA.

**Impacto se não fizer:** o gestor não vê gargalos por tempo.

---

## 20. Segregação de funções como bloqueio

**O que é:** impedir que o mesmo usuário execute etapas incompatíveis (ex: quem digita a NF não pode ser quem paga).

**Por que está pendente:** a fase 1 trata a segregação como **recomendação do Auditor**, não como bloqueio.

**O que já está resolvido na fase 1:**
- O Auditor pode apontar problemas e solicitar mudanças.
- O acúmulo de funções é permitido.

**O que falta:**
- Bloqueio de etapas incompatíveis.
- Configuração de quais etapas são incompatíveis.

**Quando avaliar:** fase 2, quando houver demanda de controle interno mais rígido.

**Impacto se não fizer:** o sistema permite acúmulo (bom para PME), mas não impede (bom para empresas maiores).

---

## 21. Permissões de relatórios e simulação por ator

**O que é:** definir quem pode ver quais relatórios (G1–G7) e quem pode simular (H1–H5), por ator.

**Por que está pendente:** a fase 1 deixa o Administrador ver tudo; os demais atores veem o que for definido.

**O que já está resolvido na fase 1:**
- O Administrador vê tudo.
- Os demais atores veem o que for definido (a definir).

**O que falta:**
- Permissões granulares por relatório.
- Permissões por ator.

**Quando avaliar:** fase 2, quando houver demanda de restrição de acesso.

**Impacto se não fizer:** todos os atores veem todos os relatórios (ou só o Administrador vê, a definir).

---

## 22. Técnico (apontamento de serviço)

**O que é:** ator que aponta horas/serviço executado, gerando NFS-e.

**Por que está pendente:** depende de controle operacional que está fora do escopo da fase 1.

**O que já está resolvido na fase 1:**
- Nada (o Técnico não é ator da fase 1).

**O que falta:**
- Cadastro de Técnico.
- Apontamento de serviço.
- Geração de NFS-e a partir do apontamento.

**Quando avaliar:** fase 2, quando houver demanda de serviços com apontamento.

**Impacto se não fizer:** o serviço é faturado sem apontamento detalhado.

---

## 23. Controller separado do Contador

**O que é:** separar o ator Controller (que gerencia regras, plano de contas, parâmetros) do Contador (que processa lançamentos).

**Por que está pendente:** a fase 1 acumula Controller no Contador.

**O que já está resolvido na fase 1:**
- Contador acumula Controller.

**O que falta:**
- Ator Controller separado.
- Permissões distintas.

**Quando avaliar:** fase 2, quando houver demanda de separação.

**Impacto se não fizer:** o Contador acumula funções (bom para PME).

---

## 24. Limite de aprovação do Gerente Financeiro

**O que é:** definir um limite de valor acima do qual o Gerente Financeiro precisa aprovar pagamentos/recebimentos.

**Por que está pendente:** a fase 1 tem o Gerente Financeiro, mas sem limite configurável.

**O que já está resolvido na fase 1:**
- O Gerente Financeiro processa saída/entrada de caixa/banco.

**O que falta:**
- Limite configurável.
- Aprovação acima do limite.

**Quando avaliar:** fase 2, quando houver volume de pagamentos altos.

**Impacto se não fizer:** o Gerente Financeiro processa tudo (sem distinção por valor).

---

## 25. Prioridade automática de ordens

**O que é:** definir regras para priorizar automaticamente as ordens na caixa de entrada (ex: fechamento > pagamento > conferência), além do status "urgente".

**Por que está pendente:** a fase 1 usa apenas a marcação "urgente" (T8.6) e a ordenação por data de criação.

**O que já está resolvido na fase 1:**
- Marcação "urgente" por ordem (T8.6).
- Ordenação por data de criação.

**O que falta:**
- Regras de prioridade automática (ex: tipo de ordem, prazo, valor).
- Ordenação configurável.

**Quando avaliar:** fase 2, quando houver volume de ordens.

**Impacto se não fizer:** o ator vê as ordens por data, não por criticidade.

---

## 26. ~~Prazos e escalonamento no handoff (revisão da pendência 19)~~ — REMOVIDA

**Status:** **removida** na versão 1.4 (era duplicata da pendência 19).

**Motivo:** o conteúdo era idêntico ao da pendência 19 ("Prazos e escalonamento no handoff"). Manter duas entradas iguais gerava confusão na contagem e no acompanhamento. Todo o conteúdo relevante está na pendência 19.

**Ação:** ao avaliar a fase 2, considerar apenas a pendência 19.

---

## 27. Notificações de ordens

**O que é:** notificar o ator quando uma nova ordem chega à caixa de entrada (e-mail, push, badge na tela).

**Por que está pendente:** a fase 1 não tem notificações; o ator precisa abrir a caixa de entrada.

**O que já está resolvido na fase 1:**
- Caixa de entrada com ordens pendentes.

**O que falta:**
- Notificação por e-mail.
- Notificação push.
- Badge com contador de ordens pendentes.

**Quando avaliar:** fase 2, quando houver demanda de usuários.

**Impacto se não fizer:** o ator pode não perceber que há novas ordens.

---

## 28. Auditoria granular de ordens

**O que é:** registrar em tabela própria (`ordem_acao`) cada ação executada em uma ordem (abrir, concluir, cancelar, aceitar, alterar, etc.), além da tabela `auditoria` genérica.

**Por que está pendente:** a fase 1 usa a tabela `auditoria` genérica, que já registra as ações, mas não é específica para ordens.

**O que já está resolvido na fase 1:**
- Tabela `auditoria` registra as ações (T8.7).
- Tabela `documento_encadeado` registra os elos.

**O que falta:**
- Tabela `ordem_acao` específica.
- Relatório de auditoria de ordens.

**Quando avaliar:** fase 2, quando houver demanda de auditoria detalhada de ordens.

**Impacto se não fizer:** a auditoria é genérica, não específica para ordens.

---

## 29. Menu com permissões granulares por relatório

**O que é:** permitir que o Administrador restrinja o acesso a relatórios específicos (DRE, fluxo de caixa, margem) por ator, além do que já existe no menu.

**Por que está pendente:** a fase 1 libera todos os relatórios do bloco Administrador para quem tem a tag `administrador` (e `contador` para DRE). Restrições mais finas ficam para depois.

**O que já está resolvido na fase 1:**
- Menu por ator (`09_menu_numeracao.md`).
- Bloco Administrador visível para `administrador`.

**O que falta:**
- Permissão por relatório (ex: só DRE para o Contador, só fluxo de caixa para o Financeiro).
- Configuração pelo Configurador.

**Quando avaliar:** fase 2.

**Impacto se não fizer:** todos os relatórios ficam visíveis para quem tem a tag do bloco.

---

## 30. Wireframe → implementação (mapeamento)

**O que é:** mapear cada tela do wireframe para o caso de uso correspondente, para facilitar a transição para a implementação (PHP + MariaDB).

**Por que está pendente:** o wireframe foi construído em HTML/CSS/JS puro com dados simulados. A transição para backend exige:
- Mapear cada `screens[rota]` para uma rota do backend.
- Substituir os dados simulados por chamadas `fetch()` à API.
- Implementar autenticação real (hoje é mock).
- Implementar as regras de negócio no backend (hoje são simuladas no front).

**O que já está resolvido na fase 1:**
- Wireframe completo (63 telas).
- DDL completo (63 tabelas).
- Documentação funcional completa.

**O que falta:**
- Escolher a stack backend (PHP + framework?).
- Definir a API (REST? GraphQL?).
- Implementar autenticação (JWT? sessão?).
- Mapear cada tela para o caso de uso e para as tabelas.

**Quando avaliar:** na transição para a implementação.

**Impacto se não fizer:** a implementação fica sem referência clara do que cada tela faz.

## 31. Orçamento vs. realizado

**O que é:** comparar o planejado (orçamento/metas) com o realizado, por período, para os relatórios do Administrador (G9 — Painel Executivo; G15 — Resumo Executivo).

**Por que está pendente:** o módulo de orçamento/metas não existe. Depende de um módulo novo.

**O que já está resolvido na fase 1:**
- DRE, Balanço, Fluxo, Aging, Posição de Impostos/Pessoal/Ativos, Ponto de Equilíbrio, Resumo Executivo (G8–G15).
- Comparação com período anterior e mesmo período do ano anterior.

**O que falta:**
- Cadastro de orçamento/metas por conta, centro de custo e período.
- Comparação planejado vs. realizado em G9 e G15.
- Alerta quando o realizado desvia do orçado.

**Quando avaliar:** fase 2, quando houver demanda de planejamento.

**Impacto se não fizer:** o administrador vê o realizado, mas não vê se está **dentro do planejado**.

---

## 32. Histórico de indicadores (snapshot mensal)

**O que é:** guardar, mês a mês, o **snapshot** dos KPIs calculados (ROE, ROA, liquidez corrente, endividamento, ciclo de caixa), para comparação histórica e evolução.

**Por que está pendente:** hoje os KPIs podem ser calculados on-the-fly a partir dos lançamentos. O histórico só é necessário se a performance exigir.

**O que já está resolvido na fase 1:**
- Cálculo dos KPIs em G9 (Painel Executivo).
- Comparação com período anterior e mesmo período do ano anterior (recalculando).

**O que falta:**
- Tabela `indicadores_snapshot` (ou equivalente).
- Job mensal para gravar os KPIs no fechamento.
- Comparação histórica sem recálculo.

**Quando avaliar:** fase 2, **se** o recálculo on-the-fly ficar lento ou se precisar de histórico imutável.

**Impacto se não fizer:** o KPI é recalculado a cada consulta (mais lento, mas sempre atualizado).

---

## 33. Alertas proativos configuráveis

**O que é:** permitir ao Configurador definir **regras de alerta** no Painel Executivo (G9) e no Resumo Executivo (G15), do tipo:
- "Inadimplência > 10%".
- "Caixa projetado negativo em 15 dias".
- "Margem líquida < 5%".
- "Custo de pessoal > 40% da receita".

**Por que está pendente:** a fase 1 usa **regras padrão** (fixas). Configuráveis exigem tela de configuração.

**O que já está resolvido na fase 1:**
- Alertas com regras padrão no G9 e no G15.

**O que falta:**
- Tela de configuração de regras (limite, período, severidade).
- Aplicação das regras configuradas.

**Quando avaliar:** fase 2, quando houver demanda de customização por empresa.

**Impacto se não fizer:** os alertas são os mesmos para todas as empresas (podem não refletir a realidade de cada uma).

---

## 34. Consolidação multiempresa (reforço) — ver pendência 15

**O que é:** reforçar que Balanço (G8), Painel Executivo (G9) e Resumo Executivo (G15) precisam **consolidar** múltiplas empresas, não só filiais.

**Por que está pendente:** com a regra R1 (`01_visao_geral.md`, seção 8), "múltiplas empresas" **não** é multi-tenant SaaS — é multi-empresa no mesmo usuário (contador externo). A consolidação entre empresas só faz sentido **se** a pendência 15 for implementada com troca de contexto.

**O que já está resolvido na fase 1:**
- Estrutura de filiais (1:N).
- Relatórios por filial ou consolidados (soma das filiais).

**O que falta:**
- Ver pendência 15 (mecanismo de troca de contexto).
- Se a 15 for implementada, definir se os relatórios consolidam **empresas** ou só **filiais**.
- Se a 15 **não** for implementada, esta pendência 34 é **descartada** (não há o que consolidar).

**Quando avaliar:** junto com a pendência 15.

**Impacto se não fizer:** os relatórios consolidam **filiais** de uma empresa, não **empresas** de um grupo.

---

## 35. Faixas de aging configuráveis

**O que é:** permitir ao Configurador definir as **faixas de aging** do G10 (Aging de Contas) — hoje fixas em: a vencer, 1–30, 31–60, 61–90, > 90 dias.

**Por que está pendente:** a fase 1 usa faixas padrão. Configuráveis exigem tela de configuração.

**O que já está resolvido na fase 1:**
- Aging com faixas padrão.
- Indicadores (inadimplência %, PMR, PMP, concentração).

**O que falta:**
- Tela de configuração de faixas (quantidade, limites).
- Aplicação das faixas configuradas.

**Quando avaliar:** fase 2, quando houver demanda de customização.

**Impacto se não fizer:** as faixas são fixas (podem não refletir a política de crédito de cada empresa).

---

## 36. Customização do Resumo Executivo

**O que é:** permitir ao Administrador **escolher** quais destaques, riscos e oportunidades aparecem no Resumo Executivo (G15), em vez de usar o padrão.

**Por que está pendente:** a fase 1 usa um **conjunto padrão** de destaques/riscos/oportunidades. Customizável exige tela de configuração.

**O que já está resolvido na fase 1:**
- Resumo Executivo com destaques, riscos e oportunidades padrão.
- Drill-down para os relatórios detalhados.

**O que falta:**
- Tela de seleção de itens (destaques, riscos, oportunidades).
- Salvamento da preferência por usuário.

**Quando avaliar:** fase 2, quando houver demanda.

**Impacto se não fizer:** o resumo é o mesmo para todos (pode não refletir a prioridade de cada administrador).

## 37. Metas configuráveis para o Conselheiro

**O que é:** permitir que o gestor defina metas (ex: margem mínima 20%, inadimplência máxima 5%) para o Conselheiro comparar.

**Por que está pendente:** a fase 1 usa faixas padrão e compara só com períodos anteriores.

**O que já está resolvido na fase 1:**
- Comparação com período anterior e mesmo período do ano anterior.
- Faixas padrão de prioridade.

**O que falta:**
- Tela de configuração de metas.
- Conselheiro comparar com metas.

**Quando avaliar:** fase 2.

---

## 38. Benchmarks (comparação com o setor)

**O que é:** comparar os indicadores da empresa com benchmarks do setor (ex: margem média do setor).

**Por que está pendente:** depende de uma base externa de benchmarks (que não existe).

**Quando avaliar:** fase 2 (ou descartar, se não houver base confiável).

---

## 39. Machine learning (aprender com as decisões do gestor)

**O que é:** o Conselheiro aprender com as decisões do gestor (ex: se o gestor ignora uma sugestão de "renegociar fornecedor" recorrentemente, o Conselheiro para de sugerir).

**Por que está pendente:** a fase 1 usa heurísticas fixas.

**Quando avaliar:** fase 2 (se houver volume de dados suficiente).

---

## 40. Notificações do Conselheiro

**O que é:** notificar o gestor (e-mail, sino) quando uma sugestão de alta prioridade surgir.

**Por que está pendente:** a fase 1 não notifica; o gestor vê ao abrir a tela.

**Quando avaliar:** fase 2.

---

## 41. Permissões por área no Conselheiro

**O que é:** permitir que gestores de área vejam só as sugestões da sua área (ex: gestor Comercial vê só sugestões de Rentabilidade e Custos).

**Por que está pendente:** a fase 1 é focada no Administrador.

**Quando avaliar:** fase 2.

---

## 42. Filtro de empresa nas views

**O que é:** definir como as views `vw_saldo_contas_bancarias`, `vw_posicao_caixa` e `vw_caixa_entrada` (`10_modelo_dados_fisico.md`, seção 25) aplicam o filtro de empresa (R2).

**Por que está pendente:** as views hoje **não** filtram por empresa. Com R2, o filtro é responsabilidade do repositório (JOIN com `filiais`). Decidir se as views serão ajustadas para receber empresa (via procedure) ou se o filtro fica no `WHERE` da query que consome a view.

**O que já está resolvido na fase 1:**
- Views existem e retornam dados por filial.
- R2 define que o repositório aplica o escopo de empresa.

**O que falta:**
- **Opção 1 (recomendada):** manter as views como estão e filtrar no repositório via JOIN com `filiais`. **Nenhuma alteração de DDL.**
- **Opção 2:** converter as views em procedures com `id_empresa` como parâmetro. **Overkill** — views não têm parâmetros no MariaDB.
- **Opção 3:** criar views novas com `id_empresa` no `WHERE` (fixo). **Não funciona** — o `id_empresa` é dinâmico.

**Quando avaliar:** fase 1 (decisão de arquitetura, não de feature). **Recomendação:** Opção 1.

**Impacto se não decidir:** risco de views retornarem dados de empresas diferentes se consumidas sem o filtro do repositório.

---

## 43. Contador externo e multi-empresa

**O que é:** decidir se um contador externo que atende N empresas usa **logins separados** (um por empresa) ou um **login único com troca de contexto**.

**Por que está pendente:** a regra R1 (`01_visao_geral.md`, seção 8) define que `empresa` é o tenant — cada empresa é isolada. Um usuário pertence a **uma** empresa (`usuario.id_empresa`). Hoje, atender N empresas exige N logins.

**O que já está resolvido na fase 1:**
- Uma empresa por instalação, com N filiais.
- Usuário vinculado a uma empresa.
- Permissões por filial.
- Isolamento por empresa (R1–R3).

**O que falta (se a decisão for "login único com troca de contexto"):**
- N:N `usuario_empresa` (que **não existe** hoje).
- Contexto de autenticação com `id_empresa` ativo, trocável.
- UI de troca de contexto.
- Impacto no repositório (R2).

**O que falta (se a decisão for "logins separados"):**
- **Nada.** R1 fica intacta. Documentar a limitação.

**Quando avaliar:** fase 2, quando houver demanda de contador externo.

**Impacto se não decidir:** o contador externo precisa de N logins (um por empresa).

> **Nota:** esta pendência é o **detalhamento** da pendência 15. A 15 descreve o cenário; esta 43 descreve a decisão.

---

## Resumo por status

| # | Pendência | Status | Fase |
| :--- | :--- | :--- | :--- |
| 1 | ICMS-ST detalhado | Pendente | Fase 2 |
| 2 | Devolução de venda (estorno) | Pendente | Fase 2 |
| 3 | Devolução ao fornecedor | Pendente | Fase 2 |
| 4 | Retornos (serviço, consignação, perda) | Pendente | Fase 2 |
| 5 | Benefícios fiscais (tabela e cálculo) | Pendente | Fase 2 |
| 6 | Simples com múltiplas atividades | Pendente | Fase 2 |
| 7 | Cálculo proporcional (admitidos/demitidos) | Pendente | Fase 2 |
| 8 | Reversão de provisões | Pendente | Fase 2 |
| 9 | Baixa de ativo / depreciação acelerada | Pendente | Fase 2 |
| 10 | OFX / CNAB | Pendente | Fase 2 |
| 11 | Tela de correção de dados | Pendente | Fase 2 |
| 12 | Comparação com realizado | Pendente | Fase 2 |
| 13 | Simulação (H1–H5) | Pendente | Fase 2 |
| 14 | Indústria | Pendente | Fase 2 |
| 15 | Multi-empresa no mesmo usuário (contador externo) | Pendente | Fase 2 |
| 16 | Créditos não aproveitados | Pendente | Fase 2 |
| 17 | Rateio de despesas fixas | Pendente | Fase 2 |
| 18 | Handoff por filial | Pendente | Fase 2 |
| 19 | Prazos e escalonamento no handoff | Pendente | Fase 2 |
| 20 | Segregação de funções como bloqueio | Pendente | Fase 2 |
| 21 | Permissões de relatórios/simulação | Pendente | Fase 2 |
| 22 | Técnico (apontamento de serviço) | Pendente | Fase 2 |
| 23 | Controller separado do Contador | Pendente | Fase 2 |
| 24 | Limite de aprovação do Gerente Financeiro | Pendente | Fase 2 |
| 25 | Prioridade automática de ordens | Pendente | Fase 2 |
| 26 | ~~Prazos e escalonamento no handoff (revisão)~~ | **Removida** | — |
| 27 | Notificações de ordens | Pendente | Fase 2 |
| 28 | Auditoria granular de ordens | Pendente | Fase 2 |
| 29 | Menu com permissões granulares por relatório | Pendente | Fase 2 |
| 30 | Wireframe → implementação (mapeamento) | Pendente | Transição |
| 31 | Orçamento vs. realizado | Pendente | Fase 2 |
| 32 | Histórico de indicadores (snapshot) | Pendente | Fase 2 |
| 33 | Alertas proativos configuráveis | Pendente | Fase 2 |
| 34 | Consolidação multiempresa (reforço) | Pendente | Fase 2 (depende da 15) |
| 35 | Faixas de aging configuráveis | Pendente | Fase 2 |
| 36 | Customização do Resumo Executivo | Pendente | Fase 2 |
| 37 | Metas configuráveis para o Conselheiro | Pendente | Fase 2 |
| 38 | Benchmarks (comparação com o setor) | Pendente | Fase 2 |
| 39 | Machine learning (aprender com decisões) | Pendente | Fase 2 |
| 40 | Notificações do Conselheiro | Pendente | Fase 2 |
| 41 | Permissões por área no Conselheiro | Pendente | Fase 2 |
| 42 | Filtro de empresa nas views | Pendente | Fase 1 (arquitetura) |
| 43 | Contador externo e multi-empresa | Pendente | Fase 2 |

**Total efetivo: 42 pendências** (a #26 foi removida por duplicidade com a #19; a #43 é detalhamento da #15).

**Nenhuma pendência bloqueia a fase 1.** A **#42** é decisão de arquitetura (fase 1), mas a recomendação (Opção 1 — filtro no repositório) **não bloqueia** nada.

---

## Como atualizar este documento

1. Ao decidir sobre uma pendência, mover o item para a seção "Resolvido" (a criar) ou marcar como "Descartado".
2. Atualizar a data de referência no topo.
3. Registrar a decisão no histórico de versões (abaixo).

## Histórico de versões

| Versão | Data | Mudança |
| :--- | :--- | :--- |
| 1.0 | 2026-10-21 | Criação do documento. 17 pendências identificadas. |
| 1.1 | 2026-10-22 | Acréscimo de 7 pendências (handoff por filial, prazos/escalonamento, segregação como bloqueio, permissões de relatórios/simulação, técnico, Controller separado, limite do Gerente Financeiro). Total: 24. |
| 1.2 | 2026-10-23 | Acréscimo de 4 pendências de ordens (prioridade automática, prazos/escalonamento, notificações, auditoria granular). Total: 28. |
| 1.3 | 2026-10-24 | Acréscimo de 2 pendências (menu com permissões granulares, wireframe → implementação). Total: 30. |
| 1.4 | 2026-10-24 | Remoção da pendência 26 (duplicata da 19). Total efetivo: 29. Correção do frontmatter (`------` → `---`). Unificação da data de referência em `2026-10-24`. "Multa empresa" → "Múltiplas empresas" (typo). |
| 1.5 | 2026-10-25 | **Merge do `13` (v1.1).** Acréscimo de 6 pendências (orçamento vs. realizado; histórico de indicadores; alertas proativos configuráveis; consolidação multiempresa reforçada; faixas de aging configuráveis; customização do Resumo Executivo). Total efetivo: 35. |
| 1.6 | 2026-10-26 | Acréscimo de 11 pendências: 6 do `13` (31–36) e 5 do `14` (37–41). Total: 41. |
| 1.7 | 2026-10-28 | Adoção da regra empresa = tenant (R1–R3). Reescrita da pendência 15 ("Múltiplas empresas" → "Multi-empresa no mesmo usuário (contador externo)"). Ajuste da pendência 34 (aponta para a 15; descartável se a 15 não for implementada). Novas pendências: **42** (Filtro de empresa nas views) e **43** (Contador externo e multi-empresa, detalhamento da 15). Total efetivo: 42 (a #26 removida). |
```

---

## Resumo das mudanças no `06_pendencias.md`

| Item | Antes | Depois |
| :--- | :--- | :--- |
| Frontmatter | v1.6, 2026-10-26 | **v1.7, 2026-10-28** |
| Data de referência | 2026-10-25 | **2026-10-28** |
| **Pendência 15** | "Múltiplas empresas" (ambíguo) | **"Multi-empresa no mesmo usuário (contador externo)"** com R1, N:N `usuario_empresa`, troca de contexto |
| **Pendência 34** | "Consolidação multiempresa (reforço)" | **Ajustada** — aponta para a 15; descartável se a 15 não for implementada |
| **Nova pendência 42** | — | **Filtro de empresa nas views** (fase 1, arquitetura; recomendação: filtro no repositório) |
| **Nova pendência 43** | — | **Contador externo e multi-empresa** (fase 2; detalhamento da 15) |
| Resumo por status | 41 linhas | **43 linhas** (26 removida + 42 e 43 novas) |
| Total efetivo | 35 | **42** |
| Histórico | v1.6 | **+ linha v1.7** |

---
