---
documento: implementacao
versao: 2.2
data: 2026-11-04
proposito: Estado atual da implementação — status, padrões consolidados, pendências abertas, próximos passos
depende_de: [00_indice, 01_visao_geral, 04_modelo_de_dados, 07_atores_fluxo, 09_menu_numeracao, 10_modelo_dados_fisico, 11_wireframe, 12_tela_inicial]
---

# Implementação — Estado Atual

> **O que é este documento:** o **estado atual** do projeto — o que existe, o que falta, os padrões consolidados, e as pendências abertas. **Não é changelog** (para isso, use `git log docs/15_implementacao.md`).
>
> **Como usar:**
> - Ao **retomar o projeto**, leia §1 (status) e §5 (pendências abertas).
> - Ao **codar tela nova**, leia **§7 (padrões consolidados)** antes de começar. É a fonte da verdade.
> - Ao **fechar um bloco**, atualize §1, §3, §5, §7 e **remova** o que ficou obsoleto.
>
> **Histórico detalhado:** `git log --follow docs/15_implementacao.md`. O changelog versão-a-versão **saiu** deste arquivo na v2.0.

---

## 1. Status atual

| Bloco | O que entrega | Status |
| :--- | :--- | :--- |
| **0–8** | Setup, domínios, auth, menu, Tela Inicial, Meu Trabalho, troca de filial | ✅ Concluído |
| **9.1a** | Centros de Custo (2.3) + Usuários e Atores (2.4) | ✅ Concluído |
| **9.1b** | Produtos (2.5), Serviços (2.6), Ativos (2.7), OSI (2.8) + correções | ✅ **Concluído** |
| **9.1c** | Refatoração de repositórios (R2) + coluna `ativo` em `ativos` + OSI ≡ handoff | ✅ **Concluído** |
| **9.2a** | Plano de Contas (4.2) — CRUD com árvore | ✅ **Concluído** |
| **9.2** | Contador (4.1–4.11) | ⏳ **Próximo** |
| **10a-1** | Tabelas basais Compras/Vendas (5.1/6.1) | ✅ **Concluído** |
| **10a-2** | Fornecedores (5.2) + Clientes (6.2) | ✅ **Concluído** |
| **10b** | 6.3 Digitar Notas de Saída | ✅ **Concluído** |
| **11** | Administrador (3.x) | ⏳ Pendente |
| **12** | Auditor (11.x) + Administração (12.x) | ⏳ Pendente |
| **13** | Handoff + serviços de negócio | ⏳ Pendente |

**Números atuais:** 63 tabelas, 63 models, **42 repositórios** (`PessoaRepository` ganhou 4 métodos no 10a-2), 6 services, **12 views de cadastro** (centros-custo, usuários, produtos, serviços, ativos, OSI, plano-contas, tabelas-fiscais, config-contabeis, regras, fornecedores, clientes) + 3 de tarefas + Tela Inicial, **139 testes verdes**, lint de SQL cru zerado.

**Decisão de fatiamento (histórica):** o antigo "Bloco 7 — Auth + API + telas" foi fatiado em 7–13 (escopo real: 71 telas). Cada sub-bloco é testável isoladamente.

---

## 2. Ambiente e como rodar

| Item | Versão/Decisão |
| :--- | :--- |
| PHP | 8.5.4 |
| Laravel | 12.x |
| Banco | MariaDB (`DB_CONNECTION=mariadb`) |
| Testes | Pest 3 (PHPUnit 11) — `RefreshDatabase` global em `Feature` |
| Lint | Pint (preset `laravel`) + `scripts/check-raw-sql.sh` |
| Frontend | Blade casca + JS `fetch` + ApiController JSON |
| Assets | `public/assets/` (copiados do wireframe) |

### Como rodar (do zero)

```bash
# 1. Migrations (63 tabelas + 3 views)
php artisan migrate

# 2. Domínios
php artisan db:seed --class=UfSeeder
php artisan db:seed --class=BancoSeeder
php artisan db:seed --class=CstSeeder
php artisan db:seed --class=TipoDocumentoSeeder
php artisan db:seed --class=AtorFuncionalSeeder

# 3. Domínios grandes (database/data/)
php artisan importar:municipios
php artisan importar:cnae
php artisan importar:ncm
php artisan importar:cfop
php artisan importar:lc116

# 4. Empresa de teste (ID=1, 2 filiais) + Empresa 2 (isolamento)
php artisan db:seed --class=EmpresaFilialSeeder

# 5. Configuração
php artisan db:seed --class=PlanoContaSeeder
php artisan db:seed --class=CentroCustoSeeder
php artisan db:seed --class=AreaNegocioSeeder
php artisan db:seed --class=FormaPagamentoSeeder
php artisan db:seed --class=CondicaoPagamentoSeeder
php artisan db:seed --class=PeriodoSeeder
php artisan db:seed --class=UsuarioSeeder
php artisan db:seed --class=MenuItemSeeder

# 6. Lint + testes
composer lint
php artisan test

# 7. Servidor
php artisan serve
```

**Limpeza de cache (após editar Blade):** `php artisan view:clear && php artisan route:clear && php artisan config:clear && php artisan cache:clear`.

**Hard reload no navegador após editar JS:** `Ctrl+Shift+R` (senão o navegador usa o JS em cache).

---

## 3. O que existe hoje

### 3.1 Infraestrutura
- **Trait `BelongsToTenant`** (Grupo A/F) + **`ParametroFiscal`** com global scope híbrido (Grupo H).
- **`TenantContext`** — 4-tupla (`id_empresa`, `id_filial`, `id_usuario`, `id_ator_funcional`), **singleton**. `getId()` = `id_empresa`; `getFilialId()`; `getUsuarioId()`.
- **`SetTenantContext`** (auth+tenant) e **`SetTenantContextDev`** (local/testing).
- **`BaseRepository`** + **40 repositórios** (A/F/C/H/U + `AtorFuncionalRepository`, `MenuItemRepository`, `DashboardRepository`, `AuditoriaRepository`).
- **3 views SQL** (`vw_saldo_contas_bancarias`, `vw_posicao_caixa`, `vw_caixa_entrada`).

