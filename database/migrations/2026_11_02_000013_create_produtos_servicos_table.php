<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('produtos_servicos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_empresa')->constrained('empresas')->cascadeOnUpdate();
            $table->char('tipo', 1); // P (produto), S (serviço)
            $table->string('codigo_interno', 50)->nullable();
            $table->string('descricao', 300);
            $table->boolean('ativo')->default(true);
            $table->json('dados_extras')->nullable();
            $table->timestamps();
            $table->softDeletes();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->unsignedBigInteger('deleted_by')->nullable();

            $table->index('id_empresa');
            $table->index('tipo');
            $table->index('deleted_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('produtos_servicos');
    }
};
