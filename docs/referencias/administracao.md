---
modulo: administracao
casos: [I1, I2, I3, I4, I5]
depende_de: [02_regras_transversais, 04_modelo_de_dados, 07_atores_fluxo, 08_ordens, 09_menu_numeracao]
---

# Módulo I — Administração

> **Números de menu:**
> - I1/I4 → 2.4 (Usuários e Atores)
> - I2 → 4.1 (Tabelas Fiscais) + 10.1/10.2/10.3 (Tabelas Trabalhistas)
> - I3 → 11.1 (Auditoria log) + 11.2 (Documentos) + 11.3 (Lançamentos)
> - I5 → 2.8 (Handoff)

> **Regras transversais:** T6 (pendências), T8 (handoff).
> **Ordens relacionadas:** I2 → O28; I3 → O25, O26; I1/I4/I5 → nenhuma ordem direta.

## I1 — Usuários e permissões

**Tags de ator** (não existe "perfil de acesso" separado). Um usuário pode ter múltiplas tags. Se tem `configurador`, não precisa das demais. Ator é **por filial** (`usuario_ator`). O cadastro de usuário habilita as filiais que ele pode acessar. Email único. Senha em hash. Desativação não apaga o usuário. Toda alteração registrada em auditoria.

**RNs (1–9):** ver `03_casos_de_uso.md#I1`.

## I2 — Atualização de parâmetros

Atualizar INSS, IRRF, encargos, alíquotas. Vigência por período. Importação/exportação. Tabelas trabalhistas universais, não adaptáveis; tabelas fiscais adaptáveis por empresa. Alteração não afeta períodos fechados `[T5]`.

**RNs (1–8):** ver `03_casos_de_uso.md#I2`.

**Ordens relacionadas:** O28 (ajustar parâmetros).

## I3 — Auditoria

Log de ações relevantes: quem, quando, o quê, justificativa. Consulta por usuário, período, tipo, tabela, filial. Exportação. Log imutável.

**RNs (1–6):** ver `03_casos_de_uso.md#I3`.

**Ordens relacionadas:** O25 (apontar problema), O26 (solicitar correção).

## I4 — Gerenciar atores e usuários

Cadastrar usuário com tags (atores) por filial. Habilitar filiais que o usuário pode acessar. Se tem `configurador`, não precisa de outras tags. Sem perfil de acesso separado.

**RNs:** ver `03_casos_de_uso.md#I4`.

**Ordens relacionadas:** nenhuma ordem direta.

## I5 — Ativar/desativar handoff

Configurador ativa/desativa o handoff **por empresa**. Auditoria registra a mudança. Handoff por filial é fase 2.

**RNs:** ver `03_casos_de_uso.md#I5`.

**Ordens relacionadas:** nenhuma ordem direta.

## Resumo das ordens relacionadas

| Caso de uso | Ordens emitidas | Ordens recebidas |
| :--- | :--- | :--- |
| I1 | — | — |
| I2 | O28 | O28 |
| I3 | O25, O26 | — |
| I4 | — | — |
| I5 | — | — |

## Telas do wireframe

- `screens['usuarios']` (I1/I4)
- `screens['tabelas-fiscais']`, `screens['tabelas-inss']`, `screens['tabelas-irrf']`, `screens['tabelas-gerais']` (I2)
- `screens['auditoria']`, `screens['auditoria-documentos']`, `screens['auditoria-lancamentos']` (I3)
- `screens['handoff']` (I5)