### 3.2 Auth + Menu
- **`LoginController`** — `Auth::attempt` com `senha_hash` (D14/D27).
- **`MenuService`** — menu por ator (união de todos os atores da filial; `configurador` vê tudo).
- **`menu.js`** — Ctrl+K, badge, navegação por `window.location.href`.
- **`layouts/auth.blade.php`** (limpo, sem sidebar/topbar) e **`layouts/app.blade.php`** (composer sidebar/topbar + `@stack('scripts')`).

### 3.3 Meu Trabalho (Bloco 8)
- **`TelaInicialController`** + **`TelaInicialService`** (10 variantes por ator + `universal`, configurador vence).
- **`TarefaController`** + **`TarefaService`** (entrada/saída/histórico) — `TarefaRepository::contarPendentesDoAtor()`, `caixaSaidaDoAtor()`, `historicoDoAtor()`.
- **`FilialContextController`** — troca de filial (`POST /contexto/filial`), `<select>` no topbar (só se ≥2 filiais).
- **`layouts` + partials** da Tela Inicial (10 + universal + 4 sub-partials).

### 3.4 Cadastros (Bloco 9.1a)
- **2.3 Centros de Custo:**
  - `CentroCustoController` (Web: `index`/`create`/`edit`).
  - `CentroCustoApiController` (API: CRUD via `apiResource`).
  - Views `telas/centros-custo/{index,form}.blade.php`.
  - `public/assets/js/centros-custo-{list,form}.js`.
  - **Lista com Editar + Excluir** (D72).
- **2.4 Usuários e Atores:**
  - `UsuarioController` (Web: `index`/`create`/`edit`/`atores`) — **P136 fechada** (sem `store`/`update`/`sincronizarAtores`).
  - `UsuarioApiController` (API: CRUD via `apiResource`) — **D71/D75/D77** (filtro manual por `id_empresa`, `deleted_by` no `destroy`).
  - `UsuarioAtorApiController` (API: `index`/`sincronizar`/`destroy`).
  - Views `telas/usuarios/{index,form,atores}.blade.php`.
  - `public/assets/js/usuarios-{list,form,atores}.js`.
  - **Lista com Editar + Atores + Excluir** (D72).
  - **`AtorFuncionalRepository::todos()`**.

### 3.5 Produtos (2.5) — Bloco 9.1b
- `ProdutoController` (Web: `index`/`create`/`edit`; usa `NcmRepository` + `ProdutoServicoRepository`).
- `ProdutoApiController` (API: `index` filtra `tipo='P'`, `store` cria `ProdutoServico` + `Produto` em transação, `show`/`update`/`destroy` via `ProdutoServicoRepository` — **R2/D71**; `deleted_by` no `destroy` — **D75**).
- Views `telas/produtos/{index,form}.blade.php` (estrutura D73/D74).
- `public/assets/js/produtos-{list,form}.js` (lista com Editar + Excluir — **D72**).
- `tests/Feature/ProdutoApiTest.php` (6 testes, incluindo isolamento — **D81**, com `app(ProdutoApiController::class)`).

### 3.6 Serviços (2.6) — Bloco 9.1b
- `ServicoController` (Web: `index`/`create`/`edit`; usa `ServicoLc116Repository` + `ProdutoServicoRepository`).
- `ServicoApiController` (API: `index` filtra `tipo='S'`, `store` cria `ProdutoServico` + `Servico` em transação, `show`/`update`/`destroy` via `ProdutoServicoRepository`; `deleted_by` no `destroy`).
- Views `telas/servicos/{index,form}.blade.php`.
- `public/assets/js/servicos-{list,form}.js`.
- `tests/Feature/ServicoApiTest.php` (5 testes).

### 3.7 Ativos (2.7) — Bloco 9.1b / 9.1c
- `AtivoController` (Web: `index`/`create`/`edit`; usa `CentroCustoRepository` + `AtivoRepository`).
- `AtivoApiController` (API: `index` via `AtivoRepository::listarComCentroCusto()`, `store`/`update` via `AtivoRepository::create()`/`update()` — valida **P23**; `show`/`destroy` via `AtivoRepository::comCentroCusto()`/`porId()`; `deleted_by` + `ativo = false` no `destroy`).
- Views `telas/ativos/{index,form}.blade.php` — **com `<select>` Ativo** e coluna Ativo no index (9.1c).
- `public/assets/js/ativos-{list,form}.js` — com `ativo` no `coletarDados()` e `<td>` na lista.
- `tests/Feature/AtivoApiTest.php` (6 testes, incluindo P23 e `ativo = false` no soft delete).

### 3.8 OSI (2.8) — Bloco 9.1b / 9.1c
- `OsiController` (Web: tela única `index` — config + histórico; usa `ConfiguracaoHandoffRepository`).
- `OsiApiController` (API: `show` retorna `{config, historico}`; `update` faz `updateOrCreate` + registra em `auditorias` — **D69**; usa `ConfiguracaoHandoffRepository`).
- View `telas/osi/index.blade.php` (toggle + tabela explicativa + histórico).
- `public/assets/js/osi-form.js` (toggle + justificativa + histórico).
- `tests/Feature/OsiApiTest.php` (3 testes).
- **`AuditoriaRepository`** (Grupo C) — `porTabela($tabela, $idRegistro, $limite = 20)`.

### 3.9 Correções transversais (pós-9.1b)
- **Filial:** `filial-list.js` com Editar + Excluir; `FilialApiController::show`/`update`/`destroy` com `findOrFail` explícito (**D71/D78**) + `deleted_by` no `destroy` (**D75**).
- **Centro de Custo:** `centros-custo-list.js` com Editar + Excluir; `CentroCustoApiController::destroy` com `DB::transaction` + `deleted_by`.
- **Usuário:** `usuarios-list.js` com Editar + Atores + Excluir; `UsuarioApiController` com filtro manual por `id_empresa` em `show`/`update`/`destroy` (**D77**) + `deleted_by`.
- **CSS:** `.btn-danger` adicionado ao `geral.css` (2 linhas) — **D72**.
- **Todos os `*-list.js`/`*-form.js`** com IIFE + `init()` + `})();` — **D80**.
- **9.1c:** refatoração de repositórios (R2) — todos os `*ApiController`/`WebController` usam repositório. `Model::create()` no `store` permanece (**D93**); `Model::findOrFail`/`orderBy` sem `::query()` permanece (**D94**). Coluna `ativo` em `ativos`. OSI ≡ Handoff.

