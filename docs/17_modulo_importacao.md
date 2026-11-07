---
documento: modulo_importacoes
versao: 1.0
data: 2026-11-06
proposito: Módulo Importações (12.6) — carga inicial de cadastros, documentos e legado; motores A/B/C; catálogo; formatos; validação; relatório; decisões; fase 1 vs. fase 2
depende_de: [01_visao_geral, 02_regras_transversais, 03_casos_de_uso, 07_atores_fluxo, 08_ordens, 09_menu_numeracao, 10_modelo_dados_fisico]
---

# Módulo Importações (12.6)

> **O que é este documento:** a **especificação funcional** do módulo Importações — o que é, quem usa, o que importa, como funciona, os formatos, os templates, as validações, os relatórios de carga e as decisões. **Não é changelog** (para isso, `git log docs/16_modulo_importacoes.md`).
>
> **Como usar:**
> - Antes de **implementar** qualquer recurso de importação: leia o catálogo (§4), o motor correspondente (§3), o formato (§5) e as decisões (§10).
> - Antes de **codar** a UI 12.6: leia §2 (transversalidade) e §8 (`RelatorioCarga`).
> - Ao **fechar um recurso**: atualize §4 (o que existe), §11 (fase 1 vs. fase 2) e §12 (fatiamento).
>
> **Regras transversais:** T5 (período), T6 (pendências), T7 (razão), T8 (handoff) — e a **T9** (nova, definida em `02_regras_transversais.md` v1.2).

---

## 1. Conceito

**Importação é carga inicial (one-shot), não operação contínua.** O módulo Importações existe para **popular o sistema** com dados que vêm de fora (planilhas, XMLs, sistemas legados) **antes** de a operação normal começar.

- **O que é:** um módulo **transversal** (item **12.6** do menu, bloco Administração) que oferece, a cada ator autorizado, os recursos de importação que ele pode executar.
- **O que não é:** não é a via principal de entrada de documentos (a via principal é C1–C8, com digitação/importação de XML **na operação**); não é operação contínua; não substitui o fluxo normal.
- **Quando usar:** na **implantação** (carga inicial), ou em **reimportações pontuais** (correção de carga, migração de dados).
- **Princípio norteador:** **"a carga inicial precisa ser visível"** — o operador precisa ver, **linha a linha / documento a documento**, o que entrou, o que não entrou e por quê. Sem isso, a carga é caixa-preta.

**Diferença em relação ao C1–C8:**
- **C1–C8** (operação): o operador importa **1 documento por vez** (ou um lote pequeno) e o sistema **processa na hora** (classifica, calcula, gera contas, gera ordens). O fluxo é o **T8** (handoff).
- **12.6** (carga inicial): o operador importa **em lote** (arquivo CSV ou pasta de XMLs) e o sistema **pré-valida em memória** antes de gravar. O **motor B** reaproveita o processamento do C1–C8 (`store`/`confirmar` + `DocumentoService`); o **motor A** grava direto nas tabelas de cadastro.

---

## 2. Transversalidade

O módulo **12.6** é **transversal** (bloco 12 — Administração). **Não** pertence a um ator específico.

- **Visibilidade:** cada usuário vê **apenas os recursos que pode importar**, definidos pelo mapa `config/importacoes.php` (`recurso => atores[]`).
- **Atores autorizados (hardcoded na fase 1):** o mapa é **config** (não tabela). Mudar = deploy. Se um dia precisar ser configurável sem deploy, vira tabela (fase 2).
- **Quem vê o quê (resumo):**
  - **Configurador:** vê **todos** os recursos (é o "modo deus").
  - **Comprador:** NF-e entrada, NFS-e tomada, CT-e tomado, RPA, pessoas (fornecedores), produtos, pessoas (funcionários? — depende do mapa).
  - **Faturista:** NF-e saída, NFS-e prestada, CT-e emitido, pessoas (clientes).
  - **RH:** folha, funcionários, proventos/descontos.
  - **Contador:** centros de custo, plano de contas? (não — plano de contas não é recurso), ativos, contas a pagar/receber legado.
  - **Financeiro1/2:** contas a pagar/receber legado, contas bancárias.
  - **Administrador:** **não importa** (só consulta relatórios). O 12.6 não aparece para ele (a menos que ele acumule `configurador`).
