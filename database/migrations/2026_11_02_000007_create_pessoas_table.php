<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pessoas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_empresa')->constrained('empresas')->cascadeOnUpdate();
            $table->char('tipo', 2); // PF, PJ
            $table->string('documento', 14); // CPF ou CNPJ
            $table->string('nome', 200);
            $table->string('email', 200)->nullable();
            $table->string('telefone', 20)->nullable();
            $table->boolean('ativo')->default(true);
            $table->json('dados_extras')->nullable();
            $table->timestamps();
            $table->softDeletes();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->unsignedBigInteger('deleted_by')->nullable();

            $table->unique(['id_empresa', 'documento']);
            $table->index('id_empresa');
            $table->index('deleted_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pessoas');
    }
};