### 3.10 Rotas
- **Web** (auth+tenant): `/`, `/tela-inicial`, `/empresa`, `/filial/*`, `/contexto/filial`, `/tela/{codigo}`, `/tarefas/*`, `/centros-custo/*`, `/usuarios/*`, `/produtos/*`, `/servicos/*`, `/ativos/*`, `/osi`.
- **API** (`web`+`auth`+`tenant`, prefixo `api.`): `apiResource('empresas'|'filiais'|'centros-custo'|'usuarios'|'produtos'|'servicos'|'ativos')` + `GET/POST /api/usuarios/{id}/atores` + `DELETE /api/usuario-atores/{id}` + `GET/PUT /api/osi`.

### 3.11 Testes (64 verdes)
- `IsolamentoTest` (12), `TarefasTest` (4), `TelaInicialTest` (4), `TenantIsolationTest` (2), `ExampleTest` (3).
- **9.1a:** `CentroCustoApiTest` (5), `UsuarioApiTest` (4), `UsuarioAtorApiTest` (2), `UsuarioIsolamentoTest` (2).
- **9.1b:** `ProdutoApiTest` (6), `ServicoApiTest` (5), `AtivoApiTest` (6), `OsiApiTest` (3).
- **9.1c:** `NcmRepositoryTest` (2), `ServicoLc116RepositoryTest` (2), `ConfiguracaoHandoffRepositoryTest` (2).

### 3.12 Contador — 9.2a (4.2 Plano de Contas)
- `PlanoContaController` (Web: `index`/`create`/`edit`).
- `PlanoContaApiController` (API: `index`/`store`/`show`/`update`/`destroy` + `proximoCodigo`).
- `PlanoContaRepository` estendido: `todasComHierarquia()`, `sinteticas()`, `porId()`, `paiValido()`, `proximoCodigo()`.
- Views `telas/plano-contas/{index,form}.blade.php`.
- `public/assets/js/plano-contas-{list,form}.js`.
- `tests/Feature/PlanoContaApiTest.php` (5 testes).

### 3.13 Contador — 9.2b (4.1 + 4.3 + 4.4)
- 4.1: `ParametroFiscalController` (Web) + `ParametroFiscalApiController` + `TabelaAuxiliarApiController` (inss/irrf/encargos). Views `telas/tabelas-fiscais/{index,form,inss,irrf,encargos}.blade.php`. `ParametroFiscalRepository` estendido (`listar`, `porId`). 3 repositórios Grupo U novos.
- 4.3: `ConfiguracaoContabilController` (Web) + `ConfiguracaoContabilApiController`. Views `telas/config-contabeis/{index,form}.blade.php`. `PlanoContaRepository::analiticasComMapeamento()`.
- 4.4: `ConfiguracaoFiscalController` (Web) + `ConfiguracaoFiscalApiController`. View `telas/config-fiscais/index.blade.php`. `EmpresaRepository` criado com `atualizarFiscal()`.
- **Sem migration.**

### 3.14 Contador — 9.2c (4.5 + 4.6 + 4.7)
- 4.5: `RegraClassificacaoController` (Web) + `RegraClassificacaoApiController` (com `testar` e `reativar`). `RegraClassificacaoLogRepository` (novo). Views `telas/regras-classificacao/{index,form}.blade.php`. 4 repos Grupo U novos (`TipoDocumento`, `Cfop`, `Cst`) + `PessoaRepository::paraSelectFornecedores()` + `ServicoLc116Repository::paraSelect()`.
- 4.6: `LancamentoManualController` (Web) + `LancamentoManualApiController`. View `telas/lancamento-manual/form.blade.php`. Valida período aberto da filial.
- 4.7: `RevisaoLancamentoController` (Web) + `RevisaoLancamentoApiController` (reclassificar/validar com auditoria). View `telas/revisao-lancamentos/index.blade.php` (com modal). `LancamentoRepository::paraRevisao()`.

### 3.15 Contador — 9.2d (4.8 + 4.9 + 4.10 + 4.11)
- 4.8: `ValidacaoCalculoController` (Web) + `ValidacaoCalculoApiController` (valida/override em `razoes_impostos`). View `telas/validacao/index.blade.php`. `RazaoImpostoRepository::porId()`.
- 4.9: `PendenciaController` (Web) + `PendenciaApiController` (resolver). View `telas/pendencias/index.blade.php` (com modal). `PendenciaRepository::porId()`, `listarComFiltros()`, `errosAbertosDoPeriodo()`.
- 4.10: `PrepararFechamentoController` (Web) + `PrepararFechamentoApiController` (checklist + enviar auditor). View `telas/preparar-fechamento/index.blade.php`. `TarefaRepository::criarOrdem()`, `porDocumentoETipo()`. `PeriodoRepository::porId()`, `fechar()`. `AtorFuncionalRepository::porCodigo()`.
- 4.11: `FecharPeriodoController` (Web) + `FecharPeriodoApiController` (lista + fechar). View `telas/fechar-periodo/index.blade.php`.

### 3.16 Comprador/Vendas — 10a-1 + 10a-2

- **10a-1:** `TabelaBasalComprasController` + `TabelaBasalVendasController` (views casca). Views `telas/tabelas-basais-{compras,vendas}/index.blade.php`.
- **10a-2 Fornecedores (5.2):**
  - `Web\FornecedorController` (`index`/`create`/`edit`; `edit` valida tag `'Fornecedor'` via `PessoaRepository::pertenceATag()`).
  - `Api\FornecedorApiController` (`apiResource`; `store` transacional cria `Pessoa` + `PessoaFisica`/`PessoaJuridica` + `PessoaTag('Fornecedor')`; `index` filtra por tag; `show`/`update`/`destroy` com `findOrFail` explícito — D71; `destroy` soft + `deleted_by` via `forceFill`).
  - Views `telas/fornecedores/{index,form}.blade.php` + JS `fornecedores-{list,form}.js`.
  - `tests/Feature/FornecedorApiTest.php` (7 testes).
