---
documento: bloco_9.1b
versao: 1.0
data: 2026-11-03
proposito: Planejamento executável do Bloco 9.1b (Produtos 2.5, Serviços 2.6, Ativos 2.7, OSI 2.8)
depende_de: [15_implementacao, 04_modelo_de_dados, 09_menu_numeracao, 10_modelo_dados_fisico]
---

# Bloco 9.1b — Produtos, Serviços, Ativos, OSI

> **O que é este documento:** plano executável do 9.1b, autocontido o suficiente para um chat novo começar **sem recarregar o histórico**. Segue o padrão §7 do `15_implementacao.md` v2.0 (Blade casca + JS fetch + ApiController JSON). **Não é changelog.**
>
> **Como usar:**
> 1. **Antes de codar**, ler §1 (o que já existe) e §2 (padrões §7).
> 2. **Ao codar**, seguir §3 (arquivos por recurso) e §4 (decisões).
> 3. **Ao fechar**, atualizar §5 (critérios de aceite) e o `15_implementacao.md` (§1, §3, §5, §7).

---

## 1. O que já existe (não recriar)

### Models
| Model | Grupo | `hasTenantColumn()` | SoftDeletes | Tabela |
|---|---|---|---|---|
| `ProdutoServico` | **A** (`id_empresa`) | `true` | ✅ | `produtos_servicos` |
| `Produto` | filha (1:1) | — | ❌ | `produtos` |
| `Servico` | filha (1:1) | — | ❌ | `servicos` |
| `Ativo` | **F** (`id_filial`) | `false` | ✅ | `ativos` |
| `ConfiguracaoHandoff` | **A** (`id_empresa`) | `true` | ❌ | `configuracoes_handoff` |
| `Auditoria` | (C — filha de `usuario`) | — | ❌ | `auditorias` |

### Repositories
| Repository | Grupo | Métodos existentes |
|---|---|---|
| `ProdutoServicoRepository` | A | `produtos()`, `servicos()`, `porCodigoInterno()`, `buscarPorDescricao()` |
| `AtivoRepository` | F | `emUso()`, `porFilial()`, `create()` (valida P23), `update()` (valida P23) |

### Migrations (schemas exatos)
- **`produtos_servicos`**: `id_empresa`, `tipo` (P/S), `codigo_interno` (nullable), `descricao` (300), `ativo`, `dados_extras`, timestamps, softDeletes.
- **`produtos`**: `id_produto_servico` (unique), `id_ncm` (nullable), `unidade` (nullable), `dados_extras`, **timestamps** (confirmado pelo `show columns`).
- **`servicos`**: `id_produto_servico` (unique), `id_servico_lc116` (nullable), `dados_extras`, timestamps.
- **`ativos`**: `id_filial`, `descricao`, `data_aquisicao`, `valor_original`, `valor_residual`, `vida_util_meses`, `metodo_depreciacao`, `mes_inicial_depreciacao`, `id_centro_custo` (nullable), `destino`, `status`, `dados_extras`, timestamps, softDeletes.
- **`configuracoes_handoff`**: `id_empresa` (unique), `handoff_ativo`, `dados_extras`, timestamps. **Singleton por empresa.**

### Rotas existentes (não tocar)
- Web: `/`, `/tela-inicial`, `/empresa`, `/filial/*`, `/contexto/filial`, `/tela/{codigo}`, `/tarefas/*`, `/centros-custo/*`, `/usuarios/*`.
- API: `apiResource('empresas'|'filiais'|'centros-custo'|'usuarios')`, `/api/usuarios/{id}/atores` (GET/POST), `/api/usuario-atores/{id}` (DELETE).

### `MenuItemSeeder` (já aponta, **só trocar 1.0**)
- 2.5 → `/produtos`
- 2.6 → `/servicos`
- 2.7 → `/ativos`
- 2.8 → `/osi` (nome "Ordem de Serviço Interna (OSI)")
- **P137:** 1.0 → `/tela-inicial` (trocar para `/`).

