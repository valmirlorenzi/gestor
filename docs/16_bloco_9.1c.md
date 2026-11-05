---
documento: bloco_9.1c
versao: 1.0
data: 2026-11-04
proposito: Planejamento executável do Bloco 9.1c — refatoração de repositórios (R2) + coluna ativo em ativos + OSI ≡ handoff
depende_de: [15_implementacao, 04_modelo_de_dados, 10_modelo_dados_fisico]
---

# Bloco 9.1c — Refatoração de Repositórios + Correções

> **O que é este documento:** plano executável do 9.1c, autocontido o suficiente para um chat novo começar **sem recarregar o histórico**. Segue o padrão §7 do `15_implementacao.md` v2.1. **Não é changelog.**
>
> **Como usar:**
> 1. **Antes de codar**, ler §1 (contexto) e §2 (pré-requisitos).
> 2. **Ao codar**, seguir §4 (repositórios novos), §5 (métodos), §6 (controllers), §7 (models/migrations/views), §8 (`15`).
> 3. **Ao fechar**, atualizar §10 (critérios de aceite) e o `15_implementacao.md` (§1, §3.9, §4.1, §7.2, §7.7, §7.10).

---

## 1. Contexto

O `composer lint` (via `scripts/check-raw-sql.sh`) está **falhando** com **10 violações** de R2 (`04_modelo_de_dados.md` §R2: todo acesso a dados passa por repositório; SQL cru proibido fora do repositório):

```
VIOLAÇÃO: app/Http/Controllers/Api/AtivoApiController.php         (4)
VIOLAÇÃO: app/Http/Controllers/Api/CentroCustoApiController.php   (1)
VIOLAÇÃO: app/Http/Controllers/Api/FilialApiController.php        (3)
VIOLAÇÃO: app/Http/Controllers/Api/OsiApiController.php           (2)
VIOLAÇÃO: app/Http/Controllers/Api/ProdutoApiController.php       (4)
VIOLAÇÃO: app/Http/Controllers/Api/ServicoApiController.php       (4)
VIOLAÇÃO: app/Http/Controllers/Web/AtivoController.php            (3)
VIOLAÇÃO: app/Http/Controllers/Web/OsiController.php              (1)
VIOLAÇÃO: app/Http/Controllers/Web/ProdutoController.php          (3)
VIOLAÇÃO: app/Http/Controllers/Web/ServicoController.php          (3)
```

**Causa raiz:** conflito entre 3 regras do próprio `15`:
- **R2** (`04` §R2): todo acesso a dados passa por repositório.
- **D54** (`15` §4.1): `ApiController` pode usar `Model::create()` direto.
- **D71** (`15` §7.2): `ApiController` deve usar `Model::query()->findOrFail()` (não binding implícito).

O código seguiu **D54 + D71**. O lint seguiu **R2**. **Os dois estão certos pela sua regra. O conflito é de documentação.**

**Decisão:** **Caminho A — Refatorar para repositórios** (alinha com R2, remove D54 do `15`).

---

## 2. Duas correções preliminares

### 2.1. OSI ≡ Handoff (nomenclatura)

**`OSI` e `handoff` são sinônimos.** `OSI` é o nome canônico da UI (item 2.8). `handoff` é o nome técnico da tabela/model/repositório. **Não criar** `HandoffController` nem `HandoffRepository`.

**Onde aparece:**
- `configuracoes_handoff` (tabela) — **manter**.
- `ConfiguracaoHandoff` (model) — **manter**.
- `ConfiguracaoHandoffRepository` (repositório novo, §4.3) — **manter**.
- `OsiController`, `OsiApiController`, `OsiApiTest`, `osi-form.js`, `telas/osi/*.blade.php` — **manter** (nome canônico da UI).

**Adicionar em `15` §7.10:** "OSI (2.8) é o nome de UI; `configuracoes_handoff` / `ConfiguracaoHandoff` / `ConfiguracaoHandoffRepository` são o nome técnico."

### 2.2. Coluna `ativo` na tabela `ativos`