- **Mapa `config/importacoes.php`:** cada recurso declara `rotulo`, `atores`, `motor`, `model`/`repository`, `chave_natural`, `colunas_obrigatorias`, `colunas_opcionais`, `modos`, `template`.
- **A regra "se tem `configurador`, não precisa de outras tags"** (`07 §1.2`) vale: o Configurador vê tudo, independentemente do mapa.

---

## 3. Motores

O módulo tem **3 motores** (dois deles compartilham a UI e o `RelatorioCarga`; o terceiro é um caso especial do primeiro).

### 3.1 Motor A — Cadastro (CSV)

**O que importa:** registros de **cadastro** (uma linha = um registro).

**Recursos (13):** `centros_custo`, `condicoes_pagamento`, `formas_pagamento`, `tipos_cliente`, `tipos_fornecedor`, `proventos_descontos`, `contas_bancarias`, `filiais`, `ativos`, `pessoas`, `funcionarios`, `produtos`, `servicos`.

**Como funciona:**
1. Upload do CSV.
2. Detecção de encoding (UTF-8 / Windows-1252) e separador (`;` / `,` / tab).
3. Cabeçalho conferido contra `colunasObrigatorias` + `colunasOpcionais`; coluna faltando → **rejeita o arquivo inteiro**; coluna extra → **aviso**.
4. **Pré-validação em memória** (sem gravar): para cada linha, valida obrigatórios, tipos, unique, FK, regras específicas do recurso.
5. **Relatório de pré-validação** com `RelatorioCarga` (aceitas/avisos/rejeitadas por linha).
6. Operador confirma → **grava em transação por linha** (uma linha que falha não derruba as demais).
7. **Relatório pós-carga** (mesmo `RelatorioCarga` + IDs criados).
8. Registro em `auditorias`.

**Modos:** `inserir` (falha se existe — default), `atualizar` (falha se não existe), `upsert` (insere/atualiza por chave natural).

**Recursos compostos** (criam 2–3 tabelas por linha):
- `pessoas` — `pessoas` + `pessoas_fisicas`/`pessoas_juridicas` + `pessoas_tags`.
- `funcionarios` — `pessoas` (PF) + `pessoas_tags('Funcionário')` + `funcionarios`.
- `produtos` — `produtos_servicos` (`tipo='P'`) + `produtos`.
- `servicos` — `produtos_servicos` (`tipo='S'`) + `servicos`.

**Recursos com resolução de FK por código** (não por `id`):
- `contas_bancarias` — template usa `codigo_banco`; importador resolve `codigo → id_banco`.
- `ativos` — template usa `cnpj_filial`; importador resolve `cnpj → id_filial` (valida que a filial é da empresa do contexto).
- `filiais` — **não cria período** (decisão §10.4).

**O que o motor A NÃO faz:**
- Não gera lançamento (T7).
- Não gera ordem (T8).
- Não gera pendência (T6) — exceto se o recurso for especial (legado).
- Não dispara handoff.

### 3.2 Motor B — Documento (XML/CSV)

**O que importa:** **documentos fiscais** (um arquivo = um documento; processamento passa por T5/T6/T7/T8).

**Recursos (8):** NF-e entrada, NF-e saída, NFS-e tomada, NFS-e prestada, CT-e tomado, CT-e emitido, RPA, folha de pagamento.

