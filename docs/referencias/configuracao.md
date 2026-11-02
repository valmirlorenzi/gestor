---
modulo: configuracao
casos: [A1, A2, A3, A4, A5, A6, A8, B1, B2, B3, B4]
depende_de: [02_regras_transversais, 04_modelo_de_dados, 07_atores_fluxo, 08_ordens, 09_menu_numeracao]
---

# Módulo A e B — Configuração e Cadastros Básicos

> **Números de menu:**
> - A1 → 2.1 (Empresa) · A2 → 4.2 (Plano de Contas) · A3 → 2.3 (Centros de Custo)
> - A4 → 4.4 (Config. Fiscais) · A5 → 4.3 (Config. Contábeis) · A6 → 4.10 + 4.11 (Preparar/Fechar)
> - A8 → 2.2 (Filiais) · B1 → 6.2 (Clientes) · B2 → 5.2 (Fornecedores) · B3 → 10.4 (Funcionários) · B4 → 2.7 (Ativos)

> **Regras transversais:** T5 (período), T6 (pendências), T8 (handoff).
> **A7 (reabrir período) removido do escopo** `[T5.4]`.
> **Ordens relacionadas:** A6 → O22, O23, O24; A4/I2 → O28; demais → nenhuma ordem direta.

## A1 — Cadastrar empresa

**Ator:** Configurador (com apoio do Contador nos ajustes contábeis/fiscais). **Pré-condições:** nenhuma (primeiro caso da implantação).

**Fluxo:**
1. Informar CNPJ, Razão Social, Nome Fantasia, IE, IM, endereço, **regime fiscal** (Simples/Presumido/Real), **setor** (Comércio/Serviços/Misto), CNAE, data de início.
2. Validar CNPJ (dígito verificador e unicidade).
3. Apresentar planos de contas sugeridos; usuário seleciona.
4. Carregar tabelas universais de parâmetros fiscais e trabalhistas; permitir adaptação das tabelas de tributos.
5. Criar **filial matriz** automaticamente; vincular `id_filial_matriz`.
6. Criar **primeiro período** no estado **Aberto** `[T5]`.
7. Exibir resumo.

**Regras (RN1–RN12):**
- **RN1** Regime fiscal obrigatório → mapeamento referencial.
- **RN2** Setor obrigatório → ativa contas de custo (3.1.x Comércio, 3.2.x Serviços, ambas Misto).
- **RN3** Usuário seleciona o plano entre os sugeridos.
- **RN4** Mapeamento referencial já embutido no plano.
- **RN5** Tabelas fiscais adaptáveis por empresa; trabalhistas não adaptáveis.
- **RN6** Alteração de regime só no início de novo período.
- **RN7** Alteração de regime/setor não apaga dados históricos.
- **RN8** Primeiro período criado automaticamente `[T5]`.
- **RN9** CNPJ validado e único.
- **RN10** Plano vinculado à empresa e editável.
- **RN11** Toda empresa tem pelo menos uma filial (a matriz).
- **RN12** Cadastro de filiais adicionais em A8.

**Exceções:** CNPJ inválido; regime/setor não selecionado; data inválida; alteração de regime em período fechado (bloqueia retroativo).

**Telas:** Cadastro de Empresa (etapas), Resumo da Configuração, Editar Empresa.

**Ordens relacionadas:** nenhuma ordem direta.

## A2 — Selecionar/editar plano de contas

**Ator:** Configurador (base) + Contador (ajustes). **Pré-condições:** empresa cadastrada; período aberto `[T5]`.

**Regras:**
- **RN1** Só contas **analíticas** recebem lançamentos; sintéticas apenas somam.
- **RN2** Contas com lançamentos não podem ser excluídas, apenas desativadas.
- **RN3** Alterações no plano não afetam lançamentos de períodos fechados `[T5]`.
- **RN4** Mapeamento referencial de contas novas informado pelo Controller (ou herdado do plano sugerido).

**Exceções:** código duplicado; conta pai inexistente; excluir conta com lançamentos (bloqueia); alteração em período fechado (bloqueia).

**Telas:** Plano de Contas (árvore + formulário), Auditoria de alterações.

**Ordens relacionadas:** nenhuma ordem direta.

## A3 — Cadastrar centros de custo e áreas de negócio

**Ator:** Configurador (base) + Contador (ajustes). **Pré-condições:** empresa cadastrada.

**Regras:**
- **RN1** Obrigatório ao menos um centro de custo antes de lançar despesas fixas.
- **RN2** Um centro pode estar em mais de uma área (N:N).
- **RN3** Centro com lançamentos não pode ser excluído, apenas desativado.

**Exceções:** centro com lançamentos; área sem centros (permitida, com aviso).

**Telas:** Centros de Custo, Áreas de Negócio.

**Ordens relacionadas:** nenhuma ordem direta.

## A4 — Carregar tabelas de parâmetros

**Ator:** Sistema + Configurador (base) + Contador (fiscais) + RH (trabalhistas).

**Regras:**
- **RN1** Tabelas trabalhistas universais, não adaptáveis (federais).
- **RN2** Tabelas fiscais universais, adaptáveis por empresa (tributos estaduais/municipais).
- **RN3** Suporte a vigência por período.

**Telas:** Parâmetros Fiscais e Trabalhistas (dentro de A1 e I2).

**Ordens relacionadas:** O28 (ajustar parâmetros).

## A5 — Configurar mapeamento referencial

**Ator:** Sistema.

**Regras:**
- **RN1** Toda conta analítica deve ter mapeamento referencial (ECD/ECF).
- **RN2** O mapeamento é único por conta.