- **10a-2 Clientes (6.2):** espelho de Fornecedores com tag `'Cliente'`. Views `telas/clientes/{index,form}.blade.php` + JS `clientes-{list,form}.js`. `tests/Feature/ClienteApiTest.php` (7 testes).
- **`PessoaRepository`:** `paraSelect(string $tag)` (`paraSelectFornecedores()` como alias), `listarPorTag()`, `porIdComFilhas()`, `pertenceATag()`.
- **`Pessoa::$fillable`:** inclui `dados_extras` (cast `array` já existia). `deleted_by` **não** está no fillable — `destroy` usa `forceFill`.
- **`tipo` = `'PF'`/`'PJ'`** (D99 — é `CHAR(2)` no DDL). **PF↔PJ bloqueado no `update`** (P147).
- **`dados_extras.categoria`** (D98) — categoria em `pessoas.dados_extras`; `pessoas_fisicas`/`pessoas_juridicas` também têm `dados_extras` (uso futuro, não preenchido aqui).
- **Rotas API:** `apiResource('fornecedores')`/`apiResource('clientes')` — **sem** `api.api.` (nome do grupo respeitado; confirmado no `route:list`).

### 3.18 Notas de Saída (6.3) — Bloco 10b

- `NotaFiscalSaidaController` (Web: `index`/`create`/`edit`; passa `periodoAberto`, `tiposDocumento`, `clientes` via `paraSelect('Cliente')`).
- `NotaFiscalSaidaApiController` (API: `index`/`store`/`show`/`update`/`destroy`/`salvarRascunho`/`confirmar`) — **espelho** do `NotaFiscalApiController` (5.3), com `direcao='Saida'` e `id_pessoa_destinatario` obrigatório.
- Reusa `NotaFiscalRepository` (`criarComItens`/`atualizarComItens`) — **sem** métodos novos.
- Views `telas/notas-saida/{index,form}.blade.php`.
- `public/assets/js/notas-saida-{list,form}.js` (IIFE D80; wizard 4 etapas espelhado).
- `tests/Feature/NotaFiscalSaidaApiTest.php` (7 testes espelhados).
- **Escopo:** idêntico ao 5.3 — só `NotaFiscal` + itens + impostos. Sem `ContaReceber`, `DocumentoEncadeado`, `Lancamento`, `Tarefa`, `NotaFiscalVinculo`.
- **Status/rascunho/período:** idênticos ao 5.3 (`Importado`, `dados_extras.rascunho`, `PeriodoRepository::porFilialEMesAno`).

---

## 4. Divergências e decisões de arquitetura

### 4.1 Abertas (documentar no `10_modelo_dados_fisico.md`)

| # | O que é | Por quê | Ação |
| :--- | :--- | :--- | :--- |
| **D56** | `routes/api.php` precisa de `['web', 'auth', 'tenant']` (não só `web`) | Sem `auth`/`tenant`, o `SetTenantContext` **não roda** na API → `TenantContext` vazio → `BelongsToTenant` filtra por `null` → `[]`. | Documentar no `10`. **Já corrigido.** |
| **D71** | `ApiController` de models com `BelongsToTenant`: usar `findOrFail($id)` explícito em `show`/`update`/`destroy` (não binding implícito) | O `SubstituteBindings` roda **antes** do `SetTenantContext` (grupo `web`). O binding implícito filtra `id_empresa = null` → **404 "No query results"**. | Documentar no `10`. |
| **D75** | `deleted_by` **não** é preenchido automaticamente (a trait `BelongsToTenant` só preenche `id_empresa` no `creating`) | O `SoftDeletes` grava `deleted_at`; `deleted_by` precisa ser **manual** no `destroy` (`update(['deleted_by' => getUsuarioId()])`). | Documentar no `10`. |
| **D79** | `produtos`/`servicos` (filhas 1:1) **não** têm `id_empresa`/`ativo`/`deleted_at`/`created_by`/`updated_by`/`deleted_by` próprios | Herdam do `ProdutoServico` pai (1:1). Adicionar seria redundância. `configuracoes_handoff` não tem auditoria própria (vai em `auditorias`, D69). `ativos` já tem tudo (Grupo F). | Documentar no `10`. **Nenhuma migration nova.** |
| **D93** | `Model::create()` no `store` do `ApiController` permanece (não mover para repositório) | O lint de SQL cru só pega `::query\(\)`, não `::create()`. Mover aumentaria escopo sem ganho. | Documentar. Se o lint for endurecido, mover. |
| **D94** | `Model::findOrFail()`/`Model::orderBy()` direto (sem `::query()`) em `*ApiController` **não** viola o lint | O lint só pega `::query\(\)`. Padrão herdado do 9.1a/b. | Documentar. Refatorar se o lint endurecer. |

### 4.2 Resolvidas que ainda confundem (manter 1 linha)

| # | O que é | Por quê confunde |
| :--- | :--- | :--- |
| **D27** | `Usuario` **sem** `BelongsToTenant` | `id_empresa` do usuário é **identidade**, não escopo. `Auth::attempt` não tem contexto. **`UsuarioApiController` filtra manual** com `where('id_empresa', $ctx->getId())` em `index`/`show`/`update`/`destroy` (**D77**). **Nunca** adicionar a trait. |
| **D31** | **Não há** troca de ator na UI | Ator é identidade (`usuario_atores`). Trocar de ator = logout/login. O `seletor-ator.js` do wireframe foi **removido** (era mock). |
| **D71/D75** | `findOrFail` explícito + `deleted_by` manual | Quem for criar `ApiController` novo **precisa** saber. Ver §7.2. |

**Resolvidas que o código já reflete (não precisam ficar):** D1–D26, D28–D30, D32–D53, **D54, D55, D57–D70, D72–D74, D76–D78, D80, D81**. Tracking completo em `06_pendencias.md`.

---

## 5. Pendências abertas (resumo)

**Tracking completo em `06_pendencias.md`.** Aqui só o que bloqueia o 9.2 e blocos futuros.

### 5.1 Bloqueantes de blocos futuros
- **P24** — CHECKs do DDL (FormRequest) — Blocos 9–12.
- **P50** — `tarefas.data_criacao` preenchido pelo repositório — Bloco 8.3.
- **P66** — `baixar()`/`receber()` não criam lançamento contábil — Bloco 13.
- **P88** — 68 telas faltantes — Blocos 9–12.
- **P89** — Substituir `dados-simulados.js` por API — Blocos 9–12.
- **P90** — Testes de cada tela — Blocos 9–12.
- **P119** — Dropdown de filial só aparece se ≥2 filiais — documentar no `04`.
- **P120** — Caixa de Entrada usa só o primeiro ator da filial — Bloco 8.3.