### Testes existentes (37 verdes)
`IsolamentoTest` (12), `TarefasTest` (4), `TelaInicialTest` (4), `TenantIsolationTest` (2), `ExampleTest` (3), `CentroCustoApiTest` (5), `UsuarioApiTest` (4), `UsuarioAtorApiTest` (2), `UsuarioIsolamentoTest` (2).

---

## 2. Padrão a seguir (resumo do §7 do `15`)

> **Ler o `15_implementacao.md` §7 completo antes de codar.** Abaixo, o essencial.

### 2.1 WebController (Blade casca)
- Só `index`/`create`/`edit`. **Sem** `store`/`update`/`destroy`.
- Sem `return type` explícito.
- `create()` passa `view('...form', ['model' => null])`.
- `edit(int $id)` → `Model::findOrFail($id)` + `view('...form', compact('model'))`.
- **Sem** `request()` helper — usar `Request $request` injetado.

### 2.2 ApiController (JSON)
- `$request->validate([...])` **inline** (sem FormRequest).
- R2 no `store`: `$data['id_empresa'] = app(TenantContext::class)->getId();` (Grupo A) ou `$data['id_filial'] = app(TenantContext::class)->getFilialId();` (Grupo F).
- R2 no `update`: `unset($data['id_empresa'])` / `unset($data['id_filial'])`.
- `store` → `response()->json($model, 201)`. `show`/`update` → `response()->json($model)`. `destroy` → `response()->noContent()`.
- `destroy` = soft delete (`$model->update(['ativo' => false]); $model->delete();`).
- **Model binding** no path: `show(Model $model)`, `update(Request $request, Model $model)`, `destroy(Model $model)`.
- **Repository no ApiController:** ❌ **não usar** (D54) — `Model::create()` direto, **exceto** `AtivoApiController` que usa `AtivoRepository` (valida P23).

### 2.3 View Blade (casca)
- `@extends('layouts.app')` + `@section('title', ...)` + `@section('content')`.
- Lista: `.page-header` (h1 + botão), `.card` (h2 + `<table class="data"><tbody></tbody></table>` **vazio** + `<p id="...-vazio" style="display:none">`), `@push('scripts')` com o JS.
- Form: `<div id="...-form-app" data-id="{{ $model->id ?? '' }}">` + `.card` com `.form-grid`/`.form-row`/`<input id="...">`. **Sem** `<form>`, **sem** `@csrf`, **sem** `@method`, **sem** `old`/`@error`. Botão `<button type="button" id="...-salvar">`. "Cancelar" → `route('...index')` (Web).
- **`@json` em `data-*`:** `data-filiais='@json($filiais)'` — **sem aspa simples extra**.
- **`isset($model)` no lugar de `$model ?`** (defesa).

### 2.4 JS (fetch)
- IIFE + `'use strict'` + `init()` no `DOMContentLoaded`.
- `getCsrfToken()` lê cookie `XSRF-TOKEN`.
- GET: `fetch(url, { headers: { 'Accept': 'application/json' }, credentials: 'same-origin' })`.
- POST/PUT: `fetch(url, { method, headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'X-XSRF-TOKEN': getCsrfToken() }, credentials: 'same-origin', body: JSON.stringify(data) })`.
- Erro: `alert('Erro: ' + JSON.stringify(...))`. Sucesso: `window.location.href = '/recurso'`.
- Lista: `tbody.innerHTML = data.map(...).join('')`. Vazio: `vazio.style.display = ''`.
- **Campos do model:** `ProdutoServico` tem `descricao`, `codigo_interno`, `ativo`, `dados_extras`. `Produto` tem `unidade`, `id_ncm`. `Servico` tem `id_servico_lc116`. `Ativo` tem `descricao`, `data_aquisicao`, `valor_original`, etc.

