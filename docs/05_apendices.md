---
documento: apendices
versao: 1.0
data: 2026-10-21
proposito: Conversão de CFOP/CST, matriz de classificação e glossário
depende_de: [01_visao_geral, 02_regras_transversais, 04_modelo_de_dados]
---

# Apêndices

## A. Conversão de CFOP (saída → entrada)

**Regra geral:** a conversão CFOP → CFOP é o **ponto de partida**, não o ponto final. A classificação final (conta gerencial) depende do destino (revenda, uso/consumo, ativo), da Categoria do Fornecedor, do NCM e do CST.

### A.1 Grupo 1 — Vendas de mercadoria (internas)

| CFOP Saída | Descrição (saída) | CFOP Entrada | Descrição (entrada) | Observações |
| :--- | :--- | :--- | :--- | :--- |
| 5101 | Venda de produção do estabelecimento | 1101 (Comércio: 1102) | Compra para industrialização (ou comercialização) | Uso/consumo: 1556. Ativo: 1551. |
| 5102 | Venda de mercadoria adquirida de terceiros | 1102 | Compra para comercialização | Mercadoria para revenda. |
| 5103 | Venda de produção, efetuada fora | 1103 (Comércio: 1104) | Compra para industrialização, efetuada fora | — |
| 5104 | Venda de mercadoria adquirida de terceiros, efetuada fora | 1104 | Compra para comercialização, efetuada fora | — |
| 5105 | Venda de produção que não deva por ele transitar | 1105 | Compra para industrialização, efetuada fora | — |
| 5106 | Venda de mercadoria adquirida de terceiros que não deva por ele transitar | 1106 | Compra para comercialização, efetuada fora | — |

### A.2 Grupo 2 — Vendas de mercadoria (interestaduais)

| CFOP Saída | CFOP Entrada | Observações |
| :--- | :--- | :--- |
| 6101 | 2101 (Comércio: 2102) | Uso/consumo: 2556. Ativo: 2551. |
| 6102 | 2102 | — |
| 6103 | 2103 | — |
| 6104 | 2104 | — |
| 6105 | 2105 | — |
| 6106 | 2106 | — |

### A.3 Grupo 3 — Vendas com ST (internas)

| CFOP Saída | CFOP Entrada | Observações |
| :--- | :--- | :--- |
| 5401 | 1401 (Comércio: 1402) | ICMS-ST compõe o custo. |
| 5402 | 1402 | — |
| 5403 | 1403 | — |
| 5405 | 1405 | — |

### A.4 Grupo 4 — Vendas com ST (interestaduais)

| CFOP Saída | CFOP Entrada | Observações |
| :--- | :--- | :--- |
| 6401 | 2401 (Comércio: 2402) | — |
| 6402 | 2402 | — |
| 6403 | 2403 | — |
| 6404 | 2404 | — |

### A.5 Grupo 5 — Vendas de ativo imobilizado (internas)

| CFOP Saída | CFOP Entrada | Observações |
| :--- | :--- | :--- |
| 5551 | 1551 | Vai para 1.2.1 Imobilizado. |
| 5552 | 1552 | — |
| 5553 | 1553 | — |

### A.6 Grupo 6 — Vendas de ativo imobilizado (interestaduais)

| CFOP Saída | CFOP Entrada | Observações |
| :--- | :--- | :--- |
| 6551 | 2551 | — |
| 6552 | 2552 | — |
| 6553 | 2553 | — |

### A.7 Grupo 7 — Vendas de material de uso/consumo (internas)

| CFOP Saída | CFOP Entrada | Observações |
| :--- | :--- | :--- |
| 5556 | 1556 | Vai para Despesa (4.1.x ou 4.2.x). |
| 5557 | 1557 | — |

### A.8 Grupo 8 — Vendas de material de uso/consumo (interestaduais)

| CFOP Saída | CFOP Entrada | Observações |
| :--- | :--- | :--- |
| 6556 | 2556 | — |
| 6557 | 2557 | — |

### A.9 Grupo 9 — Devoluções

| CFOP Saída | CFOP Entrada | Observações |
| :--- | :--- | :--- |
| 1201, 1202, 2201, 2202 | mesmos | Devolução é devolução nos dois lados. |

### A.10 Grupo 10 — Retornos

| CFOP Saída | CFOP Entrada | Observações |
| :--- | :--- | :--- |
| 5901–5904, 6901–6904 | 1901–1904, 2901–2904 | Não geram receita/despesa. |

---

## B. Conversão de CST (saída → entrada)

### B.1 ICMS

**O CST não muda com a direção.** O que muda é o **efeito gerencial**:

| CST | Efeito (comprador) |
| :--- | :--- |
| 00 | Crédito (ICMS destacado) |
| 10 | Crédito (ICMS próprio) + Custo (ICMS-ST) |
| 20 | Crédito proporcional (base reduzida) |
| 30 | Custo (ICMS-ST) |
| 40, 41 | Nenhum |
| 50 | Nenhum no momento |
| 51 | A definir (fase 2) |
| 60 | Nenhum (ST já no custo) |
| 70 | Crédito proporcional + Custo (ST) |
| 90 | Depende do caso |

### B.2 IPI

**Conversão direta:**

| CST Saída | CST Entrada |
| :--- | :--- |
| 50 | 00 |
| 51 | 01 |
| 52 | 02 |
| 53 | 03 |
| 54 | 04 |
| 55 | 05 |
| 99 | 49 |

### B.3 PIS/COFINS

**Depende do CFOP de entrada + regime da empresa.**

