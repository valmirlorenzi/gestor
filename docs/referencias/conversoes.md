---
modulo: conversoes
casos: []
depende_de: [05_apendices, 09_menu_numeracao]
proposito: Referência de apoio das conversões de CFOP/CST, matriz de classificação e plano de contas
quando_carregar: converter CFOP (saída → entrada), CST (ICMS/IPI/PIS/COFINS/IBS/CBS), consultar matriz de classificação ou plano de contas
---

# Conversões de CFOP e CST

> **Números de menu:**
> - Sem número próprio — referência de apoio (usado em C1/C2/C3, D1, E1/E2).

> **Documento base:** `05_apendices.md` (seções A, B, C, D).
> **Onde é usado:** D1 (matriz de classificação, prioridades 2 e 5), E1/E2 (conversão de CST para crédito/débito), C1/C2/C3/C5 (conversão de CFOP na importação/digitação).
> **Ordens relacionadas:** nenhuma ordem direta (é referência de apoio).

## Conversão de CFOP (saída → entrada)

A conversão CFOP → CFOP é o **ponto de partida**, não o ponto final. A classificação final depende do destino (revenda, uso/consumo, ativo), da Categoria do Fornecedor, do NCM e do CST.

### Grupos (resumo)

| Grupo | CFOPs Saída | CFOPs Entrada |
| :--- | :--- | :--- |
| 1 — Vendas internas | 5101–5106 | 1101–1106 (Comércio: 1102/1104/1106) |
| 2 — Vendas interestaduais | 6101–6106 | 2101–2106 (Comércio: 2102/2104/2106) |
| 3 — Vendas com ST (internas) | 5401–5405 | 1401–1405 (Comércio: 1402/1403/1405) |
| 4 — Vendas com ST (interestaduais) | 6401–6404 | 2401–2404 (Comércio: 2402/2403/2404) |
| 5 — Ativo imobilizado (internas) | 5551–5553 | 1551–1553 |
| 6 — Ativo imobilizado (interestaduais) | 6551–6553 | 2551–2553 |
| 7 — Uso/consumo (internas) | 5556–5557 | 1556–1557 |
| 8 — Uso/consumo (interestaduais) | 6556–6557 | 2556–2557 |
| 9 — Devoluções | 1201, 1202, 2201, 2202 | mesmos |
| 10 — Retornos | 5901–5904, 6901–6904 | 1901–1904, 2901–2904 |

**Detalhe completo:** `05_apendices.md`, seção A.

## Conversão de CST

### ICMS

O CST **não muda** com a direção. O que muda é o **efeito**: crédito (00, 10, 20, 70), custo (10, 30, 60, 70), nenhum (40, 41, 50, 51, 60).

### IPI

Conversão **direta**:

| CST Saída | CST Entrada |
| :--- | :--- |
| 50 | 00 |
| 51 | 01 |
| 52 | 02 |
| 53 | 03 |
| 54 | 04 |
| 55 | 05 |
| 99 | 49 |

### PIS/COFINS

Depende do **CFOP de entrada + regime**:

| CST Saída | Com crédito | Sem crédito |
| :--- | :--- | :--- |
| 01 | 50 | 70 |
| 02 | 51 | 71 |
| 03 | 52 | 72 |
| 04 | 53 | 73 |
| 05 | 54 | 74 |
| 06 | 55 | 75 |
| 07 | 56 | 76 |
| 08 | 57 | 77 |
| 09 | 58 | 78 |
| 49 | 59 | 79 |
| 60 | 60 | 69 |
| 90 | 90 | 90 |

**Decisão:** crédito se Lucro Real não cumulativo **e** CFOP justificar. Sem crédito se Presumido, Simples ou CFOP não justificar.

**R13 — PIS/COFINS zerado no XML:** se o regime permitir crédito **e** o CFOP justificar, o sistema calcula (com log). Se não, mantém zerado, com aviso.

### IBS/CBS (fase 2)

Mesma lógica de PIS/COFINS, com CSTs próprios (a definir — LC 214/2025). Em 2026, informativos (IBS 0,1%, CBS 0,9%).

**Detalhe completo:** `05_apendices.md`, seção B.

## Matriz de classificação (CFOP + CST → conta)

**Regras gerais (RC1–RC8):**
- **RC1** Origem + Direção.
- **RC2** CFOP convertido (notas de terceiros).
- **RC3** CST define o efeito do imposto.
- **RC4** NCM/Categoria refina o destino.
- **RC5** Fallback → conta genérica, pendência **Erro** `[T6]`.
- **RC6** Item a item.
- **RC7** Emissão própria pode ser entrada.
- **RC8** Devolução ao fornecedor reduz a conta original (fase 2).

**Matriz (resumo):**

| Grupo | Origem+Direção | CFOPs | Conta |
| :--- | :--- | :--- | :--- |
| G1.1 | Terceiros-Entrada | 1102, 2102, 1402, 2402 | 3.1.1 CMV |
| G1.2 | Terceiros-Entrada | 1556, 2556 | 4.1.x ou 4.2.x |
| G1.3 | Terceiros-Entrada | 1551, 2551 | 1.2.1 Imobilizado |
| G2 | Terceiros-Entrada | 2102, 2556, 2551, 2101 | Mesmas do G1 |
| G3 | Própria-Saída | 5101–5106, 6101–6106, 5401–5405, 6401–6404 | 5.1.1 Venda de Mercadorias |
| G4 | Própria-Saída (serviço) | LC 116 (prestada) | 5.1.2 Prestação de Serviços |
| G5 | Terceiros-Entrada (serviço) | LC 116 (tomada) | 4.1.x ou 3.2.3 |
| G6 | Própria-Entrada | 1201, 1202, 2201, 2202 | Reduz a receita (devolução de venda) |
| G6 | Própria-Entrada | 1901–1904, 2901–2904 | Sem lançamento no DRE (retornos) |
| G7 | Terceiros-Saída | 5201, 5202, 6201, 6202 | Reduz a conta original (fase 2) |

**Detalhe completo:** `05_apendices.md`, seção C.

## Plano de contas (estrutura)

1 ATIVO
1.1 Circulante
1.2 Não Circulante
2 PASSIVO
2.1 Circulante
2.2 Não Circulante
2.3 Patrimônio Líquido
3 CUSTOS
3.1 Comércio (CMV)
3.2 Serviços
3.3 Indústria (fase 2)
4 DESPESAS OPERACIONAIS
4.1 Fixas
4.2 Variáveis
4.3 Não Operacionais
5 RECEITAS
5.1 Operacional
5.2 Não Operacional
6 RESULTADO FINANCEIRO
6.1 Receitas Financeiras
6.2 Despesas Financeiras

**Regra:** só contas analíticas recebem lançamento.

**Detalhe completo:** `05_apendices.md`, seção D.

## Resumo das ordens relacionadas

Nenhuma ordem direta. É referência de apoio para D1, E1/E2, C1/C2/C3/C5.

## Telas do wireframe

Nenhuma tela própria. É referência de apoio para:
- `screens['importar-xml']` (conversão de CFOP/CST na importação)
- `screens['revisao-lancamentos']` (matriz de classificação)
- `screens['plano-contas']` (estrutura do plano)