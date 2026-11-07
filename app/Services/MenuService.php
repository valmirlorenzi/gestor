<?php

namespace App\Services;

use App\Models\AtorFuncional;
use App\Models\MenuItem;
use App\Repositories\GrupoA\AtorFuncionalRepository;
use App\Repositories\GrupoA\MenuItemRepository;
use App\Repositories\GrupoA\UsuarioRepository;
use App\Repositories\GrupoF\FilialRepository;

/**
 * Monta o menu do usuário logado, por ator, na filial atual.
 *
 * Regras (P86, P92, P94/P100):
 *  - Olha TODOS os atores ativos do usuário na filial (não só o primeiro).
 *  - Se algum ator é 'configurador' → retorna todos os itens ativos fase 1.
 *  - Senão → união dos itens vinculados a qualquer ator do usuário.
 *  - Itens universais ('*' no seeder = vinculados a todos os atores) entram
 *    naturalmente pela união, pois o seeder fez syncWithoutDetaching com todos.
 *  - Bloco 1 (Meu Trabalho) é sempre incluído (garantia extra).
 *
 * Toda consulta ao banco é delegada a repositórios (R2).
 */
class MenuService
{
    /** Ícone por código (o banco não guarda ícone — P86). */
    private const ICONES = [
        '1.0' => '🏠', '1.1' => '📥', '1.2' => '📤', '1.3' => '🕘',
        '2.1' => '🏢', '2.2' => '🏬', '2.3' => '🗂️', '2.4' => '👥',
        '2.5' => '📦', '2.6' => '🛠️', '2.7' => '🏗️', '2.8' => '🔄',
        '3.1' => '📈', '3.2' => '📊', '3.3' => '🗂️', '3.4' => '💵',
        '3.5' => '🔍', '3.6' => '📐', '3.7' => '📤', '3.8' => '💰',
        '3.9' => '🔮', '3.10' => '⚖️', '3.11' => '📊', '3.12' => '⏳',
        '3.13' => '🧾', '3.14' => '👥', '3.15' => '🏢', '3.16' => '⚖️',
        '3.17' => '📄', '3.18' => '💡',
        '4.1' => '📋', '4.2' => '🌳', '4.3' => '⚙️', '4.4' => '🏛️',
        '4.5' => '🧠', '4.6' => '✍️', '4.7' => '🔍', '4.8' => '✔️',
        '4.9' => '⚠️', '4.10' => '📦', '4.11' => '🔒',
        '5.1' => '📋', '5.2' => '🏭', '5.3' => '⌨️', '5.4' => '📥',
        '5.5' => '🔍',
        '6.1' => '📋', '6.2' => '🧑‍💼', '6.3' => '⌨️', '6.4' => '📤',
        '6.5' => '🔍',
        '7.1' => '📋', '7.2' => '📄', '7.3' => '💳',
        '8.1' => '📋', '8.2' => '📄', '8.3' => '💵',
        '9.1' => '🔒', '9.2' => '🔓',
        '10.1' => '📋', '10.2' => '📋', '10.3' => '📋', '10.4' => '👷',
        '10.5' => '📋', '10.6' => '💼',
        '11.1' => '📜', '11.2' => '📄', '11.3' => '📝', '11.4' => '🔄',
        '11.5' => '⚠️', '11.6' => '🚩', '11.7' => '✉️', '11.8' => '✔️',
        '12.1' => '📅', '12.2' => '📋', '12.3' => '🔄', '12.4' => '📜',
        '12.5' => '👥', '12.6' => '📥',
    ];

    /** Nome/ícone dos blocos (estrutura fixa, não é dado de banco). */
    private const BLOCOS = [
        1 => ['nome' => 'Meu Trabalho',                    'icone' => '📥'],
        2 => ['nome' => 'Configurador',                     'icone' => '⚙️'],
        3 => ['nome' => 'Administrador',                    'icone' => '👔'],
        4 => ['nome' => 'Contador',                         'icone' => '🧮'],
        5 => ['nome' => 'Comprador',                        'icone' => '🛒'],
        6 => ['nome' => 'Faturista',                        'icone' => '🧾'],
        7 => ['nome' => 'Financeiro1 — Contas a Pagar',     'icone' => '💸'],
        8 => ['nome' => 'Financeiro2 — Contas a Receber',   'icone' => '💰'],
        9 => ['nome' => 'Gerente Financeiro',               'icone' => '🏦'],
        10 => ['nome' => 'RH',                               'icone' => '👥'],
        11 => ['nome' => 'Auditor',                          'icone' => '🔍'],
        12 => ['nome' => 'Administração',                    'icone' => '🛠️'],
    ];

    public function __construct(
        private AtorFuncionalRepository $atores,
        private MenuItemRepository $itens,
        private UsuarioRepository $usuarios,
        private FilialRepository $filiais,
    ) {}

    /**
     * Retorna o payload completo para o menu.js.
     *
     * @return array{
     *   usuario: array{nome: string, filial: ?string, ator: ?string},
     *   blocos: array<int, array{nome: string, icone: string}>,
     *   itens: array<int, array{codigo: string, nome: string, rota: string, icone: string, bloco: int, fase: int, badge: bool}>
     * }
     */
    public function paraUsuario(int $usuarioId, int $empresaId, int $filialId): array
    {
        $atos = $this->atores->porUsuarioNaFilial($usuarioId, $filialId);
        $ehConfigurador = $atos->contains(fn (AtorFuncional $a) => $a->codigo === 'configurador');
        $idsAtores = $atos->pluck('id')->all();

        $itens = $this->itens->visiveisParaAtores($ehConfigurador, $idsAtores);

        return [
            'usuario' => [
                'nome' => $this->usuarios->nomePorId($usuarioId) ?? 'Usuário',
                'filial' => $this->filiais->nomeFantasia($filialId),
                'ator' => $ehConfigurador ? 'configurador' : ($atos->first()->codigo ?? null),
            ],
            'blocos' => self::BLOCOS,
            'itens' => $itens->map(fn (MenuItem $item) => $this->paraArray($item))->values()->all(),
        ];
    }

    /** @return array<string, mixed> */
    private function paraArray(MenuItem $item): array
    {
        $bloco = (int) strtok($item->codigo, '.');

        return [
            'codigo' => $item->codigo,
            'nome' => $item->nome,
            'rota' => $item->rota,
            'icone' => self::ICONES[$item->codigo] ?? '•',
            'bloco' => $bloco,
            'fase' => (int) $item->fase,
            'badge' => $item->codigo === '1.1',
        ];
    }
}
