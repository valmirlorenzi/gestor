## Sumário

1. [Contexto e objetivo](#1-contexto-e-objetivo)
2. [Decisões de arquitetura](#2-decisões-de-arquitetura)
3. [Stack técnica](#3-stack-técnica)
4. [Estrutura de pastas](#4-estrutura-de-pastas)
5. [Banco de dados e seeds](#5-banco-de-dados-e-seeds)
6. [API e autenticação](#6-api-e-autenticação)
7. [Frontend (Blade + JS)](#7-frontend-blade--js)
8. [Roteamento](#8-roteamento)
9. [Regras de implementação (R1–R3)](#9-regras-de-implementação-r1r3)
10. [Fases de entrega](#10-fases-de-entrega)
11. [O que NÃO entra em cada fase](#11-o-que-não-entra-em-cada-fase)
12. [Checklist de validação](#12-checklist-de-validação)

---

## 1. Contexto e objetivo

**O que é:** implementação do Sistema de Gestão Gerencial com Simulação, conforme documentação funcional (`00_indice.md` a `14_conselheiro.md`).

**Objetivo deste plano:** registrar todas as decisões técnicas antes de codar, para que a implementação seja previsível, testável e alinhada à documentação.

**Regra de ouro:** se houver dúvida, **perguntar antes de prosseguir**. Nenhuma decisão técnica é tomada sem confirmação.

---

## 2. Decisões de arquitetura

| # | Decisão | Escolha | Justificativa |
| :--- | :--- | :--- | :--- |
| D1 | **Frontend** | Blade + JS puro (fetch para API) | Preserva o wireframe; backend real desde o início |
| D2 | **API** | Laravel API routes com middleware `web` (sessão + CSRF) | Frontend é Blade (mesmo domínio); autenticação por sessão |
| D3 | **Autenticação** | Sessão (cookie) + CSRF token via `XSRF-TOKEN` | Simples, nativo do Laravel; sem JWT na fase 1 |
| D4 | **Multi-empresa (tenant)** | `empresa` = tenant (R1); escopo no repositório (R2); sem desnormalizar `id_empresa` em tabelas com `id_filial` (R3) | Conforme `01_visao_geral.md` seção 8 e `04_modelo_de_dados.md` |
| D5 | **Menu** | Continua no JS (`menu-dados.js`) por enquanto | Dado fixo do produto; migra para `menu_item` quando o backend de menu for implementado |
| D6 | **Assets** | `public/assets/` (CSS/JS copiados do wireframe) | Migração segura; Vite fica para refatoração futura |
| D7 | **Roteamento** | Híbrido: rota `/` (tela inicial) + rota coringa `/tela/{codigo}` | Telas ganham rota nomeada quando tiverem backend |
| D8 | **Rodapé** | Omitido (wireframe não tem) | Manter fidelidade ao wireframe |
| D9 | **Placeholder de tela** | **Não haverá** "página em construção". Telas sem backend dão 404 ou são omitidas do menu | Decisão do usuário: esqueleto mínimo, sem placeholders |
| D10 | **Seeds** | Banco completo com seeds de domínios + dados de teste | Decisão do usuário: construir banco e tabelas com seed |

---

## 3. Stack técnica

| Item | Versão/Decisão |
| :--- | :--- |
| PHP | 8.2+ (recomendado 8.4) |
| Laravel | 12.x |
| ORM | Eloquent (Global Scope nativo) |
| Banco | MariaDB (`DB_CONNECTION=mariadb`) |
| Testes | Pest + `RefreshDatabase` |
| Lint | Pint (preset `laravel`) + script customizado para proibir SQL cru |
| Frontend | Blade + JS puro (fetch) |
| Assets | `public/assets/` (copiados do wireframe) |

**Instalação:** conforme adendo anterior (php.new ou Herd + MariaDB separado).

---

## 4. Estrutura de pastas

```
gestor/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Api/                    ← controllers de API (fetch)
│   │   │   │   ├── EmpresaController.php
│   │   │   │   ├── FilialController.php
│   │   │   │   └── ...
│   │   │   └── Web/                    ← controllers de tela (Blade)
│   │   │       ├── TelaInicialController.php
│   │   │       └── ...
│   │   ├── Middleware/
│   │   │   └── SetTenantContext.php    ← seta o TenantContext a partir do usuário logado
│   │   └── Requests/
│   ├── Models/
│   │   ├── Concerns/
│   │   │   └── BelongsToTenant.php     ← trait do Global Scope (R2)
│   │   ├── Empresa.php
│   │   ├── Filial.php
│   │   └── ...
│   ├── Providers/
│   │   └── AppServiceProvider.php
│   ├── Repositories/                   ← único lugar com SQL cru permitido
│   │   ├── BaseRepository.php
│   │   ├── EmpresaRepository.php
│   │   └── ...
│   └── Services/
│       └── TenantContext.php           ← singleton com id_empresa do contexto
├── database/
│   ├── factories/
│   │   ├── EmpresaFactory.php
│   │   ├── FilialFactory.php
│   │   └── ...
│   ├── migrations/
│   │   ├── xxxx_create_empresas_table.php
│   │   ├── xxxx_create_filiais_table.php
│   │   └── ... (63 tabelas)
│   └── seeders/
│       ├── DatabaseSeeder.php
│       ├── DominioSeeder.php           ← CFOP, CST, NCM, LC116, CNAE, UFs, municípios, bancos
│       ├── AtorFuncionalSeeder.php
│       ├── TipoDocumentoSeeder.php
│       └── TesteSeeder.php             ← 2 empresas + filiais + dados de teste
├── public/
│   └── assets/
│       ├── css/                        ← 18 CSS do wireframe
│       ├── js/                         ← 40 JS do wireframe
│       └── imagens/                    ← favicon, ícones
├── resources/
│   └── views/
│       ├── layouts/
│       │   └── app.blade.php           ← layout mestre (topbar + sidebar + content)
│       ├── partials/
│       │   ├── topbar.blade.php
│       │   ├── sidebar.blade.php
│       │   └── scripts.blade.php
│       └── telas/
│           ├── tela-inicial.blade.php
│           └── ... (demais telas)
├── routes/
│   ├── web.php                         ← rotas de tela (Blade)
│   ├── api.php                         ← rotas de API (fetch)
│   └── console.php
├── scripts/
│   └── check-raw-sql.sh                ← lint para proibir SQL cru
└── tests/
    ├── Feature/
    │   ├── TenantIsolationTest.php
    │   └── ...
    └── Pest.php
```

---

## 5. Banco de dados e seeds

### 5.1 Ordem de criação das migrations

Seguir a ordem do `10_modelo_dados_fisico.md` (dependências):

1. **Domínios:** `cfops`, `csts`, `ncms`, `servicos_lc116`, `cnaes`, `ufs`, `municipios`, `tipos_documento`, `bancos`, `atores_funcionais`.
2. **Configuração:** `empresas`, `filiais` (FK circular resolvida com `ALTER TABLE` depois), `planos_contas`, `centros_custo`, `areas_negocio`, `areas_negocio_centros_custo`, `periodos`.
3. **Pessoas:** `pessoas`, `pessoas_fisicas`, `pessoas_juridicas`, `pessoas_tags`, `funcionarios`, `funcionarios_centros_custo`.
4. **Produtos:** `produtos_servicos`, `produtos`, `servicos`, `produtos_custos`.
5. **Bancos e contas:** `contas_bancarias`.
6. **Formas e condições:** `formas_pagamento`, `condicoes_pagamento`.
7. **Ativos:** `ativos`.
8. **Proventos:** `proventos_descontos`.
9. **Documentos fiscais:** `notas_fiscais`, `notas_fiscais_itens`, `notas_fiscais_impostos`, `notas_fiscais_vinculos`.
10. **Contas a pagar/receber:** `contas_pagar`, `contas_receber`.
11. **Lançamentos:** `lancamentos`.
12. **Folha:** `folhas_pagamento`, `folhas_pagamento_itens`, `folhas_pagamento_proventos_descontos`.
13. **Depreciação e provisões:** `depreciacoes`, `provisoes`.
14. **Classificação:** `regras_classificacao`, `regras_classificacao_logs`.
15. **Parâmetros:** `parametros_fiscais`, `tabelas_inss`, `tabelas_irrf`, `tabelas_encargos`.
16. **Razão de impostos:** `razoes_impostos`.
17. **Pendências:** `pendencias`.
18. **Simulação:** `cenarios_simulacao`.
19. **Usuários e auditoria:** `usuarios`, `usuarios_filiais` (legado), `usuarios_atores`, `auditorias`, `logs_importacao`.
20. **Handoff e ordens:** `configuracoes_handoff`, `documentos_encadeados`, `tarefas`.
21. **Menu:** `menus_itens`, `menus_itens_atores`.

**Total: 63 tabelas** (conforme `10_modelo_dados_fisico.md`).

### 5.2 Seeds

| Seeder | O que carrega | Origem |
| :--- | :--- | :--- |
| `AtorFuncionalSeeder` | 10 atores (configurador, administrador, contador, comprador, faturista, financeiro1, financeiro2, gerente_financeiro, rh, auditor) | `10_modelo_dados_fisico.md` seção 24 |
| `TipoDocumentoSeeder` | 4 tipos (NF-e, NFS-e, CT-e, RPA) | `10_modelo_dados_fisico.md` seção 24 |
| `UfSeeder` | 27 UFs | `10_modelo_dados_fisico.md` seção 24 |
| `DominioSeeder` | CFOP, CST, NCM, LC116, CNAE, municípios, bancos | Arquivos oficiais (Receita Federal, IBGE, Banco Central) — **a definir fonte** |
| `TesteSeeder` | 2 empresas (A e B) + 2 filiais cada + usuário de teste | Para testes de isolamento |

**Ponto de atenção:** os domínios grandes (CFOP, NCM, municípios) vêm de arquivos oficiais. **Pergunta:** você tem esses arquivos (CSV/SQL) ou precisa que eu gere um script para baixá-los de fontes públicas? (Ex.: NCM da Receita Federal, municípios do IBGE.)

### 5.3 Dados de teste (TesteSeeder)

- **Empresa A** (CNPJ 11111111111111) + **Filial A1** (matriz) + **Filial A2**.
- **Empresa B** (CNPJ 22222222222222) + **Filial B1** (matriz) + **Filial B2**.
- **Usuário A** (email `a@teste.com`) vinculado à Empresa A.
- **Usuário B** (email `b@teste.com`) vinculado à Empresa B.

Esses dados alimentam os testes de isolamento (R2) e permitem testar o `fetch` na fase de frontend.

---

## 6. API e autenticação

### 6.1 Rotas de API (`routes/api.php`)

```php
Route::middleware(['web', 'auth'])->group(function () {
    Route::get('/empresas', [EmpresaController::class, 'index']);
    Route::get('/empresas/{id}', [EmpresaController::class, 'show']);
    Route::get('/filiais', [FilialController::class, 'index']);
    // ...
});
```

> **Nota:** middleware `web` (não `api`) para incluir sessão e CSRF. O `fetch` envia o header `X-XSRF-TOKEN` lendo o cookie `XSRF-TOKEN`.

### 6.2 Autenticação

- **Fase 1 (esqueleto):** login simples (Laravel Breeze ou manual) com sessão.
- **Contexto:** middleware `SetTenantContext` lê `auth()->user()->id_empresa` e seta o `TenantContext`.
- **Logout:** limpa sessão e contexto.

### 6.3 CSRF no fetch

```javascript
// Lê o cookie XSRF-TOKEN (mantido fresco pelo Laravel)
function getCsrfToken() {
  const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : '';
}

fetch('/api/empresas', {
  headers: {
    'X-XSRF-TOKEN': getCsrfToken(),
    'Accept': 'application/json',
  },
  credentials: 'same-origin',
});
```

> **Atenção:** usar `X-XSRF-TOKEN` + cookie `XSRF-TOKEN`, **não** `meta[name="csrf-token"]` (que fica stale após navegações) .

---

## 7. Frontend (Blade + JS)

### 7.1 Layout mestre (`resources/views/layouts/app.blade.php`)

```blade
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="csrf-token" content="{{ csrf_token() }}">
  <title>Gestor Gerencial — @yield('title', 'Wireframe')</title>
  <link rel="icon" type="image/png" sizes="32x32" href="{{ asset('assets/imagens/favicon.png') }}">
  @include('partials.styles')
</head>
<body class="theme-modern">
  @include('partials.topbar')
  <div class="app">
    @include('partials.sidebar')
    <main class="content" id="content">
      @yield('content')
    </main>
  </div>
  @include('partials.scripts')
  @stack('scripts')
</body>
</html>
```

### 7.2 Partials

- **`partials/topbar.blade.php`:** topbar completa (seletor de ator, temas, fontes, período).
- **`partials/sidebar.blade.php`:** sidebar com campo "Ir para" e container do menu (preenchido via JS).
- **`partials/styles.blade.php`:** os 18 `<link rel="stylesheet">` do wireframe.
- **`partials/scripts.blade.php`:** os scripts essenciais (dados, geral, menu, seletor-ator, acessibilidade) + `@stack('scripts')`.

### 7.3 Tela inicial (`resources/views/telas/tela-inicial.blade.php`)

- **Sem placeholder.** A tela inicial é a única que será implementada nesta fase de esqueleto, com o conteúdo real do wireframe (`tela-inicial.js`).
- As demais telas **não existem** ainda (sem rota, sem placeholder).

### 7.4 Menu

- Continua vindo do `menu-dados.js` (JS). O `menu.js` monta o menu e trata o "Ir para".
- **Pergunta:** o `menu-dados.js` atual tem **todos** os itens (1.0–12.5). Como as telas ainda não existem, o menu pode levar a 404. **Confirma que o menu continua completo, mesmo com telas faltando?** Ou prefere que o menu seja filtrado para mostrar só a tela inicial nesta fase?

---

## 8. Roteamento

### 8.1 Rotas de tela (`routes/web.php`)

```php
Route::get('/', [TelaInicialController::class, 'index'])->name('tela-inicial');

// Rota coringa para telas que ainda não têm backend
Route::get('/tela/{codigo}', [TelaController::class, 'show'])
    ->where('codigo', '[0-9.]+')
    ->name('tela');
```

> **Nota:** a rota coringa **não** renderiza placeholder. Ela tenta resolver a view `telas.tela-{codigo}`; se não existir, dá **404**. Isso está alinhado à decisão D9 (sem placeholders).

### 8.2 Rotas de API (`routes/api.php`)

Conforme seção 6.1.

---

## 9. Regras de implementação (R1–R3)

### 9.1 R1 — Empresa é o tenant

- `empresas.id` é o tenant.
- Sem tabela `tenants`, sem coluna `id_tenant`.
- `TenantContext` (singleton) carrega o `id_empresa` do contexto.

### 9.2 R2 — Escopo de empresa obrigatório

- **Trait `BelongsToTenant`** aplica Global Scope:
  - **Grupo A** (tem `id_empresa`): `WHERE id_empresa = :t`.
  - **Grupo F** (tem `id_filial`): `whereHas('filial', fn($q) => $q->where('id_empresa', :t))`.
  - **Grupo C** (filha pura): acessível só via pai.
  - **Grupo U** (universal): sem escopo.
  - **Grupo H** (`parametros_fiscais`): `WHERE id_empresa = :t OR id_empresa IS NULL`.
- **SQL cru proibido** fora de `app/Repositories/` (lint/CI).
- **`id_empresa` só do contexto** (nunca do cliente).

### 9.3 R3 — Não desnormalizar `id_empresa` em tabelas com `id_filial`

- Tabelas do grupo F **não** têm `id_empresa`.
- Consistência é estrutural (impossível divergir).
- Sem trigger de cópia, sem FK composta, sem backfill.

### 9.4 Testes de isolamento

- Para cada tabela do grupo A e F, um teste que tenta acessar registro de outra empresa e **deve** falhar.
- Teste base: `TenantIsolationTest.php` (já na PR 1).

---

## 10. Fases de entrega

### Fase 0 — Setup (concluída)

- Instalação do Laravel 12 + MariaDB.
- Configuração do `.env`, Pest, Pint.

### Fase 1 — Banco de dados e seeds (próxima)

**Objetivo:** criar as 63 tabelas + seeds + models + repositories base + testes de isolamento.

| Etapa | O que entrega |
| :--- | :--- |
| 1.1 | Migrations das 10 tabelas de domínio + seeds (atores, tipos de documento, UFs). |
| 1.2 | Migrations de `empresas` e `filiais` + models + trait `BelongsToTenant` + `TenantContext` + testes de isolamento. |
| 1.3 | Migrations das demais 51 tabelas (na ordem da seção 5.1). |
| 1.4 | Seeds de domínios grandes (CFOP, CST, NCM, LC116, CNAE, municípios, bancos) — **depende de fonte**. |
| 1.5 | `TesteSeeder` (2 empresas + 2 filiais cada + usuários). |
| 1.6 | Repositories base + lint de SQL cru. |

### Fase 2 — Frontend esqueleto (depois da Fase 1)

**Objetivo:** layout Blade + tela inicial + menu JS + assets.

| Etapa | O que entrega |
| :--- | :--- |
| 2.1 | Copiar `assets/` para `public/assets/`. |
| 2.2 | `layouts/app.blade.php` + partials (topbar, sidebar, scripts, styles). |
| 2.3 | Rota `/` + `TelaInicialController` + `telas/tela-inicial.blade.php` (conteúdo real via JS). |
| 2.4 | Rota coringa `/tela/{codigo}` (404 se a view não existir). |
| 2.5 | Menu JS completo (todas as telas, mesmo as que dão 404). |  

### Fase 3 — Autenticação e API (depois da Fase 2)

**Objetivo:** login, `SetTenantContext`, primeiras rotas de API (`/api/empresas`, `/api/filiais`).

### Fase 4 — Telas por módulo (uma a uma)

**Objetivo:** migrar as telas do wireframe para Blade + API real, começando pela tela inicial e seguindo a ordem do menu.

---

## 11. O que NÃO entra em cada fase

| Fase | O que NÃO entra |
| :--- | :--- |
| Fase 1 | Frontend, autenticação, API, telas. |
| Fase 2 | Autenticação, API, telas além da inicial. |
| Fase 3 | Telas além da inicial, cálculos, relatórios. |
| Fase 4 | Tudo que não for a tela específica da etapa. |

---

## 12. Checklist de validação

### Fase 1

- [ ] As 63 tabelas existem no MariaDB (`SHOW TABLES` retorna 63).
- [ ] Os seeds de domínios (atores, tipos de documento, UFs) estão carregados.
- [ ] `TesteSeeder` cria 2 empresas + 4 filiais + 2 usuários.
- [ ] `TenantIsolationTest` passa (3 testes).
- [ ] `check-raw-sql.sh` passa (nenhum SQL cru fora de `app/Repositories/`).
- [ ] Pint passa (`vendor/bin/pint --test`).

### Fase 2

- [ ] `php artisan serve` sobe o servidor.
- [ ] `/` renderiza o layout com topbar, sidebar e tela inicial.
- [ ] O menu é montado via JS e o "Ir para" funciona.
- [ ] Os temas (moderno/clássico/retro) e o controle de fonte funcionam.
- [ ] `/tela/4.10` dá 404 (tela não implementada).

### Fase 3

- [ ] Login funciona.
- [ ] `SetTenantContext` seta o contexto a partir do usuário.
- [ ] `/api/empresas` retorna só a empresa do usuário logado.
- [ ] `/api/filiais` retorna só as filiais da empresa do usuário logado.
- [ ] O `fetch` envia `X-XSRF-TOKEN` corretamente.

---

## Dúvidas restantes (para confirmar antes de codar)

1. **Seeds de domínios grandes:** você tem os arquivos (CFOP, CST, NCM, LC116, CNAE, municípios, bancos) ou precisa que eu gere um script para baixá-los de fontes públicas? **Sem isso, a Fase 1.4 fica bloqueada.**

2. **Menu completo ou filtrado:** o `menu-dados.js` tem todos os itens (1.0–12.5). Como as telas ainda não existem, o menu pode levar a 404. **Confirma que o menu continua completo, mesmo com telas faltando?** Ou prefere filtrar para mostrar só a tela inicial nesta fase?

3. **Autenticação na Fase 1:** o `TesteSeeder` cria usuários, mas a autenticação real só entra na Fase 3. **Confirma que, na Fase 1, os testes de isolamento setam o `TenantContext` manualmente** (sem login)?

4. **Rota coringa:** para telas não implementadas, **404** (decisão D9). Confirma?

5. **Fase 1.4 (seeds de domínios):** se você não tiver os arquivos, posso gerar um script que baixa de fontes públicas (Receita Federal, IBGE, Banco Central). **Confirma que posso fazer isso?** Ou prefere carregar os domínios manualmente depois?

Com essas 5 respostas, começo a **Fase 1** (banco de dados + seeds) na próxima mensagem.