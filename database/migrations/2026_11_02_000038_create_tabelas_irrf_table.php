<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tabelas_irrf', function (Blueprint $table) {
            $table->id();
            $table->integer('faixa');
            $table->decimal('valor_inicial', 15, 2);
            $table->decimal('valor_final', 15, 2);
            $table->decimal('aliquota', 7, 4);
            $table->decimal('deducao', 15, 2)->default(0);
            $table->decimal('redutor', 15, 2)->default(0);
            $table->date('data_inicio_validade');
            $table->date('data_fim_validade')->nullable();
            $table->json('dados_extras')->nullable();

            $table->timestamps();

            $table->index('faixa', 'idx_tabelas_irrf_faixa');
            $table->index(['data_inicio_validade', 'data_fim_validade'], 'idx_tabelas_irrf_vigencia');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tabelas_irrf');
    }
};
