---
documento: regras_transversais
versao: 1.1
data: 2026-10-22
proposito: Regras que atravessam módulos (T5, T6, T7, T8)
depende_de: []
---

# Regras Transversais

Regras que se aplicam a **todos os módulos** do sistema. São referenciadas pelos casos de uso como `[T5]`, `[T6]`, `[T7]` e `[T8]`.

## T5 — Período de competência

**T5.1 — Período de competência = período de inclusão.**
Todo documento ou lançamento pertence ao **período aberto no momento da sua inclusão**, independentemente da data de emissão ou da data do documento.

**T5.2 — Entrada só no período aberto.**
Toda entrada de dados (importação, digitação, folha, depreciação, provisões, baixa de contas) só é aceita no **período aberto**. Não há entrada em período fechado nem em período futuro.

**T5.3 — Data de emissão fora do período aberto.**
O sistema avisa ("A nota tem data de emissão 31/03/2026, mas será incluída no período 04/2026. Confirmar?"), mas não bloqueia. Se o usuário confirmar, a nota integra o período aberto normalmente.

**T5.4 — Sem reabertura, sem exceção, sem agendamento.**
Não existe "reabrir período fechado", "lançamento de exceção", "fila de agendamento por data de emissão" nem "antecipação de período futuro". O período aberto é o único destino.

**T5.5 — Documento cancelado.**
Documento cancelado é registrado apenas para histórico, ignorado em todos os cálculos.

**T5.6 — Auditoria.**
A confirmação de inclusão com data de emissão fora do período aberto gera log.

**T5.7 — Consistência.**
Não há distinção entre lançamento "normal" e "de outro período" nos relatórios.

**Fechamento mensal (A6) como âncora do ciclo:**
- Consolida folha (E3), depreciação (E4) e provisões (E5).
- Verifica pendências `[T6]`: Erros bloqueiam, Avisos exigem confirmação.
- Congela o período `[T5.4]`.
- Gera relatórios e alimenta simulação.
- Registra auditoria.
- Abre o próximo período `[T5]`.
- **Validação do Auditor (T8):** o Auditor valida a consolidação antes do fechamento.

**Por filial:** o período é por filial. Cada filial tem seu período aberto/fechado.

## T6 — Relatório de Pendências

**T6.1 — Definição.**
Relatório consolidado, agrupando tudo que precisa ser resolvido antes do fechamento.

**T6.2 — Classificação.**

| Categoria | Definição | Efeito no fechamento |
| :--- | :--- | :--- |
| **Erro** | Impede o fechamento. | **Bloqueia**. |
| **Aviso** | Não impede, mas merece atenção. | **Não bloqueia**. Exige confirmação. |

**T6.3 — Exemplos de Erros:** lançamentos não classificados; provisões não calculadas; depreciação não lançada; dados críticos faltantes; contas com divergência; regras ambíguas.

**T6.4 — Exemplos de Avisos:** dados não críticos faltantes; contas vencidas não baixadas; data divergente já confirmada; saldos de impostos sem movimentação.

**T6.5 — Acesso:** a qualquer momento, pelo Contador/Operador, com filtros.

**T6.6 — Fechamento (A6):** Erros bloqueiam; Avisos exigem confirmação explícita (registrada em auditoria).

**T6.7 — Resolução:** cada pendência tem ação de resolução.

**T6.8 — Auditoria:** o fechamento registra pendências existentes e como foram tratadas.

**Por filial:** o relatório é por filial, com visão consolidada disponível.

## T7 — Controle de Créditos e Débitos de Impostos

**T7.1 — Definição.** O sistema mantém um **razão de impostos** por tipo (PIS, COFINS, ICMS, IPI, ISS, IBS, CBS, IR, CSLL, INSS, FGTS, etc.).

**T7.2 — Geração:**
- Compra (tomadora) → **crédito**.
- Venda (vendedora) → **débito**.
- Retenção sofrida → **crédito a recuperar**.
- Retenção efetuada → **débito a recolher**.
- Folha → **débito** (INSS, FGTS, IRRF).
- Apuração: saldo (débitos − créditos) por tipo, por período.

**T7.3 — Visão gerencial:** alimenta o DRE e a simulação.

**T7.4 — Não gera guias.**

**T7.5 — Aviso:** é gerencial; não substitui apuração fiscal oficial.

**Por filial:** o razão é por filial.

## T8 — Cadeia de documentos e handoff

> **T8.1 — Documento encadeado.** Todo documento pode gerar um documento encadeado (saída → entrada). O elo é registrado em `documento_encadeado`.
>
> **T8.2 — Estado do documento.** Todo documento tem `status_fluxo` (além de `status_importacao`). O `status_fluxo` reflete a etapa gerencial (ex: "Aguardando conferência", "Aguardando pagamento", "Pago").
>
> **T8.3 — Handoff fixo.** O fluxo padrão é fixo (definido pelo sistema). O Configurador pode **ativar/desativar** o handoff **por empresa**. Não há ajuste do ator de destino.
>
> **T8.4 — Autorização automática.** Apenas ordens definidas como automáticas são processadas pelo sistema (custo de produto, geração de contas a pagar/receber, razão de impostos). **Todo o restante exige ação humana.**
>
> **T8.5 — Caixa de entrada e saída.** Cada ator tem caixa de entrada (pendentes + em andamento, urgentes destacadas) e caixa de saída (o que enviou e ainda está pendente ou em andamento). Concluída vai para o histórico (consulta separada).
>
> **T8.6 — Status "urgente".** O ator pode marcar uma ordem como urgente (por ordem, não por documento). Sem prazo obrigatório.
>
> **T8.7 — Auditoria do handoff.** Toda transição de estado é registrada em auditoria (quem, quando, documento, estado anterior, estado novo). A ativação/desativação de handoff também é auditada.
>
> **T8.8 — Auditor não muda nada.** O Auditor consulta, aponta problemas e solicita mudanças ao ator competente. Valida a consolidação do fechamento antes de o Contador fechar.
>
> **T8.9 — Acúmulo de funções.** Um usuário pode ter várias tags. Se tem `configurador`, não precisa de outras. A segregação de funções é recomendação do Auditor, não bloqueio.
>
> **T8.10 — Ator por filial.** O ator é por filial. O cadastro de usuário habilita as filiais que ele pode acessar.
>
> **T8.11 — Documentos gerados pelo sistema.** Conta a pagar, conta a receber, razão de imposto, depreciação, provisão e pendência têm como **ator de origem** quem gerou a NF (Comprador ou Faturista). O sistema é processador, não autor.
>
> **T8.12 — Sem perfil de acesso.** Não existe "perfil de acesso" separado. A tag do ator funcional define o que o usuário pode fazer. O `configurador` tem acesso total.