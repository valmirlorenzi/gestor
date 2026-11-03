<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('auditorias', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('id_usuario')->nullable();
            $table->string('acao', 50);
            $table->string('tabela', 50);
            $table->unsignedBigInteger('id_registro')->nullable();
            $table->json('dados_anteriores')->nullable();
            $table->json('dados_novos')->nullable();
            $table->text('justificativa')->nullable();
            $table->string('ip', 45)->nullable();

            $table->timestamp('created_at')->nullable();

            $table->foreign('id_usuario', 'fk_auditorias_usuario')
                ->references('id')->on('usuarios')->cascadeOnUpdate();

            $table->index('id_usuario', 'idx_auditorias_usuario');
            $table->index(['tabela', 'id_registro'], 'idx_auditorias_tabela_registro');
            $table->index('acao', 'idx_auditorias_acao');
            $table->index('created_at', 'idx_auditorias_created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('auditorias');
    }
};
