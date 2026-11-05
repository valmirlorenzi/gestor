<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ativos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_filial')->constrained('filiais')->cascadeOnUpdate();
            $table->string('descricao', 200);
            $table->date('data_aquisicao');
            $table->decimal('valor_original', 15, 2);
            $table->decimal('valor_residual', 15, 2)->default(0);
            $table->integer('vida_util_meses');
            $table->string('metodo_depreciacao', 20)->default('Linear');
            $table->char('mes_inicial_depreciacao', 7);
            $table->foreignId('id_centro_custo')->nullable()->constrained('centros_custo')->cascadeOnUpdate();
            $table->string('destino', 10);
            $table->string('status', 20)->default('Em uso');
            $table->boolean('ativo')->default(true);
            $table->json('dados_extras')->nullable();

            $table->timestamps();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->softDeletes();
            $table->unsignedBigInteger('deleted_by')->nullable();

            $table->index('id_filial');
            $table->index('id_centro_custo');
            $table->index('deleted_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ativos');
    }
};
