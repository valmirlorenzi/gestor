<?php

namespace Database\Seeders;

use App\Models\FormaPagamento;
use App\Services\TenantContext;
use Illuminate\Database\Seeder;

class FormaPagamentoSeeder extends Seeder
{
    public function run(): void
    {
        app(TenantContext::class)->setId(1);

        $formas = [
            'Dinheiro',
            'PIX',
            'Cartão de Crédito',
            'Cartão de Débito',
            'Boleto Bancário',
            'Transferência Bancária',
            'Cheque',
        ];

        foreach ($formas as $descricao) {
            FormaPagamento::create([
                'id_empresa' => 1,
                'descricao' => $descricao,
                'ativo' => true,
            ]);
        }
    }
}
