<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pessoas_fisicas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_pessoa')->unique()->constrained('pessoas')->cascadeOnDelete()->cascadeOnUpdate();
            $table->date('data_nascimento')->nullable();
            $table->json('dados_extras')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pessoas_fisicas');
    }
};