**`ativos.ativo` existe** (foi adicionado). Isso **muda o padrão do `destroy`** do `AtivoApiController`.

**Ações:**
- **`Ativo` model:** adicionar `'ativo'` ao `$fillable` e ao `$casts`.
- **`AtivoApiController::destroy`:** passar a `update(['ativo' => false, 'deleted_by' => ...]) + delete()`.
- **`AtivoApiTest`:** verificar `expect($ativo->ativo)->toBeFalse()`.
- **`telas/ativos/form.blade.php`:** adicionar `<select>` Ativo.
- **`telas/ativos/index.blade.php`:** adicionar coluna Ativo.
- **`15` §7.10:** atualizar (Ativo **tem** `ativo`).
- **`15` §7.7:** remover a linha "`update(['ativo' => false])` em tabela sem coluna `ativo`" (não se aplica mais).

**Verificar antes de criar migration:** `ls database/migrations/ | grep ativo`. Se existir `..._add_ativo_to_ativos_table.php`, **não** criar de novo.

---

## 3. Pré-requisitos

| # | Pré-requisito | Como verificar |
|---|---|---|
| 1 | 58 testes verdes | `php artisan test` |
| 2 | `composer lint` falhando só por causa dessas 10 violações | `composer lint` → 10 violações |
| 3 | `scripts/check-raw-sql.sh` existe | `ls scripts/check-raw-sql.sh` |
| 4 | `RepositoryServiceProvider` registra os repositórios | `grep -l RepositoryServiceProvider app/Providers/` |
| 5 | Padrões §7 do `15` lidos | Ler §7.1–§7.10 |
| 6 | Migration `..._add_ativo_to_ativos_table.php` existe? | `ls database/migrations/ \| grep ativo` |

---

## 4. Arquivos a criar (3 repositórios novos)

### 4.1. `app/Repositories/GrupoU/NcmRepository.php`

```php
<?php

namespace App\Repositories\GrupoU;

use App\Models\Ncm;
use App\Repositories\BaseRepository;
use Illuminate\Database\Eloquent\Collection;

class NcmRepository extends BaseRepository
{
    public function __construct(Ncm $model)
    {
        parent::__construct($model);
    }

    public function todosOrdenadosPorCodigo(): Collection
    {
        return $this->query()->orderBy('codigo')->get(['id', 'codigo', 'descricao']);
    }
}
```

**Nota:** `Ncm` é Grupo U (universal). `BaseRepository::query()` **não** filtra tenant. ✅

### 4.2. `app/Repositories/GrupoU/ServicoLc116Repository.php`

```php
<?php

namespace App\Repositories\GrupoU;

use App\Models\ServicoLc116;
use App\Repositories\BaseRepository;
use Illuminate\Database\Eloquent\Collection;

class ServicoLc116Repository extends BaseRepository
{
    public function __construct(ServicoLc116 $model)
    {
        parent::__construct($model);
    }

    public function todosOrdenadosPorCodigo(): Collection
    {
        return $this->query()->orderBy('codigo')->get(['id', 'codigo', 'descricao']);
    }
}
```

### 4.3. `app/Repositories/GrupoA/ConfiguracaoHandoffRepository.php`

```php
<?php

namespace App\Repositories\GrupoA;

use App\Models\ConfiguracaoHandoff;
use App\Repositories\BaseRepository;

class ConfiguracaoHandoffRepository extends BaseRepository
{
    public function __construct(ConfiguracaoHandoff $model)
    {
        parent::__construct($model);
    }

    /**
     * Retorna a configuração da empresa do contexto (ou null).
     * Singleton por empresa (unique em id_empresa).
     */
    public function daEmpresa(): ?ConfiguracaoHandoff
    {
        return $this->query()->first();
    }
}
```

**Nota:** `ConfiguracaoHandoff` é Grupo A (`id_empresa`, `BelongsToTenant`). `query()` filtra pelo contexto. ✅

### 4.4. Registrar no `RepositoryServiceProvider`

