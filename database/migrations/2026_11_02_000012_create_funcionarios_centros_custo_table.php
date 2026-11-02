<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('funcionarios_centros_custo', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_funcionario')->constrained('funcionarios')->cascadeOnDelete()->cascadeOnUpdate();
            $table->foreignId('id_centro_custo')->constrained('centros_custo')->cascadeOnDelete()->cascadeOnUpdate();
            $table->decimal('percentual', 5, 2);

            $table->unique(['id_funcionario', 'id_centro_custo']);
            $table->index('id_centro_custo');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('funcionarios_centros_custo');
    }
};