---
documento: implementacao
versao: 1.11
data: 2026-11-03
proposito: Acompanhamento da implementação — status, decisões técnicas, divergências, pendências e próximos passos
depende_de: [00_indice, 01_visao_geral, 04_modelo_de_dados, 07_atores_fluxo, 09_menu_numeracao, 10_modelo_dados_fisico, 11_wireframe, 12_tela_inicial]
---


# Implementação — Acompanhamento

> **O que é este documento:** registro do que já foi **codado**, das **decisões técnicas** tomadas na prática (que às vezes divergem do papel), das **pendências** e dos **próximos passos**. É um diário de bordo da implementação, não a especificação funcional.
>
> **Onde fica:** `docs/15_implementacao.md`, versionado junto com o código.
>
> **Como usar:** ao retomar o projeto, ler a seção 1 (status) e a seção 5 (pendências). Ao codar, atualizar a seção 3 (o que foi feito) e a seção 4 (divergências).

---

## 1. Status geral

| Bloco | O que entrega | Status |
| :--- | :--- | :--- |
| **0 — Setup** | Laravel 12, MariaDB, Pest 3, Pint | ✅ Concluído |
| **1 — Migrations de domínio** | 10 tabelas | ✅ Concluído |
| **2 — Empresas e filiais** | `empresas`, `filiais`, trait `BelongsToTenant`, `TenantContext`, factories | ✅ Concluído |
| **3 — Comandos de importação** | 5 comandos | ✅ Concluído |
| **4 — Seeders finais** | 6 seeders | ✅ Concluído |
| **5 — Frontend (layout + CRUD empresas/filiais)** | Layout Blade, menu, API + fetch | ✅ Concluído |
| **6 — Demais 51 tabelas** | 6.1 a 6.20 concluídos; 6.21 parcial | ✅ Concluído |
| **7 — Auth + contexto real + menu por ator** | Login, `SetTenantContext` real (4-tupla), `MenuItemSeeder` reescrito, `MenuService`, `menu.js` plugado, layout `auth` | ✅ Concluído |
| **8 — Telas "Meu Trabalho" (1.0–1.3)** | Tela Inicial (10 variantes + fallback) — **8.1 ✅**; Caixa de Entrada/Saída/Histórico — **8.2 ✅**; dropdown de filial; 25 testes verdes | ✅ Concluído (8.3 opcional pendente) |
| **9 — Telas de cadastro (2.x + 4.x)** | Configurador (2.1–2.8), Contador (4.1–4.11) | ⏳ Pendente (9.1a próximo) |
| **10 — Telas de operação (5.x–8.x + 10.x)** | Comprador, Faturista, Financeiro1/2, Gerente, RH | ⏳ Pendente |
| **11 — Telas do Administrador (3.x)** | DRE, Fluxo, Análise, Posição, Relatórios avançados (3.10–3.17), Conselheiro (3.18) | ⏳ Pendente |
| **12 — Telas do Auditor (11.x) + Administração (12.x)** | Auditoria (11.1–11.8), Administração (12.1–12.5) | ⏳ Pendente |
| **13 — Handoff + serviços de negócio** | Serviço de baixa (P66), motor de classificação (P64), handoff (T8.1–T8.12) | ⏳ Pendente |

**Resumo:** **63 tabelas**, **63 models**, **35 repositórios** (`BaseRepository` + A/F/C/H + 3 novos: `AtorFuncionalRepository`, `MenuItemRepository`, `DashboardRepository`), **6 services** (`MenuService`, `TelaInicialService`, `TarefaService`, `TenantContext`, `FilialContextController`…), **3 views de domínio** + **telas de tarefas** + **Tela Inicial**, **10 seeders**, **lint de SQL cru zerado**, **25 testes verdes**.
**Bloco 7 concluído (v1.7):** `MenuItemSeeder` (~93 itens), `TenantContext` 4-tupla, `SetTenantContext` real, `LoginController`, `Usuario` sem `BelongsToTenant` (P98/D27), `UsuarioRepository` com filtro manual. **Login funcionando.**
**Bloco 8.1 concluído (v1.9):** `TelaInicialService` (variante por ator — configurador vence), `TarefaRepository::contarPendentesDoAtor()` + `primeirasOrdensDoAtor()`, 10 partials (3.1–3.10) + `universal` + 4 sub-partials, CSS `.ti-*` mínimo, 4 testes Pest verdes. **P113** (`TenantContext` singleton), **P114** (`UsuarioFactory`), **P112** (`filiais.nome_fantasia`).
**Bloco 8.2 concluído (v1.11):** `TarefaController` (entrada/saída/histórico), `TarefaService` delegando ao `TarefaRepository`, `FilialContextController` (P95), `UsuarioSeeder` com 10 usuários (P110), "Lembrar-me" removido (P111), `TenantContext` singleton (P113), lint de SQL cru zerado (P116/P124/P127), `AppServiceProvider`/`MenuService`/`Usuario` usando `GrupoF\FilialRepository` (P128), **25 testes verdes**. Próximo: **9.1a** (Centros de Custo + Usuários).
**Decisão de fatiamento (v1.5):** o antigo "Bloco 7 — Auth + API + telas" foi **fatiado em 7–13**. Motivo: os 4 documentos funcionais (`07`, `09`, `11`, `12`) mostram que o escopo é **muito** maior do que uma linha. Fazer tudo em um bloco só viraria um "big bang" impossível de testar.

---

## 2. Ambiente

