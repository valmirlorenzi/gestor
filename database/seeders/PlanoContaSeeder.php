<?php

namespace Database\Seeders;

use App\Models\PlanoConta;
use App\Services\TenantContext;
use Illuminate\Database\Seeder;

class PlanoContaSeeder extends Seeder
{
    public function run(): void
    {
        app(TenantContext::class)->setId(1);

        $empresaId = 1;

        // [codigo, nivel, descricao, tipo, subtipo, natureza, aceita_lancamento, codigo_pai]
        $contas = [
            // ATIVO
            ['1', 1, 'Ativo', 'Ativo', null, 'Sintetica', false, null],
            ['1.1', 2, 'Ativo Circulante', 'Ativo', null, 'Sintetica', false, '1'],
            ['1.1.1', 3, 'Caixa e Equivalentes', 'Ativo', null, 'Sintetica', false, '1.1'],
            ['1.1.1.01', 4, 'Caixa', 'Ativo', null, 'Analitica', true, '1.1.1'],
            ['1.1.1.02', 4, 'Bancos Conta Movimento', 'Ativo', null, 'Analitica', true, '1.1.1'],
            ['1.1.2', 3, 'Contas a Receber', 'Ativo', null, 'Sintetica', false, '1.1'],
            ['1.1.2.01', 4, 'Clientes', 'Ativo', null, 'Analitica', true, '1.1.2'],
            ['1.1.3', 3, 'Estoques', 'Ativo', null, 'Sintetica', false, '1.1'],
            ['1.1.3.01', 4, 'Mercadorias para Revenda', 'Ativo', null, 'Analitica', true, '1.1.3'],
            // PASSIVO
            ['2', 1, 'Passivo', 'Passivo', null, 'Sintetica', false, null],
            ['2.1', 2, 'Passivo Circulante', 'Passivo', null, 'Sintetica', false, '2'],
            ['2.1.1', 3, 'Fornecedores', 'Passivo', null, 'Sintetica', false, '2.1'],
            ['2.1.1.01', 4, 'Fornecedores Nacionais', 'Passivo', null, 'Analitica', true, '2.1.1'],
            ['2.1.2', 3, 'Obrigações Trabalhistas', 'Passivo', null, 'Sintetica', false, '2.1'],
            ['2.1.2.01', 4, 'Salários a Pagar', 'Passivo', null, 'Analitica', true, '2.1.2'],
            ['2.1.2.02', 4, 'INSS a Recolher', 'Passivo', null, 'Analitica', true, '2.1.2'],
            ['2.1.2.03', 4, 'FGTS a Recolher', 'Passivo', null, 'Analitica', true, '2.1.2'],
            ['2.1.2.04', 4, 'IRRF a Recolher', 'Passivo', null, 'Analitica', true, '2.1.2'],
            ['2.1.3', 3, 'Obrigações Tributárias', 'Passivo', null, 'Sintetica', false, '2.1'],
            ['2.1.3.01', 4, 'ICMS a Recolher', 'Passivo', null, 'Analitica', true, '2.1.3'],
            ['2.1.3.02', 4, 'PIS a Recolher', 'Passivo', null, 'Analitica', true, '2.1.3'],
            ['2.1.3.03', 4, 'COFINS a Recolher', 'Passivo', null, 'Analitica', true, '2.1.3'],
            ['2.1.3.04', 4, 'ISS a Recolher', 'Passivo', null, 'Analitica', true, '2.1.3'],
            // RECEITA
            ['3', 1, 'Receita', 'Receita', null, 'Sintetica', false, null],
            ['3.1', 2, 'Receita Bruta', 'Receita', null, 'Sintetica', false, '3'],
            ['3.1.1', 3, 'Vendas de Produtos', 'Receita', null, 'Analitica', true, '3.1'],
            ['3.1.2', 3, 'Prestação de Serviços', 'Receita', null, 'Analitica', true, '3.1'],
            // CUSTO
            ['4', 1, 'Custo', 'Custo', null, 'Sintetica', false, null],
            ['4.1', 2, 'Custo das Mercadorias Vendidas', 'Custo', null, 'Analitica', true, '4'],
            ['4.2', 2, 'Custo dos Serviços Prestados', 'Custo', null, 'Analitica', true, '4'],
            // DESPESA
            ['5', 1, 'Despesa', 'Despesa', null, 'Sintetica', false, null],
            ['5.1', 2, 'Despesas Administrativas', 'Despesa', null, 'Sintetica', false, '5'],
            ['5.1.1', 3, 'Salários', 'Despesa', 'Fixa', 'Analitica', true, '5.1'],
            ['5.1.2', 3, 'Encargos Sociais', 'Despesa', 'Fixa', 'Analitica', true, '5.1'],
            ['5.1.3', 3, 'Aluguéis', 'Despesa', 'Fixa', 'Analitica', true, '5.1'],
            ['5.1.4', 3, 'Energia Elétrica', 'Despesa', 'Fixa', 'Analitica', true, '5.1'],
            ['5.1.5', 3, 'Telefone/Internet', 'Despesa', 'Fixa', 'Analitica', true, '5.1'],
            ['5.1.6', 3, 'Material de Escritório', 'Despesa', 'Variável', 'Analitica', true, '5.1'],
            ['5.2', 2, 'Despesas Comerciais', 'Despesa', null, 'Sintetica', false, '5'],
            ['5.2.1', 3, 'Comissões', 'Despesa', 'Variável', 'Analitica', true, '5.2'],
            ['5.2.2', 3, 'Fretes e Carretos', 'Despesa', 'Variável', 'Analitica', true, '5.2'],
            // RESULTADO FINANCEIRO
            ['6', 1, 'Resultado Financeiro', 'Resultado Financeiro', null, 'Sintetica', false, null],
            ['6.1', 2, 'Receitas Financeiras', 'Resultado Financeiro', null, 'Analitica', true, '6'],
            ['6.2', 2, 'Despesas Financeiras', 'Resultado Financeiro', null, 'Analitica', true, '6'],
        ];

        $mapaCodigoId = [];

        foreach ($contas as [$codigo, $nivel, $descricao, $tipo, $subtipo, $natureza, $aceita, $paiCodigo]) {
            $plano = PlanoConta::create([
                'id_empresa' => $empresaId,
                'codigo' => $codigo,
                'nivel' => $nivel,
                'descricao' => $descricao,
                'tipo' => $tipo,
                'subtipo' => $subtipo,
                'natureza' => $natureza,
                'aceita_lancamento' => $aceita,
                'id_conta_pai' => $paiCodigo ? ($mapaCodigoId[$paiCodigo] ?? null) : null,
                'conta_referencial' => null,
                'id_plano_contas_origem' => null,
                'ativo' => true,
            ]);

            $mapaCodigoId[$codigo] = $plano->id;
        }
    }
}
