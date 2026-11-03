<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('planos_contas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_empresa')->constrained('empresas')->cascadeOnUpdate();
            $table->string('codigo', 20);
            $table->integer('nivel');
            $table->string('descricao', 200);
            $table->string('tipo', 20); // Ativo, Passivo, Custo, Despesa, Receita, Resultado Financeiro
            $table->string('subtipo', 30)->nullable(); // Fixo, Variavel, Operacional, Nao Operacional
            $table->string('natureza', 10); // Sintetica, Analitica
            $table->boolean('aceita_lancamento')->default(false);
            $table->foreignId('id_conta_pai')->nullable()->constrained('planos_contas')->cascadeOnUpdate();
            $table->string('conta_referencial', 20)->nullable();
            $table->foreignId('id_plano_contas_origem')->nullable()->constrained('planos_contas')->cascadeOnUpdate();
            $table->boolean('ativo')->default(true);
            $table->json('dados_extras')->nullable();
            $table->timestamps();
            $table->softDeletes();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->unsignedBigInteger('deleted_by')->nullable();

            $table->unique(['id_empresa', 'codigo']);
            $table->index('id_empresa');
            $table->index('id_conta_pai');
            $table->index('id_plano_contas_origem');
            $table->index('deleted_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('planos_contas');
    }
};
