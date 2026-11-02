<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('usuarios_filiais', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('id_usuario');
            $table->unsignedBigInteger('id_filial');
            $table->string('perfil', 20)->nullable();

            $table->foreign('id_usuario', 'fk_usuarios_filiais_usuario')
                ->references('id')->on('usuarios')
                ->cascadeOnDelete()->cascadeOnUpdate();
            $table->foreign('id_filial', 'fk_usuarios_filiais_filial')
                ->references('id')->on('filiais')
                ->cascadeOnDelete()->cascadeOnUpdate();

            $table->unique(['id_usuario', 'id_filial'], 'uk_usuarios_filiais');
            $table->index('id_filial', 'idx_usuarios_filiais_filial');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('usuarios_filiais');
    }
};