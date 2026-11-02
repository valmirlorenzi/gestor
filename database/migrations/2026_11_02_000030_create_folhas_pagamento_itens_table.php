<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('folhas_pagamento_itens', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_folha_pagamento')->constrained('folhas_pagamento')->cascadeOnDelete()->cascadeOnUpdate();
            $table->foreignId('id_funcionario')->constrained('funcionarios')->cascadeOnUpdate();
            $table->decimal('salario_base', 15, 2)->default(0);
            $table->decimal('total_proventos', 15, 2)->default(0);
            $table->decimal('total_descontos', 15, 2)->default(0);
            $table->decimal('base_inss', 15, 2)->default(0);
            $table->decimal('base_fgts', 15, 2)->default(0);
            $table->decimal('base_irrf', 15, 2)->default(0);
            $table->decimal('valor_inss_empregado', 15, 2)->default(0);
            $table->decimal('valor_inss_patronal', 15, 2)->default(0);
            $table->decimal('valor_fgts', 15, 2)->default(0);
            $table->decimal('valor_irrf', 15, 2)->default(0);
            $table->decimal('valor_rat', 15, 2)->default(0);
            $table->decimal('valor_terceiros', 15, 2)->default(0);
            $table->decimal('valor_liquido', 15, 2)->default(0);
            $table->json('dados_extras')->nullable();

            $table->timestamps();

            $table->index('id_folha_pagamento');
            $table->index('id_funcionario');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('folhas_pagamento_itens');
    }
};