<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('lancamentos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_filial')->constrained('filiais')->cascadeOnUpdate();
            $table->foreignId('id_periodo')->constrained('periodos')->cascadeOnUpdate();
            $table->date('data_competencia');
            $table->date('data_emissao_documento')->nullable();
            $table->string('historico', 500);
            $table->decimal('valor', 15, 2);
            $table->foreignId('id_conta_debito')->constrained('planos_contas')->cascadeOnUpdate();
            $table->foreignId('id_conta_credito')->constrained('planos_contas')->cascadeOnUpdate();
            $table->foreignId('id_centro_custo')->nullable()->constrained('centros_custo')->cascadeOnUpdate();
            $table->foreignId('id_pessoa')->nullable()->constrained('pessoas')->cascadeOnUpdate();
            $table->foreignId('id_nota_fiscal')->nullable()->constrained('notas_fiscais')->cascadeOnUpdate();
            $table->foreignId('id_nota_fiscal_item')->nullable()->constrained('notas_fiscais_itens')->cascadeOnUpdate();
            $table->string('tipo_lancamento', 30);
            $table->string('status_classificacao', 30);
            $table->text('justificativa_classificacao')->nullable();
            $table->foreignId('id_lancamento_estorno')->nullable()->constrained('lancamentos')->cascadeOnUpdate();
            $table->json('dados_extras')->nullable();

            $table->timestamps();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->softDeletes();
            $table->unsignedBigInteger('deleted_by')->nullable();

            $table->index('id_filial');
            $table->index('id_periodo');
            $table->index('data_competencia');
            $table->index('id_conta_debito');
            $table->index('id_conta_credito');
            $table->index('id_centro_custo');
            $table->index('id_pessoa');
            $table->index('id_nota_fiscal');
            $table->index('tipo_lancamento');
            $table->index('status_classificacao');
            $table->index('deleted_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('lancamentos');
    }
};