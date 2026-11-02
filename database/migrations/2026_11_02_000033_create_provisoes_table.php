<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('provisoes', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('id_filial');
            $table->unsignedBigInteger('id_periodo');
            $table->unsignedBigInteger('id_funcionario');
            $table->string('tipo', 20);
            $table->decimal('valor_provisao', 15, 2);
            $table->decimal('valor_encargos', 15, 2)->default(0);
            $table->unsignedBigInteger('id_lancamento')->nullable();
            $table->json('dados_extras')->nullable();

            $table->timestamps();

            $table->foreign('id_filial', 'fk_provisoes_filial')
                ->references('id')->on('filiais')->cascadeOnUpdate();
            $table->foreign('id_periodo', 'fk_provisoes_periodo')
                ->references('id')->on('periodos')->cascadeOnUpdate();
            $table->foreign('id_funcionario', 'fk_provisoes_funcionario')
                ->references('id')->on('funcionarios')->cascadeOnUpdate();
            $table->foreign('id_lancamento', 'fk_provisoes_lancamento')
                ->references('id')->on('lancamentos')->cascadeOnUpdate();

            $table->index('id_filial', 'idx_provisoes_filial');
            $table->index('id_periodo', 'idx_provisoes_periodo');
            $table->index('id_funcionario', 'idx_provisoes_funcionario');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('provisoes');
    }
};