**Telas:** Mapeamento Referencial (dentro de A2).

**Ordens relacionadas:** nenhuma ordem direta.

## A6 — Abrir/fechar período

**Ator:** Contador (prepara e fecha) + Auditor (valida antes do fechamento). **Pré-condições:** período no estado **Aberto** `[T5]`.

**Fluxo (fechamento):**
1. Selecionar filial (ou "todas").
2. Executar checklist de pendências `[T6]`: Erros bloqueiam; Avisos exigem confirmação.
3. Consolidar folha (E3), depreciação (E4), provisões (E5) se não lançadas.
4. **Enviar consolidação para o Auditor validar.**
5. Se aprovado, congelar o período `[T5.4]`.
6. Registrar auditoria.
7. Abrir o próximo período no estado **Aberto**.
8. Exibir resumo.

**Regras:**
- **RN1** Fechamento por filial, com opção "fechar todas" `[T5]`.
- **RN2** Erros bloqueiam; Avisos exigem confirmação `[T6]`.
- **RN3** Consolida E3, E4, E5.
- **RN4** Congela o período `[T5.4]`.
- **RN5** Abre automaticamente o próximo período `[T5]`.
- **RN6** Registra auditoria `[T5.6]`.
- **RN7** Auditor valida antes do fechamento (T8.8).

**Exceções:** erros não resolvidos (bloqueia); falha na consolidação (bloqueia); falha na abertura do próximo período (mantém "Em fechamento"); auditor reprova (devolve ao Contador).

**Telas:** Fechamento de Período, Resumo do Fechamento.

**Ordens relacionadas:** O22 (preparar fechamento), O23 (validar fechamento), O24 (fechar período).

## A8 — Cadastrar filial

**Ator:** Configurador. **Pré-condições:** empresa cadastrada; período aberto `[T5]`.

**Regras:**
- **RN1** CNPJ validado e único.
- **RN2** Filial herda regime fiscal, setor e plano de contas da empresa.
- **RN3** Filial pode ter CNAE diferente (para RAT e Terceiros).
- **RN4** Filial pode ter endereço/município diferente.
- **RN5** Filial não pode ser excluída se tiver lançamentos; pode ser desativada.
- **RN6** Primeiro período da filial criado automaticamente `[T5]`.

**Exceções:** CNPJ inválido/duplicado; filial com lançamentos; data inválida.

**Telas:** Cadastro de Filial, Resumo da Configuração.

**Ordens relacionadas:** nenhuma ordem direta.

## B1 — Clientes

**Ator:** Faturista (ou automático).

**Regras:**
- **RN1** Pessoa unificada (PF/PJ), com tags.
- **RN2** Documento validado conforme tipo.
- **RN3** Documento único por empresa.
- **RN4** Cliente não cadastrado em documento importado é **criado automaticamente** com status "Cadastro incompleto".

**Telas:** Cadastro de Clientes, Detalhes do Cliente.

**Ordens relacionadas:** nenhuma ordem direta.

## B2 — Fornecedores

**Ator:** Comprador (ou automático).

**Regras:**
- **RN1** Pessoa unificada, com tags.
- **RN2** Documento validado e único.
- **RN3** A **categoria padrão** alimenta o motor de classificação (D1, prioridade 3).
- **RN4** Fornecedor não cadastrado é **criado automaticamente** com status "Cadastro incompleto".

**Telas:** Cadastro de Fornecedores, Detalhes do Fornecedor.

**Ordens relacionadas:** nenhuma ordem direta.

## B3 — Funcionários

**Ator:** RH.

**Regras:**
- **RN1** A natureza (custo/despesa fixa) define a alocação no DRE (E3).
- **RN2** Funcionário não cadastrado em folha/RPA é **criado automaticamente** com status "Cadastro incompleto".
- **RN3** Rateio por centro de custo é permitido (N:N).

**Telas:** Cadastro de Funcionários, Detalhes do Funcionário.

**Ordens relacionadas:** nenhuma ordem direta.

## B4 — Ativos (patrimônios)

**Ator:** Configurador (base) + Contador (ajustes).

**Regras:**
- **RN1** Método linear é o padrão. Soma dos dígitos e unidades produzidas ficam para fase 2.
- **RN2** Mês inicial da depreciação: sugestão do mês seguinte à aquisição, editável.
- **RN3** Destino (custo/despesa) define a alocação no DRE (E4).
- **RN4** Após o primeiro lançamento, alteração do mês inicial exige reprocessamento (com auditoria).

**Exceções:** valor original ≤ residual (bloqueia); vida útil ≤ 0 (bloqueia).

**Telas:** Cadastro de Ativos, Detalhes do Ativo.

**Ordens relacionadas:** nenhuma ordem direta.

## Resumo das ordens relacionadas

| Caso de uso | Ordens emitidas | Ordens recebidas |
| :--- | :--- | :--- |
| A1 | — | — |
| A2 | — | — |
| A3 | — | — |
| A4 | O28 | — |
| A5 | — | — |
| A6 | O22, O23, O24 | O23, O24 |
| A8 | — | — |
| B1–B4 | — | — |

## Telas do wireframe

- `screens['empresa']`, `screens['filial']`, `screens['centros']`, `screens['usuarios']`, `screens['produtos']`, `screens['servicos']`, `screens['ativos']`, `screens['handoff']`
- `screens['clientes']`, `screens['fornecedores']`, `screens['funcionarios']`
- `screens['plano-contas']`, `screens['config-contabeis']`, `screens['config-fiscais']`
- `screens['preparar-fechamento']`, `screens['fechar-periodo']`