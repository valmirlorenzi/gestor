<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('razoes_impostos', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('id_filial');
            $table->unsignedBigInteger('id_periodo');
            $table->string('tipo_imposto', 20);
            $table->unsignedBigInteger('id_lancamento')->nullable();
            $table->string('natureza', 10);
            $table->decimal('valor', 15, 2);
            $table->unsignedBigInteger('id_pessoa')->nullable();
            $table->unsignedBigInteger('id_nota_fiscal')->nullable();
            $table->json('dados_extras')->nullable();

            $table->timestamps();

            $table->foreign('id_filial', 'fk_razoes_impostos_filial')
                ->references('id')->on('filiais')->cascadeOnUpdate();
            $table->foreign('id_periodo', 'fk_razoes_impostos_periodo')
                ->references('id')->on('periodos')->cascadeOnUpdate();
            $table->foreign('id_lancamento', 'fk_razoes_impostos_lancamento')
                ->references('id')->on('lancamentos')->cascadeOnUpdate();
            $table->foreign('id_pessoa', 'fk_razoes_impostos_pessoa')
                ->references('id')->on('pessoas')->cascadeOnUpdate();
            $table->foreign('id_nota_fiscal', 'fk_razoes_impostos_nota')
                ->references('id')->on('notas_fiscais')->cascadeOnUpdate();

            $table->index('id_filial', 'idx_razoes_impostos_filial');
            $table->index('id_periodo', 'idx_razoes_impostos_periodo');
            $table->index('tipo_imposto', 'idx_razoes_impostos_tipo');
            $table->index('id_lancamento', 'idx_razoes_impostos_lancamento');
            $table->index('natureza', 'idx_razoes_impostos_natureza');
            $table->index('id_pessoa', 'idx_razoes_impostos_pessoa');
            $table->index('id_nota_fiscal', 'idx_razoes_impostos_nota');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('razoes_impostos');
    }
};