
## `docs/referencias/importacoes.md` (novo)

```markdown
# Módulo Importações (12.6) — Referência

> **Documento base:** `16_modulo_importacoes.md` (v1.0)
> **Regras transversais:** T9 (`02_regras_transversais.md` v1.2); T5, T6, T7, T8 (quando aplicável)
> **Quando carregar:** quando a tarefa envolver carga inicial de cadastros, importação de documentos fiscais em lote, ou operação da UI 12.6.

---

## 1. Conceito

**Importação é carga inicial (one-shot).** O módulo 12.6 popula o sistema com dados de fora (CSV, XML, legado) **antes** de a operação normal começar. Não é operação contínua; não substitui C1–C8.

## 2. Transversalidade

O módulo é **transversal** (bloco 12 — Administração). Cada ator vê **apenas os recursos que pode importar**, via `config/importacoes.php` (`recurso => atores[]`). O `configurador` vê tudo; o `administrador` não importa.

**Mapa `config/importacoes.php`:** cada recurso declara `rotulo`, `atores`, `motor`, `model`/`repository`, `chave_natural`, `colunas_obrigatorias`, `colunas_opcionais`, `modos`, `template`.

## 3. Motores

| Motor | O que importa | Formato | Passa por T5–T8? |
| :--- | :--- | :--- | :--- |
| **A** | Cadastro (13 recursos) | CSV | **Não** (T9.2) |
| **B** | Documento (8 recursos) | XML/CSV | **Sim** (T9.3) |
| **C** | Legado (2 recursos) | CSV | **Parcial** (T9.4) |

**Motor A** — Cadastro: `centros_custo`, `condicoes_pagamento`, `formas_pagamento`, `tipos_cliente`, `tipos_fornecedor`, `proventos_descontos`, `contas_bancarias`, `filiais`, `ativos`, `pessoas`, `funcionarios`, `produtos`, `servicos`.
- Modos: `inserir` (default), `atualizar`, `upsert`.
- Transação por linha.
- Não gera lançamento/ordem/pendência.

**Motor B** — Documento: NF-e entrada, NF-e saída, NFS-e tomada, NFS-e prestada, CT-e tomado, CT-e emitido, RPA, folha.
- XML (NF-e/NFS-e/CT-e); CSV (RPA/folha).
- Transação por documento.
- Reaproveita `store`/`confirmar` + `DocumentoService` (D1, E1/E2, F1/F2, T6, T7, T8, O30).

**Motor C** — Legado: `contas_pagar_legado`, `contas_receber_legado`.
- CSV.
- `id_nota_fiscal = NULL`, `dados_extras.origem = 'legado'`.
- Ator de origem do handoff = quem importou.
- Lançamento avulso (`id_nota_fiscal = NULL`, `id_nota_fiscal_item = NULL`).

## 4. Catálogo (23 recursos)

### 4.1 Motor A (13)

| Recurso | Tabela(s) | Chave natural | Ator(es) |
| :--- | :--- | :--- | :--- |
| `centros_custo` | `centros_custo` | `(id_empresa, nome)` | configurador, contador |
| `condicoes_pagamento` | `condicoes_pagamento` | `(id_empresa, descricao)` | configurador |
| `formas_pagamento` | `formas_pagamento` | `(id_empresa, descricao)` | configurador |
| `tipos_cliente` | `tipos_cliente` | `(id_empresa, descricao)` | configurador |
| `tipos_fornecedor` | `tipos_fornecedor` | `(id_empresa, descricao)` | configurador |
| `proventos_descontos` | `proventos_descontos` | `(id_empresa, codigo)` | configurador, rh |
| `contas_bancarias` | `contas_bancarias` | `(id_filial, id_banco, agencia, numero)` | configurador, financeiro1, financeiro2 |
| `filiais` | `filiais` | `(id_empresa, cnpj)` | configurador |
| `ativos` | `ativos` | `(id_filial, descricao, data_aquisicao)` | configurador, contador |
| `pessoas` | `pessoas` + filha + tags | `(id_empresa, documento)` | comprador, faturista, configurador |
| `funcionarios` | `pessoas` + tag + `funcionarios` | `(pessoas.id_empresa, documento)` | rh, configurador |
| `produtos` | `produtos_servicos` (`tipo='P'`) + `produtos` | `(id_empresa, codigo_interno)` ou `(id_empresa, descricao)` | comprador, configurador |
| `servicos` | `produtos_servicos` (`tipo='S'`) + `servicos` | `(id_empresa, codigo_interno)` ou `(id_empresa, descricao)` | comprador, faturista, configurador |

### 4.2 Motor B (8)

| Recurso | Tabela(s) | Formato | Direção | Ator(es) |
| :--- | :--- | :--- | :--- | :--- |
| NF-e entrada | `notas_fiscais` + itens + impostos | XML | Entrada | comprador, configurador |
| NF-e saída | idem | XML | Saída | faturista, configurador |
| NFS-e tomada | idem | XML | Entrada | comprador, configurador |
| NFS-e prestada | idem | XML | Saída | faturista, configurador |
| CT-e tomado | idem + vínculos | XML | Entrada | comprador, configurador |
| CT-e emitido | idem + vínculos | XML | Saída | faturista, configurador |
| RPA | idem | CSV | Entrada | comprador, configurador |
| Folha | `folhas_pagamento` + itens + proventos | CSV | — | rh, configurador |

### 4.3 Motor C (2)

| Recurso | Tabela | Chave natural | Ator(es) |
| :--- | :--- | :--- | :--- |
| `contas_pagar_legado` | `contas_pagar` | `(id_filial, id_pessoa, numero_parcela, total_parcelas, data_vencimento)` | configurador, contador, financeiro1 |
| `contas_receber_legado` | `contas_receber` | idem | configurador, contador, financeiro2 |

## 5. Formatos

| Motor | Formato | Encoding | Separador |
| :--- | :--- | :--- | :--- |
| A | CSV | UTF-8 (detecta Windows-1252) | `;` (detecta `,`/tab) |
| B (XML) | XML | UTF-8 | — |
| B (CSV) | CSV | UTF-8 (detecta Windows-1252) | `;` |
| C | CSV | UTF-8 (detecta Windows-1252) | `;` |

**Excel (.xlsx)** fica para fase 2 (T9.12).

## 6. Templates

Cada recurso tem **template CSV** para download na UI 12.6. Regras:
- UTF-8 (sem BOM).
- Separador `;` (padrão BR).
- Cabeçalho na 1ª linha.
- Linha vazia = ignorada.
- `#` no início = comentário.