No `app/Providers/RepositoryServiceProvider.php`, adicionar:

```php
use App\Repositories\GrupoA\ConfiguracaoHandoffRepository;
use App\Repositories\GrupoU\NcmRepository;
use App\Repositories\GrupoU\ServicoLc116Repository;

// Em register() (junto aos outros binds):
$this->app->bind(NcmRepository::class, fn () => new NcmRepository(new \App\Models\Ncm));
$this->app->bind(ServicoLc116Repository::class, fn () => new ServicoLc116Repository(new \App\Models\ServicoLc116));
$this->app->bind(ConfiguracaoHandoffRepository::class, fn () => new ConfiguracaoHandoffRepository(new \App\Models\ConfiguracaoHandoff));
```

> **Se o projeto usa `$this->app->bind(Model::class, Repository::class)`**, seguir o padrão existente. **Não** inventar novo.

---

## 5. Métodos a adicionar nos repositórios existentes

### 5.1. `app/Repositories/GrupoA/ProdutoServicoRepository.php`

Adicionar:

```php
// --- Produtos ---

public function produtosComNcm(?string $busca = null): Collection
{
    $query = $this->query()
        ->where('tipo', 'P')
        ->with(['produto.ncm']);

    if ($busca !== null && $busca !== '') {
        $query->where('descricao', 'like', '%'.$busca.'%');
    }

    return $query->orderBy('descricao')->get();
}

public function produtoComNcm(int $id): ProdutoServico
{
    return $this->query()
        ->where('tipo', 'P')
        ->with(['produto.ncm'])
        ->findOrFail($id);
}

public function produto(int $id): ProdutoServico
{
    return $this->query()->where('tipo', 'P')->findOrFail($id);
}

public function produtoComProduto(int $id): ProdutoServico
{
    return $this->query()->where('tipo', 'P')->with('produto')->findOrFail($id);
}

// --- Serviços ---

public function servicosComLc116(?string $busca = null): Collection
{
    $query = $this->query()
        ->where('tipo', 'S')
        ->with(['servico.servicoLc116']);

    if ($busca !== null && $busca !== '') {
        $query->where('descricao', 'like', '%'.$busca.'%');
    }

    return $query->orderBy('descricao')->get();
}

public function servicoComLc116(int $id): ProdutoServico
{
    return $this->query()
        ->where('tipo', 'S')
        ->with('servico.servicoLc116')
        ->findOrFail($id);
}

public function servico(int $id): ProdutoServico
{
    return $this->query()->where('tipo', 'S')->findOrFail($id);
}

public function servicoComServico(int $id): ProdutoServico
{
    return $this->query()->where('tipo', 'S')->with('servico')->findOrFail($id);
}
```

### 5.2. `app/Repositories/GrupoF/AtivoRepository.php`

Adicionar:

```php
public function listarComCentroCusto(?string $busca = null): Collection
{
    $query = $this->query()->with('centroCusto');

    if ($busca !== null && $busca !== '') {
        $query->where('descricao', 'like', '%'.$busca.'%');
    }

    return $query->orderBy('descricao')->get();
}

public function comCentroCusto(int $id): Ativo
{
    return $this->query()->with('centroCusto')->findOrFail($id);
}

public function porId(int $id): Ativo
{
    return $this->query()->findOrFail($id);
}
```

**Atenção:** `AtivoRepository::create()`/`update()` **validam P23**. **Não** mudar.

### 5.3. `app/Repositories/GrupoA/CentroCustoRepository.php`

Adicionar:

```php
public function porId(int $id): CentroCusto
{
    return $this->query()->findOrFail($id);
}

public function ativos(): Collection
{
    return $this->query()
        ->where('ativo', true)
        ->orderBy('nome')
        ->get(['id', 'nome']);
}
```

### 5.4. `app/Repositories/GrupoF/FilialRepository.php`

Adicionar:

```php
public function porId(int $id): Filial
{
    return $this->query()->findOrFail($id);
}
```