**Como funciona:**
1. Upload do arquivo (XML para NF-e/NFS-e/CT-e; CSV para RPA/folha).
2. **Parser** específico (`NfeParser`, `NfseParser`, `CteParser`, `RpaParser`, `FolhaParser`).
3. **Pré-validação** (`ValidadorDocumento`): estrutura mínima, cancelamento, duplicidade (chave), empresa no XML, filial resolvida (CNPJ → `id_filial`), período (`[T5]`), dados faltantes (crítico → Erro; não crítico → Aviso).
4. **Relatório de pré-validação** com `RelatorioCarga` (aceitos/avisos/rejeitados por documento).
5. Operador confirma → **grava em transação por documento**.
6. Para cada documento aceito:
   - **`store`** do `NotaFiscalApiController`/`NotaFiscalSaidaApiController` (reaproveitado) — cria `notas_fiscais` + `notas_fiscais_itens` + `notas_fiscais_impostos`. Resolve período, chave, `direcao`, `origem='Importacao'`, `status_importacao='Importado'`.
   - **`DocumentoService::processar($nota)`** (novo, chamado por dentro) — dentro da mesma transação:
     - `ClassificadorService` (D1) — sugere conta/centro de custo/contrapartida; gera justificativa (D2); marca `status_classificacao`.
     - `CalculadoraImposto` (E1/E2) — valida/cruza impostos do XML com os parâmetros; gera `razoes_impostos` (O30).
     - `ContaPagarService`/`ContaReceberService` (F1/F2) — gera contas (parcelas, vencimentos, retenções).
     - `TarefaService` (T8) — cria `tarefas` (O1–O6) para o ator de destino; cria `documento_encadeado`.
     - `PendenciaService` (T6) — cria `pendencias` + `tarefas` (O9, O11) quando aplicável.
     - `AuditoriaService` — registra em `auditorias`.
7. **Relatório pós-carga** (`RelatorioCarga` + IDs criados + link para revisão D3).
8. Registro em `auditorias`.

**O que o motor B reaproveita** (não reescreve):
- `NotaFiscalApiController::store`/`confirmar` (entrada) e `NotaFiscalSaidaApiController::store`/`confirmar` (saída).
- Validação de período (`PeriodoRepository::porFilialEMesAno`).
- Validação de chave única (`NotaFiscalRepository::porChave`).
- Transação (`DB::transaction`).
- `forceFill(['deleted_by' => ...])` no `destroy`.

**O que o motor B acrescenta** (não existe hoje):
- Parsers (`NfeParser`, etc.).
- `ValidadorDocumento` (pré-validação em memória; o `store` valida depois).
- `DocumentoService` (D1, E1/E2, F1/F2, T6, T8, O30) — **não** existe.
- `RelatorioCarga` — **não** existe.
- **DocumentoService é o coração novo.** Sem ele, o `store` cria a nota, mas **não** classifica, **não** calcula, **não** gera contas, **não** gera ordens, **não** gera pendências.

**O que o motor B NÃO faz (fase 1):**
- Não usa fila (queue) — síncrono.
- Não tem parser de NFS-e com layouts municipais específicos (ABRASF + fallback genérico).
- Não tem parser de CT-e com redespacho/subcontratação.
- Não tem mapeamento de colunas CSV.
- Não processa XML > 1.000 itens (fatiar).

### 3.3 Motor C — Legado (CSV, dentro do motor A)

**O que importa:** `contas_pagar` e `contas_receber` **sem nota fiscal de origem** (dados que vêm de sistema legado).

**Recursos (2):** `contas_pagar_legado`, `contas_receber_legado`.

**Como funciona:** igual ao motor A (CSV, uma linha = uma conta), com **duas regras específicas**:
- `id_nota_fiscal = NULL` (o schema permite — `SHOW COLUMNS` confirma).
- `dados_extras.origem = 'legado'` (não cria coluna nova; usa `dados_extras`).

**Ator de origem do handoff:** **quem importou** (o `id_usuario` da sessão). A auditoria registra "importado do legado por X".

**Lançamento avulso:** o `DocumentoService` cria `lancamentos` com `id_nota_fiscal = NULL`, `id_nota_fiscal_item = NULL` (o schema permite — `SHOW COLUMNS` confirma).

**Geração de conta:** `ContaPagarService`/`ContaReceberService` **não** é chamado (a conta **é** o que está sendo importado). O `DocumentoService` só cria o lançamento avulso + razão (se aplicável).

**O que o motor C NÃO faz:**
- Não cria `notas_fiscais` (não há nota).
- Não dispara handoff de "Comprador → Financeiro1" (o ator de origem é **quem importou**).

---

## 4. Catálogo de recursos

### 4.1 Motor A — Cadastro (13 recursos)

