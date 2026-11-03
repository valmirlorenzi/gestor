<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pessoas_tags', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_pessoa')->constrained('pessoas')->cascadeOnDelete()->cascadeOnUpdate();
            $table->string('tag', 30); // Cliente, Fornecedor, Funcionario, Comissionado, Autonomo, Transportadora

            $table->unique(['id_pessoa', 'tag']);
            $table->index('tag');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pessoas_tags');
    }
};