### 2.5 Rotas
- **Web:** `Route::prefix('recurso')->name('recurso.')` com `index`/`create`/`edit`. Planas.
- **API:** `Route::middleware(['web', 'auth', 'tenant'])->name('api.')->group(...)` + `apiResource('recurso', RecursoApiController::class)`. **`auth`/`tenant` são obrigatórios** (D56). **`->name('api.')` é obrigatório** (evita colisão de nomes Web/API).

### 2.6 Testes Pest
- `Pest.php` já tem `RefreshDatabase` em Feature.
- `beforeEach`: seed `EmpresaFilialSeeder`, `AtorFuncionalSeeder`, `UsuarioSeeder`. `actingAs`. `TenantContext::set(1, 1, $usuario->id, null)`.
- Assertions: `assertOk`/`assertCreated`/`assertNoContent`/`assertJsonFragment`/`assertJsonMissing`/`assertDatabaseHas`.
- **`update`/`destroy`:** preferir `assertDatabaseHas` a `assertJsonFragment` (o retorno pode ser `[]`).

### 2.7 O que **NÃO** fazer
Ver tabela §7.7 do `15` v2.0. **Adicionar:** `Produto`/`Servico` são filhas de `ProdutoServico` — o form edita **os dois** (transação). `Ativo` é Grupo F (`id_filial`).

---

## 3. Arquivos a entregar (31)

### Parte A — Produtos (2.5) — 7 arquivos

| # | Arquivo | O que faz |
|---|---|---|
| 1 | `app/Http/Controllers/Web/ProdutoController.php` | `index`/`create`/`edit`. `edit` carrega `ProdutoServico` (com `produto`) + `Ncm` para o select. |
| 2 | `app/Http/Controllers/Api/ProdutoApiController.php` | `index` filtra `tipo='P'`. `store` cria `ProdutoServico` (tipo P) + `Produto` em `DB::transaction`. `show`/`update`/`destroy`. |
| 3 | `resources/views/telas/produtos/index.blade.php` | Casca: `.page-header`, `.card`, `<tbody></tbody>`, `<p id="produto-vazio">`. |
| 4 | `resources/views/telas/produtos/form.blade.php` | Casca: `#produto-form-app`, inputs `produto-descricao`, `produto-codigo-interno`, `produto-ativo`, `produto-id-ncm`, `produto-unidade`. |
| 5 | `public/assets/js/produtos-list.js` | `fetch('/api/produtos')` → `tbody.innerHTML`. Vazio → `<p>` visível. |
| 6 | `public/assets/js/produtos-form.js` | Coleta, valida, `fetch POST/PUT /api/produtos`, redirect `/produtos`. |
| 7 | `tests/Feature/ProdutoApiTest.php` | 5 testes (lista, cria, cria com contexto, atualiza, destroy soft). |

### Parte B — Serviços (2.6) — 7 arquivos

| # | Arquivo | O que faz |
|---|---|---|
| 8 | `app/Http/Controllers/Web/ServicoController.php` | Idem, mas `edit` carrega `Servico` (com `servicoLc116`) + `ServicoLc116`. |
| 9 | `app/Http/Controllers/Api/ServicoApiController.php` | `index` filtra `tipo='S'`. `store` cria `ProdutoServico` (tipo S) + `Servico`. |
| 10 | `resources/views/telas/servicos/index.blade.php` | Casca. |
| 11 | `resources/views/telas/servicos/form.blade.php` | Inputs `servico-descricao`, `servico-codigo-interno`, `servico-ativo`, `servico-id-lc116`. |
| 12 | `public/assets/js/servicos-list.js` | `fetch('/api/servicos')`. |
| 13 | `public/assets/js/servicos-form.js` | `fetch POST/PUT /api/servicos`. |
| 14 | `tests/Feature/ServicoApiTest.php` | 5 testes. |

### Parte C — Ativos (2.7) — 7 arquivos