### 5.2 Dívidas técnicas menores
- P11 (csts.descricao), P12 (CNAE 7 dígitos), P17 (empresa.js sem matriz), P25–P49 (CHECKs/FKs das tabelas de operação), P52 (menus_itens.fase), P53 (AtorFuncional.timestamps), P54 (created_at nas 10 tabelas), P55 (ncms hierarquia), P56 (app/Models/x 0 bytes), P57 (PlanoContaSeeder id_empresa=1), P59 (senha fraca em prod), P60 (PeriodoSeeder só empresa 1), P61 (Grupo U sem repositório), P63 (Pessoa::tags()), P64 (RegraClassificacaoRepository), P68 (NotaFiscalItemRepository), P69 (DocumentoEncadeadoRepository), P71 (RepositoryServiceProvider manual), P75 (views não filtram tenant), P78 (lint heurístico), P103 (MenuService::nomeUsuario sem escopo), P104 (badge mock), P105 (fallback /tela), P107 (CSS .ti-*), P108–P109 (placeholders), P115 (tarefas.id_documento sem FK), P133 (usuarios-atores.js carrega tudo).
- **P146** — `id_municipio` no form de PJ é `<input type="number">` (sem autocomplete; `MunicipioRepository`/select fica para fase 2). — 10a-2.
- **P147** — `tipo` PF↔PJ não pode mudar no `update` (retorna `422`); trocar exigiria apagar a filha e recriar. — 10a-2.
- **P148** — `api.api.tabelas-inss/irrf/encargos` (nome dobrado no `routes/api.php` do 9.2b) — corrigir no próximo bloco. — 9.2b.

### 5.3 Fechadas
- **P135** — (= D54) — fechada no 9.1c. ✅
- **P136** — `UsuarioController` enxugado (sem `store`/`update`/`sincronizarAtores`) — fechada no 9.1b. ✅
- **P137** — `MenuItemSeeder` 1.0 → `/` — fechada no 9.1b. ✅
- **P138** — `PlanoContaRepository::proximoCodigo()` usa `SUBSTRING_INDEX`/`CAST` (MariaDB). Sem teste em SQLite. — 9.2a.
- **P139** — 4.4 não expõe UF (é da filial, não da empresa). Wireframe mostrava UF; banco não tem `empresas.uf`. — 9.2b.
- **P140** — `ParametroFiscalApiController::destroy` não implementado (tabela sem `deleted_at`). Sem exclusão pela UI. — 9.2b.
- **P141** — 4.5 não tem NCM no form (tabela 15k+ linhas; select travaria). Aceita via API; form fica para fase 2 com autocomplete. — 9.2c.
- **P142** — 4.7 `abrirReclassificacao()` usa `window.__lancamentosCache` que não é preenchido (modal abre sem valores pré-selecionados). — 9.2c.
- **P143** — 4.10 `enviarAuditor` exige `AtorFuncionalSeeder` ter o ator `auditor` cadastrado. Sem ele, retorna 422. — 9.2d.
- **P144** — 4.11 fecha direto `Aberto → Fechado` (pula `Em fechamento`). — 9.2d.
- **P145** — 4.8 só valida `razoes_impostos` (impostos). Folha/depreciação/provisão ficam para o Bloco 10.x. — 9.2d.
- **P146** — `id_municipio` no form de PJ é `<input type="number">` (sem autocomplete; `MunicipioRepository`/select fica para fase 2). — 10a-2.
- **P147** — `tipo` PF↔PJ não pode mudar no `update` (retorna `422`); trocar exigiria apagar a filha e recriar. — 10a-2.
- **P148** — `api.api.tabelas-inss/irrf/encargos` (nome dobrado no `routes/api.php` do 9.2b) — corrigir no próximo bloco. — 9.2b.
---

## 6. Próximos passos

### 6.1 Bloco 9.2 — Contador (4.1–4.11)
- Tabelas Fiscais, Plano de Contas, Config. Contábeis, Config. Fiscais, Regras, Lançamento Manual, Revisão, Validação, Pendências, Preparar Fechamento, Fechar.
- **Padrão:** §7 inteira (Blade casca + JS fetch + API `auth`/`tenant` + `->name('api.')` + `findOrFail` explícito + `deleted_by` no `destroy` + IIFE).
- **Testes:** mesmo padrão de `ProdutoApiTest`/`AtivoApiTest` (incluindo isolamento via controller direto — **D81**, com `app(XApiController::class)`).

### 6.1 Bloco 9.2 — Contador (4.1–4.11) — ✅ Concluído
- 9.2a: 4.2 Plano de Contas.
- 9.2b: 4.1 Tabelas Fiscais + 4.3 Config. Contábeis + 4.4 Config. Fiscais.
- 9.2c: 4.5 Regras + 4.6 Lançamento Manual + 4.7 Revisão.
- 9.2d: 4.8 Validação + 4.9 Pendências + 4.10 Preparar + 4.11 Fechar.**Padrão:** §7 inteira.

### 6.2 Blocos 10–13
- Operação (5.x–8.x + 10.x) → Administrador (3.x) → Auditor (11.x) + Administração (12.x) → Handoff + serviços.
### 6.2 Blocos 10–13

- **10b (concluído):** 5.3 Digitar Notas de Entrada, 6.3 Digitar Notas de Saída. ✅
- **10b (pendente):** 5.4 Importar Notas de Entrada + 6.4 Importar Notas de Saída (adiados — retomar ao final do bloco).
- Operação (5.5, 7.x, 8.x, 10.x) → Administrador (3.x) → Auditor (11.x) + Administração (12.x) → Handoff + serviços.

### 6.3 Bloco 8.3 (opcional, quando der)
- P120 (todos os atores na Caixa de Entrada), P50 (data_criacao), P104 (badge real).

---

## 7. Padrões consolidados (ler ANTES de codar tela nova)

