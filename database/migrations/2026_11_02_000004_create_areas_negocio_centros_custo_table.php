<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('areas_negocio_centros_custo', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_area_negocio')->constrained('areas_negocio')->cascadeOnDelete()->cascadeOnUpdate();
            $table->foreignId('id_centro_custo')->constrained('centros_custo')->cascadeOnDelete()->cascadeOnUpdate();

            $table->unique(['id_area_negocio', 'id_centro_custo'], 'uk_areas_negocio_centros_custo');
            $table->index('id_centro_custo');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('areas_negocio_centros_custo');
    }
};