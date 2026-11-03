<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('depreciacoes', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('id_filial');
            $table->unsignedBigInteger('id_periodo');
            $table->unsignedBigInteger('id_ativo');
            $table->decimal('valor_depreciacao', 15, 2);
            $table->decimal('depreciacao_acumulada', 15, 2);
            $table->decimal('valor_contabil_liquido', 15, 2);
            $table->unsignedBigInteger('id_lancamento')->nullable();
            $table->json('dados_extras')->nullable();

            $table->timestamps();

            $table->foreign('id_filial', 'fk_depreciacoes_filial')
                ->references('id')->on('filiais')->cascadeOnUpdate();
            $table->foreign('id_periodo', 'fk_depreciacoes_periodo')
                ->references('id')->on('periodos')->cascadeOnUpdate();
            $table->foreign('id_ativo', 'fk_depreciacoes_ativo')
                ->references('id')->on('ativos')->cascadeOnUpdate();
            $table->foreign('id_lancamento', 'fk_depreciacoes_lancamento')
                ->references('id')->on('lancamentos')->cascadeOnUpdate();

            $table->index('id_filial', 'idx_depreciacoes_filial');
            $table->index('id_periodo', 'idx_depreciacoes_periodo');
            $table->index('id_ativo', 'idx_depreciacoes_ativo');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('depreciacoes');
    }
};