**Nota:** `Filial` é Grupo A (tem `id_empresa` direto, `hasTenantColumn() = true`). `query()` filtra pelo contexto. ✅

---

## 6. Refatorar os 10 controllers

> **Padrão:** injetar o repositório no construtor; substituir `Model::query()`/`findOrFail()` por métodos do repositório. **Manter o resto igual.**

### 6.1. `app/Http/Controllers/Api/ProdutoApiController.php` (4 violações)

Injetar `ProdutoServicoRepository`. Substituir:

| Método | Antes | Depois |
|---|---|---|
| `index` | `ProdutoServico::query()->where('tipo','P')->with(['produto.ncm'])` + filtro manual | `$this->produtos->produtosComNcm($request->input('q'))` |
| `show` | `ProdutoServico::query()->where('tipo','P')->with('produto.ncm')->findOrFail($id)` | `$this->produtos->produtoComNcm($id)` |
| `update` | `ProdutoServico::query()->where('tipo','P')->findOrFail($id)` | `$this->produtos->produto($id)` |
| `destroy` | `ProdutoServico::query()->where('tipo','P')->findOrFail($id)` | `$this->produtos->produto($id)` |

**`store` fica como está** (`ProdutoServico::create()` + `Produto::create()` direto). O lint não detecta `::create()`.

### 6.2. `app/Http/Controllers/Api/ServicoApiController.php` (4 violações)

Mesma refatoração do 6.1, usando os métodos `servico*` do `ProdutoServicoRepository`.

### 6.3. `app/Http/Controllers/Api/AtivoApiController.php` (4 violações + `ativo`)

Injetar `AtivoRepository`. Substituir:

| Método | Antes | Depois |
|---|---|---|
| `index` | `Ativo::query()->with('centroCusto')` + filtro | `$this->ativos->listarComCentroCusto($request->input('q'))` |
| `show` | `Ativo::query()->with('centroCusto')->findOrFail($id)` | `$this->ativos->comCentroCusto($id)` |
| `update` | `Ativo::query()->findOrFail($id)` | `$this->ativos->porId($id)` |
| `destroy` | `Ativo::query()->findOrFail($id)` + `update(['deleted_by'=>...])` | `$this->ativos->porId($id)` + `update(['ativo'=>false, 'deleted_by'=>...])` |

**Mudança extra no `destroy`:** adicionar `'ativo' => false` no `update` (item 2.2).

**`store`/`update` continuam** usando `$this->ativos->create()`/`update()` (valida P23).

### 6.4. `app/Http/Controllers/Api/CentroCustoApiController.php` (1 violação)

Injetar `CentroCustoRepository`. **Só o `destroy`:**

```php
public function __construct(private CentroCustoRepository $centrosCusto) {}

public function destroy(int $id): Response
{
    $centroCusto = $this->centrosCusto->porId($id);
    // ... resto igual ...
}
```

**Não** refatorar `index`/`store`/`show`/`update` (não são violação).

### 6.5. `app/Http/Controllers/Api/FilialApiController.php` (3 violações)

Injetar `FilialRepository`. Substituir em `show`/`update`/`destroy`:

```php
$this->filiais->porId($id)
```

### 6.6. `app/Http/Controllers/Api/OsiApiController.php` (2 violações)

Injetar `ConfiguracaoHandoffRepository`. Substituir `ConfiguracaoHandoff::query()->first()` por `$this->config->daEmpresa()` em `show` e dentro do `DB::transaction` do `update`.

### 6.7. `app/Http/Controllers/Web/AtivoController.php` (3 violações)

Injetar `CentroCustoRepository` e `AtivoRepository`. Substituir:

| Método | Antes | Depois |
|---|---|---|
| `create` | `CentroCusto::query()->where('ativo',true)->orderBy('nome')->get([...])` | `$this->centrosCusto->ativos()` |
| `edit` | `Ativo::query()->findOrFail($id)` | `$this->ativos->porId($id)` |
| `edit` | `CentroCusto::query()->...` | `$this->centrosCusto->ativos()` |

