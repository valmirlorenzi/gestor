<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CstSeeder extends Seeder
{
    public function run(): void
    {
        $csts = [
            // ICMS
            ['ICMS', '00', 'Tributada integralmente'],
            ['ICMS', '10', 'Tributada e com cobrança do ICMS por substituição tributária'],
            ['ICMS', '20', 'Com redução de base de cálculo'],
            ['ICMS', '30', 'Isenta ou não tributada e com cobrança do ICMS por substituição tributária'],
            ['ICMS', '40', 'Isenta'],
            ['ICMS', '41', 'Não tributada'],
            ['ICMS', '50', 'Suspensão'],
            ['ICMS', '51', 'Diferimento'],
            ['ICMS', '60', 'ICMS cobrado anteriormente por substituição tributária'],
            ['ICMS', '70', 'Com redução de base de cálculo e cobrança do ICMS por substituição tributária'],
            ['ICMS', '90', 'Outros'],

            // IPI
            ['IPI', '00', 'Entrada com recuperação de crédito'],
            ['IPI', '01', 'Entrada tributada com alíquota zero'],
            ['IPI', '02', 'Entrada isenta'],
            ['IPI', '03', 'Entrada não-tributada'],
            ['IPI', '04', 'Entrada imune'],
            ['IPI', '05', 'Entrada com suspensão'],
            ['IPI', '49', 'Outras entradas'],
            ['IPI', '50', 'Saída tributada'],
            ['IPI', '51', 'Saída tributada com alíquota zero'],
            ['IPI', '52', 'Saída isenta'],
            ['IPI', '53', 'Saída não-tributada'],
            ['IPI', '54', 'Saída imune'],
            ['IPI', '55', 'Saída com suspensão'],
            ['IPI', '99', 'Outras saídas'],

            // PIS
            ['PIS', '01', 'Operação tributável com alíquota básica'],
            ['PIS', '02', 'Operação tributável com alíquota diferenciada'],
            ['PIS', '03', 'Operação tributável com alíquota por unidade de medida de produto'],
            ['PIS', '04', 'Operação tributável monofásica - revenda a alíquota zero'],
            ['PIS', '05', 'Operação tributável por substituição tributária'],
            ['PIS', '06', 'Operação tributável a alíquota zero'],
            ['PIS', '07', 'Operação isenta da contribuição'],
            ['PIS', '08', 'Operação sem incidência da contribuição'],
            ['PIS', '09', 'Operação com suspensão da contribuição'],
            ['PIS', '49', 'Outras operações de saída'],
            ['PIS', '50', 'Operação com direito a crédito - vinculada exclusivamente a receita tributada no mercado interno'],
            ['PIS', '51', 'Operação com direito a crédito - vinculada exclusivamente a receita não tributada no mercado interno'],
            ['PIS', '52', 'Operação com direito a crédito - vinculada exclusivamente a receita de exportação'],
            ['PIS', '53', 'Operação com direito a crédito - vinculada a receitas mistas'],
            ['PIS', '54', 'Operação com direito a crédito - vinculada a receitas tributadas e não tributadas'],
            ['PIS', '55', 'Operação com direito a crédito - vinculada a receita de exportação e não tributada no mercado interno'],
            ['PIS', '56', 'Operação com direito a crédito - vinculada a receita de exportação e tributada no mercado interno'],
            ['PIS', '60', 'Crédito presumido - operação de aquisição vinculada exclusivamente a receita tributada no mercado interno'],
            ['PIS', '61', 'Crédito presumido - operação de aquisição vinculada exclusivamente a receita não tributada no mercado interno'],
            ['PIS', '62', 'Crédito presumido - operação de aquisição vinculada exclusivamente a receita de exportação'],
            ['PIS', '63', 'Crédito presumido - operação de aquisição vinculada a receitas mistas'],
            ['PIS', '64', 'Crédito presumido - operação de aquisição vinculada a receitas tributadas e não tributadas'],
            ['PIS', '65', 'Crédito presumido - operação de aquisição vinculada a receita de exportação e não tributada no mercado interno'],
            ['PIS', '66', 'Crédito presumido - operação de aquisição vinculada a receita de exportação e tributada no mercado interno'],
            ['PIS', '67', 'Crédito presumido - outras operações'],
            ['PIS', '70', 'Operação de aquisição sem direito a crédito'],
            ['PIS', '71', 'Operação de aquisição isenta da contribuição'],
            ['PIS', '72', 'Operação de aquisição sem incidência da contribuição'],
            ['PIS', '73', 'Operação de aquisição com suspensão da contribuição'],
            ['PIS', '74', 'Operação de aquisição a alíquota zero'],
            ['PIS', '75', 'Operação de aquisição por substituição tributária'],
            ['PIS', '98', 'Outras operações de entrada'],
            ['PIS', '99', 'Outras operações'],

            // COFINS
            ['COFINS', '01', 'Operação tributável com alíquota básica'],
            ['COFINS', '02', 'Operação tributável com alíquota diferenciada'],
            ['COFINS', '03', 'Operação tributável com alíquota por unidade de medida de produto'],
            ['COFINS', '04', 'Operação tributável monofásica - revenda a alíquota zero'],
            ['COFINS', '05', 'Operação tributável por substituição tributária'],
            ['COFINS', '06', 'Operação tributável a alíquota zero'],
            ['COFINS', '07', 'Operação isenta da contribuição'],
            ['COFINS', '08', 'Operação sem incidência da contribuição'],
            ['COFINS', '09', 'Operação com suspensão da contribuição'],
            ['COFINS', '49', 'Outras operações de saída'],
            ['COFINS', '50', 'Operação com direito a crédito - vinculada exclusivamente a receita tributada no mercado interno'],
            ['COFINS', '51', 'Operação com direito a crédito - vinculada exclusivamente a receita não tributada no mercado interno'],
            ['COFINS', '52', 'Operação com direito a crédito - vinculada exclusivamente a receita de exportação'],
            ['COFINS', '53', 'Operação com direito a crédito - vinculada a receitas mistas'],
            ['COFINS', '54', 'Operação com direito a crédito - vinculada a receitas tributadas e não tributadas'],
            ['COFINS', '55', 'Operação com direito a crédito - vinculada a receita de exportação e não tributada no mercado interno'],
            ['COFINS', '56', 'Operação com direito a crédito - vinculada a receita de exportação e tributada no mercado interno'],
            ['COFINS', '60', 'Crédito presumido - operação de aquisição vinculada exclusivamente a receita tributada no mercado interno'],
            ['COFINS', '61', 'Crédito presumido - operação de aquisição vinculada exclusivamente a receita não tributada no mercado interno'],
            ['COFINS', '62', 'Crédito presumido - operação de aquisição vinculada exclusivamente a receita de exportação'],
            ['COFINS', '63', 'Crédito presumido - operação de aquisição vinculada a receitas mistas'],
            ['COFINS', '64', 'Crédito presumido - operação de aquisição vinculada a receitas tributadas e não tributadas'],
            ['COFINS', '65', 'Crédito presumido - operação de aquisição vinculada a receita de exportação e não tributada no mercado interno'],
            ['COFINS', '66', 'Crédito presumido - operação de aquisição vinculada a receita de exportação e tributada no mercado interno'],
            ['COFINS', '67', 'Crédito presumido - outras operações'],
            ['COFINS', '70', 'Operação de aquisição sem direito a crédito'],
            ['COFINS', '71', 'Operação de aquisição isenta da contribuição'],
            ['COFINS', '72', 'Operação de aquisição sem incidência da contribuição'],
            ['COFINS', '73', 'Operação de aquisição com suspensão da contribuição'],
            ['COFINS', '74', 'Operação de aquisição a alíquota zero'],
            ['COFINS', '75', 'Operação de aquisição por substituição tributária'],
            ['COFINS', '98', 'Outras operações de entrada'],
            ['COFINS', '99', 'Outras operações'],

            // IBS/CBS (LC 214/2025)
            ['IBS/CBS', '000', 'Tributação Integral'],
            ['IBS/CBS', '200', 'Alíquota Reduzida (inclusive zero)'],
            ['IBS/CBS', '400', 'Isenção'],
            ['IBS/CBS', '410', 'Imunidade e Não Incidência'],
            ['IBS/CBS', '510', 'Diferimento'],
            ['IBS/CBS', '550', 'Suspensão'],
            ['IBS/CBS', '620', 'Tributação Monofásica'],
            ['IBS/CBS', '800', 'Transferência de Crédito'],
            ['IBS/CBS', '810', 'Ajustes'],
            ['IBS/CBS', '900', 'Outros'],
        ];

        foreach ($csts as [$tipo, $codigo, $descricao]) {
            DB::table('csts')->updateOrInsert(
                ['tipo_imposto' => $tipo, 'codigo' => $codigo],
                ['descricao' => $descricao]
            );
        }

        $this->command->info('CSTs importados: '.count($csts));
    }
}
