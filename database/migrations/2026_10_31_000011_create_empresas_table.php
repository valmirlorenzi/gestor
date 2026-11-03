<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('empresas', function (Blueprint $table) {
            $table->id();
            $table->char('cnpj', 14)->unique();
            $table->string('razao_social', 200);
            $table->string('nome_fantasia', 200)->nullable();
            $table->string('regime_fiscal', 20);
            $table->string('setor', 20);
            $table->date('data_inicio');
            $table->unsignedBigInteger('id_filial_matriz')->nullable();
            $table->unsignedBigInteger('id_plano_contas_sugerido')->nullable();
            $table->string('metodo_custo', 20)->default('XML');
            $table->json('dados_extras')->nullable();
            $table->timestamps();
            $table->softDeletes();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->unsignedBigInteger('deleted_by')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('empresas');
    }
};