### 6.8. `app/Http/Controllers/Web/OsiController.php` (1 violação)

Injetar `ConfiguracaoHandoffRepository`. Substituir `ConfiguracaoHandoff::query()->first()` por `$this->config->daEmpresa()`.

### 6.9. `app/Http/Controllers/Web/ProdutoController.php` (3 violações)

Injetar `NcmRepository` e `ProdutoServicoRepository`. Substituir:

| Método | Antes | Depois |
|---|---|---|
| `create` | `Ncm::query()->orderBy('codigo')->get([...])` | `$this->ncms->todosOrdenadosPorCodigo()` |
| `edit` | `ProdutoServico::query()->where('tipo','P')->with('produto')->findOrFail($id)` | `$this->produtos->produtoComProduto($id)` |
| `edit` | `Ncm::query()->...` | `$this->ncms->todosOrdenadosPorCodigo()` |

### 6.10. `app/Http/Controllers/Web/ServicoController.php` (3 violações)

Injetar `ServicoLc116Repository` e `ProdutoServicoRepository`. Substituir:

| Método | Antes | Depois |
|---|---|---|
| `create` | `ServicoLc116::query()->orderBy('codigo')->get([...])` | `$this->lc116->todosOrdenadosPorCodigo()` |
| `edit` | `ProdutoServico::query()->where('tipo','S')->with('servico')->findOrFail($id)` | `$this->servicos->servicoComServico($id)` |
| `edit` | `ServicoLc116::query()->...` | `$this->lc116->todosOrdenadosPorCodigo()` |

---

## 7. Ajustes em models, migrations, views e JS

### 7.1. `app/Models/Ativo.php`

```php
protected $fillable = [
    'id_filial', 'descricao', 'data_aquisicao', 'valor_original',
    'valor_residual', 'vida_util_meses', 'metodo_depreciacao',
    'mes_inicial_depreciacao', 'id_centro_custo', 'destino',
    'status', 'ativo',  // NOVO
    'dados_extras',
];

protected $casts = [
    // ... existentes ...
    'ativo' => 'boolean',  // NOVO
];
```

### 7.2. Migration `..._add_ativo_to_ativos_table.php`

**Se não existir** (verificar com `ls database/migrations/ | grep ativo`):

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('ativos', function (Blueprint $table) {
            $table->boolean('ativo')->default(true)->after('status');
        });
    }

    public function down(): void
    {
        Schema::table('ativos', function (Blueprint $table) {
            $table->dropColumn('ativo');
        });
    }
};
```

**Se já existir, pular.**

### 7.3. `resources/views/telas/ativos/form.blade.php`

Adicionar dentro do `.form-grid`, após o `<div>` de Status:

```blade
<div class="form-row">
    <label>Ativo</label>
    <select id="ativo-ativo">
        <option value="1" {{ (! isset($model) || $model->ativo) ? 'selected' : '' }}>Sim</option>
        <option value="0" {{ (isset($model) && !$model->ativo) ? 'selected' : '' }}>Não</option>
    </select>