> Esta seção é a **fonte da verdade** para novas telas. Consolidada no 9.1a, revisada no 9.1b e 9.1c. **Se algo aqui conflitar com o que você acha que sabe, este documento ganha.**

### 7.1 Arquitetura Web vs API

O projeto **não usa MVC clássico** (Blade POST/PUT). Usa **Blade casca + JS `fetch` + ApiController JSON**:

```
Blade (casca, sem dados) ──fetch──► ApiController ──► Repository ──► Model ──► JSON
        ▲                                  │
        │                                  ▼
        └── JS preenche tbody / coleta form / trata erro / redireciona
```

**Evidência:** `FilialApiController` (CRUD), `filial-list.js` (fetch + `tbody.innerHTML`), `filial-form.js` (fetch + redirect).

### 7.2 Contrato de `ApiController`

- **Validação:** `$request->validate([...])` **inline** (sem FormRequest). Pipe (`'required|string'`) ou array (`['required', 'string']`) — escolher um por arquivo.
- **Update:** `unique:tabela,campo,'.$model->id` (concatenação de string).
- **R2 (tenant) no store:** `$data['id_empresa'] = app(TenantContext::class)->getId();` (Grupo A) ou `$data['id_filial'] = app(TenantContext::class)->getFilialId();` (Grupo F) + early return `422` se nulo.
- **R2 (tenant) no update:** `unset($data['id_empresa'])` / `unset($data['id_filial'])`.
- **Retorno:** `store` → `response()->json($model, 201)`; `show`/`update` → `response()->json($model)`; `index` → `response()->json($collection)`; `destroy` → `response()->noContent()` (retorna **`Illuminate\Http\Response`**, não `JsonResponse` — **D71**).
- **`destroy` = soft delete:** `DB::transaction` + `$model->update(['ativo' => false, 'deleted_by' => app(TenantContext::class)->getUsuarioId()]); $model->delete();`. Se a tabela **não** tem `deleted_at` (ex.: `usuario_atores`), só `update(['ativo' => false])`. Se a tabela **não** tem `ativo` (ex.: legado), só `update(['deleted_by' => ...])` + `delete()`. — **D75**.
- **Model binding no path:** ❌ **não usar** (`Model $model`). Usar `findOrFail($id)` explícito em `show`/`update`/`destroy` — **D71** (o `SubstituteBindings` roda antes do `SetTenantContext` → 404).
- **Repository no ApiController:** ✅ **usar sempre** (R2). `Model::create()` direto **só** no `store` (**D93**). `Model::findOrFail`/`Model::orderBy` **sem** `::query()` **não viola** o lint (**D94**), mas é dívida — padronizar quando der.
- **`UsuarioApiController`:** filtro manual por `id_empresa` em **todos** os métodos (`index`/`show`/`update`/`destroy`) — **D77** (D27: `Usuario` sem `BelongsToTenant`).

### 7.3 Contrato de `WebController`

- **Só** `index`/`create`/`edit` (+ ações extras como `atores`, `index` de OSI). **Sem** `store`/`update`/`destroy`.
- **Sem `return type`** explícito.
- **`create()`** passa `view('...form', ['model' => null] + dados auxiliares)`.
- **`edit(int $id)`** → `$this->repo->porId($id)` (ou equivalente do repositório) + `view('...form', compact('model') + dados auxiliares)`.
- **`index()`** passa `view('...index')` **sem dados** (casca), exceto OSI (tela única que precisa de `config` + `historico`).
- **`atores(int $id)`** (quando aplicável) busca dados auxiliares via repositório e passa `compact(...)`.
- **`request()` helper global:** ❌ não usar. Usar `Request $request` injetado.
- **`$this->repo->query()`:** ❌ não funciona (`query()` é `protected` no `BaseRepository`). Usar métodos públicos do repositório.

### 7.4 Contrato de view Blade (casca)

- `@extends('layouts.app')` + `@section('title', '...')` + `@section('content')`.
- **Index:**
  - `<div id="recurso-list-app">` envolvendo tudo.
  - `.page-header` **com `style` inline**: `style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;"` — **D74**.
  - `<h1>` + `<a class="btn btn-primary">Novo recurso</a>` dentro do `.page-header`.
  - `.card` com `<h2>` + `<table class="data" id="tabela-recurso">` + `<tbody></tbody>` vazio + `<p class="muted" id="recurso-vazio" style="display:none;">`.
- **Form:**
  - `<div id="recurso-form-app" data-id="{{ $model->id ?? '' }}">` envolvendo tudo.
  - `<h1>` **solto** dentro do `#app` (sem `.page-header`, sem "Voltar") — **D73**.
  - `.card` com `<h2>` + `.form-grid` + `.form-row` (label **sem `for`**) + `<input id="...">`.
  - **Ativo** como `<select>` Sim/Não (**não** checkbox) — **D73**.
  - `.form-actions` **fora** do `.card`, irmão dele — **D73**.
  - Ordem: **Cancelar** (`btn btn-secondary`) → **Salvar** (`btn btn-primary`).
  - `<button>` Salvar **sem** `type` (não submete porque não tem `<form>`).
- **Tabela:** `<table class="data">` — `<tbody>` **vazio** (JS preenche). **Nunca** `@forelse` no `<tbody>`.
- **`@json` em `data-*`:** `data-filiais='@json($filiais)'` — **sem aspa simples extra**.
- **`isset($model)` no lugar de `$model ?`** (defesa).
- **`@push('scripts')`** com `<script src="{{ asset('assets/js/...js') }}"></script>`.

### 7.5 Contrato de JS

- **Estrutura obrigatória** (**D80**):
  ```javascript
  (function () {
    'use strict';
    async function carregar...() { ... }
    async function excluir(id) { ... } // se lista
    function getCsrfToken() { ... }
    function init() { carregar...(); /* addEventListener do salvar se form */ }
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }
  })();
  ```
  **Sem o `})();` final, o arquivo define funções mas não executa** (tabela vazia, sem erro no console).