| # | Arquivo | O que faz |
|---|---|---|
| 15 | `app/Http/Controllers/Web/AtivoController.php` | `index`/`create`/`edit`. `edit` carrega `Ativo` + `centrosCusto` (via `CentroCustoRepository::ativos()`) + `filial`. |
| 16 | `app/Http/Controllers/Api/AtivoApiController.php` | `index` (por `TenantContext::getFilialId()`). `store`/`update` usam `AtivoRepository::create()`/`update()` (valida P23). `show`/`destroy`. |
| 17 | `resources/views/telas/ativos/index.blade.php` | Casca. |
| 18 | `resources/views/telas/ativos/form.blade.php` | Inputs `ativo-descricao`, `ativo-data-aquisicao`, `ativo-valor-original`, `ativo-valor-residual`, `ativo-vida-util`, `ativo-metodo`, `ativo-mes-inicial`, `ativo-id-centro-custo` (select), `ativo-destino`, `ativo-status`. |
| 19 | `public/assets/js/ativos-list.js` | `fetch('/api/ativos')`. |
| 20 | `public/assets/js/ativos-form.js` | `fetch POST/PUT /api/ativos`. |
| 21 | `tests/Feature/AtivoApiTest.php` | 6 testes (lista por filial, cria, cria com P23 ok, cria com P23 rejeita, atualiza, destroy soft). |

### Parte D — OSI (2.8) — 5 arquivos

| # | Arquivo | O que faz |
|---|---|---|
| 22 | `app/Http/Controllers/Web/OsiController.php` | `index` — carrega `ConfiguracaoHandoff` da empresa (ou `null`) + histórico (`AuditoriaRepository::porTabela('configuracoes_handoff')`). |
| 23 | `app/Http/Controllers/Api/OsiApiController.php` | `show` (config + histórico). `update` (`updateOrCreate` com `id_empresa` do contexto + registro em `auditorias`). |
| 24 | `resources/views/telas/osi/index.blade.php` | Header + badge + KPIs + toggle + tabela explicativa + histórico. |
| 25 | `public/assets/js/osi-form.js` | `fetch GET /api/osi` (popula). `fetch PUT /api/osi` (toggle + justificativa). |
| 26 | `tests/Feature/OsiApiTest.php` | 3 testes (show retorna default, update cria + audita, update atualiza). |

### Parte E — Rotas, repositório, ajustes — 5 arquivos

| # | Arquivo | O que faz |
|---|---|---|
| 27 | `app/Repositories/GrupoC/AuditoriaRepository.php` | Novo. `porTabela(string $tabela, int $idRegistro, int $limite = 20): Collection`. |
| 28 | `routes/web.php` | +4 grupos (`produtos`, `servicos`, `ativos`, `osi`). |
| 29 | `routes/api.php` | +4 (`apiResource('produtos'|'servicos'|'ativos')` + `Route::get('osi')` + `Route::put('osi')`). |
| 30 | `app/Http/Controllers/Web/UsuarioController.php` | **P136** — enxugar (remover `store`/`update`/`sincronizarAtores`). |
| 31 | `database/seeders/MenuItemSeeder.php` | **P137** — 1.0 → `/` (era `/tela-inicial`). |

**Total: 31 arquivos.**

---

## 4. Decisões (D57–D64)

