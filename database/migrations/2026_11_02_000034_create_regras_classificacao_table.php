<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('regras_classificacao', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('id_empresa');
            $table->string('descricao', 200);
            $table->integer('prioridade');
            $table->unsignedBigInteger('id_tipo_documento')->nullable();
            $table->unsignedBigInteger('id_cfop')->nullable();
            $table->unsignedBigInteger('id_cst')->nullable();
            $table->unsignedBigInteger('id_ncm')->nullable();
            $table->unsignedBigInteger('id_servico_lc116')->nullable();
            $table->unsignedBigInteger('id_pessoa_fornecedor')->nullable();
            $table->string('categoria_fornecedor', 50)->nullable();
            $table->string('historico_palavra_chave', 100)->nullable();
            $table->unsignedBigInteger('id_conta_destino');
            $table->unsignedBigInteger('id_centro_custo_padrao')->nullable();
            $table->unsignedBigInteger('id_conta_contrapartida_padrao')->nullable();
            $table->string('origem', 20);
            $table->unsignedBigInteger('id_lancamento_origem')->nullable();
            $table->boolean('ativo')->default(true);
            $table->json('dados_extras')->nullable();

            $table->timestamps();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->softDeletes();
            $table->unsignedBigInteger('deleted_by')->nullable();

            $table->foreign('id_empresa', 'fk_regras_class_empresa')
                ->references('id')->on('empresas')->cascadeOnUpdate();
            $table->foreign('id_tipo_documento', 'fk_regras_class_tipo_doc')
                ->references('id')->on('tipos_documento')->cascadeOnUpdate();
            $table->foreign('id_cfop', 'fk_regras_class_cfop')
                ->references('id')->on('cfops')->cascadeOnUpdate();
            $table->foreign('id_cst', 'fk_regras_class_cst')
                ->references('id')->on('csts')->cascadeOnUpdate();
            $table->foreign('id_ncm', 'fk_regras_class_ncm')
                ->references('id')->on('ncms')->cascadeOnUpdate();
            $table->foreign('id_servico_lc116', 'fk_regras_class_lc116')
                ->references('id')->on('servicos_lc116')->cascadeOnUpdate();
            $table->foreign('id_pessoa_fornecedor', 'fk_regras_class_fornecedor')
                ->references('id')->on('pessoas')->cascadeOnUpdate();
            $table->foreign('id_conta_destino', 'fk_regras_class_conta_destino')
                ->references('id')->on('planos_contas')->cascadeOnUpdate();
            $table->foreign('id_centro_custo_padrao', 'fk_regras_class_centro_custo')
                ->references('id')->on('centros_custo')->cascadeOnUpdate();
            $table->foreign('id_conta_contrapartida_padrao', 'fk_regras_class_contrapartida')
                ->references('id')->on('planos_contas')->cascadeOnUpdate();
            $table->foreign('id_lancamento_origem', 'fk_regras_class_lanc_origem')
                ->references('id')->on('lancamentos')->cascadeOnUpdate();

            $table->index('id_empresa', 'idx_regras_class_empresa');
            $table->index('prioridade', 'idx_regras_class_prioridade');
            $table->index('id_tipo_documento', 'idx_regras_class_tipo_doc');
            $table->index('id_cfop', 'idx_regras_class_cfop');
            $table->index('id_cst', 'idx_regras_class_cst');
            $table->index('id_ncm', 'idx_regras_class_ncm');
            $table->index('id_servico_lc116', 'idx_regras_class_lc116');
            $table->index('id_pessoa_fornecedor', 'idx_regras_class_fornecedor');
            $table->index('id_conta_destino', 'idx_regras_class_conta_destino');
            $table->index('deleted_at', 'idx_regras_class_deleted_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('regras_classificacao');
    }
};
