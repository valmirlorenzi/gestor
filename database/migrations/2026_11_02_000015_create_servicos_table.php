<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('servicos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_produto_servico')->unique()->constrained('produtos_servicos')->cascadeOnDelete()->cascadeOnUpdate();
            $table->foreignId('id_servico_lc116')->nullable()->constrained('servicos_lc116')->cascadeOnUpdate();
            $table->json('dados_extras')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('servicos');
    }
};
