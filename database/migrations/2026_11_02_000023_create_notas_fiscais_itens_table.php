<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('notas_fiscais_itens', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_nota_fiscal')->constrained('notas_fiscais')->cascadeOnDelete()->cascadeOnUpdate();
            $table->integer('numero_item');
            $table->foreignId('id_produto_servico')->nullable()->constrained('produtos_servicos')->cascadeOnUpdate();
            $table->string('descricao', 300);
            $table->foreignId('id_cfop')->nullable()->constrained('cfops')->cascadeOnUpdate();
            $table->foreignId('id_ncm')->nullable()->constrained('ncms')->cascadeOnUpdate();
            $table->foreignId('id_servico_lc116')->nullable()->constrained('servicos_lc116')->cascadeOnUpdate();
            $table->decimal('quantidade', 15, 4)->default(0);
            $table->decimal('valor_unitario', 15, 4)->default(0);
            $table->decimal('custo_unitario', 15, 4)->default(0);
            $table->decimal('valor_total', 15, 2)->default(0);
            $table->decimal('valor_desconto', 15, 2)->default(0);
            $table->decimal('valor_frete', 15, 2)->default(0);
            $table->decimal('valor_seguro', 15, 2)->default(0);
            $table->decimal('outras_despesas', 15, 2)->default(0);
            $table->json('dados_extras')->nullable();

            $table->timestamps();

            $table->index('id_nota_fiscal');
            $table->index('id_produto_servico');
            $table->index('id_cfop');
            $table->index('id_ncm');
            $table->index('id_servico_lc116');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notas_fiscais_itens');
    }
};
