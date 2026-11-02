<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('regras_classificacao_logs', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('id_regra_classificacao');
            $table->string('acao', 20);
            $table->unsignedBigInteger('id_usuario')->nullable();
            $table->text('justificativa')->nullable();
            $table->json('dados_anteriores')->nullable();
            $table->json('dados_novos')->nullable();

            $table->timestamp('created_at')->nullable();

            $table->foreign('id_regra_classificacao', 'fk_regras_class_log_regra')
                ->references('id')->on('regras_classificacao')
                ->cascadeOnDelete()->cascadeOnUpdate();
            $table->foreign('id_usuario', 'fk_regras_class_log_usuario')
                ->references('id')->on('usuarios')->cascadeOnUpdate();

            $table->index('id_regra_classificacao', 'idx_regras_class_log_regra');
            $table->index('id_usuario', 'idx_regras_class_log_usuario');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('regras_classificacao_logs');
    }
};