- **CSRF:** `getCsrfToken()` lê `XSRF-TOKEN` do cookie via `document.cookie.match(/XSRF-TOKEN=([^;]+)/)`.
- **GET:** `fetch(url, { headers: { 'Accept': 'application/json' }, credentials: 'same-origin' })`.
- **POST/PUT:** `fetch(url, { method, headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'X-XSRF-TOKEN': getCsrfToken() }, credentials: 'same-origin', body: JSON.stringify(data) })`.
- **DELETE:** `fetch(url, { method: 'DELETE', headers: { 'Accept': 'application/json', 'X-XSRF-TOKEN': getCsrfToken() }, credentials: 'same-origin' })`.
- **Erro:** `alert('Erro: ' + JSON.stringify(err.errors || err.message || err));`.
- **Sucesso:** `window.location.href = '/recurso';` (redirect tradicional).
- **Lista:** `tbody.innerHTML = data.map(item => \`<tr>...</tr>\`).join('');`. Se `data.length === 0`, `vazio.style.display = ''` e `tbody.innerHTML = ''`.
- **Form:** `coletarDados()` lê cada `id`; `salvar()` valida no client (alert), escolhe URL/método pelo `state.id`, envia.
- **Estado:** `const state = { id: null };` — preenchido no `init()` a partir de `app.dataset.id`.
- **Botões da lista** (**D72**):
  - **Editar:** `<a href="/recurso/{id}/edit" class="btn btn-secondary">Editar</a>`.
  - **Excluir:** `<button type="button" class="btn btn-danger" data-id="{id}" data-acao="excluir">Excluir</button>`.
  - **Sem** `.acoes-linha`, **sem** `btn-sm` (não existe no CSS), **sem** `<div>` em volta.
- **`confirm()`** antes do `DELETE`: `if (!confirm('Excluir este recurso? ...')) return;`.
- **Campos do model:** `AtorFuncional` tem `descricao` (não `nome`). `Filial` tem `nome_fantasia` (não `nome`). `ProdutoServico` tem `descricao`. Relações viram **snake_case** no JSON (`centroCusto` → `centro_custo`, `servicoLc116` → `servico_lc116`). Sempre conferir o model antes de montar a view/JS.

### 7.6 Rotas

- **Web:** `Route::prefix('recurso')->name('recurso.')->group(...)` com `index`/`create`/`edit` (+ extras como `atores`). **Planas**, sem prefixo `cadastros.`.
- **API:** `Route::middleware(['web', 'auth', 'tenant'])->name('api.')->group(...)` + `Route::apiResource('recurso', RecursoApiController::class)`.
  - **`auth`/`tenant` são obrigatórios** (D56).
  - **`->name('api.')` é obrigatório** (evita colisão Web/API).
- **Nome de path com hífen** (`centros-custo`, não `centros_custo`).
- **Ações extras da API:** `Route::post('recurso/{id}/acao', ...)` fora do `apiResource`.
- **Model binding:** ❌ **não usar** na API — `findOrFail($id)` explícito (**D71**).
- **OSI:** `Route::get('osi', ...)` + `Route::put('osi', ...)` (não é `apiResource` — é singleton por empresa).

### 7.7 O que **NÃO** fazer (lições aprendidas)

| ❌ Não fazer | ✅ Fazer |
|---|---|
| `FormRequest` | `$request->validate([...])` inline |
| `store`/`update`/`destroy` no WebController | Só `index`/`create`/`edit` (+ `atores`, `index` de OSI) |
| `request()` helper global | `Request $request` injetado |
| `@forelse` no `<tbody>` | `<tbody></tbody>` vazio + JS preenche |
| `@csrf`/`@method`/`old()`/`@error` no form | JS cuida de CSRF; sem `old`/`@error` |
| `with('sucesso')` / flash | `window.location.href` no JS |
| `<h2>` como título de página | `<h1>` + `.page-header` (index) ou `<h1>` solto (form) |
| `<table class="tabela-basica">` | `<table class="data" id="tabela-recurso">` |
| `abort_if($x === null, 404)` | `findOrFail($id)` (via repo) |
| `Route::resource` em Web | Rotas explícitas (`Route::get/post/...`) |
| Prefixo `cadastros.` | Rotas planas (`recurso.*`) |
| `destroy` duplicado Web+Api | Só no ApiController (padrão `apiResource`) |
| `delete()` físico | `delete()` soft (trait `SoftDeletes`) + `deleted_by` manual |
| **`Model $model` no path do ApiController** | **`findOrFail($id)` explícito (D71)** |
| **`$this->repo->query()` no controller** | **Método público do repositório (`query()` é `protected`)** |
| **`.acoes-linha`** | **Botões direto no `<td>` (D72)** |
| **`btn-sm` sozinho** | **`btn btn-secondary` / `btn btn-danger`** |
| **`<button class="btn-sm">` para Editar** | **`<a class="btn btn-secondary">` para Editar; `<button class="btn btn-danger">` para Excluir** |
| **`.form-actions` dentro do `.card`** | **`.form-actions` fora do `.card` (D73)** |
| **`.page-header` no form** | **`<h1>` solto dentro do `#app` (D73)** |
| **`<label for="...">`** | **`<label>` sem `for` (D73)** |
| **`<input type="checkbox">` p/ Ativo** | **`<select>` Sim/Não (D73)** |
| **`data-filiais='@json($var')` (aspa extra)** | **`data-filiais='@json($var)'`** |
| **`route('recurso.store')` no Blade** | **`route('recurso.index')` (Web)** |
| **`a.nome` no JS p/ `AtorFuncional`** | **`a.descricao`** |
| **`$busca`/`$ativo` no Blade casca** | **Filtros no JS + `ApiController`** |
| **`$this->atoresFuncionais->all()`** | **`$this->atoresFuncionais->todos()`** |
| **`$model ? 'Editar' : 'Novo'`** | **`isset($model) ? 'Editar' : 'Novo'`** |
| **`*-list.js` sem IIFE e sem `init()`** | **IIFE + `init()` + `})();` (D80)** |
| **`new XApiController;` no teste de isolamento** | **`app(XApiController::class)` (D81, respeita o construtor)** |

### 7.8 Testes Pest