| CST Saída | CST Entrada (com crédito) | CST Entrada (sem crédito) |
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

**Decisão:**
- **Com crédito:** Lucro Real não cumulativo **e** CFOP de entrada justifica (ex: 1102, 2102).
- **Sem crédito:** Lucro Presumido, Simples, ou CFOP não justifica (ex: 1551 — ativo).

### B.4 IBS/CBS (fase 2)

**Mesma lógica de PIS/COFINS**, com CSTs próprios (a definir — LC 214/2025). Em 2026, valores informativos (IBS 0,1%, CBS 0,9%).

### B.5 Regras registradas

- **R9 — Conversão de ICMS:** CST não muda; efeito muda.
- **R10 — Conversão de IPI:** CST muda; conversão direta.
- **R11 — Conversão de PIS/COFINS:** CST muda; depende de CFOP + regime.
- **R12 — Conversão de IBS/CBS:** mesma lógica de PIS/COFINS; CSTs próprios (fase 2).
- **R13 — PIS/COFINS zerado no XML:** se o regime permitir crédito **e** o CFOP justificar, o sistema calcula (com log). Se não, mantém zerado, com aviso.

---

## C. Matriz de classificação (CFOP + CST + NCM/Categoria → Conta)

### C.1 Regras gerais

- **RC1 — Origem + Direção:** própria/terceiros + entrada/saída.
- **RC2 — CFOP convertido:** notas de terceiros têm CFOP convertido (Apêndice A).
- **RC3 — CST define o efeito do imposto.**
- **RC4 — NCM/Categoria refina o destino.**
- **RC5 — Fallback:** sem regra → conta genérica, pendência **Erro** `[T6]`, revisão manual (D3).
- **RC6 — Item a item:** documentos com múltiplos itens são classificados item a item.
- **RC7 — Emissão própria pode ser entrada:** retornos/devoluções não geram receita/despesa (exceto devolução de venda, que reduz a receita na fase 1).
- **RC8 — Devolução ao fornecedor reduz a conta original** (com estorno de créditos, fase 2).

### C.2 Matriz (resumo)

| Grupo | Origem+Direção | CFOPs | Conta Gerencial principal |
| :--- | :--- | :--- | :--- |
| G1.1 | Terceiros-Entrada | 1102, 2102, 1402, 2402 | 3.1.1 CMV |
| G1.2 | Terceiros-Entrada | 1556, 2556 | 4.1.x ou 4.2.x (conforme NCM) |
| G1.3 | Terceiros-Entrada | 1551, 2551 | 1.2.1 Imobilizado |
| G1.4 | Terceiros-Entrada | 1101, 2101 | 3.3.1 Matéria-Prima (fase 2) |
| G2 | Terceiros-Entrada | 2102, 2556, 2551, 2101 | Mesmas do G1 |
| G3 | Própria-Saída | 5101–5106, 6101–6106, 5401–5405, 6401–6404 | 5.1.1 Venda de Mercadorias |
| G4 | Própria-Saída (serviço) | LC 116 (prestada) | 5.1.2 Prestação de Serviços |
| G5 | Terceiros-Entrada (serviço) | LC 116 (tomada) | 4.1.x ou 3.2.3 (conforme serviço) |
| G6 | Própria-Entrada | 1201, 1202, 2201, 2202 | Reduz a receita (devolução de venda, fase 1) |
| G6 | Própria-Entrada | 1901–1904, 2901–2904 | Sem lançamento no DRE (retornos) |
| G7 | Terceiros-Saída | 5201, 5202, 6201, 6202 | Reduz a conta original (fase 2) |

---

## D. Plano de contas gerencial (Comércio e Serviços)

```
1  ATIVO
   1.1  Circulante (Caixa, Bancos, Contas a Receber, Estoques, Adiantamentos, Impostos a Recuperar)
   1.2  Não Circulante (Imobilizado, (-) Depreciação Acumulada, Intangível)
2  PASSIVO
   2.1  Circulante (Fornecedores, Contas a Pagar, Salários a Pagar, Encargos a Recolher, Impostos a Recolher, Empréstimos CP)
   2.2  Não Circulante (Empréstimos LP)
   2.3  Patrimônio Líquido (Capital Social, Lucros/Prejuízos, Resultado do Exercício)
3  CUSTOS
   3.1  Comércio (CMV)
   3.2  Serviços (Material Aplicado, MOD, Serviços de Terceiros)
4  DESPESAS OPERACIONAIS
   4.1  Fixas (aluguel, salários adm., depreciação adm., energia/água/telefone, software, contabilidade)
   4.2  Variáveis (comissões, frete sobre vendas, impostos sobre vendas, marketing)
   4.3  Não Operacionais (perda em alienação, multas não financeiras)
5  RECEITAS
   5.1  Operacional (Venda de Mercadorias, Prestação de Serviços)
   5.2  Não Operacional (Venda de Ativos, Outras)
6  RESULTADO FINANCEIRO
   6.1  Receitas Financeiras
   6.2  Despesas Financeiras
```

**Regra:** só contas **analíticas** recebem lançamentos; sintéticas apenas somam.

**Migração futura para indústria:** adicionar `3.3 Indústria` (Matéria-Prima, MOD, CIF, Variação de Estoque, CPV).

---

## E. Glossário

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
| **Passivo** | Obrigações da empresa. |
| **PIS** | Programa de Integração Social. |
| **RAT** | Risco Ambiental do Trabalho. |
| **RPA** | Recibo de Pagamento a Autônomo. |
| **Snapshot** | Cópia instantânea dos dados para simulação. |
| **ST** | Substituição Tributária. |