<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cfops', function (Blueprint $table) {
            $table->id();
            $table->char('codigo', 4)->unique();
            $table->string('descricao', 200);
            $table->char('natureza', 1);

            $table->index('natureza');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cfops');
    }
};