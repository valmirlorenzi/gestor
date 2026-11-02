---
modulo: entrada_dados
casos: [C1, C2, C3, C4, C5, C6, C7, C8]
depende_de: [02_regras_transversais, 03_casos_de_uso, 05_apendices, 07_atores_fluxo, 08_ordens, 09_menu_numeracao]
---

# Módulo C — Entrada de Dados

> **Números de menu:**
> - C1 → 5.4 (entrada) / 6.4 (saída) · C2 → 5.4 / 6.4 · C3 → 5.4 / 6.4 · C8 → 5.4
> - C4 → 4.6 (Lançamento Manual) · C5 → 5.3 (entrada) / 6.3 (saída)
> - C6/C7 → 10.6 (Folha)

> **Regras transversais:** T5 (período), T5.5 (cancelado), T6 (pendências), T7 (razão), T8 (handoff).
> **Ordens relacionadas:** C1 → O1/O2; C2 → O3/O4; C3 → O3/O4; C4 → O7; C5 → O5; C6/C7 → O6; C8 → O3.

**Regra comum a todos os casos:** toda entrada de dados só é aceita no **período aberto** `[T5]`. Documento cancelado é registrado apenas para histórico, ignorado em cálculos `[T5.5]`. Dados faltantes críticos → **Erro** `[T6]`; não críticos → **Aviso** `[T6]`. Contraparte não cadastrada é criada automaticamente com status "Cadastro incompleto". Reprocessamento **substitui** os registros anteriores (com auditoria). A filial é identificada pelo CNPJ (emitente/destinatário) ou selecionada manualmente.

## C1 — Importar XMLs de NF-e em lote

**Ator:** Comprador (entrada) / Faturista (saída). **Pré-condições:** empresa cadastrada; período **Aberto** `[T5]`; XMLs em pastas ano/mês.

**Fluxo:**
1. Selecionar pasta.
2. Varre XMLs e validar: estrutura, cancelamento, duplicidade (chave), empresa no XML, data vs. período aberto.
3. Identificar a filial pelo CNPJ (emitente/destinatário). Se não corresponder → aviso + escolha manual.
4. Relatório de pré-validação: aceitos, aceitos com aviso, cancelados, rejeitados.
5. Confirmar.
6. Para cada aceito: extrair dados; identificar entrada/saída; criar **Documento** e **Lançamentos**; acionar D1; gerar créditos/débitos `[T7]` (via E1/E2); gerar contas a pagar/receber (F1/F2).
7. Relatório de importação; direcionar para revisão (D3).

**Exceções:** sem período aberto (bloqueia); pasta vazia; XML corrompido; empresa não identificada; falha no motor; dados faltantes críticos/não críticos.

**RNs (1–13):** ver `03_casos_de_uso.md#C1`.

**Telas:** Importar NF-e, Modal de confirmação de data divergente, Modal de escolha de filial, Relatório de pré-validação, Relatório de importação, Revisão (D3), Documentos importados, Pendências `[T6]`.

**Ordens relacionadas:** O1 (conferir NF-e entrada), O2 (conferir NF-e saída).

## C2 — Importar XMLs de NFS-e em lote

**Particularidades:** sem CFOP/NCM; código de serviço (LC 116) e código municipal; ISS, retenções, CBS/IBS; XML varia por município; RPA não é NFS-e (redireciona para C8).

**Fluxo:** análogo ao C1, com identificação prestador/tomador. Retenções lançadas em contas específicas. Crédito/débito no razão `[T7]`.

**RNs (1–13):** ver `03_casos_de_uso.md#C2`.

**Telas:** Importar NFS-e, Modal de confirmação, Modal de escolha de filial, Relatório de pré-validação, Relatório de importação, Revisão (D3), Documentos importados, Pendências `[T6]`.

**Ordens relacionadas:** O3 (conferir NFS-e tomada), O4 (conferir NFS-e prestada).

## C3 — Importar XMLs de CT-e em lote

**Particularidades:** serviço de transporte; ICMS sobre frete; vinculação com NF-e; modalidade CIF/FOB.
- **CIF:** despesa variável (frete sobre venda) para o vendedor.
- **FOB:** custo de aquisição ou despesa, conforme o uso.

