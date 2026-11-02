<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('notas_fiscais_vinculos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_nota_fiscal')->constrained('notas_fiscais')->cascadeOnDelete()->cascadeOnUpdate();
            $table->foreignId('id_nota_vinculada')->constrained('notas_fiscais')->cascadeOnDelete()->cascadeOnUpdate();
            $table->string('tipo_vinculo', 30);

            $table->unique(['id_nota_fiscal', 'id_nota_vinculada', 'tipo_vinculo'], 'uk_notas_fiscais_vinculos');
            $table->index('id_nota_vinculada');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notas_fiscais_vinculos');
    }
};