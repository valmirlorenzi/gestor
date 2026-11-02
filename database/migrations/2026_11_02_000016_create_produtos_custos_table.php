<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('produtos_custos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_produto_servico')->constrained('produtos_servicos')->cascadeOnUpdate();
            $table->foreignId('id_filial')->constrained('filiais')->cascadeOnUpdate();
            $table->date('data_referencia');
            $table->decimal('custo_medio', 15, 4)->default(0);
            $table->json('dados_extras')->nullable();
            $table->timestamps();

            $table->index('id_produto_servico');
            $table->index('id_filial');
            $table->index('data_referencia');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('produtos_custos');
    }
};