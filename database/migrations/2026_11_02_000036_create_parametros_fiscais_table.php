<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('parametros_fiscais', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('id_empresa')->nullable();
            $table->string('tipo_imposto', 20);
            $table->string('descricao', 100);
            $table->decimal('aliquota', 7, 4);
            $table->string('base_calculo', 50)->nullable();
            $table->date('data_inicio_validade');
            $table->date('data_fim_validade')->nullable();
            $table->json('dados_extras')->nullable();

            $table->timestamps();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();

            $table->foreign('id_empresa', 'fk_param_fiscais_empresa')
                ->references('id')->on('empresas')->cascadeOnUpdate();

            $table->index('id_empresa', 'idx_param_fiscais_empresa');
            $table->index('tipo_imposto', 'idx_param_fiscais_tipo');
            $table->index(['data_inicio_validade', 'data_fim_validade'], 'idx_param_fiscais_vigencia');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('parametros_fiscais');
    }
};
