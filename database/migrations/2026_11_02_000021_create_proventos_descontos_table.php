<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('proventos_descontos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_empresa')->constrained('empresas')->cascadeOnUpdate();
            $table->string('codigo', 10);
            $table->string('descricao', 100);
            $table->string('tipo', 10);
            $table->boolean('entra_inss')->default(false);
            $table->boolean('entra_fgts')->default(false);
            $table->boolean('entra_irrf')->default(false);
            $table->boolean('ativo')->default(true);
            $table->json('dados_extras')->nullable();

            $table->timestamps();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->softDeletes();
            $table->unsignedBigInteger('deleted_by')->nullable();

            $table->unique(['id_empresa', 'codigo']);
            $table->index('id_empresa');
            $table->index('deleted_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('proventos_descontos');
    }
};