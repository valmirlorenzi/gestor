<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('notas_fiscais_impostos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_nota_fiscal_item')->constrained('notas_fiscais_itens')->cascadeOnDelete()->cascadeOnUpdate();
            $table->string('tipo_imposto', 20);
            $table->foreignId('id_cst')->nullable()->constrained('csts')->cascadeOnUpdate();
            $table->decimal('base_calculo', 15, 2)->default(0);
            $table->decimal('aliquota', 7, 4)->default(0);
            $table->decimal('valor', 15, 2)->default(0);
            $table->decimal('valor_st', 15, 2)->default(0);
            $table->json('dados_extras')->nullable();

            $table->timestamps();

            $table->index('id_nota_fiscal_item');
            $table->index('tipo_imposto');
            $table->index('id_cst');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notas_fiscais_impostos');
    }
};
