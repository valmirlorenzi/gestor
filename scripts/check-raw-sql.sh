#!/usr/bin/env bash
#
# Lint de SQL cru — garante R2 (escopo de empresa via repositório).
#
# Regra: SQL cru e Model::query() direto só são permitidos em:
#   - app/Repositories/
#   - database/migrations/   (DDL e views)
#   - database/seeders/      (popular dados iniciais)
#
# Qualquer outro lugar em app/ é proibido.
#
# Uso:
#   bash scripts/check-raw-sql.sh
#   exit 0 = ok; exit 1 = encontrou violação.

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

# Diretórios permitidos (relativos à raiz do projeto).
PERMITIDOS=(
  "app/Repositories"
  "database/migrations"
  "database/seeders"
  "tests"
)

# Padrões proibidos (regex ERE, compatível com grep -E).
PADROES=(
  'DB::select\('
  'DB::statement\('
  'DB::unprepared\('
  'DB::insert\('
  'DB::update\('
  'DB::delete\('
  'DB::raw\('
  '->whereRaw\('
  '->selectRaw\('
  '->havingRaw\('
  '->orderByRaw\('
  '->groupByRaw\('
  '::query\(\)'          # Model::query() direto
)

# Monta a lista de arquivos a varrer (PHP em app/).
mapfile -t ARQUIVOS < <(find app -type f -name '*.php' | sort)

# Filtra os permitidos.
FILTRADOS=()
for f in "${ARQUIVOS[@]}"; do
  skip=0
  for p in "${PERMITIDOS[@]}"; do
    if [[ "$f" == "$p"* ]]; then
      skip=1
      break
    fi
  done
  [[ $skip -eq 0 ]] && FILTRADOS+=("$f")
done

if [[ ${#FILTRADOS[@]} -eq 0 ]]; then
  echo "OK: nenhum arquivo a verificar."
  exit 0
fi

# Varre cada arquivo procurando cada padrão.
VIOLACOES=0

for f in "${FILTRADOS[@]}"; do
  for p in "${PADROES[@]}"; do
    # -n = número da linha; -H = sempre mostra o nome do arquivo
    if grep -nHE "$p" "$f" >/dev/null 2>&1; then
      echo "VIOLAÇÃO: $f"
      grep -nHE "$p" "$f" | sed 's/^/    /'
      VIOLACOES=$((VIOLACOES + 1))
    fi
  done
done

# Whitelist de exceções intencionais (P65, P67).
# Repositórios que precisam de withoutGlobalScope('tenant') para validar
# coerência cruzada. Documentado no 15_implementacao.md.
EXCECOES_WHITELIST=(
  "app/Repositories/GrupoF/AtivoRepository.php"
  "app/Repositories/GrupoF/UsuarioAtorRepository.php"
  "app/Repositories/GrupoF/LancamentoRepository.php"
  "app/Repositories/GrupoC/DocumentoEncadeadoRepository.php"
  "app/Repositories/GrupoH/ParametroFiscalRepository.php"
  "app/Repositories/BaseRepository.php"
)

# Verifica se os arquivos da whitelist usam withoutGlobalScope('tenant')
# apenas nos métodos documentados. Se usarem em outros lugares, é violação.
for f in "${EXCECOES_WHITELIST[@]}"; do
  if [[ -f "$f" ]] && grep -nH "withoutGlobalScope('tenant')" "$f" >/dev/null 2>&1; then
    # Cada ocorrência precisa estar num método específico (heurística: até 5 linhas abaixo).
    # Não bloqueia — só avisa.
    echo "AVISO: $f usa withoutGlobalScope('tenant') — verificar se é intencional (P65/P67)."
  fi
done

if [[ $VIOLACOES -gt 0 ]]; then
  echo ""
  echo "FALHA: $VIOLACOES violação(ões). SQL cru / Model::query() fora de app/Repositories/."
  echo "Mova a consulta para um repositório (R2)."
  exit 1
fi

echo "OK: nenhum SQL cru ou Model::query() fora de app/Repositories/."
exit 0