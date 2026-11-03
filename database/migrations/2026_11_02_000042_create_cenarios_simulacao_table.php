<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cenarios_simulacao', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('id_empresa');
            $table->string('nome', 200);
            $table->text('descricao')->nullable();
            $table->char('periodo_base', 7)->nullable();
            $table->string('escopo', 50)->nullable();
            $table->json('variaveis_ajustadas')->nullable();
            $table->json('resultados_persistidos')->nullable();
            $table->string('status', 20)->default('Salvo');
            $table->json('dados_extras')->nullable();

            $table->timestamps();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->softDeletes();
            $table->unsignedBigInteger('deleted_by')->nullable();

            $table->foreign('id_empresa', 'fk_cenarios_simulacao_empresa')
                ->references('id')->on('empresas')->cascadeOnUpdate();

            $table->index('id_empresa', 'idx_cenarios_simulacao_empresa');
            $table->index('deleted_at', 'idx_cenarios_simulacao_deleted_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cenarios_simulacao');
    }
};
