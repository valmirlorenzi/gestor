<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('menus_itens_atores', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('id_menu_item');
            $table->unsignedBigInteger('id_ator_funcional');

            $table->foreign('id_menu_item', 'fk_menus_itens_atores_item')
                ->references('id')->on('menus_itens')
                ->cascadeOnDelete()->cascadeOnUpdate();
            $table->foreign('id_ator_funcional', 'fk_menus_itens_atores_ator')
                ->references('id')->on('atores_funcionais')
                ->cascadeOnDelete()->cascadeOnUpdate();

            $table->unique(
                ['id_menu_item', 'id_ator_funcional'],
                'uk_menus_itens_atores'
            );
            $table->index('id_ator_funcional', 'idx_menus_itens_atores_ator');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('menus_itens_atores');
    }
};