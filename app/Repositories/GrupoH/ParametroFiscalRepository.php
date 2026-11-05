<?php

namespace App\Repositories\GrupoH;

use App\Models\ParametroFiscal;
use App\Repositories\BaseRepository;
use App\Services\TenantContext;
use Illuminate\Database\Eloquent\Collection;

/**
 * Grupo H: híbrido. Usa o global scope 'tenant_hibrido' do model
 * (id_empresa = :t OR id_empresa IS NULL) e oferece escopos explícitos.
 */
class ParametroFiscalRepository extends BaseRepository
{
    public function __construct(
        ParametroFiscal $model,
        private TenantContext $tenant,
    ) {
        parent::__construct($model);
    }

    /**
     * Parâmetros vigentes (data_inicio <= hoje <= data_fim ou data_fim NULL).
     * Inclui os globais (id_empresa NULL) + os da empresa do contexto.
     */
    public function vigentes(?string $tipoImposto = null): Collection
    {
        $hoje = now()->toDateString();

        $query = $this->query()
            ->whereDate('data_inicio_validade', '<=', $hoje)
            ->where(function ($q) use ($hoje) {
                $q->whereNull('data_fim_validade')
                    ->orWhereDate('data_fim_validade', '>=', $hoje);
            });

        if ($tipoImposto !== null) {
            $query->where('tipo_imposto', $tipoImposto);
        }

        return $query->orderBy('tipo_imposto')->orderByDesc('data_inicio_validade')->get();
    }

    /**
     * Só os globais (ignora overrides de empresa). Útil para seeders
     * e para o "valor de fallback".
     */
    public function somenteGlobais(): Collection
    {
        return $this->query()
            ->somenteGlobais()
            ->orderBy('tipo_imposto')
            ->get();
    }

    /**
     * Para uma empresa específica (inclui globais). Útil quando o
     * contexto ainda não foi setado (ex.: job em background).
     */
    public function paraEmpresa(int $idEmpresa): Collection
    {
        return $this->query()
            ->paraEmpresa($idEmpresa)
            ->orderBy('tipo_imposto')
            ->get();
    }

    /**
     * Cria um parâmetro. Se id_empresa vier NULL, cria global.
     * Se vier preenchido, cria override.
     */
    public function create(array $data): ParametroFiscal
    {
        // Não auto-preenche: o chamador decide (global = NULL, override = id).
        /** @var ParametroFiscal $param */
        $param = parent::create($data);

        return $param;
    }

    /**
     * Lista todos os parâmetros (globais + da empresa), com filtro opcional.
     * Usado pela tela 4.1.
     */
    public function listar(?string $tipoImposto = null, ?string $busca = null): Collection
    {
        $query = $this->query()->orderBy('tipo_imposto')->orderByDesc('data_inicio_validade');

        if ($tipoImposto !== null && $tipoImposto !== '') {
            $query->where('tipo_imposto', $tipoImposto);
        }

        if ($busca !== null && $busca !== '') {
            $query->where('descricao', 'like', '%'.$busca.'%');
        }

        return $query->get();
    }

    public function porId(int $id): ParametroFiscal
    {
        return $this->query()->findOrFail($id);
    }
}