| Recurso | Tabela(s) | Chave natural | Ator(es) | Observação |
| :--- | :--- | :--- | :--- | :--- |
| `centros_custo` | `centros_custo` | `(id_empresa, nome)` | configurador, contador | **Piloto do 10b-1.** |
| `condicoes_pagamento` | `condicoes_pagamento` | `(id_empresa, descricao)` | configurador | |
| `formas_pagamento` | `formas_pagamento` | `(id_empresa, descricao)` | configurador | |
| `tipos_cliente` | `tipos_cliente` | `(id_empresa, descricao)` | configurador | |
| `tipos_fornecedor` | `tipos_fornecedor` | `(id_empresa, descricao)` | configurador | |
| `proventos_descontos` | `proventos_descontos` | `(id_empresa, codigo)` | configurador, rh | |
| `contas_bancarias` | `contas_bancarias` | `(id_filial, id_banco, agencia, numero)` | configurador, financeiro1, financeiro2 | Template usa `codigo_banco`. |
| `filiais` | `filiais` | `(id_empresa, cnpj)` | configurador | **Não cria período** (decisão §10.4). |
| `ativos` | `ativos` | `(id_filial, descricao, data_aquisicao)` | configurador, contador | Template usa `cnpj_filial`. |
| `pessoas` | `pessoas` + `pessoas_fisicas`/`pessoas_juridicas` + `pessoas_tags` | `(id_empresa, documento)` | comprador, faturista, configurador | Template unificado (`tipo`, `tag`, campos PF/PJ). |
| `funcionarios` | `pessoas` (PF) + `pessoas_tags('Funcionário')` + `funcionarios` | `(pessoas.id_empresa, documento)` | rh, configurador | Reaproveita `pessoas`. |
| `produtos` | `produtos_servicos` (`tipo='P'`) + `produtos` | `(id_empresa, codigo_interno)` ou `(id_empresa, descricao)` | comprador, configurador | Reaproveita o 10a. |
| `servicos` | `produtos_servicos` (`tipo='S'`) + `servicos` | `(id_empresa, codigo_interno)` ou `(id_empresa, descricao)` | comprador, faturista, configurador | Reaproveita o 10a. |

### 4.2 Motor B — Documento (8 recursos)

| Recurso | Tabela(s) | Formato | Direção | Ator(es) | Ordem gerada |
| :--- | :--- | :--- | :--- | :--- | :--- |
| NF-e entrada | `notas_fiscais` + itens + impostos | XML | Entrada | comprador, configurador | O1 |
| NF-e saída | idem | XML | Saída | faturista, configurador | O2 |
| NFS-e tomada | idem | XML | Entrada | comprador, configurador | O3 |
| NFS-e prestada | idem | XML | Saída | faturista, configurador | O4 |
| CT-e tomado | idem + vínculos | XML | Entrada | comprador, configurador | O3 |
| CT-e emitido | idem + vínculos | XML | Saída | faturista, configurador | O4 |
| RPA | idem | CSV | Entrada | comprador, configurador | O3 |
| Folha | `folhas_pagamento` + itens + proventos | CSV | — | rh, configurador | O6 |

### 4.3 Motor C — Legado (2 recursos)

| Recurso | Tabela | Chave natural | Ator(es) | Observação |
| :--- | :--- | :--- | :--- | :--- |
| `contas_pagar_legado` | `contas_pagar` | `(id_filial, id_pessoa, numero_parcela, total_parcelas, data_vencimento)` | configurador, contador, financeiro1 | `id_nota_fiscal = NULL`, `dados_extras.origem = 'legado'`. |
| `contas_receber_legado` | `contas_receber` | idem | configurador, contador, financeiro2 | idem. |

### 4.4 Total

**13 (A) + 8 (B) + 2 (C) = 23 recursos de importação.**

---

## 5. Formatos

| Motor | Formato | Encoding | Separador | Observação |
| :--- | :--- | :--- | :--- | :--- |
| A — Cadastro | **CSV** | UTF-8 (padrão); detecta Windows-1252 e converte | `;` (padrão BR); detecta `,` / tab | Uma linha = um registro; cabeçalho na 1ª linha; `#` no início = comentário. |
| B — Documento (XML) | **XML** | UTF-8 | — | NF-e, NFS-e, CT-e. Estrutura nativa (não converter para CSV). |
| B — Documento (CSV) | **CSV** | UTF-8 (padrão); detecta Windows-1252 | `;` (padrão BR) | RPA, folha. |
| C — Legado | **CSV** | UTF-8 (padrão); detecta Windows-1252 | `;` (padrão BR) | `contas_pagar`/`contas_receber` sem nota. |

