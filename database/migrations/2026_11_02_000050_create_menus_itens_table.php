<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('menus_itens', function (Blueprint $table) {
            $table->id();
            $table->string('codigo', 10);
            $table->string('nome', 100);
            $table->string('rota', 200);
            $table->integer('fase')->default(1);
            $table->boolean('ativo')->default(true);
            $table->json('dados_extras')->nullable();

            $table->timestamps();

            $table->unique('codigo', 'uk_menus_itens_codigo');
            $table->index('fase', 'idx_menus_itens_fase');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('menus_itens');
    }
};