**RNs (1–15):** ver `03_casos_de_uso.md#C3`.

**Telas:** Importar CT-e, Modal de confirmação, Modal de escolha de filial, Relatório de pré-validação, Relatório de importação, Revisão (D3), Documentos importados, Pendências `[T6]`.

**Ordens relacionadas:** O3 (conferir CT-e tomado), O4 (conferir CT-e emitido).

## C4 — Digitar lançamento manual individual

**Partidas dobradas transparentes:** usuário informa a operação, valor, conta de destino e forma de contrapartida. Sistema monta as duas pernas.

**Filial obrigatória.**

**RNs (1–11):** ver `03_casos_de_uso.md#C4`.

**Telas:** Lançamento Manual, Modal "Ver lançamento completo", Modal de confirmação de data divergente, Revisão (D3), Pendências `[T6]`.

**Ordens relacionadas:** O7 (revisar classificação, se fallback).

## C5 — Digitar documento fiscal manualmente

Permite registrar NF-e, NFS-e, CT-e ou RPA sem XML. Formulário específico por tipo. Sugestão de conta (D1), contrapartida obrigatória, partidas dobradas, geração de crédito/débito `[T7]`.

**RNs (1–10):** ver `03_casos_de_uso.md#C5`.

**Telas:** Documento Manual (seleção de tipo, formulário específico), Modal de confirmação de data divergente, Revisão (D3), Pendências `[T6]`.

**Ordens relacionadas:** O5 (conferir documento manual).

## C6 — Importar folha de pagamento

**Duas situações de cálculo (RN2):** folha real (valores do arquivo) vs. folha simulada/futura (calculados pelo sistema). Se o arquivo trouxer alguns valores e outros não, usa os reais e calcula os faltantes, com aviso.

**Funcionário não cadastrado (RN11):** criado automaticamente com status "Cadastro incompleto".

**Cálculo:** respeita as flags do cadastro de proventos/descontos. Detalhamento (bruto, bases FGTS/INSS/IRRF, encargos).

**Lançamentos:** partidas dobradas; custo/despesa por centro de custo; créditos/débitos no razão `[T7]`.

**RNs (1–14):** ver `03_casos_de_uso.md#C6`.

**Telas:** Importar Folha, Relatório de pré-validação, Relatório de importação, Revisão (D3), Pendências `[T6]`.

**Ordens relacionadas:** O6 (conferir folha).

## C7 — Digitar folha manualmente

Fallback do C6. Lista de funcionários ativos; campos por funcionário; cálculo automático dos valores ausentes. Override permitido (com auditoria). Funcionário não cadastrado pode ser cadastrado na hora ou criado automaticamente (RN11).

**RNs (1–15):** ver `03_casos_de_uso.md#C7`.

**Telas:** Folha Manual, Modal de confirmação de período divergente, Modal de cadastro rápido de funcionário, Revisão (D3), Pendências `[T6]`.

**Ordens relacionadas:** O6 (conferir folha).

## C8 — Importar RPA

**Documento próprio** (não é NFS-e, não é folha). Pagamento a autônomo. Retenções: INSS, IRRF, ISS, PIS/COFINS/CSLL. Se informadas no arquivo, usa; se não, calcula. Override permitido.

**RNs (1–14):** ver `03_casos_de_uso.md#C8`.

**Telas:** Importar RPA, Relatório de pré-validação, Relatório de importação, Revisão (D3), Pendências `[T6]`.

**Ordens relacionadas:** O3 (conferir RPA tomado).

## Resumo das ordens relacionadas

| Caso de uso | Ordens emitidas | Ordens recebidas |
| :--- | :--- | :--- |
| C1 | O1 (entrada), O2 (saída) | — |
| C2 | O3 (tomada), O4 (prestada) | — |
| C3 | O3 (tomado), O4 (emitido) | — |
| C4 | O7 (se fallback) | — |
| C5 | O5 | — |
| C6 | O6 | — |
| C7 | O6 | — |
| C8 | O3 | — |

## Telas do wireframe

- `screens['importar-xml']` (C1, C2, C3, C8 — mesma tela, adaptada por ator)
- `screens['documento-manual']` (C5)
- `screens['lancamento-manual']` (C4 — já existia)
- `screens['folha']` (C6, C7)