| Item | Versão/Decisão |
| :--- | :--- |
| PHP | 8.5.4 |
| Laravel | 12.x |
| Banco | MariaDB (`DB_CONNECTION=mariadb`) |
| Testes | Pest 3 (PHPUnit 11) |
| Lint | Pint (preset `laravel`) + `scripts/check-raw-sql.sh` |
| Frontend | Blade + JS (fetch) |
| Assets | `public/assets/` (copiados do wireframe) |

### Como rodar

```bash
# 1. Migrations (63 tabelas + 3 views)
php artisan migrate

# 2. Domínios (UFs, bancos, CSTs, tipos, atores)
php artisan db:seed --class=UfSeeder
php artisan db:seed --class=BancoSeeder
php artisan db:seed --class=CstSeeder
php artisan db:seed --class=TipoDocumentoSeeder
php artisan db:seed --class=AtorFuncionalSeeder

# 3. Domínios grandes (arquivos em database/data/)
php artisan importar:municipios
php artisan importar:cnae
php artisan importar:ncm
php artisan importar:cfop
php artisan importar:lc116

# 4. Empresa de teste (ID = 1)
php artisan db:seed --class=EmpresaFilialSeeder

# 5. Configuração (6.17)
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

---

## 3. O que foi implementado

### 3.1 a 3.7 — Blocos 0 a 6.4 (v1.0–v1.2)
Setup, domínios, empresas/filiais/trait, importação, seeders, frontend, e as 19 tabelas de 6.1–6.4.

### 3.8 a 3.21 — Blocos 6.5 a 6.17 (v1.3)
38 tabelas, 38 models, 8 seeders. Detalhes na v1.3. Resumo:
- **6.5–6.9:** ativos, documentos fiscais, contas a pagar/receber, lançamentos, folha, depreciação/provisões.
- **6.10–6.14:** classificação, parâmetros, razão de impostos/pendências, simulação, usuários/auditoria.
- **6.15–6.17:** handoff/ordens, menu, 9 models de domínio, 8 seeders.
- **Correções:** constraint longa em `folhas_pagamento_proventos_descontos` (6.8); namespace em `MenuItem`/`MenuItemAtor` (6.17).

### 3.22 Bloco 6.18 — Repositories (32)
- `BaseRepository` + 10 do Grupo A + 17 do Grupo F + 4 do Grupo C + 1 do Grupo H.
- Validações cruzadas: P23 (ativo × centro de custo), P31 (lançamento × item de nota), P45 (usuário × filial), P48 (documentos encadeados).
- `RepositoryServiceProvider` registra os 32.
- **P72:** `vigentes()` usa `whereDate` (não `where`) por causa do SQLite.

### 3.23 Bloco 6.19 — Views (3)
- `vw_saldo_contas_bancarias`, `vw_posicao_caixa`, `vw_caixa_entrada` (migrations 000052–000054).
- SQL fiel ao DDL. **Não filtram tenant** (R2 é do repositório — D21).

### 3.24 Bloco 6.20 — Lint de SQL cru
- `scripts/check-raw-sql.sh` varre `app/` (exceto repositórios, migrations, seeders, tests).
- Falha com exit 1 em violação. Avisa sobre `withoutGlobalScope` (P65/P67).
- `composer lint` roda Pint + lint SQL.

### 3.25 Bloco 6.21 — Testes Pest de isolamento (parcial)
- `tests/Feature/IsolamentoTest.php` — **12 testes verdes**: Grupo A (3), Grupo F (1), Grupo H (2), P23 (2), P45 (2), 4-tupla (1), `MenuService` (1).
- `tests/Feature/TarefasTest.php` — **4 verdes**.
- `tests/Feature/TelaInicialTest.php` — **4 verdes**.
- `tests/Feature/TenantIsolationTest.php` — **2 verdes**.
- `tests/Feature/ExampleTest.php` — **3 verdes**.
- **Pendentes (6.21.2):** `GrupoFTest` (17 tabelas), `GrupoCTest` (filhas puras), `ValidacoesCruzadasTest` (P31, P48), 13 factories restantes.

### 3.26 Leitura dos 4 documentos funcionais (v1.5)
Foram lidos: `07_atores_fluxo.md`, `09_menu_numeracao.md`, `11_wireframe.md`, `12_tela_inicial.md`. Impactos:
- **`09`:** o `MenuItemSeeder` (6.17) tem **28 itens chutados**; o real tem **~93 itens em 12 blocos**. P58 **reaberta**.
- **`07`:** o ator é **por filial** (`usuario_ator.id_filial`); o contexto de auth **não é só `id_empresa`** — é `(id_usuario, id_empresa, id_filial, id_ator_funcional)`. `configurador` tem acesso total (não precisa de outras tags). Handoff fixo, ativação por empresa.
- **`11`:** são **71 telas** (63 do menu + 8 relatórios), não 28. O wireframe é HTML/CSS/JS com mock; o Bloco 7+ substitui o mock por API.
- **`12`:** a Tela Inicial tem **11 variantes** (uma por ator), não 1.

### 3.27 Plano de pendências (v1.5)

O Bloco 7 foi **fatiado em 7–13** (ver seção 6). Motivo: o escopo real (auth 4-tupla + menu por ator + 71 telas + handoff) é **grande demais** para um bloco só. Fatiar permite testar cada parte.

**Ordem dos sub-blocos:**
- **7** (auth + contexto + menu) → **8** (Meu Trabalho) → **9** (cadastros) → **10** (operação) → **11** (Administrador) → **12** (Auditor + Administração) → **13** (handoff + serviços).

### 3.28 Bloco 7 parte 1/2 — Auth + contexto 4-tupla + login (v1.6)

- **`MenuItemSeeder` reescrito** com os ~93 itens do `09_menu_numeracao.md` (P58). 12 blocos, fase 1/2, vinculação por ator (`syncWithoutDetaching`). Itens do Bloco 1 (Meu Trabalho) são universais (`'*'`).
- **`TenantContext` estendido para 4-tupla** (P82): `set(empresaId, filialId, usuarioId, atorFuncionalId)`. Métodos `getId()`, `getFilialId()`, `getUsuarioId()`, `getAtorFuncionalId()`, `isConfigurador()`. O `getId()` continua retornando `id_empresa` (compatível com `BelongsToTenant` e `BaseRepository`).
- **`SetTenantContext` middleware** (P85): após `Auth`, resolve a 4-tupla a partir do usuário logado. Filial vem da sessão (`session('filial_id')`) ou da primeira `usuario_atores` ativa. Ator é o primeiro da filial (P94/P100 — o `MenuService` vai juntar todos).
- **`LoginController`** (P84): `showLoginForm`, `login`, `logout`. O `login` usa `Auth::attempt` (agora funciona — `Usuario` sem trait, D27). O `logout` invalida sessão.
- **`Usuario` sem `BelongsToTenant`** (P98, D27): o `id_empresa` é **identidade**, não escopo. O `UsuarioRepository` aplica o filtro manualmente (P98).
- **`Usuario` com `getAuthPassword()` e `getAuthPasswordName()`** (D14): retornam `senha_hash`. O `Auth::attempt` funciona sem migration de `password`.
- **Rotas de auth** (`/login`, `POST /login`, `POST /logout`) + middleware `tenant` no grupo autenticado.
- **`login.blade.php`** criado (herda `layouts.app` — P97: precisa de layout `auth` limpo na parte 3).
- **`UsuarioSeeder` ajustado** para criar `usuario_atores` do admin na primeira filial (P102).
- **Erros corrigidos:** `composer dump-autoload` (LoginController não encontrado), `config/auth.php` apontando para `Usuario::class` (era `User`), `getAuthPasswordName()` retornando `senha_hash` (era `password`), remoção da trait do `Usuario` (global scope `WHERE 1 = 0` sem contexto).

### 3.29 Bloco 7 parte 3 — MenuService + menu.js + layout auth + Dev guard (v1.7)

- **`MenuService`** (P86/P92/P94/P100): menu por ator, união de **todos** os atores da filial; `configurador` vê tudo. `ICONES`/`BLOCOS` hardcoded (o banco não guarda ícone).
- **`menu.js`** (P15/P16/P87): Ctrl+K, badge, alerta melhorado, navegação via `window.location.href = item.rota` (rotas reais do banco).
- **`layouts/auth.blade.php`** (P97/P101): só `styles` + `content`, sem sidebar/topbar/scripts. `auth/login.blade.php` herda dele.
- **`SetTenantContextDev`** (P96): guarda `app()->environment('local', 'testing')` — no-op em produção.
- **Testes:** 2 testes 4-tupla no `IsolamentoTest`.

### 3.30 Bloco 8.1 — Tela Inicial por ator (v1.9)

- **`TelaInicialService`:** resolve o ator principal (configurador vence), variante por código, contadores, 3 primeiras ordens (RN7), usuário, filial (`nome_fantasia`), período.
- **`TarefaRepository`:** `contarPendentesDoAtor()` e `primeirasOrdensDoAtor()`.
- **10 partials por ator** + `universal` + 4 sub-partials (`_kpis`, `_alertas`, `_acoes`, `_ordens`).
- **CSS `.ti-*`** mínimo viável.
- **4 testes Pest verdes.**

### 3.31 Bloco 8.2 — Caixa de Entrada, Saída e Histórico + troca de filial (v1.11)

- **`TarefaService`** (ajuste): delega tudo ao `TarefaRepository`.
- **`TarefaRepository`** (ajuste): `caixaSaidaDoAtor(int $idAtor)` e `historicoDoAtor(int $idAtor, int $limite = 50)`.
- **`TarefaController`:** 3 ações (`entrada`, `saida`, `historico`).
- **3 views** (`telas/tarefas/{entrada,saida,historico}.blade.php`) + `_tabela.blade.php`.
- **`routes/web.php`:** `tarefas.entrada`, `tarefas.saida`, `tarefas.historico`.
- **`MenuItemSeeder` (ajuste — P117):** rotas `/tarefas/entrada` etc.
- **Troca de filial (P95):** `FilialContextController`, `POST /contexto/filial`, view composer do `topbar`, `<select>` no `topbar.blade.php`.
- **`UsuarioSeeder` (P110):** admin (configurador) + 9 usuários de teste (`contador@gestor.local`, etc., senha `password`).
- **`auth/login.blade.php` (P111):** "Lembrar-me" removido.
- **Correções de lint (R2):** `MenuService`, `TelaInicialService`, `Usuario::filiaisPermitidas()` delegam a repositórios. Criados `AtorFuncionalRepository`, `MenuItemRepository`, `DashboardRepository`. `AppServiceProvider` com composer do `topbar` via `FilialRepository`.
- **`TenantContext` singleton** (P113) — sem isso, middleware e service não compartilham a 4-tupla.
- **`CentroCustoFactory`** criada (P124).
- **`ExampleTest`, `TenantIsolationTest`, `IsolamentoTest`** ajustados (P121/P122/P123).
- **Testes (25 verdes):** `TelaInicialTest` (4), `TarefasTest` (4), `IsolamentoTest` (12), `TenantIsolationTest` (2), `ExampleTest` (3).

---

## 4. Divergências entre documentação e código

| # | Documento diz | Código faz | Motivo | Ação |
| :--- | :--- | :--- | :--- | :--- |
| D1 | `ncms.codigo` é `char(8)` | `varchar(10)` + hierarquia | NCM é hierárquico | ✅ registrado no `10` v1.2 |
| D2 | `descricao` é `varchar(200/300)` em 4 tabelas | `TEXT` | Descrições longas | ✅ registrado no `10` v1.2 |
| D3 | `csts` não tem IBS/CBS | Tem | LC 214/2025 | ✅ registrado no `10` v1.2 |
| D4 | Seeds vêm de "arquivos oficiais" | `.xls`/`.xlsx`/`.txt` + GitHub | Fontes instáveis | Documentar |
| D5 | Pest 4 | Pest 3 (PHPUnit 11) | Conflito de versão | Documentar |
| D6 | `empresas.id_filial_matriz` tem FK | ✅ FK adicionada | Dependência circular | ✅ |
| D7 | Views existem | ✅ 6.19 | — | ✅ |
| D8 | Repositories existem | ✅ 6.18 | — | ✅ |
| D9 | `empresa` tem listagem/criação | Só edição (uma empresa) | Só existe uma | Documentar no `04`/`01` |
| D10 | `SetTenantContextDev` com `append` | `prepend` | Binding antes do contexto | Documentar |
| D11 | `geral.js` chama `showScreen('empresa')` | Removido | Sobrescrevia o Blade | Documentar |
| D12 | `partials/scripts.blade.php` com todos os scripts | Só essenciais | `dados-simulados.js` quebrava | Documentar |
| D13 | `usuarios` vem depois de `periodos` | Antecipado | FK de `periodos` → `usuarios` | Documentar |
| D14 | `usuarios.senha_hash` | `getAuthPassword()` retorna `senha_hash` | Laravel espera `password` | ✅ Bloco 7 |
| D15 | `periodos.id_usuario_fechamento` sem FK | FK adicionada | Ordem de migrations | Documentar |
| D16 | CHECKs do DDL | Sem CHECK no migration | SQLite não roda CHECK | ✅ registrado no `10` v1.2 (1.9) |
| D17 | `04` chama `menu_item` (singular) | DDL chama `menus_itens` (plural) | O DDL é o que está no banco | ✅ registrado no `10` v1.2 / `04` v1.5 |
| D18 | `empresas` sem FK de `id_filial_matriz`/`id_plano_contas_sugerido` | FK via ALTER em 6.1 | Dependência circular | ✅ registrado no `10` v1.2 |
| D19 | `04` diz `auditoria` (singular) | Código usa `auditorias` (plural) | Consistência com DDL | ✅ registrado no `04` v1.5 |
| D20 | `vigentes()` compara datas com `where` | Usa `whereDate` | SQLite compara string | ✅ registrado no `10` v1.2 (1.10) |
| D21 | Views filtram por empresa | **Não** filtram | Fiel ao DDL (R2 é do repositório) | ✅ registrado no `10` v1.2 |
| D22 | Lint de SQL cru é infalível | Heurístico (grep) | Análise estática limitada | Documentar limite |
| **D23** | Bloco 7 = "Auth + API + telas" (uma linha) | **Fatiado em 7–13** | Escopo real (71 telas + auth 4-tupla + handoff) | ✅ registrado no `15` v1.5 |
| **D24** | `TenantContext` só com `id_empresa` | **Precisa 4-tupla** (`id_usuario`, `id_empresa`, `id_filial`, `id_ator_funcional`) | `07_atores_fluxo` (ator por filial) | ✅ registrado em 7.2 |
| **D25** | Menu é uma lista fixa | **Renderizado por ator** (união das tags na filial) | `09_menu_numeracao` (12 blocos) | ✅ registrado em 7.5 |
| **D26** | `MenuItemSeeder` tem 28 itens | Real tem **~93 itens** | `09_menu_numeracao` (12 blocos) | ✅ registrado em 7.4 |
| **D27** | `Usuario` é Grupo A (tem `id_empresa`) e usa `BelongsToTenant` | **`Usuario` sem a trait.** `UsuarioRepository` aplica `where('usuarios.id_empresa', $t)` manualmente | O `id_empresa` do `Usuario` é **identidade**, não escopo. O `Auth::attempt` não tem contexto | ✅ registrado no `04` v1.6 |
| **D28** | `MenuItemSeeder` tem ~93 itens | Tem **76** itens | Contagem real do arquivo | ✅ registrado em 7.4 |
| **D29** | `menus_itens` guarda ícone/bloco | Só `codigo`/`nome`/`rota`/`fase`/`dados_extras` | Schema do DDL | ✅ `MenuService` mescla ícones via mapa PHP |
| **D30** | `menu.js` filtra por ator no client | Filtro migrou pro `MenuService` (server) | Segurança + P86/P92 | ✅ registrado em 7.5 |
| **D31** | Wireframe tinha `seletor-ator.js` (mock) para trocar de ator na UI | Produção **não tem** troca de ator na UI. Ator é identidade (`usuarios_atores`), não escolha em runtime. Trocar de ator = trocar de usuário (logout/login) | Segurança + coerência com `07_atores_fluxo` | **P130** (documentar no `07_atores_fluxo`) |
| **D32** | `TenantContext` é um "serviço" qualquer | Precisa ser **singleton** para funcionar (middleware e services compartilharem a 4-tupla) | Laravel resolve não-singleton como instância nova a cada `app()`/injeção | ✅ registrado em 8.1 (P113) |
| **D33** | `12_tela_inicial` fala em 11 variantes | São **10 atores** (§3.1–§3.10) + o **card do Conselheiro** (§3.11) dentro do partial `administrador` — não é 11º partial | Leitura fiel do doc | ✅ registrado em v1.9 |
| **D34** | `TarefaRepository::query()` é `protected` no `BaseRepository` | Para as 3 telas de "Meu Trabalho", os métodos `caixaSaidaDoAtor`/`historicoDoAtor` precisaram ir **para o repositório** (não para o `TarefaService`) | `query()` protegido força isso; service só delega | ✅ registrado em 8.2 (P116) |
| **D35** | Menu 1.1/1.2/1.3 aponta para `/caixa-entrada`, `/caixa-saida`, `/historico` (seeder v1.6) | Agora aponta para `/tarefas/entrada`, `/tarefas/saida`, `/tarefas/historico` | Rotas nomeadas (`tarefas.*`) mais limpas que as strings do seeder | ✅ registrado em 8.2 (P117) |
| **D36** | Login tem "Lembrar-me" (`remember`) | Checkbox removido | `usuarios` não tem `remember_token` (P111) | ✅ registrado em 8.2 |
| **D37** | `AppServiceProvider`/`MenuService`/`Usuario` usavam `GrupoA\FilialRepository` | Correto é **`GrupoF\FilialRepository`** | O `RepositoryServiceProvider` registra em GrupoF | ✅ corrigido em v1.11 (P128) |

---

## 5. Pendências técnicas

| # | Pendência | Status |
| :--- | :--- | :--- |
| ~~P1~~ | Testes de isolamento (Pest) | ✅ 10 testes em 6.21 |
| ~~P2~~ | 38 tabelas restantes | ✅ 6.17 |
| ~~P3~~ | Views não criadas | ✅ 6.19 |
| ~~P4~~ | Repositories não criados | ✅ 6.18 |
| ~~P5~~ | **`SetTenantContext` real** | ✅ **feito em 7.2/7.3** (v1.6) |
| ~~P6~~ | **`SetTenantContext` middleware** | ✅ **feito em 7.3** (v1.6) |
| ~~P7~~ | FK de `empresas.id_filial_matriz` | ✅ 6.1 |
| P11 | `csts.descricao` pode precisar de `TEXT` | Verificar |
| P12 | CNAE guarda 7 dígitos (sem formatação) | Documentar no `04` |
| ~~P13~~ | `ncms` hierárquico sem model | ✅ 6.16.1 |
| ~~P14~~ | `seletor-ator.js` removido do layout | ✅ 7.5 |
| ~~P15~~ | `menu.js` mostra alerta "Tela ainda não implementada" | ✅ 7.6 (melhorado) |
| ~~P16~~ | `geral.js` tem `showScreen` | ✅ 7.6 (removido do `menu.js`) |
| P17 | `empresa.js` não trata edição de filial matriz | Bloco 9 |
| ~~P18~~ | Testes Pest de isolamento | ✅ 6.21 |
| ~~P19–P22~~ | Seeders de configuração | ✅ 6.17 |
| ~~P23~~ | `Ativo.id_centro_custo` × empresa da filial | ✅ 6.18 + 6.21 |
| P24 | CHECKs do DDL — FormRequest | Blocos 9–12 |
| P25 | `notas_fiscais_vinculos` sem `created_at`/`created_by` | Bloco 13 |
| P26 | `notas_fiscais.status_importacao`/`status_fluxo` sem CHECK | Bloco 10 |
| P27 | `chave` (44) nullable + unique — validar no parser de XML | Bloco 10 |
| P28 | `lancamentos.status_classificacao` e `tipo_lancamento` sem CHECK | Bloco 13 |
| P29 | `contas_pagar.status` e `contas_receber.status` sem CHECK | Bloco 10 |
| P30 | `status_fluxo` strings livres — canônico depende do `08_ordens` | Bloco 13 |
| ~~P31~~ | `lancamentos.id_nota_fiscal_item` × `id_nota_fiscal` | ✅ 6.18 + 6.21 |
| P32 | `folhas_pagamento.status` sem CHECK | Bloco 10 |
| P33 | `folhas_pagamento_proventos_descontos` sem `created_at`/`created_by` | Bloco 13 |
| P34 | `provisoes.tipo` sem CHECK | Bloco 10 |
| P35 | `depreciacoes` sem unique `(id_filial, id_ativo, id_periodo)` | Bloco 13 |
| P36 | `RegraClassificacaoLog.created_at` preenchido manualmente | Bloco 13 |
| P37 | `regras_classificacao.prioridade` (1–8) e `origem` sem CHECK | Bloco 9 |
| P38 | `parametros_fiscais` sem unique | Bloco 9 |
| P39 | `tabelas_inss` e `tabelas_irrf` sem CHECK `valor_final >= valor_inicial` | Bloco 10 |
| ~~P40~~ | `ParametroFiscal` global scope local | ✅ 6.21 |
| P41 | `razoes_impostos` sem unique | Bloco 13 |
| P42 | CHECKs de `natureza`/`categoria`/`status` em `razoes_impostos` e `pendencias` | Bloco 12 |
| P43 | `cenarios_simulacao` sem unique `(id_empresa, nome)` | Bloco 11 |
| P44 | CHECK de `status` em `cenarios_simulacao` | Bloco 11 |
| ~~P45~~ | `usuarios_atores.id_filial` × `usuario.id_empresa` | ✅ 6.18 + 6.21 |
| P46 | `usuarios_filiais` é legado — decidir remoção | Bloco 7 parte 3 |
| P47 | `auditorias` sem `id_empresa`/`id_filial` | Bloco 12 |
| ~~P48~~ | `documentos_encadeados` polimórfico sem FK | ✅ 6.18 + 6.21 |
| P49 | `documentos_encadeados` sem unique | Bloco 13 |
| P50 | `tarefas` sem `created_at` — `data_criacao` preenchido pelo repositório | Bloco 8.3 |
| ~~P51~~ | `menus_itens` sem seed | ✅ 6.17 / 7.4 |
| P52 | CHECK de `fase` em `menus_itens` | Bloco 7 parte 3 |
| P53 | `AtorFuncional` — confirmar `$timestamps` | Verificar |
| P54 | Confirmar `created_at`/`updated_at` nas 10 tabelas de domínio | Verificar |
| P55 | Confirmar `ncms` com `id_ncm_pai`, `aceita_lancamento`, `nivel` | Verificar |
| P56 | `app/Models/x` (0 bytes) — apagar | Ação manual |
| P57 | `PlanoContaSeeder` com `id_empresa = 1` hardcoded | Bloco 7 parte 3 |
| ~~P58~~ | `MenuItemSeeder` reescrito (~93 itens) | ✅ 7.4 |
| P59 | `UsuarioSeeder` com senha fraca — trocar em prod | Bloco 7 parte 3 |
| P60 | `PeriodoSeeder` só empresa 1 — multi-empresa real | Bloco 7 parte 3 |
| P61 | Grupo U sem repositório — padronizar | Bloco 7 parte 3 |
| ~~P62~~ | `BaseRepository` confia na trait para filtro | ✅ 6.18.1 |
| P63 | `Pessoa::tags()` precisa existir para `PessoaRepository::porTag()` | Verificar |
| P64 | `RegraClassificacaoRepository::candidatas()` é primeira versão | Bloco 13 |
| ~~P65~~ | `withoutGlobalScope('tenant')` intencional em 5 repositórios | ✅ aceito |
| P66 | `baixar()`/`receber()` mudam status mas **não** criam lançamento contábil | Bloco 13 |
| ~~P67~~ | `LancamentoRepository::create()` valida P31 via `withoutGlobalScope` | ✅ aceito |
| P68 | `NotaFiscalItemRepository::porNota()` não valida escopo — pai valida | Documentar |
| P69 | `DocumentoEncadeadoRepository::resolverModel()` usa heurística | Bloco 13 |
| ~~P70~~ | `IsolamentoTest` depende de factories — criadas em 8.1/8.2 | ✅ |
| P71 | `RepositoryServiceProvider` lista 35 repositórios manualmente | Manter |
| ~~P72~~ | `vigentes()` corrigido com `whereDate` | ✅ 6.18.2 |
| ~~P73~~ | `UsuarioAtorRepository`/`AtivoRepository` dependem de atores/centros no teste | ✅ 6.21 |
| ~~P74~~ | `dump()` removido do teste H | ✅ |
| P75 | Views não filtram tenant — R2 é do repositório | Documentar no `10` |
| P76 | `vw_posicao_caixa` com `SUM` — OK se uma filial tiver 2 contas | OK |
| P77 | `vw_caixa_entrada` com `ORDER BY` na view | OK |
| P78 | Lint de SQL cru é heurístico | Documentar limite |
| P79 | Lint varre `app/` incluindo controllers | OK |
| P80 | Whitelist de `withoutGlobalScope` é por arquivo, não por linha | Aceitável |
| P81 | `composer lint` roda Pint + SQL; Pint falha, SQL não roda | CI separado |
| ~~P82~~ | **`TenantContext` 4-tupla** | ✅ **feito em 7.2** (v1.6) |
| ~~P83~~ | **`BelongsToTenant` continua funcionando com a 4-tupla?** | ✅ **compatível** (v1.6) |
| ~~P84~~ | **Login/logout** | ✅ **feito em 7.1** (v1.6) |
| ~~P85~~ | **Middleware `SetTenantContext`** | ✅ **feito em 7.3** (v1.6) |
| ~~P86~~ | **Menu por ator** | ✅ **7.5** |
| ~~P87~~ | **Campo "Ir para" (Ctrl+K)** | ✅ **7.6** |
| P88 | **As 71 telas** — faltam 68 | Blocos 9–12 |
| P89 | **Substituir `dados-simulados.js` por API real** | Blocos 9–12 |
| P90 | **Testes de cada tela** | Blocos 9–12 |
| ~~P91~~ | `/tela/{codigo}` vs rotas Blade reais | ✅ placeholders mantidos |
| ~~P92~~ | **`configurador` vê tudo (regra no `MenuService`)** | ✅ **7.5** |
| ~~P93~~ | Itens antigos (chutados) ficam órfãos | ✅ limpo |
| ~~P94~~ | **`SetTenantContext` resolve 1 ator; `MenuService` precisa de todos** | ✅ **7.5** (P100) |
| ~~P95~~ | **Troca de filial** | ✅ **8.2** |
| ~~P96~~ | **`SetTenantContextDev` desabilitado em produção** | ✅ **7.8** |
| ~~P97~~ | **Layout `auth` limpo** | ✅ **7.7** |
| ~~P98~~ | **`Usuario` sem `BelongsToTenant`** | ✅ **7.1** (D27) |
| ~~P99~~ | **`UsuarioAtor` continua com a trait** | ✅ **7.3** |
| ~~P100~~ | (= P94) | ✅ **7.5** |
| ~~P101~~ | (= P97) | ✅ **7.7** |
| ~~P102~~ | **`UsuarioSeeder` cria `usuario_atores` para o admin** | ✅ **7.1** |
| P103 | `MenuService::nomeUsuario()` usa `withoutGlobalScopes()` — documentar | Documentar no `04` |
| P104 | `ORDENS_PENDENTES` no `menu.js` continua mock — badge real no Bloco 8.3 | Bloco 8.3 |
| P105 | `web.php` não tem fallback `/tela/{codigo}` para rotas dos Blocos 9–13 | Bloco 9 |
| ~~P106~~ | `TelaInicialService::periodoAberto()` usa `periodos.ano`/`mes`/`status` | ✅ 8.1 |
| P107 | CSS `.ti-*` da Tela Inicial é mínimo viável — integrar com o do wireframe | Bloco 9 |
| P108 | Cards analíticos (DRE, fluxo, posição) são placeholders | Blocos 10–11 |
| P109 | "Últimas 5 notas" / "Últimos 5 eventos" são placeholders | Blocos 10/12 |
| ~~P110~~ | **`UsuarioSeeder` com 10 usuários de teste** | ✅ **8.2** |
| ~~P111~~ | **"Lembrar-me" removido do login** | ✅ **8.2** |
| ~~P112~~ | **`filiais.nome_fantasia` (não `nome`)** | ✅ 8.1 |
| ~~P113~~ | **`TenantContext` singleton** | ✅ **8.2** |
| ~~P114~~ | **`UsuarioFactory` criada** | ✅ 8.1 |
| P115 | `tarefas.id_documento` não tem FK (polimórfico via `tipo_documento`) | Documentar no `10` |
| ~~P116~~ | **`TarefaService` não chama `query()` protegido** | ✅ **8.2** |
| ~~P117~~ | **`MenuItemSeeder` com rotas `/tarefas/...`** | ✅ **8.2** |
| ~~P118~~ | **`FilialContextController` valida `UsuarioAtor` ativo** | ✅ **8.2** |
| P119 | Dropdown de filial só aparece se `count($filiaisDisponiveis) > 1` | Documentar no `04` |
| P120 | Caixa de Entrada usa só o **primeiro ator** da filial (o que o `SetTenantContext` seta) — o `MenuService` já resolve a união, mas as telas de tarefa **não** | Bloco 8.3 |
| ~~P121~~ | `ExampleTest` do Laravel não condiz com auth | ✅ **8.2** |
| ~~P122~~ | `TenantIsolationTest` "criar filial sem contexto falha" — expectativa errada | ✅ **8.2** |
| ~~P123~~ | `IsolamentoTest` usa `firstOrFail` em `AtorFuncional` — falha sem seeder | ✅ **8.2** |
| ~~P124~~ | `CentroCustoFactory` criada | ✅ **8.2** |
| ~~P125~~ | `MenuService` test rodando com seed | ✅ **8.2** |
| ~~P126~~ | `dump()` removidos do `IsolamentoTest` | ✅ **8.2** |
| ~~P127~~ | `TarefaService` delega ao `TarefaRepository` | ✅ **8.2** |
| ~~P128~~ | `FilialRepository` é **GrupoF** (não GrupoA) — `use` corrigido | ✅ **8.2** |
| ~~P129~~ | `TenantContext` é **singleton** | ✅ **8.2** |
| **P130** | Documentar D31 no `07_atores_fluxo` (não há troca de ator na UI; ator é identidade) | Documentar no `07` |

**Total: 130 pendências**, das quais **81 resolvidas**.
**Abertas para 8.3/9.1a+:** P11, P12, P17, P24, P25, P26, P27, P28, P29, P30, P32, P33, P34, P35, P36, P37, P38, P39, P41, P42, P43, P44, P46, P47, P49, P50, P52, P53, P54, P55, P56, P57, P59, P60, P61, P63, P64, P66, P68, P69, P71, P75, P76, P77, P78, P79, P80, P81, P88, P89, P90, P103, P104, P105, P107, P108, P109, P115, P119, P120, P130.

---

## 6. Próximos passos

### 6.21.2 — Testes Pest (complemento)
- `GrupoFTest.php` (17 tabelas), `GrupoCTest.php` (filhas puras), `ValidacoesCruzadasTest.php` (P31, P48), 13 factories restantes.

### Bloco 8.3 — Refinamento das telas de "Meu Trabalho"
- **P120** — Caixa de Entrada com todos os atores da filial (não só o primeiro).
- **P104** — Badge real de ordens pendentes no `menu.js` (via `TarefaRepository`).
- **P50** — `tarefas.data_criacao` preenchido pelo repositório.
- Testes de feature das 3 telas + Tela Inicial juntos.
- (Opcional) Botão "abrir" da tarefa → detalhe (depende do `08_ordens`, Bloco 13).

### Bloco 9.1a — Centros de Custo (2.3) + Usuários e Atores (2.4)
- 2.3 Centros de Custo (CRUD completo) — `CentroCustoRepository` existe.
- 2.4 Usuários e Atores (CRUD + gerenciar atores/filiais) — `UsuarioRepository` + `UsuarioAtorRepository` existem.

### Bloco 9.1b — Produtos (2.5) + Serviços (2.6) + Ativos (2.7) + Handoff (2.8)
- `ProdutoServicoRepository` + `AtivoRepository` + `ConfiguracaoHandoff` (model).

### Bloco 9.2 — Contador (4.1–4.11)
- 4.1 Tabelas Fiscais, 4.2 Plano de Contas, 4.3 Config. Contábeis, 4.4 Config. Fiscais, 4.5 Regras Classificação, 4.6 Lançamento Manual, 4.7 Revisão Lançamentos, 4.8 Validação Cálculos, 4.9 Relatório Pendências, 4.10 Preparar Fechamento, 4.11 Fechar Período.

### Bloco 10 — Telas de operação (5.x–8.x + 10.x)
- Comprador (5.1–5.5) + Faturista (6.1–6.5) + Financeiro1 (7.1–7.3) + Financeiro2 (8.1–8.3) + Gerente (9.1–9.2) + RH (10.1–10.6).

### Bloco 11 — Telas do Administrador (3.x)
- DRE (3.1–3.3) + Fluxo (3.4) + Análise (3.5–3.6) + Exportação (3.7) + Posição (3.8) + Relatórios avançados (3.10–3.17) + Conselheiro (3.18).

### Bloco 12 — Auditor (11.x) + Administração (12.x)
- Auditoria (11.1–11.8) + Administração (12.1–12.5).

### Bloco 13 — Handoff + serviços de negócio
- Serviço de baixa (P66 — cria lançamento contábil).
- Motor de classificação (P64).
- Handoff (T8.1–T8.12).

---

## Histórico de versões

| Versão | Data | Mudança |
| :--- | :--- | :--- |
| 1.0 | 2026-10-31 | Criação. Blocos 0–4. 8 divergências (D1–D8), 13 pendências (P1–P13). |
| 1.1 | 2026-11-02 | Bloco 5 concluído (frontend). D9–D12, P14–P18. |
| 1.2 | 2026-11-02 | Bloco 6.1–6.4 (19 tabelas). D13–D15, P19–P22. |
| 1.3 | 2026-11-02 | Bloco 6.5–6.17 (38 tabelas, 38 models, 8 seeders). 9 models de domínio em 6.16.1. `ParametroFiscal` com global scope híbrido. D16–D19, P23–P61. |
| 1.4 | 2026-11-02 | Bloco 6.18–6.21 (parcial). 32 repositórios, 3 views, lint SQL, 10 testes verdes. Correção `whereDate`. D20–D22, P62–P81. P1–P4, P7, P13, P18–P23, P40, P45, P48, P51, P65, P67, P72–P74 resolvidos. |
| 1.5 | 2026-11-02 | Leitura dos 4 docs funcionais (`07`, `09`, `11`, `12`). Bloco 7 fatiado em 7–13. D23–D26, P82–P90. **P58 reaberta.** P5/P6 reformuladas (contexto 4-tupla). |
| 1.6 | 2026-11-02 | Bloco 7 parte 1/2: `MenuItemSeeder` reescrito (~93 itens), `TenantContext` 4-tupla, `SetTenantContext` real, `LoginController`, `Usuario` sem `BelongsToTenant` (D27/P98) com `getAuthPassword()`/`getAuthPasswordName()`, `UsuarioRepository` com filtro manual. Login funcionando. D27, P91–P102. P94=P100 e P97=P101 (duplicatas). |
| 1.7 | 2026-11-02 | Bloco 7 parte 3: `MenuService` (P86/P92/P94/P100), `menu.js` (P15/P87), `layouts/auth.blade.php` (P97/P101), `SetTenantContextDev` guarda (P96), 2 testes 4-tupla no `IsolamentoTest`. D28–D30, P103–P105. Próximo: Bloco 8 (Meu Trabalho). |
| 1.8 | 2026-11-02 | **Bloco 8.1:** `TelaInicialService` (variante por ator — configurador vence), `TarefaRepository::contarPendentesDoAtor()` + `primeirasOrdensDoAtor()`, 10 partials (3.1–3.10) + `universal` + 4 sub-partials reutilizáveis, CSS `.ti-*` mínimo, 4 testes Pest verdes. **P113** (`TenantContext` singleton), **P114** (`UsuarioFactory`), **P112** (`filiais.nome_fantasia`). D31–D33, P106–P115. |
| 1.9 | 2026-11-02 | **Bloco 8.1 concluído:** ajustes finais no `TelaInicialService` (configurador vence), `CentroCustoFactory`, `IsolamentoTest` (2 testes 4-tupla + `MenuService` com seed), `dump()` removidos. **P113/P114/P124/P125/P126.** Próximo: 8.2. |
| 1.10 | 2026-11-02 | **Bloco 8.2 (parte 1/2):** Caixa de Entrada (1.1), Caixa de Saída (1.2), Histórico (1.3) — `TarefaService` + `TarefaRepository::caixaSaidaDoAtor()`/`historicoDoAtor()`, 3 views + `_tabela` reutilizável, CSS, `TarefasTest` (4 verdes). Dropdown de filial (P95) — `FilialContextController` + view composer do topbar. `UsuarioSeeder` com 10 usuários (P110). "Lembrar-me" removido (P111). `MenuItemSeeder` com rotas `/tarefas/...` (P117). D34–D36, P116–P120. |
| **1.11** | **2026-11-03** | **Bloco 8.2 fechado:** `TarefaController` (entrada/saída/histórico), `TarefaService` delegando ao `TarefaRepository` (P116/P127), `FilialContextController` (P95), `UsuarioSeeder` com 10 usuários (P110), "Lembrar-me" removido (P111), `TenantContext` singleton (P113/P129), lint de SQL cru zerado (P116/P124/P127), `AppServiceProvider`/`MenuService`/`Usuario` usando `GrupoF\FilialRepository` (P128), **25 testes verdes**. D34–D37, P95/P110/P111/P113/P116/P117/P118/P121–P129. **P130** (documentar D31 no `07`). Próximo: **9.1a** (Centros de Custo + Usuários). |
```

---