- **`Pest.php`** já tem `pest()->extend(TestCase::class)->use(RefreshDatabase::class)->in('Feature');` — **não** repetir no teste.
- **`beforeEach`:** `$this->seed(EmpresaFilialSeeder::class); $this->seed(AtorFuncionalSeeder::class); $this->seed(UsuarioSeeder::class);` + **se necessário** `$this->seed(CentroCustoSeeder::class);`.
- **Usuário:** `Usuario::withoutGlobalScopes()->where('email', 'admin@gestor.local')->firstOrFail();`.
- **`TenantContext`:** `app(TenantContext::class)->set(1, 1, $usuario->id, null);`.
- **`actingAs($this->usuario);`**.
- **Isolamento (D81):** trocar o contexto (`app(TenantContext::class)->set(2, 2, ...)`) e **chamar o controller direto via container**:
  ```php
  $controller = app(\App\Http\Controllers\Api\XApiController::class);
  $request = \Illuminate\Http\Request::create('/api/x', 'GET');
  $response = $controller->index($request);
  ```
  **Não** usar `getJson` (o middleware `SetTenantContext` reseta o contexto) nem `new XApiController` (quebra se o construtor tiver dependências).
- **API (contexto normal):** `getJson`/`postJson`/`putJson`/`deleteJson`. **Não** `get`/`post` (que não setam `Accept: application/json`).
- **Assertions:** `assertOk()`, `assertCreated()`, `assertNoContent()`, `assertJsonFragment([...])`, `assertJsonMissing([...])`, `assertStatus(422)`, `assertJsonValidationErrors(['campo'])`, `assertDatabaseHas('tabela', [...])`.
- **`update`/`destroy`:** preferir `assertDatabaseHas` a `assertJsonFragment`.
- **Soft delete:** `expect($model->refresh()->deleted_at)->not->toBeNull();` e, se a tabela tem `ativo`, `expect($model->ativo)->toBeFalse();`.
- **Senha:** `expect(Hash::check('senha', $u->senha_hash))->toBeTrue();`.
- **P23:** criar `CentroCusto` na empresa 2 via `withoutGlobalScopes()->create(['id_empresa' => 2, ...])`.

### 7.9 Regras de ouro para o próximo chat

> **Antes de codar uma tela nova:**
> 1. Ela já tem `MenuItemSeeder` apontando? (Se sim, usar a rota existente.)
> 2. O model tem `SoftDeletes`? (Se sim, `delete()` é soft.)
> 3. O model tem `BelongsToTenant`? (Se não — ex.: `Usuario` — filtrar manual por `id_empresa`.)
> 4. Qual é a tabela? (`id_empresa` ou `id_filial`? Grupo A ou F?)
> 5. A tabela tem coluna `ativo`? (Se não — ex.: legado — o `destroy` não seta `ativo`.)
> 6. O padrão §7.2/7.3/7.4/7.5/7.6 cobre? (Se sim, copiar a estrutura.)
> 7. Tem teste Pest do `ProdutoApiTest`/`AtivoApiTest` para copiar? (Sim.)
> 8. Documentar divergências em **D95+** e pendências em **P138+**. **Não criar D/P novos** sem necessidade.
> 9. Atualizar §1 (status), §3 (o que existe), §5 (pendências), §7 (se descobriu padrão novo) — **sem changelog**.

### 7.10 Observações específicas

- **`Usuario` sem `BelongsToTenant` (D27):** o `id_empresa` é identidade. `Auth::attempt` não tem contexto. `UsuarioApiController` filtra manual com `where('id_empresa', $ctx->getId())` em **todos** os métodos (**D77**). **Não adicionar a trait.**
- **Ator é identidade (D31):** não há troca de ator na UI. `seletor-ator.js` **removido**. Trocar de ator = logout/login.
- **`menu.js` não sobrescreve `period-label`:** o Blade renderiza o período; o JS só preenche `user-label`.
- **`/tela-inicial` é alias de `/`:** duas rotas → mesmo controller. `MenuItemSeeder` aponta 1.0 → `/` (canônica).
- **Filtros de listagem:** ficam no **`ApiController::index()`** (query string `?q=&ativo=`). O Blade casca **não tem** `<form>` de filtro.
- **`descricao` vs `nome`:** `AtorFuncional`, `ProdutoServico`, `Ativo` têm `descricao`. `CentroCusto` tem `nome`. `Filial` tem `razao_social`/`nome_fantasia`. **Conferir o model** antes de montar a view.
- **`deleted_by`:** só é setado no `destroy` (D75). `created_by`/`updated_by` **não** são preenchidos (a trait não faz; consistência com o legado). Documentar como dívida.
- **OSI ≡ Handoff:** `OSI` é o nome canônico da UI (item 2.8). Nome técnico: `configuracoes_handoff` / `ConfiguracaoHandoff` / `ConfiguracaoHandoffRepository`. **Não criar** `HandoffController`/`HandoffRepository`.
- **`Ativo`:** tabela **tem** coluna `ativo` (9.1c). O form **tem** `<select>` Ativo. O `destroy` seta `ativo = false` + `deleted_by` + `delete()`. O `status` (Em uso/Ocioso/Alienado) **continua** — são coisas diferentes (operacional vs lógico).
- **`produtos`/`servicos`:** filhas 1:1, **sem** colunas de tenant/soft delete/auditoria próprias (D79). O `$fillable` **não** inclui `created_by`/`updated_by` (não setados).
- **`Pessoa`:** tem `BelongsToTenant` (`hasTenantColumn(): true`) — o global scope cobre o filtro por empresa. `PessoaFisica`/`PessoaJuridica`/`PessoaTag` **não** têm a trait (filhas). `deleted_by` **não** está no `$fillable` — usar `forceFill` no `destroy`. `tags` não têm `ativo`/timestamps (`$timestamps = false`); no soft delete da `Pessoa`, as tags **ficam** (não apagar).

---

## 8. Como contribuir com este documento

- **Ao fechar bloco:** atualize §1 (status), §3 (o que existe), §5 (pendências), §7 (se descobriu padrão novo). **Remova** o que ficou obsoleto.
- **Ao resolver divergência:** remova de §4.1/§4.2 (ou deixe 1 linha se ainda confunde).
- **Ao resolver pendência:** remova de §5 (o tracking detalhado fica em `06_pendencias.md`).
- **Nunca** adicione histórico de versões aqui — use `git log docs/15_implementacao.md`.
- **Nunca** duplique informação: se está em `06_pendencias.md`, aqui só o resumo; se está em `10_modelo_dados_fisico.md`, aqui só a referência.
