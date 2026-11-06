<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('prazos_padrao', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_empresa')->constrained('empresas')->cascadeOnUpdate();
            $table->string('descricao', 100);
            $table->integer('dias')->default(0);
            $table->integer('parcelas')->default(1);
            $table->string('tipo', 10); // compra | venda
            $table->boolean('ativo')->default(true);
            $table->json('dados_extras')->nullable();

            $table->timestamps();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->softDeletes();
            $table->unsignedBigInteger('deleted_by')->nullable();

            $table->index('id_empresa');
            $table->index('tipo');
            $table->index('deleted_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('prazos_padrao');
    }
};