**Por que CSV e não Excel:** CSV é universal (qualquer sistema exporta); Excel exige dependência (`phpoffice/phpspreadsheet`) e aumenta o escopo. O template é `.csv`, o operador preenche no Excel e salva como CSV. **Excel (.xlsx) fica para fase 2.**

**Por que XML e não CSV para NF-e/NFS-e/CT-e:** o XML é o formato nativo (e o `03` C1/C2/C3 pede XML); converter para CSV perderia a estrutura fiscal (CFOP/NCM/CST/ICMS/IPI/PIS/COFINS, itens com impostos por item, totais, referências). **RPA e folha não têm XML nativo; CSV é o caminho.**

---

## 6. Templates

Cada recurso tem um **template CSV** disponível para download na UI 12.6.

**Regras do template:**
- UTF-8 (sem BOM) — o importador detecta, mas o padrão é UTF-8.
- Separador `;` (padrão BR).
- Cabeçalho na 1ª linha.
- Linha vazia = ignorada.
- Comentário = `#` no início da linha (ignorado).
- **Colunas obrigatórias** e **opcionais** definidas em `config/importacoes.php`.

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

**Exemplo (`ativos.csv`):**
```csv
cnpj_filial;descricao;data_aquisicao;valor_original;valor_residual;vida_util_meses;metodo_depreciacao;mes_inicial_depreciacao;centro_custo;destino;status;ativo
12345678000199;Computador;2026-01-15;5000.00;500.00;60;linear;2026-02;Comercial;Despesa Fixa;Em uso;1
```

**Exemplo (`contas_pagar_legado.csv`):**
```csv
cnpj_filial;documento_pessoa;numero_parcela;total_parcelas;valor;data_emissao;data_vencimento;data_pagamento;valor_pago;juros;multa;desconto;status;codigo_banco;agencia;numero_conta;forma_pagamento;condicao_pagamento
12345678000199;12345678000199;1;3;316.67;2026-10-01;2026-11-15;;0.00;0.00;0.00;0.00;Aberta;341;1234;56789;boleto;30 dias
```

**Download na UI:** botão "Baixar template" em cada recurso.

---

## 7. Validação

### 7.1 Motor A — por linha

**Ordem de validação (por linha):**
1. **Obrigatórios preenchidos** → rejeita a linha.
2. **Tipos convertidos** (data, decimal, int, bool) → rejeita se inválido.
3. **Unique** (chave natural ou `documento`/`cnpj` no escopo da empresa) → rejeita se duplicado.
4. **FK** (se o template usar `codigo_banco`/`cnpj_filial`, resolve antes) → rejeita se não existe.
5. **Regras específicas do recurso** (ex: `filial.cnpj` UNIQUE global; `pessoa.documento` UNIQUE por empresa; `funcionario.natureza` ∈ `{'Custo','Despesa Fixa'}`) → rejeita se inválido.
6. **Modo** — `inserir` (falha se existe), `atualizar` (falha se não existe), `upsert` (insere/atualiza).

**Transação por linha:** se falhar, a linha é rejeitada, as demais continuam. **Não** rollback global (carga inicial precisa do relatório completo).

**Status da linha:** `aceita`, `aceita_com_aviso`, `rejeitada` (com motivo).

### 7.2 Motor B — por documento

**Ordem de validação (por documento):**
1. **Estrutura mínima** do XML/CSV → rejeita se inválido.
2. **Cancelamento** (`cStat = 101`/`135`/`155`, ou `motivo_cancelamento`) → registra como histórico, não processa.
3. **Duplicidade** (`porChave`) → rejeita.
4. **Empresa no XML** (CNPJ da empresa/filial) → rejeita se não aparece.
5. **Filial** (resolve CNPJ → `id_filial`) → **aviso + escolha manual** (não rejeita).
6. **Período** (`data_emissao` → `mesAno` → `porFilialEMesAno`; se não aberto → **aviso + confirmação** `[T5.3]`, não rejeita).
7. **Dados faltantes críticos** (valor total ausente) → **Erro** `[T6]`.
8. **Dados faltantes não críticos** (NCM ausente) → **Aviso** `[T6]`.
9. **Tipo** — se NF-e na pasta de NFS-e, redireciona (C1 FA4, C2, C3).

**Transação por documento:** se falhar, o documento é rejeitado, os demais continuam.

