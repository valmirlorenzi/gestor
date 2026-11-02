<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('csts', function (Blueprint $table) {
            $table->id();
            $table->string('tipo_imposto', 20);
            $table->char('codigo', 3);
            $table->string('descricao', 200);

            $table->unique(['tipo_imposto', 'codigo']);
            $table->index('tipo_imposto');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('csts');
    }
};