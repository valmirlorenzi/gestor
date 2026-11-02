<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('condicoes_pagamento', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_empresa')->constrained('empresas')->cascadeOnUpdate();
            $table->string('descricao', 100);
            $table->integer('numero_parcelas')->default(1);
            $table->integer('intervalo_dias')->default(30);
            $table->boolean('ativo')->default(true);
            $table->json('dados_extras')->nullable();
            $table->timestamps();
            $table->softDeletes();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->unsignedBigInteger('deleted_by')->nullable();

            $table->index('id_empresa');
            $table->index('deleted_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('condicoes_pagamento');
    }
};