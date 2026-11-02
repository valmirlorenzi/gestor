<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tabelas_encargos', function (Blueprint $table) {
            $table->id();
            $table->string('descricao', 100);
            $table->decimal('aliquota', 7, 4);
            $table->date('data_inicio_validade');
            $table->date('data_fim_validade')->nullable();
            $table->json('dados_extras')->nullable();

            $table->timestamps();

            $table->index(['data_inicio_validade', 'data_fim_validade'], 'idx_tabelas_encargos_vigencia');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tabelas_encargos');
    }
};