**Exemplo (`centros_custo.csv`):**
```csv
nome;responsavel;ativo
Comercial;João;1
Operações;Maria;1
Administrativo;;1
```

**Exemplo (`pessoas.csv`):**
```csv
tipo;documento;nome;email;telefone;ativo;tag;categoria;data_nascimento;nome_fantasia;id_municipio;categoria_padrao;prazo_padrao_dias
PJ;12345678000199;ABC Ltda;abc@example.com;11999998888;1;Fornecedor;Insumos;;ABC;3550308;Insumos;30
PF;11122233344;João Silva;joao@example.com;11988887777;1;Cliente;Varejo;1990-01-01;;;;
```

## 7. Validação

### 7.1 Motor A (por linha)
1. Obrigatórios preenchidos.
2. Tipos (data, decimal, int, bool).
3. Unique (chave natural).
4. FK (se o template usar `codigo_banco`/`cnpj_filial`, resolve antes).
5. Regras específicas do recurso.

**Status da linha:** `aceita`, `aceita_com_aviso`, `rejeitada` (com motivo).

### 7.2 Motor B (por documento)
1. Estrutura mínima.
2. Cancelamento.
3. Duplicidade (chave).
4. Empresa no XML.
5. Filial (CNPJ → `id_filial`; aviso + escolha manual).
6. Período (`[T5]`; aviso + confirmação).
7. Dados faltantes: crítico → Erro; não crítico → Aviso.
8. Tipo (NF-e na pasta de NFS-e → redireciona).

**Status do documento:** `aceito`, `aceito_com_aviso`, `rejeitado`, `cancelado`, `duplicado`, `aguardando_confirmacao`.

### 7.3 Pré-validação em memória
Obrigatória (T9.5). Nada é gravado antes de o operador ver o `RelatorioCarga`.

### 7.4 Transação
Por linha (A) ou por documento (B) (T9.6). Uma linha/documento que falha não derruba as demais.

## 8. `RelatorioCarga`

**Value object** (não é tabela):

