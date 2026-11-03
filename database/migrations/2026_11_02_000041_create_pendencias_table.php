<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pendencias', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('id_filial');
            $table->unsignedBigInteger('id_periodo');
            $table->string('categoria', 10);
            $table->string('tipo', 50);
            $table->string('descricao', 500);
            $table->unsignedBigInteger('id_referencia')->nullable();
            $table->string('tabela_referencia', 50)->nullable();
            $table->string('status', 20)->default('Aberta');
            $table->unsignedBigInteger('id_usuario_resolucao')->nullable();
            $table->dateTime('data_resolucao')->nullable();
            $table->text('justificativa')->nullable();
            $table->json('dados_extras')->nullable();

            $table->timestamps();

            $table->foreign('id_filial', 'fk_pendencias_filial')
                ->references('id')->on('filiais')->cascadeOnUpdate();
            $table->foreign('id_periodo', 'fk_pendencias_periodo')
                ->references('id')->on('periodos')->cascadeOnUpdate();
            $table->foreign('id_usuario_resolucao', 'fk_pendencias_usuario')
                ->references('id')->on('usuarios')->cascadeOnUpdate();

            $table->index('id_filial', 'idx_pendencias_filial');
            $table->index('id_periodo', 'idx_pendencias_periodo');
            $table->index('categoria', 'idx_pendencias_categoria');
            $table->index('status', 'idx_pendencias_status');
            $table->index(['tabela_referencia', 'id_referencia'], 'idx_pendencias_referencia');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pendencias');
    }
};
