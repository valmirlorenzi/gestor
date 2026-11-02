<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('filiais', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_empresa')->constrained('empresas')->cascadeOnUpdate();
            $table->char('cnpj', 14)->unique();
            $table->string('razao_social', 200);
            $table->string('nome_fantasia', 200)->nullable();
            $table->string('inscricao_estadual', 20)->nullable();
            $table->string('inscricao_municipal', 20)->nullable();
            $table->foreignId('id_municipio')->nullable()->constrained('municipios')->cascadeOnUpdate();
            $table->string('endereco', 300)->nullable();
            $table->foreignId('id_cnae')->nullable()->constrained('cnaes')->cascadeOnUpdate();
            $table->date('data_inicio');
            $table->date('data_fim')->nullable();
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
        Schema::dropIfExists('filiais');
    }
};