| # | Decisão | Escolha |
|---|---|---|
| **D57** | Produtos e Serviços: um controller ou dois? | **Dois** (`ProdutoController` + `ServicoController`). Views separadas, campos diferentes (NCM vs LC116). |
| **D58** | OSI (2.8) é toggle ou lista de ordens? | **Toggle `handoff_ativo`** (confirmado pelo `ordem-servico-interna.js`). **Não** é lista de ordens. |
| **D59** | `Ativo.id_filial` vem do `TenantContext::getFilialId()` no store | **Sim** (R2). `AtivoRepository::create()` já valida P23. |
| **D60** | OSI: `id_empresa` vem do `TenantContext::getId()`. `updateOrCreate` no update. | **Sim.** |
| **D61** | `Servico` tem `id_servico_lc116` (não `id_lc116`). | Confirmado. |
| **D62** | `Produto` tem `timestamps` próprios (`created_at`/`updated_at`). | Confirmado pelo `show columns`. |
| **D63** | `ProdutoServicoRepository::produtos()`/`servicos()` já existem. | Usar. Não recriar. |
| **D64** | `AuditoriaRepository` (Grupo C) para histórico da OSI. | **Novo.** `porTabela()`. |
| **D65** | Lista de produtos: `descricao`, `codigo_interno`, `ncm.codigo`, `unidade`, `ativo` + ações. **Sem** filtro de status. | Padrão 9.1a (simples). |
| **D66** | Lista de serviços: `descricao`, `codigo_interno`, `lc116.codigo`, `ativo` + ações. **Sem** filtro. | — |
| **D67** | Lista de ativos: `descricao`, `data_aquisicao`, `valor_original`, `status`, `centro_custo.nome` + ações. | Join com `CentroCusto`. |
| **D68** | `dados_extras` **fora do form** (JSON livre, sem UI). | Só na API. |
| **D69** | Histórico da OSI na tabela `auditorias` (não em `dados_extras`). | `AuditoriaRepository::porTabela('configuracoes_handoff', $id)`. |
| **D70** | `OsiController::index` (tela única) — **não** tem `edit` separado. | O `ordem-servico-interna.js` é uma tela só. |

---

## 5. Critérios de aceite

### Produtos (2.5)
- [ ] `/produtos` lista produtos da empresa do contexto.
- [ ] `/produtos/create` cria `ProdutoServico` (tipo P) + `Produto` em transação.
- [ ] `/produtos/{id}/edit` edita.
- [ ] `DELETE /api/produtos/{id}` faz soft delete.
- [ ] Teste de isolamento: empresa 1 não vê empresa 2.
- [ ] 5 testes verdes.

### Serviços (2.6)
- [ ] Idem, com `tipo S` e `id_servico_lc116`.
- [ ] 5 testes verdes.

### Ativos (2.7)
- [ ] `/ativos` lista ativos **da filial** do contexto.
- [ ] `store` usa `AtivoRepository::create()` (valida P23).
- [ ] `store` com `id_centro_custo` de outra empresa → `422`.
- [ ] `destroy` soft delete.
- [ ] 6 testes verdes.

### OSI (2.8)
- [ ] `/osi` mostra toggle + histórico.
- [ ] Toggle chama `PUT /api/osi` com `justificativa`.
- [ ] `PUT /api/osi` faz `updateOrCreate` + registra em `auditorias`.
- [ ] 3 testes verdes.

### Geral
- [ ] `php artisan test` → **56 verdes** (37 anteriores + 19 novos).
- [ ] `composer lint` → **0 erros**.
- [ ] `php artisan route:list | grep -E "produtos|servicos|ativos|osi"` → rotas Web e API com `api.` na API.
- [ ] P136/P137 fechadas.

---

## 6. Riscos e mitigações

| Risco | Mitigação |
|---|---|
| **`Produto`/`Servico` sem timestamps** (a migration `produtos` **tem** — confirmado pelo `show columns`). | Nenhum. Usar `Model::create()` direto. |
| **`Ativo` valida P23** — o `AtivoRepository` já faz. | Usar `AtivoRepository::create()`/`update()`. |
| **Colisão de nomes Web/API** (`produtos.index` vs `api.produtos.index`). | `->name('api.')` no grupo. |
| **`TenantContext` vazio na API** (D56). | `['web', 'auth', 'tenant']` no `api.php`. |
| **`AuditoriaRepository` não existe** — criar. | `porTabela($tabela, $idRegistro, $limite = 20)`. |
| **`OsiController` sem `edit`** (tela única). | `index` faz tudo (toggle + histórico). |
| **`dados_extras` no form** — decisão: **fora**. | Só na API. |

---

## 7. Ordem de implementação sugerida

