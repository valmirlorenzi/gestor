<?php

namespace App\Services;

use App\Models\AtorFuncional;
use App\Models\Usuario;
use App\Repositories\GrupoA\AtorFuncionalRepository;
use App\Repositories\GrupoA\DashboardRepository;
use App\Repositories\GrupoA\UsuarioRepository;
use App\Repositories\GrupoF\FilialRepository;
use App\Repositories\GrupoF\PeriodoRepository;
use App\Repositories\GrupoF\TarefaRepository;
use Illuminate\Database\Eloquent\Collection;

/**
 * Monta o payload da Tela Inicial por ator (12_tela_inicial.md).
 *
 * - Resolve o ator "principal" do usuário na filial (configurador vence).
 * - Busca contadores e as 3 primeiras ordens reais.
 * - Devolve tudo que os partials precisam, sem que cada partial
 *   faça queries por conta própria.
 *
 * Toda consulta ao banco é delegada a repositórios (R2).
 */
class TelaInicialService
{
    public function __construct(
        private TenantContext $context,
        private TarefaRepository $tarefas,
        private AtorFuncionalRepository $atores,
        private FilialRepository $filiais,
        private UsuarioRepository $usuarios,
        private PeriodoRepository $periodos,
        private DashboardRepository $dashboard,
    ) {}

    /**
     * @return array{
     *   ator: ?string,
     *   atorId: ?int,
     *   variante: string,
     *   contadores: array<string, int|float|string>,
     *   ordens: Collection,
     *   usuario: Usuario|null,
     *   filial: ?string,
     *   periodo: ?string,
     * }
     */
    public function montar(): array
    {
        $usuarioId = $this->context->getUsuarioId();
        $filialId = $this->context->getFilialId();

        if ($usuarioId === null || $filialId === null) {
            return $this->vazio();
        }

        $ator = $this->resolverAtor($usuarioId, $filialId);
        $atorId = $ator?->id;
        $codigo = $ator?->codigo;

        return [
            'ator' => $codigo,
            'atorId' => $atorId,
            'variante' => $this->resolverVariante($codigo),
            'contadores' => $this->contadores($atorId, $codigo),
            'ordens' => $atorId
                ? $this->tarefas->primeirasOrdensDoAtor($atorId, 3)
                : collect(),
            'usuario' => $this->usuarios->porId($usuarioId),
            'filial' => $this->filiais->nomeFantasia($filialId),
            'periodo' => $this->periodos->abertoDaFilial($filialId),
        ];
    }

    /**
     * O ator "principal" do usuário na filial.
     * Se tem configurador, ele vence (vê a variante de configurador).
     * Senão, o primeiro por código.
     */
    private function resolverAtor(int $usuarioId, int $filialId): ?AtorFuncional
    {
        return $this->atores->principalDoUsuarioNaFilial($usuarioId, $filialId);
    }

    /**
     * Mapeia o código do ator para o nome do partial.
     * Códigos que não têm partial caem em 'universal'.
     */
    private function resolverVariante(?string $codigo): string
    {
        $validos = [
            'configurador', 'administrador', 'contador', 'comprador',
            'faturista', 'financeiro1', 'financeiro2', 'gerente_financeiro',
            'rh', 'auditor',
        ];

        return in_array($codigo, $validos, true) ? $codigo : 'universal';
    }

    /**
     * Contadores reais mínimos (Bloco 8).
     * Cards analíticos (DRE, fluxo, posição) ficam como placeholders
     * e serão preenchidos nos Blocos 10–11.
     */
    private function contadores(?int $atorId, ?string $codigo): array
    {
        $ordensPendentes = $atorId
            ? $this->tarefas->contarPendentesDoAtor($atorId)
            : 0;

        $base = [
            'ordens_pendentes' => $ordensPendentes,
            'lancamentos_pend' => 0,   // Bloco 13
            'pendencias' => 0,   // Bloco 10/11
            'contas_vencidas' => 0,   // Bloco 10
        ];

        return match ($codigo) {
            'configurador' => $base + [
                'empresas' => $this->dashboard->totalEmpresas(),
                'filiais' => $this->dashboard->totalFiliais(),
                'usuarios_ativos' => $this->dashboard->totalUsuariosAtivos(),
            ],
            default => $base,
        };
    }

    private function vazio(): array
    {
        return [
            'ator' => null,
            'atorId' => null,
            'variante' => 'universal',
            'contadores' => $this->contadores(null, null),
            'ordens' => collect(),
            'usuario' => null,
            'filial' => null,
            'periodo' => null,
        ];
    }
}