</div>
```

### 7.4. `resources/views/telas/ativos/index.blade.php`

Adicionar `<th>Ativo</th>` após `<th>Status</th>`.

### 7.5. `public/assets/js/ativos-form.js`

Em `coletarDados()`, adicionar:

```javascript
ativo: document.getElementById('ativo-ativo').value === '1',
```

### 7.6. `public/assets/js/ativos-list.js`

No `tbody.innerHTML`, adicionar `<td>${a.ativo ? 'Sim' : 'Não'}</td>` na posição correspondente à coluna "Ativo".

### 7.7. `tests/Feature/AtivoApiTest.php`

No teste de soft delete, adicionar:

```php
expect($ativo->ativo)->toBeFalse();
expect($ativo->deleted_at)->not->toBeNull();
```

---

## 8. Atualizações no `15_implementacao.md`

### 8.1. §1 — Status atual

Adicionar linha na tabela:

| **9.1c** | Refatoração de repositórios (R2) + coluna `ativo` em `ativos` + OSI ≡ handoff | ✅ **Concluído** |

E atualizar "Números atuais":
- **40 repositórios** (era 37; + `NcmRepository`, `ServicoLc116Repository`, `ConfiguracaoHandoffRepository`).
- **64 testes verdes** (era 58; + 6 testes dos 3 repositórios novos, se criar).
- Lint de SQL cru: **zerado** (as 10 violações foram resolvidas).

### 8.2. §3.9 — Correções transversais

Adicionar ao final da seção:

> **9.1c — Refatoração de repositórios:** todos os `*ApiController` e `WebController` agora usam repositório. `Model::query()`/`Model::create()` direto no controller foi **eliminado**. O `Model::create()` do `store` (que o lint não detecta) **permanece** em Produto/Serviço/Ativo/Osi (o repositório valida P23 quando aplicável).

### 8.3. §4.1 — **remover D54**

Remover a linha da tabela D54 (não existe mais).

### 8.4. §7.2 — trocar a linha "Repository no ApiController"

**Antes:**
> **Repository no ApiController:** ❌ **não usar** (D54), **exceto** quando o repository valida regra de negócio (ex.: `AtivoRepository` valida P23).

**Depois:**
> **Repository no ApiController:** ✅ **usar sempre** (R2). `Model::create()` direto **não** é aceitável. A única exceção é se o model **não tiver** repositório (raro) — aí criar o repositório.

### 8.5. §7.7 — remover a linha de D54

**Remover:**
| **`$this->repo->create()` no ApiController** | **`Model::create()` direto (D54), **exceto** `AtivoApiController` (valida P23)** |

**E remover** a linha "`update(['ativo' => false])` em tabela sem coluna `ativo` → `update(['deleted_by' => ...]) + delete()` (ex.: `ativos`)" (não se aplica mais — `ativos` **tem** `ativo`).

### 8.6. §7.10 — atualizar `Ativo` e adicionar OSI ≡ handoff

**Atualizar `Ativo`:**
> **`Ativo`:** tabela **tem** coluna `ativo` (adicionada no 9.1c). O form **tem** `<select>` Ativo. O `destroy` seta `ativo = false` + `deleted_by` + `delete()`. O `status` (Em uso/Ocioso/Alienado) **continua** existindo — são coisas diferentes.

**Adicionar:**
> **OSI ≡ Handoff:** `OSI` é o nome canônico da UI (item 2.8). O nome técnico é `configuracoes_handoff` / `ConfiguracaoHandoff` / `ConfiguracaoHandoffRepository`. **Não criar** `HandoffController` nem `HandoffRepository`.

### 8.7. §5.3 — fechar as pendências relacionadas

- **P135** (= D54) — **fechada** (D54 removida).
- **P75** (views não filtram tenant) — **mantida** (não é escopo do 9.1c).

---

## 9. Testes

### 9.1. Testes que mudam

- **`AtivoApiTest`:** verificar `expect($ativo->ativo)->toBeFalse()` no soft delete.

### 9.2. Testes novos (recomendado)

- **`tests/Feature/NcmRepositoryTest.php`** (2 testes):
  ```php
  it('retorna ncms ordenados por código', function () { ... });
  it('retorna apenas id/codigo/descricao', function () { ... });
  ```
- **`tests/Feature/ServicoLc116RepositoryTest.php`** (2 testes) — idem.
- **`tests/Feature/ConfiguracaoHandoffRepositoryTest.php`** (2 testes):
  ```php
  it('retorna null quando não há configuração', function () { ... });
  it('retorna a configuração da empresa do contexto', function () { ... });
  ```

**Total esperado:** 58 (atuais) + 6 = **64 verdes**.

> **Opcional:** se preferir não criar testes para repositórios triviais, pular. **Recomendo criar** (segue o padrão).

### 9.3. Testes que **não** mudam

`ProdutoApiTest`, `ServicoApiTest`, `OsiApiTest`, `CentroCustoApiTest`, `UsuarioApiTest`, `UsuarioAtorApiTest`, `UsuarioIsolamentoTest`, `IsolamentoTest`, `TarefasTest`, `TelaInicialTest`, `TenantIsolationTest`, `ExampleTest`.

---

## 10. Critérios de aceite

- [ ] `composer lint` → **0 violações**.
- [ ] `php artisan test` → **64 verdes** (58 anteriores + 6 novos, se criar).
- [ ] `AtivoApiTest` verifica `ativo = false` no destroy.
- [ ] `Ativo` tem `<select>` Ativo no form e coluna Ativo no index.
- [ ] `15_implementacao.md` atualizado (§1, §3.9, §4.1, §7.2, §7.7, §7.10, §5.3).
- [ ] Nenhuma nova violação de lint introduzida.
- [ ] Nenhum teste quebrado (os 58 continuam verdes + os 6 novos passam).

---

## 11. Riscos e mitigações

| Risco | Mitigação |
|---|---|
| **`AtivoRepository::create()`/`update()` já validam P23** — o `AtivoApiController::store/update` **não** podem perder isso. | **Não** refatorar `store`/`update` do `AtivoApiController` além do necessário. O `update` usa `$this->ativos->porId($id)` só para pegar o model; a **atualização** continua via `$this->ativos->update($id, $data)` (valida P23). |
| **`ConfiguracaoHandoff` é singleton por empresa** — `daEmpresa()` retorna o único registro (ou `null`). | O `updateOrCreate` do `OsiApiController` continua funcionando. **Não** mudar. |
| **`Ncm`/`ServicoLc116` são Grupo U** — `BaseRepository::query()` **não** filtra tenant. | ✅ Correto (são universais). **Não** adicionar trait `BelongsToTenant`. |
| **Testes em SQLite** — `AtivoApiTest` de P23 usa `CentroCusto::withoutGlobalScopes()`. | **Não** mudar. |
| **`ativo` em `ativos` pode conflitar com `status`** | Decisão de UI (D89). **Recomendo** manter os dois (são coisas diferentes: `status` é operacional, `ativo` é lógico). |
| **Migration `..._add_ativo_to_ativos_table.php`** pode já existir. | Verificar com `ls database/migrations/ | grep ativo`. Se existir, **não** criar de novo. |
| **`Model::create()` no `store`** — o lint não detecta, mas é D54. | Manter como está. Documentar em §7.10 que o `store` do `ApiController` usa `Model::create()` direto (exceção ao R2). Se um dia o lint for mais rigoroso, mover para repositório (`ProdutoServicoRepository::criar()`). |

---

## 12. Decisões a tomar no chat novo (antes de codar)

| # | Decisão | Opções | Recomendação |
|---|---|---|---|
| **D89** | Manter `status` **e** `ativo` em `ativos`, ou só `ativo`? | (a) manter os dois; (b) só `ativo` + `deleted_at` | **(a)** — `status` é operacional (Em uso/Ocioso/Alienado), `ativo` é lógico (Sim/Não). |
| **D90** | Criar testes para os 3 repositórios novos? | (a) sim (6 testes); (b) não | **(a)** — segue o padrão. |
| **D91** | Remover `D54` do `15` §4.1, ou marcar como "histórica"? | (a) remover; (b) manter com nota "revogada pelo 9.1c" | **(a)** — remover. §4.1 é "abertas". |
| **D92** | `NcmRepository`/`ServicoLc116Repository`: `todosOrdenadosPorCodigo()` retorna `Collection` ou paginado? | (a) `Collection` (tudo); (b) paginado | **(a)** — NCM e LC116 podem ter 10k+ linhas, mas o `<select>` precisa de todas. Se pesar, paginar é fase 2. |
| **D93** | `Model::create()` no `store` dos `ApiController` (Produto, Serviço, Ativo, Osi) — manter ou mover para repositório? | (a) manter (lint não detecta); (b) mover | **(a)** — manter. O lint não pega; mover aumenta escopo sem ganho. Documentar em §7.10. |

---

## 13. Ordem de implementação

1. **Criar `NcmRepository`** (Grupo U).
2. **Criar `ServicoLc116Repository`** (Grupo U).
3. **Criar `ConfiguracaoHandoffRepository`** (Grupo A).
4. **Registrar os 3** no `RepositoryServiceProvider`.
5. **Adicionar métodos** em `ProdutoServicoRepository` (produtos + serviços).
6. **Adicionar métodos** em `AtivoRepository`.
7. **Adicionar `porId` + `ativos`** em `CentroCustoRepository`.
8. **Adicionar `porId`** em `FilialRepository`.
9. **Refatorar `ProdutoApiController`** (4 violações).
10. **Refatorar `ServicoApiController`** (4 violações).
11. **Refatorar `AtivoApiController`** (4 violações + `ativo` no destroy).
12. **Refatorar `CentroCustoApiController::destroy`** (1 violação).
13. **Refatorar `FilialApiController::show/update/destroy`** (3 violações).
14. **Refatorar `OsiApiController::show/update`** (2 violações).
15. **Refatorar `AtivoController`** (Web, 3 violações).
16. **Refatorar `OsiController`** (Web, 1 violação).
17. **Refatorar `ProdutoController`** (Web, 3 violações).
18. **Refatorar `ServicoController`** (Web, 3 violações).
19. **Atualizar `Ativo` model** (`$fillable` + `$casts`).
20. **Criar migration** `..._add_ativo_to_ativos_table.php` (se não existir).
21. **Atualizar `telas/ativos/form.blade.php`** (select Ativo).
22. **Atualizar `telas/ativos/index.blade.php`** (coluna Ativo).
23. **Atualizar `public/assets/js/ativos-form.js`** (coletar `ativo`).
24. **Atualizar `public/assets/js/ativos-list.js`** (renderizar `ativo`).
25. **Atualizar `AtivoApiTest`** (verificar `ativo = false`).
26. **Criar testes dos 3 repositórios novos** (6 testes).
27. **Atualizar `15_implementacao.md`** (§1, §3.9, §4.1, §7.2, §7.7, §7.10, §5.3).
28. **Rodar `composer lint`** (deve zerar).
29. **Rodar `php artisan test`** (64 verdes).

---

## 14. Checklist final

Antes de começar:
- [ ] `php artisan test` → 58 verdes.
- [ ] `composer lint` → 10 violações.
- [ ] `15_implementacao.md` §7 lido.
- [ ] `ls database/migrations/ | grep ativo` → confirmar se a migration `..._add_ativo_to_ativos_table.php` existe.
- [ ] Ler §12 (decisões a tomar) e decidir D89–D93.

Ao codar cada repositório novo:
- [ ] `NcmRepository` (`todosOrdenadosPorCodigo`).
- [ ] `ServicoLc116Repository` (`todosOrdenadosPorCodigo`).
- [ ] `ConfiguracaoHandoffRepository` (`daEmpresa`).
- [ ] Registrar no `RepositoryServiceProvider`.

Ao codar cada controller:
- [ ] Injetar o repositório no construtor.
- [ ] Substituir `Model::query()`/`findOrFail()` pelos métodos.
- [ ] Manter `Model::create()` no `store` (D93 = manter).

Ao fechar:
- [ ] `composer lint` → 0 violações.
- [ ] `php artisan test` → 64 verdes.
- [ ] `15` atualizado (§1, §3.9, §4.1, §7.2, §7.7, §7.10, §5.3).
- [ ] Rodar `git status` e commitar (`Bloco 9.1c: refatoração de repositórios + coluna ativo em ativos`).

---

## 15. Histórico de versões

| Versão | Data | Mudança |
|---|---|---|
| 1.0 | 2026-11-04 | Criação. Planejamento do Bloco 9.1c (refatoração de repositórios + coluna `ativo` em `ativos` + OSI ≡ handoff). 3 repositórios novos, 10 controllers refatorados, decisões D89–D93. |
