<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class BancoSeeder extends Seeder
{
    public function run(): void
    {
        $bancos = [
            ['001', 'Banco do Brasil S.A.'],
            ['003', 'Banco da Amazônia S.A.'],
            ['004', 'Banco do Nordeste do Brasil S.A.'],
            ['021', 'Banestes S.A. - Banco do Estado do Espírito Santo'],
            ['033', 'Banco Santander (Brasil) S.A.'],
            ['036', 'Banco Bradesco BBI S.A.'],
            ['037', 'Banco do Estado do Pará S.A. - Banpará'],
            ['041', 'Banrisul - Banco do Estado do Rio Grande do Sul S.A.'],
            ['047', 'Banco do Estado de Sergipe S.A. - Banese'],
            ['070', 'BRB - Banco de Brasília S.A.'],
            ['077', 'Banco Inter S.A.'],
            ['084', 'Uniprime Norte do Paraná - Cooperativa de Crédito'],
            ['085', 'Cooperativa Central de Crédito - Ailos'],
            ['097', 'Cooperativa Central de Crédito Noroeste Brasileiro'],
            ['104', 'Caixa Econômica Federal'],
            ['136', 'Cooperativa Central de Crédito de Minas Gerais - Cecred'],
            ['197', 'Stone Instituição de Pagamento S.A.'],
            ['208', 'Banco BTG Pactual S.A.'],
            ['212', 'Banco Original S.A.'],
            ['218', 'Banco BS2 S.A.'],
            ['237', 'Banco Bradesco S.A.'],
            ['246', 'Banco ABC Brasil S.A.'],
            ['260', 'Nu Pagamentos S.A. - Nubank'],
            ['290', 'PagSeguro Internet Instituição de Pagamento S.A.'],
            ['318', 'Banco BMG S.A.'],
            ['323', 'Mercado Pago Instituição de Pagamento Ltda.'],
            ['336', 'Banco C6 S.A.'],
            ['341', 'Itaú Unibanco S.A.'],
            ['356', 'Banco Real S.A.'],
            ['380', 'PicPay Serviços S.A.'],
            ['389', 'Banco Mercantil do Brasil S.A.'],
            ['399', 'HSBC Bank Brasil S.A. - Banco Múltiplo'],
            ['422', 'Banco Safra S.A.'],
            ['453', 'Banco Rural S.A.'],
            ['633', 'Banco Rendimento S.A.'],
            ['637', 'Banco Sofisa S.A.'],
            ['652', 'Itaú Unibanco Holding S.A.'],
            ['655', 'Banco Votorantim S.A.'],
            ['707', 'Banco Daycoval S.A.'],
            ['745', 'Banco Citibank S.A.'],
            ['748', 'Sicredi - Sistema de Crédito Cooperativo'],
            ['751', 'Scotiabank Brasil S.A. - Banco Múltiplo'],
            ['756', 'Sicoob - Sistema de Cooperativas de Crédito do Brasil'],
        ];

        foreach ($bancos as [$codigo, $nome]) {
            DB::table('bancos')->updateOrInsert(
                ['codigo' => $codigo],
                ['nome' => $nome]
            );
        }

        $this->command->info('Bancos importados: '.count($bancos));
    }
}