**Status do documento:** `aceito`, `aceito_com_aviso`, `rejeitado` (com motivo), `cancelado`, `duplicado`, `aguardando_confirmacao`.

### 7.3 Pré-validação em memória

**Antes de gravar qualquer coisa**, o módulo:
- Lê o CSV/XML.
- Valida cada linha/documento.
- Monta o `RelatorioCarga`.
- Exibe na tela (pré-validação).

O operador **só confirma** depois de ver o relatório. **Nada é gravado na pré-validação.**

### 7.4 Confirmação

**Depois da confirmação:**
- Motor A: grava em transação **por linha**.
- Motor B: grava em transação **por documento** (reaproveita `store`/`confirmar` + `DocumentoService`).
- Relatório pós-carga com IDs criados.
- Registro em `auditorias`.

---

## 8. `RelatorioCarga`

**Value object** (em documento) que representa o resultado da importação (pré e pós).

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

**`LinhaCarga`:** `numeroLinha` (ou `numeroDocumento`), `status` (`aceita`, `aceita_com_aviso`, `rejeitada`), `motivo` (quando rejeitada), `idRegistro` (quando criado/atualizado), `avisos` (lista).

**Persistência:** o `RelatorioCarga` **não** é uma tabela nova. Ele é:
- **Exibido na tela** (pré e pós-carga).
- **Persistido em `auditorias`** — `dados_anteriores` = resumo da carga (recurso, modo, total, aceitas, avisos, rejeitadas); `dados_novos` = IDs criados (lista). `acao = 'importacao'`, `tabela = 'importacoes'`, `id_registro = null`, `justificativa = 'Carga inicial: <recurso> (<modo>)'`.

**Por que não criar tabela nova:** a carga inicial é one-shot; o `auditorias` já registra (quem, quando, o quê) e tem `dados_anteriores`/`dados_novos` para o resumo. Uma tabela `importacao_log` seria duplicação (fase 2, se precisar reprocessar).

---

## 9. Reaproveitamento

### 9.1 Motor B — o que já existe

O `NotaFiscalApiController` (entrada) e o `NotaFiscalSaidaApiController` (saída) **já fazem**:
- `store` — valida chave única, resolve `mesAno` pela `data_emissao`, busca `periodo` da filial, valida `[T5]`, seta `id_filial`, `id_periodo`, `direcao`, `origem='Propria'`, `status_importacao='Importado'`, chama `criarComItens` (transação).
- `update` — valida status `Importado` + período aberto + chave única, chama `atualizarComItens`.
- `destroy` — valida status + `forceFill(['deleted_by' => ...])` + `delete()`.
- `salvarRascunho` — cria com `dados_extras.rascunho = true`.
- `confirmar` — exige rascunho e seta `rascunho = false`.
- `validar` — exige `itens` com `impostos` (opcional por item).

### 9.2 Motor B — o que **falta** (e o `DocumentoService` cobre)

- **Classificação (D1)** — não existe `ClassificadorService`.
- **Cálculo de impostos (E1/E2)** — os impostos vêm do payload, não são calculados.
- **Geração de contas (F1/F2)** — o `store` só cria a nota.
- **Razão de impostos (T7/O30)** — não gera.
- **Pendências (T6/O31)** — não gera.
- **Handoff (T8/O1–O6)** — não gera (não há `TarefaRepository` nem `tarefa` populada).
- **Documento encadeado (T8.1)** — não gera.
- **Custo de produto (O29)** — não calcula.

**`DocumentoService::processar($nota)`** (novo) faz tudo isso, **dentro da mesma transação** do `store`. Não reescreve o `store`; é chamado por dentro.

### 9.3 Motor C — conta legada

- **`store` de `contas_pagar`/`contas_receber`** — o `ContaPagarApiController`/`ContaReceberApiController` **não** têm `store` hoje (só `index`/`show`/`baixar`/`estornar`). O motor C **cria** a conta via `ContaPagarService`/`ContaReceberService` (a criar) — ou via `Model::create` direto no importador (com `DocumentoService` criando o lançamento avulso).
- **Lançamento avulso** — `lancamentos` aceita `id_nota_fiscal = NULL`, `id_nota_fiscal_item = NULL` (o schema permite). `DocumentoService` cria.
- **Sem migration** (confirmado).

