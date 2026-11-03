<?php

namespace Database\Seeders;

use App\Models\AtorFuncional;
use App\Models\MenuItem;
use Illuminate\Database\Seeder;

class MenuItemSeeder extends Seeder
{
    /**
     * Estrutura: [codigo, nome, rota, fase, atores[]]
     *
     * atores: códigos de ator_funcional que veem o item.
     * 'configurador' vê tudo (não precisa listar em cada item — o menu.js
     *  aplica a regra "se tem configurador, vê tudo"). Mas listamos aqui
     *  para o banco ter a relação explícita, útil para auditoria.
     */
    private array $itens = [
        // =====================================================================
        // BLOCO 1 — Meu Trabalho (todos os atores)
        // =====================================================================
        ['1.0',  'Tela Inicial',                    '/tela-inicial',                 1, ['*']],
        ['1.1',  'Caixa de Entrada',  '/tarefas/entrada',   1, ['*']],
        ['1.2',  'Caixa de Saída',    '/tarefas/saida',     1, ['*']],
        ['1.3',  'Histórico',         '/tarefas/historico', 1, ['*']],

        // =====================================================================
        // BLOCO 2 — Configurador
        // =====================================================================
        ['2.1',  'Empresa',                         '/empresa',                      1, ['configurador']],
        ['2.2',  'Filiais',                         '/filial',                       1, ['configurador']],
        ['2.3',  'Centros de Custo e Áreas de Negócio', '/centros-custo',            1, ['configurador', 'contador']],
        ['2.4',  'Usuários e Atores',               '/usuarios',                     1, ['configurador']],
        ['2.5',  'Produtos',                        '/produtos',                     1, ['configurador', 'comprador']],
        ['2.6',  'Serviços',                        '/servicos',                     1, ['configurador', 'comprador', 'faturista']],
        ['2.7',  'Ativos (bens/patrimônios)',       '/ativos',                       1, ['configurador', 'contador']],
        ['2.8',  'Ordem de Serviço Interna (OSI)',  '/osi',                          1, ['configurador']],

        // =====================================================================
        // BLOCO 3 — Administrador (3.1–3.18)
        // =====================================================================
        ['3.1',  'DRE Gerencial',                   '/administrador/dre',            1, ['administrador']],
        ['3.2',  'DRE por Centro de Custo',         '/administrador/dre-cc',         1, ['administrador']],
        ['3.3',  'Resumo por Área',                 '/administrador/resumo-area',    1, ['administrador']],
        ['3.4',  'Fluxo de Caixa Projetado',        '/administrador/fluxo-caixa',    1, ['administrador']],
        ['3.5',  'Análise de Custos',               '/administrador/analise-custos', 1, ['administrador']],
        ['3.6',  'Margem por Cliente/Produto',      '/administrador/margem',         1, ['administrador']],
        ['3.7',  'Exportação',                      '/administrador/exportacao',     1, ['administrador']],
        ['3.8',  'Posição de Caixa',                '/administrador/posicao-caixa',  1, ['administrador']],
        ['3.9',  'Simulações',                      '/administrador/simulacoes',     2, ['administrador']],
        ['3.10', 'Balanço Patrimonial',             '/administrador/balanco',        1, ['administrador']],
        ['3.11', 'Painel Executivo',                '/administrador/painel',         1, ['administrador']],
        ['3.12', 'Aging de Contas',                 '/administrador/aging',          1, ['administrador']],
        ['3.13', 'Posição de Impostos',             '/administrador/posicao-impostos', 1, ['administrador']],
        ['3.14', 'Posição de Pessoal',              '/administrador/posicao-pessoal', 1, ['administrador']],
        ['3.15', 'Posição de Ativos',               '/administrador/posicao-ativos', 1, ['administrador']],
        ['3.16', 'Ponto de Equilíbrio',             '/administrador/ponto-equilibrio', 1, ['administrador']],
        ['3.17', 'Resumo Executivo',                '/administrador/resumo-executivo', 1, ['administrador']],
        ['3.18', 'Conselheiro',                     '/administrador/conselheiro',    1, ['administrador']],

        // =====================================================================
        // BLOCO 4 — Contador (4.1–4.11)
        // =====================================================================
        ['4.1',  'Tabelas Basais (Fiscais)',        '/contador/tabelas-fiscais',     1, ['contador']],
        ['4.2',  'Cadastro de Plano de Contas',     '/contador/plano-contas',        1, ['contador']],
        ['4.3',  'Configurações Contábeis',         '/contador/config-contabeis',    1, ['contador']],
        ['4.4',  'Configurações Fiscais',           '/contador/config-fiscais',      1, ['contador']],
        ['4.5',  'Regras de Classificação',         '/contador/regras',              1, ['contador']],
        ['4.6',  'Lançamento Manual',               '/contador/lancamento-manual',   1, ['contador']],
        ['4.7',  'Revisão de Lançamentos',          '/contador/revisao',             1, ['contador']],
        ['4.8',  'Validação de Cálculos',           '/contador/validacao',           1, ['contador']],
        ['4.9',  'Relatório de Pendências',         '/contador/pendencias',          1, ['contador']],
        ['4.10', 'Preparar Fechamento',             '/contador/preparar-fechamento', 1, ['contador']],
        ['4.11', 'Fechar Período',                  '/contador/fechar',              1, ['contador']],

        // =====================================================================
        // BLOCO 5 — Comprador (5.1–5.5)
        // =====================================================================
        ['5.1',  'Tabelas Basais (Fornecedores)',   '/comprador/tabelas',            1, ['comprador']],
        ['5.2',  'Cadastro de Fornecedores',        '/comprador/fornecedores',       1, ['comprador']],
        ['5.3',  'Digitar Notas de Entrada',        '/comprador/nota-entrada',       1, ['comprador']],
        ['5.4',  'Importar Notas de Entrada',       '/comprador/importar',           1, ['comprador']],
        ['5.5',  'Revisar Classificações',          '/comprador/revisar',            1, ['comprador']],

        // =====================================================================
        // BLOCO 6 — Faturista (6.1–6.5)
        // =====================================================================
        ['6.1',  'Tabelas Basais (Clientes)',       '/faturista/tabelas',            1, ['faturista']],
        ['6.2',  'Cadastro de Clientes',            '/faturista/clientes',           1, ['faturista']],
        ['6.3',  'Digitar Notas de Saída',          '/faturista/nota-saida',         1, ['faturista']],
        ['6.4',  'Importar Notas de Saída',         '/faturista/importar',           1, ['faturista']],
        ['6.5',  'Revisar Classificações',          '/faturista/revisar',            1, ['faturista']],

        // =====================================================================
        // BLOCO 7 — Financeiro1 (7.1–7.3)
        // =====================================================================
        ['7.1',  'Tabelas Basais (Pagamento)',      '/financeiro1/tabelas',          1, ['financeiro1']],
        ['7.2',  'Contas a Pagar',                  '/financeiro1/contas-pagar',     1, ['financeiro1']],
        ['7.3',  'Pagamentos',                      '/financeiro1/pagamentos',       1, ['financeiro1']],

        // =====================================================================
        // BLOCO 8 — Financeiro2 (8.1–8.3)
        // =====================================================================
        ['8.1',  'Tabelas Basais (Recebimento)',    '/financeiro2/tabelas',          1, ['financeiro2']],
        ['8.2',  'Contas a Receber',                '/financeiro2/contas-receber',   1, ['financeiro2']],
        ['8.3',  'Recebimentos',                    '/financeiro2/recebimentos',     1, ['financeiro2']],

        // =====================================================================
        // BLOCO 9 — Gerente Financeiro (9.1–9.2)
        // =====================================================================
        ['9.1',  'Validar Saídas de Caixa/Banco',   '/gerente/validar-saidas',       1, ['gerente_financeiro']],
        ['9.2',  'Validar Entradas de Caixa/Banco', '/gerente/validar-entradas',     1, ['gerente_financeiro']],

        // =====================================================================
        // BLOCO 10 — RH (10.1–10.6)
        // =====================================================================
        ['10.1', 'Tabelas Basais — INSS',           '/rh/tabelas-inss',              1, ['rh']],
        ['10.2', 'Tabelas Basais — IRRF',           '/rh/tabelas-irrf',              1, ['rh']],
        ['10.3', 'Tabelas Basais — Gerais',         '/rh/tabelas-encargos',          1, ['rh']],
        ['10.4', 'Cadastro de Funcionários',        '/rh/funcionarios',              1, ['rh']],
        ['10.5', 'Tabelas Auxiliares de Folha',     '/rh/proventos-descontos',       1, ['rh']],
        ['10.6', 'Folha de Pagamento',              '/rh/folha',                     1, ['rh']],

        // =====================================================================
        // BLOCO 11 — Auditor (11.1–11.8)
        // =====================================================================
        ['11.1', 'Auditoria (log)',                 '/auditor/auditoria',            1, ['auditor']],
        ['11.2', 'Auditoria de Documentos',         '/auditor/documentos',           1, ['auditor']],
        ['11.3', 'Auditoria de Lançamentos',        '/auditor/lancamentos',          1, ['auditor']],
        ['11.4', 'Ordem de Serviço Interna (transições)', '/auditor/osi',            1, ['auditor']],
        ['11.5', 'Relatório de Pendências',         '/auditor/pendencias',           1, ['auditor']],
        ['11.6', 'Apontar Problemas',               '/auditor/apontar',              1, ['auditor']],
        ['11.7', 'Solicitar Correções',             '/auditor/solicitar',            1, ['auditor']],
        ['11.8', 'Validar Fechamento',              '/auditor/validar-fechamento',   1, ['auditor']],

        // =====================================================================
        // BLOCO 12 — Administração (12.1–12.5)
        // =====================================================================
        ['12.1', 'Período — Abertura e Fechamento', '/admin/periodos',               1, ['configurador']],
        ['12.2', 'Parâmetros — Tabelas',            '/admin/parametros',             1, ['configurador']],
        ['12.3', 'OSI — Ativar/Desativar',          '/admin/osi',                    1, ['configurador']],
        ['12.4', 'Auditoria (I3)',                  '/admin/auditoria',              1, ['configurador', 'auditor']],
        ['12.5', 'Usuários e Atores',               '/admin/usuarios',               1, ['configurador']],
    ];

    public function run(): void
    {
        // Mapa: codigo → id do ator_funcional
        $atores = AtorFuncional::pluck('id', 'codigo')->all();

        // Mapa: codigo → ator_funcional que existe
        $todosOsCodigos = array_keys($atores);

        foreach ($this->itens as [$codigo, $nome, $rota, $fase, $codigosAtores]) {
            $item = MenuItem::updateOrCreate(
                ['codigo' => $codigo],
                [
                    'nome' => $nome,
                    'rota' => $rota,
                    'fase' => $fase,
                    'ativo' => true,
                ]
            );

            // Resolve os atores ('*' = todos).
            if (in_array('*', $codigosAtores, true)) {
                $idsAtores = array_values($atores);
            } else {
                $idsAtores = [];
                foreach ($codigosAtores as $c) {
                    if (isset($atores[$c])) {
                        $idsAtores[] = $atores[$c];
                    }
                }
            }

            if (! empty($idsAtores)) {
                $item->atores()->syncWithoutDetaching($idsAtores);
            }
        }

        $this->command->info(
            'Menu: '.count($this->itens).' itens criados/atualizados ('.count($todosOsCodigos).' atores disponíveis).'
        );
    }
}
