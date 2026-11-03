<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tarefas', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('id_filial');
            $table->string('tipo_ordem', 40);
            $table->unsignedBigInteger('id_documento');
            $table->string('tipo_documento', 20);
            $table->unsignedBigInteger('id_ator_origem');
            $table->unsignedBigInteger('id_ator_destino');
            $table->string('status', 20)->default('pendente');
            $table->boolean('urgente')->default(false);
            $table->dateTime('data_criacao')->nullable();
            $table->dateTime('data_conclusao')->nullable();
            $table->unsignedBigInteger('id_ordem_anterior')->nullable();
            $table->string('descricao_resumida', 200)->nullable();
            $table->integer('prioridade')->nullable();
            $table->json('dados_extras')->nullable();

            $table->timestamp('updated_at')->nullable();
            $table->softDeletes();
            $table->unsignedBigInteger('deleted_by')->nullable();

            $table->foreign('id_filial', 'fk_tarefas_filial')
                ->references('id')->on('filiais')->cascadeOnUpdate();
            $table->foreign('id_ator_origem', 'fk_tarefas_ator_origem')
                ->references('id')->on('atores_funcionais')->cascadeOnUpdate();
            $table->foreign('id_ator_destino', 'fk_tarefas_ator_destino')
                ->references('id')->on('atores_funcionais')->cascadeOnUpdate();
            $table->foreign('id_ordem_anterior', 'fk_tarefas_ordem_anterior')
                ->references('id')->on('tarefas')->cascadeOnUpdate();

            $table->index('id_filial', 'idx_tarefas_filial');
            $table->index(['id_ator_destino', 'status'], 'idx_tarefas_ator_destino_status');
            $table->index('id_ator_origem', 'idx_tarefas_ator_origem');
            $table->index('status', 'idx_tarefas_status');
            $table->index('urgente', 'idx_tarefas_urgente');
            $table->index('tipo_ordem', 'idx_tarefas_tipo_ordem');
            $table->index('data_criacao', 'idx_tarefas_data_criacao');
            $table->index('deleted_at', 'idx_tarefas_deleted_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tarefas');
    }
};