---

## 10. Decisões

### 10.1 Transversal
O módulo 12.6 é **transversal** (bloco 12). Cada ator vê os recursos que pode importar, via `config/importacoes.php` (hardcoded na fase 1). O Configurador vê tudo.

### 10.2 CSV
Motor A usa **CSV** (universal). Excel (.xlsx) fica para fase 2. Encoding UTF-8 (detecta Windows-1252 e converte). Separador `;` (padrão BR; detecta `,`/tab).

### 10.3 XML + CSV
Motor B usa **XML** para NF-e/NFS-e/CT-e (formato nativo) e **CSV** para RPA/folha (sem XML nativo).

### 10.4 `filiais` não cria período
Importar filial **cria a filial, mas NÃO abre período** (decisão sensível; o Configurador abre manualmente). Se a filial já tem período, o importador **falha na linha** com aviso claro.

### 10.5 Pessoa unificada
`pessoas` (motor A) importa **Pessoa unificada** (`tipo` PF/PJ + filha `pessoas_fisicas`/`pessoas_juridicas` + tag). Template unificado. `funcionarios` reaproveita `pessoas` (PF) + tag `'Funcionário'` + `funcionarios`.

### 10.6 Sem rateio no template
`funcionarios` **não** inclui rateio por centro de custo no template (fase 2). Só `id_centro_custo` principal em `funcionarios`. Rateio é edição manual.

### 10.7 `ativos` com `cnpj_filial`
Template de `ativos` usa `cnpj_filial` (não `id_filial`); importador resolve `cnpj → id_filial` e valida que a filial é da empresa do contexto. Permite carga multi-filial.

### 10.8 `contas_bancarias` com `codigo_banco`
Template usa `codigo_banco` (não `id_banco`); importador resolve `codigo → id_banco` via `BancoRepository::porCodigo()`.

### 10.9 Legado com `NULL` + `dados_extras`
Contas legadas: `id_nota_fiscal = NULL`, `dados_extras.origem = 'legado'`. Ator de origem do handoff = **quem importou**. Sem migration.

### 10.10 Menu 12.6
O módulo entra como **12.6** (bloco 12 — Administração), transversal. O `09` precisa adicionar 12.6 (hoje tem 12.1–12.5).

### 10.11 `pessoas_tags.tag` do funcionário
`'Funcionário'` (o `07 §1.1` usa essa string; o `10a-2` usa `'Cliente'`/`'Fornecedor'`).

### 10.12 `funcionarios.natureza`
`'Custo'` / `'Despesa Fixa'` (o DDL do `07 §8.1` usa; o `SHOW COLUMNS` não mostra CHECK).

### 10.13 `RelatorioCarga` persistido em `auditorias`
O `RelatorioCarga` é exibido na tela e **persistido em `auditorias`** (`dados_anteriores` = resumo; `dados_novos` = IDs criados; `acao = 'importacao'`; `tabela = 'importacoes'`; `justificativa` = "Carga inicial: <recurso> (<modo>)"). **Sem tabela nova.**

---

## 11. Fase 1 vs. fase 2

### 11.1 Fase 1 (entra)

- Motor A: 13 recursos de cadastro (CSV).
- Motor B: 8 recursos de documento (XML para NF-e/NFS-e/CT-e; CSV para RPA/folha).
- Motor C: 2 recursos de legado (CSV).
- UI 12.6 (2 abas: cadastro/documento; lista por ator; template; upload; pré-validação; confirmação; relatório).
- `RelatorioCarga` (pré e pós-carga; persistido em `auditorias`).
- `DocumentoService` (D1, E1/E2, F1/F2, T6, T8, O30).
- `config/importacoes.php` (hardcoded).
- Síncrono (sem fila).
- CSV (motor A), XML (NF-e/NFS-e/CT-e), CSV (RPA/folha).

### 11.2 Fase 2 (não entra agora)

- **Fila (queue)** para lote grande.
- **Excel (.xlsx)** como formato de cadastro.
- **Parser de NFS-e com layouts municipais específicos** (ABRASF + fallback na fase 1).
- **Parser de CT-e com redespacho/subcontratação**.
- **Mapeamento de colunas CSV** (o template é fixo).
- **Importação de XML > 1.000 itens** (fatiar).
- **Tabela `importacao_log`** (persistir o relatório em tabela própria).
- **Configurável sem deploy** (tabela `importacao_recurso` em vez de `config/importacoes.php`).
- **Rateio de funcionário no template**.