```php
final class RelatorioCarga
{
    /** @var LinhaCarga[] */
    public array $linhas;
    public function total(): int;
    public function aceitas(): int;
    public function avisos(): int;
    public function rejeitadas(): int;
}
```

**`LinhaCarga`:** `numeroLinha`/`numeroDocumento`, `status`, `motivo`, `idRegistro`, `avisos`.

**Persistência:** em `auditorias` (`acao = 'importacao'`, `tabela = 'importacoes'`, `dados_anteriores` = resumo, `dados_novos` = IDs, `justificativa` = "Carga inicial: <recurso> (<modo>)"). **Sem tabela nova** (T9.8).

## 9. UI 12.6

**Tela única**, 2 abas:
- **Importar cadastros** (motor A/C).
- **Importar documentos** (motor B).

Cada aba:
- Lista de recursos que o ator pode importar.
- Download do template.
- Upload do arquivo.
- Modo (só motor A).
- Pré-validação (em memória).
- Confirmação.
- `RelatorioCarga` pós-carga.
- (Motor B) link para revisão (D3).

## 10. Decisões (resumo)

| # | Decisão |
| :--- | :--- |
| 10.1 | Transversal (12.6); `config/importacoes.php` (hardcoded na fase 1). |
| 10.2 | CSV (motor A); UTF-8 com detecção; separador `;`. |
| 10.3 | XML para NF-e/NFS-e/CT-e; CSV para RPA/folha. |
| 10.4 | `filiais` **não** cria período. |
| 10.5 | `pessoas` unificada (Pessoa + filha + tag); `funcionarios` reaproveita. |
| 10.6 | Sem rateio de funcionário no template (fase 2). |
| 10.7 | `ativos` com `cnpj_filial` (resolve `cnpj → id_filial`). |
| 10.8 | `contas_bancarias` com `codigo_banco` (resolve `codigo → id_banco`). |
| 10.9 | Legado: `id_nota_fiscal = NULL` + `dados_extras.origem = 'legado'`; ator de origem = quem importou. |
| 10.10 | Menu **12.6**. |
| 10.11 | `pessoas_tags.tag` do funcionário = `'Funcionário'`. |
| 10.12 | `funcionarios.natureza` ∈ `{'Custo','Despesa Fixa'}`. |
| 10.13 | `RelatorioCarga` em `auditorias`; sem tabela nova. |

## 11. Fase 1 vs. fase 2

**Fase 1 (entra):** motor A (13), motor B (8), motor C (2), UI 12.6, `RelatorioCarga`, `DocumentoService`, síncrono, CSV/XML.

**Fase 2 (não entra agora):** fila (queue), Excel (.xlsx), parser NFS-e municipal, parser CT-e redespacho, mapeamento de colunas CSV, XML > 1.000 itens, `importacao_log` (tabela), configurável sem deploy, rateio de funcionário no template.

## 12. Fatiamento

| Sub-bloco | Escopo |
| :--- | :--- |
| 10b-0 | Documento (`16`) + decisões (✅) |
| 10b-1 | Motor A (piloto: `centros_custo`) |
| 10b-2 | Motor B (piloto: NF-e entrada) |
| 10b-3 | UI 12.6 |
| 10b-4 | NF-e saída |
| 10b-5 | NFS-e (tomada + prestada) |
| 10b-6 | CT-e (tomado + emitido) |
| 10b-7 | RPA |
| 10b-8 | Folha |
| 10b-9 | Cadastros em massa (12 restantes) |
| 10b-10 | Contas a pagar/receber legado |

## 13. Referências cruzadas

| Documento | O que referencia |
| :--- | :--- |
| `02_regras_transversais.md` | **T9** (importação como carga inicial). |
| `03_casos_de_uso.md` | C1–C8 (documento, operação); C9, C10, I6 (importação). |
| `07_atores_fluxo.md` | Atores, handoff (T8). |
| `08_ordens.md` | O1–O6 (documento). |
| `09_menu_numeracao.md` | **12.6**. |
| `16_modulo_importacoes.md` | Documento principal. |

---

# Versões

| 1.0 | 2026-11-06 | Criação da referência do módulo Importações (12.6). Catálogo de 23 recursos; motores A/B/C; formatos; templates; validação; `RelatorioCarga`; decisões; fase 1 vs. fase 2; fatiamento. |
```

---
