<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pessoas_juridicas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_pessoa')->unique()->constrained('pessoas')->cascadeOnDelete()->cascadeOnUpdate();
            $table->string('nome_fantasia', 200)->nullable();
            $table->foreignId('id_municipio')->nullable()->constrained('municipios')->cascadeOnUpdate();
            $table->string('categoria_padrao', 50)->nullable();
            $table->integer('prazo_padrao_dias')->nullable();
            $table->json('dados_extras')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pessoas_juridicas');
    }
};