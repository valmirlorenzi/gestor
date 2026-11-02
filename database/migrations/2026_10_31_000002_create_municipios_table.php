<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('municipios', function (Blueprint $table) {
            $table->id();
            $table->char('codigo_ibge', 7)->unique();
            $table->string('nome', 200);
            $table->foreignId('id_uf')->constrained('ufs')->cascadeOnUpdate();
            $table->decimal('aliquota_iss_padrao', 5, 2)->nullable();
            $table->json('dados_extras')->nullable();

            $table->index('id_uf');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('municipios');
    }
};