<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('usuarios_atores', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('id_usuario');
            $table->unsignedBigInteger('id_filial');
            $table->unsignedBigInteger('id_ator_funcional');
            $table->boolean('ativo')->default(true);

            $table->foreign('id_usuario', 'fk_usuarios_atores_usuario')
                ->references('id')->on('usuarios')
                ->cascadeOnDelete()->cascadeOnUpdate();
            $table->foreign('id_filial', 'fk_usuarios_atores_filial')
                ->references('id')->on('filiais')
                ->cascadeOnDelete()->cascadeOnUpdate();
            $table->foreign('id_ator_funcional', 'fk_usuarios_atores_ator')
                ->references('id')->on('atores_funcionais')
                ->cascadeOnUpdate();

            $table->unique(
                ['id_usuario', 'id_filial', 'id_ator_funcional'],
                'uk_usuarios_atores'
            );
            $table->index('id_filial', 'idx_usuarios_atores_filial');
            $table->index('id_ator_funcional', 'idx_usuarios_atores_ator');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('usuarios_atores');
    }
};