---

## 12. Fatiamento

| Sub-bloco | Escopo | Entregável |
| :--- | :--- | :--- |
| **10b-0** | **Este documento** + decisões 3.1–3.10 + D-A/D-B/D-C | ✅ (documento) |
| **10b-1** | Motor A (contrato, template, validação, relatório, transação). **Piloto: `centros_custo`.** | Base + 1 recurso |
| **10b-2** | Motor B (contrato, pré-validação, `DocumentoService`, relatório). **Piloto: NF-e entrada (XML).** | Base + 1 recurso |
| **10b-3** | **UI 12.6** (2 abas; lista por ator; template; upload; pré-validação; confirmação; relatório). | Tela |
| **10b-4** | NF-e saída (reaproveita 10b-2). | 1 recurso |
| **10b-5** | NFS-e (tomada + prestada). | 2 recursos |
| **10b-6** | CT-e (tomado + emitido) + vínculo NF-e. | 2 recursos |
| **10b-7** | RPA (CSV). | 1 recurso |
| **10b-8** | Folha (CSV). | 1 recurso |
| **10b-9** | Cadastros em massa (12 restantes do motor A), um por vez. | 12 recursos |
| **10b-10** | Contas a pagar/receber legado (motor C, dentro do A). | 2 recursos |

**Regra:** 10b-1 e 10b-2 são pré-requisitos. 10b-3 (UI) pode vir depois do 10b-2 (para a UI mostrar os 2 motores). O resto é independente.

---

## 13. Referências cruzadas

| Documento | O que referencia |
| :--- | :--- |
| `01_visao_geral.md` | Contexto, R1–R3, fase 1/2, princípio "não me faça pensar". |
| `02_regras_transversais.md` | **T9** (nova, v1.2) — importação como carga inicial; motor A não passa por T5–T8; motor B/C passam. |
| `03_casos_de_uso.md` | C1–C8 (documento, operação); **C9, C10, I6** (novos, v2.6) — cadastro em massa, legado, UI. |
| `07_atores_fluxo.md` | Atores, handoff (T8), caixa de entrada/saída. |
| `08_ordens.md` | O1–O6 (documento); O1–O6 não cobrem cadastro (motor A **não** gera ordem). |
| `09_menu_numeracao.md` | **12.6** (novo, v1.4) — Importações. |
| `10_modelo_dados_fisico.md` | DDL das tabelas usadas (não há DDL novo). |
| `15_implementacao.md` | Estado da implementação; §7 (padrões) quando o 10b-1 começar. |

---

## 14. O que **não** é este documento

- **Não é changelog** — histórico em `git log docs/16_modulo_importacoes.md`.
- **Não é DDL** — as tabelas são as existentes; não há tabela nova.
- **Não é código** — contratos, templates e validações são descritos em linguagem natural; a implementação (10b-1+) segue o §7 do `15_implementacao.md`.
- **Não é catálogo de casos de uso** — os casos de uso ficam no `03` (C1–C8, C9, C10, I6).
- **Não é catálogo de ordens** — as ordens ficam no `08` (O1–O6 para documento; motor A não gera ordem).

## O que este documento **fecha** e o que **abre**

**Fecha:**
- A definição do módulo (conceito, transversalidade, motores, catálogo, formatos, templates, validação, relatório, decisões, fase 1 vs. fase 2, fatiamento).
- A base para os próximos documentos (`02` T9, `03` C9/C10/I6, `09` 12.6, `agente`, `referência`, `06`/`15` P152–P154).

**Abre (para os próximos documentos):**
- **`02`** — T9 (regra transversal).
- **`03`** — C9 (cadastro em massa), C10 (legado), I6 (UI 12.6).
- **`09`** — 12.6.
- **`agente-importacoes.md`** — agente que opera o módulo.
- **`referencias/importacoes.md`** — referência para o Skill.
- **`06`/`15`** — P152–P154 (fase 2 / dúvidas).

**Não abre:**
- Nenhuma migration.
- Nenhuma tabela nova.
- Nenhum código.

---