1. **`AuditoriaRepository`** (Parte E, #27) — base para OSI.
2. **Produtos** (Parte A, #1–7) — mais simples (só `tipo P`).
3. **Serviços** (Parte B, #8–14) — cópia de Produtos com `tipo S`.
4. **Ativos** (Parte C, #15–21) — mais complexo (Grupo F + P23).
5. **OSI** (Parte D, #22–26) — depende de `AuditoriaRepository`.
6. **Rotas** (Parte E, #28–29).
7. **P136** (enxugar `UsuarioController`).
8. **P137** (seeder 1.0 → `/`).
9. **`php artisan test` + `composer lint`**.
10. **Atualizar `15_implementacao.md`** (§1, §3.33, §5, §7).

---

## 8. Checklist final (para o chat futuro)

Antes de começar:
- [ ] Ler `15_implementacao.md` §7 (padrões).
- [ ] Ler este documento (§1–§6).
- [ ] Conferir que os 37 testes atuais passam (`php artisan test`).
- [ ] Conferir que `composer lint` está zerado.

Ao codar cada recurso:
- [ ] WebController (só `index`/`create`/`edit`).
- [ ] ApiController (CRUD, R2 no store/update, model binding).
- [ ] View index (casca + `<tbody></tbody>` + `<p id="...-vazio">`).
- [ ] View form (casca + `<input id="...">` + `<button type="button" id="...-salvar">`).
- [ ] JS list (`fetch GET`, `tbody.innerHTML`, vazio).
- [ ] JS form (`fetch POST/PUT`, CSRF, redirect).
- [ ] Rotas Web + API (com `->name('api.')` e `['web', 'auth', 'tenant']`).
- [ ] Testes (5–6 por recurso).
- [ ] Rodar `php artisan test` + `composer lint`.

Ao fechar:
- [ ] Atualizar `15_implementacao.md` (§1 status, §3.33 o que existe, §5 pendências, §7 se descobriu padrão novo).
- [ ] Fechar P136/P137 no `06_pendencias.md`.
- [ ] Rodar `git status` e commitar.

---

## 9. Referência rápida (schemas)

### `produtos_servicos`
`id`, `id_empresa` (FK), `tipo` (P/S), `codigo_interno` (50, nullable), `descricao` (300), `ativo` (bool), `dados_extras` (JSON), `created_at`, `updated_at`, `deleted_at`, `created_by`, `updated_by`, `deleted_by`.

### `produtos`
`id`, `id_produto_servico` (FK unique), `id_ncm` (FK nullable), `unidade` (10, nullable), `dados_extras` (JSON), `created_at`, `updated_at`.

### `servicos`
`id`, `id_produto_servico` (FK unique), `id_servico_lc116` (FK nullable), `dados_extras` (JSON), `created_at`, `updated_at`.

### `ativos`
`id`, `id_filial` (FK), `descricao` (200), `data_aquisicao` (date), `valor_original` (decimal 15,2), `valor_residual` (decimal 15,2), `vida_util_meses` (int), `metodo_depreciacao` (20), `mes_inicial_depreciacao` (char 7), `id_centro_custo` (FK nullable), `destino` (10), `status` (20), `dados_extras` (JSON), timestamps, softDeletes.

### `configuracoes_handoff`
`id`, `id_empresa` (FK unique), `handoff_ativo` (bool), `dados_extras` (JSON), `created_at`, `updated_at`.

### `auditorias`
`id`, `id_usuario` (FK nullable), `acao` (50), `tabela` (50), `id_registro` (bigint nullable), `dados_anteriores` (JSON), `dados_novos` (JSON), `justificativa` (text), `ip` (45), `created_at`.

---

## 10. Histórico de versões

| Versão | Data | Mudança |
|---|---|---|
| 1.0 | 2026-11-03 | Criação. Planejamento do Bloco 9.1b (Produtos, Serviços, Ativos, OSI). 31 arquivos, decisões D57–D70, 19 testes. |